import { Redirect, Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { TabIcon } from '@/components/TabIcon';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { colors } from '@/lib/theme';

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();

  if (isLoaded && !isSignedIn) return <Redirect href="/" />;
  if (user && !user.onboardingComplete) return <Redirect href="/(onboarding)/welcome" />;

  const tabBarIcon = ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <TabIcon color={color} focused={focused} />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSofter,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}>
      <Tabs.Screen name="today" options={{ title: 'Today', tabBarIcon }} />
      <Tabs.Screen name="weeks" options={{ title: 'Weeks', tabBarIcon }} />
      <Tabs.Screen name="urge" options={{ title: 'Urge', tabBarIcon }} />
      <Tabs.Screen name="log" options={{ title: 'Log', tabBarIcon }} />
      <Tabs.Screen name="dashboard" options={{ title: 'You', tabBarIcon }} />
      {/* Reachable via navigation but hidden from the tab bar. */}
      <Tabs.Screen name="lifemap" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="support" options={{ href: null }} />
    </Tabs>
  );
}
