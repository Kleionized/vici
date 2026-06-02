/**
 * Real provider stack: Clerk auth + Convex (authenticated via Clerk). Mounted
 * only when REAL_BACKEND is true (both env keys present), so the Convex client is
 * never constructed in mock mode.
 */

import { ClerkProvider, useUser, useAuth as useClerkSDKAuth } from '@clerk/clerk-expo';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useMemo, type ReactNode } from 'react';

import { CLERK_PUBLISHABLE_KEY, CONVEX_URL } from '@/lib/config';
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

/** Mirror the Clerk user into Convex once signed in. */
function Bootstrap({ children }: { children: ReactNode }) {
  const { isSignedIn } = useClerkSDKAuth();
  const { user } = useUser();
  const ensureUser = useEnsureUser();
  useEffect(() => {
    if (isSignedIn) void ensureUser(user?.fullName ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);
  return <>{children}</>;
}

export function RealProviders({ children }: { children: ReactNode }) {
  // Constructed lazily here (not at module load) so mock mode never builds it.
  const client = useMemo(() => new ConvexReactClient(CONVEX_URL, { unsavedChangesWarning: false }), []);
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={client} useAuth={useClerkSDKAuth}>
        <Bootstrap>{children}</Bootstrap>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
