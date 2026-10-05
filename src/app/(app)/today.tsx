import { useRouter } from 'expo-router';
import { useId, useState, type ReactNode } from 'react';
import { Platform, ScrollView, Share, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

import {
  Bolt,
  Card,
  CheckDisc,
  CheckinDisc,
  ChevronR,
  DISABLED_OPACITY,
  Hero,
  LoadingView,
  MonoText,
  Person,
  Pill,
  PledgeCard,
  Screen,
  Tap,
  useTabBarHeight,
} from '@/components/mono';
import { CURRICULUM_84_DAYS, lessonForDay, type Curriculum84Lesson } from '@/content/curriculum84';
import type { HeroKey } from '@/content/heroes';
import { useCheckins, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap, useUpsertCheckin } from '@/lib/backend';
import { checkinPartNow } from '@/lib/routines';
import { buildScore, lastDays, scoreDayKey, scoreHistory } from '@/lib/score';
import { lhNormal, mono, ring, sans, toneRamp } from '@/lib/theme';

/**
 * Today — Today Home, Today Home II / Today Home Task, Today Home III.
 *
 * The four frames share the header (greeting, day pill, profile door) and the
 * Sunday-first week strip, pixel for pixel; only the band between the strip
 * (199) and the tab bar (748) changes. That band is the three-page vertical
 * pager this screen always was, re-dealt: page one is the score and this
 * morning's readings, page two the day's task, its lesson and the urge door,
 * page three the pledge and tonight's urge door. Every y below is the canvas's;
 * a page's children subtract the pager's top (200).
 *
 * The old night-sky score card, the thirty-dot strip, the paper lesson and
 * task cards, the paper pledge and the pinned urge bar are gone (D324: the SOS
 * disc and the two "Urge surfing" doors replace the bar).
 */

/** The pager's top: the week strip ends at 199. */
const PAGER_TOP = 200;
/**
 * Where each page's content ends, page-relative, as the frames draw it: the
 * chips at 694, the tiles at 703, the Tonight card at 718 (less 200). Measured
 * once laid out, so a sentence or pledge that wraps further moves its own page's
 * end; these are the first render's.
 */
const PAGE_ENDS = [494, 503, 518];
/** The least ground kept between a page's content and the tab bar (the frames keep 30–54; Today II's gap between blocks is 20). */
const BAR_GAP = 20;

const MOOD_WORD = ['Heavy', 'Low', 'Fine', 'Good', 'Clear'];
const ENERGY_WORD = ['Empty', 'Low', 'Steady', 'Good', 'Full'];
/**
 * The check-in chip draws its tone a rung lighter than the check-in's own disc
 * (Today Home: mood 3, "Fine", `#BAB5AD`; Morning Feeling draws the same answer
 * `#8A857D`), so the darkest rung still reads on the `#1E1E1E` chip; the top two
 * rungs share the ink (D231).
 */
const CHIP_TONE = [toneRamp[1], toneRamp[2], toneRamp[3], toneRamp[4], toneRamp[4]];

type DayStep = { caption: string; hero: HeroKey };

/**
 * The steps the task falls back on when nobody has named the day's action and
 * the course has no lesson for the day. The first is the one Today Home II
 * draws ("hard to reach" — the frame's words; the old card said "difficult to
 * access"); each now carries an illustration instead of its old drawn night.
 * Each is one whose art fills the crop's width at 375–430 (or has no floor to
 * fill it): the open door's floor line, cropped, stops 11 short of both edges
 * at 393, so "get outside" draws the park bench.
 */
const DAY_STEPS: DayStep[] = [
  { caption: 'Put your phone somewhere hard to reach before you sleep.', hero: 'nightPhone' },
  { caption: 'Drink a full glass of water before anything else.', hero: 'twoCups' },
  { caption: 'Get outside for ten minutes, even if it is only around the block.', hero: 'bench' },
  { caption: 'Write down what set it off, in the words you would say out loud.', hero: 'notebook' },
  { caption: 'Make the bed now, so tonight you walk into a room that is ready.', hero: 'bed' },
];

/**
 * A named action keeps the register and the picture of whatever set it. The
 * night check-in names tomorrow's action from the day's lesson (D236), so a
 * named action that is a lesson's task is still that lesson's — its title in
 * the label, its hero, its task page behind the sentence (D232). Anything else
 * (a fallback step, an older hand-named action) is the generic register.
 */
function namedTask(action: string): Task {
  const lesson = CURRICULUM_84_DAYS.find((l) => l.task.cardSummary === action);
  if (lesson) return { caption: action, hero: lesson.hero, lesson };
  return { caption: action, hero: DAY_STEPS.find((s) => s.caption === action)?.hero ?? 'notebook' };
}

const WEEKDAY = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function Today() {
  const router = useRouter();
  const user = useCurrentUser();
  const progress = useLessonProgressMap();
  const checkins = useCheckins();
  const events = useEvents();
  const journal = useJournalEntries();
  const upsertCheckin = useUpsertCheckin();
  const insets = useSafeAreaInsets();
  const winH = useWindowDimensions().height;
  const tabBar = useTabBarHeight();
  // Read once on mount: the day count and today's key must not shift under a
  // re-render while the screen is open.
  const [now] = useState(() => Date.now());
  const [ends, setEnds] = useState(PAGE_ENDS);
  const endAt = (i: number) => (y: number) => setEnds((e) => (Math.abs(e[i] - y) < 0.5 ? e : e.map((v, j) => (j === i ? y : v))));

  if (progress === undefined || checkins === undefined || events === undefined) {
    return <LoadingView spinner={false} />;
  }

  // The viewport is computed rather than measured: onLayout on web settles a
  // frame late and the first page would render at its natural height. The
  // scene ends at the bar's top; the Screen's canvas box starts 54 above the
  // safe-area top. Each page fills the viewport (548 at 852 — the frames' 200 →
  // 748) and grows past it only when its own content needs more (a 667 phone, a
  // pledge that wraps to three lines), so the pager always snaps page to page
  // and a taller page scrolls within itself before the next one (D230, D320).
  const viewport = winH - tabBar - (insets.top - 54) - PAGER_TOP;
  const pageH = ends.map((e) => Math.max(viewport, Math.ceil(e) + BAR_GAP));
  // Native snaps to each page's top and, for a page taller than the viewport,
  // to its foot as well; the web build pages with CSS scroll snap, which lets an
  // oversized page scroll within itself (`snapToOffsets` overrides `pagingEnabled`
  // on native).
  const offsets: number[] = [];
  pageH.reduce((top, h) => {
    offsets.push(top);
    if (h > viewport) offsets.push(top + h - viewport);
    return top + h;
  }, 0);

  const createdAt = user?.createdAt ?? now;
  const day = user?.createdAt ? Math.max(1, Math.floor((now - user.createdAt) / 86_400_000) + 1) : 1;
  const lessonsDone = Object.values(progress).filter((p) => p?.status === 'completed').length;
  const score = buildScore(checkins, events, lessonsDone, user?.createdAt);
  const series = lastDays(scoreHistory(checkins, events, progress, createdAt, now, score.total), 30);

  const todayKey = scoreDayKey(now);
  const todayCheckin = checkins.find((c) => c.date === todayKey);
  const moodIdx = todayCheckin?.mood != null ? Math.max(0, Math.min(4, todayCheckin.mood - 1)) : null;
  const energyIdx = todayCheckin?.energy != null ? Math.max(0, Math.min(4, todayCheckin.energy - 1)) : null;
  const pledge = (journal ?? []).find((entry) => entry.tag === 'Pledge');
  const name = user?.displayName?.trim().split(/\s+/)[0];

  // The week strip, Sunday first (Today Home draws `Su … Sa`; the Log's strip
  // is Monday-first — CRITIC C16). A past day is held unless a slip landed on
  // it or the account did not exist yet; today fills once the night check-in
  // has filed it (Today Home III, D231).
  const lapsed = new Set(events.filter((e) => e.type === 'lapse').map((e) => scoreDayKey(e.createdAt)));
  const firstDay = new Date(createdAt).setHours(0, 0, 0, 0);
  const n = new Date(now);
  const closed = !!(todayCheckin?.emotions?.length || todayCheckin?.reasons?.length);
  const week: WeekDay[] = WEEKDAY.map((label, i) => {
    const at = new Date(n.getFullYear(), n.getMonth(), n.getDate() - n.getDay() + i);
    const t = at.getTime();
    const held = t >= firstDay && !lapsed.has(scoreDayKey(t));
    const state: WeekDay['state'] = i < n.getDay() ? (held ? 'held' : 'open') : i === n.getDay() ? (closed ? 'held' : 'today') : 'open';
    return { label, date: at.getDate(), state, today: i === n.getDay() };
  });

  // The day's one action. The night check-in names it and files it under the
  // day it is *for*, so by the time it reaches Today it is simply today's.
  // Without one, the day's lesson sets it in the lesson's register (Today Home
  // Task); past the course, the day's own step (Today Home II's register).
  const dayLesson = lessonForDay(day);
  const task: Task = todayCheckin?.dailyAction
    ? namedTask(todayCheckin.dailyAction)
    : dayLesson
      ? { caption: dayLesson.task.cardSummary, hero: dayLesson.hero, lesson: dayLesson }
      : DAY_STEPS[(day - 1) % DAY_STEPS.length];
  const taskDone = todayCheckin?.dailyActionDone ?? false;
  const toggleTask = () => void upsertCheckin({ date: todayKey, dailyActionDone: !taskDone });
  // The sentence opens a task page whenever the course has one to open: the
  // lesson that set the task, else the day's own lesson — as the old card opened
  // `/task/<day>` for any task on a lesson day (D324). Only past the course,
  // with no page behind it, is the sentence the done mark too.
  const taskLesson = task.lesson ?? dayLesson;

  return (
    <Screen>
      <Header greeting={checkinPartNow(n) === 'morning' ? 'Good morning.' : 'Good evening.'} day={day} onProfile={() => router.push('/(app)/settings')} />
      <WeekStrip days={week} />

      <View style={{ position: 'absolute', left: 0, right: 0, top: PAGER_TOP, bottom: 0 }}>
        <ScrollView
          pagingEnabled={Platform.OS === 'web'}
          snapToOffsets={Platform.OS === 'web' ? undefined : offsets}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={{ flex: 1 }}>
          <View style={{ height: pageH[0] }}>
            <PageOne
              score={score}
              series={series}
              mood={moodIdx}
              energy={energyIdx}
              onScore={() => router.push('/score')}
              onMorning={() => router.push('/day/morning')}
              onEnd={endAt(0)}
            />
          </View>
          <View style={{ height: pageH[1] }}>
            <PageTwo
              task={task}
              done={taskDone}
              lesson={dayLesson}
              opensTask={!!taskLesson}
              onTask={() => (taskLesson ? router.push(`/lesson/day/${taskLesson.day}?page=task`) : toggleTask())}
              onCheck={toggleTask}
              onLesson={() => (dayLesson ? router.push(`/lesson/day/${dayLesson.day}`) : router.push('/lessons-browser'))}
              onUrge={() => router.push('/urge-hub')}
              onEnd={endAt(1)}
            />
          </View>
          <View style={{ height: pageH[2] }}>
            <PageThree
              onEnd={endAt(2)}
              pledge={pledge?.body}
              name={name}
              onAdd={() =>
                router.push({
                  pathname: '/journal-new',
                  params: { tag: 'Pledge' },
                })
              }
              onSaved={() => router.push('/(app)/journal')}
              onShare={() => (pledge?.body ? void Share.share({ message: pledge.body }).catch(() => {}) : undefined)}
              onUrge={() => router.push('/urge-hub')}
            />
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

/* ---------------------------------------------------------------- the header */

/**
 * `left 24 right 24 top 64`: the greeting, then the day pill and the profile
 * door (gap 10). The pill counts the day (today-day OQ-T1: the frame's 41 is
 * the account's day number, and a streak stays opt-in — invariant #1), so the
 * old "Day 41" heading lives here now. The avatar is the frame's outline ring
 * and glyph; it opens Settings, as the old person glyph did.
 */
function Header({ greeting, day, onProfile }: { greeting: string; day: number; onProfile: () => void }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top: 64, height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <MonoText v="greeting">{greeting}</MonoText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pill kind="streak" label={String(day)} accessibilityLabel={`Day ${day}`} />
        <Tap
          label="Open settings"
          onPress={onProfile}
          hitSlop={4}
          style={{ width: 40, height: 40, borderRadius: 20, boxShadow: ring.outline, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Person />
        </Tap>
      </View>
    </View>
  );
}

type WeekDay = { label: string; date: number; state: 'held' | 'today' | 'open'; today: boolean };

/**
 * `left 24 right 24 top 136`, seven 36-wide columns spread `space-between`: the
 * day (12px; today 700 ink) over a 36 disc, gap 12. Held — the ink disc with a
 * 14 check; today, still open — the ink ring and the date; anything else (a
 * day to come, a slip, a day before the account) — the line ring and a muted
 * date (D231).
 */
function WeekStrip({ days }: { days: WeekDay[] }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top: 136, flexDirection: 'row', justifyContent: 'space-between' }}>
      {days.map((d) => (
        <View key={d.label} accessibilityLabel={`${d.label} ${d.date}${d.state === 'held' ? ', held' : ''}`} style={{ alignItems: 'center', gap: 12 }}>
          <MonoText
            v="caps"
            color={d.today ? mono.ink : mono.mute}
            style={{
              ...sans(d.today ? '700' : '400'),
              fontSize: 12,
              lineHeight: lhNormal(12),
            }}>
            {d.label}
          </MonoText>
          {d.state === 'held' ? (
            <CheckDisc size={36} />
          ) : (
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                boxShadow: d.state === 'today' ? ring.outlineInk : ring.outline,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MonoText v="pill" color={d.state === 'today' ? mono.ink : mono.mute} style={{ fontSize: 14, lineHeight: lhNormal(14) }}>
                {d.date}
              </MonoText>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ page one */

/** The page's children are in canvas y less the pager's top. */
const py = (y: number) => y - PAGER_TOP;

function PageOne({
  score,
  series,
  mood,
  energy,
  onScore,
  onMorning,
  onEnd,
}: {
  score: ReturnType<typeof buildScore>;
  series: number[];
  mood: number | null;
  energy: number | null;
  onScore: () => void;
  onMorning: () => void;
  /** where the page's content ends (page y) */
  onEnd: (y: number) => void;
}) {
  return (
    <>
      {/* the number and its chart are one door into Score Detail (240 → 584) */}
      <Tap
        label={`Recovery score ${score.total.toLocaleString('en-US')}`}
        onPress={onScore}
        style={{ position: 'absolute', left: 24, right: 24, top: py(240), height: 344 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View style={{ gap: 12 }}>
            <MonoText v="caps">Recovery score</MonoText>
            <MonoText v="statValue" style={{ fontSize: 56, lineHeight: 56, letterSpacing: -0.5 }}>
              {score.total.toLocaleString('en-US')}
            </MonoText>
          </View>
          {/* today's own contribution; nothing is drawn on a day that has not moved it */}
          {score.delta !== 0 ? <Pill kind="delta" label={String(Math.abs(score.delta))} down={score.delta < 0} style={{ marginBottom: 8 }} /> : null}
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 94 }}>
          <ThirtyDays series={series} />
        </View>
      </Tap>

      <View style={{ position: 'absolute', left: 24, right: 24, top: py(622) }}>
        <MonoText v="caps" style={{ lineHeight: 16 }}>
          This morning
        </MonoText>
      </View>
      <View
        onLayout={(e) => onEnd(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}
        style={{ position: 'absolute', left: 24, right: 24, top: py(650), flexDirection: 'row', gap: 10 }}>
        {mood == null ? (
          // no frame draws the morning before its check-in: one chip that opens it, in the cover's words
          <Pill kind="checkin" label="Morning check-in" lead={<CheckinDisc />} onPress={onMorning} />
        ) : (
          <>
            <Pill
              kind="checkin"
              label={MOOD_WORD[mood]}
              lead={<CheckinDisc tone={CHIP_TONE[mood]} />}
              onPress={onMorning}
              accessibilityLabel={`This morning: ${MOOD_WORD[mood]}`}
            />
            {energy != null ? <Pill kind="checkin" label={`${ENERGY_WORD[energy]} energy`} lead={<CheckinDisc icon={<Bolt />} />} onPress={onMorning} /> : null}
          </>
        )}
      </View>
    </>
  );
}

const round1 = (v: number) => Math.round(v * 10) / 10;
/** Today Home's band: the lowest of the thirty days sits at 210.6, the highest 172.7 above it. */
const CHART_LOW = 210.6;
const CHART_SPAN = 172.7;

/**
 * The last thirty days (`left 24 top 334`, 345 × 250 at 393): three dashed
 * rules, the area under the line in a fading ink, the line (straight segments,
 * stroke 3) and an end ring on today. x steps `(W − 64) / 29` to one decimal —
 * the frame's own 11.3, 22.7 … 329 — and y maps the series' own range onto the
 * band, so the newest high lands where the frame's does (a flat or one-day
 * series lies on the band's floor — today-day OQ-T3).
 */
function ThirtyDays({ series }: { series: number[] }) {
  const id = useId().replace(/:/g, '');
  const W = useWindowDimensions().width - 48;
  const run = W - 16;
  const lo = Math.min(...series);
  const hi = Math.max(...series);
  const pts = series.map((v, i) => [round1((i * run) / (series.length - 1)), round1(CHART_LOW - (hi === lo ? 0 : ((v - lo) / (hi - lo)) * CHART_SPAN))] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const [ex, ey] = pts[pts.length - 1];
  const label = sans('700').fontFamily;
  return (
    <Svg width={W} height={250} viewBox={`0 0 ${W} 250`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <Defs>
        <LinearGradient id={`scoreFill${id}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={mono.ink} stopOpacity={0.22} />
          <Stop offset="1" stopColor={mono.ink} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {[70, 130, 190].map((y) => (
        <Path key={y} d={`M0 ${y}H${W}`} stroke={mono.line} strokeWidth={1} strokeDasharray="2 5" />
      ))}
      <Path d={`${line} L${ex} 232 L0 232 Z`} fill={`url(#scoreFill${id})`} />
      <Path d={line} fill="none" stroke={mono.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={ex} cy={ey} r={7} fill={mono.ground} stroke={mono.ink} strokeWidth={3} />
      {/* the frame asks for 600, which the canvas never loads: its browser drew 700 */}
      <SvgText x={0} y={246} fill={mono.mute} fontSize={12} fontFamily={label}>
        30 days ago
      </SvgText>
      <SvgText x={W} y={246} fill={mono.ink} textAnchor="end" fontSize={12} fontFamily={label}>
        Today
      </SvgText>
    </Svg>
  );
}

/* ------------------------------------------------------------------ page two */

type Task = DayStep & { lesson?: Curriculum84Lesson };

/**
 * Today Home II (the generic register: "Today’s task", 20/27) and Today Home
 * Task (the lesson's: "Today’s task: <lesson title>", 17/24): the day's hero
 * cropped at 241.3, the task row at 433 and the two tiles at 553.
 *
 * The sentence opens a task page whenever the course has one (the lesson that
 * set the task, else the day's — D324, as the old card did on any lesson day);
 * the 52 disc is the done mark either way — `dailyActionDone` on today's row,
 * which the morning check-in asks after. Past the course the sentence is that
 * mark too, as the old card was.
 */
function PageTwo({
  task,
  done,
  lesson,
  opensTask,
  onTask,
  onCheck,
  onLesson,
  onUrge,
  onEnd,
}: {
  task: Task;
  done: boolean;
  lesson: Curriculum84Lesson | undefined;
  /** the sentence opens a task page (else it toggles the mark) */
  opensTask: boolean;
  onTask: () => void;
  onCheck: () => void;
  onLesson: () => void;
  onUrge: () => void;
  onEnd: (y: number) => void;
}) {
  const lessonRegister = !!task.lesson;
  return (
    <>
      <Hero mode="crop" id={task.hero} top={py(241.3)} />

      {/* a column, so a sentence that wraps further on a narrow phone pushes the
          tiles down (≥ 20 under it) instead of running into them; at 393 the
          task row's band is the frame's 433 → 553 */}
      <View onLayout={(e) => onEnd(e.nativeEvent.layout.y + e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: py(433) }}>
        <View style={{ minHeight: 553 - 433, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <Tap label={opensTask ? 'Open today’s task' : undefined} onPress={onTask} style={{ flex: 1, minWidth: 0, gap: 6 }}>
              <MonoText v="caps" wrap="wrap">
                {task.lesson ? `Today’s task: ${task.lesson.title}` : 'Today’s task'}
              </MonoText>
              <MonoText
                v="p"
                wrap="pretty"
                style={{
                  ...sans('700'),
                  color: mono.ink,
                  letterSpacing: -0.4,
                  ...(lessonRegister ? { fontSize: 17, lineHeight: 24 } : { fontSize: 20, lineHeight: 27 }),
                }}>
                {task.caption}
              </MonoText>
            </Tap>
            <Tap label="Today’s task done" accessibilityRole="checkbox" aria-checked={done} onPress={onCheck} hitSlop={8} style={{ flexShrink: 0 }}>
              {done ? <CheckDisc size={52} /> : <View style={{ width: 52, height: 52, borderRadius: 26, boxShadow: ring.outlineInk }} />}
            </Tap>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* the frames' "Lesson 5 / Naming your triggers" is a mock (D132); the tile carries the day's lesson, numbered as the course numbers it (1–84) */}
          <Tile glyph={<BookGlyph />} caps={lesson ? `Lesson ${lesson.day}` : 'Week I'} title={lesson?.title ?? 'Start the first lesson'} onPress={onLesson} />
          <Tile glyph={<WavesGlyph />} caps="Ride it out" title="Urge surfing" onPress={onUrge} />
        </View>
      </View>
    </>
  );
}

function Tile({ glyph, caps, title, onPress }: { glyph: ReactNode; caps: string; title: string; onPress: () => void }) {
  return (
    <Card variant="tile" onPress={onPress} accessibilityLabel={`${caps}. ${title}`} style={{ flex: 1, minWidth: 0 }}>
      {glyph}
      <View style={{ gap: 4 }}>
        <MonoText v="caps" wrap="wrap" style={{ fontSize: 12, lineHeight: lhNormal(12) }}>
          {caps}
        </MonoText>
        <MonoText v="gridLabel" wrap="wrap" style={{ letterSpacing: -0.2, lineHeight: 20 }}>
          {title}
        </MonoText>
      </View>
    </Card>
  );
}

const GLYPH28 = { fill: 'none', stroke: mono.ink, strokeWidth: 1.8 } as const;

/** The tile's book — the Library tab's glyph, drawn at 28. */
function BookGlyph() {
  return (
    <Svg width={28} height={28} viewBox="0 0 26 26">
      <Path d="M13 6.5C11 5 8 4.5 4 4.5v15c4 0 7 .5 9 2 2-1.5 5-2 9-2v-15c-4 0-7 .5-9 2z M13 6.5v15" {...GLYPH28} strokeLinejoin="round" />
    </Svg>
  );
}

function WavesGlyph() {
  return (
    <Svg width={28} height={28} viewBox="0 0 26 26">
      <Path d="M3 15c3 0 3-4 6-4s3 4 6 4 3-4 6-4M3 20c3 0 3-4 6-4s3 4 6 4 3-4 6-4" {...GLYPH28} strokeLinecap="round" />
    </Svg>
  );
}

/* ---------------------------------------------------------------- page three */

const ICON18 = { fill: 'none', stroke: mono.ink, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/**
 * Today Home III: nightMoon cropped at 231.5, the pledge (`PledgeCard
 * plain`) at 413 with its three 42 rings, and tonight's urge door at 595/623.
 *
 * The rings have no drawn targets (today-day OQ-T5): + writes a new pledge
 * (the journal editor, tagged Pledge — the newest Pledge entry is the standing
 * one), ☆ opens the past pledges (the old card's door), and share shares the
 * line (D233). No frame draws the block before any pledge exists: the
 * pledge's line then holds the app's own "Write a pledge" (the All drawer's
 * words) in the mute, and opens the editor as + does; share has nothing to
 * share and is dimmed.
 */
function PageThree({
  pledge,
  name,
  onAdd,
  onSaved,
  onShare,
  onUrge,
  onEnd,
}: {
  pledge?: string;
  name?: string;
  onAdd: () => void;
  onSaved: () => void;
  onShare: () => void;
  onUrge: () => void;
  onEnd: (y: number) => void;
}) {
  const ringBtn = (d: string, label: string, onPress: () => void, disabled?: boolean) => (
    <Tap
      key={label}
      label={label}
      onPress={onPress}
      disabled={disabled}
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        boxShadow: ring.outline,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? DISABLED_OPACITY : 1,
      }}>
      <Svg width={18} height={18} viewBox="0 0 18 18">
        <Path d={d} {...ICON18} />
      </Svg>
    </Tap>
  );
  const rings = (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
      {ringBtn('M3 9h12M9 3v12', 'New pledge', onAdd)}
      {ringBtn('M9 3l1.8 3.8 4.2.6-3 3 .7 4.2L9 12.6l-3.7 2 .7-4.2-3-3 4.2-.6z', 'Past pledges', onSaved)}
      {ringBtn('M9 11V3M6 6l3-3 3 3M4 11v3h10v-3', 'Share', onShare, !pledge)}
    </View>
  );
  return (
    <>
      <Hero mode="crop" id="nightMoon" top={py(231.5)} />

      {/* a column, as on page two: a pledge that wraps pushes "Tonight" down
          (≥ 24 under the rings); at 393 the block's band is the frame's 413 → 595 */}
      <View onLayout={(e) => onEnd(e.nativeEvent.layout.y + e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: py(413) }}>
        <View style={{ minHeight: 595 - 413, paddingBottom: 24 }}>
          {pledge ? (
            <PledgeCard variant="plain" pledge={pledge} name={name}>
              {rings}
            </PledgeCard>
          ) : (
            // PledgeCard's plain column (caps, line, gap 10) with the line as the way in
            <View style={{ gap: 10 }}>
              <MonoText v="caps" style={{ lineHeight: 16 }}>
                Your pledge
              </MonoText>
              <Tap label="Write a pledge" onPress={onAdd} style={{ alignSelf: 'flex-start' }}>
                <MonoText style={{ ...sans('700'), fontSize: 22, lineHeight: 31, letterSpacing: -0.3, color: mono.mute }}>Write a pledge</MonoText>
              </Tap>
              {rings}
            </View>
          )}
        </View>

        <MonoText v="caps" style={{ lineHeight: 16 }}>
          Tonight
        </MonoText>
        <Card padding={[18, 20]} onPress={onUrge} accessibilityLabel="Urge surfing" style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Svg width={26} height={26} viewBox="0 0 26 26">
              <Circle cx={13} cy={15} r={8} fill="none" stroke={mono.onInk} strokeWidth={2.4} strokeLinecap="round" />
              <Path d="M13 15V10M13 3h0M10 3h6M13 3v4" fill="none" stroke={mono.onInk} strokeWidth={2.4} strokeLinecap="round" />
            </Svg>
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            <MonoText v="gridLabel" wrap="wrap" style={{ fontSize: 18, lineHeight: lhNormal(18) }}>
              Urge surfing
            </MonoText>
            <MonoText v="p" wrap="pretty" style={{ fontSize: 14, lineHeight: lhNormal(14) }}>
              Five minutes. Ride the next one out.
            </MonoText>
          </View>
          <ChevronR />
        </Card>
      </View>
    </>
  );
}
