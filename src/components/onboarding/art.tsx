/**
 * Onboarding funnel — visual + animation primitives (a 1:1 RN port of the
 * design bundle's `screens-onb-art.jsx`). Calm-monochrome base with a subtle
 * low-chroma "atmosphere" layer (Aura + dot field) whose hue shifts through the
 * funnel, refined animated illustrations, and finer data-viz. oklch tints are
 * converted to rgba via `wa()` since RN native can't parse oklch.
 */

import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode, useEffect, useId, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, G, Line, Path, RadialGradient, Rect, Stop, Text as SvgText, LinearGradient as SvgGrad } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { wa } from '@/lib/oklch';
import { colors, radius } from '@/lib/theme';

// ── theme tokens (dark field) ────────────────────────────────────────────────
export const INK = colors.text;
export const INK2 = colors.textMuted;
export const INK3 = colors.textSoft;
export const CARD = colors.surface;
export const LINE = colors.border;
export const SOFT = 'rgba(0,0,0,0.045)';
export const SOFT2 = colors.borderStrong;
export const FILL = colors.accent;
export const ON_FILL = colors.accentText;
export const BG = colors.bg;
export const ACCENT = colors.ink; // no hue accents — the ink IS the accent

/** low-chroma tinted colour from a hue (matches the design's `tint`). */
// chroma pinned near zero: the funnel's per-step "hues" resolve to the neutral ink scale
export const tint = (hue: number, l = 0.66, _c = 0.085, a = 1) => wa(hue, 1 - l * 0.72, 0.008, a);

// ── animation helpers ─────────────────────────────────────────────────────────
/** onb-rise: fade + slide-up on mount. */
export function FadeRise({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: object }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 600, delay, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [t, delay]);
  return (
    <Animated.View style={[{ opacity: t, transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }, style]}>
      {children}
    </Animated.View>
  );
}

/** a looping float (translateY) — onb-bob / onb-bob2. */
export function Bob({ children, amount = 3, duration = 6000, style }: { children: ReactNode; amount?: number; duration?: number; style?: object }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: duration / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: duration / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t, duration]);
  return <Animated.View style={[{ transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -amount] }) }] }, style]}>{children}</Animated.View>;
}

/** a gentle breathing scale — used to bring SVG scenes to life. */
export function Breath({ children, to = 1.04, duration = 7000, style }: { children: ReactNode; to?: number; duration?: number; style?: object }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: duration / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: duration / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t, duration]);
  return <Animated.View style={[{ transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, to] }) }] }, style]}>{children}</Animated.View>;
}

