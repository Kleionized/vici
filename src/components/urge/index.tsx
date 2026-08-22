/**
 * Urge-surfing kit — restyled to the VICI paper system (the canvas moved the
 * urge series out of its dark night world: "the whole app lives in one paper
 * system"). Parchment ground, sparse still ink dots instead of stars, a faint
 * ink aura behind the central art, EB Garamond serif headlines, and the one
 * solid-ink pill. The animated ocean (`UrgeWave`) keeps its parallax sinusoid
 * layers + breathing dot, redrawn in ink washes.
 *
 * The per-step `Tint`s survive as API but all resolve to the neutral ink
 * scale — reward and severity are never a hue.
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type MutableRefObject, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Platform, StyleSheet, TextInput, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import Reanimated, {
  Easing,
  Extrapolation,
  FadeIn as ReanimatedFadeIn,
  FadeInUp as ReanimatedFadeInUp,
  FadeOut as ReanimatedFadeOut,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, Image as SvgImage, LinearGradient as SvgGrad, Mask, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, bandToSeverity, Grain, INTENSITY_BANDS, PressScale } from '@/components/ui';
import { URGE_FEELINGS, URGE_TRIGGERS, type PickerCard } from '@/content/sosPickers';
import { SOS_RESPONSES, type SosLayer } from '@/content/sosResponses';
import { useCreateEvent, useEvents } from '@/lib/backend';
import { roman } from '@/lib/lessonArt';
import type { Tint } from '@/lib/oklch';
import { getJSON, setJSON } from '@/lib/storage';
import { colors, fonts, sans } from '@/lib/theme';
import { clearUrgeSession, newUrgeSession, saveUrgeSession } from '@/lib/urgeSession';

// ── per-step tints — all neutral ink now (severity = darker, never redder).
const inkTint =
  (r: number, g: number, b: number): Tint =>
  (a = 1) =>
    `rgba(${r},${g},${b},${a})`;
export const SEA: Tint = inkTint(85, 83, 78); // mid ink
export const SAGE: Tint = inkTint(107, 105, 96); // soft ink
export const PERI: Tint = inkTint(94, 91, 85);
export const CLAY: Tint = inkTint(51, 49, 45); // deepest — the strongest pull
export const HUE = { sea: 90, sage: 90, peri: 90, clay: 90 };
export const INK_DARK = colors.bg; // legacy name — the page ground (paper now)
export const TEAL = colors.ink; // the pill is the ink fill
export const TEAL_INK = colors.inkText;
const TEXT = colors.text;
const SUB = colors.textMuted;
const TAU = Math.PI * 2;

export const WAVE_ART = require('../../../assets/images/urge-wave.webp');

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (x: number) => x * x * (3 - 2 * x);

// ── wave path helpers (pure) ─────────────────────────────────────────────────
export function urgeWave(baseY: number, amp: number, phase: number, w = 402, steps = 28) {
  let d = `M0 ${(baseY + Math.sin(phase) * amp).toFixed(1)}`;
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = baseY + Math.sin(phase + (i / steps) * Math.PI * 2.2) * amp;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

// ── ci-breathe: gentle 6s scale 1 ↔ 1.035 ────────────────────────────────────
export function Breathe({ children, amount = 1.035 }: { children: ReactNode; amount?: number }) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(amount, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(scale);
  }, [scale, amount]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Reanimated.View style={animatedStyle}>{children}</Reanimated.View>;
}

// ── urge-fade: 0.6s opacity + slide-up, runs on mount (key it to re-run) ─────
export function FadeIn({ children, style }: { children: ReactNode; style?: object }) {
  return (
    <Reanimated.View entering={ReanimatedFadeInUp.duration(600).easing(Easing.out(Easing.ease))} style={style}>
      {children}
    </Reanimated.View>
  );
}

// ── the page ground — flat paper (kept as a component for call-sites) ────────
export function NightSky({ hue: _hue }: { hue: number }) {
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]} />;
}

// ── sparse still dots — a hint of paper grain, not a night sky ───────────────
const STAR_FIELD = (() => {
  let s = 7;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 26 }, () => ({
    x: 3 + r() * 94,
    y: 4 + r() * 56,
    sz: 1 + r() * 1.6,
    op: 0.1 + r() * 0.22,
  }));
})();

export function Stars() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {STAR_FIELD.map((st, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.sz,
            height: st.sz,
            borderRadius: 9999,
            backgroundColor: colors.textSofter,
            opacity: st.op,
          }}
        />
      ))}
    </View>
  );
}

// ── the floating art: faint ink aura + the breathing tide mark ───────────────
export function TideArt({ tint = SEA, width = 260 }: { tint?: Tint; width?: number }) {
  const h = Math.round(width * 0.6);
  return (
    <Svg width={width} height={h} viewBox="0 0 220 132" fill="none">
      <Circle cx={110} cy={46} r={22} fill={colors.text} opacity={0.85} />
      <Circle cx={110} cy={46} r={34} stroke={colors.text} strokeWidth={1} opacity={0.14} />
      <Path d="M2 86c20-13 38-13 54 0s38 13 54 0 38-13 54 0 38 13 54 0" stroke={tint(1)} strokeWidth={3.2} strokeLinecap="round" />
      <Path d="M2 104c20-12 38-12 54 0s38 12 54 0 38-12 54 0 38 12 54 0" stroke={tint(1)} strokeWidth={3} strokeLinecap="round" opacity={0.4} />
      <Path d="M2 121c20-11 38-11 54 0s38 11 54 0 38-11 54 0 38 11 54 0" stroke={tint(1)} strokeWidth={2.6} strokeLinecap="round" opacity={0.18} />
    </Svg>
  );
}

export function NightIllustration({ tint, art, children }: { tint: Tint; art?: number; children?: ReactNode }) {
  const uid = useId().replace(/:/g, '');
  return (
    <View style={{ width: 300, height: 300, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={300} height={300} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id={`ia-${uid}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={colors.text} stopOpacity={0.1} />
            <Stop offset="45%" stopColor={colors.text} stopOpacity={0.03} />
            <Stop offset="70%" stopColor={colors.text} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={300} height={300} fill={`url(#ia-${uid})`} />
      </Svg>
      <Breathe>
        {/* the old white-on-night PNG is invisible on paper — the tide mark replaces it */}
        {art ? <TideArt tint={tint} /> : children}
      </Breathe>
    </View>
  );
}

// ── top chrome: back/close + progress dots + optional trailing slot ──────────
export function TopChrome({
  back = 'close',
  onBack,
  total,
  index = 0,
  trailing,
  dotTint,
}: {
  back?: 'close' | 'back';
  onBack: () => void;
  total?: number;
  index?: number;
  trailing?: ReactNode;
  dotTint?: Tint;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, zIndex: 3 }}>
      <PressScale onPress={onBack} hitSlop={10} accessibilityLabel={back === 'close' ? 'Close' : 'Back'} style={{ width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
          {back === 'close' ? (
            <Path d="M6 6l12 12M18 6L6 18" stroke={TEXT} strokeWidth={2.2} strokeLinecap="round" />
          ) : (
            <Path d="M15 5l-7 7 7 7" stroke={TEXT} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          )}
        </Svg>
      </PressScale>
      {total ? (
        <View style={{ flexDirection: 'row', gap: 7 }}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index ? 22 : 7,
                height: 7,
                borderRadius: 9999,
                backgroundColor: i <= index ? (dotTint ? dotTint(0.98) : colors.ink) : 'rgba(0,0,0,0.12)',
              }}
            />
          ))}
        </View>
      ) : (
        <View />
      )}
      <View style={{ minWidth: 26, alignItems: 'flex-end' }}>{trailing}</View>
    </View>
  );
}

