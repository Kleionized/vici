import { Redirect, Tabs, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { StoicTabBar } from '@/components/StoicTabBar';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { getJSON, setJSON } from '@/lib/storage';
import { loadUrgeSession } from '@/lib/urgeSession';
import { latestCompletedWeek } from '@/lib/weeklyReport';

const CHECKIN_PROMPT_KEY = 'tideline.checkinPromptAt';
const LETTER_PENDING_KEY = 'tideline.letter.pending';
const POST_PENDING_KEY = 'tideline.post.backondeck.pending';
const POST_DONE_KEY = 'tideline.post.backondeck.delivered';
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
      // The letter — sealed on day zero, it arrives over Today the launch
      // after a slip was logged, then reseals itself into the Log.
      const letterPending = await getJSON<number>(LETTER_PENDING_KEY);
      if (letterPending) {
        router.push('/letter');
        return;
      }
      // Medallion post — Back on deck arrives the launch after an urge was
      // ridden and logged (returning instead of vanishing), once.
      const postPending = await getJSON<number>(POST_PENDING_KEY);
      const postDone = await getJSON<number>(POST_DONE_KEY);
      if (postPending && !postDone) {
        router.push('/medallion-post');
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
      <Tabs.Screen name="lifemap" />
      <Tabs.Screen name="settings" />
      <Tabs.Screen name="support" />
      <Tabs.Screen name="locked" />
      <Tabs.Screen name="journal" />
      <Tabs.Screen name="milestones" />
      <Tabs.Screen name="rough-days" />
    </Tabs>
  );
}
