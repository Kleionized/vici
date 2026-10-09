import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

import { ArrowUp, Card, Check, ChevronD, CueScrollView, LoadingView, MonoText, NavBar, OptionList, Pill, Screen, Sheet, SHEET_TOP, Tap, useTabBarHeight } from '@/components/mono';
import { useCheckins, useCurrentUser, useEvents, useLessonProgressMap } from '@/lib/backend';
import { calendarDaysBetween, keyToDate, useToday } from '@/lib/day';
import { dateRange } from '@/lib/format';
import { RATING_BANDS, RATING_WINDOW, computeRating, lessonCompletions, ratingChange, ratingHistory, type Rating, type RatingInput } from '@/lib/score';
import { lhNormal, mono, ring, sans } from '@/lib/theme';

/**
 * Score Detail · Parts · Bands — one header, three ways of reading the
 * recovery rating (D513).
 *
 * The header (back, the range pill, "Recovery rating", the number and the
 * band pill) never moves; under it a horizontal pager turns between the rating
 * over time, the three parts it is made of and the four bands. None of the
 * three frames draws pager dots (today-day OQ-S3): a swipe is the way between
 * them. The tab bar is the navigator's, Journey lit (D326).
 *
 * Every y is the canvas's; a page's children subtract the pager's top.
 */

const PAGER_TOP = 288;
const py = (y: number) => y - PAGER_TOP;

type Range = 'months' | 'year';
const RANGE_LABEL: Record<Range, string> = { months: 'Months', year: 'Year' };

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** The parts page's content runs to here at 393 (the paragraph under the card is measured once laid out). */
const PARTS_END = 744;

export default function Score() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: W, height: winH } = useWindowDimensions();
  const tabBar = useTabBarHeight();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const events = useEvents();
  const progress = useLessonProgressMap();
  const [range, setRange] = useState<Range>('months');
  const [picking, setPicking] = useState(false);
  const [partsEnd, setPartsEnd] = useState(PARTS_END);
  // The screen's clock: still under a re-render, on to the new day with focus,
  // the foreground and midnight (a tab stays mounted).
  const now = useToday();

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  if (user === undefined || checkins === undefined || events === undefined || progress === undefined) return <LoadingView spinner={false} onBack={back} />;

  // the last seven days, on the calendar (src/lib/score.ts, src/lib/day.ts)
  const input: RatingInput = { checkins, events, lessons: lessonCompletions(progress), start: user };
  const rating = computeRating(input, now);
  const change = ratingChange(input, now);
  // "Months" is the three calendar months to today, "Year" the twelve (D333)
  const n = new Date(now);
  const from = new Date(n.getFullYear(), n.getMonth() - (range === 'months' ? 2 : 11), 1);
  const history = ratingHistory(input, calendarDaysBetween(from, n) + 1, now);

  // The pages fill the band from the pager's top to the bar; a page whose
  // content runs past that (the parts' paragraph on a 667 phone) scrolls inside itself.
  const pageH = winH - tabBar - (insets.top - 54) - PAGER_TOP;

  return (
    <Screen>
      <NavBar
        left="back"
        onBack={back}
        right={{
          node: (
            <Tap
              label={`Range: ${RANGE_LABEL[range]}`}
              onPress={() => setPicking(true)}
              style={{ height: 44, borderRadius: 22, backgroundColor: mono.card, paddingHorizontal: 18, gap: 10, flexDirection: 'row', alignItems: 'center' }}>
              <MonoText v="rowLabel">{RANGE_LABEL[range]}</MonoText>
              <ChevronD />
            </Tap>
          ),
        }}
      />

      <View style={{ position: 'absolute', left: 0, right: 0, top: 128 }}>
        <MonoText v="caps" center>
          Recovery rating
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 160 }}>
        <MonoText v="statValue" center style={{ fontSize: 60, lineHeight: 70, letterSpacing: -2.4 }}>
          {String(rating.value)}
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 248, flexDirection: 'row', justifyContent: 'center' }}>
        <Pill kind="range" dot label={rating.label} />
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, top: PAGER_TOP, bottom: 0 }}>
        <ScrollView horizontal pagingEnabled decelerationRate="fast" showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          <Page W={W} H={pageH} bottom={644}>
            <OverTime W={W} values={history} range={range} now={now} rating={rating} change={change} />
          </Page>
          <Page W={W} H={pageH} bottom={partsEnd}>
            <TheParts rating={rating} onEnd={(y) => setPartsEnd((e) => (Math.abs(e - y) < 0.5 ? e : y))} />
          </Page>
          <Page W={W} H={pageH} bottom={576}>
            <TheBands rating={rating} />
          </Page>
        </ScrollView>
      </View>

      {/* D333: "Months" opens the kit sheet; the two windows it always offered (3M / 1Y) */}
      <Sheet modal open={picking} top={SHEET_TOP.signOut} onClose={() => setPicking(false)}>
        <OptionList<Range>
          options={[
            { key: 'months', label: RANGE_LABEL.months, accessibilityLabel: 'Three months' },
            { key: 'year', label: RANGE_LABEL.year, accessibilityLabel: 'One year' },
          ]}
          value={range}
          onChange={(r) => {
            setRange(r);
            setPicking(false);
          }}
        />
      </Sheet>
    </Screen>
  );
}

