import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';

import {
  BigStat,
  CountDay,
  dayWord,
  EmptyDay,
  entryRead,
  entryWhen,
  isUrge,
  ReadingDay,
  RegisterHead,
  signed,
  Spark,
  STRIP_LABELS,
  WeekStrip,
  type StripDay,
} from '@/components/logflow';
import { EmptyState, LoadingView, MonoText, RuledRow, RuledRows, Screen, Tap, useCanvasTop, useTabBarHeight } from '@/components/mono';
import { useCheckins, useCurrentUser, useEvents, useLessonProgressMap } from '@/lib/backend';
import { daysAgo, groupDigits } from '@/lib/format';
import { lhNormal, mono, sans } from '@/lib/theme';
import type { DailyCheckin, TidelineEvent } from '@/lib/types';
import { completedWeekStarts, mondayOf, weekLabel, weekScore } from '@/lib/weeklyReport';

/**
 * 91 / 91-2 / 91-3 · The log, in three registers — urges, check-ins and the
 * weekly reports — on one switch. Each opens on its big number and the week
 * under it, then the entries themselves as ruled rows, newest first. The whole
 * page scrolls, its head included; the tab bar (Log lit) is the navigator's.
 *
 * "This week" is the calendar week the strip draws, Monday to Sunday (CRITIC
 * §5, logs Q15) — not the last seven days.
 */

const TABS = [
  { key: 'urges' as const, label: 'Urges' },
  { key: 'checkins' as const, label: 'Check-ins' },
  { key: 'reports' as const, label: 'Reports' },
];
type LogTab = (typeof TABS)[number]['key'];

/** What the morning check-in's mood dial reads back (`day/morning.tsx`), the word a check-in row ends on. */
const MOOD_WORD = ['Rough', 'Low', 'Steady', 'Good', 'Great'];

const dateKey = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const keyToMs = (key: string) => new Date(`${key}T00:00:00`).getTime();

/** The page's rows already hang in the 24 gutter; the kit EmptyState brings its own, which doubled it (a 297 column at 393). */
const FLUSH = { paddingHorizontal: 0 };

/** The seven days of `now`'s week, Monday first, with the index of today. */
function thisWeek(now: number) {
  const monday = mondayOf(new Date(now));
  const days = Array.from({ length: 7 }, (_, i) => new Date(monday).setDate(monday.getDate() + i));
  return { days, today: days.findIndex((d) => daysAgo(d, now) === 0) };
}

/**
 * The canvas's page under its head: everything above `top` is absolutely
 * placed, the rows run in flow from it, and the whole page scrolls.
 *
 * The Urges and Check-ins frames draw five rows and nothing under them, though
 * twelve mornings in a row means twelve check-ins: where a phone shows at least
 * those five rows, the list's window ends at the last whole row (at 852 the
 * fifth's foot, 440 + 52 + 4 × 53 = 704, 44 above the bar) and the rest are a
 * scroll away. A shorter phone keeps its cut row — it is what says "scroll"
 * (D283). `ruled` turns this on: the 52 rows' list starts at `top`.
 */
function Page({ top, head, ruled, children }: { top: number; head: ReactNode; ruled?: boolean; children?: ReactNode }) {
  const { height } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const bar = useTabBarHeight();
  const bottom = height - canvasTop - bar;
  const whole = Math.floor((bottom - top - 52) / 53) + 1;
  const fold = ruled && whole >= 5 ? bottom - (top + 52 + (whole - 1) * 53) : 0;
  return (
    <ScrollView style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: fold }} contentContainerStyle={{ paddingBottom: ruled ? 0 : 24 }} showsVerticalScrollIndicator={false}>
      <View style={{ height: top }}>{head}</View>
      <View style={{ paddingHorizontal: 24 }}>{children}</View>
    </ScrollView>
  );
}

export default function Log() {
  const router = useRouter();
  const user = useCurrentUser();
  const events = useEvents();
  const checkins = useCheckins();
  const progress = useLessonProgressMap();
  const [tab, setTab] = useState<LogTab>('urges');
  // Read once on mount: re-reading it every render would let the week's edge
  // shift underneath the list while it is on screen.
  const [now] = useState(() => Date.now());

  if (events === undefined || checkins === undefined) return <LoadingView onBack={() => router.navigate('/log-chooser')} />;

  const head = (
    <RegisterHead title="Your log" onBack={() => router.navigate('/log-chooser')} items={TABS} value={tab} onChange={(key) => setTab(key)} />
  );

  if (tab === 'urges') return <Urges head={head} events={events} now={now} />;
  if (tab === 'checkins') return <Checkins head={head} checkins={checkins} now={now} />;
  return (
    <Reports
      head={head}
      createdAt={user?.createdAt}
      checkins={checkins}
      events={events}
      lessons={progress === undefined ? undefined : Object.values(progress).filter((p) => p.status === 'completed').map((p) => p.completedAt ?? 0)}
      now={now}
      onOpen={(week) => router.push(week ? `/weekly-report?week=${week}` : '/weekly-report')}
    />
  );
}

/* ------------------------------------------------------------------- 91 · urges */

