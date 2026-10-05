import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import {
  bandOf,
  BigStat,
  Bubbles,
  clockHour,
  DAY_MS,
  Dial,
  DotRows,
  feelingsOf,
  Histogram,
  hourCounts,
  isSlip,
  isUrge,
  PagedRegister,
  PANE_TOP,
  PaneBody,
  peakWindow,
  tally,
  triggerNoun,
  triggersOf,
} from '@/components/logflow';
import { EmptyState, LoadingView, RuledRow, RuledRows } from '@/components/mono';
import { INTENSITY_BANDS } from '@/components/ui/IntensityBands';
import { useEvents } from '@/lib/backend';
import { shortDate } from '@/lib/format';
import type { TidelineEvent } from '@/lib/types';
import { weekLabel } from '@/lib/weeklyReport';

/**
 * 91A–91D · Urge overview — four readings of the same urges behind one head:
 * how many and how they ended, how strong they ran and what set them off, the
 * mood before them, and when and where they landed.
 *
 * The range is the last 30 days (the pill says so); the weekly report's Urges
 * page opens it on one week (`?week=`), and the pill then names that week.
 * Everything is counted from the log — a page with nothing to count says so.
 */

const PAGES = ['Overview', 'Strength', 'Mood', 'Timing'] as const;
const RANGE_DAYS = 30;
/** The summary lists the most recent five, as the frame draws five rows for nine urges (logs Q10). */
const SUMMARY_ROWS = 5;

const y = (canvasY: number) => canvasY - PANE_TOP;

/** How long a ridden urge ran, to the minute (at least one); `Ridden out` when it was never timed. */
function lasted(e: TidelineEvent): string {
  if (!e.durationSeconds) return 'Ridden out';
  return `${Math.max(1, Math.round(e.durationSeconds / 60))} min`;
}

/** The band most urges sat in; a tie goes to the lower band (the frame's 3-and-3 reads `Strong`). */
function modeBand(urges: TidelineEvent[]): { bins: number[]; band: number | null } {
  const bins = [0, 0, 0, 0, 0];
  for (const e of urges) if (e.severity != null) bins[bandOf(e.severity)] += 1;
  const top = Math.max(...bins);
  return { bins, band: top ? bins.indexOf(top) : null };
}

export default function UrgeOverview() {
  const router = useRouter();
  const params = useLocalSearchParams<{ week?: string }>();
  const events = useEvents();
  const [page, setPage] = useState(0);
  const [now] = useState(() => Date.now());

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/log'));
  if (events === undefined) return <LoadingView onBack={back} />;

  const start = params.week ? new Date(`${params.week}T00:00:00`).getTime() : now - RANGE_DAYS * DAY_MS;
  const end = params.week ? new Date(start).setDate(new Date(start).getDate() + 7) : now + 1;
  const urges = events.filter((e) => isUrge(e) && e.createdAt >= start && e.createdAt < end).sort((a, b) => b.createdAt - a.createdAt);
  const rode = urges.filter((e) => !isSlip(e)).length;
  // the empty pages keep the old line, with the range said the way the pill says it
  const span = params.week ? 'this week' : `in the last ${RANGE_DAYS} days`;
  const nothing = (what: string) => `Nothing logged ${span}, so there is no ${what} to read yet.`;

  const strength = modeBand(urges);
  const triggers = tally(triggersOf(urges)).slice(0, 4);
  const moods = tally(feelingsOf(urges)).slice(0, 4);
  const hours = hourCounts(urges);
  const peak = peakWindow(hours);
  const places = tally(urges.map((e) => e.precedingState?.location ?? e.note).filter((p): p is string => !!p)).slice(0, 3);

  return (
    <PagedRegister
      title="Urge overview"
      pill={params.week ? weekLabel(params.week) : `Last ${RANGE_DAYS} days`}
      onBack={back}
      items={PAGES}
      page={page}
      onPage={setPage}>
      {/* 91A · how many, and how each ended — newest first */}
      <PaneBody height={y(372) + Math.min(urges.length, SUMMARY_ROWS) * 53 + 8}>
        <BigStat top={y(236)} value={String(urges.length)} caption={`${urges.length === 1 ? 'Urge' : 'Urges'}, ${rode} ridden out`} />
        {urges.length ? (
          <RuledRows height={52} style={{ position: 'absolute', left: 24, right: 24, top: y(372) }}>
            {urges.slice(0, SUMMARY_ROWS).map((e) =>
              isSlip(e) ? <RuledRow key={e._id} label={shortDate(e.createdAt)} value="Slipped" slipped /> : <RuledRow key={e._id} label={shortDate(e.createdAt)} value={lasted(e)} />,
            )}
          </RuledRows>
        ) : (
          <EmptyState body={nothing('urge')} style={{ position: 'absolute', left: 0, right: 0, top: y(372), paddingVertical: 0 }} />
        )}
      </PaneBody>

      {/* 91B · how strong they ran, and what set them off */}
      <PaneBody height={y(524) + triggers.length * 47 + 8}>
        {strength.band != null ? (
          <>
            <BigStat top={y(236)} word value={INTENSITY_BANDS[strength.band].label} caption="Most urges" />
            <Histogram top={y(352)} bins={strength.bins} />
            <DotRows top={y(524)} rows={triggers.map(([label, n]) => [triggerNoun(label), n])} />
          </>
        ) : (
          <EmptyState body={nothing('pattern')} style={{ position: 'absolute', left: 0, right: 0, top: y(236), paddingVertical: 0 }} />
        )}
      </PaneBody>

      {/* 91C · the mood that came first — the picker's words can take the big
          word to two lines, so the page flows from 236 and the bubbles follow */}
      {moods.length ? (
        <PaneBody height={y(500)} flowTop={y(236)}>
          <BigStat flow word value={moods[0][0]} caption="Before most urges" />
          <Bubbles flow items={moods} />
        </PaneBody>
      ) : (
        <PaneBody height={y(500)}>
          <EmptyState body={nothing('mood pattern')} style={{ position: 'absolute', left: 0, right: 0, top: y(236), paddingVertical: 0 }} />
        </PaneBody>
      )}

      {/* 91D · when and where — no big number on this page */}
      <PaneBody height={y(540) + Math.max(1, places.length) * 47 + 8}>
        {urges.length ? (
          <>
            <Dial top={y(248)} hours={hours} peak={peak == null ? null : `${clockHour(peak)} – ${clockHour(peak + 2)}`} />
            {places.length ? (
              <DotRows top={y(540)} rows={places} />
            ) : (
              <EmptyState body={nothing('place')} style={{ position: 'absolute', left: 0, right: 0, top: y(540), paddingVertical: 0 }} />
            )}
          </>
        ) : (
          <EmptyState body={nothing('timing')} style={{ position: 'absolute', left: 0, right: 0, top: y(236), paddingVertical: 0 }} />
        )}
      </PaneBody>
    </PagedRegister>
  );
}