/** One page of the pager: the band's own height, scrolling only when its content (canvas `bottom`) does not fit. */
function Page({ W, H, bottom, children }: { W: number; H: number; bottom: number; children: ReactNode }) {
  // scroll only when the content itself runs past the band — the 24 of foot room
  // alone made the Bands page rubber-band 3 pt on a 667 phone
  const scroll = py(bottom) + 8 > H;
  return (
    <CueScrollView style={{ width: W, height: H }} scrollEnabled={scroll} contentContainerStyle={{ height: scroll ? py(bottom) + 24 : H }}>
      {children}
    </CueScrollView>
  );
}

/* ------------------------------------------------------------ Score Detail */

/** The chart's scale is the rating's own, fixed: 0 on the baseline (y 200), 100 on the dashed rule (y 60). */
const yOf = (v: number) => 200 - (Math.max(0, Math.min(100, v)) / 100) * 140;

/**
 * The rating over the window (svg 393 × 230 at 324): a dashed rule at 100
 * (y 60), the solid baseline at 0 (y 200), the two values at x 369, the line
 * (stroke 5, soft) from off the left edge to today at x 372 and on past the
 * right edge, a ring on today, and three month labels at 40 / 196 / 352 — the
 * current month in ink. Wider or narrower phones keep the right-hand positions
 * off the right edge.
 *
 * `values` is the rating as of each day of the range, oldest first (a day
 * before the programme reads 0), sampled weekly (monthly for the year) and
 * smoothed. The scale never moves (D512): a change of four reads as four.
 *
 * Under it, what the number covers: the change since yesterday, and the seven
 * days it is counted over.
 */
