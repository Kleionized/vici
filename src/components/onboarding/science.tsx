/**
 * The science thread in onboarding (D64, D67): four boards after `33 · One
 * Bad Day`, each one something to do, and each one told in pictures first.
 *
 * - 33A · What one slip does: a streak app's ring drains to zero; VICI's days stay.
 * - 33B · Ride it out: hold, and an urge rises, peaks and passes under the finger.
 * - 34A · What matters to you: three values picked from twelve tiles.
 * - 34B · Built on research: the universities as seals, the studies as charts.
 *
 * The owner found the first drafts read as a wall of text (D67): every line
 * that a drawing could carry is gone, and what a study found is a chart.
 *
 * No frame draws these; they are built from the kit at the tail's measures
 * (the nav row, the 26/33 heading at 124, the primary at 48), and the band
 * scrolls on a short phone (`Band`, D320).
 */
import { useEffect, useState, type ReactNode } from 'react';
import { Linking, ScrollView, useWindowDimensions, View } from 'react-native';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { Glyph, HoldButton, MonoText, MS, NavBar, paced, popStyle, PrimaryButton, riseStyle, Screen, Tap, useMotion } from '@/components/mono';
import { INSTITUTIONS, NOT_AFFILIATED, STREAK_BARS, STUDIES, URGE_STUDY, type Study, type StudyChart } from '@/content/science';
import { VALUE_ICONS, VALUE_WORDS } from '@/content/values';
import { haptic, holdHaptic } from '@/lib/haptics';
import { mono } from '@/lib/theme';

import { Band } from './tail';

const W = 345;
const HEAD_TOP = 124;

/** The source under a picture: a 12/18 mute line. */
function SourceLine({ children, center }: { children: string; center?: boolean }) {
  return (
    <MonoText v="p" center={center} color={mono.mute} style={{ fontSize: 12, lineHeight: 18 }}>
      {children}
    </MonoText>
  );
}

const open = (url: string) => void Linking.openURL(url).catch(() => {});

