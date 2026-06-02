/**
 * Auth facade. Screens import `useAuth` / `AuthProvider` from here and never
 * care whether the underlying implementation is Clerk or the local mock.
 *
 * The Clerk adapter is lazy-`require`d only in clerk mode, so `@clerk/clerk-expo`
 * (which carries native deps) never even executes in mock mode — keeping the
 * default offline boot robust on every platform. The binding is chosen once at
 * module load (AUTH_MODE never changes at runtime) so the rules of hooks hold.
 */

import type { ReactNode } from 'react';

import { AUTH_MODE } from '@/lib/config';
import { MockAuthProvider, useMockAuth } from './mockAuth';

export type { AuthValue } from './mockAuth';

export const useAuth =
  AUTH_MODE === 'clerk'
    ? (require('./clerkAuth') as typeof import('./clerkAuth')).useClerkAuth
    : useMockAuth;

const Passthrough = ({ children }: { children: ReactNode }) => children;

/** In clerk mode the ClerkProvider is mounted by RealProviders, so this is a no-op. */
export const AuthProvider = AUTH_MODE === 'clerk' ? Passthrough : MockAuthProvider;

export { AUTH_MODE };
