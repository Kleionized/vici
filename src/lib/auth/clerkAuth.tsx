/**
 * Clerk implementation of the same `AuthValue` contract the mock provides, so
 * the sign-in / sign-up screens work unchanged. Active only when a Clerk
 * publishable key is configured (see `./index.ts`).
 *
 * Password sign-in/up is implemented against Clerk's Expo hooks. NOTE: if the
 * Clerk instance requires email-code verification on sign-up, that adds a step
 * this adapter does not yet render — TODO(jerry): add a verification-code screen,
 * or disable email verification in the Clerk dashboard for password-only flows.
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
        return {
          ok: false,
          error: 'Email verification is required — add a verification step or disable it in Clerk.',
        };
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
