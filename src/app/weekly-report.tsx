import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { BigStat, DayCells, entryRead, isUrge, LastWeek, PagedRegister, PANE_TOP, PaneBody, ScoreLine, signed } from '@/components/logflow';
import { EmptyState, LoadingView, MonoText, NavBar, RuledRow, RuledRows, Screen, TitleHead } from '@/components/mono';
import { useCheckins, useCurrentUser, useEvents, useLessonProgressMap } from '@/lib/backend';
import { clockTime, groupDigits, WEEKDAYS_SHORT } from '@/lib/format';
import { buildWeeklyReport, dayStatuses, latestCompletedWeek, weekScore } from '@/lib/weeklyReport';

/**
 * 91C / 91C2 / 91C3 · Weekly report — three readings of a closed week behind
 * one standing head: where the score went, which days held, and the urges.
 * `Settings Weekly Report` (93D) is this same board opened from Settings
 * (`?from=settings`); the frame no longer names where it came from.
 */

const PAGES = ['Score', 'Days', 'Urges'] as const;

const y = (canvasY: number) => canvasY - PANE_TOP;

export default function WeeklyReport() {
  const router = useRouter();
  const { week } = useLocalSearchParams<{ week?: string; from?: string }>();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const events = useEvents();
  const progress = useLessonProgressMap();
  const [page, setPage] = useState(0);
  const [now] = useState(() => Date.now());

  const weekStart = week || (user ? latestCompletedWeek(user.createdAt, now) : null);
  const report = useMemo(
    () => (weekStart && checkins && events ? buildWeeklyReport(weekStart, checkins, events) : null),
    [weekStart, checkins, events],
  );
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/dashboard'));

  if (checkins === undefined || events === undefined || user === undefined || progress === undefined) return <LoadingView onBack={back} />;

  const createdAt = user?.createdAt ?? now;
  const statuses = report ? dayStatuses(report.weekStart, events, createdAt, now) : [];
  const lived = statuses.filter((s) => s !== 'none').length;

  // The report draws the score, the days and the urges — all three exist for
  // every week the account lived, logged or not, and the Log's Reports row has
  // already printed that week's delta. So the old mood-only gate
  // (`hasReportContent`, which still decides whether the launch gate delivers
  // one) no longer empties it. Two empty states remain: no week has closed yet,
  // or the week asked for is one the account never lived (a stale link).
  if (!report || !lived) {
    return (
      <Screen>
        <NavBar left="back" onBack={back} />
        <TitleHead title="Weekly report" />
        <MonoText v="p" style={{ position: 'absolute', left: 24, right: 24, top: 164 }}>
          {report != null
            ? 'Nothing was logged that week, so the report has nothing to draw on.'
            : 'Your first week is still being written. Keep checking in; the report appears once a full week closes.'}
        </MonoText>
      </Screen>
    );
  }

  const lessons = Object.values(progress)
    .filter((p) => p.status === 'completed')
    .map((p) => p.completedAt ?? 0);
  const score = weekScore(report.weekStart, createdAt, checkins, events, lessons);

  const clean = statuses.filter((s) => s === 'clean' || s === 'ridden').length;
  const prevStart = new Date(`${report.weekStart}T00:00:00`);
  prevStart.setDate(prevStart.getDate() - 7);
  const prevKey = `${prevStart.getFullYear()}-${String(prevStart.getMonth() + 1).padStart(2, '0')}-${String(prevStart.getDate()).padStart(2, '0')}`;
  const lastWeek = dayStatuses(prevKey, events, createdAt, now).map((s) => s === 'clean' || s === 'ridden');

  const startMs = new Date(`${report.weekStart}T00:00:00`).getTime();
  const endMs = new Date(startMs).setDate(new Date(startMs).getDate() + 7);
  // the week read forward — the Log reads newest first, a closed week reads in order
  const urges = events.filter((e) => isUrge(e) && e.createdAt >= startMs && e.createdAt < endMs).sort((a, b) => a.createdAt - b.createdAt);
  const ridden = urges.filter((e) => e.type === 'urge_rode_out').length;
  const urgeCaption = !urges.length
    ? 'Urges this week'
    : `${urges.length === 1 ? 'Urge' : 'Urges'}, ${ridden === urges.length ? (ridden === 1 ? 'ridden out' : 'all ridden out') : `${ridden} ridden out`}`;
  const openOverview = () => router.push(`/urge-overview?week=${report.weekStart}`);

  return (
    <PagedRegister title="Weekly report" pill={report.label} onBack={back} items={PAGES} page={page} onPage={setPage}>
      {/* 91C · the score, day by day */}
      <PaneBody height={y(352) + 140 + 8}>
        <BigStat top={y(236)} value={groupDigits(score.score)} caption={`${signed(score.delta)} this week`} />
        <ScoreLine top={y(352)} values={score.days} />
      </PaneBody>

      {/* 91C2 · which days held */}
      <PaneBody height={y(450) + 66 + 8}>
        <BigStat top={y(236)} value={`${clean} of ${lived}`} caption={clean === 1 ? 'Clean day' : 'Clean days'} />
        <DayCells top={y(352)} days={statuses} />
        <LastWeek top={y(450)} clean={lastWeek} />
      </PaneBody>

      {/* 91C3 · the urges, each one opening the overview of the week */}
      <View>
        <PaneBody height={y(372)}>
          <BigStat top={y(236)} value={String(urges.length)} caption={urgeCaption} />
        </PaneBody>
        {urges.length ? (
          <RuledRows height={56} style={{ marginHorizontal: 24 }}>
            {urges.map((e) => {
              const read = entryRead(e);
              const label = `${WEEKDAYS_SHORT[new Date(e.createdAt).getDay()]}, ${clockTime(e.createdAt, { lower: true })}`;
              return <RuledRow key={e._id} label={label} value={read.word} slipped={read.slipped} onPress={openOverview} accessibilityLabel={`${label}, ${read.word}`} />;
            })}
          </RuledRows>
        ) : (
          <EmptyState body="No urges logged this week." style={{ paddingVertical: 0 }} />
        )}
      </View>
    </PagedRegister>
  );
}
