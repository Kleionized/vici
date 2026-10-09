import { useLocalSearchParams, useRouter } from 'expo-router';

import { HeroBoard } from '@/components/mono';
import { useCurrentUser } from '@/lib/backend';
import { toDateKey } from '@/lib/date';
import { isDateKey, keyToDate } from '@/lib/day';
import { latestCompletedWeek, mondayOf, weekLabel } from '@/lib/weeklyReport';

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
  const params = useLocalSearchParams<{ week?: string }>();
  // only a real date key names a week — `?week=x` would print "undefined NaN"
  const week = weekParam(params.week) ?? undefined;
  const shown = week ?? (user ? latestCompletedWeek(user) : null);
  // The frame's line names the week. With no closed week to name, the app's own
  // line from before the redesign (D328). Without `?week=` the week is only
  // known once the account loads: hold the line's space blank until then rather
  // than flash the other line (`undefined` is also "signed out", so no spinner).
  const body = shown
    ? `${weekLabel(shown)}: rating, days and urges.`
    : user === undefined
      ? '\u00A0'
      : 'Rating, urges, and the pattern — two quiet minutes.';

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
