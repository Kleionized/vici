import { Redirect, Tabs, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { StoicTabBar } from '@/components/StoicTabBar';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { getJSON, setJSON } from '@/lib/storage';
import { loadUrgeSession } from '@/lib/urgeSession';

const CHECKIN_PROMPT_KEY = 'tideline.checkinPromptAt';
const HOUR = 60 * 60 * 1000;

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  const router = useRouter();
  const prompted = useRef(false);

  // On launch — and then at most once per hour — surface the mood check-in.
  useEffect(() => {
    if (prompted.current || !user?.onboardingComplete) return;
    prompted.current = true;
    (async () => {
      // Mid-urge reopens go back to the urge flow, never the mood prompt.
      if (await loadUrgeSession()) return;
      const last = await getJSON<number>(CHECKIN_PROMPT_KEY);
      if (!last || Date.now() - last > HOUR) {
        await setJSON(CHECKIN_PROMPT_KEY, Date.now());
        router.push('/checkin');
      }
    })();
  }, [user?.onboardingComplete, router]);

  if (isLoaded && !isSignedIn) return <Redirect href="/" />;
  if (user && !user.onboardingComplete) return <Redirect href="/(onboarding)/welcome" />;

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={() => <StoicTabBar />}>
      <Tabs.Screen name="today" />
      <Tabs.Screen name="weeks" />
      <Tabs.Screen name="log" />
      <Tabs.Screen name="dashboard" />
      {/* Reachable via navigation but not shown in the tab bar. */}
      <Tabs.Screen name="lifemap" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="support" options={{ href: null }} />
      <Tabs.Screen name="locked" options={{ href: null }} />
      <Tabs.Screen name="journal" options={{ href: null }} />
      <Tabs.Screen name="milestones" options={{ href: null }} />
    </Tabs>
  );
}