/** A number that runs from `from` to `target` instead of jumping there. */
function useRunTo(target: number, from: number, duration = 520): number {
  const motion = useMotion();
  const [shown, setShown] = useState(target);
  useEffect(() => {
    if (!motion) return;
    let raf = 0;
    let start = 0;
    const length = paced(duration);
    const step = (t: number) => {
      if (!start) start = t;
      const k = Math.min(1, (t - start) / length);
      setShown(Math.round(from + (target - from) * (1 - Math.pow(1 - k, 2))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [motion, target, from, duration]);
  return motion ? shown : target;
}

// ── charts ───────────────────────────────────────────────────────────

/** Bars for two groups, each a share of 100, drawing in from the left. */
function Bars({ bars, unit, delay = 150 }: { bars: readonly { label: string; value: number }[]; unit: string; delay?: number }) {
  const motion = useMotion();
  return (
    <View style={{ gap: 12 }}>
      {bars.map((b, i) => (
        <View key={b.label} style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <MonoText v="rowLabel" style={{ fontSize: 14 }}>
              {b.label}
            </MonoText>
            <MonoText v="rowLabel" color={i === 0 ? mono.ink : mono.mute} style={{ fontSize: 18 }}>
              {String(b.value)}
            </MonoText>
          </View>
          <View style={{ height: 12, borderRadius: 6, backgroundColor: mono.line, overflow: 'hidden' }}>
            <Animated.View
              style={[
                { height: 12, borderRadius: 6, width: `${b.value}%`, backgroundColor: i === 0 ? mono.ink : mono.art, transformOrigin: 'left' },
                motion
                  ? ({
                      animationName: { from: { transform: [{ scaleX: 0 }] }, to: { transform: [{ scaleX: 1 }] } },
                      animationDuration: paced(700),
                      animationDelay: paced(delay + i * 180),
                      animationTimingFunction: 'ease-out',
                      animationFillMode: 'backwards',
                    } as object)
                  : null,
              ]}
            />
          </View>
        </View>
      ))}
      <MonoText v="caps" style={{ fontSize: 11 }}>
        {unit}
      </MonoText>
    </View>
  );
}

/** What a study found, drawn: bars, one large figure, or two outcomes side by side. */
function Chart({ chart }: { chart: StudyChart }) {
  if (chart.kind === 'bars') return <Bars bars={chart.bars} unit={chart.unit} />;
  if (chart.kind === 'figure') {
    return (
      <View style={{ gap: 2 }}>
        <MonoText v="statValue" style={{ fontSize: 52, lineHeight: 56, letterSpacing: -1.6 }}>
          {chart.value}
        </MonoText>
        <MonoText v="p" wrap="wrap" style={{ fontSize: 14, lineHeight: 20 }}>
          {chart.label}
        </MonoText>
      </View>
    );
  }
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {chart.items.map((it, i) => (
        <View key={it.value} style={{ flex: 1, borderRadius: 14, backgroundColor: i === 0 ? mono.ink : mono.line, padding: 12, gap: 4 }}>
          <MonoText v="rowLabel" color={i === 0 ? mono.onInk : mono.ink} style={{ fontSize: 17 }}>
            {it.value}
          </MonoText>
          <MonoText v="p" wrap="wrap" color={i === 0 ? mono.onInk : mono.sub} style={{ fontSize: 12, lineHeight: 17 }}>
            {it.label}
          </MonoText>
        </View>
      ))}
    </View>
  );
}

/** A study as a card: journal and year, the finding, its chart, who and its limit, and the paper. */
export function StudyCard({ s, width }: { s: Study; width?: number }) {
  return (
    <View style={{ width, borderRadius: 20, backgroundColor: mono.card, padding: 18, gap: 14 }}>
      <View style={{ gap: 6 }}>
        <MonoText v="caps">{s.source}</MonoText>
        <MonoText v="h1Sheet" wrap="wrap" style={{ fontSize: 20, lineHeight: 25 }}>
          {s.title}
        </MonoText>
      </View>
      <Chart chart={s.chart} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <MonoText v="p" color={mono.mute} wrap="wrap" style={{ flex: 1, fontSize: 12, lineHeight: 17 }}>
          {`${s.sample}. ${s.limit}`}
        </MonoText>
        <Tap onPress={() => open(s.url)} label={`Read the paper: ${s.title}`} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Glyph name="doc" size={16} color={mono.ink} />
          <MonoText v="rowLabel" style={{ fontSize: 13 }}>
            Paper
          </MonoText>
        </Tap>
      </View>
    </View>
  );
}

// ── 33A · What one slip does ─────────────────────────────────────────

const SHAKE = {
  '0%': { transform: [{ translateX: 0 }] },
  '20%': { transform: [{ translateX: -9 }] },
  '40%': { transform: [{ translateX: 8 }] },
  '60%': { transform: [{ translateX: -5 }] },
  '80%': { transform: [{ translateX: 3 }] },
  '100%': { transform: [{ translateX: 0 }] },
};

const RING = 104;
const RING_R = 44;
const RING_C = 2 * Math.PI * RING_R;
const DAYS = 23;

/** A streak app's counter: the days in a ring that empties with the count. */
function StreakRing({ day, dead }: { day: number; dead: boolean }) {
  const motion = useMotion();
  return (
    <Animated.View
      key={dead ? 'dead' : 'live'}
      style={[{ width: RING, height: RING, alignItems: 'center', justifyContent: 'center' }, motion && dead ? ({ animationName: SHAKE, animationDuration: 420 } as object) : null]}>
      <Svg width={RING} height={RING} style={{ position: 'absolute' }}>
        <Circle cx={RING / 2} cy={RING / 2} r={RING_R} stroke={mono.line} strokeWidth={8} fill="none" />
        <Circle
          cx={RING / 2}
          cy={RING / 2}
          r={RING_R}
          stroke={mono.ink}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${RING_C} ${RING_C}`}
          strokeDashoffset={RING_C * (1 - day / DAYS)}
          transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
        />
      </Svg>
      <MonoText v="statValue" color={dead ? mono.art : mono.ink} style={{ fontSize: 34, lineHeight: 38, letterSpacing: -1 }}>
        {String(day)}
      </MonoText>
    </Animated.View>
  );
}

/** VICI's record: a grid of the 23 days, and the slip as one more day marked, not a reset. */
function DayGrid({ slipped }: { slipped: boolean }) {
  const motion = useMotion();
  return (
    <View style={{ width: 6 * 15, flexDirection: 'row', flexWrap: 'wrap', gap: 5, height: RING, alignContent: 'center' }}>
      {Array.from({ length: DAYS + 1 }, (_, i) => {
        const slip = i === DAYS;
        if (slip && !slipped) return <View key={i} style={{ width: 10, height: 10 }} />;
        return (
          <Animated.View
            key={i}
            style={[
              { width: 10, height: 10, borderRadius: 5, backgroundColor: slip ? 'transparent' : mono.ink, borderWidth: slip ? 2 : 0, borderColor: mono.mute },
              slip ? popStyle(motion, { duration: MS.standard }) : null,
            ]}
          />
        );
      })}
    </View>
  );
}

/** One side of the comparison: its name over its picture, a short note under it. */
function Side({ label, children, note }: { label: string; children: ReactNode; note: string }) {
  return (
    <View style={{ flex: 1, height: 200, borderRadius: 20, backgroundColor: mono.card, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 }}>
      <MonoText v="caps">{label}</MonoText>
      {children}
      <MonoText v="rowValue" center>
        {note}
      </MonoText>
    </View>
  );
}

export function O3SlipDemo({ next, back }: { next: () => void; back?: () => void }) {
  const motion = useMotion();
  const [slipped, setSlipped] = useState(false);
  const [h, setH] = useState(480);
  // the streak app's count runs down to zero; the shake and the thud come as it lands
  const day = useRunTo(slipped ? 0 : DAYS, slipped ? DAYS : 0);
  const landed = slipped && day === 0;
  useEffect(() => {
    if (landed) holdHaptic.thud();
  }, [landed]);
  const slip = () => {
    haptic.choice();
    setSlipped((v) => !v);
  };
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={HEAD_TOP} end={HEAD_TOP + h}>
        <View onLayout={(e) => setH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: HEAD_TOP, gap: 22 }}>
          <MonoText v="h1">What one slip does.</MonoText>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Side label="A streak app" note={`Day ${day}`}>
              <StreakRing day={day} dead={landed} />
            </Side>
            <Side label="VICI" note={slipped ? '23 days kept' : '23 days'}>
              <DayGrid slipped={slipped} />
            </Side>
          </View>
          <Tap
            onPress={slip}
            label={slipped ? 'Undo the slip' : 'Log a slip'}
            style={{ alignSelf: 'center', height: 44, paddingHorizontal: 22, borderRadius: 22, borderWidth: 1.5, borderColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
            <MonoText v="rowLabel">{slipped ? 'Undo' : 'Log a slip'}</MonoText>
          </Tap>
          {landed ? (
            <Animated.View style={[{ gap: 10 }, riseStyle(motion, { delay: 60 })]}>
              <Bars bars={STREAK_BARS} unit="in 100 kept going" />
              <SourceLine>Silverman & Barasch, 2023 · habit studies</SourceLine>
            </Animated.View>
          ) : null}
        </View>
      </Band>
      <PrimaryButton label="Continue" onPress={next} />
    </Screen>
  );
}

// ── 33B · Ride it out ────────────────────────────────────────────────

const WAVE_H = 170;
/** The urge's shape over the hold: rises, peaks at 55 %, falls away. */
const urgeAt = (p: number) => {
  'worklet';
  const k = p < 0.55 ? p / 0.55 : 1 - (p - 0.55) / 0.45;
  return Math.sin((Math.PI / 2) * Math.max(0, Math.min(1, k)));
};
const waveY = (p: number) => {
  'worklet';
  return WAVE_H - 14 - urgeAt(p) * (WAVE_H - 36);
};
const WAVE_PATH = (() => {
  const pts = Array.from({ length: 61 }, (_, i) => {
    const p = i / 60;
    return `${(p * W).toFixed(1)} ${waveY(p).toFixed(1)}`;
  });
  return `M${pts.join(' L')}`;
})();
const WAVE_FILL = `${WAVE_PATH} L${W} ${WAVE_H} L0 ${WAVE_H} Z`;

type Phase = 'ready' | 'rising' | 'peak' | 'falling' | 'passed' | 'early';
const PHASE_LINE: Record<Phase, string> = {
  ready: 'Hold the button.',
  rising: 'Rising.',
  peak: 'The peak. Keep holding.',
  falling: 'Falling.',
  passed: 'It passed. You didn’t act on it.',
  early: 'Let go early. Hold again.',
};

export function O3UrgeSurf({ next, back }: { next: () => void; back?: () => void }) {
  const motion = useMotion();
  const fill = useSharedValue(0);
  const [phase, setPhase] = useState<Phase>('ready');
  const [h, setH] = useState(480);
  const { width: winW } = useWindowDimensions();
  const w = Math.min(W, winW - 48);

  useAnimatedReaction(
    () => (fill.value <= 0 ? 0 : fill.value < 0.45 ? 1 : fill.value < 0.65 ? 2 : fill.value < 1 ? 3 : 4),
    (now, before) => {
      if (now === before || now === 0 || now === 4) return;
      runOnJS(setPhase)(now === 1 ? 'rising' : now === 2 ? 'peak' : 'falling');
    },
  );
  const travelled = useAnimatedStyle(() => ({ width: fill.value * w }));
  // the rider grows with the urge: 18 at rest, 30 at the peak
  const rider = useAnimatedStyle(() => {
    const r = 9 + 6 * urgeAt(fill.value);
    return { width: r * 2, height: r * 2, borderRadius: r, transform: [{ translateX: fill.value * w - r }, { translateY: waveY(fill.value) - r }] };
  });

  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={HEAD_TOP} end={HEAD_TOP + h}>
        <View onLayout={(e) => setH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: HEAD_TOP, gap: 22 }}>
          <View style={{ gap: 10 }}>
            <MonoText v="h1">Ride it out.</MonoText>
            <MonoText v="p">An urge rises and falls. You don’t have to act on it.</MonoText>
          </View>
          <View style={{ height: WAVE_H, width: w }}>
            <Svg width={w} height={WAVE_H} viewBox={`0 0 ${W} ${WAVE_H}`} preserveAspectRatio="none" style={{ position: 'absolute' }}>
              <Path d={WAVE_PATH} stroke={mono.line} strokeWidth={3} fill="none" strokeLinecap="round" />
            </Svg>
            {/* the part of the wave ridden so far, filled */}
            <Animated.View style={[{ position: 'absolute', left: 0, top: 0, height: WAVE_H, overflow: 'hidden' }, travelled]}>
              <Svg width={w} height={WAVE_H} viewBox={`0 0 ${W} ${WAVE_H}`} preserveAspectRatio="none">
                <Path d={WAVE_FILL} fill={mono.card} />
                <Path d={WAVE_PATH} stroke={mono.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
              </Svg>
            </Animated.View>
            <Animated.View style={[{ position: 'absolute', left: 0, top: 0, backgroundColor: mono.ink }, rider]} />
          </View>
          <Animated.View key={phase} style={riseStyle(motion, { distance: 6, duration: MS.quick })}>
            <MonoText v="rowLabel" style={{ fontSize: 16, lineHeight: 22 }}>
              {PHASE_LINE[phase]}
            </MonoText>
          </Animated.View>
          <HoldButton
            inline
            label="Hold to ride it out"
            holdingLabel="Stay with it"
            doneLabel="It passed"
            duration={9000}
            progress={fill}
            done={phase === 'passed'}
            onHold={(down) => setPhase((p) => (p === 'passed' ? p : down ? 'rising' : 'early'))}
            onComplete={() => setPhase('passed')}
          />
          {phase === 'passed' ? (
            <Animated.View style={riseStyle(motion, { delay: 80 })}>
              <SourceLine>{`Urge surfing · ${URGE_STUDY.authors}, ${URGE_STUDY.institutions[0]}, ${URGE_STUDY.year}`}</SourceLine>
            </Animated.View>
          ) : null}
        </View>
      </Band>
      <PrimaryButton label="Continue" onPress={next} />
    </Screen>
  );
}

// ── 34A · What matters to you ────────────────────────────────────────

const TILE_GAP = 8;

/** A value as a tile: its pictogram over its word; chosen, it fills with ink and the pictogram lands. */
function ValueTile({ word, on, index, width, onPress }: { word: string; on: boolean; index: number; width: number; onPress: () => void }) {
  const motion = useMotion();
  return (
    <Animated.View style={riseStyle(motion, { delay: 80 + index * 35, distance: 8 })}>
      <Tap
        onPress={onPress}
        accessibilityRole="checkbox"
        aria-checked={on}
        label={word}
        style={{ width, height: 84, borderRadius: 18, backgroundColor: on ? mono.ink : mono.card, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Animated.View key={on ? 'on' : 'off'} style={on ? popStyle(motion, { duration: MS.standard }) : null}>
          <Glyph name={VALUE_ICONS[word] ?? 'star'} size={26} color={on ? mono.onInk : mono.ink} />
        </Animated.View>
        <MonoText v="rowLabel" color={on ? mono.onInk : mono.ink} style={{ fontSize: 13 }}>
          {word}
        </MonoText>
      </Tap>
    </Animated.View>
  );
}

export function O3Values({ value, onChange, next, back }: { value: string[]; onChange: (v: string[]) => void; next: () => void; back?: () => void }) {
  const [h, setH] = useState(480);
  const { width: winW } = useWindowDimensions();
  const tile = Math.floor((Math.min(W, winW - 48) - 2 * TILE_GAP) / 3);
  const toggle = (word: string) => {
    if (value.includes(word)) {
      haptic.choice();
      onChange(value.filter((v) => v !== word));
    } else if (value.length < 3) {
      haptic.choice();
      onChange([...value, word]);
    } else haptic.tick();
  };
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={HEAD_TOP} end={HEAD_TOP + h}>
        <View onLayout={(e) => setH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: HEAD_TOP, gap: 20 }}>
          <View style={{ gap: 10 }}>
            <MonoText v="h1">What matters to you?</MonoText>
            <MonoText v="p">{`Pick three. ${value.length} of 3.`}</MonoText>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: TILE_GAP }}>
            {VALUE_WORDS.map((word, i) => (
              <ValueTile key={word} word={word} index={i} width={tile} on={value.includes(word)} onPress={() => toggle(word)} />
            ))}
          </View>
        </View>
      </Band>
      <PrimaryButton label="Continue" onPress={next} disabled={value.length === 0} />
    </Screen>
  );
}

// ── 34B · Built on research ──────────────────────────────────────────

const SEAL_W = 128;

/** A university as a seal: VICI's hall in a ring, the name under it. Not the university's own mark. */
export function Seal({ name, width = SEAL_W }: { name: string; width?: number }) {
  return (
    <View style={{ width, alignItems: 'center', gap: 8 }}>
      <View style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: mono.art, alignItems: 'center', justifyContent: 'center' }}>
        <Glyph name="hall" size={24} color={mono.ink} />
      </View>
      <MonoText v="rowValue" center wrap="wrap" color={mono.sub} style={{ fontSize: 12, lineHeight: 16 }}>
        {name}
      </MonoText>
    </View>
  );
}

/** The seals drifting slowly past, twice over so the row loops without a seam. Still without motion. */
function SealRow() {
  const motion = useMotion();
  const row = INSTITUTIONS.length * SEAL_W;
  return (
    <View style={{ height: 96, overflow: 'hidden' }}>
      <Animated.View
        style={[
          { flexDirection: 'row', width: row * 2 },
          motion
            ? ({
                animationName: { from: { transform: [{ translateX: 0 }] }, to: { transform: [{ translateX: -row }] } },
                animationDuration: INSTITUTIONS.length * 3200,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear',
              } as object)
            : null,
        ]}>
        {[...INSTITUTIONS, ...INSTITUTIONS].map((name, i) => (
          <Seal key={`${name}-${i}`} name={name} />
        ))}
      </Animated.View>
    </View>
  );
}

export function O3Research({ valuesFirst, next, back }: { valuesFirst?: boolean; next: () => void; back?: () => void }) {
  const [h, setH] = useState(560);
  const [page, setPage] = useState(0);
  const { width: winW } = useWindowDimensions();
  const cardW = Math.min(W, winW - 48);
  // a man who said his values are part of it sees the ACT porn trial first
  const studies = valuesFirst ? [...STUDIES.filter((s) => s.id === 'crosby2016'), ...STUDIES.filter((s) => s.id !== 'crosby2016')] : STUDIES;
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={HEAD_TOP} end={HEAD_TOP + h}>
        <View onLayout={(e) => setH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 0, right: 0, top: HEAD_TOP, gap: 16 }}>
          <MonoText v="h1" style={{ marginHorizontal: 24 }}>
            Built on research.
          </MonoText>
          <View style={{ gap: 4 }}>
            <SealRow />
            <SourceLine center>{NOT_AFFILIATED}</SourceLine>
          </View>
          <ScrollView
            horizontal
            snapToInterval={cardW + 12}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12, alignItems: 'flex-start' }}
            onMomentumScrollEnd={(e) => {
              const p = Math.round(e.nativeEvent.contentOffset.x / (cardW + 12));
              if (p !== page) haptic.tick();
              setPage(p);
            }}>
            {studies.map((s) => (
              <StudyCard key={s.id} s={s} width={cardW} />
            ))}
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }} accessibilityLabel={`Study ${page + 1} of ${studies.length}`}>
            {studies.map((s, i) => (
              <View key={s.id} style={{ width: i === page ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: i === page ? mono.ink : mono.art }} />
            ))}
          </View>
        </View>
      </Band>
      <PrimaryButton label="Continue" onPress={next} />
    </Screen>
  );
}