function Spin({ children, duration = 14000, style }: { children: ReactNode; duration?: number; style?: object }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(t, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [t, duration]);
  return <Animated.View style={[{ transform: [{ rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }, style]}>{children}</Animated.View>;
}

// ── ambient atmosphere: drifting colour washes + sparse dot field ────────────
const DOTS = [
  [12, 22, 1.4], [28, 64, 1], [41, 14, 1.2], [55, 48, 1], [68, 80, 1.5], [82, 30, 1.1],
  [90, 66, 1.3], [18, 86, 1], [36, 38, 1.1], [62, 18, 1.2], [74, 54, 1], [8, 50, 1.2],
  [48, 90, 1.1], [86, 12, 1], [22, 6, 1.1], [58, 70, 1.3], [94, 44, 1], [33, 76, 1.2],
] as const;

function DriftBlob({ hue, l, c, a, cx, position }: { hue: number; l: number; c: number; a: number; cx: string; position: object }) {
  const gid = `blob-${useId().replace(/:/g, '')}`;
  const t = useRef(new Animated.Value(0)).current;
  const dur = 22000 + (hue % 7) * 1000;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: dur, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: dur, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t, dur]);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) }, { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }) }, { scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }] },
        position,
      ]}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id={gid} cx={cx} cy="38%" rx="62%" ry="62%">
            <Stop offset="0%" stopColor={tint(hue, l, c)} stopOpacity={a} />
            <Stop offset="64%" stopColor={tint(hue, l, c)} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${gid})`} />
      </Svg>
    </Animated.View>
  );
}

function DotField({ hue }: { hue: number }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t]);
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.85] }) }]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {DOTS.map(([x, y, r], k) => (
          <Circle key={k} cx={x} cy={y} r={r * 0.22} fill={tint(hue, 0.6, 0.06)} />
        ))}
      </Svg>
    </Animated.View>
  );
}

export function Aura({ hue = 210, intensity = 1, dots = true }: { hue?: number; intensity?: number; dots?: boolean }) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <DriftBlob hue={hue} l={0.72} c={0.1} a={0.16 * intensity} cx="35%" position={{ top: '-22%', left: '-18%', width: '92%', height: '70%' }} />
      <DriftBlob hue={hue + 34} l={0.68} c={0.09} a={0.13 * intensity} cx="60%" position={{ bottom: '-26%', right: '-22%', width: '96%', height: '76%' }} />
      {dots ? <DotField hue={hue} /> : null}
    </View>
  );
}

// ── immersive full-bleed shell with atmosphere ───────────────────────────────
export function Stage({ hue = 210, intensity = 1, dots = true, pad = 26, top = 56, children }: { hue?: number; intensity?: number; dots?: boolean; pad?: number; top?: number; children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <Aura hue={hue} intensity={intensity} dots={dots} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, paddingHorizontal: pad, paddingTop: Math.max(6, top - 44), paddingBottom: 34 }}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

// ── top progress: back · continuous global fill · close, with a small phase
// label + step counter so the whole funnel reads as one journey ──────────────
export function OnbBar({ i = 1, n = 12, phase, hue = 210, onBack, onClose }: { i?: number; n?: number; phase?: string; hue?: number; onBack?: () => void; onClose?: () => void }) {
  const pct = Math.max(0, Math.min(1, i / n));
  return (
    <View style={{ marginBottom: 22 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Pressable onPress={onBack} disabled={!onBack} hitSlop={8} style={{ padding: 4, marginLeft: -4, opacity: onBack ? 1 : 0.25 }}>
          <Svg width={13} height={22} viewBox="0 0 13 22">
            <Path d="M11 2L2 11l9 9" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
        <View style={{ flex: 1, height: 4, borderRadius: 9999, backgroundColor: SOFT2, overflow: 'hidden' }}>
          <View style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 9999, overflow: 'hidden' }}>
            <LinearGradient colors={[tint(hue, 0.6, 0.11), INK]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
          </View>
        </View>
        <Pressable onPress={onClose} hitSlop={8} style={{ padding: 4 }}>
          <Svg width={18} height={18} viewBox="0 0 20 20">
            <Path d="M3 3l14 14M17 3L3 17" stroke={INK3} strokeWidth={2.4} strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>
      {phase ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 9, paddingHorizontal: 31 }}>
          <AppText weightOverride="600" color={tint(hue, 0.62, 0.11)} style={{ fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase' }}>
            {phase}
          </AppText>
          <AppText weightOverride="600" color={INK3} style={{ fontSize: 11.5, letterSpacing: 0.2 }}>
            {i} of {n}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

// ── visualization mount — the illustration floats directly on the Stage
// atmosphere (no framed card), with a soft aura giving it focal presence ─────
export function HeroCard({ hue = 208, h = 248, children }: { hue?: number; h?: number; children: ReactNode }) {
  const gid = `hc-${useId().replace(/:/g, '')}`;
  return (
    <View style={{ width: '100%', height: h, alignItems: 'center', justifyContent: 'center' }}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <Svg width="86%" height="86%">
          <Defs>
            <RadialGradient id={gid} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={tint(hue, 0.8, 0.1)} stopOpacity={0.16} />
              <Stop offset="70%" stopColor={tint(hue, 0.8, 0.1)} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#${gid})`} />
        </Svg>
      </View>
      {children}
    </View>
  );
}

