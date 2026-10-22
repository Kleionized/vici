import { useLocalSearchParams, useRouter } from 'expo-router';

import { HeroBoard } from '@/components/mono';
import { useCheckins, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap } from '@/lib/backend';
import { toDateKey } from '@/lib/date';
import { isDateKey, keyToDate } from '@/lib/day';
import { lessonCompletions } from '@/lib/score';
import { latestCompletedWeek, mondayOf, weekRating } from '@/lib/weeklyReport';
import { pagesLine, weeklyStory } from '@/lib/weeklyStory';

/**
 * `?week=` as the Monday of a real week that has begun, or null (U2, D484): a
 * stale or hand-made link (`?week=x`, `2026-02-31`, a week not yet lived)
 * falls back to the latest closed week instead of a broken or empty report.
 */
function weekParam(raw: unknown): string | null {
  if (!isDateKey(raw)) return null;
  const d = keyToDate(raw);
  if (toDateKey(d) !== raw || d.getTime() > Date.now()) return null;
  return toDateKey(mondayOf(d));
}

/**
 * 91C0 · Report ready. The report lands over Today once a week has closed and
 * asks first — a weekly reckoning is worth a minute of attention, and dropping
 * it on someone unannounced is how it gets skimmed. The `(app)` launch gate
 * pushes it with `?week=`; without one it names the latest closed week.
 */
export default function ReportReady() {
  const router = useRouter();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const events = useEvents();
  const journal = useJournalEntries();
  const progress = useLessonProgressMap();
  const params = useLocalSearchParams<{ week?: string }>();
  // only a real date key names a week — `?week=x` would print "undefined NaN"
  const week = weekParam(params.week) ?? undefined;
  const shown = week ?? (user ? latestCompletedWeek(user) : null);
  // The frame's line names the week. With no closed week to name, the app's own
  // line from before the redesign (D328). Without `?week=` the week is only
  // known once the account loads: hold the line's space blank until then rather
  // than flash the other line (`undefined` is also "signed out", so no spinner).
  // the week and how many short pages it has (Vici UI 2) — the line waits for the log that counts them
  const loaded = checkins !== undefined && events !== undefined && journal !== undefined && progress !== undefined && user !== undefined;
  const pages =
    shown && loaded && user
      ? weeklyStory({ weekStart: shown, events, journal, start: user, rating: ((r) => ({ value: r.rating, delta: r.delta }))(weekRating(shown, { checkins, events, lessons: lessonCompletions(progress), start: user })) }).length
      : 0;
  const body = shown && pages ? pagesLine(shown, pages) : !loaded ? '\u00A0' : 'Your rating, days and urges.';

  const later = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  const open = () => router.replace(week ? `/weekly-report?week=${week}` : '/weekly-report');

  return (
    <HeroBoard
      hero="chartUp"
      nav={{ left: 'empty', right: 'close', onClose: later }}
      // the frame breaks the title over two balanced lines — fixed copy, so the
      // break is written in for native, which cannot balance (D332)
      title={'Your weekly\nreport is ready.'}
      body={body}
      cta="Open the report"
      onCta={open}
      ghost="Later"
      onGhost={later}
    />
  );
}
