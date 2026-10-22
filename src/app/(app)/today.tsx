import { useRouter } from 'expo-router';
import { useId, useRef, useState, type ReactNode } from 'react';
import { Platform, ScrollView, Share, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

import { CountUpText, DrawPath,
  Bolt,
  Card,
  CheckCircle,
  CheckDisc,
  CheckinDisc,
  ChevronR,
  DISABLED_OPACITY,
  Glyph,
  Hero,
  heroCrop,
  LoadingView,
  MonoText,
  Person,
  Pill,
  PledgeCard,
  QuoteMark,
  Screen,
  Sun,
  Tap,
  useCanvasTop,
  useTabBarHeight,
} from '@/components/mono';
import { DAY_STEPS, dayStep, type DayStep } from '@/components/day/kit';
import { HarnessPages } from '@/dev/HarnessPages';
import { CURRICULUM_84_DAYS, lessonForDay, type Curriculum84Lesson } from '@/content/curriculum84';
import { useCheckins, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap, useUpsertCheckin } from '@/lib/backend';
import { ENERGY_WORDS, MOOD_WORDS, closingNightKey, courseComplete, greetingFor, programmeDay, useToday } from '@/lib/day';
import { toDateKey } from '@/lib/date';
import { computeRating, currentStreak, dayMark, lessonCompletions, ratingChange, ratingHistory, type DayMark, type Rating, type RatingInput } from '@/lib/score';
import { lhNormal, mono, ring, sans, toneRamp } from '@/lib/theme';
import { pledgeText, standingPledge } from '@/lib/pledge';

/**
 * Today — Today Home, Today Home II / Today Home Task, Today Home III.
 *
 * The four frames share the header (greeting, streak pill, profile door) and the
 * Sunday-first week strip, pixel for pixel; only the band between the strip
 * (199) and the tab bar (748) changes. That band is the three-page vertical
 * pager this screen always was, re-dealt: page one is the rating and this
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

/** The morning's answers in the words the check-in itself used (one list per scale, `src/lib/day.ts`). */
const MOOD_WORD = MOOD_WORDS;
const ENERGY_WORD = ENERGY_WORDS;
/**
 * The check-in chip draws its tone a rung lighter than the check-in's own disc
 * (Today Home: mood 3, "Fine", `#BAB5AD`; Morning Feeling draws the same answer
 * `#8A857D`), so the darkest rung still reads on the `#1E1E1E` chip; the top two
 * rungs share the ink (D231).
 */
const CHIP_TONE = [toneRamp[1], toneRamp[2], toneRamp[3], toneRamp[4], toneRamp[4]];

/*
 * The steps the task falls back on when nobody has named the day's action and
 * the course has no lesson for the day are `DAY_STEPS` (`components/day/kit`):
 * one list for Today, the night that names the next day's action and the
 * morning that asks after it, so all three say the same sentence (L4).
 */

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
/** The same days as a screen reader says them: "We" and "Su" are read as words (D535). */
const WEEKDAY_SAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Today() {
  const router = useRouter();
  const user = useCurrentUser();
  const progress = useLessonProgressMap();
  const checkins = useCheckins();
  const events = useEvents();
  const journal = useJournalEntries();
  const upsertCheckin = useUpsertCheckin();
  const canvasTop = useCanvasTop();
  const winH = useWindowDimensions().height;
  const tabBar = useTabBarHeight();
  // "Now" holds still under re-renders, and moves on when the tab is focused,
  // the app comes back to the foreground, or the clock passes midnight — an
  // app left open overnight shows, and ticks, the new day (L5).
  const now = useToday();
  const [ends, setEnds] = useState(PAGE_ENDS);
  const pager = useRef<ScrollView>(null);
  const endAt = (i: number) => (y: number) => setEnds((e) => (Math.abs(e[i] - y) < 0.5 ? e : e.map((v, j) => (j === i ? y : v))));

  // The day and the lesson come from the account's programme start, so nothing
  // is drawn until it has loaded — never a Day 1 / Lesson 1 for a day-20 user.
  if (user === undefined || progress === undefined || checkins === undefined || events === undefined) {
    return <LoadingView spinner={false} />;
  }

  // The viewport is computed rather than measured: onLayout on web settles a
  // frame late and the first page would render at its natural height. The
  // scene ends at the bar's top; the Screen's canvas box starts 54 above the
  // safe-area top. Each page fills the viewport (548 at 852 — the frames' 200 →
  // 748) and grows past it only when its own content needs more (a 667 phone, a
  // pledge that wraps to three lines), so the pager always snaps page to page
  // and a taller page scrolls within itself before the next one (D230, D320).
  const viewport = winH - tabBar - canvasTop - PAGER_TOP;

  // Day N: calendar days from the programme's first day (src/lib/day.ts)
  const day = programmeDay(user, now);
  // The recovery rating: the last seven days, from the same rows on either
  // backend (src/lib/score.ts). The line is the rating as of each of the last
  // thirty days, ending on the number beside it.
  const input: RatingInput = { checkins, events, lessons: lessonCompletions(progress), start: user };
  const rating = computeRating(input, now);
  const change = ratingChange(input, now);
  const series = ratingHistory(input, 30, now);
  // The streak, off the same rows: check-in days in a row with no slip, ending
  // today, or yesterday while today is still open. A slip today makes it 0
  // (D530). The Log's "Clean days in a row" is the same number. Before the
  // morning check-in opens, the evening before is still open: the night
  // check-in can close it, so it neither counts nor ends the run yet (D537).
  const openNight = closingNightKey(user, now);
  const streak = currentStreak(input, now, openNight);

  const todayKey = toDateKey(new Date(now));
  const todayCheckin = checkins.find((c) => c.date === todayKey);
  const moodIdx = todayCheckin?.mood != null ? Math.max(0, Math.min(4, todayCheckin.mood - 1)) : null;
  const energyIdx = todayCheckin?.energy != null ? Math.max(0, Math.min(4, todayCheckin.energy - 1)) : null;
  const pledge = standingPledge(journal);
  const pledgeWords = pledgeText(pledge);
  const name = user?.displayName?.trim().split(/\s+/)[0];

  // The week strip, Sunday first (Today Home draws `Su … Sa`; the Log's strip
  // is Monday-first — CRITIC C16). Each day carries the mark the streak counts
  // by (`dayMark`, D531): done is a check-in and no slip, a slip is a slip
  // whether or not the day was checked in, and a past programme day with
  // neither is missed. Today fills as soon as it counts — any real check-in,
  // morning or night, and no slip — so its disc and the flame change together
  // (D534; it used to wait for the night check-in, D231).
  const n = new Date(now);
  const week: WeekDay[] = WEEKDAY.map((label, i) => {
    const at = new Date(n.getFullYear(), n.getMonth(), n.getDate() - n.getDay() + i);
    return { label, says: WEEKDAY_SAYS[i], date: at.getDate(), mark: dayMark(input, toDateKey(at), now, openNight), today: i === n.getDay() };
  });

  // The day's one action. The night check-in names it and files it under the
  // day it is *for*, so by the time it reaches Today it is simply today's.
  // Without one, the day's lesson sets it in the lesson's register (Today Home
  // Task); past the course, the day's own step (Today Home II's register).
  const dayLesson = lessonForDay(day);
  const complete = courseComplete(day);
  const task: Task = todayCheckin?.dailyAction
    ? namedTask(todayCheckin.dailyAction)
    : dayLesson
      ? { caption: dayLesson.task.cardSummary, hero: dayLesson.hero, lesson: dayLesson }
      : dayStep(day);
  const taskDone = todayCheckin?.dailyActionDone ?? false;
  // The disc marks the sentence it sits beside. When nobody named the day's
  // action (no night check-in), that sentence is the lesson's or the day's
  // step, so the tick names it too — as the old task page's "Mark as done"
  // did — or tomorrow's morning would ask after a fallback the person never
  // saw. Either register, one write; the register and the page it opens are
  // unchanged, since a lesson's own sentence keeps its lesson (D232).
  const toggleTask = () =>
    void upsertCheckin({ date: todayKey, dailyActionDone: !taskDone, ...(todayCheckin?.dailyAction ? {} : { dailyAction: task.caption }) });
  // The sentence opens a task page whenever the course has one to open: the
  // lesson that set the task, else the day's own lesson — as the old card opened
  // `/task/<day>` for any task on a lesson day (D324). Only past the course,
  // with no page behind it, is the sentence the done mark too.
  const taskLesson = task.lesson ?? dayLesson;

  // A page taller than the viewport rests at its top and at its foot. The foot
  // never leaves a sliver of a block under the strip: on a 667 phone the plain
  // foot cut page one 7 pt above the number's baseline (the old four-digit
  // figure's comma hung under the discs) and pages two and three 37 pt above
  // their art's floor (the phone's and the glass's stubs, the hills). Where the foot would
  // fall inside one of the blocks below, it rests at that block's end instead
  // — the block wholly scrolled away — and the page grows by the difference.
  const blocks: [number, number][][] = [
    // "Recovery rating" and its band; the number, kept whole to the chart's top (334);
    // the chart's ink, from a 100's end ring to its labels
    [[py(240), py(256)], [py(268), py(334)], [py(334) + CHART_LOW - CHART_SPAN - 8.5, py(584)]],
    [[py(241.3), py(241.3) + heroCrop(task.hero, 241.3).height]],
    [[py(231.5), py(231.5) + heroCrop('nightMoon', 231.5).height]],
  ];
  const pageH = ends.map((e, i) => {
    const need = Math.ceil(e) + BAR_GAP;
    if (need <= viewport) return viewport;
    const foot = blocks[i].reduce((at, [top, end]) => (at > top && at < end ? end : at), need - viewport);
    return Math.ceil(foot + viewport);
  });
  // Native snaps to each page's top and, for a page taller than the viewport,
  // to its foot as well; the web build pages with CSS scroll snap, which lets an
  // oversized page scroll within itself (`snapToOffsets` overrides `pagingEnabled`
  // on native).
  const offsets: number[] = [];
  const pagesAt = pageH.map((_, i) => pageH.slice(0, i).reduce((a, h) => a + h, 0));
  pageH.reduce((top, h) => {
    offsets.push(top);
    if (h > viewport) offsets.push(top + h - viewport);
    return top + h;
  }, 0);

  return (
    <Screen>
      {/* the greeting keeps the clock's own hours (afternoon included), not the check-in switch's 18:30 */}
      <Header greeting={greetingFor(n)} streak={streak} onProfile={() => router.push('/(app)/settings')} />
      <WeekStrip days={week} />

      <View style={{ position: 'absolute', left: 0, right: 0, top: PAGER_TOP, bottom: 0 }}>
        <HarnessPages name="today" pager={pager} pages={pagesAt} />
        <ScrollView
          ref={pager}
          pagingEnabled={Platform.OS === 'web'}
          snapToOffsets={Platform.OS === 'web' ? undefined : offsets}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={{ flex: 1 }}>
          <View style={{ height: pageH[0] }}>
            <PageOne
              rating={rating}
              change={change}
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
              complete={complete}
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
              pledge={pledgeWords || undefined}
              name={name}
              onAdd={() =>
                router.push({
                  pathname: '/journal-new',
                  params: { tag: 'Pledge' },
                })
              }
              onSaved={() => router.push('/(app)/journal')}
              onShare={() => (pledgeWords ? void Share.share({ message: pledgeWords }).catch(() => {}) : undefined)}
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
 * `left 24 right 24 top 64`: the greeting, then the streak pill and the profile
 * door (gap 10). The flame counts the streak — check-in days in a row with no
 * slip, 0 when there is none (`currentStreak`, D530). The owner decided it
 * (D533): it replaces the day number the pill carried under today-day OQ-T1,
 * and the streak is no longer opt-in. The programme day stays on page two,
 * where the lesson tile reads "Lesson N" through day 84. The avatar is the
 * frame's outline ring and glyph; it opens Settings, as the old person glyph did.
 */
function Header({ greeting, streak, onProfile }: { greeting: string; streak: number; onProfile: () => void }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top: 64, height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <MonoText v="greeting">{greeting}</MonoText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pill kind="streak" label={String(streak)} accessibilityLabel={`${streak} ${streak === 1 ? 'day' : 'days'} in a row`} />
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

type WeekDay = { label: string; says: string; date: number; mark: DayMark; today: boolean };

/** What a screen reader adds after the day (D535). A day still open and a day to come add nothing. */
const MARK_SAYS: Partial<Record<DayMark, string>> = { done: ', checked in', slip: ', slip', missed: ', no check-in' };

/**
 * `left 24 right 24 top 136`, seven 36-wide columns spread `space-between`: the
 * day (12px; today 700 ink) over a 36 disc, gap 12. A glyph says what happened
 * and a number says the day is still to come (D531). Done — the ink disc with
 * a 14 check; a slip — the ink ring and a cross; missed — the line ring and a
 * muted dash; a day still open (today, or the evening the night check-in can
 * still close, D537) — the ink ring and the date; a day to come or a day
 * before the programme — the line ring and a muted date (D231).
 */
function WeekStrip({ days }: { days: WeekDay[] }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top: 136, flexDirection: 'row', justifyContent: 'space-between' }}>
      {days.map((d) => (
        <View
          key={d.label}
          accessible
          // the web build drops `accessible`, and a label on a plain div is not read: it needs a role there (native would add "image")
          role={Platform.OS === 'web' ? 'img' : undefined}
          accessibilityLabel={`${d.today ? 'Today, ' : ''}${d.says} ${d.date}${MARK_SAYS[d.mark] ?? ''}`}
          style={{ alignItems: 'center', gap: 12 }}>
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
          {d.mark === 'done' ? (
            <CheckDisc size={36} />
          ) : (
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                boxShadow: d.mark === 'slip' || d.mark === 'today' ? ring.outlineInk : ring.outline,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {d.mark === 'slip' || d.mark === 'missed' ? (
                <DayGlyph mark={d.mark} />
              ) : (
                <MonoText v="pill" color={d.mark === 'today' ? mono.ink : mono.mute} style={{ fontSize: 14, lineHeight: lhNormal(14) }}>
                  {d.date}
                </MonoText>
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

/**
 * The two marks a ring carries in place of its date, in a 12 box at stroke 2
 * with round ends: a slip's cross in ink (the kit's ✕, drawn to fit) and a
 * missed day's dash in the mute, 10 wide.
 */
function DayGlyph({ mark }: { mark: 'slip' | 'missed' }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      <Path d={mark === 'slip' ? 'M2 2l8 8M10 2l-8 8' : 'M2 6h8'} fill="none" stroke={mark === 'slip' ? mono.ink : mono.mute} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ page one */

/** The page's children are in canvas y less the pager's top. */
const py = (y: number) => y - PAGER_TOP;

function PageOne({
  rating,
  change,
  series,
  mood,
  energy,
  onScore,
  onMorning,
  onEnd,
}: {
  rating: Rating;
  /** today's rating less yesterday's as it closed */
  change: number;
  /** the rating as of each of the last thirty days, oldest first */
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
        label={`Recovery rating ${rating.value}, ${rating.label}${change ? `, ${change > 0 ? 'up' : 'down'} ${Math.abs(change)} since yesterday` : ''}`}
        onPress={onScore}
        style={{ position: 'absolute', left: 24, right: 24, top: py(244), height: 340 }}>
        {/* the number over its caption, the change since yesterday beside it; the band (or, in
            the first week, how much of the window has been lived) rides the caption (D36) */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ gap: 8, flexShrink: 1 }}>
            <CountUpText v="statValue" value={rating.value} style={{ fontSize: 56, lineHeight: 56, letterSpacing: -0.5 }} />
            <MonoText v="p" wrap="wrap" color={mono.mute} style={{ fontSize: 14, lineHeight: 18 }}>
              {`Recovery rating · ${rating.label}`}
            </MonoText>
          </View>
          {/* nothing is drawn on a day that has not moved it */}
          {change !== 0 ? <Pill kind="delta" label={String(Math.abs(change))} down={change < 0} style={{ marginTop: 13 }} /> : null}
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 90 }}>
          <ThirtyDays series={series} />
        </View>
      </Tap>

      <View style={{ position: 'absolute', left: 24, right: 24, top: py(620), flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Sun />
        <MonoText v="p" wrap="nowrap" color={mono.mute} style={{ fontSize: 14, lineHeight: 18 }}>
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
/** Today Home's band: a rating of 0 sits at 210.6, 100 sits 172.7 above it. */
const CHART_LOW = 210.6;
const CHART_SPAN = 172.7;
/** The rating's scale, fixed: the line never stretches a small change to the band's full height (D512). */
const CHART_MAX = 100;
const chartY = (v: number) => round1(CHART_LOW - (Math.max(0, Math.min(CHART_MAX, v)) / CHART_MAX) * CHART_SPAN);
/** The three dashed rules sit at 25, 50 and 75. */
const CHART_RULES = [75, 50, 25].map(chartY);

/**
 * The last thirty days (`left 24 top 334`, 345 × 250 at 393): three dashed
 * rules, the area under the line in a fading ink, the line (straight segments,
 * stroke 3) and an end ring on today. x steps `(W − 64) / 29` to one decimal —
 * the frame's own 11.3, 22.7 … 329. y is the rating on a fixed 0–100 scale (0
 * on the band's floor, 100 at its top), so a day's rise of four reads as four,
 * and a week that held at 90 sits high rather than flat on the floor.
 */
function ThirtyDays({ series }: { series: number[] }) {
  const id = useId().replace(/:/g, '');
  const W = useWindowDimensions().width - 48;
  const run = W - 16;
  const pts = series.map((v, i) => [round1((i * run) / Math.max(1, series.length - 1)), chartY(v)] as const);
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
      {CHART_RULES.map((y) => (
        <Path key={y} d={`M0 ${y}H${W}`} stroke={mono.line} strokeWidth={1} strokeDasharray="2 5" />
      ))}
      <Path d={`${line} L${ex} 232 L0 232 Z`} fill={`url(#scoreFill${id})`} />
      {/* the line draws in from 30 days ago (D58) */}
      <DrawPath length={W * 1.6} delay={250} duration={1100} d={line} fill="none" stroke={mono.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
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
  complete,
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
  /** past day 84: the tile says the course is complete and opens the lessons to revisit */
  complete: boolean;
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
            <Tap label={opensTask ? 'Open today’s task' : undefined} onPress={onTask} style={{ flex: 1, minWidth: 0, gap: 8 }}>
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <CheckCircle />
                {/* `pretty`: a long lesson title wraps without leaving one word alone */}
                <MonoText v="p" wrap="pretty" color={mono.mute} style={{ fontSize: 14, lineHeight: 18, flexShrink: 1 }}>
                  {task.lesson ? `Today’s task: ${task.lesson.title}` : 'Today’s task'}
                </MonoText>
              </View>
            </Tap>
            <Tap label="Today’s task done" accessibilityRole="checkbox" aria-checked={done} onPress={onCheck} hitSlop={8} style={{ flexShrink: 0 }}>
              {done ? <CheckDisc size={52} /> : <View style={{ width: 52, height: 52, borderRadius: 26, boxShadow: ring.outlineInk }} />}
            </Tap>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* the frames' "Lesson 5 / Naming your triggers" is a mock (D132); the tile carries the day's lesson, numbered as the course numbers it (1–84);
              past day 84 the course is over, and the tile says so and opens every lesson to revisit (L4) */}
          <Tile
            glyph={<BookGlyph />}
            caps={lesson ? `Lesson ${lesson.day}` : complete ? 'Course complete' : 'Week I'}
            title={lesson?.title ?? (complete ? 'Revisit any lesson' : 'Start the first lesson')}
            onPress={onLesson}
          />
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
      <View style={{ gap: 3 }}>
        <MonoText v="gridLabel" wrap="wrap" style={{ letterSpacing: -0.2, lineHeight: 20 }}>
          {title}
        </MonoText>
        <MonoText v="p" wrap="wrap" color={mono.mute} style={{ fontSize: 13, lineHeight: lhNormal(13) }}>
          {caps}
        </MonoText>
      </View>
    </Card>
  );
}

/** The tiles' solid glyphs at 28 (D55). */
function BookGlyph() {
  return <Glyph name="book" size={28} color={mono.ink} />;
}

function WavesGlyph() {
  return <Glyph name="waves" size={28} color={mono.ink} />;
}

/* ---------------------------------------------------------------- page three */

const ICON18 = { fill: 'none', stroke: mono.ink, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/**
 * Today Home III: nightMoon cropped at 231.5, the pledge (`PledgeCard
 * plain`) under its quote mark at 408 with its three 42 rings, and tonight's urge door at 596.
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
  const ringBtn = (d: string | ReactNode, label: string, onPress: () => void, disabled?: boolean) => (
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
      {typeof d === 'string' ? (
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Path d={d} {...ICON18} />
        </Svg>
      ) : (
        d
      )}
    </Tap>
  );
  const rings = (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
      {ringBtn('M3 9h12M9 3v12', 'New pledge', onAdd)}
      {ringBtn(<Glyph name="star" size={18} color={mono.ink} />, 'Journal', onSaved)}
      {ringBtn('M9 11V3M6 6l3-3 3 3M4 11v3h10v-3', 'Share', onShare, !pledge)}
    </View>
  );
  return (
    <>
      <Hero mode="crop" id="nightMoon" top={py(231.5)} />

      {/* a column, as on page two: a pledge that wraps pushes tonight's card down
          (≥ 24 under the rings); at 393 the block's band is the frame's 408 → 596 */}
      <View onLayout={(e) => onEnd(e.nativeEvent.layout.y + e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: py(408) }}>
        <View style={{ minHeight: 596 - 408, paddingBottom: 24 }}>
          {pledge ? (
            <PledgeCard variant="plain" pledge={pledge} name={name}>
              {rings}
            </PledgeCard>
          ) : (
            // PledgeCard's plain column (mark, line, gap 10) with the line as the way in
            <View style={{ gap: 10 }}>
              <View accessibilityLabel="Your pledge" style={{ marginLeft: -2, marginBottom: -3 }}>
                <QuoteMark />
              </View>
              <Tap label="Write a pledge" onPress={onAdd} style={{ alignSelf: 'flex-start' }}>
                <MonoText style={{ ...sans('700'), fontSize: 22, lineHeight: 31, letterSpacing: -0.3, color: mono.mute }}>Write a pledge</MonoText>
              </Tap>
              {rings}
            </View>
          )}
        </View>

        <Card padding={[18, 20]} onPress={onUrge} accessibilityLabel="Urge surfing" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Glyph name="stopwatch" size={26} color={mono.onInk} />
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
