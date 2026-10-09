/**
 * Mock authentication — the DEFAULT auth path when no Clerk key is configured,
 * so the app is fully usable offline (build spec §9.5).
 *
 * ⚠️ DEV ONLY. This is NOT secure: "passwords" are stored locally in plain text
 * and there is no server. It exists purely to exercise the sign-in / sign-up /
 * auth-gate flows during development. Real auth is Clerk (see SETUP.md).
 *
 * The emailed-code flows (sign-up without a password, code sign-in, forgot
 * password, confirming an account deletion) run here too, so the boards can be
 * walked offline: no email is sent, and any 6-digit code is accepted.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { genId } from '@/lib/id';
import { getJSON, secureDelete, secureGet, secureSet, setJSON } from '@/lib/storage';

const SESSION_KEY = 'tideline.session.userId';
const USERS_KEY = 'tideline.mock.users';

interface MockUserRecord {
  userId: string;
  email: string;
  /** null: the account was made without one and signs in with an emailed code */
  password: string | null;
  displayName?: string;
  /** the sign-up's "VICI updates via email" answer (Clerk keeps it in unsafeMetadata) */
  emailUpdates?: boolean;
}

export type SSOStrategy = 'oauth_apple' | 'oauth_google';

export type AuthResult = { ok: boolean; error?: string };
/** `needsVerification`: an emailed code was sent; finish with the matching verify call. */
export type AuthStepResult = AuthResult & { needsVerification?: boolean };

export interface SignUpOptions {
  /** "I’d like VICI updates via email" — stored with the account, off unless ticked. */
  emailUpdates?: boolean;
}

/** How an account deletion is confirmed: a code emailed now, or the password. */
export type AccountCheck = 'email_code' | 'password';

export interface AuthValue {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  displayName: string | null;
  email: string | null;
  mode: 'mock' | 'clerk';
  /**
   * Password sign-in. `needsVerification` means the password was accepted but
   * the instance requires an emailed code to finish (Clerk MFA / device
   * verification) — complete it with `verifySignInCode`.
   */
  signInWithPassword(email: string, password: string): Promise<AuthStepResult>;
  /**
   * Email-code sign-in (no password): email a 6-digit code to an existing
   * account. Finish with `verifySignInCode`; re-send with `resendSignInCode`.
   */
  sendSignInCode(email: string): Promise<AuthResult>;
  /** Complete a sign-in that is waiting on an emailed code. */
  verifySignInCode(code: string): Promise<AuthResult>;
  /** Re-send the sign-in email code. */
  resendSignInCode(): Promise<AuthResult>;
  /** Forgot password: email a reset code to the account (re-call to re-send). */
  startPasswordReset(email: string): Promise<AuthResult>;
  /**
   * Finish a reset with the emailed code and the new password, signing in.
   * `needsVerification`: the account has an email second factor — finish
   * with `verifySignInCode`.
   */
  completePasswordReset(code: string, newPassword: string): Promise<AuthStepResult>;
  /** Apple / Google single sign-on (Clerk `useSSO`). Unavailable offline. */
  signInWithSSO(strategy: SSOStrategy): Promise<AuthResult>;
  /** Sign-up with a chosen password; Clerk then emails a code to verify the address. */
  signUpWithPassword(email: string, password: string, displayName?: string, options?: SignUpOptions): Promise<AuthStepResult>;
  /** Sign-up with no password: emails a code; `verifyEmailCode` creates the account. */
  signUpWithEmailCode(email: string, displayName?: string, options?: SignUpOptions): Promise<AuthStepResult>;
  /** Complete a sign-up that is waiting on email-code verification. */
  verifyEmailCode(code: string): Promise<AuthResult>;
  /** Re-send the email verification code. */
  resendEmailCode(): Promise<AuthResult>;
  /**
   * Account deletion, step 1: ask the account to prove it is its owner (Clerk
   * reverification). `check` says what to ask for — a code emailed now, or the
   * password; no `check` means nothing further is needed.
   */
  prepareAccountDeletion(): Promise<AuthResult & { check?: AccountCheck }>;
  /** Account deletion, step 2: the code or password `prepareAccountDeletion` asked for. */
  confirmAccountDeletion(secret: string): Promise<AuthResult>;
  /**
   * Account deletion, last step: delete the sign-in account itself and end the
   * session. Erase the backend data first (`useDeleteAccountData`), while the
   * session can still reach it.
   */
  deleteAccount(): Promise<AuthResult>;
  signOut(): Promise<void>;
}

