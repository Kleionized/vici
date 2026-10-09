/**
 * Real provider stack: Clerk auth + Convex (authenticated via Clerk). Mounted
 * only when REAL_BACKEND is true (both env keys present), so the Convex client is
 * never constructed in mock mode.
 */

import { ClerkProvider, useUser, useAuth as useClerkSDKAuth } from '@clerk/clerk-expo';
import { resourceCache } from '@clerk/clerk-expo/resource-cache';
import { ConvexProviderWithAuth, ConvexReactClient, useConvexAuth, useQuery } from 'convex/react';
import { makeFunctionReference } from 'convex/server';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { CLERK_PUBLISHABLE_KEY, CONVEX_URL } from '@/lib/config';
import type { AppUser } from '@/lib/types';
import { onBootRetry } from './bootRetry';
import { useEnsureUser } from './convex';

/** Clerk token cache backed by expo-secure-store (recommended for Expo). */
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // ignore
    }
  },
  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore
    }
  },
};

const currentUserRef = makeFunctionReference<'query', Record<string, never>, AppUser | null>('users:getCurrentUser');

/** Waits between failed attempts to make the account's row: 2 s, 4 s, 8 s … up to 30 s. */
const backoff = (failures: number) => Math.min(30_000, 2_000 * 2 ** Math.max(0, failures - 1));

/**
 * Mirror the Clerk user into Convex: make the account's row when Convex has
 * authenticated this sign-in and finds none (B10, D493). It used to run once,
 * when Clerk said "signed in", and a failure then left boot on the splash for
 * good (the row is what boot waits for). Now a failed attempt is tried again
 * with backoff, and at once when the boot board's Try again asks
 * (`retryBoot`). Offline, Convex holds the mutation until it reconnects, so
 * nothing is sent twice while one is in flight.
 *
 * Only a row this sign-in has never seen is made: once it has been read, a
 * row that disappears is an account being deleted (`account:deleteAccountData`
 * erases it before the Clerk user goes), and making it again would leave a
 * row behind for a deleted account.
 */
function Bootstrap({ children }: { children: ReactNode }) {
  const { isSignedIn, userId } = useClerkSDKAuth();
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const ensureUser = useEnsureUser();
  // null: authenticated and no row yet; skipped (undefined) until Convex has authenticated
  const row = useQuery(currentUserRef, isAuthenticated ? {} : 'skip');
  const missing = !!isSignedIn && isAuthenticated && row === null;

  const [attempt, setAttempt] = useState(0);
  const inFlight = useRef(false);
  const failures = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  /** this sign-in has read its row */
  const seenRow = useRef(false);
  const name = user?.fullName ?? undefined;

  useEffect(() => {
    seenRow.current = false;
  }, [userId]);
  useEffect(() => {
    if (row) seenRow.current = true;
  }, [row]);

  useEffect(() => {
    mounted.current = true;
    const off = onBootRetry(() => {
      failures.current = 0;
      if (retryTimer.current) clearTimeout(retryTimer.current);
      retryTimer.current = null;
      setAttempt((n) => n + 1);
    });
    return () => {
      mounted.current = false;
      off();
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!missing || seenRow.current || inFlight.current) return;
    inFlight.current = true;
    ensureUser(name).then(
      () => {
        inFlight.current = false;
        failures.current = 0;
      },
      (error: unknown) => {
        inFlight.current = false;
        failures.current += 1;
        if (__DEV__) console.warn('users:ensureUser failed; trying again', error);
        if (!mounted.current) return;
        if (retryTimer.current) clearTimeout(retryTimer.current);
        retryTimer.current = setTimeout(() => setAttempt((n) => n + 1), backoff(failures.current));
      },
    );
    // `attempt` re-runs it after a failure; `ensureUser` is a fresh closure each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missing, attempt]);

  return <>{children}</>;
}

/**
 * Clerk's offline cache of the client and environment (B10, D493). Without it,
 * a launch with no signal ends with Clerk "loaded" and an empty client: on
 * React Native `navigator.onLine` is undefined, so clerk-js answers a failed
 * `/client` fetch with null instead of an error. The app then read that as a
 * sign-out. With it, Clerk loads the last client it saw ("degraded"), still
 * signed in, and failed requests throw a network error instead of emptying the
 * client. Native only: the web build keeps Clerk's browser behaviour.
 */
const offlineCache = Platform.OS === 'web' ? undefined : resourceCache;

/** How many times the boot board's Try again has been pressed in this run. */
function useBootRetries(): number {
  const [retries, setRetries] = useState(0);
  useEffect(() => onBootRetry(() => setRetries((n) => n + 1)), []);
  return retries;
}

/**
 * `convex/react-clerk`'s adapter, with one addition: Try again on the boot
 * board makes Convex ask Clerk for its token again (D493). A launch with no
 * signal leaves Convex unauthenticated after its one token fetch fails, and
 * Convex only fetches again when this callback changes, so without it the
 * board could not recover once the signal came back.
 */
function useConvexAuthFromClerk() {
  const { isLoaded, isSignedIn, getToken, orgId, orgRole, sessionClaims } = useClerkSDKAuth();
  const retries = useBootRetries();
  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        return sessionClaims?.aud === 'convex'
          ? await getToken({ skipCache: forceRefreshToken })
          : await getToken({ template: 'convex', skipCache: forceRefreshToken });
      } catch {
        return null;
      }
    },
    // As in Convex's adapter: Clerk's Expo `useAuth` is not memoized, so
    // `getToken` is left out; `retries` is the one dependency added.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orgId, orgRole, retries],
  );
  return useMemo(() => ({ isLoading: !isLoaded, isAuthenticated: isSignedIn ?? false, fetchAccessToken }), [isLoaded, isSignedIn, fetchAccessToken]);
}

/**
 * One Convex client for the whole run, built on first use (so mock mode never
 * builds one). The root error boundary's Try again remounts these providers;
 * a client built per mount would leave the old one's socket and token refresh
 * running behind it.
 */
let convexClient: ConvexReactClient | null = null;
const getConvexClient = () => (convexClient ??= new ConvexReactClient(CONVEX_URL, { unsavedChangesWarning: false }));

export function RealProviders({ children }: { children: ReactNode }) {
  const client = getConvexClient();
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache} __experimental_resourceCache={offlineCache}>
      <ConvexProviderWithAuth client={client} useAuth={useConvexAuthFromClerk}>
        <Bootstrap>{children}</Bootstrap>
      </ConvexProviderWithAuth>
    </ClerkProvider>
  );
}
