import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode, useId, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, Line, LinearGradient as SvgLinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, Grain, LoadingView, PressScale } from '@/components/ui';
import { useCheckins, useCurrentUser, useEvents, useLessonProgressMap } from '@/lib/backend';
import { RANKS, SCORE_BASE, SCORE_WEIGHTS, buildScore } from '@/lib/score';
import { sans } from '@/lib/theme';
import type { DailyCheckin, LessonProgress, TidelineEvent } from '@/lib/types';

/**
 * 111–113 · Score detail — one night header, three ways of reading the number.
 *
 * The header never moves: the score, the rank and the rung it sits on stay put
 * while the sheet under it pages between the shape over time, the ledger that
 * moved it, and the ladder ahead. Laid out from the canvas's 393 × 852 frame —
 * the status bar ends at 54, the sheet lifts at 302 — so every y below is the
 * canvas number shifted by the real top inset.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

const DAY = 86_400_000;
/** "This month" for the ledger and the pace — a rolling window, not a calendar month. */
const WINDOW = 30;

const TIER = ['I', 'II', 'III', 'IV', 'V'];

export default function Score() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: W, height: winH } = useWindowDimensions();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const events = useEvents();
  const progress = useLessonProgressMap();
  const [page, setPage] = useState(0);
  const [range, setRange] = useState<'3M' | '1Y'>('3M');
  // Read once: the day boundaries must not shift under a re-render.
  const [now] = useState(() => Date.now());

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  if (checkins === undefined || events === undefined || progress === undefined) return <LoadingView />;

  const lessonsDone = Object.values(progress).filter((p) => p?.status === 'completed').length;
  const score = buildScore(checkins, events, lessonsDone, user?.createdAt);
  const history = scoreHistory(checkins, events, progress, user?.createdAt ?? now, now, score.total);
  const month = monthLedger(checkins, events, progress, now, history.values.length);

  const y = (v: number) => v - 54 + insets.top;
  const sheetTop = y(302);

  return (
    <View style={{ flex: 1, backgroundColor: '#0C0D10' }}>
      <StatusBar style="light" />

      <NightHeader score={score} insetTop={insets.top} onBack={back} />

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: sheetTop,
          bottom: 0,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          backgroundColor: '#F6F5F2',
          overflow: 'hidden',
        }}>
        <ScrollView
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / Math.max(1, W)))}
          style={{ flex: 1 }}>
          <View style={{ width: W, height: winH - sheetTop }}>
            <OverTime W={W} total={score.total} threshold={score.next?.at} history={history} range={range} onRange={setRange} />
          </View>
          <View style={{ width: W, height: winH - sheetTop }}>
            <WhatMoved lines={month.lines} net={month.net} />
          </View>
          <View style={{ width: W, height: winH - sheetTop }}>
            <TheRanks total={score.total} toGo={score.toGo} next={score.next?.name} pace={month.net / Math.max(1, month.days)} />
          </View>
        </ScrollView>

        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 504, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i === page ? '#131313' : 'rgba(19,19,19,0.16)' }} />
          ))}
        </View>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------- the night */

/**
 * The score drawn as the thing it measures: a low moon over a ridge, and the
 * waterline you are climbing towards. Same art the Today card carries, run to
 * the full width of the screen.
 */
