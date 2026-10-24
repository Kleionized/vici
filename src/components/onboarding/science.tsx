/**
 * The science thread in onboarding (D64, `.overhaul/SCIENCE.md`): four boards
 * after `33 · One Bad Day`, each one something to do rather than read.
 *
 * - 33A · What one slip does: a streak counter and VICI side by side; tap Slip.
 * - 33B · Ride it out: hold, and an urge rises, peaks and passes under the finger.
 * - 34A · What matters to you: three values picked from the Life Map's twelve.
 * - 34B · Built on research: where the studies ran, and the studies as cards.
 *
 * No frame draws these; they are built from the kit at the tail's measures
 * (the nav row, the 26/33 heading at 124, the 15/24 paragraph, the primary
 * at 48), and the band scrolls on a short phone (`Band`, D320).
 */
import { Linking, ScrollView, useWindowDimensions, View } from 'react-native';
import { useEffect, useState } from 'react';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { Chips, HoldButton, MonoText, MS, NavBar, popStyle, PrimaryButton, riseStyle, Screen, Tap, useMotion } from '@/components/mono';
import { INSTITUTIONS, NO_CLAIMS, NOT_AFFILIATED, STREAK_BARS, STUDIES, URGE_STUDY, type Study } from '@/content/science';
import { VALUE_WORDS } from '@/content/values';
import { haptic, holdHaptic } from '@/lib/haptics';
import { mono, sans } from '@/lib/theme';

import { Band } from './tail';

const W = 345;
const HEAD_TOP = 124;

/** The heading and paragraph every board here opens with. */
function Head({ title, body }: { title: string; body?: string }) {
  return (
    <View style={{ gap: 12 }}>
      <MonoText v="h1">{title}</MonoText>
      {body ? <MonoText v="p">{body}</MonoText> : null}
    </View>
  );
}

/** The source under a finding: authors, where, when. 12/18 mute. */
function SourceLine({ children }: { children: string }) {
  return (
    <MonoText v="p" color={mono.mute} style={{ fontSize: 12, lineHeight: 18 }}>
      {children}
    </MonoText>
  );
}

const open = (url: string) => void Linking.openURL(url).catch(() => {});

