import { useLocalSearchParams, useRouter } from 'expo-router';

import { HeroBoard } from '@/components/mono';
import { useCurrentUser } from '@/lib/backend';
import { latestCompletedWeek, weekLabel } from '@/lib/weeklyReport';

/**
 * 91C0 · Report ready. The report lands over Today once a week has closed and
 * asks first — a weekly reckoning is worth a minute of attention, and dropping
 * it on someone unannounced is how it gets skimmed. The `(app)` launch gate
 * pushes it with `?week=`; without one it names the latest closed week.
 */
export default function ReportReady() {
  const router = useRouter();
  const user = useCurrentUser();
  const { week } = useLocalSearchParams<{ week?: string }>();
  const shown = week || (user ? latestCompletedWeek(user.createdAt) : null);
  // The frame's line names the week. With no closed week to name, the app's own
  // line from before the redesign (D328). Without `?week=` the week is only
  // known once the account loads: hold the line's space blank until then rather
  // than flash the other line (`undefined` is also "signed out", so no spinner).
  const body = shown
    ? `${weekLabel(shown)}: score, days and urges.`
    : user === undefined
      ? '\u00A0'
      : 'Score, urges, and the pattern — two quiet minutes.';

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