function NightHeader({ score, insetTop, onBack }: { score: ReturnType<typeof buildScore>; insetTop: number; onBack: () => void }) {
  const id = useId().replace(/:/g, '');
  const W = useWindowDimensions().width;
  const y = (v: number) => v - 54 + insetTop;
  const H = y(330);
  const tier = Math.max(1, RANKS.findIndex((r) => r.name === score.rank.name) + 1);

  return (
    <>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: H, overflow: 'hidden' }}>
        <Svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Defs>
            <SvgLinearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#08090B" />
              <Stop offset="0.55" stopColor="#0E1014" />
              <Stop offset="1" stopColor="#151920" />
            </SvgLinearGradient>
            {/* the canvas blurs the halo 5px; RN SVG has no blur, so it is the equivalent soft radial */}
            <RadialGradient id={`halo${id}`} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#DFDCD3" stopOpacity={0.15} />
              <Stop offset="0.72" stopColor="#DFDCD3" stopOpacity={0} />
            </RadialGradient>
            {/* the moon's own 26px box-shadow, likewise redrawn as a falloff */}
            <RadialGradient id={`moonglow${id}`} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0.45" stopColor="#DFDCD3" stopOpacity={0.26} />
              <Stop offset="1" stopColor="#DFDCD3" stopOpacity={0} />
            </RadialGradient>
            {/* css `radial-gradient(circle at 36% 30%, …)` defaults to farthest-corner: in the 42-box the
                far corner sits 39.84 from (15.12, 12.6), so the 100% stop is at 94.85% of the box, not 60% */}
            <RadialGradient id={`moon${id}`} cx="36%" cy="30%" rx="94.85%" ry="94.85%">
              <Stop offset="0" stopColor="#F5F3EC" />
              <Stop offset="0.46" stopColor="#D9D6CD" />
              <Stop offset="1" stopColor="#A5A197" />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={H} fill={`url(#sky${id})`} />
          <Circle cx={127} cy={y(44) + 1} r={1} fill="#F4F3F0" fillOpacity={0.45} />
          <Circle cx={W - 63.25} cy={y(38) + 1.25} r={1.25} fill="#F4F3F0" fillOpacity={0.35} />
          <Circle cx={59} cy={y(128) + 1} r={1} fill="#F4F3F0" fillOpacity={0.3} />
          <Circle cx={W - 80} cy={y(80) + 58} r={58} fill={`url(#halo${id})`} />
          <Circle cx={W - 75} cy={y(110) + 21} r={47} fill={`url(#moonglow${id})`} />
          <Circle cx={W - 75} cy={y(110) + 21} r={21} fill={`url(#moon${id})`} />
        </Svg>

        <Svg width={W} height={80} viewBox="0 0 393 80" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: y(160) }}>
          <Defs>
            <SvgLinearGradient id={`sdH1${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#232830" />
              <Stop offset="1" stopColor="#0A0B0D" />
            </SvgLinearGradient>
            <SvgLinearGradient id={`sdH2${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#2A303B" />
              <Stop offset="1" stopColor="#0C0D10" />
            </SvgLinearGradient>
          </Defs>
          <Path d="M-4,80 L-4,52 Q60,24 132,50 Q170,64 200,72 L200,80 Z" fill={`url(#sdH1${id})`} />
          <Path d="M180,80 L180,70 Q240,60 288,38 Q336,18 397,26 L397,80 Z" fill={`url(#sdH2${id})`} />
        </Svg>

        <Svg width={W} height={104} style={{ position: 'absolute', left: 0, top: y(226) }}>
          <Defs>
            <SvgLinearGradient id={`sdGlow${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#E9C78A" stopOpacity={0} />
              <Stop offset="1" stopColor="#E9C78A" stopOpacity={0.12} />
            </SvgLinearGradient>
            <SvgLinearGradient id={`sdSea${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#131720" />
              <Stop offset="1" stopColor="#0B0C0F" />
            </SvgLinearGradient>
            {/* the reflected shaft is blurred 5px on the canvas — soft radial instead */}
            <RadialGradient id={`sdShaft${id}`} cx="50%" cy="0%" rx="50%" ry="100%">
              <Stop offset="0" stopColor="#DFDCD3" stopOpacity={0.15} />
              <Stop offset="1" stopColor="#DFDCD3" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={16} fill={`url(#sdGlow${id})`} />
          <Rect x={0} y={12} width={W} height={92} fill={`url(#sdSea${id})`} />
          {/* The moon's reflection: canvas `right:56 top:240 38 × 58` in a
              layer whose origin is canvas 226, so the box is local 14 → 72 and
              the ellipse is centred on 43 with a 29 radius. `cy` is the centre
              and `ry` the half-height — passing the box's top and its full
              height puts the focal 58 too high, which halves the alpha over the
              box and cuts a hard edge across the waterline glow above it. The
              canvas blurs the shaft 5px; the gradient's falloff carries that
              rather than a bigger box (DECISIONS.md D010). */}
          <Ellipse cx={W - 75} cy={43} rx={19} ry={29} fill={`url(#sdShaft${id})`} />
          <Rect x={W - 88} y={22} width={26} height={1.5} rx={0.75} fill="rgba(244,243,240,0.2)" />
        </Svg>

        <Grain source={noiseDark} opacity={0.06} />
      </View>

      <PressScale
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 20 }}
        style={{ position: 'absolute', left: 16, top: y(62), minHeight: 0 }}>
        <Svg width={10} height={17} viewBox="0 0 10 17" fill="none">
          <Path d="M8.5 1.5L2 8.5l6.5 7" stroke="#F4F3F0" strokeWidth={2.2} strokeLinecap="round" />
        </Svg>
      </PressScale>

      <AppText style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: y(96), textAlign: 'center', fontSize: 13, letterSpacing: 0.2, color: 'rgba(244,243,240,0.55)' }]}>
        Recovery score
      </AppText>
      <AppText
        style={[
          sans('500'),
          { position: 'absolute', left: 0, right: 0, top: y(118), textAlign: 'center', fontSize: 58, letterSpacing: 2, color: '#FFFFFF' },
        ]}>
        {score.total.toLocaleString()}
      </AppText>

      <View style={{ position: 'absolute', left: 0, right: 0, top: y(198), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        <Svg width={15} height={9.75} viewBox="0 0 40 26">
          <Path d="M21 3 L21 16 L12 16 Z" fill="rgba(244,243,240,0.75)" />
          <Path d="M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z" fill="rgba(244,243,240,0.75)" />
        </Svg>
        <AppText style={[sans('500'), { fontSize: 13.5, letterSpacing: 0.3, color: 'rgba(244,243,240,0.85)' }]}>
          {score.rank.name} · {TIER[tier - 1] ?? TIER[TIER.length - 1]}
        </AppText>
      </View>

      <View style={{ position: 'absolute', left: 32, right: 32, top: y(250), height: 5, borderRadius: 3, backgroundColor: 'rgba(244,243,240,0.14)', overflow: 'hidden' }}>
        <View style={{ width: `${score.progress * 100}%`, height: 5, borderRadius: 3, backgroundColor: 'rgba(244,243,240,0.92)' }} />
      </View>
      <View style={{ position: 'absolute', left: 32, right: 32, top: y(268), flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={[sans('500'), { fontSize: 11.5, color: 'rgba(244,243,240,0.5)' }]}>
          {score.rank.name} · {score.rank.at.toLocaleString()}
        </AppText>
        {score.next ? (
          <AppText style={[sans('500'), { fontSize: 11.5, color: 'rgba(244,243,240,0.5)' }]}>
            {score.next.name} · {score.next.at.toLocaleString()}
          </AppText>
        ) : null}
      </View>
    </>
  );
}

/* ------------------------------------------------------------------ 111 · time */

// The plot's own frame inside the 393 × 236 chart box, read off the canvas: the
// line runs 56 → 352, and 1,400 sits at y 1 with 800 at y 190.
/** The two windows the range control offers, in days. */
const SHORT_SPAN = 90;
const LONG_SPAN = 365;
const PLOT_L = 56;
const PLOT_R = 352;
const PLOT_TOP = 1;
const PLOT_BOTTOM = 190;
const Y_LABEL_TOP = [-6, 58, 124, 183];
const X_LABEL_LEFT = [40, 178, 314];

function OverTime({
  W,
  total,
  threshold,
  history,
  range,
  onRange,
}: {
  W: number;
  total: number;
  threshold?: number;
  history: History;
  range: '3M' | '1Y';
  onRange: (r: '3M' | '1Y') => void;
}) {
  const id = useId().replace(/:/g, '');
  const span = range === '3M' ? SHORT_SPAN : LONG_SPAN;
  const from = Math.max(0, history.values.length - span);
  const values = sample(history.values.slice(from), 48);
  const scale = niceScale(values, threshold);
  const at = (v: number) => PLOT_TOP + ((scale.top - v) / (scale.top - scale.bottom)) * (PLOT_BOTTOM - PLOT_TOP);

  // A one-day-old account still gets a line, drawn flat across the plot.
  const pts =
    values.length === 1
      ? [
          { x: PLOT_L, y: at(values[0]) },
          { x: PLOT_R, y: at(values[0]) },
        ]
      : values.map((v, i) => ({ x: PLOT_L + (i / (values.length - 1)) * (PLOT_R - PLOT_L), y: at(v) }));
  const line = smoothPath(pts);
  const area = `${line} L${PLOT_R},236 L${PLOT_L},236 Z`;
  const endY = pts[pts.length - 1]?.y ?? at(total);

  // The chart stretches to the screen, so the callout tracks the last point's
  // stretched x rather than the raw 352 of the 393-wide canvas.
  const endX = (PLOT_R / 393) * W;
  const firstDay = history.dayAt(from);
  const lastDay = history.dayAt(history.values.length - 1);
  const midDay = history.dayAt(Math.round((from + history.values.length - 1) / 2));
  const gain = history.values[history.values.length - 1] - history.values[from];

  return (
    <>
      <AppText style={[sans('600'), { position: 'absolute', left: 20, top: 26, fontSize: 18, letterSpacing: -0.2, color: '#1D1C1A' }]}>Score over time</AppText>

      {/* `20A · Score Detail` draws both pills whatever the account holds, so
          both are drawn. Below 90 days the two windows cover the same record
          and the line does not move when they are tapped — which is the truth
          about a young account, not a fault, and the frame is the authority on
          what is on the screen. */}
      <View style={{ position: 'absolute', right: 16, top: 22, flexDirection: 'row', gap: 6 }}>
        {(['3M', '1Y'] as const).map((r) => (
          <PressScale
            key={r}
            onPress={() => onRange(r)}
            accessibilityRole="button"
            accessibilityLabel={r === '3M' ? 'Three months' : 'One year'}
            hitSlop={{ top: 12, bottom: 12, left: 6, right: 6 }}
            style={{
              minHeight: 0,
              height: 30,
              borderRadius: 15,
              backgroundColor: range === r ? '#131313' : 'rgba(19,19,19,0.06)',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 14,
            }}>
            <AppText style={[sans('600'), { fontSize: 12.5, color: range === r ? '#FFFFFF' : '#8B8882' }]}>{r}</AppText>
          </PressScale>
        ))}
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, top: 120, height: 236 }}>
        <Svg width={W} height={236} viewBox="0 0 393 236" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0 }}>
          <Defs>
            <SvgLinearGradient id={`sdF2${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#131313" stopOpacity={0.11} />
              <Stop offset="100%" stopColor="#131313" stopOpacity={0} />
            </SvgLinearGradient>
          </Defs>
          <Line x1={150} y1={16} x2={150} y2={200} stroke="rgba(19,19,19,0.05)" strokeWidth={1} />
          <Line x1={282} y1={16} x2={282} y2={200} stroke="rgba(19,19,19,0.05)" strokeWidth={1} />
          {threshold != null ? (
            <Line x1={52} y1={at(threshold)} x2={393} y2={at(threshold)} stroke="rgba(19,19,19,0.12)" strokeWidth={1} strokeDasharray="6 5" />
          ) : null}
          <Line x1={352} y1={4} x2={352} y2={200} stroke="rgba(19,19,19,0.14)" strokeWidth={1} strokeDasharray="3 5" />
          <Path d={area} fill={`url(#sdF2${id})`} />
          <Path d={line} fill="none" stroke="#131313" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx={352} cy={endY} r={9} fill="#F6F5F2" stroke="rgba(19,19,19,0.22)" strokeWidth={1.5} />
          <Circle cx={352} cy={endY} r={4.5} fill="#131313" />
        </Svg>

        {Y_LABEL_TOP.map((top, i) => (
          <AppText key={top} style={[sans('500'), { position: 'absolute', left: 16, top, fontSize: 11.5, color: '#B0AEA8' }]}>
            {(scale.top - i * scale.step).toLocaleString()}
          </AppText>
        ))}
        {[firstDay, midDay, lastDay].map((t, i) => (
          <AppText key={X_LABEL_LEFT[i]} style={[sans('500'), { position: 'absolute', left: X_LABEL_LEFT[i], top: 210, fontSize: 12, color: '#8B8882' }]}>
            {new Date(t).toLocaleDateString(undefined, { month: 'short' })}
          </AppText>
        ))}
      </View>

      {/* the canvas gives the pill z-index:6 over the chart; RN paints in order, so it must follow the chart box */}
      <View
        style={{
          position: 'absolute',
          left: endX,
          top: 120 + endY - 40,
          height: 30,
          borderRadius: 15,
          backgroundColor: '#131313',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 13,
          boxShadow: '0 6px 14px rgba(19,19,19,0.22)',
          transform: [{ translateX: '-50%' }],
        }}>
        <AppText style={[sans('600'), { fontSize: 13, color: '#FFFFFF' }]}>{total.toLocaleString()}</AppText>
      </View>

      <InsightCard
        glyph={<TrendGlyph />}
        title={`${gain < 0 ? '−' : '+'}${Math.abs(gain)} points`}
        sub={`vs ${monthDay(firstDay)} – ${monthDay(lastDay)}`}
        body={'Keep going. You’re building real momentum.'}
      />
    </>
  );
}

