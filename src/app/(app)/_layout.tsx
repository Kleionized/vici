import { Redirect, Tabs, usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { StoicTabBar } from '@/components/StoicTabBar';
import { useAuth } from '@/lib/auth';
import { useCheckins, useCurrentUser, useEvents } from '@/lib/backend';
import { checkinPartNow } from '@/lib/routines';
import { getJSON, setJSON } from '@/lib/storage';
import { mono } from '@/lib/theme';
import { loadUrgeSession } from '@/lib/urgeSession';
import { buildWeeklyReport, hasReportContent, latestCompletedWeek } from '@/lib/weeklyReport';

const CHECKIN_PROMPT_KEY = 'tideline.checkinPromptAt';
const LETTER_PENDING_KEY = 'tideline.letter.pending';
const POST_PENDING_KEY = 'tideline.post.backondeck.pending';
const POST_DONE_KEY = 'tideline.post.backondeck.delivered';
const REPORT_SEEN_KEY = 'tideline.weeklyReport.seenWeek';
const HOUR = 60 * 60 * 1000;

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const pathname = usePathname();
  const events = useEvents();
  const router = useRouter();
  const prompted = useRef(false);

  // On launch — and then at most once per hour — surface the mood check-in.
  // Waits for the logs to load: the weekly-report gate below has to read them
  // to know whether there is a report worth opening.
  useEffect(() => {
    // `All` is the review drawer, not a destination a user arrives at: being
    // bounced to a pending check-in the moment it opens defeats the one thing
    // it is for. Every other route keeps the arrival order below.
    if (pathname === '/all') return;
    if (prompted.current || !user?.onboardingComplete) return;
    if (checkins === undefined || events === undefined) return;
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
      // Medallion post — the medallion arrives the launch after an urge was
      // ridden and logged (returning instead of vanishing), once. The face is
      // Vici now; the storage keys still spell the retired `Back on deck`
      // because they are load-bearing on accounts that already hold the post.
      const postPending = await getJSON<number>(POST_PENDING_KEY);
      const postDone = await getJSON<number>(POST_DONE_KEY);
      if (postPending && !postDone) {
        router.push('/medallion-post');
        return;
      }
      // End-of-week report — delivered once when a new week has closed, and
      // only when that week has something in it. A closed week can't gain data
      // later, so an empty one is marked seen and quietly skipped rather than
      // re-tested on every launch.
      if (user?.createdAt && checkins && events) {
        const latestWeek = latestCompletedWeek(user.createdAt);
        const seenWeek = await getJSON<string>(REPORT_SEEN_KEY);
        if (latestWeek && latestWeek !== seenWeek) {
          await setJSON(REPORT_SEEN_KEY, latestWeek);
          if (hasReportContent(buildWeeklyReport(latestWeek, checkins, events))) {
            router.push({ pathname: '/report-ready', params: { week: latestWeek } });
            return;
          }
        }
      }
      const last = await getJSON<number>(CHECKIN_PROMPT_KEY);
      if (!last || Date.now() - last > HOUR) {
        await setJSON(CHECKIN_PROMPT_KEY, Date.now());
        router.push(checkinPartNow() === 'morning' ? '/day/morning' : '/day/night');
      }
    })();
  }, [user?.onboardingComplete, user?.createdAt, checkins, events, router, pathname]);

  if (isLoaded && !isSignedIn) return <Redirect href="/" />;
  if (user && !user.onboardingComplete) return <Redirect href="/(onboarding)/welcome" />;

  // The bar (StoicTabBar → the kit's TabBar) is the canvas's five items and
  // paints its own ground; the scene ends at its top. The scene's fill is the
  // ground too — the navigator's default is the light theme's grey.
  return (
    <Tabs backBehavior="history" screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: mono.ground } }} tabBar={(props) => <StoicTabBar state={props.state} />}>
      {/* The four tabs the bar lights (the fifth item, SOS, is a button). */}
      <Tabs.Screen name="today" />
      <Tabs.Screen name="log" />
      <Tabs.Screen name="library" />
      <Tabs.Screen name="milestones" />
      {/* Score Detail draws the bar with Journey lit; it lives here so it can. */}
      <Tabs.Screen name="score" />
      {/* Reachable via navigation but not drawn in the bar. `all` is the review
          drawer, out of the bar since the canvas draws five items. */}
      <Tabs.Screen name="all" />
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="lifemap" />
      <Tabs.Screen name="settings" />
      <Tabs.Screen name="support" />
      <Tabs.Screen name="locked" />
      <Tabs.Screen name="journal" />
      <Tabs.Screen name="rough-days" />
    </Tabs>
  );
}