// ── selection pop: a quick 1 → 1.035 → 1 scale when an option turns on ───────
export function SelectPop({ on, children }: { on: boolean; children: ReactNode }) {
  const scale = useRef(new Animated.Value(1)).current;
  const wasOn = useRef(on);
  useEffect(() => {
    if (on && !wasOn.current) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.035, duration: 120, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]).start();
    }
    wasOn.current = on;
  }, [on, scale]);
  return <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>;
}

// ── celebration layer: calm = nothing; medium = slow low-chroma motes
// drifting up; full = livelier confetti fall ─────────────────────────────────
const CELEB_HUES = [208, 150, 40, 280, 188];
function seeded(n: number) {
  let s = n * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Mote({ x, y, size, dur, delay, col, full, round }: { x: number; y: number; size: number; dur: number; delay: number; col: string; full: boolean; round: boolean }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(t, { toValue: 1, duration: dur, easing: Easing.linear, useNativeDriver: true }));
    const id = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(id);
      loop.stop();
    };
  }, [t, dur, delay]);
  const style = full
    ? {
        opacity: t.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 1, 0] }),
        transform: [
          { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [-30, 580] }) },
          { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '620deg'] }) },
        ],
      }
    : {
        opacity: t.interpolate({ inputRange: [0, 0.16, 0.82, 1], outputRange: [0, 0.55, 0.4, 0] }),
        transform: [
          { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [26, -138] }) },
          { scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
        ],
      };
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', left: `${x}%`, top: full ? 0 : `${y}%`, width: size, height: full && !round ? size * 1.8 : size, borderRadius: round ? 9999 : 2, backgroundColor: col },
        style,
      ]}
    />
  );
}

export function Particles({ mode = 'medium' }: { mode?: 'calm' | 'medium' | 'full' }) {
  if (mode === 'calm') return null;
  const full = mode === 'full';
  const count = full ? 40 : 18;
  const rnd = seeded(full ? 7 : 3);
  const bits = Array.from({ length: count }).map((_, k) => {
    const x = rnd() * 100;
    const size = full ? 5 + rnd() * 6 : 3 + rnd() * 3.4;
    const dur = (full ? 2.6 + rnd() * 2.4 : 6.5 + rnd() * 5.5) * 1000;
    const delay = rnd() * dur;
    const hue = CELEB_HUES[k % CELEB_HUES.length];
    const round = full ? rnd() > 0.5 : true;
    return { k, x, y: 22 + rnd() * 66, size, dur, delay, col: tint(hue, full ? 0.66 : 0.7, full ? 0.14 : 0.085), full, round };
  });
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden', zIndex: 2 }]}>
      {bits.map(({ k, ...b }) => (
        <Mote key={k} {...b} />
      ))}
    </View>
  );
}

// ── quiet milestone seal: a stamped dark disc + check, soft tinted halo,
// small caption. Stamps in on mount. ─────────────────────────────────────────
export function SealBadge({ label, hue = 168, size = 72 }: { label?: string; hue?: number; size?: number }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 500, easing: Easing.bezier(0.2, 1.3, 0.4, 1), useNativeDriver: true }).start();
  }, [t]);
  return (
    <Animated.View
      style={{
        alignItems: 'center',
        gap: 12,
        opacity: t,
        transform: [{ scale: t.interpolate({ inputRange: [0, 0.58, 1], outputRange: [1.7, 0.93, 1] }) }],
      }}>
      <View style={{ width: size, height: size }}>
        <View style={{ position: 'absolute', top: -11, left: -11, right: -11, bottom: -11, borderRadius: 9999, backgroundColor: tint(hue, 0.72, 0.1, 0.22) }} />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 9999, backgroundColor: FILL, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 11, shadowOffset: { width: 0, height: 8 } }}>
          <Svg width={size * 0.44} height={size * 0.44} viewBox="0 0 24 24" fill="none">
            <Path d="M4 12l5 5L20 6" stroke={ON_FILL} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      </View>
      {label ? (
        <AppText weightOverride="600" color={tint(hue, 0.6, 0.11)} style={{ fontSize: 11.5, letterSpacing: 1.1, textTransform: 'uppercase' }}>
          {label}
        </AppText>
      ) : null}
    </Animated.View>
  );
}