function Urges({ head, events, now }: { head: ReactNode; events: TidelineEvent[]; now: number }) {
  const week = thisWeek(now);
  const end = new Date(week.days[6]).setDate(new Date(week.days[6]).getDate() + 1);
  const urges = events.filter(isUrge);
  const weekUrges = urges.filter((e) => e.createdAt >= week.days[0] && e.createdAt < end);
  const strip: StripDay[] = week.days.map((day, i) => {
    const n = weekUrges.filter((e) => daysAgo(e.createdAt, day) === 0).length;
    return { label: STRIP_LABELS[i], lit: i === week.today, mark: n ? <CountDay n={n} /> : <EmptyDay /> };
  });
  // every entry the log holds, a lapse included — it reads `Slipped`, never in red
  const rows = events.filter((e) => isUrge(e) || e.type === 'lapse').sort((a, b) => b.createdAt - a.createdAt);
  return (
    <Screen>
      <Page
        top={440}
        ruled
        head={
          <>
            {head}
            <BigStat value={String(weekUrges.length)} caption={weekUrges.length === 1 ? 'Urge this week' : 'Urges this week'} />
            <WeekStrip days={strip} />
          </>
        }>
        {rows.length ? (
          <RuledRows height={52}>
            {rows.map((e) => {
              const read = entryRead(e);
              return <RuledRow key={e._id} label={entryWhen(e.createdAt, now)} value={read.word} slipped={read.slipped} />;
            })}
          </RuledRows>
        ) : (
          <EmptyState title="No urges logged yet" body="When a wave hits, logging it is what turns it into data." style={FLUSH} />
        )}
      </Page>
    </Screen>
  );
}

/* --------------------------------------------------------------- 91-2 · check-ins */

/** The run of days with a check-in, back from today — or from yesterday while today's is still to come. */
function streak(checkins: DailyCheckin[], now: number): number {
  const days = new Set(checkins.map((c) => c.date));
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!days.has(dateKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
  let run = 0;
  while (days.has(dateKey(cursor.getTime()))) {
    run += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return run;
}

/**
 * How a day read: the first feeling the night check-in named (`Flat`, `Calm`),
 * else the morning's mood word (`Steady`, `Good`) — the two vocabularies the
 * frame's five rows mix (logs Q9).
 */
function readingWord(c: DailyCheckin): string | undefined {
  if (c.emotions?.length) return c.emotions[0];
  if (c.mood != null) return MOOD_WORD[Math.max(1, Math.min(5, Math.round(c.mood))) - 1];
  return undefined;
}

function Checkins({ head, checkins, now }: { head: ReactNode; checkins: DailyCheckin[]; now: number }) {
  const week = thisWeek(now);
  const byDate = new Map(checkins.map((c) => [c.date, c]));
  const strip: StripDay[] = week.days.map((day, i) => {
    const c = byDate.get(dateKey(day));
    // the circle's size is the day's energy (1–5), the reading the morning
    // check-in logs; a day logged without one reads its mood instead
    const v = c?.energy ?? c?.mood;
    return { label: STRIP_LABELS[i], lit: i === week.today, mark: c ? <ReadingDay v={v ?? 3} /> : <EmptyDay /> };
  });
  const run = streak(checkins, now);
  const rows = [...checkins].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <Screen>
      <Page
        top={440}
        ruled
        head={
          <>
            {head}
            <BigStat value={String(run)} caption={run === 1 ? 'Day in a row' : 'Days in a row'} />
            <WeekStrip days={strip} />
          </>
        }>
        {rows.length ? (
          <RuledRows height={52}>
            {rows.map((c) => (
              <RuledRow key={c.date} label={dayWord(keyToMs(c.date), now)} value={readingWord(c)} />
            ))}
          </RuledRows>
        ) : (
          <EmptyState title="No check-ins yet" body="Twenty seconds in the morning starts one." style={FLUSH} />
        )}
      </Page>
    </Screen>
  );
}

/* ---------------------------------------------------------------- 91-3 · reports */

function Reports({
  head,
  createdAt,
  checkins,
  events,
  lessons,
  now,
  onOpen,
}: {
  head: ReactNode;
  createdAt?: number;
  checkins: DailyCheckin[];
  events: TidelineEvent[];
  lessons?: number[];
  now: number;
  onOpen: (week?: string) => void;
}) {
  if (createdAt == null || lessons === undefined) return <LoadingView bare />;
  // newest first; each carries the score its week closed on and what it moved it by
  const weeks = completedWeekStarts(createdAt, now).map((key) => weekScore(key, createdAt, checkins, events, lessons));
  if (!weeks.length) {
    return (
      <Screen>
        <Page top={236} head={head}>
          <EmptyState title="No reports yet" body="The first one arrives once a full week has closed." style={[FLUSH, { paddingTop: 0 }]} />
        </Page>
      </Screen>
    );
  }
  const [latest, ...earlier] = weeks;
  return (
    <Screen>
      <Page
        top={518}
        head={
          <>
            {head}
            <BigStat value={groupDigits(latest.score)} caption={`${signed(latest.delta)} this week`} />
            {/* oldest first, so the line reads left to right the way the weeks ran */}
            <Spark values={[...weeks].reverse().map((w) => w.score)} />
            <Tap
              onPress={() => onOpen(latest.weekStart)}
              style={{ position: 'absolute', left: 24, right: 24, top: 432, height: 52, borderRadius: 26, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
              <MonoText v="pill" style={{ ...sans('700'), fontSize: 15, lineHeight: lhNormal(15) }} color={mono.onInk}>
                Open this week’s report
              </MonoText>
            </Tap>
          </>
        }>
        <RuledRows height={52}>
          {earlier.map((w) => (
            <RuledRow key={w.weekStart} label={weekLabel(w.weekStart)} value={signed(w.delta)} onPress={() => onOpen(w.weekStart)} accessibilityLabel={`${weekLabel(w.weekStart)}, ${signed(w.delta)}`} />
          ))}
        </RuledRows>
      </Page>
    </Screen>
  );
}

