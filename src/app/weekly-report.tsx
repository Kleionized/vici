import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode, useId, useMemo, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Line, LinearGradient as SvgLinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Grain, LoadingView, PressScale } from '@/components/ui';
import { useCheckins, useCurrentUser, useEvents, useLessonProgressMap } from '@/lib/backend';
import { SCORE_BASE, SCORE_WEIGHTS } from '@/lib/score';
import { colors, sans } from '@/lib/theme';
import type { DailyCheckin, TidelineEvent } from '@/lib/types';
import { buildWeeklyReport, hasReportContent, latestCompletedWeek, severityWord } from '@/lib/weeklyReport';

/**
 * 031–033 · Weekly report — three pages behind one standing header.
 *
 * The header never changes as you swipe: the week, the counts, the lamp on the
 * desk. What changes underneath is which question the week is answering — where
 * the score went, which days held, and what the urges were. Every page closes on
 * the same white card, so the week always ends on a sentence.
 *
 * Laid out from the canvas's 393 × 852 frame: the status bar ends at 54, so
 * every `top` below is the canvas y minus 54.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

const DAY_MS = 86_400_000;
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAY_NAME = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COUNT_WORD = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];

/**
 * The four tones the canvas draws a week in, weakest to strongest. Mood runs on
 * five steps, so Fine and Good share the mid tone rather than inventing a fifth
 * colour the design never states.
 */
const DAY_TONES = ['#CDC9BD', '#A9A597', '#767267', '#131313'];
const MOOD_TONE = [0, 1, 2, 2, 3];

/** Round values the score axis is allowed to step by — the canvas's own is 20. */
const NICE_STEPS = [10, 20, 25, 50, 100, 200, 250, 500, 1000];