function OverTime({ W, values, range, now, rating, change }: { W: number; values: number[]; range: Range; now: number; rating: Rating; change: number }) {
  const n = new Date(now);
  const days = values.length;

  // today at x W − 21 (372 at 393); the window's first day just off the left edge
  const x0 = -5;
  const x1 = W - 21;
  const step = range === 'months' ? 7 : 30;
  const idx: number[] = [];
  for (let i = days - 1; i > 0; i -= step) idx.unshift(i);
  idx.unshift(0);
  const pts = idx.map((i) => ({ x: x0 + (days === 1 ? 1 : i / (days - 1)) * (x1 - x0), y: yOf(values[i]) }));
  if (pts.length === 1) pts.unshift({ x: x0, y: pts[0].y });
  // the line runs on past today to the edge, a little way along today's slope
  // (the frame's tail climbs 4 over its last 28), never past the scale
  const a = pts[pts.length - 2];
  const b = pts[pts.length - 1];
  const rise = ((b.y - a.y) / Math.max(1, b.x - a.x)) * (W + 7 - b.x);
  const tail = { x: W + 7, y: Math.max(60, Math.min(200, b.y + Math.max(-8, Math.min(8, rise)))) };
  const line = smoothPath([...pts, tail]);

  const months = range === 'months' ? [n.getMonth() - 2, n.getMonth() - 1, n.getMonth()] : [n.getMonth() - 11, n.getMonth() - 5, n.getMonth()];
  const month = (m: number, names: string[]) => names[((m % 12) + 12) % 12];
  const bold = sans('700').fontFamily;
  const moved = change === 0 ? 'Same as yesterday' : `${change > 0 ? 'Up' : 'Down'} ${Math.abs(change)} since yesterday`;
  const covers = rating.lived ? `Covers ${dateRange(keyToDate(rating.windowStart), keyToDate(rating.windowEnd))}` : `Covers your last ${RATING_WINDOW} days`;

  return (
    <>
      <Svg width={W} height={230} viewBox={`0 0 ${W} 230`} style={{ position: 'absolute', left: 0, top: py(324) }}>
        <Path d={`M0 60H${W}`} stroke={mono.ink} strokeWidth={1} strokeDasharray="2 6" />
        <Path d={`M0 200H${W}`} stroke={mono.ink} strokeWidth={1.5} />
        {/* the frame asks for 600, which the canvas never loads: its browser drew 700 */}
        <SvgText x={W - 24} y={52} fill={mono.mute} textAnchor="end" fontSize={11} fontFamily={bold}>
          100
        </SvgText>
        <SvgText x={W - 24} y={194} fill={mono.mute} textAnchor="end" fontSize={11} fontFamily={bold}>
          0
        </SvgText>
        <Path d={line} fill="none" stroke={mono.ink} strokeWidth={5} strokeLinecap="round" />
        <Circle cx={x1} cy={b.y} r={7} fill={mono.ground} stroke={mono.ink} strokeWidth={4} />
        {months.map((m, i) => (
          <SvgText key={i} x={[40, W / 2 - 0.5, W - 41][i]} y={226} fill={i === 2 ? mono.ink : mono.mute} textAnchor="middle" fontSize={13} fontFamily={bold}>
            {month(m, MONTH_SHORT)}
          </SvgText>
        ))}
      </Svg>

      <View style={{ position: 'absolute', left: 24, right: 24, top: py(600), flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {/* up, down, or on its side for a day that has not moved it */}
          <View style={change < 0 ? { transform: [{ rotate: '180deg' }] } : change === 0 ? { transform: [{ rotate: '90deg' }] } : null}>
            <ArrowUp size={16} color={mono.onInk} />
          </View>
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <MonoText v="gridLabel" wrap="wrap" style={{ fontSize: 18, lineHeight: lhNormal(18), letterSpacing: -0.2 }}>
            {moved}
          </MonoText>
          <MonoText v="p" wrap="wrap" style={{ lineHeight: lhNormal(15) }}>
            {covers}
          </MonoText>
        </View>
      </View>
    </>
  );
}

/**
 * A monotone cubic through the points (Fritsch–Carlson), emitted as cubics —
 * the frame's soft climb without the overshoot a Catmull-Rom spline puts under
 * the floor where a flat run turns into a rise.
 */
function smoothPath(pts: { x: number; y: number }[]) {
  const r = (v: number) => Math.round(v * 100) / 100;
  const n = pts.length;
  const d = pts.slice(0, -1).map((p, i) => (pts[i + 1].y - p.y) / Math.max(1e-6, pts[i + 1].x - p.x));
  const m = pts.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  let path = `M${r(pts[0].x)} ${r(pts[0].y)}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = (pts[i + 1].x - pts[i].x) / 3;
    path += ` C${r(pts[i].x + dx)} ${r(pts[i].y + m[i] * dx)}, ${r(pts[i + 1].x - dx)} ${r(pts[i + 1].y - m[i + 1] * dx)}, ${r(pts[i + 1].x)} ${r(pts[i + 1].y)}`;
  }
  return path;
}

/* ----------------------------------------------------------- Score Parts */

/**
 * What the rating is made of (caps at 300, card `left 16 right 16 top 334`,
 * padding 16 20 18): one 44 row per part — label w112, a 12 bar filled to the
 * part's share of its own weight (ink), the part as `26/30` w56 right-aligned
 * — then the rating under a rule, and one plain paragraph under the card on
 * how it is counted (D513).
 */
function TheParts({ rating, onEnd }: { rating: Rating; onEnd: (canvasY: number) => void }) {
  const lessons = rating.parts.find((p) => p.key === 'lessons');
  const weight = (key: string) => rating.parts.find((p) => p.key === key)?.max ?? 0;
  const how = lessons
    ? `Your rating covers your last ${RATING_WINDOW} days: showing up (${weight('showingUp')}), clean days (${weight('cleanDays')}) and lessons (${lessons.max}). A slip costs that day’s clean points. Logging it still counts as showing up. A week later, the slip drops out.`
    : `Your rating covers your last ${RATING_WINDOW} days: showing up (${weight('showingUp')}) and clean days (${weight('cleanDays')}). The course is done, so lessons no longer count. A slip costs that day’s clean points. Logging it still counts as showing up. A week later, the slip drops out.`;
  return (
    <>
      <View style={{ position: 'absolute', left: 0, right: 0, top: py(300) }}>
        <MonoText v="caps" center>
          What makes it up
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 16, right: 16, top: py(334), gap: 20 }} onLayout={(e) => onEnd(e.nativeEvent.layout.y + e.nativeEvent.layout.height + PAGER_TOP)}>
        <Card padding={[16, 20, 18]}>
          {rating.parts.map((p) => (
            <View key={p.key} accessibilityLabel={`${p.label}, ${p.earned} of ${p.max}`} style={{ height: 44, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <MonoText v="rowLabel" wrap="wrap" style={{ width: 112 }}>
                {p.label}
              </MonoText>
              <View style={{ flex: 1, height: 12, borderRadius: 6, boxShadow: ring.insetLine }}>
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: 12,
                    width: `${p.max ? Math.round((p.earned / p.max) * 100) : 0}%`,
                    borderRadius: 6,
                    backgroundColor: mono.ink,
                  }}
                />
              </View>
              <MonoText v="rowLabel" style={{ width: 56, textAlign: 'right' }}>
                {`${p.earned}/${p.max}`}
              </MonoText>
            </View>
          ))}
          <View style={{ marginTop: 12, paddingTop: 14, borderTopWidth: 1, borderTopColor: mono.line, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <MonoText v="caps">Recovery rating</MonoText>
            <MonoText v="h1" wrap="nowrap" style={{ lineHeight: lhNormal(26) }}>
              {String(rating.value)}
            </MonoText>
          </View>
        </Card>
        <MonoText v="p" style={{ marginHorizontal: 8 }}>
          {how}
        </MonoText>
      </View>
    </>
  );
}

/* ----------------------------------------------------------- Score Bands */

/**
 * The four bands, highest first (caps at 300, card at 334, padding 22 22 20):
 * a 26 disc per band on a rail — bands above the rating a ringed `#1E1E1E`
 * disc on a dashed `#5A574F` rail, the band it is in an ink disc with a dot on
 * a solid ink rail, bands below an ink disc with a check — then the name (900
 * where you are) and its range; under yours, "You’re here." and what is left
 * to the next band (or, in the first week, how much of it has been lived).
 */
function TheBands({ rating }: { rating: Rating }) {
  const ladder = [...RATING_BANDS].reverse();
  const next = RATING_BANDS.find((b) => b.min > rating.value);
  const here = rating.building
    ? `You’re here. Building, ${rating.lived} of ${RATING_WINDOW} days`
    : next
      ? `You’re here. ${next.min - rating.value} to ${next.label}`
      : 'You’re here.';
  return (
    <>
      <View style={{ position: 'absolute', left: 0, right: 0, top: py(300) }}>
        <MonoText v="caps" center>
          The bands
        </MonoText>
      </View>
      <Card padding={[22, 22, 20]} style={{ position: 'absolute', left: 16, right: 16, top: py(334) }}>
        {ladder.map((band, i) => {
          const state = rating.value < band.min ? 'todo' : rating.band.key === band.key ? 'here' : 'done';
          const last = i === ladder.length - 1;
          return (
            <View key={band.key} style={{ flexDirection: 'row', gap: 18 }}>
              <View style={{ width: 26, alignItems: 'center' }}>
                <BandDisc state={state} />
                {last ? null : <Rail dashed={state === 'todo'} />}
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, paddingBottom: last ? 0 : 30 }}>
                <View style={{ flexShrink: 1, gap: 2 }}>
                  <MonoText v="gridLabel" color={state === 'todo' ? mono.mute : mono.ink} style={{ ...sans(state === 'here' ? '900' : '700'), fontSize: 18, lineHeight: lhNormal(18) }}>
                    {band.label}
                  </MonoText>
                  {state === 'here' ? (
                    <MonoText v="caps" wrap="wrap" color={mono.sub}>
                      {here}
                    </MonoText>
                  ) : null}
                </View>
                <MonoText v="rowLabel" color={state === 'todo' ? mono.mute : mono.ink}>
                  {`${band.min}–${band.max}`}
                </MonoText>
              </View>
            </View>
          );
        })}
      </Card>
    </>
  );
}

function BandDisc({ state }: { state: 'todo' | 'here' | 'done' }) {
  return (
    <View
      style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: state === 'todo' ? mono.card : mono.ink,
        boxShadow: state === 'todo' ? ring.outlineInk : undefined,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {state === 'here' ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: mono.card }} /> : null}
      {state === 'done' ? <Check size={12} /> : null}
    </View>
  );
}

/**
 * The rail under a disc: `flex 1; border-left 2px; margin 4 0`. On web it is
 * the CSS border, which Chrome dashes exactly as it dashed the frame's; native
 * cannot dash one side of a box, so there the dashed rail is an SVG line.
 */
function Rail({ dashed }: { dashed: boolean }) {
  if (dashed && Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, width: 2, marginVertical: 4 }}>
        <Svg width={2} height="100%" style={{ position: 'absolute', left: 0, top: 0 }}>
          <Line x1={1} y1={0} x2={1} y2="100%" stroke={mono.art} strokeWidth={2} strokeDasharray="6 6" />
        </Svg>
      </View>
    );
  }
  return <View style={{ flex: 1, marginVertical: 4, borderLeftWidth: 2, borderLeftColor: dashed ? mono.art : mono.ink, borderStyle: dashed ? 'dashed' : 'solid' }} />;
}
