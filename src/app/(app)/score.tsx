import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

import { ArrowUp, Card, Check, ChevronD, CueScrollView, LoadingView, MonoText, NavBar, OptionList, Pill, Screen, Sheet, SHEET_TOP, Tap, useTabBarHeight } from '@/components/mono';
import { useCheckins, useCurrentUser, useEvents, useLessonProgressMap } from '@/lib/backend';
import { RANKS, buildScore, monthLedger, scoreHistory, type LedgerLine, type ScoreHistory } from '@/lib/score';
import { lhNormal, mono, ring, sans } from '@/lib/theme';

/**
 * Score Detail · Moves · Ranks — one header, three ways of reading the number.
 *
 * The header (back, the range pill, "Recovery score", the number and the rank
 * pill) never moves; under it a horizontal pager turns between the score over
 * time, what moved it this month and the ladder. None of the three frames
 * draws pager dots (today-day OQ-S3): a swipe is the way between them. The
 * old night header, light sheet, rank bar, value badge and insight cards are
 * gone. The tab bar is the navigator's, Journey lit (D326). D234 records the
 * readings of the undrawn states (the Year window, the chart's data, the top rank).
 *
 * Every y is the canvas's; a page's children subtract the pager's top.
 */

const PAGER_TOP = 288;
const py = (y: number) => y - PAGER_TOP;

/** The rank's place on the ladder as the pill writes it — `Navigator II`. */
const TIER = ['I', 'II', 'III', 'IV', 'V'];

type Range = 'months' | 'year';
const RANGE_LABEL: Record<Range, string> = { months: 'Months', year: 'Year' };

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
  // Read once: the day boundaries must not shift under a re-render.
  const [now] = useState(() => Date.now());

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  if (checkins === undefined || events === undefined || progress === undefined) return <LoadingView spinner={false} onBack={back} />;

  const lessonsDone = Object.values(progress).filter((p) => p?.status === 'completed').length;
  const score = buildScore(checkins, events, lessonsDone, user?.createdAt);
  const history = scoreHistory(checkins, events, progress, user?.createdAt ?? now, now, score.total);
  const month = monthLedger(checkins, events, progress, now, history.values.length);
  const tier = Math.max(1, RANKS.findIndex((r) => r.name === score.rank.name) + 1);

  // The pages fill the band from the pager's top to the bar; a page whose
  // content runs past that (Moves' card on a 667 phone) scrolls inside itself.
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
          Recovery score
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 160 }}>
        <MonoText v="statValue" center style={{ fontSize: 60, lineHeight: 70, letterSpacing: -2.4 }}>
          {score.total.toLocaleString('en-US')}
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 248, flexDirection: 'row', justifyContent: 'center' }}>
        <Pill kind="range" dot label={`${score.rank.name} ${TIER[tier - 1] ?? TIER[TIER.length - 1]}`} />
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, top: PAGER_TOP, bottom: 0 }}>
        <ScrollView horizontal pagingEnabled decelerationRate="fast" showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          <Page W={W} H={pageH} bottom={644}>
            <OverTime W={W} history={history} range={range} now={now} />
          </Page>
          <Page W={W} H={pageH} bottom={647}>
            <WhatMoved lines={month.lines} net={month.net} />
          </Page>
          <Page W={W} H={pageH} bottom={576}>
            <TheRanks total={score.total} toGo={score.toGo} />
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
  // alone made the Ranks page rubber-band 3 pt on a 667 phone
  const scroll = py(bottom) + 8 > H;
  return (
    <CueScrollView style={{ width: W, height: H }} scrollEnabled={scroll} contentContainerStyle={{ height: scroll ? py(bottom) + 24 : H }}>
      {children}
    </CueScrollView>
  );
}

/* ------------------------------------------------------------ Score Detail */

