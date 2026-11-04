import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';

import { OnboardingHandoffCtx } from '@/components/onboarding/funnel';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { mono } from '@/lib/theme';

export default function OnboardingLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  // `/welcome` completes onboarding and then opens the first check-in board
  // itself; while it does, a finished account is not bounced to Today here, or
  // the two navigations race and Today flashes between Day 0 and the board.
  const [finishing, setFinishing] = useState(false);
  const handoff = useMemo(() => ({ finishing, setFinishing }), [finishing]);
  if (isLoaded && !isSignedIn) return <Redirect href="/" />;
  if (user?.onboardingComplete && !finishing) return <Redirect href="/(app)/today" />;
  return (
    <OnboardingHandoffCtx.Provider value={handoff}>
      {/* Every onboarding frame stands on the #0D0D0D ground — light status-bar glyphs. */}
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          contentStyle: { backgroundColor: mono.ground },
        }}
      />
    </OnboardingHandoffCtx.Provider>
  );
}