/* ----------------------------------------------------------------- 112 · moves */

// The canvas runs the bars from 34 to 150 across the run of the ledger, so the
// smallest line stays readable and the largest fills the row.
const BAR_MIN = 34;
const BAR_MAX = 150;
const BAR_TONE = ['rgba(19,19,19,1)', 'rgba(19,19,19,0.55)', 'rgba(19,19,19,0.38)', 'rgba(19,19,19,0.25)'];

function WhatMoved({ lines, net }: { lines: { label: string; points: number }[]; net: number }) {
  const mags = lines.map((l) => Math.abs(l.points));
  const lo = mags.length ? Math.min(...mags) : 0;
  const hi = mags.length ? Math.max(...mags) : 1;

  return (
    <>
      <AppText style={[sans('600'), { position: 'absolute', left: 20, top: 26, fontSize: 18, letterSpacing: -0.2, color: '#1D1C1A' }]}>What moved it</AppText>
      <AppText style={[sans('500'), { position: 'absolute', right: 20, top: 32, fontSize: 12.5, color: '#8B8882' }]}>this month</AppText>

      {lines.map((line, i) => {
        const width = hi === lo ? BAR_MAX : BAR_MIN + ((Math.abs(line.points) - lo) / (hi - lo)) * (BAR_MAX - BAR_MIN);
        const down = line.points < 0;
        return (
          <View key={line.label} style={{ position: 'absolute', left: 20, right: 20, top: 100 + i * 52, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <AppText style={[sans('500'), { width: 108, fontSize: 13.5, color: '#1D1C1A' }]}>{line.label}</AppText>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  width,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: down ? undefined : BAR_TONE[Math.min(i, BAR_TONE.length - 1)],
                  boxShadow: down ? 'inset 0 0 0 1.5px #131313' : undefined,
                }}
              />
            </View>
            <AppText style={[sans('600'), { width: 38, textAlign: 'right', fontSize: 13.5, color: '#1D1C1A' }]}>
              {down ? '−' : '+'}
              {Math.abs(line.points)}
            </AppText>
          </View>
        );
      })}

      <InsightCard
        glyph={<TrendGlyph />}
        title={`${net < 0 ? '−' : '+'}${Math.abs(net)} net`}
        sub="this month"
        body='Clean days do the heavy lifting. Keep the evenings boring.'
      />
    </>
  );
}