// ── the one action — a solid-ink pill (name kept for call-sites) ─────────────
export function BrightButton({ label, onPress, style }: { label: string; onPress: () => void; style?: object }) {
  return (
    <PressScale
      onPress={onPress}
      style={[
        {
          width: '100%',
          backgroundColor: colors.ink,
          borderRadius: 9999,
          minHeight: 58,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style as object,
      ]}>
      <AppText weightOverride="600" color={colors.inkText} style={{ fontSize: 16.5, letterSpacing: 0.17 }}>
        {label}
      </AppText>
    </PressScale>
  );
}

// ── the calm page template (one idea, on paper) ──────────────────────────────
export function JourneyPage({
  tint,
  hue: _hue,
  total,
  index,
  back = 'close',
  onBack,
  label,
  headline,
  sub,
  art,
  visual,
  onNext,
  nextLabel = 'Continue',
  footer,
}: {
  tint: Tint;
  hue: number;
  total?: number;
  index?: number;
  back?: 'close' | 'back';
  onBack: () => void;
  label?: string;
  headline: string;
  sub?: string;
  /** Legacy image slot — now renders the tide mark in the aura. */
  art?: number;
  /** Or a custom line-art visual floated the same way. */
  visual?: ReactNode;
  onNext: () => void;
  nextLabel?: string;
  footer?: ReactNode;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stars />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TopChrome back={back} onBack={onBack} total={total} index={index} dotTint={tint} />
        {/* the single illustration — gets the room to breathe */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <NightIllustration tint={tint} art={art}>
            {visual}
          </NightIllustration>
        </View>
        {/* one headline, one short line, one action */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 18 }}>
          {label ? (
            <AppText center weightOverride="600" color={colors.textSoft} style={{ fontSize: 11, letterSpacing: 2.2, textTransform: 'uppercase', marginBottom: 14 }}>
              {label}
            </AppText>
          ) : null}
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 32, lineHeight: 36, letterSpacing: 0.32, color: TEXT }}>
            {headline}
          </AppText>
          {sub ? (
            <AppText center weightOverride="400" style={{ fontSize: 15, lineHeight: 22.5, color: SUB, marginTop: 14 }}>
              {sub}
            </AppText>
          ) : null}
          <BrightButton label={nextLabel} onPress={onNext} style={{ marginTop: 30 }} />
          {footer ? <View style={{ marginTop: 14, alignItems: 'center' }}>{footer}</View> : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

// relapse · a small line + marker (down / trough / up) — floats in the aura
export function RelapseLineArt({ tint, mode }: { tint: Tint; mode: 'down' | 'trough' | 'up' }) {
  const conf = {
    down: { d: 'M10 26 C 84 32, 150 102, 268 110', cx: 268, cy: 110 },
    trough: { d: 'M6 40 C 64 52, 108 104, 150 104 C 206 104, 250 44, 294 30', cx: 150, cy: 104 },
    up: { d: 'M14 112 C 132 106, 198 36, 290 26', cx: 290, cy: 26 },
  }[mode];
  return (
    <Svg width={260} height={122} viewBox="0 0 300 140">
      <Path d={conf.d} fill="none" stroke={tint(0.9)} strokeWidth={2.8} strokeLinecap="round" />
      <Circle cx={conf.cx} cy={conf.cy} r={13} fill="none" stroke={tint(0.45)} strokeWidth={2} />
      <Circle cx={conf.cx} cy={conf.cy} r={6.5} fill={tint(1)} />
    </Svg>
  );
}

// ════════ THE BREATHING WAVE (ported from the canvas) ════════════════════════
// A calm sea drawn in ink washes on the paper: parallax wave layers built from
// stacked sinusoids that drift sideways, a crisp near-black crest line, and a
// breathing paper-white dot riding the wave's edge at centre. Session progress
// raises then settles the waterline while a separate envelope steadily softens
// both the wave amplitude and its breathing travel.
const STEPS = 42;
const BREATH_SECONDS = 10;
const INHALE = 0.4;

export type BreathPhase = 'inhale' | 'exhale';

function breathStateAt(t: number): { amount: number; phase: BreathPhase } {
  const cycleProgress = (t % BREATH_SECONDS) / BREATH_SECONDS;
  return cycleProgress < INHALE
    ? { amount: smoothstep(cycleProgress / INHALE), phase: 'inhale' }
    : { amount: 1 - smoothstep((cycleProgress - INHALE) / (1 - INHALE)), phase: 'exhale' };
}

export function BreathCue({ phase, color = 'rgba(245,244,241,0.72)', style }: { phase: BreathPhase; color?: string; style?: StyleProp<ViewStyle> }) {
  const label = phase === 'inhale' ? 'Breathe in' : 'Breathe out';
  return (
    <View accessibilityRole="text" accessibilityLabel={label} style={[{ height: 22, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Reanimated.View
        key={phase}
        entering={ReanimatedFadeIn.duration(180)}
        exiting={ReanimatedFadeOut.duration(140)}
        pointerEvents="none"
        style={{ position: 'absolute' }}>
        <AppText style={[sans('600'), { fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', color }]}>{label}</AppText>
      </Reanimated.View>
    </View>
  );
}

function buildSurface(yBase: number, amp: number, freq: number, speed: number, ph: number, t: number, CW: number) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) {
    const u = i / STEPS;
    const y = yBase + Math.sin(u * TAU * freq - t * speed + ph) * amp + Math.sin(u * TAU * freq * 0.5 - t * speed * 0.6 + ph * 1.3) * amp * 0.3;
    pts.push([u * CW, y]);
  }
  return pts;
}

const pointsToFill = (pts: [number, number][], CW: number, CH: number) =>
  `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}` +
  pts.slice(1).map(([x, y]) => ` L${x.toFixed(1)} ${y.toFixed(1)}`).join('') +
  ` L${CW} ${CH} L0 ${CH} Z`;

const pointsToStroke = (pts: [number, number][], dy = 0) =>
  `M${pts[0][0].toFixed(1)} ${(pts[0][1] + dy).toFixed(1)}` +
  pts.slice(1).map(([x, y]) => ` L${x.toFixed(1)} ${(y + dy).toFixed(1)}`).join('');

export function UrgeWave({
  progressRef,
  onBreathPhaseChange,
}: {
  progressRef: MutableRefObject<number>;
  onBreathPhaseChange?: (phase: BreathPhase) => void;
}) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const breathPhaseRef = useRef<BreathPhase>('inhale');
  const onBreathPhaseChangeRef = useRef(onBreathPhaseChange);
  const breath = useSharedValue(0);
  const drift = useSharedValue(0);
  const sessionProgress = useSharedValue(0);
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    onBreathPhaseChangeRef.current = onBreathPhaseChange;
  }, [onBreathPhaseChange]);

  useEffect(() => {
    const startedAt = Date.now();
    onBreathPhaseChangeRef.current?.('inhale');

    // Keep the water and breath motion on the UI thread. The lightweight JS
    // interval only mirrors session progress and changes the accessible cue.
    breath.value = withRepeat(
      withSequence(
        withTiming(1, { duration: BREATH_SECONDS * INHALE * 1000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: BREATH_SECONDS * (1 - INHALE) * 1000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    drift.value = withRepeat(withTiming(1, { duration: 18000, easing: Easing.linear }), -1, false);

    const sync = () => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const nextBreathPhase = breathStateAt(elapsed).phase;
      if (nextBreathPhase !== breathPhaseRef.current) {
        breathPhaseRef.current = nextBreathPhase;
        onBreathPhaseChangeRef.current?.(nextBreathPhase);
      }
      sessionProgress.value = withTiming(clamp01(progressRef.current), { duration: 180, easing: Easing.out(Easing.quad) });
    };

    sync();
    const syncTimer = setInterval(sync, 200);
    return () => {
      clearInterval(syncTimer);
      cancelAnimation(breath);
      cancelAnimation(drift);
      cancelAnimation(sessionProgress);
    };
  }, [breath, drift, progressRef, sessionProgress]);

  const oceanStyle = useAnimatedStyle(() => {
    const amplitude = interpolate(sessionProgress.value, [0, 1], [1.42, 0.68], Extrapolation.CLAMP);
    const breathLift = interpolate(breath.value, [0, 1], [10, -17], Extrapolation.CLAMP);
    const driftX = interpolate(drift.value, [0, 0.5, 1], [-7, 7, -7], Extrapolation.CLAMP);
    return {
      transform: [{ translateX: driftX }, { translateY: breathLift }, { scaleX: 1.06 }, { scaleY: amplitude }],
    };
  });

  const { w: CW, h: CH } = size;

  let content: ReactNode = null;
  if (CW > 0 && CH > 0) {
    const frontY = CH * 0.5;
    const baseAmp = 14;

    const back = buildSurface(frontY + CH * 0.045, baseAmp * 0.6, 0.9, 0.085, 0.6, 0, CW);
    const mid = buildSurface(frontY + CH * 0.02, baseAmp * 0.8, 1.2, 0.13, 2.4, 0, CW);
    const FF = 1.0,
      FP = 4.2;
    const front = buildSurface(frontY, baseAmp, FF, 0.18, FP, 0, CW);

    const dotX = CW / 2;
    const dotY = frontY + Math.sin(0.5 * TAU * FF + FP) * baseAmp + Math.sin(0.5 * TAU * FF * 0.5 + FP * 1.3) * baseAmp * 0.3;
    const dotR = 7;
    const glowR = 25;

    content = (
      <Reanimated.View pointerEvents="none" style={[StyleSheet.absoluteFill, oceanStyle]}>
        <Svg width={CW} height={CH}>
          <Defs>
            <SvgGrad id={`back-${uid}`} x1="0" y1={frontY + CH * 0.045 - 30} x2="0" y2={CH} gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="rgba(29,28,26,0.14)" />
              <Stop offset="100%" stopColor="rgba(29,28,26,0.3)" />
            </SvgGrad>
            <SvgGrad id={`mid-${uid}`} x1="0" y1={frontY + CH * 0.02 - 30} x2="0" y2={CH} gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="rgba(29,28,26,0.24)" />
              <Stop offset="100%" stopColor="rgba(29,28,26,0.44)" />
            </SvgGrad>
            <SvgGrad id={`front-${uid}`} x1="0" y1={frontY - 20} x2="0" y2={CH} gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="rgba(58,56,52,0.9)" />
              <Stop offset="40%" stopColor="rgba(34,33,30,0.94)" />
              <Stop offset="100%" stopColor="rgba(19,19,19,0.97)" />
            </SvgGrad>
            <RadialGradient id={`dot-${uid}`} cx={dotX} cy={dotY} r={glowR} gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="rgb(245,244,241)" stopOpacity={0.58} />
              <Stop offset="100%" stopColor="rgb(245,244,241)" stopOpacity={0} />
            </RadialGradient>
          </Defs>

          <Path d={pointsToFill(back, CW, CH)} fill={`url(#back-${uid})`} />
          <Path d={pointsToFill(mid, CW, CH)} fill={`url(#mid-${uid})`} />
          <Path d={pointsToFill(front, CW, CH)} fill={`url(#front-${uid})`} />
          <Path d={pointsToStroke(front)} fill="none" stroke="rgba(245,244,241,0.9)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <Path d={pointsToStroke(front, -1.4)} fill="none" stroke="rgba(245,244,241,0.3)" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
          <Circle cx={dotX} cy={dotY} r={glowR} fill={`url(#dot-${uid})`} />
          <Circle cx={dotX} cy={dotY} r={dotR} fill="rgba(255,255,255,0.98)" />
          <Circle cx={dotX} cy={dotY} r={dotR} fill="none" stroke="rgba(19,19,19,0.55)" strokeWidth={1.4} />
        </Svg>
      </Reanimated.View>
    );
  }

  return (
    <View
      style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
      }}>
      {content}
    </View>
  );
}

// ════════ THE FIRST 90 SECONDS ══════════════════════════════════════════════
// Canvas 145 · 146 · 147 · 148 · 149 · 150 · 151 (the paper interrupt) and
// 138 · 139 · 140 · 141 (the dark SOS it hands off to). One flow behind two
// routes — `/urge` and `/rough-first90` — because the canvas draws one.
//
// Every offset below is the 393 × 852 canvas's. Paper pages measure inside the
// sheet, whose own frame top is 52; dark pages measure from the safe-area top,
// i.e. the frame's y less the 54pt status bar.

const NOISE_DARK = require('../../../assets/images/noise-dark.png');

const SHEET_PAPER = '#F4F3F0';
const SHEET_INK = '#131313';
const SHEET_TEXT = '#1D1C1A';
const SHEET_MUTED = '#55534E';
const SHEET_SOFT = '#8B8882';
const SOS_PAPER = '#F4F3F0';

export type UrgePlace = 'private' | 'bed' | 'public' | 'work' | 'out';

/**
 * `Cue Hue Picker` · the five places, in the canvas's own order. The frame
 * replaced three illustrated gradient cards with five flat rows, so the art,
 * the gradients and the noise tile that went with them are gone.
 */
const PLACES: { key: UrgePlace; label: string }[] = [
  { key: 'private', label: 'Somewhere private' },
  { key: 'bed', label: 'In bed' },
  { key: 'public', label: 'A public space' },
  { key: 'work', label: 'At work or school' },
  { key: 'out', label: 'Out and about' },
];

/**
 * The two step boards downstream still draw the phone and bed copy verbatim,
 * and the canvas does not say which of the five new places gets which. The
 * laptop lines are dropped because no option names a laptop any more; `In bed`
 * keeps its own copy and the other four take the phone's (DECISIONS D-021).
 */
/**
 * `99 · Surf Step 1`, `100 · Surf Step 3`, `101 · Cue Set Confirmation` — the
 * three moves, in the order the pager lights them.
 *
 * `UI Final 1` resequenced them and made them place-independent. The previous
 * bundle keyed each board's copy off `UrgePlace` and opened on the phone; this
 * one opens on standing up, and no board's words change with where you are.
 * Two of the three draw no body at all, and each closes on its own label rather
 * than a shared "Done — next". The file names now describe the old order and
 * are not to be trusted: `Surf-Step-3` is the middle board.
 */
const MOVES: { title: string; body?: string; cta: string }[] = [
  { title: 'Stand up.', cta: 'I’m up' },
  { title: 'Leave the room.', cta: 'I’ve left' },
  { title: 'Put the phone away.', body: 'Put it somewhere you cannot reach from where you’re sitting.', cta: 'Phone is away' },
];

// ── paper chrome ────────────────────────────────────────────────────────────

/**
 * The sheet every interrupt page sits on. It starts two points above where the
 * status bar ends, which is the canvas's frame y 52, and every `top` inside it
 * is that container's own — the −54 rule does not apply below it.
 *
 * `UI Final 1` squared the top and flattened the ground: all thirteen sheet
 * frames in the group draw `left:0 right:0 top:52 bottom:0 background:#F4F3F0
 * overflow:hidden` with no `border-radius`, over a frame whose own ground is
 * `#F4F3F0` rather than the `#EDECE7` edge the rounded version needed.
 */
function PaperSheet({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: SHEET_PAPER }}>
      <StatusBar style="dark" />
      <View
        style={{
          flex: 1,
          marginTop: Math.max(0, insets.top - 2),
          backgroundColor: SHEET_PAPER,
          overflow: 'hidden',
        }}>
        {children}
      </View>
    </View>
  );
}

function SheetClose({ onPress }: { onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Close"
      hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
      style={{ position: 'absolute', right: 22, top: 18, minHeight: 0, zIndex: 6 }}>
      <Svg width={20} height={20} viewBox="0 0 20 20">
        <Path d="M3 3l14 14M17 3L3 17" stroke="#55534E" strokeWidth={2} strokeLinecap="round" />
      </Svg>
    </PressScale>
  );
}

/** Three moves, three pills — the current one stretches to 18. */
function StepPager({ index }: { index: number }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7 }}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ width: i === index ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: i === index ? SHEET_INK : 'rgba(19,19,19,0.18)' }} />
      ))}
    </View>
  );
}