// ── one-shot bloom: an expanding, fading tinted disc (celebration accent) ────
export function Bloom({ hue = 168, size = 130 }: { hue?: number; size?: number }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 1500, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [t]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: tint(hue, 0.7, 0.1, 0.3),
        opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
        transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.35, 2.7] }) }],
      }}
    />
  );
}

// ── pager dots ───────────────────────────────────────────────────────────────
export function PagerDots({ n = 3, i = 0, hue = 200 }: { n?: number; i?: number; hue?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: n }).map((_, k) => (
        <View key={k} style={{ height: 7, borderRadius: 9999, width: k === i ? 22 : 7, backgroundColor: k === i ? tint(hue, 0.62, 0.12) : SOFT2 }} />
      ))}
    </View>
  );
}

// ── primary full-width pill ──────────────────────────────────────────────────
export function NextPill({ label = 'Continue', enabled = true, arrow = true, dark = true, onPress }: { label?: string; enabled?: boolean; arrow?: boolean; dark?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={enabled ? onPress : undefined}
      disabled={!enabled}
      style={{
        width: '100%',
        backgroundColor: dark ? FILL : CARD,
        borderWidth: dark ? 0 : 1.5,
        borderColor: LINE,
        borderRadius: 9999,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        opacity: enabled ? 1 : 0.32,
      }}>
      <AppText weightOverride="500" color={dark ? ON_FILL : INK} style={{ fontSize: 16.5, letterSpacing: -0.1 }}>
        {label}
      </AppText>
      {arrow ? (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12h13M13 6l6 6-6 6" stroke={dark ? ON_FILL : INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ) : null}
    </Pressable>
  );
}

export function GhostButton({ children, size = 15, onPress }: { children: ReactNode; size?: number; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={{ paddingVertical: 8, paddingHorizontal: 4 }}>
      <AppText weightOverride="600" color={INK2} style={{ fontSize: size, letterSpacing: -0.1 }}>
        {children}
      </AppText>
    </Pressable>
  );
}

export function OnbCard({ children, pad = 18, style }: { children: ReactNode; pad?: number; style?: object }) {
  return <View style={[{ backgroundColor: CARD, borderRadius: radius.lg, padding: pad }, style]}>{children}</View>;
}

// ── "as featured in" credibility row ─────────────────────────────────────────
export function PressRow({ label = 'As featured in' }: { label?: string }) {
  const names: [string, object][] = [
    ['Forbes', { fontFamily: 'Georgia', fontWeight: '600', fontSize: 19 }],
    ['WIRED', { fontWeight: '900', fontSize: 16, letterSpacing: 1 }],
    ['The Atlantic', { fontFamily: 'Georgia', fontWeight: '600', fontSize: 16, fontStyle: 'italic' }],
    ['TechTimes', { fontWeight: '600', fontSize: 15.5 }],
  ];
  return (
    <View style={{ alignItems: 'center' }}>
      <AppText weightOverride="600" style={{ fontSize: 11.5, letterSpacing: 1.8, textTransform: 'uppercase', color: INK3, marginBottom: 14 }}>
        {label}
      </AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: 22, rowGap: 12, opacity: 0.6 }}>
        {names.map(([n, st]) => (
          <AppText key={n} color={INK} style={st}>
            {n}
          </AppText>
        ))}
      </View>
    </View>
  );
}

// ── the signature tideline scene: glowing sun over layered tides ─────────────
function wavePath(baseY: number, amp: number) {
  let d = `M-20 ${baseY}`;
  const seg = 72;
  for (let i = 0; i < 5; i++) {
    const x0 = -20 + i * seg;
    const x1 = x0 + seg;
    const dir = i % 2 === 0 ? -1 : 1;
    d += ` C ${x0 + seg * 0.33} ${baseY + dir * amp}, ${x0 + seg * 0.66} ${baseY + dir * amp}, ${x1} ${baseY}`;
  }
  return d;
}

