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
import { ChevronR, EmptyState, LoadingView, MonoText, RuledRow, RuledRows, Screen, Tap, useCanvasTop, useTabBarHeight } from '@/components/mono';
import { useCheckins, useCurrentUser, useEvents, useLessonProgressMap } from '@/lib/backend';
import { toDateKey } from '@/lib/date';
import { closingNightKey, isMorningCheckin, isNightClosed, livedCheckins, moodWord, nightBeforeProgramme, useToday, type ProgrammeUser } from '@/lib/day';
import { daysAgo } from '@/lib/format';
import { checkinPartNow } from '@/lib/routines';
import { lhNormal, mono, sans } from '@/lib/theme';
import type { DailyCheckin, TidelineEvent } from '@/lib/types';
import { RATING_SCALE, lessonCompletions } from '@/lib/score';
import { completedWeekStarts, mondayOf, weekLabel, weekRating } from '@/lib/weeklyReport';

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
  // The screen's clock: still under a re-render, so the week's edge cannot
  // shift beneath the list, and on to the new day with focus, the foreground
  // and midnight (a tab stays mounted).
  const now = useToday();

  if (events === undefined || checkins === undefined) return <LoadingView onBack={() => router.navigate('/log-chooser')} />;

  const head = (
    <RegisterHead title="Your log" onBack={() => router.navigate('/log-chooser')} items={TABS} value={tab} onChange={(key) => setTab(key)} />
  );

  if (tab === 'urges') return <Urges head={head} events={events} now={now} />;
  if (tab === 'checkins') {
    return (
      <Checkins
        head={head}
        user={user}
        checkins={checkins}
        now={now}
        onCheckin={(part) => router.push(part === 'morning' ? '/day/morning' : '/day/night')}
      />
    );
  }
  return (
    <Reports
      head={head}
      user={user}
      checkins={checkins}
      events={events}
      lessons={progress === undefined ? undefined : lessonCompletions(progress)}
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
          <EmptyState title="No urges logged yet" body="Log each urge. In time, you’ll see the pattern." style={FLUSH} />
        )}
      </Page>
    </Screen>
  );
}

/* --------------------------------------------------------------- 91-2 · check-ins */

/**
 * The run of days with a check-in, back from today — or from yesterday while
 * today's is still to come. `checkins` are the lived ones (`livedCheckins`):
 * a row that only holds an action is not a check-in.
 */
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
  if (c.mood != null) return moodWord(c.mood);
  if (c.nightMood != null) return moodWord(c.nightMood);
  return undefined;
}

type Part = 'morning' | 'night';

function Checkins({
  head,
  user,
  checkins: all,
  now,
  onCheckin,
}: {
  head: ReactNode;
  /** the account: its programme start bounds the night the door reads */
  user?: ProgrammeUser | null;
  checkins: DailyCheckin[];
  now: number;
  onCheckin: (part: Part) => void;
}) {
  // only real check-ins, and never a day still to come — the night files the
  // next day's action on its row, which is not a check-in (L6)
  const checkins = livedCheckins(all, now);
  const week = thisWeek(now);
  const byDate = new Map(checkins.map((c) => [c.date, c]));
  const strip: StripDay[] = week.days.map((day, i) => {
    const c = byDate.get(dateKey(day));
    // the circle's size is the day's energy (1–5), the reading the morning
    // check-in logs; a day logged without one reads its mood instead
    const v = c?.energy ?? c?.mood ?? c?.nightMood;
    return { label: STRIP_LABELS[i], lit: i === week.today, mark: c ? <ReadingDay v={v ?? 3} /> : <EmptyDay /> };
  });
  const run = streak(checkins, now);
  const rows = [...checkins].sort((a, b) => (a.date < b.date ? 1 : -1));

  // The door to the check-in the clock says it is, while it is still to do.
  // The night one has no other door but the launch prompt and a reminder (L9).
  // It reads the same row the night flow writes (before 4:30, yesterday's),
  // asks whether the night flow closed it (the quick check-in's feelings
  // don't), and stays shut before the programme's first night.
  const part: Part = checkinPartNow(new Date(now));
  const dueKey = part === 'night' ? closingNightKey(user, now) : toDateKey(new Date(now));
  const due = all.find((c) => c.date === dueKey);
  const open = part === 'night' ? !nightBeforeProgramme(user, now) && !isNightClosed(due) : !isMorningCheckin(due);
  const door = open ? (
    <RuledRow label={part === 'night' ? 'Night check-in' : 'Morning check-in'} onPress={() => onCheckin(part)} accessibilityLabel={`Open the ${part} check-in`}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <MonoText v="rowValue">{part === 'night' ? 'Close the day' : 'Start the day'}</MonoText>
        <ChevronR color={mono.art} />
      </View>
    </RuledRow>
  ) : null;
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
            {door}
            {rows.map((c) => (
              <RuledRow key={c.date} label={dayWord(keyToMs(c.date), now)} value={readingWord(c)} />
            ))}
          </RuledRows>
        ) : (
          <>
            {door ? <RuledRows height={52}>{door}</RuledRows> : null}
            <EmptyState title="No check-ins yet" body="The first one takes two minutes." style={FLUSH} />
          </>
        )}
      </Page>
    </Screen>
  );
}

/* ---------------------------------------------------------------- 91-3 · reports */

function Reports({
  head,
  user,
  checkins,
  events,
  lessons,
  now,
  onOpen,
}: {
  head: ReactNode;
  /** the account — its programme start is where the weeks begin */
  user?: ProgrammeUser;
  checkins: DailyCheckin[];
  events: TidelineEvent[];
  lessons?: number[];
  now: number;
  onOpen: (week?: string) => void;
}) {
  if (user == null || lessons === undefined) return <LoadingView bare />;
  // newest first; each carries the recovery rating its week closed on and what it moved it by
  const input = { checkins, events, lessons, start: user };
  const weeks = completedWeekStarts(user, now).map((key) => weekRating(key, input));
  if (!weeks.length) {
    return (
      <Screen>
        <Page top={236} head={head}>
          <EmptyState title="No reports yet" body="The first one comes after a full week." style={[FLUSH, { paddingTop: 0 }]} />
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
            <BigStat value={String(latest.rating)} caption={`Recovery rating, ${signed(latest.delta)} last week`} />
            {/* oldest first, so the line reads left to right the way the weeks ran — on the rating's fixed 0–100 */}
            <Spark values={[...weeks].reverse().map((w) => w.rating)} scale={RATING_SCALE} />
            <Tap
              onPress={() => onOpen(latest.weekStart)}
              style={{ position: 'absolute', left: 24, right: 24, top: 432, height: 52, borderRadius: 26, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
              <MonoText v="pill" style={{ ...sans('700'), fontSize: 15, lineHeight: lhNormal(15) }} color={mono.onInk}>
                Open last week’s report
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