function SheetPrimary({ label, onPress, bottom = 88 }: { label: string; onPress: () => void; bottom?: number }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        bottom,
        height: 54,
        borderRadius: 27,
        backgroundColor: SHEET_INK,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

function SheetSkip({ onPress }: { onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={{ top: 14, bottom: 14, left: 60, right: 60 }}
      style={{ position: 'absolute', left: 0, right: 0, bottom: 44, minHeight: 0 }}>
      {/* the canvas centres the words in a full-width box, not the box in the row */}
      <AppText center style={[sans('500'), { fontSize: 15, color: SHEET_SOFT }]}>Skip this step</AppText>
    </PressScale>
  );
}

/** A CSS-blurred wash redrawn as a radial gradient — RN SVG has no blur
 * filter, so the softness has to live in the falloff. */
function SoftBlob({
  id,
  left,
  top,
  width,
  height,
  color,
  alpha,
  stop = 0.74,
}: {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  alpha: number;
  stop?: number;
}) {
  return (
    <Svg width={width} height={height} pointerEvents="none" style={{ position: 'absolute', left, top }}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset={0} stopColor={color} stopOpacity={alpha} />
          <Stop offset={stop} stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

/** A `border-radius: 50% … / N% …` cap: the top edge is one elliptical arc
 * rising `ry` above the corners, which SVG can draw and RN's radii cannot. */
function Hill({ left, top, width, height, ry, fill }: { left: number; top: number; width: number; height: number; ry: number; fill: string }) {
  const w = Math.round(width);
  const h = Math.round(height);
  const r = Math.round(ry);
  return (
    <Svg width={w} height={h} pointerEvents="none" style={{ position: 'absolute', left, top }}>
      <Path d={`M0 ${r} A ${w / 2} ${r} 0 0 1 ${w} ${r} L ${w} ${h} L 0 ${h} Z`} fill={fill} />
    </Svg>
  );
}

// ── 145 · Cue Intro Modal ───────────────────────────────────────────────────

/** The scene: a bench under a low moon with a paused disc beside it. */
function IntroArt() {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 76, top: 170 }}>
      <View style={{ width: 240, height: 250 }}>
        <SoftBlob id="u90-intro-warm" left={58} top={64} width={124} height={124} color="rgb(226,186,120)" alpha={0.45} />
        <View style={{ position: 'absolute', left: 152, top: 22, width: 42, height: 42, borderRadius: 21, backgroundColor: '#DCDED8' }} />
        <View style={{ position: 'absolute', left: 142, top: 14, width: 42, height: 42, borderRadius: 21, backgroundColor: '#F4F3F0' }} />
        <View
          style={{
            position: 'absolute',
            left: 70,
            top: 152,
            width: 100,
            height: 32,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            backgroundColor: '#E0DFDA',
          }}
        />
        <View style={{ position: 'absolute', left: 76, top: 144, width: 50, height: 16, borderRadius: 8, backgroundColor: '#C6C5C0' }} />
        <View style={{ position: 'absolute', left: 64, top: 152, width: 6, height: 54, borderRadius: 3, backgroundColor: '#D6D5D0' }} />
        <View style={{ position: 'absolute', left: 170, top: 152, width: 6, height: 54, borderRadius: 3, backgroundColor: '#D6D5D0' }} />
        <SoftBlob id="u90-intro-shadow" left={58} top={202} width={130} height={14} color="rgb(0,0,0)" alpha={0.09} stop={1} />
        <View style={{ position: 'absolute', left: 78, top: 160, width: 84, height: 8, borderRadius: 4, backgroundColor: '#D6D5D0' }} />
        <View
          style={{
            position: 'absolute',
            left: 186,
            top: 120,
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: '#F7F6F2',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 6px 14px rgba(40,38,32,0.14)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={9} stroke="#3A3934" strokeWidth={1.8} />
            <Path d="M12 12V6.5A5.5 5.5 0 0 1 17.5 12z" fill="#3A3934" />
          </Svg>
        </View>
      </View>
    </View>
  );
}

function SkyDot({ left, top, alpha }: { left: number; top: number; alpha: number }) {
  return <View pointerEvents="none" style={{ position: 'absolute', left, top, width: 2, height: 2, borderRadius: 1, backgroundColor: `rgba(200,225,235,${alpha})` }} />;
}

function IntroPage({ onClose, onNext }: { onClose: () => void; onNext: () => void }) {
  return (
    <PaperSheet>
      <SheetClose onPress={onClose} />
      <SoftBlob id="u90-intro-halo" left={96} top={150} width={200} height={280} color="rgb(220,222,216)" alpha={0.28} stop={0.75} />
      <IntroArt />
      <SkyDot left={88} top={112} alpha={0.4} />
      <SkyDot left={296} top={88} alpha={0.3} />
      <SkyDot left={250} top={180} alpha={0.25} />
      <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 500, fontSize: 22, letterSpacing: 0.1, color: SHEET_TEXT }]}>
        The First 90 Seconds
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 30, right: 30, top: 552, fontSize: 15.5, lineHeight: 23, color: SHEET_MUTED }]}>
        A universal interrupt for the moment the wave hits. Six small moves — decide nothing until it passes.
      </AppText>
      {/* canvas top 692 in an 800pt sheet — anchored from the bottom so a
          shorter phone loses air above the pill, not the pill */}
      <PressScale
        onPress={onNext}
        accessibilityRole="button"
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 56,
          height: 52,
          borderRadius: 26,
          backgroundColor: SHEET_INK,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText style={[sans('600'), { fontSize: 17.5, letterSpacing: 0.3, color: '#FFFFFF' }]}>Start the interrupt</AppText>
      </PressScale>
    </PaperSheet>
  );
}

// ── 146 · SOS Strength ──────────────────────────────────────────────────────

function StrengthPage({ band, onBand, onClose, onNext }: { band: number; onBand: (index: number) => void; onClose: () => void; onNext: () => void }) {
  return (
    <PaperSheet>
      <SheetClose onPress={onClose} />
      <AppText center style={[sans('500'), { position: 'absolute', left: 44, right: 44, top: 150, fontSize: 23, lineHeight: 31, letterSpacing: 0.1, color: SHEET_TEXT }]}>
        How strong is it right now?
      </AppText>
      {/* `UI Final 1` deleted the line that sat here, and the two end labels
          under the row with it */}
      <View style={{ position: 'absolute', left: 36, right: 36, top: 330, flexDirection: 'row', justifyContent: 'space-between' }}>
        {INTENSITY_BANDS.map((item, index) => {
          const on = band === index;
          return (
            <PressScale
              key={item.label}
              onPress={() => onBand(index)}
              accessibilityRole="radio"
              accessibilityLabel={item.label}
              accessibilityState={{ checked: on }}
              hitSlop={{ top: 16, bottom: 16, left: 8, right: 8 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: on ? SHEET_INK : '#FFFFFF',
                boxShadow: on ? '0 0 0 2px #F4F3F0, 0 0 0 4px #131313' : 'inset 0 0 0 1.5px rgba(0,0,0,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {on ? <View style={{ width: 11, height: 11, borderRadius: 5.5, backgroundColor: SHEET_PAPER }} /> : null}
            </PressScale>
          );
        })}
      </View>
      <AppText center style={[sans('600'), { position: 'absolute', left: 0, right: 0, top: 452, fontSize: 19, color: SHEET_TEXT }]}>
        {INTENSITY_BANDS[band].label}
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: 482, fontSize: 13.5, color: SHEET_SOFT }]}>
        {INTENSITY_BANDS[band].note}
      </AppText>
      <SheetPrimary label="Continue" onPress={onNext} />
      <SheetSkip onPress={onNext} />
    </PaperSheet>
  );
}

// ── 98 · Cue Hue Picker — where are you right now ───────────────────────────

/**
 * The location picker's row. It was the recipe all three SOS pickers shared;
 * `UI Final 1` replaced the other two boards with a nine-card grid, so this is
 * now the one board that draws rows, and the `note` line and check disc the
 * other two needed have gone with them.
 *
 * `MoodLogger.ReasonRow` is the same recipe and carries the same ring, disc,
 * gap, padding and radius, but it hard-codes a checkbox, so it is mirrored here
 * rather than imported.
 */
function PickerRow({ top, height, label, glyph, selected, onPress }: { top: number; height: number; label: string; glyph: ReactNode; selected: boolean; onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top,
        height,
        minHeight: height,
        borderRadius: 18,
        borderCurve: 'continuous',
        backgroundColor: '#FFFFFF',
        boxShadow: selected ? '0 0 0 1.6px #131313' : '0 0 0 1px rgba(0,0,0,0.10)',
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      }}>
      <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: selected ? '#131313' : '#F1EFE9', alignItems: 'center', justifyContent: 'center' }}>
        {glyph}
      </View>
      <AppText numberOfLines={1} style={[sans(selected ? '600' : '500'), { flex: 1, minWidth: 0, fontSize: 15, color: SHEET_TEXT }]}>
        {label}
      </AppText>
      {selected ? <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#131313' }} /> : null}
    </PressScale>
  );
}

/** Every picker glyph: 21 in a 24-unit box, stroke 2, round caps and joins. */
function PickerGlyph({ on, children }: { on: boolean; children: (stroke: string) => ReactNode }) {
  const stroke = on ? '#F4F3F0' : '#1D1C1A';
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {children(stroke)}
    </Svg>
  );
}

/** The pill all three boards close on — canvas top 688 in an 800pt sheet. */
function PickerContinue({ onPress }: { onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 60,
        height: 52,
        minHeight: 52,
        borderRadius: 26,
        backgroundColor: SHEET_INK,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText style={[sans('600'), { fontSize: 17.5, letterSpacing: 0.3, color: '#FFFFFF' }]}>Continue</AppText>
    </PressScale>
  );
}

/** The back chevron and word all three boards open with. */
function PickerBack({ onPress }: { onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
      style={{ position: 'absolute', left: 16, top: 14, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9, zIndex: 6 }}>
      <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
        <Path d="M9.5 1.5L2 9.5l7.5 8" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <AppText style={[sans('400'), { fontSize: 17, color: SHEET_MUTED }]}>Back</AppText>
    </PressScale>
  );
}

/**
 * The three picker boards' header: a headline at 62 and, on none of them any
 * more, a line under it at 106. `UI Final 1` deleted the sub from all three, so
 * the prop survives only because the shape of the header is worth keeping in
 * one place.
 */
function PickerHead({ title, sub, inset = 36 }: { title: string; sub?: string; inset?: number }) {
  return (
    <>
      <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 62, fontSize: 22, letterSpacing: 0.1, color: SHEET_TEXT }]}>
        {title}
      </AppText>
      {sub ? (
        <AppText center style={[sans('400'), { position: 'absolute', left: inset, right: inset, top: 106, fontSize: 15.5, lineHeight: 23, color: SHEET_MUTED }]}>
          {sub}
        </AppText>
      ) : null}
    </>
  );
}

/**
 * `102` and `103` · one card of the nine-card grid both boards now draw.
 *
 * The canvas draws no selected card on either frame — every one of the eighteen
 * carries the resting ring and the `#F1EFE9` plate — so the selected treatment
 * is the one `PickerRow` already used on the boards these replaced: a 1.6pt ink
 * ring, an ink plate, a paper glyph and the label a weight heavier.
 */
function PickerCardTile({ card, selected, onPress }: { card: PickerCard; selected: boolean; onPress: () => void }) {
  const stroke = selected ? '#F4F3F0' : '#1D1C1A';
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={card.label}
      style={{
        flex: 1,
        height: 96,
        minHeight: 96,
        borderRadius: 18,
        borderCurve: 'continuous',
        backgroundColor: '#FFFFFF',
        boxShadow: selected ? '0 0 0 1.6px #131313' : '0 0 0 1px rgba(0,0,0,0.10)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
      }}>
      <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: selected ? SHEET_INK : '#F1EFE9', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={card.glyph.fill ? undefined : stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {card.glyph.parts.map((part: PickerCard['glyph']['parts'][number], i: number) =>
            part.tag === 'rect' ? (
              <Rect key={i} x={Number(part.x)} y={Number(part.y)} width={Number(part.width)} height={Number(part.height)} rx={part.rx ? Number(part.rx) : undefined} />
            ) : part.tag === 'circle' ? (
              <Circle key={i} cx={Number(part.cx)} cy={Number(part.cy)} r={Number(part.r)} fill={card.glyph.fill ? stroke : undefined} />
            ) : (
              <Path key={i} d={part.d} />
            ),
          )}
        </Svg>
      </View>
      <AppText style={[sans(selected ? '600' : '500'), { fontSize: 13.5, color: SHEET_TEXT }]}>{card.label}</AppText>
    </PressScale>
  );
}

/**
 * The grid itself: `left:24 right:24 top:128`, five rows on a 10 gap, two cards
 * to a row. The ninth sits alone in the last row and takes the full width,
 * which is what `flex: 1` on a single child does — the canvas draws it that way.
 */
function PickerGrid({ cards, selected, onSelect }: { cards: PickerCard[]; selected?: string; onSelect: (label: string) => void }) {
  const rows: PickerCard[][] = [];
  for (let i = 0; i < cards.length; i += 2) rows.push(cards.slice(i, i + 2));
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top: 128, flexDirection: 'column', gap: 10 }}>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
          {row.map((card) => (
            <PickerCardTile key={card.label} card={card} selected={selected === card.label} onPress={() => onSelect(card.label)} />
          ))}
        </View>
      ))}
    </View>
  );
}

/* ── 29 · 29A · 29A2 — the three pickers ──────────────────────────────────── */

/** The five places, in the canvas's order. Rows pitch 72 from sheet 170. */
const PLACE_GLYPH: Record<UrgePlace, (stroke: string) => ReactNode> = {
  private: () => (
    <>
      <Rect x={6} y={3.5} width={12} height={17} rx={1.6} />
      <Circle cx={14.6} cy={12.5} r={1.1} />
    </>
  ),
  bed: () => (
    <>
      <Path d="M3.5 18.5v-8M3.5 14.5h17v4M3.5 14.5V9h6.6c2.4 0 3.7 1.3 3.7 3.3v2.2" />
      <Circle cx={7.1} cy={11.4} r={1.2} />
    </>
  ),
  public: () => (
    <>
      <Circle cx={8.5} cy={9} r={3.2} />
      <Circle cx={16.5} cy={9} r={3.2} />
      <Path d="M2.5 20c.8-3.4 3.2-5 6-5 1.4 0 2.7.4 3.5 1.2.8-.8 2.1-1.2 3.5-1.2 2.8 0 5.2 1.6 6 5" />
    </>
  ),
  work: () => (
    <>
      <Rect x={3} y={8} width={18} height={12} rx={2.5} />
      <Path d="M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
    </>
  ),
  out: () => (
    <>
      <Path d="M12 21s7-5.4 7-11a7 7 0 0 0-14 0c0 5.6 7 11 7 11z" />
      <Circle cx={12} cy={10} r={2.6} />
    </>
  ),
};

function WherePage({ place, onPlace, onBack, onNext }: { place: UrgePlace; onPlace: (next: UrgePlace) => void; onBack: () => void; onNext: () => void }) {
  return (
    <PaperSheet>
      <PickerBack onPress={onBack} />
      <PickerHead title="Where are you right now?" />
      {PLACES.map((item, index) => (
        <PickerRow
          key={item.key}
          top={162 + index * 72}
          height={60}
          label={item.label}
          glyph={<PickerGlyph on={place === item.key}>{PLACE_GLYPH[item.key]}</PickerGlyph>}
          selected={place === item.key}
          onPress={() => onPlace(item.key)}
        />
      ))}
      <PickerContinue onPress={onNext} />
    </PaperSheet>
  );
}

