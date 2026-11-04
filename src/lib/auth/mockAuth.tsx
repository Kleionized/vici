/**
 * Mock authentication — the DEFAULT auth path when no Clerk key is configured,
 * so the app is fully usable offline (build spec §9.5).
 *
 * ⚠️ DEV ONLY. This is NOT secure: "passwords" are stored locally in plain text
 * and there is no server. It exists purely to exercise the sign-in / sign-up /
 * auth-gate flows during development. Real auth is Clerk (see SETUP.md).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import * as Crypto from 'expo-crypto';

import { genId } from '@/lib/id';
import { getJSON, secureDelete, secureGet, secureSet, setJSON } from '@/lib/storage';

const SESSION_KEY = 'tideline.session.userId';
const USERS_KEY = 'tideline.mock.users';

interface MockUserRecord {
  userId: string;
  email: string;
  /** Legacy: early builds stored the password itself. Rehashed on the next sign-in. */
  password?: string;
  /** salted SHA-256 of the password (hex), and its salt */
  passwordHash?: string;
  salt?: string;
  displayName?: string;
}

/** Never keep a password, even in the dev-only mock: keep a salted digest of it. */
async function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `tideline.mock:${salt}:${password}`);
}

function newSalt(): string {
  return Array.from(Crypto.getRandomBytes(16), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time-ish string compare, so a timing difference does not leak a prefix. */
function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
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
  /**
   * Delete the sign-in itself (Clerk user / the local record) and sign out.
   * The caller erases the account's data on the backend first.
   */
  deleteAccount(): Promise<{ ok: boolean; error?: string }>;
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
      const salt = newSalt();
      const record: MockUserRecord = {
        userId: genId('mockuser'),
        email: normalized,
        salt,
        passwordHash: await hashPassword(password, salt),
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
      const matches = record
        ? record.passwordHash && record.salt
          ? sameString(await hashPassword(password, record.salt), record.passwordHash)
          : record.password !== undefined && sameString(record.password, password)
        : false;
      if (!record || !matches) {
        return { ok: false, error: 'Incorrect email or password.' };
      }
      if (record.password !== undefined) {
        // an early build's plaintext record: replace it with a digest now that we have the password
        const salt = newSalt();
        users[normalized] = { userId: record.userId, email: record.email, displayName: record.displayName, salt, passwordHash: await hashPassword(password, salt) };
        await setJSON(USERS_KEY, users);
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

  const deleteAccount = useCallback<AuthValue['deleteAccount']>(async () => {
    if (!userId) return { ok: false, error: 'Not signed in.' };
    const users = (await getJSON<Record<string, MockUserRecord>>(USERS_KEY)) ?? {};
    for (const [key, record] of Object.entries(users)) if (record.userId === userId) delete users[key];
    await setJSON(USERS_KEY, users);
    await secureDelete(SESSION_KEY);
    await hydrateFromUserId(null);
    return { ok: true };
  }, [userId, hydrateFromUserId]);

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
      deleteAccount,
    }),
    [isLoaded, userId, displayName, email, signInWithPassword, signUpWithPassword, signOut, deleteAccount],
  );

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

export function useMockAuth(): AuthValue {
  const ctx = useContext(MockAuthContext);
  if (!ctx) throw new Error('useMockAuth must be used within MockAuthProvider');
  return ctx;
}
