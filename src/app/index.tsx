import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { AppText, LoadingView } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { colors, spacing } from '@/lib/theme';

/**
 * Route decision / splash. Per build spec §5:
 *   not authed            → (auth)
 *   authed, !onboarded    → (onboarding)
 *   authed, onboarded     → (app)
 */
export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();

  if (!isLoaded) return <Splash />;
  if (!isSignedIn) return <Redirect href="/(auth)/splash" />;
  if (user === undefined) return <Splash />; // user data still hydrating
  if (!user?.onboardingComplete) return <Redirect href="/(onboarding)/welcome" />;
  return <Redirect href="/(app)/today" />;
}

function Splash() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
      <AppText variant="display">VICI</AppText>
      <LoadingView />
    </View>
  );
}