function FeelingPage({ feeling, onFeeling, onBack, onNext }: { feeling?: string; onFeeling: (next: string) => void; onBack: () => void; onNext: () => void }) {
  return (
    <PaperSheet>
      <PickerBack onPress={onBack} />
      <PickerHead title="What’s underneath it?" />
      <PickerGrid cards={URGE_FEELINGS} selected={feeling} onSelect={onFeeling} />
      <PickerContinue onPress={onNext} />
    </PaperSheet>
  );
}

/**
 * `102 · What’s feeding it right now?` — nine cards, and one answer.
 *
 * The board this replaced was multi-select, with a check disc on every row it
 * had taken. The canvas draws no check anywhere in the grid, and the branch
 * behind it is one board per answer, so it takes one.
 */
function ReasonPage({ trigger, onTrigger, onBack, onNext }: { trigger?: string; onTrigger: (next: string) => void; onBack: () => void; onNext: () => void }) {
  return (
    <PaperSheet>
      <PickerBack onPress={onBack} />
      <PickerHead title="What’s feeding it right now?" />
      <PickerGrid cards={URGE_TRIGGERS} selected={trigger} onSelect={onTrigger} />
      <PickerContinue onPress={onNext} />
    </PaperSheet>
  );
}

// ── 99 · 100 · 101 · the three moves ────────────────────────────────────────

/**
 * `101 · Put the phone away.` — the lamp, the table and the phone face down.
 *
 * `UI Final 1` resequenced the three moves, so this scene is the *third* board
 * now; it was the first, and the name it still carries describes that.
 */
function ScreenStepArt() {
  return (
    <>
      <SoftBlob id="u90-step1-warm" left={112} top={56} width={130} height={130} color="rgb(226,186,120)" alpha={0.4} />
      <View style={{ position: 'absolute', left: 20, top: 14, width: 34, height: 34, borderRadius: 17, backgroundColor: '#DCDED8' }} />
      <View style={{ position: 'absolute', left: 12, top: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: '#F4F3F0' }} />
      <View style={{ position: 'absolute', left: 30, top: 62, width: 34, height: 22, borderRadius: 8, backgroundColor: '#C6C5C0' }} />
      <View style={{ position: 'absolute', left: 44, top: 84, width: 6, height: 88, borderRadius: 3, backgroundColor: '#B4B1AB' }} />
      <SoftBlob id="u90-step1-pool" left={24} top={150} width={70} height={24} color="rgb(226,186,120)" alpha={0.22} stop={1} />
      <View
        style={{
          position: 'absolute',
          left: 128,
          top: 124,
          width: 92,
          height: 32,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          backgroundColor: '#E0DFDA',
        }}
      />
      <View style={{ position: 'absolute', left: 166, top: 136, width: 16, height: 5, borderRadius: 3, backgroundColor: '#C6C5C0' }} />
      <View style={{ position: 'absolute', left: 134, top: 156, width: 6, height: 22, borderRadius: 3, backgroundColor: '#D6D5D0' }} />
      <View style={{ position: 'absolute', left: 208, top: 156, width: 6, height: 22, borderRadius: 3, backgroundColor: '#D6D5D0' }} />
      <View style={{ position: 'absolute', left: 146, top: 110, width: 54, height: 12, borderRadius: 6, backgroundColor: '#3A3934' }} />
      <View style={{ position: 'absolute', left: 188, top: 113, width: 4, height: 4, borderRadius: 2, backgroundColor: '#8B8882' }} />
    </>
  );
}

/** `99 · Stand up.` — out of the bed, into a lit doorway. The first board now. */
function MoveStepArt() {
  return (
    <>
      <SoftBlob id="u90-step2-warm" left={50} top={44} width={120} height={120} color="rgb(226,186,120)" alpha={0.4} />
      <View style={{ position: 'absolute', left: 20, top: 14, width: 34, height: 34, borderRadius: 17, backgroundColor: '#DCDED8' }} />
      <View style={{ position: 'absolute', left: 12, top: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: '#F4F3F0' }} />
      <View
        style={{
          position: 'absolute',
          left: 24,
          top: 120,
          width: 96,
          height: 30,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          backgroundColor: '#E0DFDA',
        }}
      />
      <View style={{ position: 'absolute', left: 30, top: 112, width: 44, height: 15, borderRadius: 8, backgroundColor: '#C6C5C0' }} />
      <View style={{ position: 'absolute', left: 18, top: 120, width: 6, height: 52, borderRadius: 3, backgroundColor: '#D6D5D0' }} />
      <View style={{ position: 'absolute', left: 118, top: 120, width: 6, height: 52, borderRadius: 3, backgroundColor: '#D6D5D0' }} />
      <View style={{ position: 'absolute', left: 168, top: 40, width: 52, height: 138, borderRadius: 8, backgroundColor: '#E4E3DE' }} />
      <View style={{ position: 'absolute', left: 174, top: 46, width: 34, height: 126, borderRadius: 5, overflow: 'hidden' }}>
        <LinearGradient colors={['#F7F6F2', '#EDECE7']} style={{ flex: 1 }} />
      </View>
      <SoftBlob id="u90-step2-pool" left={150} top={150} width={70} height={26} color="rgb(226,186,120)" alpha={0.22} stop={1} />
      <View style={{ position: 'absolute', left: 136, top: 96, width: 10, height: 22, borderRadius: 5, backgroundColor: '#B4B1AB' }} />
      <SoftBlob id="u90-step2-shadowA" left={12} top={174} width={116} height={14} color="rgb(0,0,0)" alpha={0.1} stop={1} />
      <SoftBlob id="u90-step2-shadowB" left={160} top={180} width={66} height={12} color="rgb(0,0,0)" alpha={0.08} stop={1} />
      <View style={{ position: 'absolute', left: 28, top: 128, width: 88, height: 8, borderRadius: 4, backgroundColor: '#D6D5D0' }} />
      <View style={{ position: 'absolute', left: 96, top: 186, width: 56, height: 9, borderRadius: 5, backgroundColor: '#E4E3DE' }} />
      <SkyDot left={216} top={20} alpha={0.4} />
      <SkyDot left={6} top={52} alpha={0.3} />
    </>
  );
}

/**
 * `100 · Leave the room.` — the second move's scene: a door slab, half open,
 * warm light down its edge. Seven layers in the 240 × 200 box, in the canvas's
 * own paint order. It replaces the running tap the previous bundle drew here.
 *
 * The three `filter: blur` layers are `SoftBlob`s: the warm glow keeps the
 * canvas's own `74%` stop, and the two flat washes state no stop at all, so
 * they run to the edge.
 */
function LeaveStepArt() {
  return (
    <>
      <SoftBlob id="u90-leave-glow" left={58} top={28} width={124} height={124} color="rgb(226,186,120)" alpha={0.4} />
      <View style={{ position: 'absolute', left: 82, top: 22, width: 80, height: 152, borderRadius: 7, backgroundColor: '#E4E3DE' }} />
      <LinearGradient colors={['#F7F6F2', '#EFE4CF']} style={{ position: 'absolute', left: 88, top: 28, width: 68, height: 146, borderRadius: 4 }} />
      <View
        style={{
          position: 'absolute',
          left: 146,
          top: 26,
          width: 32,
          height: 148,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 6,
          borderBottomRightRadius: 6,
          borderBottomLeftRadius: 3,
          backgroundColor: '#DCDBD5',
          overflow: 'hidden',
        }}>
        {/* the canvas's `inset 1px 0 0 rgba(0,0,0,0.05)` — an inset shadow on a
            partly-rounded box has no RN equivalent, so it is the hairline it
            paints */}
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />
      </View>
      <View style={{ position: 'absolute', left: 152, top: 96, width: 4, height: 4, borderRadius: 2, backgroundColor: '#B4B1AB' }} />
      <SoftBlob id="u90-leave-pool" left={84} top={176} width={100} height={16} color="rgb(226,186,120)" alpha={0.25} stop={1} />
      <SoftBlob id="u90-leave-shadow" left={70} top={180} width={130} height={13} color="rgb(0,0,0)" alpha={0.1} stop={1} />
    </>
  );
}

/**
 * One of the three moves. The pager counts them, the art changes with them, and
 * only the third carries a body — `UI Final 1` deleted the other two's, and the
 * "Skip this step" link with them, and gave each board its own pill label in
 * place of a shared "Done — next".
 */
function MovePage({ index, art, onClose, onNext }: { index: number; art: ReactNode; onClose: () => void; onNext: () => void }) {
  const move = MOVES[index];
  return (
    <PaperSheet>
      <SheetClose onPress={onClose} />
      <StepPager index={index} />
      {/* the canvas clips the art box; the lamp board's glow runs 2pt past it */}
      <View pointerEvents="none" style={{ position: 'absolute', left: 76, top: 180, width: 240, height: 200, overflow: 'hidden' }}>
        {art}
      </View>
      <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 398, fontSize: 23, letterSpacing: 0.1, color: SHEET_TEXT }]}>
        {move.title}
      </AppText>
      {move.body ? (
        <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: 444, fontSize: 15.5, lineHeight: 23, color: SHEET_MUTED }]}>
          {move.body}
        </AppText>
      ) : null}
      <SheetPrimary label={move.cta} onPress={onNext} />
    </PaperSheet>
  );
}

// ── 104 · 117–146 · the response boards ─────────────────────────────────────

/**
 * One layer of a response board's scene.
 *
 * The canvas draws these as absolutely-positioned `<div>`s inside a
 * `240 × 220` box with an `inset: 0; overflow: hidden` clip child. Three of the
 * things they use have no React Native equivalent and are redrawn rather than
 * approximated (`DECISIONS.md` D010, D015):
 *
 * * `filter: blur(Npx)` on a solid or a radial — the blur *is* the shape on
 *   these layers, so it becomes a radial falloff.
 * * `border-radius: 50%` — a number, not a percentage, so it is half the box.
 * * `border-radius: a b c d / e f g h` — an elliptical corner, which React
 *   Native cannot express at all, so the layer is drawn as an SVG arc.
 */
function SosSceneLayer({ layer, id }: { layer: SosLayer; id: string }) {
  const box = {
    position: 'absolute' as const,
    left: layer.left,
    top: layer.top,
    right: layer.right,
    bottom: layer.bottom,
    width: layer.width,
    height: layer.height,
  };
  const w = layer.width ?? 0;
  const h = layer.height ?? 0;

  // The canvas builds four arrowheads out of borders on a zero-size box, which
  // React Native cannot do at all — they are polygons here.
  if (layer.tri) {
    const { dir, w: tw, h: th, color } = layer.tri;
    return (
      <Svg width={tw} height={th} pointerEvents="none" style={{ position: 'absolute', left: layer.left, top: layer.top }}>
        <Path d={dir === 'right' ? `M0 0L${tw} ${th / 2}L0 ${th}Z` : `M${tw} 0L0 ${th / 2}L${tw} ${th}Z`} fill={color} />
      </Svg>
    );
  }

  // A radial wash, blurred or not, is a `SoftBlob` either way.
  if (layer.bg?.kind === 'radial') {
    return <SoftBlob id={id} left={layer.left ?? 0} top={layer.top ?? 0} width={w} height={h} color={layer.bg.from ?? '#000000'} alpha={1} stop={layer.bg.stop ?? 1} />;
  }
  // A blurred solid is the same falloff in the layer's own colour.
  if (layer.blur && layer.bg?.kind === 'solid') {
    return <SoftBlob id={id} left={layer.left ?? 0} top={layer.top ?? 0} width={w} height={h} color={layer.bg.color ?? '#000000'} alpha={1} stop={1} />;
  }

  const radius =
    layer.radius?.kind === 'pill'
      ? { borderRadius: Math.min(w, h) / 2 }
      : layer.radius?.kind === 'all'
        ? { borderRadius: layer.radius.r }
        : layer.radius?.kind === 'corners'
          ? {
              borderTopLeftRadius: layer.radius.corners[0],
              borderTopRightRadius: layer.radius.corners[1],
              borderBottomRightRadius: layer.radius.corners[2],
              borderBottomLeftRadius: layer.radius.corners[3],
            }
          : null;

  // An elliptical top — `50% 50% 0 0 / Npx Npx 0 0` — is the `Hill` arc.
  if (layer.radius?.kind === 'elliptic') {
    const rise = parseFloat(String(layer.radius.v[0]));
    const pct = String(layer.radius.v[0]).endsWith('%');
    return (
      <Hill
        left={layer.left ?? 0}
        top={layer.top ?? 0}
        width={w}
        height={h}
        ry={pct ? (rise / 100) * h : rise}
        fill={layer.bg?.kind === 'solid' ? (layer.bg.color ?? '#000000') : '#000000'}
      />
    );
  }

  if (layer.bg?.kind === 'linear') {
    const spin = layer.transform?.match(/rotate\((-?[0-9.]+)deg\)/);
    return <LinearGradient colors={(layer.bg.stops ?? ['#FFFFFF', '#FFFFFF']) as [string, string]} style={[box, radius, spin ? { transform: [{ rotate: `${spin[1]}deg` }], transformOrigin: layer.origin ?? 'center' } : null]} />;
  }
  const rotate = layer.transform?.match(/rotate\((-?[0-9.]+)deg\)/);
  return (
    <View
      style={[
        box,
        radius,
        layer.bg?.kind === 'solid' ? { backgroundColor: layer.bg.color } : null,
        layer.shadow ? { boxShadow: layer.shadow } : null,
        rotate ? { transform: [{ rotate: `${rotate[1]}deg` }], transformOrigin: layer.origin ?? 'center' } : null,
      ]}
    />
  );
}

