import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';

/**
 * The auth stack's door guard.
 *
 * A signed-in man has no business on the sign-in boards — except during
 * onboarding. `03 · Name` draws a Back row (D122, reversing D016) and the only
 * place behind it is `02 · Login`, the board the account was made on. So the
 * door renders while `onboardingComplete` is false, and only bounces once the
 * questionnaire is behind him. The redirect also waits for the user record to
 * resolve: `undefined` is "not loaded yet", and redirecting on it would race
 * the door shut in front of the man walking back through it.
 */
export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  if (isLoaded && isSignedIn && user?.onboardingComplete) return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