const MockAuthContext = createContext<AuthValue | null>(null);

/** The mock sends no email: any six digits stand in for the code. */
const CODE = /^\d{6}$/;
const CODE_ERROR = 'Enter the 6-digit code from the email.';
const NO_ACCOUNT = 'We couldn’t find an account with that email.';

/** The one emailed-code flow in progress, if any. */
type Pending =
  | { kind: 'signUp'; email: string; displayName?: string; emailUpdates: boolean }
  | { kind: 'signIn'; userId: string }
  | { kind: 'reset'; email: string }
  | { kind: 'delete'; verified: boolean };

type UserBook = Record<string, MockUserRecord>;
const readUsers = async () => (await getJSON<UserBook>(USERS_KEY)) ?? {};

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const pending = useRef<Pending | null>(null);

  const hydrateFromUserId = useCallback(async (uid: string | null) => {
    if (!uid) {
      setUserId(null);
      setDisplayName(null);
      setEmail(null);
      return;
    }
    const users = await readUsers();
    const record = Object.values(users).find((u) => u.userId === uid) ?? null;
    setUserId(uid);
    setDisplayName(record?.displayName ?? null);
    setEmail(record?.email ?? null);
  }, []);

  useEffect(() => {
    (async () => {
      const sessionUid = await secureGet(SESSION_KEY);
      await hydrateFromUserId(sessionUid);
      setIsLoaded(true);
    })();
  }, [hydrateFromUserId]);

  const startSession = useCallback(
    async (uid: string) => {
      pending.current = null;
      await secureSet(SESSION_KEY, uid);
      await hydrateFromUserId(uid);
    },
    [hydrateFromUserId],
  );

  /** Write a new account into the book and sign it in. */
  const createAccount = useCallback(
    async (normalized: string, password: string | null, name: string | undefined, emailUpdates: boolean) => {
      const users = await readUsers();
      if (users[normalized]) return { ok: false, error: 'An account with that email already exists.' };
      const record: MockUserRecord = {
        userId: genId('mockuser'),
        email: normalized,
        password,
        displayName: name?.trim() || normalized.split('@')[0],
        emailUpdates,
      };
      users[normalized] = record;
      await setJSON(USERS_KEY, users);
      await startSession(record.userId);
      return { ok: true };
    },
    [startSession],
  );

  const signUpWithPassword = useCallback<AuthValue['signUpWithPassword']>(
    async (rawEmail, password, name, options) => {
      const normalized = rawEmail.trim().toLowerCase();
      if (!normalized || !password) return { ok: false, error: 'Email and password required.' };
      return createAccount(normalized, password, name, !!options?.emailUpdates);
    },
    [createAccount],
  );

  const signUpWithEmailCode = useCallback<AuthValue['signUpWithEmailCode']>(async (rawEmail, name, options) => {
    const normalized = rawEmail.trim().toLowerCase();
    if (!normalized) return { ok: false, error: 'Enter your email address.' };
    const users = await readUsers();
    if (users[normalized]) return { ok: false, error: 'An account with that email already exists.' };
    pending.current = { kind: 'signUp', email: normalized, displayName: name, emailUpdates: !!options?.emailUpdates };
    return { ok: false, needsVerification: true };
  }, []);

  const verifyEmailCode = useCallback<AuthValue['verifyEmailCode']>(
    async (code) => {
      const p = pending.current;
      if (p?.kind !== 'signUp') return { ok: false, error: 'No sign-up in progress.' };
      if (!CODE.test(code.trim())) return { ok: false, error: CODE_ERROR };
      return createAccount(p.email, null, p.displayName, p.emailUpdates);
    },
    [createAccount],
  );

  const signInWithPassword = useCallback<AuthValue['signInWithPassword']>(
    async (rawEmail, password) => {
      const normalized = rawEmail.trim().toLowerCase();
      const record = (await readUsers())[normalized];
      if (record && record.password === null) return { ok: false, error: 'This account has no password. Sign in with an emailed code.' };
      if (!record || record.password !== password) {
        return { ok: false, error: 'Incorrect email or password.' };
      }
      await startSession(record.userId);
      return { ok: true };
    },
    [startSession],
  );

  const sendSignInCode = useCallback<AuthValue['sendSignInCode']>(async (rawEmail) => {
    const record = (await readUsers())[rawEmail.trim().toLowerCase()];
    if (!record) return { ok: false, error: NO_ACCOUNT };
    pending.current = { kind: 'signIn', userId: record.userId };
    return { ok: true };
  }, []);

  const verifySignInCode = useCallback<AuthValue['verifySignInCode']>(
    async (code) => {
      const p = pending.current;
      if (p?.kind !== 'signIn') return { ok: false, error: 'No sign-in in progress.' };
      if (!CODE.test(code.trim())) return { ok: false, error: CODE_ERROR };
      await startSession(p.userId);
      return { ok: true };
    },
    [startSession],
  );

  const startPasswordReset = useCallback<AuthValue['startPasswordReset']>(async (rawEmail) => {
    const normalized = rawEmail.trim().toLowerCase();
    if (!(await readUsers())[normalized]) return { ok: false, error: NO_ACCOUNT };
    pending.current = { kind: 'reset', email: normalized };
    return { ok: true };
  }, []);

  const completePasswordReset = useCallback<AuthValue['completePasswordReset']>(
    async (code, newPassword) => {
      const p = pending.current;
      if (p?.kind !== 'reset') return { ok: false, error: 'No password reset in progress.' };
      if (!CODE.test(code.trim())) return { ok: false, error: CODE_ERROR };
      if (newPassword.length < 8) return { ok: false, error: 'Passwords need at least 8 characters.' };
      const users = await readUsers();
      const record = users[p.email];
      if (!record) return { ok: false, error: NO_ACCOUNT };
      users[p.email] = { ...record, password: newPassword };
      await setJSON(USERS_KEY, users);
      await startSession(record.userId);
      return { ok: true };
    },
    [startSession],
  );

  const prepareAccountDeletion = useCallback<AuthValue['prepareAccountDeletion']>(async () => {
    if (!userId) return { ok: false, error: 'You’re not signed in.' };
    pending.current = { kind: 'delete', verified: false };
    return { ok: true, check: 'email_code' };
  }, [userId]);

  const confirmAccountDeletion = useCallback<AuthValue['confirmAccountDeletion']>(async (secret) => {
    if (pending.current?.kind !== 'delete') return { ok: false, error: 'Start the deletion again.' };
    if (!CODE.test(secret.trim())) return { ok: false, error: CODE_ERROR };
    pending.current = { kind: 'delete', verified: true };
    return { ok: true };
  }, []);

  const deleteAccount = useCallback<AuthValue['deleteAccount']>(async () => {
    if (!userId) return { ok: false, error: 'You’re not signed in.' };
    const p = pending.current;
    if (p?.kind !== 'delete' || !p.verified) return { ok: false, error: 'Confirm it’s you first.' };
    const users = await readUsers();
    for (const [key, record] of Object.entries(users)) if (record.userId === userId) delete users[key];
    await setJSON(USERS_KEY, users);
    pending.current = null;
    await secureDelete(SESSION_KEY);
    await hydrateFromUserId(null);
    return { ok: true };
  }, [userId, hydrateFromUserId]);

  const signOut = useCallback<AuthValue['signOut']>(async () => {
    pending.current = null;
    await secureDelete(SESSION_KEY);
    await hydrateFromUserId(null);
  }, [hydrateFromUserId]);

  const value = useMemo<AuthValue>(
    () => ({
      isLoaded,
      isSignedIn: !!userId,
      userId,
      displayName,
      email,
      mode: 'mock',
      signInWithPassword,
      sendSignInCode,
      verifySignInCode,
      // Nothing is sent offline, so a re-send has nothing to do.
      resendSignInCode: async () => ({ ok: true }),
      startPasswordReset,
      completePasswordReset,
      signInWithSSO: async () => ({ ok: false, error: 'Apple & Google sign-in need the online build. Use email for now.' }),
      signUpWithPassword,
      signUpWithEmailCode,
      verifyEmailCode,
      resendEmailCode: async () => ({ ok: true }),
      prepareAccountDeletion,
      confirmAccountDeletion,
      deleteAccount,
      signOut,
    }),
    [
      isLoaded,
      userId,
      displayName,
      email,
      signInWithPassword,
      sendSignInCode,
      verifySignInCode,
      startPasswordReset,
      completePasswordReset,
      signUpWithPassword,
      signUpWithEmailCode,
      verifyEmailCode,
      prepareAccountDeletion,
      confirmAccountDeletion,
      deleteAccount,
      signOut,
    ],
  );

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

export function useMockAuth(): AuthValue {
  const ctx = useContext(MockAuthContext);
  if (!ctx) throw new Error('useMockAuth must be used within MockAuthProvider');
  return ctx;
}