/**
 * `104` and `117–146` — the board the flow shows once it knows the answer.
 *
 * Thirty-one of them, one per answer, all the same shape: a clipped `240 × 220`
 * scene at `top: 180`, a headline at 434, a sentence at 480, and a pill whose
 * words are the answer's own. Thirteen of them — the feeling branch, and the
 * challenge board — add a "Give me another" link; one adds a challenge card.
 *
 * Every value comes from `src/content/sosResponses.ts`, generated from the
 * frames.
 */
function ResponsePage({ answer, onClose, onNext, onAnother }: { answer: string; onClose: () => void; onNext: () => void; onAnother?: () => void }) {
  const id = useId().replace(/:/g, '');
  const board = SOS_RESPONSES[answer];
  if (!board) return null;
  return (
    <PaperSheet>
      <SheetClose onPress={onClose} />
      {board.layers.length ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 76, top: 180, width: 240, height: 220, overflow: 'hidden' }}>
          {board.layers.map((layer, i) => (
            <SosSceneLayer key={i} layer={layer} id={`sos${id}${i}`} />
          ))}
        </View>
      ) : null}
      {/* the challenge board draws its copy 284 higher, where the scene is not */}
      <AppText
        center
        style={[sans('500'), { position: 'absolute', left: board.challenge ? 44 : 36, right: board.challenge ? 44 : 36, top: board.challenge ? 150 : 434, fontSize: 23, lineHeight: board.challenge ? 31 : 30, letterSpacing: 0.1, color: SHEET_TEXT }]}>
        {board.title}
      </AppText>
      <AppText
        center
        style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: board.challenge ? 214 : 480, fontSize: board.challenge ? 15 : 15.5, lineHeight: 23, color: SHEET_MUTED }]}>
        {board.body}
      </AppText>
      {board.challenge ? (
        <View style={{ position: 'absolute', left: 24, right: 24, top: 330, borderRadius: 18, borderCurve: 'continuous', backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)', paddingTop: 22, paddingHorizontal: 22, paddingBottom: 24 }}>
          <AppText style={[sans('600'), { fontSize: 12, letterSpacing: 1.2, color: '#A5A29B' }]}>THE CHALLENGE</AppText>
          <AppText style={[sans('500'), { marginTop: 12, fontSize: 17, lineHeight: 26, color: SHEET_TEXT }]}>{board.challenge}</AppText>
        </View>
      ) : null}
      {/* the response boards' pill is half a point smaller than the flow's */}
      <PressScale
        onPress={onNext}
        accessibilityRole="button"
        style={{ position: 'absolute', left: 24, right: 24, bottom: 88, height: 54, minHeight: 54, borderRadius: 27, backgroundColor: SHEET_INK, alignItems: 'center', justifyContent: 'center' }}>
        <AppText style={[sans('600'), { fontSize: board.challenge ? 17 : 16.5, letterSpacing: 0.2, color: '#FFFFFF' }]}>{board.cta}</AppText>
      </PressScale>
      {board.another && onAnother ? (
        <PressScale
          onPress={onAnother}
          accessibilityRole="button"
          hitSlop={{ top: 14, bottom: 14, left: 60, right: 60 }}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 44, minHeight: 0 }}>
          <AppText center style={[sans('500'), { fontSize: 15, color: SHEET_SOFT }]}>Give me another</AppText>
        </PressScale>
      ) : null}
    </PaperSheet>
  );
}

/**
 * `105 · Where is the urge now?` — the second intensity read.
 *
 * The same five discs the first read draws, at the same `left: 36 right: 36
 * top: 330`, under a headline at 150 and a line at 200 that the first read no
 * longer has. It closes on "Continue" and offers no skip.
 *
 * Its own five words: `INTENSITY_BANDS` reads the *first* question ("How strong
 * is it?"), and this one asks where the urge has got to, so index 1 is
 * "Noticeable · Coming down" where the first read says "Mild · Easy to set
 * aside". Only index 1 is drawn; the other four are the app's, written to the
 * same register.
 */
const REASSESS_BANDS: { label: string; note: string }[] = [
  { label: 'Gone', note: 'It passed' },
  { label: 'Noticeable', note: 'Coming down' },
  { label: 'Still there', note: 'Holding steady' },
  { label: 'Strong', note: 'Not done yet' },
  { label: 'Peaking', note: 'Stay with it' },
];

function ReassessPage({ band, onBand, onClose, onNext }: { band: number; onBand: (index: number) => void; onClose: () => void; onNext: () => void }) {
  return (
    <PaperSheet>
      <SheetClose onPress={onClose} />
      <AppText center style={[sans('500'), { position: 'absolute', left: 44, right: 44, top: 150, fontSize: 23, lineHeight: 31, letterSpacing: 0.1, color: SHEET_TEXT }]}>
        Where is the urge now?
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: 200, fontSize: 14.5, color: SHEET_SOFT }]}>
        Rate it again from 1–5.
      </AppText>
      <View style={{ position: 'absolute', left: 36, right: 36, top: 330, flexDirection: 'row', justifyContent: 'space-between' }}>
        {REASSESS_BANDS.map((item, i) => {
          const on = band === i;
          return (
            <PressScale
              key={item.label}
              onPress={() => onBand(i)}
              accessibilityRole="radio"
              accessibilityLabel={item.label}
              accessibilityState={{ checked: on }}
              style={{
                width: 48,
                height: 48,
                minHeight: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: on ? SHEET_INK : '#FFFFFF',
                boxShadow: on ? '0 0 0 2px #F4F3F0, 0 0 0 4px #131313' : 'inset 0 0 0 1.5px rgba(0,0,0,0.12)',
              }}>
              {on ? <View style={{ width: 11, height: 11, borderRadius: 5.5, backgroundColor: SHEET_PAPER }} /> : null}
            </PressScale>
          );
        })}
      </View>
      <AppText center style={[sans('600'), { position: 'absolute', left: 0, right: 0, top: 452, fontSize: 19, color: SHEET_TEXT }]}>
        {REASSESS_BANDS[band].label}
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: 482, fontSize: 13.5, color: SHEET_SOFT }]}>
        {REASSESS_BANDS[band].note}
      </AppText>
      <SheetPrimary label="Continue" onPress={onNext} />
    </PaperSheet>
  );
}

/**
 * `106 · One more thing.` — one line, on a rule, before the flow closes.
 *
 * The canvas draws a left-aligned placeholder at `left: 36 top: 326` over a
 * 1.5pt rule at 356, and nothing else: no filled state, no counter, no second
 * line. The words are filed on the event as its note, which is the one field
 * the schema already carries for a sentence the user writes about an urge.
 */
function AfterwardPage({ note, onNote, onClose, onNext }: { note: string; onNote: (next: string) => void; onClose: () => void; onNext: () => void }) {
  return (
    <PaperSheet>
      <SheetClose onPress={onClose} />
      <AppText center style={[sans('500'), { position: 'absolute', left: 44, right: 44, top: 150, fontSize: 23, lineHeight: 31, letterSpacing: 0.1, color: SHEET_TEXT }]}>
        One more thing.
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: 214, fontSize: 15, lineHeight: 23, color: SHEET_MUTED }]}>
        The relationship doesn’t need solving tonight. Write the one thing you need to say tomorrow.
      </AppText>
      <TextInput
        value={note}
        onChangeText={onNote}
        placeholder="I need to say…"
        placeholderTextColor="#B0AEA8"
        style={[
          { position: 'absolute', left: 36, right: 36, top: 326, fontFamily: fonts.sans, fontSize: 16, color: SHEET_TEXT, padding: 0 },
          Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
        ]}
      />
      <View style={{ position: 'absolute', left: 36, right: 36, top: 356, height: 1.5, backgroundColor: 'rgba(0,0,0,0.22)' }} />
      <SheetPrimary label="Done" onPress={onNext} />
    </PaperSheet>
  );
}

// ── 138 · 139 · 140 · 141 — the dark SOS ────────────────────────────────────

export type SosSound = 'ocean' | 'rain' | 'silent';
export type SosLight = 'blue' | 'violet' | 'gold' | 'silver';
export type SosBackground = 'night' | 'starfield' | 'dawn';

export interface SosSettings {
  sound: SosSound;
  /** Null until a light is picked — the orb ships paper-white, as canvas 138 draws it. */
  light: SosLight | null;
  background: SosBackground;
}

const SOS_SETTINGS_KEY = 'tideline.sos.settings';
const DEFAULT_SOS_SETTINGS: SosSettings = { sound: 'ocean', light: null, background: 'night' };

const SOS_LIGHTS: { key: SosLight; stops: readonly [string, string, string] }[] = [
  { key: 'blue', stops: ['#A9BFF0', '#6D87CE', '#3A4E8C'] },
  { key: 'violet', stops: ['#B7A6E3', '#8B7CC9', '#54488C'] },
  { key: 'gold', stops: ['#EED9AE', '#D9B98A', '#A8823F'] },
  { key: 'silver', stops: ['#DDE4EC', '#9FB0C2', '#6B6963'] },
];

/** `radial-gradient(circle at 36% 30%, …)` — farthest-corner, so ~95% of the box. */
function LightOrb({ id, size, stops, mid = 48 }: { id: string; size: number; stops: readonly [string, string, string]; mid?: number }) {
  return (
    <Svg width={size} height={size} pointerEvents="none">
      <Defs>
        <RadialGradient id={id} cx="36%" cy="30%" rx="95%" ry="95%">
          <Stop offset={0} stopColor={stops[0]} />
          <Stop offset={mid / 100} stopColor={stops[1]} />
          <Stop offset={1} stopColor={stops[2]} />
        </RadialGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

/**
 * The orb before any light is picked — canvas 152's paper-white ball.
 * `circle at 50% 42%` takes CSS's default farthest-corner extent: in a square box
 * the far corner sits 76.6% of the side away from (50%, 42%), not 50%.
 */
function PaperOrb({ id, size }: { id: string; size: number }) {
  return (
    <Svg width={size} height={size} pointerEvents="none">
      <Defs>
        <RadialGradient id={id} cx="50%" cy="42%" rx="76.6%" ry="76.6%">
          <Stop offset={0} stopColor="rgb(247,246,242)" stopOpacity={0.95} />
          <Stop offset={0.65} stopColor="rgb(220,219,214)" stopOpacity={0.85} />
          <Stop offset={1} stopColor="rgb(198,197,192)" stopOpacity={0.6} />
        </RadialGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

const STARFIELD = [
  { x: 0.11, y: 0.14 },
  { x: 0.32, y: 0.09 },
  { x: 0.58, y: 0.2 },
  { x: 0.79, y: 0.12 },
  { x: 0.22, y: 0.31 },
  { x: 0.68, y: 0.35 },
  { x: 0.88, y: 0.27 },
  { x: 0.42, y: 0.42 },
  { x: 0.14, y: 0.48 },
  { x: 0.75, y: 0.52 },
  { x: 0.5, y: 0.58 },
  { x: 0.3, y: 0.64 },
];

/** The three grounds the settings sheet offers, drawn full-bleed from the same
 * recipes their 84pt thumbnails use. */
function SosBackdrop({ background, hills }: { background: SosBackground; hills: boolean }) {
  const { width, height } = useWindowDimensions();

  if (background === 'starfield') {
    return (
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <LinearGradient colors={['#0E1116', '#1A2130']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        {STARFIELD.map((star, index) => (
          <View
            key={index}
            style={{
              position: 'absolute',
              left: star.x * width,
              top: star.y * height,
              width: index % 3 === 0 ? 2.5 : 2,
              height: index % 3 === 0 ? 2.5 : 2,
              borderRadius: 1.5,
              backgroundColor: `rgba(244,243,240,${0.4 + (index % 4) * 0.1})`,
            }}
          />
        ))}
      </View>
    );
  }

  if (background === 'dawn') {
    return (
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <LinearGradient colors={['#2A2E3C', '#6B5D6E', '#C89A7A']} locations={[0, 0.6, 1]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <SoftBlob id="u90-dawn-sun" left={width / 2 - 110} top={height * 0.72} width={220} height={220} color="rgb(243,227,196)" alpha={0.9} stop={0.8} />
      </View>
    );
  }

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      <LinearGradient colors={['#14171B', '#191E25', '#202730']} locations={[0, 0.55, 1]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      {hills ? (
        <>
          <Hill left={-0.2 * width} width={1.4 * width} top={0.62 * height} height={0.7 * height} ry={0.2 * 0.7 * height} fill="#1D242C" />
          <Hill left={-0.4 * width} width={1.5 * width} top={0.76 * height} height={0.7 * height} ry={0.16 * 0.7 * height} fill="#242C36" />
          <View style={{ position: 'absolute', left: 0.24 * width, top: 0.69 * height, width: 0.08 * width, height: 3, borderRadius: 2, backgroundColor: 'rgba(244,243,240,0.10)' }} />
        </>
      ) : null}
    </View>
  );
}

function GearGlyph() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" fill="none" stroke="rgba(244,243,240,0.85)" strokeWidth={1.8} />
      <Path
        d="M19.2 12c0-.5-.05-.95-.14-1.4l2.1-1.6-2-3.4-2.45 1a7.2 7.2 0 0 0-2.4-1.4L13.9 2.6h-3.8l-.4 2.6a7.2 7.2 0 0 0-2.4 1.4l-2.46-1-2 3.4 2.1 1.6c-.08.45-.13.9-.13 1.4s.05.95.14 1.4l-2.1 1.6 2 3.4 2.45-1c.72.6 1.53 1.08 2.4 1.4l.4 2.6h3.8l.4-2.6a7.2 7.2 0 0 0 2.4-1.4l2.45 1 2-3.4-2.1-1.6c.1-.45.14-.9.14-1.4z"
        fill="none"
        stroke="rgba(244,243,240,0.85)"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** The shell all four SOS stages share: ground, moon wash, the sentence pair
 * under the art, the stage dots, and the one quiet way out. */
function SosStage({
  settings,
  moon,
  hills = false,
  title,
  caption,
  hint,
  stage,
  onSettings,
  onEnd,
  children,
}: {
  settings: SosSettings;
  moon: { top: number; size: number; alpha: number };
  hills?: boolean;
  title: string;
  caption: string;
  hint: string;
  stage: number;
  onSettings?: () => void;
  onEnd: () => void;
  children?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  return (
    <View style={{ flex: 1, backgroundColor: '#0F0F0E', overflow: 'hidden' }}>
      <StatusBar style="light" />
      <SosBackdrop background={settings.background} hills={hills} />
      {/* the canvas keeps the moon wash inside the ground div, so the bottom scrim lies over it */}
      <SoftBlob
        id="u90-sos-moon"
        left={width / 2 - moon.size / 2}
        top={insets.top + moon.top}
        width={moon.size}
        height={moon.size}
        color="rgb(216,225,235)"
        alpha={moon.alpha}
        stop={0.8}
      />
      <LinearGradient
        colors={['rgba(15,15,14,0)', 'rgba(15,15,14,0.55)', 'rgba(15,15,14,0.82)']}
        locations={[0, 0.55, 1]}
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 230 }}
      />
      <View style={{ position: 'absolute', top: insets.top, left: 0, right: 0, bottom: 0 }}>
        {onSettings ? (
          <PressScale
            onPress={onSettings}
            accessibilityRole="button"
            accessibilityLabel="SOS settings"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            style={{ position: 'absolute', left: 20, top: 10, minHeight: 0 }}>
            <GearGlyph />
          </PressScale>
        ) : null}
        <AppText center style={[sans('500'), { position: 'absolute', left: 40, right: 40, top: 74, fontSize: 22, lineHeight: 32, color: SOS_PAPER }]}>
          {title}
        </AppText>
        {children}
        <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 508, fontSize: 17, color: SOS_PAPER }]}>
          {caption}
        </AppText>
        <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: 538, fontSize: 14, color: 'rgba(255,255,255,0.55)' }]}>
          {hint}
        </AppText>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 590, flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: i === stage ? SOS_PAPER : 'rgba(255,255,255,0.28)' }} />
          ))}
        </View>
        <PressScale
          onPress={onEnd}
          accessibilityRole="button"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 48,
            height: 48,
            borderRadius: 25,
            backgroundColor: 'rgba(255,255,255,0.08)',
            boxShadow: '0 0 0 1.5px rgba(255,255,255,0.35)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText style={[sans('600'), { fontSize: 17.5, letterSpacing: 0.3, color: 'rgba(244,243,240,0.75)' }]}>End early</AppText>
        </PressScale>
      </View>
    </View>
  );
}

