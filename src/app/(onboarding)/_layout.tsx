import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';

export default function OnboardingLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  if (isLoaded && !isSignedIn) return <Redirect href="/" />;
  if (user?.onboardingComplete) return <Redirect href="/(app)/today" />;
  return <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />;
}