/**
 * The score over the window (svg 393 × 230 at 324): a dashed rule at the
 * window's top value (y 60), the solid baseline at its floor (y 200), the two
 * values at x 369, the line (stroke 5, soft) from off the left edge to today at
 * x 372 and on past the right edge, a ring on today, and three month labels at
 * 40 / 196 / 352 — the current month in ink. Wider or narrower phones keep the
 * right-hand positions off the right edge.
 *
 * The frame's curve is drawn, not data (its ring at y 80 reads ≈ 1,343 on its
 * own axis against a header of 1,240 — OQ-S2); this is the account's own
 * history, sampled weekly (monthly for the year) and smoothed. "Months" is the
 * three calendar months to today, "Year" the twelve (D333); a day before the
 * account reads as its first day's score.
 */
function OverTime({ W, history, range, now }: { W: number; history: ScoreHistory; range: Range; now: number }) {
  const n = new Date(now);
  const span = range === 'months' ? 3 : 12;
  const from = new Date(n.getFullYear(), n.getMonth() - (span - 1), 1).getTime();
  const first = history.dayAt(0);
  const days = Math.max(1, Math.round((new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime() - from) / 86_400_000) + 1);
  const values = Array.from({ length: days }, (_, i) => {
    const k = Math.round((from + i * 86_400_000 - first) / 86_400_000);
    return history.values[Math.max(0, Math.min(history.values.length - 1, k))];
  });

  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const bottom = Math.floor(lo / 100) * 100;
  const top = bottom + ([100, 200, 400, 500, 1000, 2000, 4000, 5000].find((s) => bottom + s >= hi) ?? 10_000);
  const yOf = (v: number) => 200 - ((v - bottom) / (top - bottom)) * 140;

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
  // (the frame's tail climbs 4 over its last 28)
  const a = pts[pts.length - 2];
  const b = pts[pts.length - 1];
  const rise = ((b.y - a.y) / Math.max(1, b.x - a.x)) * (W + 7 - b.x);
  const tail = { x: W + 7, y: b.y + Math.max(-8, Math.min(8, rise)) };
  const line = smoothPath([...pts, tail]);

  const months = range === 'months' ? [n.getMonth() - 2, n.getMonth() - 1, n.getMonth()] : [n.getMonth() - 11, n.getMonth() - 5, n.getMonth()];
  const month = (m: number, names: string[]) => names[((m % 12) + 12) % 12];
  const gain = values[values.length - 1] - values[0];
  const bold = sans('700').fontFamily;

  return (
    <>
      <Svg width={W} height={230} viewBox={`0 0 ${W} 230`} style={{ position: 'absolute', left: 0, top: py(324) }}>
        <Path d={`M0 60H${W}`} stroke={mono.ink} strokeWidth={1} strokeDasharray="2 6" />
        <Path d={`M0 200H${W}`} stroke={mono.ink} strokeWidth={1.5} />
        {/* the frame asks for 600, which the canvas never loads: its browser drew 700 */}
        <SvgText x={W - 24} y={52} fill={mono.mute} textAnchor="end" fontSize={11} fontFamily={bold}>
          {top.toLocaleString('en-US')}
        </SvgText>
        <SvgText x={W - 24} y={194} fill={mono.mute} textAnchor="end" fontSize={11} fontFamily={bold}>
          {bottom.toLocaleString('en-US')}
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
          <View style={gain < 0 ? { transform: [{ rotate: '180deg' }] } : null}>
            <ArrowUp size={16} color={mono.onInk} />
          </View>
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <MonoText v="gridLabel" wrap="wrap" style={{ fontSize: 18, lineHeight: lhNormal(18), letterSpacing: -0.2 }}>
            {`${gain < 0 ? '−' : '+'}${Math.abs(gain).toLocaleString('en-US')} points ${range === 'months' ? 'this quarter' : 'this year'}`}
          </MonoText>
          <MonoText v="p" wrap="wrap" style={{ lineHeight: lhNormal(15) }}>
            {`${month(months[0], MONTH_LONG)} – ${month(months[2], MONTH_LONG)}`}
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

/* ----------------------------------------------------------- Score Moves */

/**
 * What moved it this month (caps at 300, card `left 16 right 16 top 334`,
 * padding 16 20 18): one 44 row per line — label w112, a 12 bar whose fill is
 * the line's share of the largest (ink; a loss is an ink ring), the value w44
 * right-aligned with `+` / `−` — then the net under a rule.
 */
function WhatMoved({ lines, net }: { lines: LedgerLine[]; net: number }) {
  const max = Math.max(1, ...lines.map((l) => Math.abs(l.points)));
  const signed = (v: number) => `${v < 0 ? '−' : '+'}${Math.abs(v)}`;
  return (
    <>
      <View style={{ position: 'absolute', left: 0, right: 0, top: py(300) }}>
        <MonoText v="caps" center>
          What moved it this month
        </MonoText>
      </View>
      <Card padding={[16, 20, 18]} style={{ position: 'absolute', left: 16, right: 16, top: py(334) }}>
        {lines.map((l) => (
          <View key={l.label} style={{ height: 44, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <MonoText v="rowLabel" wrap="wrap" color={l.slip ? mono.mute : mono.ink} style={{ width: 112 }}>
              {l.label}
            </MonoText>
            <View style={{ flex: 1, height: 12 }}>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: 12,
                  width: `${Math.round((Math.abs(l.points) / max) * 100)}%`,
                  borderRadius: 6,
                  backgroundColor: l.points < 0 ? undefined : mono.ink,
                  boxShadow: l.points < 0 ? ring.insetInk : undefined,
                }}
              />
            </View>
            <MonoText v="rowLabel" style={{ width: 44, textAlign: 'right' }}>
              {signed(l.points)}
            </MonoText>
          </View>
        ))}
        <View style={{ marginTop: 12, paddingTop: 14, borderTopWidth: 1, borderTopColor: mono.line, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <MonoText v="caps">Net this month</MonoText>
          <MonoText v="h1" wrap="nowrap" style={{ lineHeight: lhNormal(26) }}>
            {signed(net)}
          </MonoText>
        </View>
      </Card>
    </>
  );
}

/* ----------------------------------------------------------- Score Ranks */

/**
 * The ladder, highest first (caps at 300, card at 334, padding 22 22 20): a
 * 26 disc per rank on a rail — ranks above the score a ringed `#1E1E1E` disc on
 * a dashed `#5A574F` rail, the rank you hold an ink disc with a dot on a solid
 * ink rail, ranks below an ink disc with a check — then the name (900 where
 * you are) and the threshold; under yours, "You’re here." and what is left to
 * the next.
 */
function TheRanks({ total, toGo }: { total: number; toGo: number }) {
  const ladder = [...RANKS].reverse();
  return (
    <>
      <View style={{ position: 'absolute', left: 0, right: 0, top: py(300) }}>
        <MonoText v="caps" center>
          The ranks
        </MonoText>
      </View>
      <Card padding={[22, 22, 20]} style={{ position: 'absolute', left: 16, right: 16, top: py(334) }}>
        {ladder.map((rank, i) => {
          const above = RANKS.find((r) => r.at > rank.at);
          const state = total < rank.at ? 'todo' : above && total >= above.at ? 'done' : 'here';
          const last = i === ladder.length - 1;
          return (
            <View key={rank.name} style={{ flexDirection: 'row', gap: 18 }}>
              <View style={{ width: 26, alignItems: 'center' }}>
                <RankDisc state={state} />
                {last ? null : <Rail dashed={state === 'todo'} />}
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: last ? 0 : 30 }}>
                <View style={{ gap: 2 }}>
                  <MonoText v="gridLabel" color={state === 'todo' ? mono.mute : mono.ink} style={{ ...sans(state === 'here' ? '900' : '700'), fontSize: 18, lineHeight: lhNormal(18) }}>
                    {rank.name}
                  </MonoText>
                  {state === 'here' ? (
                    <MonoText v="caps" color={mono.sub}>
                      {toGo > 0 ? `You’re here. ${toGo.toLocaleString('en-US')} to go` : 'You’re here.'}
                    </MonoText>
                  ) : null}
                </View>
                <MonoText v="rowLabel" color={state === 'todo' ? mono.mute : mono.ink}>
                  {rank.at.toLocaleString('en-US')}
                </MonoText>
              </View>
            </View>
          );
        })}
      </Card>
    </>
  );
}

function RankDisc({ state }: { state: 'todo' | 'here' | 'done' }) {
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
