import { Redirect, Tabs, usePathname, useRouter, type ErrorBoundaryProps } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { ErrorScreen } from '@/components/ErrorScreen';
import { StoicTabBar } from '@/components/StoicTabBar';
import { ACCOUNT_KEYS, readAccountJSON, writeAccountJSON } from '@/lib/accountState';
import { useAuth } from '@/lib/auth';
import { useCheckins, useCurrentUser, useEvents, useLessonProgressMap } from '@/lib/backend';
import { closingNightKey, isMorningCheckin, isNightClosed, letterOpen, nightBeforeProgramme, programmeDay } from '@/lib/day';
import { toDateKey } from '@/lib/date';
import { checkinPartNow } from '@/lib/routines';
import { mono } from '@/lib/theme';
import { loadUrgeSession } from '@/lib/urgeSession';
import { latestCompletedWeek, weekHasRecords } from '@/lib/weeklyReport';

// Every flag the gate reads is this account's own on this phone (D490): a
// shared phone never delivers one account's letter, post or report to another.
const CHECKIN_PROMPT_KEY = ACCOUNT_KEYS.checkinPromptAt;
const LETTER_PENDING_KEY = ACCOUNT_KEYS.letterPending;
const POST_PENDING_KEY = ACCOUNT_KEYS.postPending;
const POST_DONE_KEY = ACCOUNT_KEYS.postDelivered;
const REPORT_SEEN_KEY = ACCOUNT_KEYS.reportSeen;
/** The day-zero letter's Week XII arrival, delivered once. */
const LETTER_XII_KEY = ACCOUNT_KEYS.letterXiiDelivered;
const HOUR = 60 * 60 * 1000;

/**
 * Where an arrival may land: the tab roots. A launch or a return into
 * anything else — the SOS flow, a lesson, a check-in a reminder opened — is
 * left alone, so nothing is pushed between a user mid-urge and what they came
 * for.
 */
const ROOTS = new Set(['/', '/today', '/log', '/library', '/milestones']);

/**
 * A tab screen that throws while drawing shows "Something went wrong" with
 * Try again (B11, D495), and the SOS stays one tap away: `/urge` sits outside
 * this group, so it opens even when the group cannot draw.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const router = useRouter();
  return <ErrorScreen error={error} retry={() => void retry()} onUrge={() => router.push('/urge')} />;
}

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const pathname = usePathname();
  const events = useEvents();
  const progress = useLessonProgressMap();
  const router = useRouter();
  const prompted = useRef(false);

  // The gate runs once per launch and again each time the app returns from
  // the background (iOS keeps the process for days, so "once per launch" was
  // once per process); the hourly rule below still spaces the check-in pushes.
  const [wake, setWake] = useState(0);
  const away = useRef(false);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      // back from the background — not from a system sheet (Face ID, a
      // permission prompt), which only passes through `inactive`
      if (next === 'background') away.current = true;
      else if (next === 'active' && away.current) {
        away.current = false;
        prompted.current = false;
        setWake((w) => w + 1);
      }
    });
    return () => sub.remove();
  }, []);

  // On launch (and on each return) — at most one arrival: the letter, the
  // post, the week's report, the Week XII letter, then the check-in the clock
  // says it is, if it is not done. Waits for the logs to load: the report and
  // check-in gates read them.
  useEffect(() => {
    // `All` is the review drawer, not a destination a user arrives at: being
    // bounced to a pending check-in the moment it opens defeats the one thing
    // it is for. Every other route keeps the arrival order below.
    if (pathname === '/all') return;
    if (prompted.current || !user?.onboardingComplete) return;
    // Lesson progress too: a closed week whose only record is a finished
    // lesson must not be marked seen before the lessons have loaded.
    if (checkins === undefined || events === undefined || progress === undefined) return;
    prompted.current = true;
    if (!ROOTS.has(pathname)) return;
    // the account the flags below are read and written for — the one on screen
    const me = user.clerkUserId;
    (async () => {
      // Mid-urge reopens go back to the urge flow, never the mood prompt.
      if (await loadUrgeSession()) return;
      // The letter — sealed on day zero, it arrives over Today the launch
      // after a slip was logged, then reseals itself into the Log.
      const letterPending = await readAccountJSON<number>(LETTER_PENDING_KEY, me);
      if (letterPending) {
        router.push('/letter');
        return;
      }
      // Medallion post — the medallion arrives the launch after an urge was
      // ridden and logged (returning instead of vanishing), once. The face is
      // Vici now; the storage keys still spell the retired `Back on deck`
      // because they are load-bearing on accounts that already hold the post.
      const postPending = await readAccountJSON<number>(POST_PENDING_KEY, me);
      const postDone = await readAccountJSON<number>(POST_DONE_KEY, me);
      if (postPending && !postDone) {
        router.push('/medallion-post');
        return;
      }
      const now = Date.now();
      // End-of-week report — delivered once when a new week of the programme
      // has closed, and only when that week holds something the user did (a
      // check-in, an urge or slip logged, a lesson finished): the same weeks
      // the report screen draws. A closed week can't gain data later, so an
      // empty one is marked seen and quietly skipped.
      if (user && checkins && events) {
        const latestWeek = latestCompletedWeek(user, now);
        const seenWeek = await readAccountJSON<string>(REPORT_SEEN_KEY, me);
        if (latestWeek && latestWeek !== seenWeek) {
          await writeAccountJSON(REPORT_SEEN_KEY, latestWeek, me);
          const lessons = Object.values(progress ?? {})
            .filter((p) => p.status === 'completed' && p.completedAt != null)
            .map((p) => p.completedAt as number);
          if (weekHasRecords(latestWeek, checkins, events, lessons)) {
            router.push({ pathname: '/report-ready', params: { week: latestWeek } });
            return;
          }
        }
      }
      // The day-zero letter ("Opens Week XII") arrives on the first launch in
      // Week XII — once; until then Settings shows it sealed (R2).
      if (user && letterOpen(programmeDay(user, now))) {
        if (!(await readAccountJSON<number>(LETTER_XII_KEY, me))) {
          await writeAccountJSON(LETTER_XII_KEY, now, me);
          router.push('/letter?variant=week12');
          return;
        }
      }
      // The check-in the clock says it is, unless it is already done. The
      // morning's is done when today's row has a morning reading. The night's
      // is done when the night flow has closed the row it writes (before 4:30
      // that is yesterday's, L7). The quick check-in's feelings don't close a
      // night. The small hours before the programme's first day have no night
      // to close.
      const last = await readAccountJSON<number>(CHECKIN_PROMPT_KEY, me);
      if (!last || now - last > HOUR) {
        const part = checkinPartNow(new Date(now));
        const row = (key: string) => checkins?.find((c) => c.date === key);
        const done =
          part === 'morning'
            ? isMorningCheckin(row(toDateKey(new Date(now))))
            : nightBeforeProgramme(user, now) || isNightClosed(row(closingNightKey(user, now)));
        if (done) return;
        await writeAccountJSON(CHECKIN_PROMPT_KEY, now, me);
        router.push(part === 'morning' ? '/day/morning' : '/day/night');
      }
    })();
    // `wake` re-runs the gate on a return from the background
  }, [user, checkins, events, progress, router, pathname, wake]);

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