/* ----------------------------------------------------------------- 113 · ranks */

function TheRanks({ total, toGo, next, pace }: { total: number; toGo: number; next?: string; pace: number }) {
  return (
    <>
      <AppText style={[sans('600'), { position: 'absolute', left: 20, top: 26, fontSize: 18, letterSpacing: -0.2, color: '#1D1C1A' }]}>The ranks</AppText>

      {RANKS.map((rank, i) => {
        const reached = total >= rank.at;
        const here = reached && (i === RANKS.length - 1 || total < RANKS[i + 1].at);
        return (
          <View
            key={rank.name}
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              top: 92 + i * 64,
              height: 56,
              borderRadius: 16,
              backgroundColor: here ? '#ECEBE4' : undefined,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 13,
              paddingHorizontal: 12,
            }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: reached ? '#131313' : '#FFFFFF',
                boxShadow: reached ? undefined : 'inset 0 0 0 1.5px rgba(0,0,0,0.14)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {here ? (
                <Svg width={16} height={10.4} viewBox="0 0 40 26">
                  <Path d="M21 3 L21 16 L12 16 Z" fill="#F4F3F0" />
                  <Path d="M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z" fill="#F4F3F0" />
                </Svg>
              ) : reached ? (
                <Svg width={13} height={10} viewBox="0 0 16 12" fill="none">
                  <Path d="M1.5 6l4.4 4.5L14.5 1.5" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              ) : null}
            </View>
            <AppText style={[sans('600'), { flex: 1, fontSize: 15, color: reached ? '#1D1C1A' : '#8B8882' }]}>{rank.name}</AppText>
            {here ? (
              <View style={{ borderRadius: 9, backgroundColor: '#131313', paddingHorizontal: 9, paddingVertical: 3 }}>
                <AppText style={[sans('600'), { fontSize: 11.5, color: '#F4F3F0' }]}>you’re here</AppText>
              </View>
            ) : null}
            <AppText style={[sans('500'), { fontSize: 13, color: '#8B8882' }]}>{rank.at.toLocaleString()}</AppText>
          </View>
        );
      })}

      <InsightCard
        glyph={<FlagGlyph />}
        title={next ? `${toGo} to go` : 'Top of the ladder'}
        sub={next ?? RANKS[RANKS.length - 1].name}
        body={paceLine(toGo, pace, next != null)}
      />
    </>
  );
}

