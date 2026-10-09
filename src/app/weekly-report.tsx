import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { BigStat, DayCells, entryRead, isUrge, LastWeek, PagedRegister, PANE_TOP, PaneBody, ScoreLine, signed } from '@/components/logflow';
import { EmptyState, LoadingView, MonoText, NavBar, RuledRow, RuledRows, Screen, TitleHead } from '@/components/mono';
import { useCheckins, useCurrentUser, useEvents, useLessonProgressMap } from '@/lib/backend';
import { toDateKey } from '@/lib/date';
import { addDays, isDateKey, keyToDate, shiftKey } from '@/lib/day';
import { clockTime, WEEKDAYS_SHORT } from '@/lib/format';
import { RATING_SCALE, lessonCompletions } from '@/lib/score';
import { buildWeeklyReport, dayStatuses, latestCompletedWeek, mondayOf, weekRating } from '@/lib/weeklyReport';

/**
 * 91C / 91C2 / 91C3 · Weekly report — three readings of a closed week behind
 * one standing head: where the recovery rating went, which days held, and the
 * urges.
 * `Settings Weekly Report` (93D) is this same board opened from Settings
 * (`?from=settings`); the frame no longer names where it came from.
 */

const PAGES = ['Rating', 'Days', 'Urges'] as const;

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

  // a `?week=` that is not a real week is a stale or broken link: the latest week instead
  const weekStart = weekParam(week) ?? (user ? latestCompletedWeek(user, now) : null);
  const report = useMemo(
    () => (weekStart && checkins && events ? buildWeeklyReport(weekStart, checkins, events) : null),
    [weekStart, checkins, events],
  );
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/dashboard'));

  if (checkins === undefined || events === undefined || user === undefined || progress === undefined) return <LoadingView onBack={back} />;

  // the programme's first day bounds the week (src/lib/day.ts)
  const start = user ?? now;
  const statuses = report ? dayStatuses(report.weekStart, events, start, now) : [];
  const lived = statuses.filter((s) => s !== 'none').length;

  // The report draws the rating, the days and the urges — all three exist for
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
            ? 'Nothing was logged that week.'
            : 'Your first report comes after a full week. Keep checking in.'}
        </MonoText>
      </Screen>
    );
  }

  // the recovery rating as each day of the week closed, and the week's move
  // against the Sunday before (src/lib/score.ts — a lesson with no date is in no window)
  const rating = weekRating(report.weekStart, { checkins, events, lessons: lessonCompletions(progress), start });

  const clean = statuses.filter((s) => s === 'clean' || s === 'ridden').length;
  const prevKey = shiftKey(report.weekStart, -7);
  const lastWeek = dayStatuses(prevKey, events, start, now).map((s) => s === 'clean' || s === 'ridden');

  const startMs = keyToDate(report.weekStart).getTime();
  const endMs = addDays(startMs, 7).getTime();
  // the week read forward — the Log reads newest first, a closed week reads in order
  const urges = events.filter((e) => isUrge(e) && e.createdAt >= startMs && e.createdAt < endMs).sort((a, b) => a.createdAt - b.createdAt);
  const ridden = urges.filter((e) => e.type === 'urge_rode_out').length;
  const urgeCaption = !urges.length
    ? 'Urges this week'
    : `${urges.length === 1 ? 'Urge' : 'Urges'}, ${ridden === urges.length ? (ridden === 1 ? 'ridden out' : 'all ridden out') : `${ridden} ridden out`}`;
  const openOverview = () => router.push(`/urge-overview?week=${report.weekStart}`);

  return (
    <PagedRegister title="Weekly report" pill={report.label} onBack={back} items={PAGES} page={page} onPage={setPage}>
      {/* 91C · the recovery rating, day by day, on its fixed 0–100 */}
      <PaneBody height={y(352) + 140 + 8}>
        <BigStat top={y(236)} value={String(rating.rating)} caption={`Recovery rating, ${signed(rating.delta)} this week`} />
        <ScoreLine top={y(352)} values={rating.days} scale={RATING_SCALE} />
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
