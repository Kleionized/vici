/**
 * Clerk implementation of the same `AuthValue` contract the mock provides, so
 * the sign-in / sign-up screens work unchanged. Active only when a Clerk
 * publishable key is configured (see `./index.ts`).
 *
 * Sign-up, either way, ends on Clerk's emailed code: `signUpWithEmailCode`
 * (no password — the default) or `signUpWithPassword` creates the sign-up and
 * sends the code (returning `needsVerification`), then `verifyEmailCode`
 * completes it. The "VICI updates via email" answer rides along in the
 * sign-up's `unsafeMetadata` and lands on the user.
 *
 * Sign-in takes three roads:
 *  - an emailed code (`sendSignInCode` → `verifySignInCode`) — the default;
 *  - a password, with the emailed-code completions the dashboard may demand
 *    (device verification / email MFA), finished by `verifySignInCode`;
 *  - Apple / Google SSO via `signInWithSSO` (Clerk `useSSO`).
 * A forgotten password is reset with `reset_password_email_code`
 * (`startPasswordReset` → `completePasswordReset`), which signs in.
 *
 * Deleting the account: `prepareAccountDeletion` first refuses, before any
 * data is erased, when Clerk would refuse `user.delete()` anyway (self-deletion
 * switched off in the dashboard, or a second factor the app can't check).
 * Clerk treats deletion as a sensitive action and wants the
 * session reverified within its window, so `prepareAccountDeletion` starts a
 * first-factor verification (an emailed code, or the password where codes are
 * off), `confirmAccountDeletion` completes it, and `deleteAccount` calls
 * `user.delete()` and signs out.
 */

import { useSession, useSignIn, useSignUp, useSSO, useUser, useAuth as useClerkSDKAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useRef } from 'react';

import type { AccountCheck, AuthResult, AuthStepResult, AuthValue, SignUpOptions, SSOStrategy } from './mockAuth';

// Complete any pending OAuth browser session (no-op outside a redirect).
WebBrowser.maybeCompleteAuthSession();

type FactorLike = { strategy: string; emailAddressId?: string };

/** The email-code factor among a resource's supported first factors, if any. */
function emailCodeFactor(factors: readonly FactorLike[] | null | undefined): { emailAddressId: string } | null {
  const f = (factors ?? []).find((x) => x.strategy === 'email_code' && x.emailAddressId);
  return f?.emailAddressId ? { emailAddressId: f.emailAddressId } : null;
}

/** What Clerk wants stored on a new user: the email-updates answer, and when it was given. */
function signUpMetadata(options?: SignUpOptions) {
  return { emailUpdates: !!options?.emailUpdates, emailUpdatesAnsweredAt: new Date().toISOString() };
}