/**
 * How long the next rung takes at the pace of the last month. Deliberately a
 * range in weeks once it is more than a few days out — a precise date on a
 * number this noisy would be a promise the app cannot keep.
 */
function paceLine(toGo: number, pace: number, hasNext: boolean) {
  if (!hasNext) return 'Nothing left to climb. Steady beats fast.';
  if (pace <= 0) return 'The pace decides this one. Steady beats fast.';
  const days = Math.ceil(toGo / pace);
  if (days <= 4) return `About ${days} days at this pace. Steady beats fast.`;
  const weeks = Math.max(1, Math.round(days / 7));
  return `About ${weeks === 1 ? 'a week' : `${weeks} weeks`} at this pace. Steady beats fast.`;
}

/* -------------------------------------------------------------- shared pieces */

/** The one-line reading under each page — glyph, headline, and a sentence of plain sense. */
function InsightCard({ glyph, title, sub, body }: { glyph: ReactNode; title: string; sub: string; body: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        top: 396,
        height: 64,
        borderRadius: 18,
        backgroundColor: '#ECEBE4',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
      }}>
      <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>{glyph}</View>
      <View>
        <AppText style={[sans('600'), { fontSize: 13.5, color: '#1D1C1A' }]}>{title}</AppText>
        <AppText style={[sans('400'), { marginTop: 2, fontSize: 11.5, color: '#8B8882' }]}>{sub}</AppText>
      </View>
      <View style={{ flex: 1 }} />
      <AppText style={[sans('400'), { width: 152, fontSize: 12, lineHeight: 17, color: '#55534E' }]}>{body}</AppText>
    </View>
  );
}

