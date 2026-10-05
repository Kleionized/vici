import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { mono } from '@/lib/theme';

export default function OnboardingLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  if (isLoaded && !isSignedIn) return <Redirect href="/" />;
  if (user?.onboardingComplete) return <Redirect href="/(app)/today" />;
  return (
    <>
      {/* Every onboarding frame stands on the #0D0D0D ground — light status-bar glyphs. */}
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          contentStyle: { backgroundColor: mono.ground },
        }}
      />
    </>
  );
}
