/**
 * Clerk implementation of the same `AuthValue` contract the mock provides, so
 * the sign-in / sign-up screens work unchanged. Active only when a Clerk
 * publishable key is configured (see `./index.ts`).
 *
 * Sign-up uses Clerk's email-code verification: `signUpWithPassword` creates the
 * account and sends a code (returning `needsVerification`), then
 * `verifyEmailCode` completes it.
 *
 * Sign-in is password-first, with two completions the dashboard may demand:
 *  - an emailed code (device verification / email MFA) — surfaced as
 *    `needsVerification`, finished by `verifySignInCode`;
 *  - Apple / Google SSO via `signInWithSSO` (Clerk `useSSO`).
 */

import { useSignIn, useSignUp, useSSO, useUser, useAuth as useClerkSDKAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useRef } from 'react';

import type { AuthValue, SSOStrategy } from './mockAuth';

// Complete any pending OAuth browser session (no-op outside a redirect).
WebBrowser.maybeCompleteAuthSession();

type EmailCodeFactor = { strategy: 'email_code'; emailAddressId: string };

export function useClerkAuth(): AuthValue {
  const { isLoaded, isSignedIn, userId, signOut } = useClerkSDKAuth();
  const { user } = useUser();
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();
  // Which factor stage the pending sign-in verification belongs to.
  const pendingStage = useRef<'first' | 'second' | null>(null);

  function findEmailCodeFactor(): EmailCodeFactor | null {
    const factors = (signIn?.supportedFirstFactors ?? []) as { strategy: string; emailAddressId?: string }[];
    const f = factors.find((x) => x.strategy === 'email_code' && x.emailAddressId);
    return f ? ({ strategy: 'email_code', emailAddressId: f.emailAddressId! } as EmailCodeFactor) : null;
  }

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
        // The password was accepted but Clerk wants one more step. Handle the
        // emailed-code cases (device verification / email MFA) in-app.
        if (res.status === 'needs_first_factor') {
          const factor = findEmailCodeFactor();
          if (factor) {
            await signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId: factor.emailAddressId });
            pendingStage.current = 'first';
            return { ok: false, needsVerification: true };
          }
        }
        if (res.status === 'needs_second_factor') {
          const seconds = (signIn.supportedSecondFactors ?? []) as { strategy: string }[];
          if (seconds.some((f) => f.strategy === 'email_code')) {
            await signIn.prepareSecondFactor({ strategy: 'email_code' } as never);
            pendingStage.current = 'second';
            return { ok: false, needsVerification: true };
          }
          return { ok: false, error: 'This account has two-factor auth (authenticator app) enabled. Sign in on the web to manage it.' };
        }
        return { ok: false, error: `Sign-in needs another step (${res.status ?? 'unknown'}). Check your Clerk configuration.` };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async verifySignInCode(code) {
      if (!signIn) return { ok: false, error: 'No sign-in in progress.' };
      try {
        const stage = pendingStage.current ?? 'first';
        const res =
          stage === 'second'
            ? await signIn.attemptSecondFactor({ strategy: 'email_code', code: code.trim() } as never)
            : await signIn.attemptFirstFactor({ strategy: 'email_code', code: code.trim() });
        if (res.status === 'complete') {
          pendingStage.current = null;
          await setActiveSignIn({ session: res.createdSessionId });
          return { ok: true };
        }
        return { ok: false, error: 'That code didn’t complete sign-in. Try again.' };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async resendSignInCode() {
      if (!signIn) return { ok: false, error: 'No sign-in in progress.' };
      try {
        if (pendingStage.current === 'second') {
          await signIn.prepareSecondFactor({ strategy: 'email_code' } as never);
        } else {
          const factor = findEmailCodeFactor();
          if (!factor) return { ok: false, error: 'Could not re-send the code.' };
          await signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId: factor.emailAddressId });
        }
        return { ok: true };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async signInWithSSO(strategy: SSOStrategy) {
      try {
        const { createdSessionId, setActive } = await startSSOFlow({ strategy });
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          return { ok: true };
        }
        // The flow needs more steps (e.g. MFA on the SSO account) or was cancelled.
        return { ok: false, error: 'Sign-in wasn’t completed. Try again or use email.' };
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
