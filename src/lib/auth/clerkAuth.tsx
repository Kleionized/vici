/**
 * Clerk implementation of the same `AuthValue` contract the mock provides, so
 * the sign-in / sign-up screens work unchanged. Active only when a Clerk
 * publishable key is configured (see `./index.ts`).
 *
 * Sign-up uses Clerk's email-code verification: `signUpWithPassword` creates the
 * account and sends a code (returning `needsVerification`), then
 * `verifyEmailCode` completes it. Sign-in is plain password.
 */

import { useSignIn, useSignUp, useUser, useAuth as useClerkSDKAuth } from '@clerk/clerk-expo';

import type { AuthValue } from './mockAuth';

export function useClerkAuth(): AuthValue {
  const { isLoaded, isSignedIn, userId, signOut } = useClerkSDKAuth();
  const { user } = useUser();
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();

  return {
    isLoaded: !!isLoaded,
    isSignedIn: !!isSignedIn,
    userId: userId ?? null,
    displayName: user?.fullName ?? user?.firstName ?? null,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    mode: 'clerk',

    async signInWithPassword(email, password) {
      if (!signInLoaded || !signIn) return { ok: false, error: 'Auth is still loading.' };
      try {
        const res = await signIn.create({ identifier: email.trim(), password });
        if (res.status === 'complete') {
          await setActiveSignIn({ session: res.createdSessionId });
          return { ok: true };
        }
        return { ok: false, error: 'Additional verification is required. Check your Clerk configuration.' };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async signUpWithPassword(email, password, name) {
      if (!signUpLoaded || !signUp) return { ok: false, error: 'Auth is still loading.' };
      try {
        const res = await signUp.create({
          emailAddress: email.trim(),
          password,
          ...(name?.trim() ? { firstName: name.trim() } : {}),
        });
        if (res.status === 'complete') {
          await setActiveSignUp({ session: res.createdSessionId });
          return { ok: true };
        }
        // Default Clerk flow: send an email code, then verifyEmailCode() completes it.
        await res.prepareEmailAddressVerification({ strategy: 'email_code' });
        return { ok: false, needsVerification: true };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async verifyEmailCode(code) {
      if (!signUp) return { ok: false, error: 'No sign-up in progress.' };
      try {
        const res = await signUp.attemptEmailAddressVerification({ code: code.trim() });
        if (res.status === 'complete') {
          await setActiveSignUp({ session: res.createdSessionId });
          return { ok: true };
        }
        return { ok: false, error: 'That code didn’t complete sign-up. Try again.' };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async resendEmailCode() {
      if (!signUp) return { ok: false, error: 'No sign-up in progress.' };
      try {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        return { ok: true };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async signOut() {
      await signOut();
    },
  };
}

function clerkErrorMessage(err: unknown): string {
  const e = err as { errors?: { message?: string }[]; message?: string };
  return e?.errors?.[0]?.message ?? e?.message ?? 'Something went wrong. Please try again.';
}