// ── 138 · box breathing, 4 · 4 · 4 · 4 ──────────────────────────────────────

const BOX_STEPS = [
  { seconds: 4, caption: 'Breathe in through the nose' },
  { seconds: 4, caption: 'Hold it' },
  { seconds: 4, caption: 'Breathe out slowly' },
  { seconds: 4, caption: 'Hold, empty' },
] as const;

function BreathOrb({ step, count, light }: { step: number; count: number; light: SosLight | null }) {
  // Inhale swells the orb over its four seconds, exhale settles it; the two
  // holds keep whatever the previous phase left.
  const scale = useSharedValue(0.88);
  useEffect(() => {
    if (step === 0) scale.value = withTiming(1.06, { duration: 4000, easing: Easing.inOut(Easing.ease) });
    else if (step === 2) scale.value = withTiming(0.88, { duration: 4000, easing: Easing.inOut(Easing.ease) });
  }, [step, scale]);
  const orbStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const stops = SOS_LIGHTS.find((item) => item.key === light)?.stops;

  return (
    <View style={{ position: 'absolute', left: 96, top: 236 }}>
      <View style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center' }}>
        <Reanimated.View style={[{ position: 'absolute', width: 190, height: 190, borderRadius: 95, boxShadow: '0 0 60px rgba(244,243,240,0.35)' }, orbStyle]}>
          {stops ? <LightOrb id="u90-breath-light" size={190} stops={stops} mid={46} /> : <PaperOrb id="u90-breath-orb" size={190} />}
        </Reanimated.View>
        <AppText style={[sans('600'), { fontSize: 44, color: SHEET_INK }]}>{count}</AppText>
      </View>
    </View>
  );
}

/** Three full boxes is the round, and the SOS moves on by itself after it. */
const BOX_ROUND_SECONDS = BOX_STEPS.length * BOX_STEPS[0].seconds * 3;

function BreatheStage({ settings, onSettings, onEnd, onDone }: { settings: SosSettings; onSettings: () => void; onEnd: () => void; onDone: () => void }) {
  // One counter drives both the phase and the countdown, so the two can never
  // drift apart and nothing has to be mutated from inside a state updater.
  const [elapsed, setElapsed] = useState(0);
  const step = Math.floor(elapsed / BOX_STEPS[0].seconds) % BOX_STEPS.length;
  const count = BOX_STEPS[0].seconds - (elapsed % BOX_STEPS[0].seconds);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const tick = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (elapsed >= BOX_ROUND_SECONDS) doneRef.current();
  }, [elapsed]);

  return (
    <SosStage
      settings={settings}
      moon={{ top: 66, size: 260, alpha: 0.12 }}
      hills
      title="Breathe with me."
      caption={BOX_STEPS[step].caption}
      hint="4 in · 4 hold · 4 out · 4 hold"
      stage={0}
      onSettings={onSettings}
      onEnd={onEnd}>
      <BreathOrb step={step} count={count} light={settings.light} />
    </SosStage>
  );
}

// ── 139 · number tap ────────────────────────────────────────────────────────

/** Five landing spots, as the centres of the canvas's discs — x straight from
 * the frame, y less the 54pt status bar. The disc grows to 68 while it is live
 * (canvas left 154 / top 338), so the box is derived from the centre, not the
 * other way round. */
const TAP_SLOTS = [
  { cx: 102, cy: 200 },
  { cx: 286, cy: 236 },
  { cx: 188, cy: 318 },
  { cx: 94, cy: 408 },
  { cx: 290, cy: 426 },
];

const COUNT_WORD = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five'];

function TapStage({ settings, onEnd, onDone }: { settings: SosSettings; onEnd: () => void; onDone: () => void }) {
  const [next, setNext] = useState(0);

  function tap(index: number) {
    if (index !== next) return;
    if (index === TAP_SLOTS.length - 1) onDone();
    else setNext(index + 1);
  }

  return (
    <SosStage
      settings={settings}
      moon={{ top: 86, size: 280, alpha: 0.1 }}
      title="Tap the numbers as they land."
      caption={`${COUNT_WORD[next + 1]} down, ${COUNT_WORD[TAP_SLOTS.length - next - 1].toLowerCase()} to go`}
      hint="Eyes on the count, not the wave"
      stage={1}
      onEnd={onEnd}>
      {TAP_SLOTS.map((slot, index) => {
        const done = index < next;
        const live = index === next;
        const size = live ? 68 : 56;
        return (
          <View key={index} style={{ position: 'absolute', left: slot.cx - size / 2, top: slot.cy - size / 2 }}>
            {/* canvas glow: a 72pt closest-side wash at left 146 / top 330, i.e. 6pt up-left of
                the disc centre, then `transform: scale(1.9)` — so it paints 136.8 across */}
            {live ? <SoftBlob id="u90-tap-glow" left={-40.4} top={-40.4} width={136.8} height={136.8} color="rgb(233,210,164)" alpha={0.45} stop={0.8} /> : null}
            <PressScale
              onPress={() => tap(index)}
              accessibilityRole="button"
              accessibilityLabel={`Number ${index + 1}`}
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                minHeight: 0,
                backgroundColor: live ? '#E9D2A4' : done ? 'rgba(255,255,255,0.10)' : 'transparent',
                boxShadow: live ? undefined : done ? 'inset 0 0 0 1.5px rgba(255,255,255,0.14)' : 'inset 0 0 0 1.5px rgba(255,255,255,0.30)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {done ? (
                <Svg width={16} height={13} viewBox="0 0 16 13" fill="none">
                  <Path d="M1.5 7l4.4 4.5L14.5 1.5" stroke="rgba(244,243,240,0.55)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              ) : (
                <AppText style={[sans('600'), { fontSize: live ? 28 : 22, color: live ? SHEET_INK : 'rgba(244,243,240,0.6)' }]}>{index + 1}</AppText>
              )}
            </PressScale>
          </View>
        );
      })}
    </SosStage>
  );
}

// ── 140 · odd one out ───────────────────────────────────────────────────────

const ODD_ROUNDS = 6;

function OddStage({ settings, onEnd, onDone }: { settings: SosSettings; onEnd: () => void; onDone: () => void }) {
  const [round, setRound] = useState(1);
  const [odd, setOdd] = useState(() => Math.floor(Math.random() * 9));

  function pick(index: number) {
    if (index !== odd) return;
    if (round >= ODD_ROUNDS) {
      onDone();
      return;
    }
    setRound(round + 1);
    setOdd((current) => (current + 1 + Math.floor(Math.random() * 8)) % 9);
  }

  return (
    <SosStage
      settings={settings}
      moon={{ top: 86, size: 280, alpha: 0.1 }}
      title="Find the one that's different."
      caption={`Round ${roman(round)} of ${roman(ODD_ROUNDS)}`}
      hint="Each round gets a little harder"
      stage={2}
      onEnd={onEnd}>
      <View style={{ position: 'absolute', left: 76, top: 184 }}>
        <View style={{ width: 240, height: 240, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {Array.from({ length: 9 }).map((_, index) => {
            const on = index === odd;
            return (
              <PressScale
                key={index}
                onPress={() => pick(index)}
                accessibilityRole="button"
                accessibilityLabel={`Tile ${index + 1}`}
                style={{
                  width: 72,
                  height: 72,
                  minHeight: 0,
                  borderRadius: 16,
                  backgroundColor: on ? '#E9D2A4' : 'rgba(255,255,255,0.08)',
                  boxShadow: on ? undefined : 'inset 0 0 0 1.5px rgba(255,255,255,0.14)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: on ? SHEET_INK : 'rgba(244,243,240,0.35)' }} />
              </PressScale>
            );
          })}
        </View>
      </View>
    </SosStage>
  );
}

// ── the fourth stage — the 90-second clock and the arc it rides ─────────────

const SURF_SECONDS = 90;
const SURF_PHASES = [
  { at: 0, name: 'RISING' },
  { at: 0.28, name: 'CRESTING' },
  { at: 0.62, name: 'PASSING' },
  { at: 0.86, name: 'SETTLING' },
];

/** The four quadratic segments below are the drawn path's `Q`/`T` runs with the
 * smooth-curve reflections resolved, so the marker rides the line itself. */
const ARC_SEGMENTS: [[number, number], [number, number], [number, number]][] = [
  [
    [0, 45],
    [32, 10],
    [65, 38],
  ],
  [
    [65, 38],
    [98, 66],
    [130, 30],
  ],
  [
    [130, 30],
    [162, -6],
    [195, 22],
  ],
  [
    [195, 22],
    [228, 50],
    [260, 12],
  ],
];

function arcPoint(progress: number): { x: number; y: number } {
  const scaled = Math.min(0.9999, Math.max(0, progress)) * ARC_SEGMENTS.length;
  const [start, control, end] = ARC_SEGMENTS[Math.floor(scaled)];
  const t = scaled - Math.floor(scaled);
  const inv = 1 - t;
  return {
    x: inv * inv * start[0] + 2 * inv * t * control[0] + t * t * end[0],
    y: inv * inv * start[1] + 2 * inv * t * control[1] + t * t * end[1],
  };
}

function WaveStage({
  settings,
  progress,
  remaining,
  progressRef,
  onEnd,
  onSlip,
}: {
  settings: SosSettings;
  progress: number;
  remaining: number;
  progressRef: MutableRefObject<number>;
  onEnd: () => void;
  onSlip: () => void;
}) {
  const phase = SURF_PHASES.reduce((current, candidate) => (progress >= candidate.at ? candidate : current), SURF_PHASES[0]);
  const seconds = String(remaining % 60).padStart(2, '0');
  const marker = arcPoint(progress);

  return (
    <SosStage
      settings={settings}
      moon={{ top: 86, size: 280, alpha: 0.1 }}
      title="Ride it out."
      caption={remaining >= 60 ? `1:${seconds}` : `0:${seconds}`}
      hint={phase.name}
      stage={3}
      onEnd={onEnd}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 200, height: 260, opacity: 0.55 }}>
        <UrgeWave progressRef={progressRef} />
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 420, alignItems: 'center' }}>
        <Svg width={260} height={60} viewBox="0 0 260 60" fill="none">
          <Path d="M0 45 Q 32 10 65 38 T 130 30 T 195 22 T 260 12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={3} strokeLinecap="round" />
          <Circle cx={marker.x} cy={marker.y} r={6} fill="#FFFFFF" />
        </Svg>
      </View>
      {/* the one honest exit, in the band the canvas leaves empty above the pill */}
      <PressScale
        onPress={onSlip}
        accessibilityRole="button"
        hitSlop={{ top: 14, bottom: 14, left: 40, right: 40 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 636, minHeight: 0, alignItems: 'center' }}>
        <AppText style={[sans('500'), { fontSize: 15, color: 'rgba(244,243,240,0.55)' }]}>I slipped — log it</AppText>
      </PressScale>
    </SosStage>
  );
}

