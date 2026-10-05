/**
 * Root provider composition. Branches on REAL_BACKEND so the rest of the app is
 * identical regardless of whether it runs on the local mock layer or on real
 * Convex + Clerk.
 *
 *   mock mode (default, zero credentials):  AuthProvider → BackendProvider
 *   real mode (both env keys present):       Clerk → Convex (RealProviders)
 *
 * PurchasesProvider sits inside both, because it identifies the RevenueCat
 * customer from the signed-in user and mirrors the entitlement down into
 * `settings.premium` — so it needs auth and the data layer already mounted.
 *
 * RealProviders is lazy-`require`d so the Clerk + Convex-Clerk provider code never
 * executes in mock mode (robust offline boot on every platform).
 */

import type { ReactNode } from 'react';

import { AuthProvider } from '@/lib/auth';
import { BackendProvider } from '@/lib/backend';
import { REAL_BACKEND } from '@/lib/config';
import { PurchasesProvider } from '@/lib/purchases';

export function AppProviders({ children }: { children: ReactNode }) {
  if (REAL_BACKEND) {
    const { RealProviders } = require('./backend/realProviders') as typeof import('./backend/realProviders');
    return (
      <RealProviders>
        <PurchasesProvider>{children}</PurchasesProvider>
      </RealProviders>
    );
  }
  return (
    <AuthProvider>
      <BackendProvider>
        <PurchasesProvider>{children}</PurchasesProvider>
      </BackendProvider>
    </AuthProvider>
  );
}
