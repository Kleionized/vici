/**
 * Mock authentication — the DEFAULT auth path when no Clerk key is configured,
 * so the app is fully usable offline (build spec §9.5).
 *
 * ⚠️ DEV ONLY. This is NOT secure: "passwords" are stored locally in plain text
 * and there is no server. It exists purely to exercise the sign-in / sign-up /
 * auth-gate flows during development. Real auth is Clerk (see SETUP.md).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { genId } from '@/lib/id';
import { getJSON, secureDelete, secureGet, secureSet, setJSON } from '@/lib/storage';

const SESSION_KEY = 'tideline.session.userId';
const USERS_KEY = 'tideline.mock.users';

interface MockUserRecord {
  userId: string;
  email: string;
  password: string;
  displayName?: string;
}

export type SSOStrategy = 'oauth_apple' | 'oauth_google';

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
  signInWithPassword(email: string, password: string): Promise<{ ok: boolean; error?: string; needsVerification?: boolean }>;
  /** Complete a sign-in that required an email code (Clerk). No-op for mock. */
  verifySignInCode(code: string): Promise<{ ok: boolean; error?: string }>;
  /** Re-send the sign-in email code (Clerk). No-op for mock. */
  resendSignInCode(): Promise<{ ok: boolean; error?: string }>;
  /** Apple / Google single sign-on (Clerk `useSSO`). Unavailable offline. */
  signInWithSSO(strategy: SSOStrategy): Promise<{ ok: boolean; error?: string }>;
  signUpWithPassword(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<{ ok: boolean; error?: string; needsVerification?: boolean }>;
  /** Complete a sign-up that required email-code verification (Clerk). No-op for mock. */
  verifyEmailCode(code: string): Promise<{ ok: boolean; error?: string }>;
  /** Re-send the email verification code (Clerk). No-op for mock. */
  resendEmailCode(): Promise<{ ok: boolean; error?: string }>;
  signOut(): Promise<void>;
}

const MockAuthContext = createContext<AuthValue | null>(null);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const hydrateFromUserId = useCallback(async (uid: string | null) => {
    if (!uid) {
      setUserId(null);
      setDisplayName(null);
      setEmail(null);
      return;
    }
    const users = (await getJSON<Record<string, MockUserRecord>>(USERS_KEY)) ?? {};
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

  const signUpWithPassword = useCallback<AuthValue['signUpWithPassword']>(
    async (rawEmail, password, name) => {
      const normalized = rawEmail.trim().toLowerCase();
      if (!normalized || !password) return { ok: false, error: 'Email and password required.' };
      const users = (await getJSON<Record<string, MockUserRecord>>(USERS_KEY)) ?? {};
      if (users[normalized]) return { ok: false, error: 'An account with that email already exists.' };
      const record: MockUserRecord = {
        userId: genId('mockuser'),
        email: normalized,
        password,
        displayName: name?.trim() || normalized.split('@')[0],
      };
      users[normalized] = record;
      await setJSON(USERS_KEY, users);
      await secureSet(SESSION_KEY, record.userId);
      await hydrateFromUserId(record.userId);
      return { ok: true };
    },
    [hydrateFromUserId],
  );

  const signInWithPassword = useCallback<AuthValue['signInWithPassword']>(
    async (rawEmail, password) => {
      const normalized = rawEmail.trim().toLowerCase();
      const users = (await getJSON<Record<string, MockUserRecord>>(USERS_KEY)) ?? {};
      const record = users[normalized];
      if (!record || record.password !== password) {
        return { ok: false, error: 'Incorrect email or password.' };
      }
      await secureSet(SESSION_KEY, record.userId);
      await hydrateFromUserId(record.userId);
      return { ok: true };
    },
    [hydrateFromUserId],
  );

  const signOut = useCallback<AuthValue['signOut']>(async () => {
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
      signUpWithPassword,
      // Mock auth never needs verification and has no SSO, so these are no-ops.
      verifySignInCode: async () => ({ ok: true }),
      resendSignInCode: async () => ({ ok: true }),
      signInWithSSO: async () => ({ ok: false, error: 'Apple & Google sign-in need the online build. Use email for now.' }),
      verifyEmailCode: async () => ({ ok: true }),
      resendEmailCode: async () => ({ ok: true }),
      signOut,
    }),
    [isLoaded, userId, displayName, email, signInWithPassword, signUpWithPassword, signOut],
  );

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

export function useMockAuth(): AuthValue {
  const ctx = useContext(MockAuthContext);
  if (!ctx) throw new Error('useMockAuth must be used within MockAuthProvider');
  return ctx;
}
