/**
 * Root provider composition. Branches on backend/auth mode so the rest of the
 * app is identical regardless of whether it runs on the local mock layer or on
 * real Convex + Clerk.
 *
 * Mock mode (default, zero credentials):  AuthProvider → BackendProvider
 * Convex mode (later milestone):           ClerkProvider → ConvexProviderWithClerk
 */

import type { ReactNode } from 'react';

import { AuthProvider } from '@/lib/auth';
import { BackendProvider } from '@/lib/backend';

export function AppProviders({ children }: { children: ReactNode }) {
  // TODO(jerry): when EXPO_PUBLIC_CONVEX_URL + EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
  // are present, swap this for the Clerk + Convex provider stack (see SETUP.md).
  return (
    <AuthProvider>
      <BackendProvider>{children}</BackendProvider>
    </AuthProvider>
  );
}