function TrendGlyph() {
  return (
    <Svg width={16} height={11} viewBox="0 0 16 11" fill="none">
      <Path d="M1.5 9.5L6 5l3 2.5L14.5 1.5" stroke="#FFFFFF" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10.8 1.5h3.7V5.2" stroke="#FFFFFF" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FlagGlyph() {
  return (
    <Svg width={14} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M6 22V3" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
      <Path d="M6.5 3.5h11.5l-3.1 4.5 3.1 4.5H6.5Z" fill="#FFFFFF" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ the numbers */

type History = { values: number[]; dayAt: (i: number) => number };

const monthDay = (t: number) => new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

function dayKey(t: number) {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Replay the score one day at a time so the curve is the user's own history
 * rather than a drawn shape. Same weights the total uses; the series is then
 * shifted so its last point lands exactly on the number in the header, because
 * two different answers to "what is my score" would be worse than a rough line.
 */
function scoreHistory(
  checkins: DailyCheckin[],
  events: TidelineEvent[],
  progress: Record<string, LessonProgress>,
  createdAt: number,
  now: number,
  total: number,
): History {
  const start = new Date(createdAt).setHours(0, 0, 0, 0);
  const days = Math.max(1, Math.floor((now - start) / DAY) + 1);

  const gained = new Map<string, number>();
  const add = (key: string, pts: number) => gained.set(key, (gained.get(key) ?? 0) + pts);
  const lapsed = new Set<string>();
  for (const e of events) {
    if (e.type === 'lapse') {
      lapsed.add(dayKey(e.createdAt));
      add(dayKey(e.createdAt), SCORE_WEIGHTS.slip);
    }
    if (e.type === 'urge_rode_out') add(dayKey(e.createdAt), SCORE_WEIGHTS.urgeRidden);
  }
  for (const c of checkins) add(c.date, SCORE_WEIGHTS.checkin);
  for (const p of Object.values(progress)) if (p?.status === 'completed' && p.completedAt) add(dayKey(p.completedAt), SCORE_WEIGHTS.lesson);

  const dayAt = (i: number) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d.getTime();
  };

  const values: number[] = [];
  let running = SCORE_BASE;
  for (let i = 0; i < days; i++) {
    const key = dayKey(dayAt(i));
    running += (lapsed.has(key) ? 0 : SCORE_WEIGHTS.cleanDay) + (gained.get(key) ?? 0);
    values.push(running);
  }

  const drift = total - values[values.length - 1];
  return { values: values.map((v) => v + drift), dayAt };
}

/** The ledger for the rolling month, on the same weights as the total. */
function monthLedger(checkins: DailyCheckin[], events: TidelineEvent[], progress: Record<string, LessonProgress>, now: number, daysAlive: number) {
  const since = now - WINDOW * DAY;
  const slips = events.filter((e) => e.type === 'lapse' && e.createdAt >= since);
  const ridden = events.filter((e) => e.type === 'urge_rode_out' && e.createdAt >= since).length;
  const logged = checkins.filter((c) => new Date(`${c.date}T00:00:00`).getTime() >= since).length;
  const lessons = Object.values(progress).filter((p) => p?.status === 'completed' && p.completedAt != null && p.completedAt >= since).length;
  const days = Math.min(WINDOW, Math.max(1, daysAlive));

  const lines = [
    { label: 'Clean days', points: Math.max(0, days - slips.length) * SCORE_WEIGHTS.cleanDay },
    { label: 'Check-ins', points: logged * SCORE_WEIGHTS.checkin },
    { label: 'Lessons', points: lessons * SCORE_WEIGHTS.lesson },
    { label: 'Urges ridden', points: ridden * SCORE_WEIGHTS.urgeRidden },
  ];
  if (slips.length) {
    const last = slips.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
    lines.push({ label: slips.length === 1 ? `Slip · ${monthDay(last.createdAt)}` : `${slips.length} slips`, points: slips.length * SCORE_WEIGHTS.slip });
  }

  return { lines, net: lines.reduce((sum, l) => sum + l.points, 0), days };
}

/**
 * Four labels, 200 apart on the canvas — the step widens only if the run needs
 * it. The next rank always sits above every value in the run, so folding it into
 * the run's own max would let the top label land exactly on the threshold and
 * flatten the dashed rank line onto the plot's top edge. It asks for a step that
 * clears it instead, which is what the canvas draws: 1,300 under a 1,400 ceiling.
 */
function niceScale(values: number[], threshold?: number) {
  const lo = values.length ? Math.min(...values) : SCORE_BASE;
  const hi = values.length ? Math.max(...values) : SCORE_BASE;
  const topFor = (s: number) => Math.floor(lo / s) * s + 3 * s;
  const step = [50, 100, 200, 250, 500, 1000, 2000].find((s) => topFor(s) >= hi && (threshold == null || topFor(s) > threshold)) ?? 2000;
  const bottom = Math.floor(lo / step) * step;
  return { bottom, step, top: bottom + step * 3 };
}

/** Thin a long run down to at most `max` evenly spaced points. */
function sample(values: number[], max: number) {
  if (values.length <= max) return values;
  const out: number[] = [];
  for (let i = 0; i < max; i++) out.push(values[Math.round((i / (max - 1)) * (values.length - 1))]);
  return out;
}

/** Catmull-Rom through the points, emitted as cubics — the canvas's soft climb. */
function smoothPath(pts: { x: number; y: number }[]) {
  if (!pts.length) return '';
  const r = (n: number) => Math.round(n * 100) / 100;
  let d = `M${r(pts[0].x)},${r(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${r(p1.x + (p2.x - p0.x) / 6)},${r(p1.y + (p2.y - p0.y) / 6)} ${r(p2.x - (p3.x - p1.x) / 6)},${r(p2.y - (p3.y - p1.y) / 6)} ${r(p2.x)},${r(p2.y)}`;
  }
  return d;
}