// ── 141 · SOS settings ──────────────────────────────────────────────────────

function SheetLabel({ text, top }: { text: string; top: number }) {
  return <AppText style={[sans('600'), { position: 'absolute', left: 24, top, fontSize: 12.5, color: 'rgba(244,243,240,0.45)' }]}>{text}</AppText>;
}

function SoundChip({ label, selected, onPress, icon }: { label: string; selected: boolean; onPress: () => void; icon?: ReactNode }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={{
        flex: 1,
        height: 40,
        minHeight: 0,
        borderRadius: 20,
        backgroundColor: selected ? 'rgba(244,243,240,0.92)' : 'rgba(244,243,240,0.08)',
        boxShadow: selected ? undefined : 'inset 0 0 0 1px rgba(244,243,240,0.14)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
      }}>
      {icon}
      <AppText style={[sans('600'), { fontSize: 13, color: selected ? SHEET_INK : 'rgba(244,243,240,0.6)' }]}>{label}</AppText>
    </PressScale>
  );
}

function BackgroundThumb({ kind, selected, onPress, width }: { kind: SosBackground; selected: boolean; onPress: () => void; width: number }) {
  const label = kind === 'night' ? 'Night sea' : kind === 'starfield' ? 'Starfield' : 'Dawn';
  return (
    // the `0 0 0 2px #F4F3F0` selection ring sits outside the box, so it has to live on a
    // node that does not clip; only the inner scene carries `overflow: hidden`.
    <PressScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={{
        flex: 1,
        height: 84,
        minHeight: 0,
        borderRadius: 12,
        opacity: selected ? 1 : 0.7,
        boxShadow: selected ? '0 0 0 2px #F4F3F0' : undefined,
      }}>
      <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
        {kind === 'night' ? (
          <>
            <LinearGradient colors={['#14171B', '#232B34']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            <Hill left={-0.2 * width} width={1.4 * width} top={50.4} height={67.2} ry={26.9} fill="#1C232B" />
            <View
              style={{ position: 'absolute', right: 12, top: 10, width: 14, height: 14, borderRadius: 7, backgroundColor: '#DDE4EC', boxShadow: '0 0 8px rgba(221,228,236,0.5)' }}
            />
          </>
        ) : null}
        {kind === 'starfield' ? (
          <>
            <LinearGradient colors={['#0E1116', '#1A2130']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            <View style={{ position: 'absolute', left: 14, top: 14, width: 2.5, height: 2.5, borderRadius: 1.5, backgroundColor: 'rgba(244,243,240,0.7)' }} />
            <View style={{ position: 'absolute', left: 44, top: 30, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.5)' }} />
            <View style={{ position: 'absolute', right: 20, top: 18, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.6)' }} />
            <View style={{ position: 'absolute', right: 36, top: 44, width: 2.5, height: 2.5, borderRadius: 1.5, backgroundColor: 'rgba(244,243,240,0.4)' }} />
          </>
        ) : null}
        {kind === 'dawn' ? (
          <>
            <LinearGradient colors={['#2A2E3C', '#6B5D6E', '#C89A7A']} locations={[0, 0.6, 1]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            <SoftBlob id="u90-thumb-dawn" left={width / 2 - 11} top={44} width={22} height={22} color="rgb(243,227,196)" alpha={0.9} stop={0.8} />
          </>
        ) : null}
        <AppText style={[sans('600'), { position: 'absolute', left: 8, bottom: 6, fontSize: 10, color: kind === 'starfield' ? 'rgba(244,243,240,0.7)' : 'rgba(244,243,240,0.85)' }]}>
          {label}
        </AppText>
        {/* the unselected hairline is an inset ring, which has to paint over the scene */}
        {selected ? null : (
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12, boxShadow: 'inset 0 0 0 1px rgba(244,243,240,0.14)' }} />
        )}
      </View>
    </PressScale>
  );
}

function SosSettingsSheet({ settings, onChange, onDone }: { settings: SosSettings; onChange: (next: SosSettings) => void; onDone: () => void }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const thumbWidth = (width - 48 - 20) / 3;
  const lit = SOS_LIGHTS.find((item) => item.key === settings.light);

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <StatusBar style="light" />
      <LinearGradient colors={['#14171B', '#191E25', '#202730']} locations={[0, 0.55, 1]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <View style={{ position: 'absolute', top: insets.top, left: 0, right: 0, bottom: 0 }}>
        <SoftBlob id="u90-set-wash" left={width / 2 - 100} top={76} width={200} height={200} color="rgb(216,225,235)" alpha={0.14} stop={0.8} />
        {/* the canvas always shows the orb above the sheet — before a light is picked it is
            the same paper-white ball the breathing stage draws, not an empty sky */}
        <View style={{ position: 'absolute', left: width / 2 - 60, top: 116, opacity: 0.5 }}>
          {lit ? <LightOrb id="u90-set-orb" size={120} stops={lit.stops} mid={46} /> : <PaperOrb id="u90-set-orb-paper" size={120} />}
        </View>
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,12,15,0.45)' }} />

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: insets.top + 264,
          bottom: 0,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          backgroundColor: '#1A1F26',
          boxShadow: '0 -12px 36px rgba(0,0,0,0.4)',
        }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 10, alignItems: 'center' }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(244,243,240,0.2)' }} />
        </View>

        <SheetLabel text="Sound" top={38} />
        <View style={{ position: 'absolute', left: 24, right: 24, top: 62, flexDirection: 'row', gap: 8 }}>
          <SoundChip
            label="Ocean"
            selected={settings.sound === 'ocean'}
            onPress={() => onChange({ ...settings, sound: 'ocean' })}
            icon={
              <Svg width={14} height={12} viewBox="0 0 16 14" fill="none">
                <Path d="M1.5 5v4h3l4 3.5v-11L4.5 5z" fill={settings.sound === 'ocean' ? SHEET_INK : 'rgba(244,243,240,0.6)'} />
                <Path d="M11.5 4.5c1.4 1.6 1.4 3.4 0 5" fill="none" stroke={settings.sound === 'ocean' ? SHEET_INK : 'rgba(244,243,240,0.6)'} strokeWidth={1.6} strokeLinecap="round" />
              </Svg>
            }
          />
          <SoundChip
            label="Rain"
            selected={settings.sound === 'rain'}
            onPress={() => onChange({ ...settings, sound: 'rain' })}
            icon={
              <Svg width={11} height={13} viewBox="0 0 20 22" fill="none">
                <Path
                  d="M10 2.5C10 2.5 4.5 9.5 4.5 13.5a5.5 5.5 0 0 0 11 0C15.5 9.5 10 2.5 10 2.5z"
                  fill="none"
                  stroke={settings.sound === 'rain' ? SHEET_INK : 'rgba(244,243,240,0.6)'}
                  strokeWidth={1.9}
                  strokeLinejoin="round"
                />
              </Svg>
            }
          />
          <SoundChip label="Silent" selected={settings.sound === 'silent'} onPress={() => onChange({ ...settings, sound: 'silent' })} />
        </View>

        <SheetLabel text="Orb light" top={130} />
        <View style={{ position: 'absolute', left: 24, right: 24, top: 156, flexDirection: 'row', gap: 16 }}>
          {SOS_LIGHTS.map((item) => {
            const on = settings.light === item.key;
            return (
              // the two selection rings sit outside the swatch, so they cannot share a node
              // with the clip; and the canvas's inset shading falls on the gradient, which is
              // an <Svg> child here rather than a background — so it has to be painted after it
              <PressScale
                key={item.key}
                onPress={() => onChange({ ...settings, light: item.key })}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${item.key} light`}
                style={{
                  width: 44,
                  height: 44,
                  minHeight: 0,
                  borderRadius: 22,
                  opacity: on ? 1 : 0.6,
                  boxShadow: on ? '0 0 0 2px #1A1F26, 0 0 0 4px #F4F3F0' : undefined,
                }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, overflow: 'hidden' }}>
                  <LightOrb id={`u90-swatch-${item.key}`} size={44} stops={item.stops} />
                  <View
                    pointerEvents="none"
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 22, boxShadow: 'inset 0 -8px 14px rgba(0,0,0,0.2)' }}
                  />
                </View>
              </PressScale>
            );
          })}
        </View>

        <SheetLabel text="Background" top={238} />
        <View style={{ position: 'absolute', left: 24, right: 24, top: 264, flexDirection: 'row', gap: 10 }}>
          {(['night', 'starfield', 'dawn'] as SosBackground[]).map((kind) => (
            <BackgroundThumb key={kind} kind={kind} selected={settings.background === kind} onPress={() => onChange({ ...settings, background: kind })} width={thumbWidth} />
          ))}
        </View>

        {/* canvas top 392 in a 534pt sheet */}
        <PressScale
          onPress={onDone}
          accessibilityRole="button"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 90,
            height: 52,
            borderRadius: 26,
            backgroundColor: SOS_PAPER,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText style={[sans('600'), { fontSize: 17, color: SHEET_INK }]}>Done</AppText>
        </PressScale>
      </View>
    </View>
  );
}

// ── 151 · Surf Complete ─────────────────────────────────────────────────────

/**
 * One shaft of grain hung from the top of the frame — the same three the slip's
 * `Begin again` field carries, at the same sizes and opacities. The canvas fades
 * each with `mask-image:linear-gradient(180deg,#000 30%,transparent)`; RN has no
 * CSS mask, so the falloff is an SVG luminance mask over the noise tile.
 */
function DawnShaft({ id, left, top, width, height, rotate, opacity }: { id: string; left: number; top: number; width: number; height: number; rotate: string; opacity: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left, top, width, height, transform: [{ rotate }], transformOrigin: 'top center' }}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgGrad id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset={0.3} stopColor="#FFFFFF" />
            <Stop offset={1} stopColor="#000000" />
          </SvgGrad>
          <Mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
            <Rect x={0} y={0} width={width} height={height} fill={`url(#${id}-fade)`} />
          </Mask>
        </Defs>
        <G mask={`url(#${id}-mask)`}>
          <SvgImage x={0} y={0} width={width} height={height} href={NOISE_DARK} preserveAspectRatio="xMidYMid slice" opacity={opacity} />
        </G>
      </Svg>
    </View>
  );
}

function DonePage({ count, onClose }: { count: number; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: '#F0EFEB' }}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <LinearGradient colors={['#F2E7D6', '#E6CFAC', '#FBFAF7', '#F0EFEB']} locations={[0, 0.39, 0.65, 0.82]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <DawnShaft id="u90-doneA" left={-30} top={-40} width={150} height={420} rotate="24deg" opacity={0.2} />
        <DawnShaft id="u90-doneB" left={130} top={-60} width={140} height={430} rotate="6deg" opacity={0.24} />
        <DawnShaft id="u90-doneC" left={290} top={-40} width={150} height={420} rotate="-14deg" opacity={0.2} />
        {/* Canvas clips this band at frame y 558; the sun is painted first and
            the halo over it. Every offset in this layer is frame-absolute, with
            no status-bar deduction: the layer's own origin is the frame's, which
            is why the shafts above carry their raw −40/−60/−40. Anchoring the
            sun to the inset instead put two coordinate systems in one layer and
            only agreed with the canvas when the inset was exactly 54, which no
            iPhone reports — the 393×852 device this frame models says 59. */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 558, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', left: 96, top: 425, width: 200, height: 200, borderRadius: 100, overflow: 'hidden' }}>
            <Svg width={200} height={200}>
              <Defs>
                {/* farthest-corner again: from (100,60) the far corner is 172.05 away = 86% of 200 */}
                <RadialGradient id="u90-done-sun" cx="50%" cy="30%" rx="86%" ry="86%">
                  <Stop offset={0} stopColor="#FBF3E4" />
                  <Stop offset={0.65} stopColor="#F0DDBC" />
                  <Stop offset={1} stopColor="#DFC79E" />
                </RadialGradient>
              </Defs>
              <Circle cx={100} cy={100} r={100} fill="url(#u90-done-sun)" />
            </Svg>
            <Grain source={NOISE_DARK} opacity={0.5} />
          </View>
          <SoftBlob id="u90-done-halo" left={56} top={385} width={280} height={280} color="rgb(250,238,214)" alpha={0.4} stop={0.72} />
        </View>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
          locations={[0, 0.5, 1]}
          style={{ position: 'absolute', left: 0, right: 0, top: 542, height: 32 }}
        />
        <Grain source={NOISE_DARK} opacity={0.1} />
      </View>

      <View style={{ position: 'absolute', top: insets.top, left: 0, right: 0, bottom: 0 }}>
        <AppText center style={[sans('500'), { position: 'absolute', left: 40, right: 40, top: 74, fontSize: 22, lineHeight: 32, color: SHEET_TEXT }]}>
          The wave passed.{'\n'}You outlasted it.
        </AppText>
        <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: 146, fontSize: 14, color: SHEET_MUTED }]}>
          Logged — rode it out · ×{count}
        </AppText>
        <PressScale
          onPress={onClose}
          accessibilityRole="button"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 48,
            height: 48,
            borderRadius: 25,
            backgroundColor: SHEET_INK,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText style={[sans('600'), { fontSize: 17.5, letterSpacing: 0.2, color: '#FFFFFF' }]}>Back to Today</AppText>
        </PressScale>
      </View>
    </View>
  );
}

// ── the flow ────────────────────────────────────────────────────────────────

type FlowStep =
  | 'intro'
  | 'strength'
  | 'where'
  | 'place-said'
  | 'stand'
  | 'leave'
  | 'phone'
  | 'reason'
  | 'trigger-said'
  | 'feeling'
  | 'feeling-said'
  | 'reassess'
  | 'afterward'
  | 'sos'
  | 'done';

/**
 * The interrupt, in the canvas's own index order: 96 → 97 → 98 → [117–123] →
 * 99 → 100 → 101 → 102 → [155–164] → 103 → [142–154, 104] → 105 → 106 → 107.
 *
 * Each picker is followed by the board the bundle draws for the answer it
 * returned — `DECISIONS.md` D037 — and the three moves keep the place the
 * canvas indexes them, between the location's answer and the trigger picker.
 * The moves were `screen | move | cold` before `UI Final 1` resequenced them;
 * those names described the old order and `cold` named a deleted board.
 */
const FLOW: FlowStep[] = [
  'intro',
  'strength',
  'where',
  'place-said',
  'stand',
  'leave',
  'phone',
  'reason',
  'trigger-said',
  'feeling',
  'feeling-said',
  'reassess',
  'afterward',
  'sos',
  'done',
];

/**
 * Which board answers which option, by the key the frames are named with.
 *
 * The pickers were not extended when the response branch was: the location
 * picker offers five options against seven boards, and each of the other two
 * offers nine against thirteen and ten. `SOS-Loc-Bathroom`, `SOS-Loc-Home-Alone`,
 * `SOS-Feel-Anxious`, `SOS-Feel-Numb`, `SOS-Feel-Ashamed`, `SOS-Feel-Rejected`
 * and `SOS-Trig-Rejection` have no card to reach them (`DECISIONS.md` D038).
 */
const PLACE_BOARD: Record<UrgePlace, string> = {
  private: 'SOS-Loc-Private-Room',
  bed: 'SOS-Loc-Bed',
  public: 'SOS-Loc-Public',
  work: 'SOS-Loc-Work',
  out: 'SOS-Loc-Elsewhere',
};

const TRIGGER_BOARD: Record<string, string> = {
  'Something online': 'SOS-Trig-Content',
  Doomscrolling: 'SOS-Trig-Doomscroll',
  'A stuck fantasy': 'SOS-Trig-Fantasy',
  'Phone in bed': 'SOS-Trig-Late-Phone',
  'Pure habit': 'SOS-Trig-Habit',
  'Can’t sleep': 'SOS-Trig-Cant-Sleep',
  'An argument': 'SOS-Trig-Argument',
  'Being alone': 'SOS-Trig-Alone',
  'I don’t know': 'SOS-Trig-Unknown',
};

const FEELING_BOARD: Record<string, string> = {
  'Turned on': 'SOS-Feel-Turned-On',
  Bored: 'SOS-Feel-Bored',
  Lonely: 'SOS-Feel-Lonely',
  'Stressed or anxious': 'SOS-Feel-Stressed',
  Angry: 'SOS-Feel-Angry',
  Low: 'SOS-Feel-Low',
  Tired: 'SOS-Feel-Tired',
  Restless: 'SOS-Feel-Restless',
  'I don’t know': 'SOS-Feel-Unknown',
};

/**
 * What "Give me another" rotates through: every board the feeling branch draws,
 * in the bundle's own order, including the four with no picker card and the
 * challenge board. The link's only possible meaning is "show me a different
 * suggestion", and this is the set of suggestions the bundle drew.
 */
const FEELING_ROTATION = [
  'SOS-Feel-Turned-On',
  'SOS-Feel-Bored',
  'SOS-Feel-Lonely',
  'SOS-Feel-Stressed',
  'SOS-Feel-Anxious',
  'SOS-Feel-Angry',
  'SOS-Feel-Low',
  'SOS-Feel-Rejected',
  'SOS-Feel-Tired',
  'SOS-Feel-Restless',
  'SOS-Feel-Numb',
  'SOS-Feel-Ashamed',
  'SOS-Feel-Unknown',
  'SOS-Challenge',
];
type SosStageName = 'breathe' | 'tap' | 'odd' | 'wave';
const SOS_ORDER: SosStageName[] = ['breathe', 'tap', 'odd', 'wave'];

/**
 * The First 90 Seconds, end to end. Behind `/urge` and `/rough-first90` both,
 * because the canvas draws one interrupt and the two doors lead to it.
 */
export function UrgeFlow() {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const events = useEvents();
  const [index, setIndex] = useState(0);
  const [band, setBand] = useState(3);
  const [place, setPlace] = useState<UrgePlace>('private');
  const [feeling, setFeeling] = useState<string | undefined>(undefined);
  const [trigger, setTrigger] = useState<string | undefined>(undefined);
  const [after, setAfter] = useState(1);
  const [note, setNote] = useState('');
  /** How many times "Give me another" has been pressed on the feeling board. */
  const [roll, setRoll] = useState(0);
  const [sosStage, setSosStage] = useState(0);
  const [settings, setSettings] = useState<SosSettings>(DEFAULT_SOS_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const logged = useRef(false);
  const step = FLOW[index];

  // The feeling branch's suggestion: the board for the answer, and then the
  // next one along each time "Give me another" is pressed.
  const feelingBoard = FEELING_BOARD[feeling ?? ''] ?? 'SOS-Feel-Unknown';
  const suggestion = FEELING_ROTATION[(FEELING_ROTATION.indexOf(feelingBoard) + roll) % FEELING_ROTATION.length];

  // One clock for the whole SOS: every stage runs under it and it finishes the
  // session on its own at zero, whichever stage is on screen.
  const [surfProgress, setSurfProgress] = useState(0);
  const [surfRemaining, setSurfRemaining] = useState(SURF_SECONDS);
  const surfProgressRef = useRef(0);
  const inSos = step === 'sos';

  useEffect(() => {
    void saveUrgeSession(newUrgeSession(bandToSeverity(band)));
    void getJSON<SosSettings>(SOS_SETTINGS_KEY).then((stored) => {
      if (stored) setSettings({ ...DEFAULT_SOS_SETTINGS, ...stored });
    });
    return () => {
      void clearUrgeSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inSos) return;
    const startedAt = Date.now() - surfProgressRef.current * SURF_SECONDS * 1000;
    const tick = () => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const next = Math.min(1, elapsed / SURF_SECONDS);
      surfProgressRef.current = next;
      setSurfProgress(next);
      setSurfRemaining(Math.max(0, Math.ceil(SURF_SECONDS - elapsed)));
    };
    tick();
    const clock = setInterval(tick, 250);
    return () => clearInterval(clock);
  }, [inSos]);

  const close = () => {
    void clearUrgeSession();
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/today');
  };
  const next = () => setIndex((current) => Math.min(FLOW.length - 1, current + 1));
  const back = () => setIndex((current) => Math.max(0, current - 1));

  function finish() {
    if (logged.current) return;
    logged.current = true;

    // Completion is a local interaction. Never make the relief screen wait for
    // a network mutation; the event can safely settle in the background.
    setIndex(FLOW.indexOf('done'));
    // The place, the feeling and what fed it go to `precedingState`, which the
    // schema already carries — not to the event's own `trigger`, which is the
    // trigger chart's vocabulary and must not be diluted with them.
    //
    // `UI Final 1` made the second picker single-select, so `reasons` carries
    // one; the field stays an array because that is what the schema and every
    // reader of it expect.
    void createEvent({
      type: 'urge_rode_out',
      severity: bandToSeverity(band),
      // `105` asks a second time, once the interrupt is behind you.
      severityAfter: bandToSeverity(after),
      note: note.trim() || undefined,
      precedingState: {
        location: PLACES.find((item) => item.key === place)?.label,
        feeling,
        reasons: trigger ? [trigger] : undefined,
      },
    }).catch(() => {});
    void setJSON('tideline.post.backondeck.pending', Date.now());
  }

  function logSlip() {
    void clearUrgeSession();
    // Replace instead of push so the surf clock and the ocean are unmounted
    // rather than left running beneath the slip flow.
    router.replace('/relapse');
  }

  function saveSettings(nextSettings: SosSettings) {
    setSettings(nextSettings);
    void setJSON(SOS_SETTINGS_KEY, nextSettings);
  }

  const advance = () => setSosStage((current) => Math.min(SOS_ORDER.length - 1, current + 1));

  // The wave outlasts itself: at zero the session closes on the relief screen.
  useEffect(() => {
    if (inSos && surfRemaining === 0) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inSos, surfRemaining]);

  const rodeOut = (events ?? []).filter((event) => event.type === 'urge_rode_out').length;
  const stage = SOS_ORDER[sosStage];

  return (
    <View style={{ flex: 1, backgroundColor: inSos ? '#0F0F0E' : SHEET_PAPER }}>
      {step === 'intro' ? <IntroPage onClose={close} onNext={next} /> : null}
      {step === 'strength' ? <StrengthPage band={band} onBand={setBand} onClose={close} onNext={next} /> : null}
      {step === 'where' ? <WherePage place={place} onPlace={setPlace} onBack={back} onNext={next} /> : null}
      {step === 'feeling' ? <FeelingPage feeling={feeling} onFeeling={setFeeling} onBack={back} onNext={next} /> : null}
      {step === 'reason' ? (
        <ReasonPage trigger={trigger} onTrigger={setTrigger} onBack={back} onNext={next} />
      ) : null}
      {/* the art moved with the copy: the bed and lit doorway is the first
          board now, the lamp and table the third */}
      {step === 'stand' ? <MovePage index={0} art={<MoveStepArt />} onClose={close} onNext={next} /> : null}
      {step === 'leave' ? <MovePage index={1} art={<LeaveStepArt />} onClose={close} onNext={next} /> : null}
      {step === 'phone' ? <MovePage index={2} art={<ScreenStepArt />} onClose={close} onNext={next} /> : null}
      {step === 'place-said' ? <ResponsePage answer={PLACE_BOARD[place]} onClose={close} onNext={next} /> : null}
      {step === 'trigger-said' ? <ResponsePage answer={TRIGGER_BOARD[trigger ?? ''] ?? 'SOS-Trig-Unknown'} onClose={close} onNext={next} /> : null}
      {step === 'feeling-said' ? (
        <ResponsePage
          answer={suggestion}
          onClose={close}
          onNext={next}
          onAnother={() => setRoll((current) => current + 1)}
        />
      ) : null}
      {step === 'reassess' ? <ReassessPage band={after} onBand={setAfter} onClose={close} onNext={next} /> : null}
      {step === 'afterward' ? <AfterwardPage note={note} onNote={setNote} onClose={close} onNext={next} /> : null}
      {inSos && stage === 'breathe' ? <BreatheStage settings={settings} onSettings={() => setSettingsOpen(true)} onEnd={finish} onDone={advance} /> : null}
      {inSos && stage === 'tap' ? <TapStage settings={settings} onEnd={finish} onDone={advance} /> : null}
      {inSos && stage === 'odd' ? <OddStage settings={settings} onEnd={finish} onDone={advance} /> : null}
      {inSos && stage === 'wave' ? (
        <WaveStage settings={settings} progress={surfProgress} remaining={surfRemaining} progressRef={surfProgressRef} onEnd={finish} onSlip={logSlip} />
      ) : null}
      {inSos && settingsOpen ? <SosSettingsSheet settings={settings} onChange={saveSettings} onDone={() => setSettingsOpen(false)} /> : null}
      {step === 'done' ? <DonePage count={Math.max(1, rodeOut)} onClose={close} /> : null}
    </View>
  );
}
