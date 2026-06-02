/**
 * Auth facade. Screens import `useAuth` / `AuthProvider` from here and never
 * care whether the underlying implementation is Clerk or the local mock.
 *
 * The binding is chosen once at module load (AUTH_MODE never changes at runtime)
 * so the rules of hooks hold. In Clerk mode the provider lives in the real
 * provider stack (`backend/realProviders.tsx`), so AuthProvider is a passthrough.
 */

import type { ReactNode } from 'react';

import { AUTH_MODE } from '@/lib/config';
import { useClerkAuth } from './clerkAuth';
import { MockAuthProvider, useMockAuth } from './mockAuth';

export type { AuthValue } from './mockAuth';

export const useAuth = AUTH_MODE === 'clerk' ? useClerkAuth : useMockAuth;

const Passthrough = ({ children }: { children: ReactNode }) => children;

/** In clerk mode the ClerkProvider is mounted by RealProviders, so this is a no-op. */
export const AuthProvider = AUTH_MODE === 'clerk' ? Passthrough : MockAuthProvider;

export { AUTH_MODE };