/** A number that runs from `from` to `target` instead of jumping there (the counter falling to zero). */
function useRunTo(target: number, from: number, duration = 520): number {
  const motion = useMotion();
  const [shown, setShown] = useState(target);
  useEffect(() => {
    if (!motion) return;
    let raf = 0;
    let start = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const k = Math.min(1, (t - start) / duration);
      setShown(Math.round(from + (target - from) * (1 - Math.pow(1 - k, 2))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [motion, target, from, duration]);
  return motion ? shown : target;
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

/** One side of the demo: a 166 card with its caps label, the big figure and a caption. */
function DemoCard({ label, figure, caption, dim, shake }: { label: string; figure: string; caption: string; dim?: boolean; shake?: boolean }) {
  const motion = useMotion();
  // the figure lands (and shakes) once, when it settles; the count running down is not re-keyed
  return (
    <View style={{ flex: 1, height: 150, borderRadius: 16, backgroundColor: mono.card, padding: 16, justifyContent: 'space-between' }}>
      <MonoText v="caps">{label}</MonoText>
      <Animated.View
        key={shake ? 'down' : 'up'}
        style={
          motion && shake
            ? ({ animationName: SHAKE, animationDuration: 420 } as object)
            : motion
              ? popStyle(true, { duration: MS.standard })
              : null
        }>
        <MonoText v="statValue" color={dim ? mono.art : mono.ink} style={{ fontSize: 40, lineHeight: 44, letterSpacing: -1.2 }}>
          {figure}
        </MonoText>
      </Animated.View>
      <MonoText v="p" color={mono.mute} wrap="wrap" style={{ fontSize: 13, lineHeight: 18 }}>
        {caption}
      </MonoText>
    </View>
  );
}

/** Two bars, 53 and 29 in 100, drawing in once the slip is logged. */
function StreakBars() {
  const motion = useMotion();
  return (
    <View style={{ gap: 12 }}>
      <MonoText v="caps">Who kept going</MonoText>
      {STREAK_BARS.map((b, i) => (
        <View key={b.label} style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <MonoText v="rowLabel" style={{ fontSize: 14 }}>
              {b.label}
            </MonoText>
            <MonoText v="rowValue">{`${b.value} in 100`}</MonoText>
          </View>
          <View style={{ height: 10, borderRadius: 5, backgroundColor: mono.line, overflow: 'hidden' }}>
            <Animated.View
              style={[
                { height: 10, borderRadius: 5, width: `${b.value}%`, backgroundColor: i === 0 ? mono.ink : mono.art, transformOrigin: 'left' },
                motion
                  ? ({
                      animationName: { from: { transform: [{ scaleX: 0 }] }, to: { transform: [{ scaleX: 1 }] } },
                      animationDuration: 700,
                      animationDelay: 150 + i * 180,
                      animationFillMode: 'backwards',
                    } as object)
                  : null,
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

export function O3SlipDemo({ next, back }: { next: () => void; back?: () => void }) {
  const motion = useMotion();
  const [slipped, setSlipped] = useState(false);
  const [h, setH] = useState(560);
  // the streak app's count runs down to zero; the shake and the thud come as it lands
  const day = useRunTo(slipped ? 0 : 23, slipped ? 23 : 0);
  const landed = slipped && day === 0;
  useEffect(() => {
    if (landed) holdHaptic.thud();
  }, [landed]);
  const slip = () => {
    if (slipped) {
      setSlipped(false);
      haptic.choice();
      return;
    }
    setSlipped(true);
    haptic.choice();
  };
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={HEAD_TOP} end={HEAD_TOP + h}>
        <View onLayout={(e) => setH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: HEAD_TOP, gap: 20 }}>
          <Head title="What one slip does." body="Most quit apps count days and send you back to zero. Log a slip and see both." />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <DemoCard label="A streak app" figure={`Day ${day}`} caption={landed ? 'Back to the start.' : 'Days in a row.'} dim={landed} shake={landed} />
            <DemoCard label="VICI" figure="23" caption={slipped ? 'Clean days kept. 1\u00A0slip\u00A0logged.' : 'Clean days.'} />
          </View>
          <Tap
            onPress={slip}
            label={slipped ? 'Undo the slip' : 'Log a slip'}
            style={{ alignSelf: 'center', height: 44, paddingHorizontal: 22, borderRadius: 22, borderWidth: 1.5, borderColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
            <MonoText v="rowLabel">{slipped ? 'Undo' : 'Log a slip'}</MonoText>
          </Tap>
          {slipped ? (
            <Animated.View style={[{ gap: 12 }, riseStyle(motion, { delay: 120 })]}>
              <StreakBars />
              <SourceLine>Silverman & Barasch, Journal of Consumer Research, 2023. These were habit studies. None was about addiction.</SourceLine>
              <MonoText v="p" color={mono.ink} style={{ fontSize: 16, lineHeight: 25 }}>
                VICI keeps your record. A slip is one day in it.
              </MonoText>
            </Animated.View>
          ) : null}
        </View>
      </Band>
      <PrimaryButton label="Continue" onPress={next} />
    </Screen>
  );
}

// ── 33B · Ride it out ────────────────────────────────────────────────

const WAVE_H = 150;
/** The urge's shape over the hold: rises, peaks at 55 %, falls away. */
const urgeAt = (p: number) => {
  'worklet';
  const k = p < 0.55 ? p / 0.55 : 1 - (p - 0.55) / 0.45;
  return Math.sin((Math.PI / 2) * Math.max(0, Math.min(1, k)));
};
const waveY = (p: number) => {
  'worklet';
  return WAVE_H - 12 - urgeAt(p) * (WAVE_H - 32);
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
  ready: 'Hold the button below.',
  rising: 'It’s rising.',
  peak: 'This is the peak. Keep holding.',
  falling: 'It’s falling.',
  passed: 'It passed. You didn’t act on it.',
  early: 'You let go early. Hold again.',
};

export function O3UrgeSurf({ next, back }: { next: () => void; back?: () => void }) {
  const motion = useMotion();
  const fill = useSharedValue(0);
  const [phase, setPhase] = useState<Phase>('ready');
  const [h, setH] = useState(560);
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
        <View onLayout={(e) => setH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: HEAD_TOP, gap: 20 }}>
          <Head title="Ride it out." body="An urge rises, peaks and falls. Hold the button and stay with it. You don’t have to act on it." />
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
            <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: mono.ink }, rider]} />
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
            <Animated.View style={[{ gap: 6 }, riseStyle(motion, { delay: 120 })]}>
              <MonoText v="p">{URGE_STUDY.body}</MonoText>
              <SourceLine>{`${URGE_STUDY.authors}, ${URGE_STUDY.institutions[0]}, 2009. ${URGE_STUDY.limit}`}</SourceLine>
            </Animated.View>
          ) : null}
        </View>
      </Band>
      <PrimaryButton label="Continue" onPress={next} />
    </Screen>
  );
}

// ── 34A · What matters to you ────────────────────────────────────────

/** Three slots over the chips: the values he has picked, in order, landing as he picks them. */
function Slots({ picked }: { picked: string[] }) {
  const motion = useMotion();
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[0, 1, 2].map((i) => {
        const v = picked[i];
        return (
          <View key={i} style={{ flex: 1, height: 52, borderRadius: 26, borderWidth: 1.5, borderStyle: v ? 'solid' : 'dashed', borderColor: v ? mono.ink : mono.art, overflow: 'hidden' }}>
            {v ? (
              <Animated.View key={v} style={[{ flex: 1, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }, popStyle(motion, { duration: MS.standard })]}>
                <MonoText v="rowLabel" color={mono.onInk} style={{ fontSize: 14 }} numberOfLines={1} adjustsFontSizeToFit>
                  {v}
                </MonoText>
              </Animated.View>
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MonoText v="rowValue" color={mono.art}>
                  {String(i + 1)}
                </MonoText>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

export function O3Values({ value, onChange, next, back }: { value: string[]; onChange: (v: string[]) => void; next: () => void; back?: () => void }) {
  const [h, setH] = useState(560);
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={HEAD_TOP} end={HEAD_TOP + h}>
        <View onLayout={(e) => setH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: HEAD_TOP, gap: 20 }}>
          <Head title="What matters to you?" body="Pick three. ACT starts from what you value." />
          <Slots picked={value} />
          <Chips multi max={3} options={VALUE_WORDS} value={value} onChange={onChange} gap={10} />
          <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
            They go into your vow and your Life Map. You can change them later.
          </MonoText>
        </View>
      </Band>
      <PrimaryButton label="Continue" onPress={next} disabled={value.length === 0} />
    </Screen>
  );
}

// ── 34B · Built on research ──────────────────────────────────────────

/** A study as a card: journal and year, the finding, who and what, its limit, and the paper. */
function StudyCard({ s, width }: { s: Study; width: number }) {
  return (
    <View style={{ width, minHeight: 236, borderRadius: 20, backgroundColor: mono.card, padding: 18, gap: 8 }}>
      <MonoText v="caps">{s.source}</MonoText>
      <MonoText v="h1Sheet" wrap="wrap">
        {s.title}
      </MonoText>
      <MonoText v="p" wrap="wrap" style={{ fontSize: 14, lineHeight: 21 }}>
        {s.body}
      </MonoText>
      <MonoText v="p" color={mono.mute} wrap="wrap" style={{ fontSize: 12, lineHeight: 18 }}>
        {`${s.authors}, ${s.institutions.join(', ')}. ${s.limit}`}
      </MonoText>
      <View style={{ flex: 1 }} />
      <Tap onPress={() => open(s.url)} label={`Read the paper: ${s.title}`} style={{ alignSelf: 'flex-start', paddingVertical: 4 }}>
        <MonoText v="rowLabel" style={{ fontSize: 14, textDecorationLine: 'underline' }}>
          Read the paper
        </MonoText>
      </Tap>
    </View>
  );
}

/** The last card: what VICI won't say. */
function NoClaimsCard({ width }: { width: number }) {
  return (
    <View style={{ width, minHeight: 236, borderRadius: 20, borderWidth: 1.5, borderColor: mono.line, padding: 18, gap: 10 }}>
      <MonoText v="caps">VICI</MonoText>
      <MonoText v="h1Sheet">{NO_CLAIMS.title}</MonoText>
      {NO_CLAIMS.lines.map((l) => (
        <MonoText key={l} v="p" wrap="wrap" style={{ fontSize: 14, lineHeight: 21 }}>
          {l}
        </MonoText>
      ))}
    </View>
  );
}

/** The universities, as name chips landing one after another. */
export function Institutions() {
  const motion = useMotion();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {INSTITUTIONS.map((name, i) => (
        <Animated.View
          key={name}
          style={[{ height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: mono.card, justifyContent: 'center' }, popStyle(motion, { delay: 150 + i * 70 })]}>
          <MonoText v="rowLabel" style={{ fontSize: 12, ...sans('700') }}>
            {name}
          </MonoText>
        </Animated.View>
      ))}
    </View>
  );
}

export function O3Research({ valuesFirst, next, back }: { valuesFirst?: boolean; next: () => void; back?: () => void }) {
  const [h, setH] = useState(620);
  const [page, setPage] = useState(0);
  const { width: winW } = useWindowDimensions();
  const cardW = Math.min(W, winW - 48);
  // a man who said his values are part of it sees the ACT porn trial first
  const studies = valuesFirst ? [...STUDIES.filter((s) => s.id === 'crosby2016'), ...STUDIES.filter((s) => s.id !== 'crosby2016')] : STUDIES;
  const count = studies.length + 1;
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={HEAD_TOP} end={HEAD_TOP + h}>
        <View onLayout={(e) => setH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 0, right: 0, top: HEAD_TOP, gap: 16 }}>
          <View style={{ marginHorizontal: 24, gap: 12 }}>
            <Head title="Built on research." body="VICI’s method comes from studies run at these universities." />
            <Institutions />
            <MonoText v="p" color={mono.mute} wrap="wrap" style={{ fontSize: 12, lineHeight: 18 }}>
              {NOT_AFFILIATED}
            </MonoText>
          </View>
          <ScrollView
            horizontal
            pagingEnabled={false}
            snapToInterval={cardW + 12}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
            onMomentumScrollEnd={(e) => {
              const p = Math.round(e.nativeEvent.contentOffset.x / (cardW + 12));
              if (p !== page) haptic.tick();
              setPage(p);
            }}>
            {studies.map((s) => (
              <StudyCard key={s.id} s={s} width={cardW} />
            ))}
            <NoClaimsCard width={cardW} />
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }} accessibilityLabel={`Card ${page + 1} of ${count}`}>
            {Array.from({ length: count }, (_, i) => (
              <View key={i} style={{ width: i === page ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: i === page ? mono.ink : mono.art }} />
            ))}
          </View>
        </View>
      </Band>
      <PrimaryButton label="Continue" onPress={next} />
    </Screen>
  );
}