export default function WeeklyReport() {
  const router = useRouter();
  // `Settings Weekly Report` (93D) is this same board reached from Settings —
  // the only difference the canvas draws is that the back row reads "Settings".
  const { week, from } = useLocalSearchParams<{ week?: string; from?: string }>();
  const backLabel = from === 'settings' ? 'Settings' : 'Back';
  const user = useCurrentUser();
  const checkins = useCheckins();
  const events = useEvents();
  const progress = useLessonProgressMap();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);

  const weekStart = week || (user ? latestCompletedWeek(user.createdAt) : null);
  const report = useMemo(
    () => (weekStart && checkins && events ? buildWeeklyReport(weekStart, checkins, events) : null),
    [weekStart, checkins, events],
  );
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/dashboard'));

  if (checkins === undefined || events === undefined || user === undefined || progress === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <LoadingView />
      </View>
    );
  }

  if (!hasReportContent(report)) {
    // Two different empty states: no week has closed yet, or one closed with
    // nothing logged in it. Only the second is reachable from the Mail list.
    const closed = report != null;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <Grain source={noiseDark} opacity={0.07} />
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          {/* Yoga lays an absolute child out from the SafeAreaView's border box, so the inset — expressed as padding — is ignored. This plain flow child carries it. */}
          <View style={{ flex: 1 }}>
            <BackRow label={backLabel} onPress={back} />
            <AppText style={[sans('600'), { position: 'absolute', left: 24, top: 60, fontSize: 27, lineHeight: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>
              Weekly report
            </AppText>
            <AppText style={[sans('400'), { position: 'absolute', left: 24, right: 24, top: 130, fontSize: 20, lineHeight: 28, color: colors.textMuted }]}>
              {closed
                ? 'Nothing was logged that week, so the report has nothing to draw on.'
                : 'Your first week is still being written. Keep checking in — once a full week closes, its report lands here.'}
            </AppText>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const startMs = new Date(`${report.weekStart}T00:00:00`).getTime();
  const createdAt = user?.createdAt ?? startMs;
  const lessonTimes = Object.values(progress)
    .filter((p) => p.status === 'completed')
    .map((p) => p.completedAt ?? 0);

  // The line is the running score, sampled at the end of each of the seven
  // days, with the Sunday before the week as the baseline the gain is read off.
  const base = scoreAt(startMs - 1, createdAt, checkins, events, lessonTimes);
  const values = Array.from({ length: 7 }, (_, i) => scoreAt(startMs + (i + 1) * DAY_MS - 1, createdAt, checkins, events, lessonTimes));
  const gain = Math.round(values[6] - base);

  const urges = events
    .filter((e) => (e.type === 'urge_rode_out' || e.type === 'urge_acted_on') && e.createdAt >= startMs && e.createdAt < startMs + 7 * DAY_MS)
    .sort((a, b) => a.createdAt - b.createdAt);
  const ridden = urges.filter((e) => e.type === 'urge_rode_out').length;

  const pageH = height - insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Grain source={noiseDark} opacity={0.07} />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / Math.max(1, width)))}
            style={{ flex: 1 }}>
            <View style={{ width, height: pageH }}>
              <ScorePage values={values} gain={gain} width={width} />
            </View>
            <View style={{ width, height: pageH }}>
              <DaysPage thisMoods={report.thisMoods} lastMoods={report.lastMoods} thisAvg={report.thisAvg} lastAvg={report.lastAvg} prev={rangeLabel(startMs - 7 * DAY_MS)} />
            </View>
            <View style={{ width, height: pageH }}>
              <UrgesPage urges={urges} ridden={ridden} relapses={report.relapses} onOpen={() => router.push(`/urge-overview?week=${report.weekStart}`)} />
            </View>
          </ScrollView>

          {/* the standing header — identical on all three pages */}
          <BackRow label={backLabel} onPress={back} />
          <AppText style={[sans('500'), { position: 'absolute', right: 20, top: 14, fontSize: 14, color: '#8B8882' }]}>{report.label}</AppText>
          <AppText style={[sans('600'), { position: 'absolute', left: 24, top: 60, fontSize: 27, lineHeight: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>
            Weekly report
          </AppText>
          <AppText style={[sans('400'), { position: 'absolute', left: 24, top: 103, fontSize: 14.5, color: '#8B8882' }]}>Your week at a glance</AppText>
          <DeskLamp />
          <View style={{ position: 'absolute', left: 24, top: 158, flexDirection: 'row', gap: 8 }}>
            <Chip label={`${report.checkins} ${report.checkins === 1 ? 'check-in' : 'check-ins'}`} />
            <Chip label={`${report.urges} ${report.urges === 1 ? 'urge' : 'urges'}`} />
            <Chip label={`${report.relapses} ${report.relapses === 1 ? 'relapse' : 'relapses'}`} />
          </View>

          <View style={{ position: 'absolute', left: 0, right: 0, top: 630, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: i === page ? '#131313' : 'rgba(19,19,19,0.16)' }} />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ------------------------------------------------------------------- chrome */

/** Canvas y 64 — the row is only as tall as its chevron, so the target is hitSlop. */
function BackRow({ label = 'Back', onPress }: { label?: string; onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 16, bottom: 16, left: 20, right: 24 }}
      style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
        <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>{label}</AppText>
    </PressScale>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <View style={{ height: 27, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)', justifyContent: 'center', paddingHorizontal: 12 }}>
      <AppText style={[sans('600'), { fontSize: 13, color: '#1D1C1A' }]}>{label}</AppText>
    </View>
  );
}

/** A lamp left on over a closed book — the week, read at the desk. */
function DeskLamp() {
  const id = useId().replace(/:/g, '');
  return (
    <View style={{ position: 'absolute', right: 16, top: 46, width: 88, height: 78 }}>
      <Svg width={88} height={78} viewBox="0 0 88 78">
        <Defs>
          <SvgLinearGradient id={`shade${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4A4843" />
            <Stop offset="1" stopColor="#1D1C19" />
          </SvgLinearGradient>
          <SvgLinearGradient id={`page${id}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="1" stopColor="#E8E7E0" />
          </SvgLinearGradient>
          <RadialGradient id={`glow${id}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.45} />
            <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        {/* the canvas blurs this glow by 3px; RN SVG has no blur filter, so it is drawn as the equivalent radial falloff */}
        <Ellipse cx={32} cy={26} rx={28} ry={28} fill={`url(#glow${id})`} />
        <Ellipse cx={28} cy={67} rx={15} ry={2.6} fill="rgba(40,38,32,0.13)" />
        <Ellipse cx={66} cy={69} rx={19} ry={2.8} fill="rgba(40,38,32,0.13)" />
        <Rect x={26.8} y={34} width={2.6} height={30} rx={1.3} fill="#C4C3BC" />
        <Circle cx={28} cy={27} r={8.5} fill={`url(#shade${id})`} />
        <Path d="M22.5 24.5 A7 7 0 0 1 28 21.5" stroke="rgba(255,255,255,0.22)" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <Rect x={20} y={63} width={16} height={2.6} rx={1.3} fill="#C4C3BC" />
        <Rect x={58} y={43} width={16} height={6.5} rx={2.4} fill={`url(#shade${id})`} />
        <Rect x={50} y={50} width={34} height={16} rx={3} fill={`url(#page${id})`} stroke="rgba(0,0,0,0.14)" strokeWidth={1} />
        <Path d="M56 58 L78 58" stroke="rgba(0,0,0,0.1)" strokeWidth={1.4} strokeLinecap="round" />
        <Rect x={53} y={66} width={2.4} height={4} fill="#C4C3BC" />
        <Rect x={78.6} y={66} width={2.4} height={4} fill="#C4C3BC" />
      </Svg>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <AppText style={[sans('600'), { position: 'absolute', left: 24, top: 240, fontSize: 20, letterSpacing: -0.1, color: '#1D1C1A' }]}>{children}</AppText>
  );
}

/** The white sentence the week ends on — the same box on all three pages. */
function Verdict({ glyph, title, sub, body }: { glyph: ReactNode; title: string; sub: string; body: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        top: 538,
        height: 76,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 10px 24px rgba(40,38,32,0.06)',
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
      <AppText style={[sans('400'), { flex: 1, paddingLeft: 8, fontSize: 12.5, lineHeight: 17, color: '#55534E' }]}>{body}</AppText>
    </View>
  );
}

/* --------------------------------------------------------------- 031 · score */

function ScorePage({ values, gain, width }: { values: number[]; gain: number; width: number }) {
  const id = useId().replace(/:/g, '');
  // The chart is full-bleed: its 50pt left gutter and 16pt right gutter hold on
  // any width and only the plot interior stretches, so the axis labels and the
  // day letters keep sitting under the same gridlines.
  const px = (x: number) => 50 + ((x - 50) * (width - 66)) / 327;

  const hi = Math.max(...values);
  const lo = Math.min(...values);
  // The canvas's axis is quantised — 1,240 / 1,220 / 1,200, a round 20 a
  // gridline — so the step is snapped to a round number rather than read off the
  // week's own span, and the top gridline is the first multiple of it at or
  // above the high. The smallest step that still fits the whole week between the
  // top gridline (y 30) and the floor (y 178, 148px = 2.3125 gridlines) wins; the
  // 20-point floor keeps a flat week from drawing a step of nothing.
  const range = Math.max(hi - lo, 20);
  const step = NICE_STEPS.find((s) => (s * 148) / 64 >= range && Math.ceil(hi / s) * s - lo <= (s * 148) / 64) ?? NICE_STEPS[NICE_STEPS.length - 1];
  const top = Math.ceil(hi / step) * step;
  const y = (v: number) => 30 + ((top - v) * 64) / step;
  const gridValue = (row: number) => top - row * step;

  const pts = values.map((v, i) => ({ x: px(56 + (i * (352 - 56)) / 6), y: y(v) }));
  const line = smoothPath(pts);
  const end = values[6];
  const endY = pts[6].y;

  return (
    <View style={{ flex: 1 }}>
      <SectionTitle>Recovery score</SectionTitle>

      <View
        style={{
          position: 'absolute',
          right: 24,
          top: 234,
          height: 30,
          borderRadius: 15,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 12,
        }}>
        <Svg width={13} height={9} viewBox="0 0 14 10" fill="none">
          <Path d="M1 8.5L5 4.5l2.5 2L12.5 1.5" stroke="#1D1C1A" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <AppText style={[sans('600'), { fontSize: 12, color: '#1D1C1A' }]}>{gain > 0 ? 'steady climb' : gain < 0 ? 'a dip, then back' : 'holding'}</AppText>
      </View>

      {[0, 1, 2].map((row) => (
        <AppText key={row} style={[sans('500'), { position: 'absolute', left: 16, top: 308 + row * 64, fontSize: 11.5, color: '#B0AEA8' }]}>
          {gridValue(row).toLocaleString()}
        </AppText>
      ))}

      <Svg width={width} height={220} style={{ position: 'absolute', left: 0, top: 286 }}>
        <Defs>
          <SvgLinearGradient id={`fill${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="rgba(19,19,19,0.10)" />
            <Stop offset="1" stopColor="rgba(19,19,19,0)" />
          </SvgLinearGradient>
        </Defs>
        <Line x1={px(50)} y1={30} x2={px(377)} y2={30} stroke="rgba(19,19,19,0.07)" strokeWidth={1} />
        <Line x1={px(50)} y1={94} x2={px(377)} y2={94} stroke="rgba(19,19,19,0.07)" strokeWidth={1} />
        <Line x1={px(50)} y1={158} x2={px(377)} y2={158} stroke="rgba(19,19,19,0.07)" strokeWidth={1} />
        {/* the canvas's dashed rule runs 16 → 195, i.e. 14 above the end dot down to the floor; it has to keep that gap wherever the week ends */}
        <Line x1={px(352)} y1={endY - 14} x2={px(352)} y2={195} stroke="rgba(19,19,19,0.14)" strokeWidth={1} strokeDasharray="3 5" />
        <Path d={`${line} L${px(352)},195 L${px(56)},195 Z`} fill={`url(#fill${id})`} />
        <Path d={line} fill="none" stroke="#131313" strokeWidth={2.4} strokeLinecap="round" />
        <Circle cx={px(352)} cy={endY} r={9} fill="#F6F5F2" stroke="rgba(19,19,19,0.22)" strokeWidth={1.5} />
        <Circle cx={px(352)} cy={endY} r={4.5} fill="#131313" />
      </Svg>

      {/* the reading, centred on the last point — the canvas's translateX(-50%).
          Its bottom sits 3 above the r9 dot (frame: pill 330→358, dot top 361),
          so it rides with the dot instead of pinning to a week that ends high. */}
      <View style={{ position: 'absolute', left: px(352) - 50, top: 286 + endY - 40, width: 100, alignItems: 'center' }}>
        <View style={{ height: 28, borderRadius: 14, backgroundColor: '#131313', justifyContent: 'center', paddingHorizontal: 12, boxShadow: '0 6px 14px rgba(19,19,19,0.22)' }}>
          <AppText style={[sans('600'), { fontSize: 12.5, color: '#FFFFFF' }]}>{Math.round(end).toLocaleString()}</AppText>
        </View>
      </View>

      <View style={{ position: 'absolute', left: 50, right: 16, top: 510, flexDirection: 'row', justifyContent: 'space-between' }}>
        {DOW.map((d, i) => (
          <AppText key={`${d}${i}`} style={[sans('500'), { fontSize: 12, color: '#8B8882' }]}>
            {d}
          </AppText>
        ))}
      </View>

      <Verdict
        glyph={
          <Svg width={16} height={11} viewBox="0 0 16 11" fill="none">
            <Path d="M1.5 9.5L6 5l3 2.5L14.5 1.5" stroke="#FFFFFF" strokeWidth={1.9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M10.8 1.5h3.7V5.2" stroke="#FFFFFF" strokeWidth={1.9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        }
        title={`${gain >= 0 ? '+' : '−'}${Math.abs(gain)} points`}
        sub="this week"
        body={gain > 0 ? 'A steady climb. Keep the evenings boring.' : gain < 0 ? 'The week gave some back. One anchor at a time.' : 'A flat week. Same anchors, nothing new.'}
      />
    </View>
  );
}

/* ---------------------------------------------------------------- 032 · days */

function DaysPage({
  thisMoods,
  lastMoods,
  thisAvg,
  lastAvg,
  prev,
}: {
  thisMoods: (number | null)[];
  lastMoods: (number | null)[];
  thisAvg: number;
  lastAvg: number | null;
  prev: string;
}) {
  const steady = thisMoods.filter((m) => m != null && m >= 3).length;
  // The canvas names Friday — the row's one #131313 cell, the darkest tone and
  // so the week's strongest day. The day that tested you is the one you met, not
  // the palest well, so the sentence points at the top of the tone ramp.
  const test = thisMoods.reduce<number | null>((best, m, i) => (m == null ? best : best == null || m > (thisMoods[best] ?? -1) ? i : best), null);

  return (
    <View style={{ flex: 1 }}>
      <SectionTitle>Day by day</SectionTitle>

      <View style={{ position: 'absolute', left: 24, right: 24, top: 288, flexDirection: 'row', gap: 7 }}>
        {DOW.map((d, i) => (
          <AppText key={`${d}${i}`} center style={[sans('500'), { flex: 1, fontSize: 11, color: '#8B8882' }]}>
            {d}
          </AppText>
        ))}
      </View>

      <AppText style={[sans('500'), { position: 'absolute', left: 24, top: 320, fontSize: 12.5, color: '#8B8882' }]}>Last week</AppText>
      <WeekRow moods={lastMoods} top={344} faded />

      <AppText style={[sans('500'), { position: 'absolute', left: 24, top: 412, fontSize: 12.5, color: '#8B8882' }]}>This week</AppText>
      <WeekRow moods={thisMoods} top={436} />

      <Verdict
        glyph={
          <Svg width={15} height={15} viewBox="0 0 18 18" fill="none">
            <Rect x={1.5} y={3} width={15} height={13.5} rx={3} fill="none" stroke="#FFFFFF" strokeWidth={1.8} />
            <Path d="M5.5 1.5v3M12.5 1.5v3M1.5 7.5h15" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
        }
        title={lastAvg == null ? 'Your first week' : thisAvg >= lastAvg ? 'Stronger week' : 'A heavier week'}
        sub={`vs ${prev}`}
        body={`${COUNT_WORD[steady]} steady ${steady === 1 ? 'day' : 'days'} of seven.${test != null ? ` ${DAY_NAME[test]} was the test.` : ''}`}
      />
    </View>
  );
}

/** Seven wells of tone. A day with no check-in has no tone, so it stays empty. */
function WeekRow({ moods, top, faded = false }: { moods: (number | null)[]; top: number; faded?: boolean }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top, flexDirection: 'row', gap: 7, opacity: faded ? 0.4 : 1 }}>
      {moods.map((m, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            backgroundColor: m == null ? 'rgba(19,19,19,0.06)' : DAY_TONES[MOOD_TONE[Math.max(0, Math.min(4, Math.round(m) - 1))]],
          }}
        />
      ))}
    </View>
  );
}

/* --------------------------------------------------------------- 033 · urges */

function UrgesPage({ urges, ridden, relapses, onOpen }: { urges: TidelineEvent[]; ridden: number; relapses: number; onOpen: () => void }) {
  // Three rows is what fits above the verdict card; the rest live in the overview.
  const rows = urges.slice(0, 3);

  return (
    <View style={{ flex: 1 }}>
      <SectionTitle>This week’s urges</SectionTitle>

      {rows.length === 0 ? (
        <AppText style={[sans('400'), { position: 'absolute', left: 24, right: 24, top: 294, fontSize: 14, color: '#8B8882' }]}>No urges logged this week.</AppText>
      ) : null}

      {rows.map((e, i) => (
        <UrgeRow key={e._id} event={e} top={294 + i * 64} onPress={onOpen} />
      ))}

      <Verdict
        glyph={
          <Svg width={15} height={12} viewBox="0 0 16 13" fill="none">
            <Path d="M1.5 7l4.5 4.5L14.5 1.5" stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        }
        title={`${ridden} of ${urges.length} ridden out`}
        sub={relapses ? `${relapses} ${relapses === 1 ? 'slip' : 'slips'}` : 'no relapse'}
        body={ridden === 0 ? 'Nothing rode out this week.' : ridden === 1 ? 'The timer did its job once.' : ridden === 2 ? 'The timer did its job twice.' : `The timer did its job ${ridden} times.`}
      />
    </View>
  );
}

function UrgeRow({ event, top, onPress }: { event: TidelineEvent; top: number; onPress: () => void }) {
  const trigger = event.trigger?.split(' · ')[0];
  const word = severityWord(event.severity ?? null);
  const title = [trigger, word].filter(Boolean).join(' · ') || 'Urge';
  const when = new Date(event.createdAt);
  const outcome = event.whatHelped ? event.whatHelped.toLowerCase() : event.type === 'urge_acted_on' ? 'slipped' : 'rode it out';

  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${outcome}`}
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top,
        // the canvas is content-box: `height:56` plus a 1px bottom rule makes a
        // 57-tall row, so RN's border-box needs 57 to land the hairline and to
        // centre the disc and the two lines in the same 56.
        height: 57,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
      }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1EFE9', alignItems: 'center', justifyContent: 'center' }}>
        <TriggerGlyph trigger={trigger} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText style={[sans('600'), { fontSize: 14.5, color: '#1D1C1A' }]}>{title}</AppText>
        <AppText style={[sans('400'), { marginTop: 2, fontSize: 12, color: '#8B8882' }]}>
          {DAY_NAME[(when.getDay() + 6) % 7]} · {when.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()}
        </AppText>
      </View>
      <AppText style={[sans('400'), { fontSize: 12.5, color: '#8B8882' }]}>{outcome}</AppText>
      <Svg width={6} height={10} viewBox="0 0 8 14" fill="none">
        <Path d="M1.5 1.5L6.5 7l-5 5.5" fill="none" stroke="#B0AEA8" strokeWidth={2} strokeLinecap="round" />
      </Svg>
    </PressScale>
  );
}

/**
 * The canvas draws three marks for its three rows — a moon, a ring, a spike.
 * Anything the log records that isn't a night or a spike takes the ring.
 */
function TriggerGlyph({ trigger }: { trigger?: string }) {
  const t = (trigger ?? '').toLowerCase();
  if (t === 'late night' || t === 'tired') {
    return (
      <Svg width={15} height={15} viewBox="0 0 30 30">
        <Path d="M17 3 A11 11 0 1 0 25.5 20 A8.6 8.6 0 1 1 17 3 Z" fill="#131313" />
      </Svg>
    );
  }
  if (t === 'stress' || t === 'argument') {
    return (
      <Svg width={14} height={11} viewBox="0 0 14 11" fill="none">
        <Path d="M1 9.5L5 5l3 3 5-6.5" stroke="#131313" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  return <View style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 3.5, borderColor: '#131313' }} />;
}

/* -------------------------------------------------------------------- maths */

/**
 * The score as it stood at a moment, on the same weights the Today card uses —
 * the weekly line has to end on the number that screen shows.
 */
function scoreAt(at: number, createdAt: number, checkins: DailyCheckin[], events: TidelineEvent[], lessons: number[]): number {
  const days = Math.max(0, Math.floor((at - createdAt) / DAY_MS) + 1);
  const slips = events.filter((e) => e.type === 'lapse' && e.createdAt <= at).length;
  const rode = events.filter((e) => e.type === 'urge_rode_out' && e.createdAt <= at).length;
  const logged = checkins.filter((c) => new Date(`${c.date}T00:00:00`).getTime() <= at).length;
  const done = lessons.filter((t) => t <= at).length;
  return (
    SCORE_BASE +
    Math.max(0, days - slips) * SCORE_WEIGHTS.cleanDay +
    logged * SCORE_WEIGHTS.checkin +
    done * SCORE_WEIGHTS.lesson +
    rode * SCORE_WEIGHTS.urgeRidden +
    slips * SCORE_WEIGHTS.slip
  );
}

/**
 * The canvas's line is two hand-drawn cubics over sample data; the real week has
 * to draw itself, so the same curve is generated from the seven scores with
 * Catmull-Rom tangents inside the canvas's own plot box.
 */
function smoothPath(pts: { x: number; y: number }[]): string {
  const r = (n: number) => Math.round(n * 10) / 10;
  let d = `M${r(pts[0].x)},${r(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${r(p1.x + (p2.x - p0.x) / 6)},${r(p1.y + (p2.y - p0.y) / 6)} ${r(p2.x - (p3.x - p1.x) / 6)},${r(p2.y - (p3.y - p1.y) / 6)} ${r(p2.x)},${r(p2.y)}`;
  }
  return d;
}

/** "Jul 7–13", in the same shape the report's own label uses. */
function rangeLabel(startMs: number): string {
  const a = new Date(startMs);
  const b = new Date(startMs + 6 * DAY_MS);
  const month = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' });
  return a.getMonth() === b.getMonth() ? `${month(a)} ${a.getDate()}–${b.getDate()}` : `${month(a)} ${a.getDate()} – ${month(b)} ${b.getDate()}`;
}
