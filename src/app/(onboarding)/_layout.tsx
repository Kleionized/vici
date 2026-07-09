import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { colors } from '@/lib/theme';

export default function OnboardingLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  if (isLoaded && !isSignedIn) return <Redirect href="/" />;
  if (user?.onboardingComplete) return <Redirect href="/(app)/today" />;
  return (
    <>
      {/* Onboarding is a dark field — light status-bar glyphs. */}
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          contentStyle: { backgroundColor: colors.night.bottom },
        }}
      />
    </>
  );
}
