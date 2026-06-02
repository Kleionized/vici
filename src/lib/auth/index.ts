/**
 * Auth facade. Screens import `useAuth` / `AuthProvider` from here and never
 * care whether the underlying implementation is Clerk or the local mock.
 *
 * The Clerk path is wired in a later milestone; until a publishable key exists,
 * mock auth is the only implementation. The binding is chosen once at module
 * load (AUTH_MODE never changes at runtime) so the rules of hooks hold.
 */

import { AUTH_MODE } from '@/lib/config';
import { MockAuthProvider, useMockAuth } from './mockAuth';

export type { AuthValue } from './mockAuth';

// NOTE: when Clerk is wired, this becomes:
//   AUTH_MODE === 'clerk' ? useClerkAuthAdapter : useMockAuth
export const useAuth = useMockAuth;
export const AuthProvider = MockAuthProvider;

export { AUTH_MODE };