export function TideScene({ hue = 208, w = 250, h = 158 }: { hue?: number; w?: number; h?: number }) {
  const uid = useId().replace(/:/g, '');
  return (
    <Breath to={1.03} duration={7000}>
      <Svg width={w} height={h} viewBox="0 0 250 158" fill="none">
        <Defs>
          <RadialGradient id={`ts-sun-${uid}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={tint(hue, 0.82, 0.11)} stopOpacity={0.95} />
            <Stop offset="60%" stopColor={tint(hue, 0.7, 0.1)} stopOpacity={0.55} />
            <Stop offset="100%" stopColor={tint(hue, 0.7, 0.1)} stopOpacity={0} />
          </RadialGradient>
          <SvgGrad id={`ts-w-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={INK} />
            <Stop offset="0.5" stopColor={tint(hue, 0.55, 0.1)} />
            <Stop offset="1" stopColor={INK} />
          </SvgGrad>
        </Defs>
        <Circle cx={125} cy={60} r={58} fill={`url(#ts-sun-${uid})`} />
        <Circle cx={125} cy={60} r={25} fill={tint(hue, 0.62, 0.11, 0.92)} />
        <Path d={wavePath(102, 9)} stroke={`url(#ts-w-${uid})`} strokeWidth={3.4} strokeLinecap="round" fill="none" />
        <Path d={wavePath(120, 8)} stroke={tint(hue, 0.5, 0.08)} strokeWidth={3} strokeLinecap="round" opacity={0.6} fill="none" />
        <Path d={wavePath(138, 7)} stroke={INK} strokeWidth={2.6} strokeLinecap="round" opacity={0.22} fill="none" />
      </Svg>
    </Breath>
  );
}

// ── calm abstract slide illustrations ────────────────────────────────────────
export const SlideArt: Record<string, (hue?: number) => ReactNode> = {
  wave: (hue = 18) => {
    const uid = useId().replace(/:/g, '');
    return (
      <Svg width={232} height={172} viewBox="0 0 232 172" fill="none">
        <Defs>
          <RadialGradient id={`sa-g-${uid}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={tint(hue, 0.72, 0.11)} stopOpacity={0.5} />
            <Stop offset="100%" stopColor={tint(hue, 0.72, 0.11)} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={92} cy={92} r={46} fill={`url(#sa-g-${uid})`} />
        <Path d="M6 118C36 78 60 70 92 96c26 21 40 34 66 18 18-11 34-30 52-30" stroke={INK} strokeWidth={3.4} fill="none" strokeLinecap="round" />
        <Path d="M6 134C40 100 64 96 96 118c26 18 44 24 70 10" stroke={tint(hue, 0.55, 0.09)} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} />
        <Path d="M6 150c34-26 64-26 96-6 28 17 48 18 72 4" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.2} />
        <Circle cx={92} cy={92} r={9} fill={INK} />
        <Circle cx={92} cy={92} r={15} fill="none" stroke={tint(hue, 0.6, 0.1)} strokeWidth={2} opacity={0.6} />
      </Svg>
    );
  },
  rewire: (hue = 175) => {
    const uid = useId().replace(/:/g, '');
    return (
      <Svg width={232} height={172} viewBox="0 0 232 172" fill="none">
        <Defs>
          <SvgGrad id={`sa-l-${uid}`} x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0" stopColor={INK} />
            <Stop offset="1" stopColor={tint(hue, 0.55, 0.11)} />
          </SvgGrad>
          <RadialGradient id={`sa-rg-${uid}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={tint(hue, 0.72, 0.11)} stopOpacity={0.55} />
            <Stop offset="100%" stopColor={tint(hue, 0.72, 0.11)} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={188} cy={40} r={40} fill={`url(#sa-rg-${uid})`} />
        <Path d="M26 120c14-6 10-26 24-30s16 18 30 12 8-30 24-32" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.26} strokeDasharray="2 7" />
        <Path d="M24 132c40-6 70-20 92-44 16-17 28-34 46-44" stroke={`url(#sa-l-${uid})`} strokeWidth={3.6} fill="none" strokeLinecap="round" />
        {([[24, 132, 0], [70, 120, 1], [116, 96, 2], [150, 66, 3], [188, 40, 4]] as const).map(([x, y, k]) => (
          <Circle key={k} cx={x} cy={y} r={k === 4 ? 8.5 : 5} fill={k === 4 ? tint(hue, 0.58, 0.12) : INK} opacity={k === 4 ? 1 : 0.35 + k * 0.14} />
        ))}
      </Svg>
    );
  },
  steps: (hue = 150) => {
    const uid = useId().replace(/:/g, '');
    const pts = [[24, 142], [60, 128], [96, 110], [132, 86], [168, 58]] as const;
    return (
      <Svg width={232} height={172} viewBox="0 0 232 172" fill="none">
        <Defs>
          <RadialGradient id={`sa-s-${uid}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={tint(hue, 0.72, 0.11)} stopOpacity={0.55} />
            <Stop offset="100%" stopColor={tint(hue, 0.72, 0.11)} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={190} cy={46} r={40} fill={`url(#sa-s-${uid})`} />
        <Circle cx={190} cy={46} r={17} fill={tint(hue, 0.62, 0.11, 0.85)} />
        {pts.map(([x, y], k) => (
          <G key={k}>
            {k > 0 ? <Line x1={pts[k - 1][0]} y1={pts[k - 1][1]} x2={x} y2={y} stroke={tint(hue, 0.55, 0.08)} strokeWidth={2.4} opacity={0.5} /> : null}
            <Circle cx={x} cy={y} r={k === 4 ? 8 : 5.5} fill={k === 4 ? tint(hue, 0.55, 0.12) : INK} opacity={k === 4 ? 1 : 0.4 + k * 0.13} />
          </G>
        ))}
        <Path d="M168 58V36" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
        <Path d="M168 37l16 5-16 5z" fill={tint(hue, 0.55, 0.12)} />
      </Svg>
    );
  },
  anchor: (hue = 230) => {
    const uid = useId().replace(/:/g, '');
    return (
      <Svg width={200} height={172} viewBox="0 0 200 172" fill="none">
        <Defs>
          <RadialGradient id={`sa-a-${uid}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={tint(hue, 0.72, 0.1)} stopOpacity={0.5} />
            <Stop offset="100%" stopColor={tint(hue, 0.72, 0.1)} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={100} cy={86} r={70} fill={`url(#sa-a-${uid})`} />
        {[64, 48, 32].map((r, k) => (
          <Circle key={k} cx={100} cy={86} r={r} fill="none" stroke={k === 1 ? tint(hue, 0.55, 0.1) : INK} strokeWidth={2.4} opacity={k === 1 ? 0.7 : 0.16 + k * 0.16} />
        ))}
        <Circle cx={100} cy={86} r={13} fill={INK} />
      </Svg>
    );
  },
};

// ── quiz option row (single or multi select) ─────────────────────────────────
export function OptionRow({ label, sub, icon, selected, single = false, hue = 210, onPress }: { label: string; sub?: string | null; icon?: ReactNode; selected?: boolean; single?: boolean; hue?: number; onPress?: () => void }) {
  return (
    <SelectPop on={!!selected}>
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 18,
        backgroundColor: selected ? tint(hue, 0.68, 0.07, 0.16) : CARD,
        borderWidth: selected ? 1.8 : 1.5,
        borderColor: selected ? tint(hue, 0.55, 0.1) : LINE,
      }}>
      {icon ? <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>{icon}</View> : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText weightOverride={selected ? '700' : '600'} color={INK} style={{ fontSize: 16.5, letterSpacing: -0.15 }}>
          {label}
        </AppText>
        {sub ? (
          <AppText weightOverride="500" color={INK2} style={{ fontSize: 13.5, marginTop: 2 }}>
            {sub}
          </AppText>
        ) : null}
      </View>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: single ? 9999 : 8,
          borderWidth: selected ? 0 : 2,
          borderColor: SOFT2,
          backgroundColor: selected ? tint(hue, 0.5, 0.12) : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {selected ? (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M4 12l5 5L20 6" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : null}
      </View>
    </Pressable>
    </SelectPop>
  );
}

// ── tinted icon chip (notify list) ───────────────────────────────────────────
export function TintChip({ hue, icon, size = 40, rad = 13 }: { hue: number; icon: ReactNode; size?: number; rad?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: rad, backgroundColor: tint(hue, 0.6, 0.1, 0.16), alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </View>
  );
}

// ── projection chart ─────────────────────────────────────────────────────────
export function ProjectionChart() {
  const uid = useId().replace(/:/g, '');
  const W = 320, H = 200, x0 = 8, x1 = 312, yTop = 14, yBot = 150;
  const up = `M${x0} 138 C 70 132, 96 96, 150 74 S 252 30, ${x1} 22`;
  const upArea = `${up} L ${x1} ${yBot} L ${x0} ${yBot} Z`;
  const flat = `M${x0} 138 C 80 140, 150 138, 220 142 S 300 150, ${x1} 150`;
  const dots: [number, number, string][] = [[124, 84, 'Day 7'], [222, 46, 'Day 30'], [x1, 22, 'Day 90']];

  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <Defs>
        <SvgGrad id={`pj-line-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={tint(150, 0.6, 0.11)} />
          <Stop offset="1" stopColor={ACCENT} />
        </SvgGrad>
        <SvgGrad id={`pj-area-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={ACCENT} stopOpacity={0.3} />
          <Stop offset="1" stopColor={ACCENT} stopOpacity={0} />
        </SvgGrad>
      </Defs>
      {[0, 1, 2, 3].map((k) => (
        <Line key={k} x1={x0} y1={yTop + (yBot - yTop) * (k / 3)} x2={x1} y2={yTop + (yBot - yTop) * (k / 3)} stroke={INK} strokeOpacity={0.06} strokeWidth={1} strokeDasharray="1 6" />
      ))}
      <Path d={upArea} fill={`url(#pj-area-${uid})`} />
      <Path d={flat} stroke={INK3} strokeWidth={2.2} strokeDasharray="2 7" strokeLinecap="round" opacity={0.65} />
      <Path d={up} stroke={`url(#pj-line-${uid})`} strokeWidth={3.8} strokeLinecap="round" fill="none" />
      {/* you-are-here */}
      <Circle cx={x0} cy={138} r={12} fill={ACCENT} opacity={0.22} />
      <Circle cx={x0} cy={138} r={5} fill={BG} stroke={INK} strokeWidth={3} />
      <SvgText x={x0} y={138 + 20} fill={INK2} fontWeight="700" fontSize={10.5}>Today</SvgText>
      {dots.map(([x, y, lab], k) => (
        <G key={k}>
          <Circle cx={x} cy={y} r={k === 2 ? 7 : 5} fill={BG} stroke={ACCENT} strokeWidth={3} />
          <SvgText x={x === x1 ? x - 2 : x} y={y - 13} textAnchor={x === x1 ? 'end' : 'middle'} fill={INK2} fontWeight="700" fontSize={11}>{lab}</SvgText>
        </G>
      ))}
      <SvgText x={x1} y={yBot + 18} textAnchor="end" fill={INK3} fontWeight="600" fontSize={10.5}>without a plan</SvgText>
    </Svg>
  );
}

// ── pattern meter ────────────────────────────────────────────────────────────
export function PatternMeter({ level = 0.56, label = 'Moderate' }: { level?: number; label?: string }) {
  return (
    <View>
      <View style={{ height: 12, borderRadius: 9999, backgroundColor: SOFT2, justifyContent: 'center' }}>
        <LinearGradient
          colors={[tint(150, 0.72, 0.09, 0.5), tint(95, 0.74, 0.1, 0.55), tint(40, 0.72, 0.11, 0.6)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 9999 }}
        />
        <View
          style={{
            position: 'absolute',
            left: `${level * 100}%`,
            marginLeft: -11,
            width: 22,
            height: 22,
            borderRadius: 9999,
            backgroundColor: FILL,
            borderWidth: 4,
            borderColor: BG,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 8,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
        {['Light', 'Moderate', 'Heavy'].map((m) => (
          <AppText key={m} weightOverride={m === label ? '700' : '600'} color={m === label ? INK : INK3} style={{ fontSize: 13 }}>
            {m}
          </AppText>
        ))}
      </View>
    </View>
  );
}

export function StatRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13 }}>
      <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
      <AppText weightOverride="500" color={INK2} style={{ flex: 1, fontSize: 15 }}>
        {label}
      </AppText>
      <AppText weightOverride="600" color={INK} style={{ fontSize: 15, letterSpacing: -0.15, textAlign: 'right', maxWidth: 160 }}>
        {value}
      </AppText>
    </View>
  );
}

// ── loading ring: gradient arc + glow + slow shimmer halo ─────────────────────
export function LoadingRing({ pct = 0.66, size = 138, hue = 200 }: { pct?: number; size?: number; hue?: number }) {
  const uid = useId().replace(/:/g, '');
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Spin duration={14000} style={{ position: 'absolute', width: size, height: size }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle cx={size / 2} cy={size / 2} r={r + 6} fill="none" stroke={tint(hue, 0.65, 0.09, 0.5)} strokeWidth={1.5} strokeDasharray="2 10" />
        </Svg>
      </Spin>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <SvgGrad id={`lr-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={tint(hue, 0.6, 0.11)} />
            <Stop offset="1" stopColor={INK} />
          </SvgGrad>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={SOFT2} strokeWidth={7} />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#lr-${uid})`}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${c}`}
          strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <SvgText x={size / 2} y={size / 2 + 10} textAnchor="middle" fill={INK} fontWeight="700" fontSize={28}>
          {`${Math.round(pct * 100)}%`}
        </SvgText>
      </Svg>
    </View>
  );
}

// ── tiny inline stars ────────────────────────────────────────────────────────
export function MiniStars({ n = 5, size = 14, color = INK }: { n?: number; size?: number; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: n }).map((_, k) => (
        <Svg key={k} width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7L12 3z" fill={color} />
        </Svg>
      ))}
    </View>
  );
}

// ── stacked initials avatars ─────────────────────────────────────────────────
export function AvatarStack({ items = ['J', 'M', 'A', 'K'], size = 34 }: { items?: string[]; size?: number }) {
  const hues = [208, 150, 40, 280];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {items.map((it, k) => (
        <View
          key={k}
          style={{
            width: size,
            height: size,
            borderRadius: 9999,
            backgroundColor: tint(hues[k % hues.length], 0.7, 0.08, 0.5),
            borderWidth: 3,
            borderColor: BG,
            marginLeft: k ? -size * 0.34 : 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: items.length - k,
          }}>
          <AppText weightOverride="600" color={INK} style={{ fontSize: size * 0.38 }}>
            {it}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export function Testimonial({ initials, name, handle, quote, hue = 208 }: { initials: string; name: string; handle: string; quote: string; hue?: number }) {
  return (
    <OnbCard pad={18}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <View style={{ width: 42, height: 42, borderRadius: 9999, backgroundColor: tint(hue, 0.7, 0.08, 0.5), alignItems: 'center', justifyContent: 'center' }}>
          <AppText weightOverride="600" color={INK} style={{ fontSize: 16 }}>
            {initials}
          </AppText>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText weightOverride="600" color={INK} style={{ fontSize: 15.5, letterSpacing: -0.15 }}>
            {name}
          </AppText>
          <AppText weightOverride="500" color={INK3} style={{ fontSize: 13 }}>
            {handle}
          </AppText>
        </View>
        <MiniStars n={5} size={13} color={tint(40, 0.62, 0.13)} />
      </View>
      <AppText weightOverride="500" color={INK} style={{ fontSize: 15, lineHeight: 22 }}>
        {quote}
      </AppText>
    </OnbCard>
  );
}

export function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <AppText weightOverride="600" color={INK} style={{ fontSize: 30, letterSpacing: -0.9, lineHeight: 32 }}>
        {value}
      </AppText>
      <AppText weightOverride="600" color={INK2} style={{ fontSize: 12.5, marginTop: 6 }}>
        {label}
      </AppText>
    </View>
  );
}