export function useClerkAuth(): AuthValue {
  const { isLoaded, isSignedIn, userId, signOut } = useClerkSDKAuth();
  const { user } = useUser();
  const { session } = useSession();
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();
  // Which factor stage the pending sign-in verification belongs to.
  const pendingStage = useRef<'first' | 'second' | null>(null);
  // How the pending account deletion is being confirmed.
  const deletionCheck = useRef<AccountCheck | null>(null);

  /** A sign-in needs an email second factor: send it and wait for `verifySignInCode`. */
  async function toSecondFactor(): Promise<AuthStepResult> {
    if (!signIn) return { ok: false, error: 'No sign-in in progress.' };
    const seconds = (signIn.supportedSecondFactors ?? []) as FactorLike[];
    if (seconds.some((f) => f.strategy === 'email_code')) {
      await signIn.prepareSecondFactor({ strategy: 'email_code' } as never);
      pendingStage.current = 'second';
      return { ok: false, needsVerification: true };
    }
    return { ok: false, error: 'This account has two-factor auth (authenticator app) enabled. Sign in on the web to manage it.' };
  }

  async function startSignUp(email: string, password: string | null, name: string | undefined, options?: SignUpOptions): Promise<AuthStepResult> {
    if (!signUpLoaded || !signUp) return { ok: false, error: 'Auth is still loading.' };
    try {
      const res = await signUp.create({
        emailAddress: email.trim(),
        ...(password ? { password } : {}),
        ...(name?.trim() ? { firstName: name.trim() } : {}),
        unsafeMetadata: signUpMetadata(options),
      });
      if (res.status === 'complete') {
        await setActiveSignUp({ session: res.createdSessionId });
        return { ok: true };
      }
      // Fields the instance requires that this sign-up didn't send can't be
      // supplied after the code, so stop before emailing one (deploy D410).
      const missing = (res.missingFields ?? []) as string[];
      if (!password && missing.includes('password')) {
        return { ok: false, error: 'This sign-up needs a password. Tap “Use password instead” and choose one.' };
      }
      if (missing.length) {
        return { ok: false, error: `Sign-up needs details the app doesn’t ask for (${missing.join(', ')}). Check your Clerk configuration.` };
      }
      // Clerk's email-code verification: send the code, then verifyEmailCode() completes it.
      await res.prepareEmailAddressVerification({ strategy: 'email_code' });
      return { ok: false, needsVerification: true };
    } catch (err) {
      return { ok: false, error: clerkErrorMessage(err) };
    }
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
          const factor = emailCodeFactor(res.supportedFirstFactors as FactorLike[] | null);
          if (factor) {
            await res.prepareFirstFactor({ strategy: 'email_code', emailAddressId: factor.emailAddressId });
            pendingStage.current = 'first';
            return { ok: false, needsVerification: true };
          }
        }
        if (res.status === 'needs_second_factor') return await toSecondFactor();
        return { ok: false, error: `Sign-in needs another step (${res.status ?? 'unknown'}). Check your Clerk configuration.` };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async sendSignInCode(email) {
      if (!signInLoaded || !signIn) return { ok: false, error: 'Auth is still loading.' };
      try {
        const res = await signIn.create({ identifier: email.trim() });
        const factor = emailCodeFactor(res.supportedFirstFactors as FactorLike[] | null);
        if (!factor) return { ok: false, error: 'Signing in with an emailed code isn’t available for this account. Use your password.' };
        await res.prepareFirstFactor({ strategy: 'email_code', emailAddressId: factor.emailAddressId });
        pendingStage.current = 'first';
        return { ok: true };
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
        if (res.status === 'needs_second_factor' && stage === 'first') {
          const next = await toSecondFactor();
          return next.needsVerification ? { ok: false, error: 'One more code is on its way — enter that one.' } : next;
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
          const factor = emailCodeFactor(signIn.supportedFirstFactors as FactorLike[] | null);
          if (!factor) return { ok: false, error: 'Could not re-send the code.' };
          await signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId: factor.emailAddressId });
        }
        return { ok: true };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async startPasswordReset(email) {
      if (!signInLoaded || !signIn) return { ok: false, error: 'Auth is still loading.' };
      try {
        // Creating the sign-in with this strategy emails the reset code.
        await signIn.create({ strategy: 'reset_password_email_code', identifier: email.trim() });
        pendingStage.current = null;
        return { ok: true };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async completePasswordReset(code, newPassword) {
      if (!signIn) return { ok: false, error: 'No password reset in progress.' };
      try {
        let res = await signIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code: code.trim(), password: newPassword });
        if (res.status === 'needs_new_password') res = await res.resetPassword({ password: newPassword, signOutOfOtherSessions: true });
        if (res.status === 'complete') {
          await setActiveSignIn({ session: res.createdSessionId });
          return { ok: true };
        }
        if (res.status === 'needs_second_factor') return await toSecondFactor();
        return { ok: false, error: 'That code didn’t reset the password. Try again.' };
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

    signUpWithPassword: (email, password, name, options) => startSignUp(email, password, name, options),

    signUpWithEmailCode: (email, name, options) => startSignUp(email, null, name, options),

    async verifyEmailCode(code) {
      if (!signUp) return { ok: false, error: 'No sign-up in progress.' };
      try {
        const res = await signUp.attemptEmailAddressVerification({ code: code.trim() });
        if (res.status === 'complete') {
          await setActiveSignUp({ session: res.createdSessionId });
          return { ok: true };
        }
        // The instance still demands a password at sign-up (dashboard setting):
        // say so rather than leaving a verified address in limbo.
        if (res.missingFields?.includes('password')) {
          return { ok: false, error: 'Your email is confirmed, but this sign-up also needs a password. Go back and choose “Use password instead”.' };
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

    async prepareAccountDeletion() {
      if (!session || !user) return { ok: false, error: 'You’re not signed in.' };
      // The data is erased before user.delete(), so refuse here, while nothing
      // has been touched, when Clerk is known to refuse that call (deploy D414).
      if (!user.deleteSelfEnabled) {
        return { ok: false, error: 'Accounts can’t be deleted from the app right now. Nothing has been erased. Contact support to delete your account.' };
      }
      if (user.twoFactorEnabled) {
        return {
          ok: false,
          error: 'Your account uses two-step verification, which the app can’t check yet. Nothing has been erased. Contact support to delete your account.',
        };
      }
      try {
        const v = await session.startVerification({ level: 'first_factor' });
        if (v.status === 'complete') {
          deletionCheck.current = null;
          return { ok: true };
        }
        if (v.status === 'needs_first_factor') {
          const factors = (v.supportedFirstFactors ?? []) as FactorLike[];
          const factor = emailCodeFactor(factors);
          if (factor) {
            await session.prepareFirstFactorVerification({ strategy: 'email_code', emailAddressId: factor.emailAddressId });
            deletionCheck.current = 'email_code';
            return { ok: true, check: 'email_code' };
          }
          if (factors.some((f) => f.strategy === 'password')) {
            deletionCheck.current = 'password';
            return { ok: true, check: 'password' };
          }
        }
        return { ok: false, error: 'VICI can’t confirm it’s you on this account from the app. Contact support to delete it.' };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async confirmAccountDeletion(secret) {
      if (!session || !deletionCheck.current) return { ok: false, error: 'Start the deletion again.' };
      try {
        const v =
          deletionCheck.current === 'password'
            ? await session.attemptFirstFactorVerification({ strategy: 'password', password: secret })
            : await session.attemptFirstFactorVerification({ strategy: 'email_code', code: secret.trim() });
        if (v.status === 'complete') {
          deletionCheck.current = null;
          return { ok: true };
        }
        return { ok: false, error: 'That didn’t confirm it’s you. Try again.' };
      } catch (err) {
        return { ok: false, error: clerkErrorMessage(err) };
      }
    },

    async deleteAccount(): Promise<AuthResult> {
      if (!user) return { ok: false, error: 'You’re not signed in.' };
      try {
        await user.delete();
      } catch (err) {
        if (isReverificationError(err)) {
          return { ok: false, error: 'Your account needs one more check to be deleted. Tap Delete account to confirm it’s you again.' };
        }
        return { ok: false, error: clerkErrorMessage(err) };
      }
      // Deleting the user ends its sessions; signing out clears what is cached here.
      try {
        await signOut();
      } catch {
        // already signed out
      }
      return { ok: true };
    },

    async signOut() {
      await signOut();
    },
  };
}

function isReverificationError(err: unknown): boolean {
  const e = err as { errors?: { code?: string }[] };
  return !!e?.errors?.some((x) => x.code === 'session_reverification_required');
}

function clerkErrorMessage(err: unknown): string {
  const e = err as { errors?: { message?: string }[]; message?: string };
  return e?.errors?.[0]?.message ?? e?.message ?? 'Something went wrong. Please try again.';
}
