/**
 * Root provider composition. Branches on REAL_BACKEND so the rest of the app is
 * identical regardless of whether it runs on the local mock layer or on real
 * Convex + Clerk.
 *
 *   mock mode (default, zero credentials):  AuthProvider → BackendProvider
 *   real mode (both env keys present):       Clerk → Convex (RealProviders)
 */

import type { ReactNode } from 'react';

import { AuthProvider } from '@/lib/auth';
import { BackendProvider } from '@/lib/backend';
import { RealProviders } from '@/lib/backend/realProviders';
import { REAL_BACKEND } from '@/lib/config';

export function AppProviders({ children }: { children: ReactNode }) {
  if (REAL_BACKEND) return <RealProviders>{children}</RealProviders>;
  return (
    <AuthProvider>
      <BackendProvider>{children}</BackendProvider>
    </AuthProvider>
  );
}
