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

import { type MutableRefObject, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText } from '@/components/ui';
import type { Tint } from '@/lib/oklch';
import { colors, fonts } from '@/lib/theme';

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
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: amount, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale, amount]);
  return <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>;
}

// ── urge-fade: 0.6s opacity + slide-up, runs on mount (key it to re-run) ─────
export function FadeIn({ children, style }: { children: ReactNode; style?: object }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [t]);
  return (
    <Animated.View style={[{ opacity: t, transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }, style]}>
      {children}
    </Animated.View>
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
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 26, paddingTop: 8, zIndex: 3 }}>
      <Pressable onPress={onBack} hitSlop={10} accessibilityLabel={back === 'close' ? 'Close' : 'Back'} style={{ padding: 4, marginLeft: -4 }}>
        <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
          {back === 'close' ? (
            <Path d="M6 6l12 12M18 6L6 18" stroke={TEXT} strokeWidth={2.2} strokeLinecap="round" />
          ) : (
            <Path d="M15 5l-7 7 7 7" stroke={TEXT} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          )}
        </Svg>
      </Pressable>
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
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: '100%',
          backgroundColor: colors.ink,
          borderRadius: 9999,
          paddingVertical: 19,
          alignItems: 'center',
          transform: [{ scale: pressed ? 0.975 : 1 }],
        },
        style as object,
      ]}>
      <AppText weightOverride="600" color={colors.inkText} style={{ fontSize: 16.5, letterSpacing: 0.17 }}>
        {label}
      </AppText>
    </Pressable>
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
        <View style={{ paddingHorizontal: 30, paddingBottom: 18 }}>
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
// breathing paper-white dot riding the wave's edge at centre. Reads session
// progress from a ref so swell = sin(progress·π): rises to a peak, recedes.
const STEPS = 42;
const BREATH_SECONDS = 10;
const INHALE = 0.4;

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

export function UrgeWave({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [, setFrame] = useState(0);
  const tRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    let mounted = true;
    const loop = (now: number) => {
      if (!mounted) return;
      if (startRef.current == null) startRef.current = now;
      tRef.current = (now - startRef.current) / 1000;
      if (now - lastRef.current > 33) {
        lastRef.current = now;
        setFrame((f) => (f + 1) % 1000000);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const { w: CW, h: CH } = size;
  const t = tRef.current;

  let content: ReactNode = null;
  if (CW > 0 && CH > 0) {
    const p = clamp01(progressRef.current);
    const lift = smoothstep(Math.sin(p * Math.PI));
    const bp = (t % BREATH_SECONDS) / BREATH_SECONDS;
    const breath = bp < INHALE ? smoothstep(bp / INHALE) : 1 - smoothstep((bp - INHALE) / (1 - INHALE));

    const lvl = 0.5 - lift * 0.07;
    const baseAmp = 13 + lift * 5;
    const frontY = CH * lvl - breath * 11;

    const back = buildSurface(frontY + CH * 0.045, baseAmp * 0.6, 0.9, 0.085, 0.6, t, CW);
    const mid = buildSurface(frontY + CH * 0.02, baseAmp * 0.8, 1.2, 0.13, 2.4, t, CW);
    const FF = 1.0,
      FS = 0.18,
      FP = 4.2;
    const front = buildSurface(frontY, baseAmp, FF, FS, FP, t, CW);

    const dotX = CW / 2;
    const dotY = frontY + Math.sin(0.5 * TAU * FF - t * FS + FP) * baseAmp + Math.sin(0.5 * TAU * FF * 0.5 - t * FS * 0.6 + FP * 1.3) * baseAmp * 0.3;
    const dotR = 5.5 + breath * 3;
    const glowR = 15 + breath * 16;

    content = (
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
            <Stop offset="0%" stopColor="rgb(245,244,241)" stopOpacity={0.3 + breath * 0.3} />
            <Stop offset="100%" stopColor="rgb(245,244,241)" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Path d={pointsToFill(back, CW, CH)} fill={`url(#back-${uid})`} />
        <Path d={pointsToFill(mid, CW, CH)} fill={`url(#mid-${uid})`} />
        <Path d={pointsToFill(front, CW, CH)} fill={`url(#front-${uid})`} />

        {/* crisp crest line + a fine highlight just above it */}
        <Path d={pointsToStroke(front)} fill="none" stroke="rgba(245,244,241,0.9)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <Path d={pointsToStroke(front, -1.4)} fill="none" stroke="rgba(245,244,241,0.3)" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />

        {/* breathing guide dot riding the edge */}
        <Circle cx={dotX} cy={dotY} r={glowR} fill={`url(#dot-${uid})`} />
        <Circle cx={dotX} cy={dotY} r={dotR} fill="rgba(255,255,255,0.98)" />
        <Circle cx={dotX} cy={dotY} r={dotR} fill="none" stroke="rgba(19,19,19,0.55)" strokeWidth={1.4} />
      </Svg>
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
