import { Redirect, Tabs, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { StoicTabBar } from '@/components/StoicTabBar';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { getJSON, setJSON } from '@/lib/storage';
import { loadUrgeSession } from '@/lib/urgeSession';
import { latestCompletedWeek } from '@/lib/weeklyReport';

const CHECKIN_PROMPT_KEY = 'tideline.checkinPromptAt';
const LETTER_KEY = 'tideline.letter.day3';
const REPORT_SEEN_KEY = 'tideline.weeklyReport.seenWeek';
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

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
      // Day-3 letter — a sealed note from day-zero you, delivered over Today
      // ~72h in. Keeps arriving each launch until it's opened & kept.
      const dayNumber = user?.createdAt ? Math.floor((Date.now() - user.createdAt) / DAY) + 1 : 1;
      const letter = await getJSON<{ kept?: boolean }>(LETTER_KEY);
      if (dayNumber >= 3 && !letter?.kept) {
        router.push('/letter');
        return;
      }
      // End-of-week report — delivered once when a new week has closed.
      if (user?.createdAt) {
        const latestWeek = latestCompletedWeek(user.createdAt);
        const seenWeek = await getJSON<string>(REPORT_SEEN_KEY);
        if (latestWeek && latestWeek !== seenWeek) {
          await setJSON(REPORT_SEEN_KEY, latestWeek);
          router.push({ pathname: '/weekly-report', params: { week: latestWeek } });
          return;
        }
      }
      const last = await getJSON<number>(CHECKIN_PROMPT_KEY);
      if (!last || Date.now() - last > HOUR) {
        await setJSON(CHECKIN_PROMPT_KEY, Date.now());
        router.push('/checkin');
      }
    })();
  }, [user?.onboardingComplete, user?.createdAt, router]);

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
