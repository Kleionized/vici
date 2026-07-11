/**
 * Onboarding v3 — "the campaign" funnel, a native port of the canvas
 * screens-onb3 / onb3-map / onb3-tool. The funnel opens on near-black night
 * water; light gathers low and slow as the questions pass and breaks to paper
 * exactly at the reading. Progress is one growing ink rule; days and weeks are
 * Roman numerals. No scores, no comparison stats, no countdowns, no fake deals.
 *
 * Exposes the step components + an O3Tone context so primitives flip between
 * the night register and the paper register automatically.
 */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Pressable, ScrollView, TextInput, View } from 'react-native';
import Svg, { Circle, Defs, Line, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { UrgeWave } from '@/components/urge';
import { SC } from '@/components/scene/SceneKit';
import { colors, fonts, sans } from '@/lib/theme';

// ── the two registers ────────────────────────────────────────────────
export type Tone = {
  bg: string;
  card: string;
  ink: string;
  ink2: string;
  ink3: string;
  ink4: string;
  line: string;
  soft2: string;
  fill: string;
  onFill: string;
};
const NIGHT: Tone = {
  bg: '#09090A',
  card: '#151516',
  ink: '#EDEDE8',
  ink2: '#A6A7A0',
  ink3: '#6C6D66',
  ink4: '#43443F',
  line: 'rgba(255,255,255,0.1)',
  soft2: 'rgba(255,255,255,0.14)',
  fill: '#EDEDE8',
  onFill: '#131313',
};
const PAPER: Tone = {
  bg: colors.bg,
  card: colors.surface,
  ink: colors.text,
  ink2: colors.textMuted,
  ink3: colors.textSoft,
  ink4: colors.textSofter,
  line: colors.border,
  soft2: colors.borderStrong,
  fill: colors.ink,
  onFill: colors.inkText,
};
const O3Tone = createContext<Tone>(NIGHT);
const useTone = () => useContext(O3Tone);

// ── roman numerals ───────────────────────────────────────────────────
export function o3Roman(n: number): string {
  const T: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let s = '';
  let v = Math.max(1, Math.round(n));
  for (const [k, r] of T) while (v >= k) { s += r; v -= k; }
  return s;
}

// ── small motion helpers ─────────────────────────────────────────────
function Rise({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: object }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 550, delay: delay * 1000, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [t, delay]);
  return <Animated.View style={[{ opacity: t, transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [9, 0] }) }] }, style]}>{children}</Animated.View>;
}

// ── the shell: night ground, gathering light, a growing ink rule ─────
export function O3Shell({
  progress = 0,
  onBack,
  bar = true,
  lit = false,
  children,
}: {
  progress?: number;
  onBack?: (() => void) | null;
  bar?: boolean;
  lit?: boolean;
  children: ReactNode;
}) {
  const tone = lit ? PAPER : NIGHT;
  return (
    <O3Tone.Provider value={tone}>
      <View style={{ flex: 1, backgroundColor: tone.bg }}>
        {/* the ambient light gathering low, or daylight on paper */}
        <Ambient t={progress} lit={lit} />
        <View style={{ flex: 1, paddingTop: 64, paddingHorizontal: 26 }}>
          {bar ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 24 }}>
              <Pressable onPress={onBack ?? undefined} disabled={!onBack} style={{ padding: 4, opacity: onBack ? 0.75 : 0.16 }}>
                <Svg width={11} height={18} viewBox="0 0 13 22">
                  <Path d="M11 2L2 11l9 9" stroke={tone.ink} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </Pressable>
              <View style={{ flex: 1, height: 14, justifyContent: 'center' }}>
                <View style={{ position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: tone.line }} />
                <View style={{ position: 'absolute', left: 0, height: 2, width: `${Math.max(3, progress * 100)}%`, backgroundColor: tone.ink }} />
              </View>
            </View>
          ) : (
            <View style={{ height: 24 }} />
          )}
          <View style={{ flex: 1, paddingTop: 18, paddingBottom: 44 }}>{children}</View>
        </View>
      </View>
    </O3Tone.Provider>
  );
}

// gathering light: a wide pale bloom low, a warmer core arriving later
function Ambient({ t, lit }: { t: number; lit: boolean }) {
  const e = 1 - (1 - t) * (1 - t);
  if (lit) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="o3glow1" cx="50%" cy="100%" rx="70%" ry="60%">
            <Stop offset="0%" stopColor="#E4D8C2" stopOpacity={(0.06 + e * 0.5).toFixed(3)} />
            <Stop offset="70%" stopColor="#E4D8C2" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="o3glow2" cx="50%" cy="106%" rx="46%" ry="46%">
            <Stop offset="0%" stopColor="#E0AA6A" stopOpacity={(Math.pow(e, 1.6) * 0.42).toFixed(3)} />
            <Stop offset="64%" stopColor="#E0AA6A" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#o3glow1)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#o3glow2)" />
      </Svg>
    </View>
  );
}

// ── voice primitives ─────────────────────────────────────────────────
export function O3H({ children, size = 29, style }: { children: ReactNode; size?: number; style?: object }) {
  const tone = useTone();
  return (
    <AppText center style={[{ fontFamily: fonts.serif, fontSize: size, lineHeight: size * 1.18, letterSpacing: 0.24, color: tone.ink, maxWidth: 330, alignSelf: 'center' }, style]}>
      {children}
    </AppText>
  );
}
export function O3Sub({ children, style }: { children: ReactNode; style?: object }) {
  const tone = useTone();
  return (
    <AppText center style={[sans('400'), { fontSize: 14, lineHeight: 22, color: tone.ink2, maxWidth: 306, alignSelf: 'center', marginTop: 14 }, style]}>
      {children}
    </AppText>
  );
}
export function O3Eyebrow({ children, style }: { children: ReactNode; style?: object }) {
  const tone = useTone();
  return (
    <AppText center style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.3, textTransform: 'uppercase', color: tone.ink3 }, style]}>
      {children}
    </AppText>
  );
}
export function O3Reflect({ children, style }: { children: ReactNode; style?: object }) {
  const tone = useTone();
  return (
    <Rise style={[{ alignItems: 'center', alignSelf: 'center', maxWidth: 300 }, style]}>
      <View style={{ width: 24, height: 1.5, backgroundColor: tone.ink, marginBottom: 12, opacity: 0.85 }} />
      <AppText center style={{ fontFamily: fonts.serifSharpItalic, fontStyle: 'italic', fontSize: 16.5, lineHeight: 24, color: tone.ink }}>
        {children}
      </AppText>
    </Rise>
  );
}
export function O3Note({ children, style }: { children: ReactNode; style?: object }) {
  const tone = useTone();
  return (
    <AppText center style={[sans('400'), { fontSize: 12, lineHeight: 18, color: tone.ink3, maxWidth: 280, alignSelf: 'center' }, style]}>
      {children}
    </AppText>
  );
}
export function O3CTA({ label, onClick, enabled = true, ghost = false, style }: { label: string; onClick?: () => void; enabled?: boolean; ghost?: boolean; style?: object }) {
  const tone = useTone();
  if (ghost) {
    return (
      <View style={{ alignItems: 'center' }}>
        <Pressable onPress={onClick} style={{ paddingHorizontal: 20, paddingVertical: 14 }}>
          <AppText style={[sans('500'), { fontSize: 14, color: tone.ink2 }, style as object]}>{label}</AppText>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={{ alignItems: 'center' }}>
      <Pressable
        onPress={enabled ? onClick : undefined}
        disabled={!enabled}
        style={{ backgroundColor: tone.fill, borderRadius: 9999, paddingVertical: 16, paddingHorizontal: 34, minWidth: 232, alignItems: 'center', opacity: enabled ? 1 : 0.26, ...(style as object) }}>
        <AppText style={[sans('600'), { fontSize: 15, letterSpacing: 0.3, color: tone.onFill }]}>{label}</AppText>
      </Pressable>
    </View>
  );
}

// ── the chip — multi-select ring+dot, single-select ink bleed ────────
export function O3Chip({ label, on, picked = false, onClick }: { label: string; on: boolean; picked?: boolean; onClick: () => void }) {
  const tone = useTone();
  return (
    <Pressable
      onPress={onClick}
      style={{
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        paddingVertical: 17,
        paddingHorizontal: 26,
        borderRadius: 9999,
        minHeight: 55,
        backgroundColor: picked ? tone.fill : tone.card,
        borderWidth: on && !picked ? 1.6 : 0,
        borderColor: tone.ink,
      }}>
      {on && !picked ? <View style={{ width: 7, height: 7, borderRadius: 9999, backgroundColor: tone.ink }} /> : null}
      <AppText style={[sans('500'), { fontSize: 15, lineHeight: 19, color: picked ? tone.onFill : tone.ink, textAlign: 'center' }]}>{label}</AppText>
    </Pressable>
  );
}

// ── option glyphs (canvas: O3_ICON) — small monotone strokes for the
// icon-grid questions; unknown labels fall back to a quiet dot ──
function O3Icon({ label, c }: { label: string; c: string }) {
  const P = ({ d, w = 1.8 }: { d: string; w?: number }) => (
    <Path d={d} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  );
  const wrap = (kids: React.ReactNode) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      {kids}
    </Svg>
  );
  switch (label) {
    // when it happens
    case 'Late at night':
      return wrap(<P d="M19.5 14.5A8.3 8.3 0 0 1 9.6 4.3a8.3 8.3 0 1 0 9.9 10.2z" />);
    case 'First thing in the morning':
      return wrap(<><P d="M6.5 15.5a5.5 5.5 0 0 1 11 0" /><P d="M12 6.2V3.8M5.4 9.1 3.7 7.4M18.6 9.1l1.7-1.7M3 15.5h18" /></>);
    case 'Bored during the day':
      return wrap(<><Circle cx={12} cy={12} r={8.4} stroke={c} strokeWidth={1.8} /><P d="M12 7.4V12l3.2 3.2" /></>);
    case 'After stress or a hard day':
      return wrap(<P d="M13.5 3.5 6 13h5l-1.5 7.5L17 11h-5z" />);
    case 'When I can’t sleep':
      return wrap(<><P d="M3.5 12c2.2-3.4 5.2-5.1 8.5-5.1s6.3 1.7 8.5 5.1c-2.2 3.4-5.2 5.1-8.5 5.1S5.7 15.4 3.5 12z" /><Circle cx={12} cy={12} r={2.4} stroke={c} strokeWidth={1.8} /></>);
    case 'Weekends or days off':
      return wrap(<><Rect x={4} y={5.5} width={16} height={15} rx={2.4} stroke={c} strokeWidth={1.8} /><P d="M8 3.5v3.4M16 3.5v3.4M4 10h16" /><Circle cx={15.4} cy={15} r={1.4} stroke={c} strokeWidth={1.8} /></>);
    case 'When I’ve been drinking':
      return wrap(<><P d="M7 3.8h10l-1.3 9.2a3.7 3.7 0 0 1-7.4 0z" /><P d="M12 13.5v6.7M8.8 20.2h6.4M7.6 7.6h8.8" /></>);
    case 'Home alone for long stretches':
      return wrap(<><P d="M4.5 11 12 4.5 19.5 11" /><P d="M6.3 9.6V19a1 1 0 0 0 1 1h9.4a1 1 0 0 0 1-1V9.6" /></>);
    case 'On my phone in bed':
      return wrap(<><Rect x={8} y={3.5} width={8} height={14} rx={2} stroke={c} strokeWidth={1.8} /><P d="M11 15.2h2M4 20.5h16" /></>);
    // the feeling underneath
    case 'Loneliness':
      return wrap(<><Circle cx={12} cy={8.6} r={3.6} stroke={c} strokeWidth={1.8} /><P d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>);
    case 'Anxiety or stress':
      return wrap(<P d="M3.5 12h3l2-5 3 10 2.5-7.5 1.5 2.5h5" />);
    case 'Boredom':
      return wrap(<><Circle cx={12} cy={12} r={8.4} stroke={c} strokeWidth={1.8} /><P d="M8.5 15h7M9 9.6h.01M15 9.6h.01" /></>);
    case 'Sadness or low mood':
      return wrap(<P d="M12 3.8c3.4 4.2 5.6 7.2 5.6 10a5.6 5.6 0 1 1-11.2 0c0-2.8 2.2-5.8 5.6-10z" />);
    case 'Anger or frustration':
      return wrap(<P d="M6 6l12 12M18 6 6 18" />);
    case 'Numbness — feeling nothing':
      return wrap(<Circle cx={12} cy={12} r={8} stroke={c} strokeWidth={1.8} strokeDasharray="3.4 4.4" />);
    case 'Mostly automatic, just habit':
      return wrap(<><P d="M17.5 8.5A6.5 6.5 0 1 0 18.5 12" /><P d="M18.8 4.6v4h-4" /></>);
    case 'Genuine desire or arousal':
      return wrap(<P d="M12 4c1 3-1.8 4.6-1.8 7a4.4 4.4 0 0 0 3 4.2c-.3-1.6.4-2.6 1.4-3.4.5 1.7 2.4 2.6 2.4 5A5.2 5.2 0 0 1 6.6 17c0-4.6 4.6-6.4 5.4-13z" />);
    // where it happens
    case 'Bedroom':
      return wrap(<><P d="M3.5 18.5v-8M3.5 14h17v4.5" /><P d="M3.5 14V8.5h6.5c2.4 0 3.8 1.3 3.8 3.3V14" /><Circle cx={7} cy={11} r={1.2} stroke={c} strokeWidth={1.8} /></>);
    case 'Bathroom':
      return wrap(<><P d="M5.5 12.5h13a6.5 4.8 0 0 1-13 0z" /><P d="M6.5 12.5V6a2.1 2.1 0 0 1 4.2 0M8 19.5l-.8 1.4M16 19.5l.8 1.4" /></>);
    case 'Home office or desk':
      return wrap(<><Rect x={4} y={5} width={16} height={10.5} rx={1.8} stroke={c} strokeWidth={1.8} /><P d="M9.5 19.5h5M12 15.5v4" /></>);
    case 'Living room':
      return wrap(<><P d="M5 11V9a2.4 2.4 0 0 1 2.4-2.4h9.2A2.4 2.4 0 0 1 19 9v2" /><P d="M3.8 13.4a1.9 1.9 0 0 1 3.8 0v.7h8.8v-.7a1.9 1.9 0 1 1 3.8 0v3.2a1.5 1.5 0 0 1-1.5 1.5H5.3a1.5 1.5 0 0 1-1.5-1.5z" /></>);
    case 'On my phone, anywhere':
      return wrap(<><Rect x={7.5} y={3.5} width={9} height={17} rx={2.2} stroke={c} strokeWidth={1.8} /><P d="M11 17.6h2" /></>);
    case 'Away from home':
      return wrap(<><P d="M12 21s-6.4-5.3-6.4-10a6.4 6.4 0 1 1 12.8 0c0 4.7-6.4 10-6.4 10z" /><Circle cx={12} cy={10.8} r={2.3} stroke={c} strokeWidth={1.8} /></>);
    // what you've tried
    case 'Blockers or filters':
      return wrap(<P d="M11.4 3.3 5.2 5.8a1.4 1.4 0 0 0-.9 1.3v4.1c0 5 3.2 8.5 7.7 10.4 4.5-1.9 7.7-5.4 7.7-10.4V7.1a1.4 1.4 0 0 0-.9-1.3l-6.2-2.5a1.6 1.6 0 0 0-1.2 0z" />);
    case 'Going cold turkey':
      return wrap(<P w={1.5} d="M12 3.5v17M12 3.5 9.4 6.1M12 3.5l2.6 2.6M12 20.5l-2.6-2.6M12 20.5l2.6-2.6M4.6 7.75l14.8 8.5M4.6 7.75 8.1 8.7M4.6 7.75l.95-3.5M19.4 16.25l-3.5-.95M19.4 16.25l-.95 3.5M19.4 7.75 4.6 16.25M19.4 7.75 15.9 8.7M19.4 7.75l-.95-3.5M4.6 16.25l3.5-.95M4.6 16.25l.95 3.5" />);
    case 'An accountability partner':
      return wrap(<><Circle cx={8.6} cy={9} r={3} stroke={c} strokeWidth={1.8} /><P d="M3.4 19.5a5.2 5.2 0 0 1 10.4 0" /><P d="M15.5 6.6a3 3 0 0 1 0 4.9M17.3 19.5a5.2 5.2 0 0 0-3-4.7" /></>);
    case 'Deleting accounts or apps':
      return wrap(<><P d="M9.5 3.8h5a.9.9 0 0 1 .9.9V6h3.8v1.9H4.8V6h3.8V4.7a.9.9 0 0 1 .9-.9z" /><P d="M6.2 7.9l.9 11.3a1.4 1.4 0 0 0 1.4 1.3h7a1.4 1.4 0 0 0 1.4-1.3l.9-11.3" /></>);
    case 'Therapy or counselling':
      return wrap(<P d="M12 4c4.8 0 8.5 3 8.5 7s-3.7 7-8.5 7c-.8 0-1.6-.1-2.3-.3L5 20l1.3-3.6C4.6 15.1 3.5 13.2 3.5 11c0-4 3.7-7 8.5-7z" />);
    case 'Replacing it with other habits':
      return wrap(<><P d="M4 8.5h13M13.5 4.5l4 4-4 4" /><P d="M20 15.5H7M10.5 19.5l-4-4 4-4" /></>);
    case 'Nothing structured yet':
      return wrap(<Rect x={4.5} y={4.5} width={15} height={15} rx={3} stroke={c} strokeWidth={1.8} strokeDasharray="3.4 4" />);
    default:
      return wrap(<Circle cx={12} cy={12} r={3.2} fill={c} />);
  }
}

// ── a generic question screen — grammar varies by kind ───────────────
export function O3Question({
  title,
  sub,
  options,
  value,
  multi = false,
  kind,
  onSet,
  next,
  note,
  ctaLabel,
  skip,
}: {
  title: string;
  sub?: string;
  options: string[];
  value: string | string[] | undefined;
  multi?: boolean;
  kind?: 'grid' | 'scale' | 'wrap';
  onSet: (v: string | string[]) => void;
  next: () => void;
  reflect?: (v: string | string[]) => string | null;
  note?: string;
  ctaLabel?: string;
  skip?: boolean;
}) {
  const tone = useTone();
  const [picked, setPicked] = useState<string | null>(null);

  const pick = (label: string) => {
    if (multi) {
      const cur = (value as string[]) || [];
      onSet(cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label]);
      return;
    }
    if (picked) return;
    onSet(label);
    setPicked(label);
    setTimeout(next, 500);
  };

  const isOn = (label: string) => (multi ? ((value as string[]) || []).includes(label) : value === label);
  const count = multi ? ((value as string[]) || []).length : 0;

  let body: ReactNode;
  if (kind === 'grid') {
    // icon grid — 2-col cells: a 42px glyph chip that floods ink on select
    body = (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 11 }}>
        {options.map((label) => {
          const on = isOn(label) || picked === label;
          return (
            <Pressable
              key={label}
              onPress={() => pick(label)}
              style={{
                width: '48%',
                flexGrow: 1,
                alignItems: 'center',
                gap: 9,
                paddingTop: 15,
                paddingBottom: 12,
                paddingHorizontal: 10,
                borderRadius: 18,
                backgroundColor: tone.card,
                borderWidth: 1.6,
                borderColor: on ? tone.ink : 'transparent',
              }}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 9999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: on ? tone.fill : tone.soft2,
                }}>
                <O3Icon label={label} c={on ? tone.onFill : tone.ink} />
              </View>
              <View style={{ minHeight: 30, justifyContent: 'center' }}>
                <AppText center style={[sans(on ? '600' : '500'), { fontSize: 12.5, lineHeight: 15.6, color: tone.ink }]}>{label}</AppText>
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  } else if (kind === 'scale') {
    // scale — each row a level, segment marks fill with it
    body = (
      <View style={{ gap: 10 }}>
        {options.map((label, i) => {
          const on = isOn(label) || picked === label;
          return (
            <Pressable
              key={label}
              onPress={() => pick(label)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                minHeight: 54,
                paddingVertical: 15,
                paddingHorizontal: 18,
                borderRadius: 16,
                backgroundColor: tone.card,
                borderWidth: 1.6,
                borderColor: on ? tone.ink : 'transparent',
              }}>
              <View style={{ flexDirection: 'row', gap: 3 }}>
                {options.map((_, j) => (
                  <View key={j} style={{ width: 4.5, height: 15, borderRadius: 2.5, backgroundColor: j <= i ? tone.ink : tone.soft2 }} />
                ))}
              </View>
              <AppText style={[sans(on ? '600' : '500'), { flex: 1, fontSize: 14.5, lineHeight: 19, color: tone.ink }]}>{label}</AppText>
            </Pressable>
          );
        })}
      </View>
    );
  } else if (kind === 'wrap') {
    // wrap — centered pills, a hairline ink ring when chosen
    body = (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {options.map((label) => {
          const on = isOn(label) || picked === label;
          return (
            <Pressable
              key={label}
              onPress={() => pick(label)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 21,
                paddingVertical: 14,
                borderRadius: 9999,
                backgroundColor: picked === label ? tone.fill : tone.card,
                borderWidth: 1.6,
                borderColor: on && picked !== label ? tone.ink : 'transparent',
              }}>
              <AppText style={[sans(on ? '600' : '500'), { fontSize: 14.5, color: picked === label ? tone.onFill : tone.ink }]}>{label}</AppText>
            </Pressable>
          );
        })}
      </View>
    );
  } else {
    body = (
      <View style={{ gap: 12 }}>
        {options.map((label) => (
          <O3Chip key={label} label={label} on={isOn(label)} picked={!multi && picked === label} onClick={() => pick(label)} />
        ))}
      </View>
    );
  }

  return (
    <>
      <View style={{ height: 26 }} />
      <O3H>{title}</O3H>
      {sub ? <O3Sub>{sub}</O3Sub> : null}
      <ScrollView style={{ flex: 1, marginTop: 30 }} contentContainerStyle={{ flexGrow: 1, justifyContent: options.length <= 5 && kind !== 'grid' ? 'center' : 'flex-start', paddingBottom: 4 }} showsVerticalScrollIndicator={false}>
        {body}
      </ScrollView>
      <View style={{ paddingTop: 14, minHeight: multi ? 0 : 44, justifyContent: 'flex-end' }}>
        {note ? <O3Note style={{ marginBottom: multi ? 13 : 6 }}>{note}</O3Note> : null}
        {multi ? <O3CTA label={ctaLabel || 'Continue'} enabled={count > 0} onClick={next} /> : null}
        {skip && !picked ? <O3CTA ghost label="Skip" onClick={next} /> : null}
      </View>
    </>
  );
}

// ════════ steps ══════════════════════════════════════════════════════
export function O3Threshold({ next }: { next: () => void }) {
  const tone = useTone();
  return (
    <>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
        <AppText style={{ fontFamily: fonts.serif, fontSize: 15, letterSpacing: 5, color: tone.ink }}>VICI</AppText>
        <View style={{ width: 40, height: 1.5, backgroundColor: tone.ink, marginTop: 16 }} />
        <View style={{ height: 64 }} />
        <Rise>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 31, lineHeight: 41, letterSpacing: 0.24, color: tone.ink, maxWidth: 300 }}>
            One day you close this app for good, and it says{' '}
            <AppText style={{ fontFamily: fonts.serifSharpItalic, fontStyle: 'italic' }}>vici.</AppText>
          </AppText>
        </Rise>
        <O3Sub style={{ marginTop: 22 }}>A twelve-week campaign, won once.</O3Sub>
      </View>
      <O3CTA label="Begin" onClick={next} />
      <O3CTA ghost label="I already have a campaign" onClick={next} style={{ fontSize: 12.5, color: tone.ink3 }} />
    </>
  );
}

const OATH: [string, string][] = [
  ['Everything stays on this device.', 'Your answers are stored here, not on a server. We could not read them if we wanted to.'],
  ['Face ID locks the door.', 'Nothing on your screen says what this app is for unless you open it.'],
  ['No feed. No followers.', 'Recovery here is not performed for anyone. There is no audience to disappoint.'],
];
export function O3Privacy({ next }: { next: () => void }) {
  const tone = useTone();
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 60 }}>
        <O3H>What happens here stays in your hands.</O3H>
        <View style={{ marginTop: 30, backgroundColor: tone.card, borderRadius: 20, paddingHorizontal: 20 }}>
          {OATH.map(([t, s], i) => (
            <View key={t} style={{ flexDirection: 'row', gap: 15, alignItems: 'flex-start', paddingVertical: 17, borderBottomWidth: i < OATH.length - 1 ? 1 : 0, borderBottomColor: tone.line }}>
              <View style={{ width: 21, height: 21, marginTop: 1 }}>
                <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
                  {i === 0 ? (
                    <>
                      <Rect x={6.5} y={3.5} width={11} height={17} rx={2.4} stroke={tone.ink} strokeWidth={1.7} />
                      <Path d="M10 17.8h4" stroke={tone.ink} strokeWidth={1.7} strokeLinecap="round" />
                    </>
                  ) : i === 1 ? (
                    <>
                      <Path d="M5 8.5V6.4A1.4 1.4 0 0 1 6.4 5H8.5M15.5 5h2.1A1.4 1.4 0 0 1 19 6.4V8.5M19 15.5v2.1a1.4 1.4 0 0 1-1.4 1.4H15.5M8.5 19H6.4A1.4 1.4 0 0 1 5 17.6V15.5" stroke={tone.ink} strokeWidth={1.7} strokeLinecap="round" />
                      <Path d="M9.5 10.2v1M14.5 10.2v1M9.8 14.2a3.4 3.4 0 0 0 4.4 0" stroke={tone.ink} strokeWidth={1.7} strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <Circle cx={12} cy={12} r={8.4} stroke={tone.ink} strokeWidth={1.7} />
                      <Path d="M6.3 6.3l11.4 11.4" stroke={tone.ink} strokeWidth={1.7} strokeLinecap="round" />
                    </>
                  )}
                </Svg>
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={[sans('600'), { fontSize: 14, color: tone.ink }]}>{t}</AppText>
                <AppText style={[sans('400'), { fontSize: 12.5, lineHeight: 19, color: tone.ink2, marginTop: 3 }]}>{s}</AppText>
              </View>
            </View>
          ))}
        </View>
        <O3Note style={{ marginTop: 18 }}>The urge tool is free forever.</O3Note>
      </View>
      <O3CTA label="Understood" onClick={next} />
    </>
  );
}

const ARRIVAL: [string, string][] = [
  ['I just slipped', 'relapsed'],
  ['I keep stopping, then sliding back', 'cycling'],
  ["I'm ready to be done with it", 'resolved'],
  ["I'm not sure it's a problem yet", 'curious'],
];
export function O3Door({ value, onSet, next }: { value: string[]; onSet: (v: string[]) => void; next: () => void }) {
  const sel = value || [];
  const toggle = (k: string) => onSet(sel.includes(k) ? sel.filter((x) => x !== k) : [...sel, k]);
  return (
    <>
      <View style={{ height: 26 }} />
      <O3H>What brings you to the door?</O3H>
      <View style={{ flex: 1, justifyContent: 'center', gap: 12, marginTop: 30 }}>
        {ARRIVAL.map(([label, k]) => (
          <O3Chip key={k} label={label} on={sel.includes(k)} onClick={() => toggle(k)} />
        ))}
      </View>
      <View style={{ paddingTop: 14 }}>
        <O3CTA label="Continue" enabled={sel.length > 0} onClick={next} />
      </View>
    </>
  );
}

export function O3Name({ value, onSet, next }: { value: string; onSet: (v: string) => void; next: () => void }) {
  const tone = useTone();
  return (
    <>
      <View style={{ height: 26 }} />
      <O3H>What should we call you?</O3H>
      <O3Sub>A first name, or an alias. Whatever feels safe.</O3Sub>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TextInput
          value={value}
          onChangeText={onSet}
          placeholder="Your name"
          placeholderTextColor={tone.ink3}
          style={{ backgroundColor: tone.card, borderRadius: 9999, paddingVertical: 18, paddingHorizontal: 24, fontFamily: fonts.body, fontSize: 18, color: tone.ink, textAlign: 'center' }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 }}>
          <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
            <Rect x={5} y={10.5} width={14} height={9.5} rx={2.5} stroke={tone.ink3} strokeWidth={2} />
            <Path d="M8.2 10.5V7.8a3.8 3.8 0 017.6 0v2.7" stroke={tone.ink3} strokeWidth={2} />
          </Svg>
          <AppText style={[sans('500'), { fontSize: 12, color: tone.ink3 }]}>Stays on this device.</AppText>
        </View>
      </View>
      <O3CTA label="Continue" enabled={!!(value || '').trim()} onClick={next} />
      <O3CTA ghost label="Stay unnamed" onClick={next} style={{ fontSize: 13, color: tone.ink3 }} />
    </>
  );
}

// the assessment table
export const O3_QUESTIONS: [string, { title: string; options: string[]; multi?: boolean; kind?: 'grid' | 'scale' | 'wrap'; note?: string; skip?: boolean; ctaLabel?: string }][] = [
  // Section 1 · Where you're starting
  ['freq', { kind: 'scale', title: 'How often are you using porn right now?', options: ['Several times a day', 'About once a day', 'A few times a week', 'About once a week', 'A few times a month', 'Less than once a month'] }],
  ['duration', { kind: 'scale', title: 'How long have you wanted to change this?', options: ['Less than a year', '1–3 years', '4–10 years', 'More than 10 years', 'I can’t remember a time without it'] }],
  ['control', { title: 'How much control do you feel over it right now?', options: ['I feel powerless over it', 'I resist, but usually give in', 'I win about half the time', 'Mostly in control — but I want to be free of it'] }],
  ['pattern', { title: 'Which of these sounds most like your pattern?', options: ['A quick habit I barely think about', 'A way I unwind, numb out, or escape', 'Something I binge on for hours', 'Escalating — I look for more, or more extreme', 'It comes in waves — intense, then quiet'] }],
  // Section 2 · When & why it happens
  ['triggers', { kind: 'grid', title: 'When are you most likely to slip?', multi: true, options: ['Late at night', 'First thing in the morning', 'Bored during the day', 'After stress or a hard day', 'When I can’t sleep', 'Weekends or days off', 'When I’ve been drinking', 'Home alone for long stretches', 'On my phone in bed'] }],
  ['emotions', { kind: 'grid', title: 'What feeling is most often underneath it?', multi: true, options: ['Loneliness', 'Anxiety or stress', 'Boredom', 'Sadness or low mood', 'Anger or frustration', 'Numbness — feeling nothing', 'Mostly automatic, just habit', 'Genuine desire or arousal'] }],
  ['places', { kind: 'grid', title: 'Where does it usually happen?', multi: true, options: ['Bedroom', 'Bathroom', 'Home office or desk', 'Living room', 'On my phone, anywhere', 'Away from home'] }],
  // Section 3 · How you've been feeling lately
  ['energy', { kind: 'scale', title: 'How are your energy and drive most days?', options: ['Running on empty most of the time', 'Low more often than not', 'Up and down', 'Generally good'] }],
  ['meaning', { title: 'How much sense of purpose do you feel right now?', options: ['I feel pretty lost', 'Some, but it feels thin', 'It comes and goes', 'I’m clear on what matters to me'] }],
  ['connection', { kind: 'scale', title: 'How connected do you feel to the people around you?', options: ['Pretty isolated', 'A few people, but distant', 'Reasonably connected', 'Strongly connected'] }],
  // Section 4 · A little about your life
  ['age', { kind: 'wrap', title: 'Your age range.', options: ['Under 18', '18–24', '25–34', '35–44', '45 or older'] }],
  ['relationship', { title: 'Relationship status.', options: ['Single', 'Dating or in a relationship', 'Married or living together', 'It’s complicated'] }],
  ['alone', { title: 'Do you have a lot of unstructured time alone?', options: ['Yes, most days', 'Sometimes', 'Rarely'] }],
  ['framing', { title: 'Does faith or a moral code play a part in why you want to stop?', options: ['Yes — it’s central for me', 'Somewhat', 'No — my reasons are practical', 'Prefer not to say'] }],
  // Section 5 · What you want
  ['goalPorn', { title: 'What’s your goal with porn?', options: ['Quit it completely', 'Cut it down a lot', 'Keep it to a level I set', 'Not sure yet — exploring'], note: 'Porn and masturbation are two separate choices.' }],
  ['goalMast', { title: 'And masturbation?', options: ['Stop too — a full reset', 'Keep it, just without porn', 'Cut it down', 'Not trying to change that'] }],
  ['tried', { kind: 'grid', title: 'What have you already tried?', multi: true, options: ['Blockers or filters', 'Going cold turkey', 'An accountability partner', 'Deleting accounts or apps', 'Therapy or counselling', 'Replacing it with other habits', 'Nothing structured yet'] }],
  ['readiness', { kind: 'scale', title: 'How ready do you feel to change right now?', options: ['Just exploring', 'Thinking about it', 'Ready to start', 'Already started — I want structure'] }],
  // Section 6 · How the plan runs
  ['load', { title: 'How much do you want to do each day?', options: ['One small lesson', 'A lesson plus a task', 'As much as I can', 'Just the bad-day tools for now'] }],
  ['checkins', { kind: 'wrap', title: 'When should we check in with you?', multi: true, ctaLabel: 'Set reminders', options: ['Morning', 'Midday', 'Evening', 'Late night — my danger zone', 'No reminders'] }],
  // A quick wellbeing check
  ['impact', { kind: 'scale', title: 'Is this affecting your sleep, work, relationships, or money?', options: ['Not really', 'A little', 'Quite a bit', 'A lot'], note: 'Not a test, not a diagnosis. Nobody sees this but you.' }],
  ['coping', { title: 'Are you mainly using porn to cope with something heavy right now?', options: ['No', 'Maybe', 'Yes'] }],
  ['mood', { kind: 'scale', title: 'In the last two weeks, how often have you felt down or hopeless?', options: ['Not at all', 'Some days', 'Most days', 'Nearly every day'] }],
];

// ── the streak interstitial ──────────────────────────────────────────
function StreakChart() {
  const tone = useTone();
  const W = 320;
  const yB = 128;
  const streak = `M10 ${yB} L74 52 L74 ${yB} L168 36 L168 ${yB} L226 80 L226 ${yB} L256 104`;
  const camp = `M10 ${yB - 8} C 60 ${yB - 34}, 72 ${yB - 40}, 98 ${yB - 48} L106 ${yB - 41} C 152 ${yB - 58}, 166 ${yB - 66}, 188 ${yB - 72} L194 ${yB - 67} C 252 ${yB - 88}, 286 ${yB - 98}, 310 ${yB - 106}`;
  return (
    <Svg width="100%" height={156} viewBox={`0 0 ${W} 156`} fill="none">
      <Line x1={10} y1={yB} x2={310} y2={yB} stroke={tone.line} strokeWidth={1} />
      {[74, 168, 226].map((x) => (
        <SvgText key={x} x={x} y={yB + 14} textAnchor="middle" fill={tone.ink3} fontSize={8.5} fontFamily={fonts.body}>
          to zero
        </SvgText>
      ))}
      <Path d={streak} stroke={tone.ink4} strokeWidth={1.8} strokeLinejoin="round" strokeDasharray="3 4" fill="none" />
      <Path d={camp} stroke={tone.ink} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <Circle cx={310} cy={yB - 106} r={4.5} fill={tone.bg} stroke={tone.ink} strokeWidth={2.2} />
      <SvgText x={12} y={14} fill={tone.ink4} fontSize={9.5} fontFamily={fonts.body}>A STREAK</SvgText>
      <SvgText x={12} y={28} fill={tone.ink} fontSize={9.5} fontFamily={fonts.body}>A CAMPAIGN</SvgText>
    </Svg>
  );
}
export function O3Streaks({ next }: { next: () => void }) {
  const tone = useTone();
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 40 }}>
        <O3H>A streak resets. A campaign doesn’t.</O3H>
        <View style={{ marginTop: 26, backgroundColor: tone.card, borderRadius: 20, paddingVertical: 18, paddingHorizontal: 15 }}>
          <StreakChart />
        </View>
        <O3Sub style={{ marginTop: 22 }}>A counter only measures days, and when it breaks it says you lost everything. That lie turns one bad night into a lost week.</O3Sub>
        <O3Sub style={{ marginTop: 12 }}>Here, ground taken stays taken. A slip is a data point — it is never a reset to zero.</O3Sub>
      </View>
      <O3CTA label="That is what happened to me" onClick={next} />
    </>
  );
}

// ── the reading pause — a long, slow "calculating" reveal: the funnel's
// night ground gathers light and breaks to paper exactly as the reading
// is ready (full-screen; owns its own background, like the wave). ──────
export function O3ReadingPause({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const t = (answers.triggers as string[]) || [];
  const l1 = t.length ? `${t.slice(0, 2).map((x) => x.toLowerCase()).join(', ')} — mostly.` : 'The pattern, plainly.';
  const durMap: Record<string, string> = { 'Less than a year': 'Under a year', '1–3 years': 'A few years', '4–10 years': 'Most of a decade', 'More than 10 years': 'Over a decade', 'I can’t remember a time without it': 'Most of a life' };
  const tried = ((answers.tried as string[]) || []).filter((x) => x !== 'Nothing structured yet').length;
  const att = tried >= 3 ? 'three ways already tried' : tried > 0 ? 'real attempts behind you' : 'a first structured attempt';
  const l2 = `${durMap[answers.duration as string] || 'Years'}. And ${att}.`;

  // what the engine pinned — the plan chips that tick in while it builds
  const chips: string[] = [];
  chips.push(({ 'Quit it completely': 'Full-stop track', 'Cut it down a lot': 'Reduction track', 'Keep it to a level I set': 'Reduction track', 'Not sure yet — exploring': 'Exploration track' } as Record<string, string>)[answers.goalPorn as string] || 'Full-stop track');
  const t0 = ((answers.triggers as string[]) || [])[0];
  chips.push(t0 ? `${t0} — window guarded` : 'Check-in windows set');
  const e0 = ((answers.emotions as string[]) || [])[0];
  if (e0) chips.push(`${e0} protocol, pinned`);
  chips.push(({ 'One small lesson': 'One small lesson a day', 'A lesson plus a task': 'A lesson + a task, daily', 'As much as I can': 'Full pace', 'Just the bad-day tools for now': 'Tools first, course later' } as Record<string, string>)[answers.load as string] || 'One small lesson a day');

  const [phase, setPhase] = useState(0);
  const p = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(p, { toValue: 1, duration: 8600, easing: Easing.inOut(Easing.quad), useNativeDriver: false }).start();
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })).start();
    const t1 = setTimeout(() => setPhase(1), 4200);
    const id = setTimeout(next, 9400);
    return () => {
      clearTimeout(t1);
      clearTimeout(id);
    };
  }, [next, p, spin]);

  // night → warm dusk → paper, gathered gradually then resolving at the end
  const bg = p.interpolate({
    inputRange: [0, 0.35, 0.65, 0.85, 1],
    outputRange: [NIGHT.bg, '#141310', '#3C382E', '#8C887B', PAPER.bg],
  });
  const glowOp = p.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 0.35, 0.7, 0] });
  const titleLightOp = p.interpolate({ inputRange: [0, 0.6, 0.82], outputRange: [1, 1, 0] });
  const titleDarkOp = p.interpolate({ inputRange: [0.62, 0.92], outputRange: [0, 1] });
  const waveOp = p.interpolate({ inputRange: [0, 0.36, 0.46], outputRange: [0.7, 0.7, 0] });
  const lineOp = (a: number) => p.interpolate({ inputRange: [a, a + 0.1, 0.36, 0.46], outputRange: [0, 1, 1, 0] });
  const lineY = (a: number) => p.interpolate({ inputRange: [a, a + 0.1], outputRange: [8, 0], extrapolate: 'clamp' });
  const chipOp = (i: number) => p.interpolate({ inputRange: [0.52 + i * 0.055, 0.6 + i * 0.055], outputRange: [0, 1], extrapolate: 'clamp' });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const name = String(answers.name || '').trim();

  return (
    <Animated.View style={{ flex: 1, backgroundColor: bg }}>
      {/* the light gathering low */}
      <Animated.View pointerEvents="none" style={{ position: 'absolute', left: -60, right: -60, bottom: -80, height: 360, opacity: glowOp }}>
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="pauseGlow" cx="50%" cy="100%" rx="72%" ry="72%">
              <Stop offset="0%" stopColor="#E8DCC2" stopOpacity={0.95} />
              <Stop offset="100%" stopColor="#E8DCC2" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#pauseGlow)" />
        </Svg>
      </Animated.View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 26, paddingBottom: 40 }}>
        {phase === 0 ? (
          <Animated.View style={{ marginBottom: 26, opacity: waveOp }}>
            <Svg width={52} height={26} viewBox="0 0 52 26" fill="none">
              <Path d="M3 17 C 10 7 17 7 26 13 S 43 20 49 10" stroke="#9C9C92" strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </Animated.View>
        ) : (
          <Animated.View
            style={{
              width: 54,
              height: 54,
              borderRadius: 9999,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: 'rgba(140,136,123,0.8)',
              marginBottom: 24,
              transform: [{ rotate }],
            }}
          />
        )}

        {/* the title crossfades from light-on-night to ink-on-paper */}
        <View style={{ height: 30, justifyContent: 'center' }}>
          <Animated.Text
            style={{ position: 'absolute', alignSelf: 'center', width: 300, textAlign: 'center', fontFamily: fonts.serif, fontSize: 24, color: NIGHT.ink, opacity: titleLightOp }}>
            {phase === 0 ? 'Reading your answers…' : `Creating ${name ? name + '’s' : 'your'} plan…`}
          </Animated.Text>
          <Animated.Text
            style={{ position: 'absolute', alignSelf: 'center', width: 300, textAlign: 'center', fontFamily: fonts.serif, fontSize: 24, color: PAPER.ink, opacity: titleDarkOp }}>
            {phase === 0 ? 'Reading your answers…' : `Creating ${name ? name + '’s' : 'your'} plan…`}
          </Animated.Text>
        </View>

        {phase === 0 ? (
          <View style={{ marginTop: 24, gap: 10, alignItems: 'center' }}>
            <Animated.Text
              style={{ fontFamily: fonts.serifSharpItalic, fontStyle: 'italic', fontSize: 16, color: NIGHT.ink2, opacity: lineOp(0.1), transform: [{ translateY: lineY(0.1) }] }}>
              {l1}
            </Animated.Text>
            <Animated.Text
              style={{ fontFamily: fonts.serifSharpItalic, fontStyle: 'italic', fontSize: 16, color: NIGHT.ink2, opacity: lineOp(0.26), transform: [{ translateY: lineY(0.26) }] }}>
              {l2}
            </Animated.Text>
          </View>
        ) : (
          <View style={{ marginTop: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 300 }}>
            {chips.map((g, i) => (
              <Animated.View key={g} style={{ opacity: chipOp(i), backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 9999, paddingHorizontal: 14, paddingVertical: 8 }}>
                <AppText style={[sans('500'), { fontSize: 13, color: '#1D1C1A' }]}>{g}</AppText>
              </Animated.View>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// ── the reading — the route map ──────────────────────────────────────
function pattern(a: Record<string, string | string[]>) {
  const t = ((a.triggers as string[]) || []).map((x) => x.toLowerCase());
  const when = t.includes('late at night') ? 'late at night' : t.includes('on my phone in bed') ? 'on your phone in bed' : t[0] || 'in the quiet hours';
  const e = ((a.emotions as string[]) || []).map((x) => x.toLowerCase());
  const drive = e.includes('anxiety or stress')
    ? 'on stress'
    : e.includes('loneliness')
      ? 'on loneliness'
      : e.includes('boredom')
        ? 'on boredom'
        : 'on habit';
  const who = (a.name as string || '').trim();
  return `${who ? who + ' — your' : 'Your'} pull runs strongest ${when}, ${drive}. That is where the campaign begins.`;
}
function RouteMap() {
  const w = 344;
  const h = 268;
  const route = 'M30 218 C 62 214 88 208 112 196 C 140 182 152 168 176 152 C 198 137 214 128 238 112 C 262 96 280 78 300 56';
  const st: [number, number][] = [[30, 218], [62, 213], [96, 203], [128, 188], [160, 163], [190, 143], [220, 124], [248, 105], [276, 82], [300, 56]];
  return (
    <Svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <Path d={`M0 150 L70 118 L128 142 L196 92 L252 118 L${w} 84 L${w} ${h} L0 ${h} Z`} fill={SC.far} />
      <Path d="M196 92 L252 118 L196 130 Z" fill={SC.farShade} />
      <Path d={`M0 190 L58 168 L118 182 L188 136 L244 152 L300 56 L330 96 L${w} 88 L${w} ${h} L0 ${h} Z`} fill={SC.midLit} />
      <Path d="M300 56 L330 96 L300 104 L268 92 Z" fill={SC.midShade} />
      <Path d="M300 56 L286 78 L300 84 L312 72 Z" fill={SC.snow} />
      <Path d="M188 136 L244 152 L188 160 Z" fill={SC.midShade} />
      <Path d={`M0 214 L48 206 L112 216 L190 190 L258 200 L${w} 170 L${w} ${h} L0 ${h} Z`} fill={SC.nearLit} />
      <Path d="M112 216 L190 190 L190 206 L128 222 Z" fill={SC.nearShade} />
      <Path d={`M0 240 L120 236 L${w * 0.42} 250 L0 ${h} Z`} fill={SC.water} />
      <Path d="M10 236 h30M52 244 h22M20 254 h26" stroke={SC.foam} strokeWidth={1.6} strokeLinecap="round" />
      <Path d={route} stroke={colors.bg} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.7} />
      <Path d={route} stroke={SC.ink} strokeWidth={2} strokeLinecap="round" fill="none" />
      {st.map(([x, y], i) =>
        i === 0 ? (
          <Circle key={i} cx={x} cy={y} r={5} fill={colors.ink} stroke={colors.bg} strokeWidth={2} />
        ) : (
          <Circle key={i} cx={x} cy={y} r={3.2} fill={colors.bg} stroke={SC.ink} strokeWidth={1.5} />
        ),
      )}
      <Path d="M300 56 V38" stroke={SC.ink} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M300 38 L314 43 L300 48 Z" fill={colors.ink} />
      <SvgText x={24} y={238} fill={SC.ink} fontSize={10} fontFamily={fonts.serif}>I</SvgText>
      <SvgText x={128} y={176} fill={SC.ink} fontSize={10} fontFamily={fonts.serif}>IV</SvgText>
      <SvgText x={224} y={142} fill={SC.ink} fontSize={10} fontFamily={fonts.serif}>VIII</SvgText>
      <SvgText x={312} y={60} fill={SC.ink} fontSize={10} fontFamily={fonts.serif}>XII</SvgText>
    </Svg>
  );
}
export function O3Reading({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const tone = useTone();
  return (
    <>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <AppText center style={{ fontFamily: fonts.serif, fontSize: 22, lineHeight: 29, letterSpacing: 0.2, color: tone.ink, marginTop: 14, maxWidth: 316, alignSelf: 'center' }}>
          {pattern(answers)}
        </AppText>
        <View style={{ marginTop: 18 }}>
          <RouteMap />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14, paddingHorizontal: 4 }}>
          <AppText style={[sans('600'), { fontSize: 9.5, letterSpacing: 2, textTransform: 'uppercase', color: tone.ink3 }]}>Ten grounds · twelve weeks</AppText>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 12.5, color: tone.ink2 }}>wk I — XII</AppText>
        </View>
      </ScrollView>
      <View style={{ paddingTop: 14 }}>
        <O3Note style={{ marginBottom: 13 }}>No scores. No comparisons. Just the ground, and a way across it.</O3Note>
        <O3CTA label="Continue" onClick={next} />
      </View>
    </>
  );
}

// ═════ 1 · THE ARITHMETIC — the cost of unchanged, no shame ══════════
const OR_FREQ_YEAR: Record<string, string> = {
  'Several times a day': '900+',
  'About once a day': '~365',
  'A few times a week': '~180',
  'About once a week': '~52',
  'A few times a month': '~36',
  'Less than once a month': '~12',
};
const OR_DUR: Record<string, string> = {
  'Less than a year': 'under a year',
  '1–3 years': 'a few years',
  '4–10 years': 'most of a decade',
  'More than 10 years': 'over a decade',
  'I can’t remember a time without it': 'most of a life',
};

export function O3Cost({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const tone = useTone();
  const n = OR_FREQ_YEAR[answers.freq as string] || '~365';
  const dur = OR_DUR[answers.duration as string] || 'years';
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 30 }}>
        <O3H size={26}>Unchanged, this happens about {n} more times by next July.</O3H>
        <O3Sub style={{ marginTop: 16 }}>That’s just your own answer, multiplied by a year. It’s had {dur} — it isn’t planning to stop on its own.</O3Sub>
        {/* the drift — a quiet line that only rises */}
        <View style={{ marginTop: 30, backgroundColor: tone.card, borderRadius: 20, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 12 }}>
          <Svg width="100%" height={120} viewBox="0 0 300 120" fill="none">
            <Path d="M14 96 h272" stroke={tone.soft2} strokeWidth={1.5} strokeLinecap="round" />
            <Path d="M14 78 C 80 74, 150 66, 210 52 C 240 45, 268 36, 286 26" stroke={tone.ink} strokeWidth={2.4} strokeLinecap="round" fill="none" />
            <Circle cx={286} cy={26} r={3.4} fill={tone.ink} />
            <SvgText x={14} y={112} fontFamily={fonts.sans} fontSize={10} fill={tone.ink3} letterSpacing={0.8}>NOW</SvgText>
            <SvgText x={286} y={112} fontFamily={fonts.sans} fontSize={10} fill={tone.ink3} letterSpacing={0.8} textAnchor="end">A YEAR ON</SvgText>
            <SvgText x={282} y={18} fontFamily={fonts.sans} fontSize={10.5} fill={tone.ink2} textAnchor="end">the pull, unattended</SvgText>
          </Svg>
        </View>
        <O3Note style={{ marginTop: 16 }}>No shame in the number. It’s only the direction that matters.</O3Note>
      </View>
      <O3CTA label="Show me the other path" onClick={next} />
    </>
  );
}

// ═════ 2 · THE REWIRE — projected timeline, weeks I–XII ══════════════
export function O3Rewire({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const tone = useTone();
  const dur = OR_DUR[answers.duration as string] || 'years';
  const trig = (((answers.triggers as string[]) || [])[0] || 'late night').toLowerCase();
  const name = String(answers.name || '').trim();
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 30 }}>
        <O3H size={26}>{name ? `${name} — your` : 'Your'} brain can rewire. Here’s the projected shape.</O3H>
        <O3Sub style={{ marginTop: 14 }}>After {dur}, the pathway runs deep — and it is still plastic. Twelve weeks of small, kept days bend it back.</O3Sub>
        <View style={{ marginTop: 28, backgroundColor: tone.card, borderRadius: 20, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 }}>
          <Svg width="100%" height={150} viewBox="0 0 300 150" fill="none">
            <Path d="M14 58 C 90 54, 190 46, 286 34" stroke={tone.ink4} strokeWidth={1.8} strokeDasharray="2 6" strokeLinecap="round" fill="none" />
            <SvgText x={284} y={26} fontFamily={fonts.sans} fontSize={10} fill={tone.ink3} textAnchor="end">left alone</SvgText>
            <Path d="M14 62 C 46 66, 66 78, 92 88 C 140 106, 196 116, 244 121 C 260 122.5, 274 123, 286 123.5" stroke={tone.ink} strokeWidth={2.6} strokeLinecap="round" fill="none" />
            <Circle cx={14} cy={62} r={3.4} fill={tone.ink} />
            <Circle cx={92} cy={88} r={3} fill={tone.ink} />
            <Circle cx={244} cy={121} r={3} fill={tone.ink} />
            <SvgText x={20} y={44} fontFamily={fonts.sans} fontSize={10.5} fill={tone.ink2}>{trig} window guarded</SvgText>
            <SvgText x={98} y={80} fontFamily={fonts.sans} fontSize={10.5} fill={tone.ink2}>urges shorten</SvgText>
            <SvgText x={282} y={112} fontFamily={fonts.sans} fontSize={10.5} fill={tone.ink2} textAnchor="end">just Tuesday</SvgText>
            <Path d="M14 132 h272" stroke={tone.soft2} strokeWidth={1.5} strokeLinecap="round" />
            <SvgText x={14} y={147} fontFamily={fonts.sans} fontSize={10} fill={tone.ink3} letterSpacing={0.6}>WK I</SvgText>
            <SvgText x={105} y={147} fontFamily={fonts.sans} fontSize={10} fill={tone.ink3} letterSpacing={0.6}>III</SvgText>
            <SvgText x={200} y={147} fontFamily={fonts.sans} fontSize={10} fill={tone.ink3} letterSpacing={0.6}>VIII</SvgText>
            <SvgText x={286} y={147} fontFamily={fonts.sans} fontSize={10} fill={tone.ink3} letterSpacing={0.6} textAnchor="end">XII</SvgText>
          </Svg>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 14 }}>
          {([['Stabilise', 'I–II'], ['Rewire', 'III–VIII'], ['Steady', 'IX–XII']] as [string, string][]).map(([t, wk]) => (
            <View key={t} style={{ flexDirection: 'row', gap: 4, backgroundColor: 'rgba(0,0,0,0.045)', borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 6 }}>
              <AppText style={[sans('500'), { fontSize: 11.5, color: tone.ink2 }]}>{t}</AppText>
              <AppText style={[sans('500'), { fontSize: 11.5, color: tone.ink3 }]}>{wk}</AppText>
            </View>
          ))}
        </View>
      </View>
      <O3CTA label="Continue" onClick={next} />
    </>
  );
}

// ── the wave, ridden ─────────────────────────────────────────────────
const WAVE_SECONDS = 20;
const WAVE_PHASES = [
  { at: 0.0, name: 'Notice it', tip: 'Breathe with the water. Nothing to fight.' },
  { at: 0.24, name: 'It rises', tip: 'Let it build. You are not the wave.' },
  { at: 0.48, name: 'The crest', tip: 'This is as strong as it gets.' },
  { at: 0.68, name: 'It breaks', tip: 'Feel it recede. It always does.' },
  { at: 0.87, name: 'Still water', tip: 'Notice the quiet.' },
];
export function O3Wave({ next }: { next: () => void }) {
  const [stage, setStage] = useState<'intro' | 'surf' | 'after' | 'medal'>('intro');
  const [pi, setPi] = useState(0);
  const progressRef = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    if (stage !== 'surf') return;
    let mounted = true;
    const t0 = Date.now();
    const loop = () => {
      if (!mounted) return;
      const p = Math.min(1, (Date.now() - t0) / 1000 / WAVE_SECONDS);
      progressRef.current = p;
      let idx = 0;
      for (let k = 0; k < WAVE_PHASES.length; k++) if (p >= WAVE_PHASES[k].at) idx = k;
      setPi((v) => (v === idx ? v : idx));
      if (p >= 1) {
        setStage('after');
        return;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf.current);
    };
  }, [stage]);

  if (stage === 'intro') {
    return (
      <O3Shell bar={false} lit>
        <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 40 }}>
          <O3H>Before anything else, learn the one move you’ll use most.</O3H>
          <O3Sub>A craving is a wave. It crests, and it breaks — usually inside fifteen minutes. Ride a little water now, and you will know the move for life.</O3Sub>
          <View style={{ marginTop: 30, alignItems: 'center' }}>
            <Svg width={200} height={64} viewBox="0 0 200 64" fill="none">
              <Path d="M8 44 C 40 20 62 20 92 34 S 152 56 192 26" stroke={colors.text} strokeWidth={2.4} strokeLinecap="round" />
              <Path d="M26 54 h28 M78 56 h20 M140 52 h24" stroke={colors.text} strokeWidth={1.4} strokeLinecap="round" opacity={0.4} />
            </Svg>
          </View>
        </View>
        <O3CTA label="Begin the wave" onClick={() => setStage('surf')} />
      </O3Shell>
    );
  }

  if (stage === 'surf' || stage === 'after') {
    const after = stage === 'after';
    return (
      <View style={{ flex: 1, backgroundColor: '#131313', overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: after ? 0.2 : 1 }}>
          <UrgeWave progressRef={progressRef} />
        </View>
        {!after ? (
          <View style={{ position: 'absolute', top: 84, left: 0, right: 0, paddingHorizontal: 30, alignItems: 'center' }}>
            <AppText style={{ fontFamily: fonts.serif, fontSize: 30, letterSpacing: 0.24, color: '#F5F4F1', marginTop: 16 }}>{WAVE_PHASES[pi].name}</AppText>
            <AppText center style={[sans('400'), { fontSize: 13.5, lineHeight: 20, color: 'rgba(245,244,241,0.62)', marginTop: 10, paddingHorizontal: 20 }]}>{WAVE_PHASES[pi].tip}</AppText>
          </View>
        ) : (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 }}>
            <Rise delay={0.6}>
              <AppText center style={{ fontFamily: fonts.serif, fontSize: 25, lineHeight: 33, color: '#F5F4F1' }}>
                That is how a craving passes.{'\n'}It crests, and it breaks.{'\n'}You just rode one out.
              </AppText>
            </Rise>
            <View style={{ position: 'absolute', left: 30, right: 30, bottom: 44 }}>
              <Rise delay={1.2}>
                <Pressable onPress={() => setStage('medal')} style={{ backgroundColor: '#F5F4F1', borderRadius: 9999, paddingVertical: 16, alignItems: 'center' }}>
                  <AppText style={[sans('600'), { fontSize: 15, color: '#131313' }]}>Continue</AppText>
                </Pressable>
              </Rise>
            </View>
          </View>
        )}
        {!after ? (
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 44, alignItems: 'center' }}>
            <AppText style={[sans('500'), { fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: 'rgba(245,244,241,0.4)' }]}>Breathe with the water</AppText>
          </View>
        ) : null}
      </View>
    );
  }

  // medal
  return (
    <O3Shell bar={false} lit>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 30 }}>
        <O3Eyebrow>Earned, not given</O3Eyebrow>
        <View style={{ marginTop: 34 }}>
          <Medallion size={196} />
        </View>
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: colors.text }]}>The First Wave</AppText>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 13.5, color: colors.textSoft, marginTop: 8 }}>
            ridden this day · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </AppText>
        </View>
      </View>
      <O3Note style={{ marginBottom: 13 }}>Medallions are earned by doing. This one is already yours.</O3Note>
      <O3CTA label="Carry it in" onClick={next} />
    </O3Shell>
  );
}

function Medallion({ size = 190 }: { size?: number }) {
  const ink = colors.text;
  return (
    <Svg width={size} height={size} viewBox="0 0 190 190" fill="none">
      <Circle cx={95} cy={95} r={90} stroke={ink} strokeWidth={1.4} strokeDasharray="2.5 6.5" opacity={0.55} />
      <Circle cx={95} cy={95} r={76} stroke={ink} strokeWidth={1.8} />
      <Circle cx={95} cy={95} r={70} stroke={ink} strokeWidth={0.9} opacity={0.6} />
      <Path d="M38 118 C 62 114 76 102 88 82 C 96 68 106 58 118 57 C 138 56 150 70 148 87 C 147 100 136 108 124 104 C 115 101 112 91 118 85 C 122 81 128 82 130 87" stroke={ink} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <Path d="M40 126 q 9 -5 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0" stroke={ink} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Path d="M56 136 h20 M96 136 h24 M134 136 h14" stroke={ink} strokeWidth={1.2} strokeLinecap="round" opacity={0.55} />
      <Path d="M112 46 l0 -6 M124 45 l2 -6 M136 49 l4 -5" stroke={ink} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

// ── pledge ───────────────────────────────────────────────────────────
export function O3Pledge({ name, next }: { name: string; next: () => void }) {
  const [inked, setInked] = useState(false);
  return (
    <>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <O3H size={24} style={{ marginTop: 10 }}>Set your mark.</O3H>
        <View style={{ marginTop: 20, borderRadius: 20, backgroundColor: '#F6F3EB', padding: 22 }}>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 17.5, lineHeight: 28, color: '#22221C' }}>
            I, {name || '————'}, am beginning a campaign of twelve weeks. A slip is a data point. I do not fail twice.
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 16, marginBottom: 14 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(34,34,28,0.14)' }} />
            <AppText style={[sans('600'), { fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(34,34,28,0.45)' }]}>Week I of XII</AppText>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(34,34,28,0.14)' }} />
          </View>
          <Pressable
            onPress={() => setInked(true)}
            style={{ height: 96, borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(34,34,28,0.18)', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' }}>
            {inked ? (
              <Svg width={160} height={54} viewBox="0 0 160 54" fill="none">
                <Path d="M8 34 C 26 10 36 44 52 30 C 64 20 70 40 84 28 C 96 18 104 40 120 26 C 132 16 144 30 152 22" stroke="#22221C" strokeWidth={2.4} strokeLinecap="round" fill="none" />
              </Svg>
            ) : (
              <AppText style={[sans('500'), { fontSize: 13, color: 'rgba(34,34,28,0.4)' }]}>Sign here</AppText>
            )}
          </Pressable>
        </View>
      </ScrollView>
      <View style={{ paddingTop: 14 }}>
        <O3Note style={{ marginBottom: 12 }}>The get-back-up clause is part of the vow — a slip never voids it.</O3Note>
        <O3CTA label="I set my mark" enabled={inked} onClick={next} />
      </View>
    </>
  );
}

// ── letter ───────────────────────────────────────────────────────────
/** The week-XII letter, assembled from the user's own intake answers
 * (canvas: O3_Letter) — the fork where he and the other ending part ways. */
export function buildWeekXiiLetter(a: Record<string, string | string[]>): { name: string; paragraphs: string[] } {
  const name = String(a.name || '').trim();
  const t = (a.triggers as string[]) || [];
  const trigLine = t.includes('Late at night')
    ? 'The late nights'
    : t.includes('Home alone for long stretches')
      ? 'The long stretches alone'
      : t.includes('After stress or a hard day')
        ? 'The hard-day evenings'
        : t.includes('Bored during the day')
          ? 'The slack afternoons'
          : 'The old window';
  const emos = ((a.emotions as string[]) || []).slice(0, 2).map((x) => x.split(' or ')[0].toLowerCase());
  const emoLine = emos.length >= 2 ? `the ${emos[0]} and the ${emos[1]}` : emos.length ? `the ${emos[0]}` : 'the restlessness';
  const costs = a.impact === 'Not really' ? 'the hours, the energy, the quiet' : 'the sleep, the work, the relationships, the money';
  const prize = ['the focus', 'the evenings'];
  return {
    name,
    paragraphs: [
      "It's week XII where I'm writing from, and the first thing to say is: we made it out.",
      `${trigLine} stopped being dangerous around week IV. The urges still came — they just got shorter, then quieter, then rare.`,
      `There was another ending — the one where it kept feeding on ${costs}, and ${emoLine} stayed in charge. I never met that man. Tonight is the fork where he and I part ways.`,
      `Everything you circled tonight — ${prize.join(', ')} — it all came back. It's here, waiting.`,
    ],
  };
}

export function O3Letter({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const { name, paragraphs } = buildWeekXiiLetter(answers);
  return (
    <>
      <O3H size={23} style={{ marginTop: 10 }}>A letter from the man at week XII.</O3H>
      <View style={{ flex: 1, marginTop: 18, backgroundColor: '#F8F6EF', borderRadius: 18, overflow: 'hidden' }}>
        {/* fold crease */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: '34%', height: 1.5, backgroundColor: 'rgba(0,0,0,0.05)' }} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 22, paddingBottom: 18 }} showsVerticalScrollIndicator={false}>
          <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 22, lineHeight: 26, color: '#26261F', marginBottom: 14 }}>
            {name ? `${name} —` : 'Friend —'}
          </AppText>
          {paragraphs.map((para, i) => (
            <AppText key={i} style={{ fontFamily: fonts.serifSharp, fontSize: 15.5, lineHeight: 25, color: '#3B3B33', marginBottom: 14 }}>
              {para}
            </AppText>
          ))}
          <View style={{ marginTop: 4, gap: 3 }}>
            <AppText style={{ fontFamily: fonts.serifSharpItalic, fontSize: 17.5, color: '#26261F' }}>— you, at week XII</AppText>
            <Svg width={130} height={11} viewBox="0 0 130 11" fill="none">
              <Path d="M2 7 C 30 2, 50 9, 74 5.5 S 116 4, 128 6.5" stroke="rgba(38,38,31,0.5)" strokeWidth={1.5} strokeLinecap="round" />
            </Svg>
          </View>
        </ScrollView>
      </View>
      <View style={{ paddingTop: 14 }}>
        <O3CTA label="Take his letter with you" onClick={next} />
      </View>
    </>
  );
}

// ── Day I ────────────────────────────────────────────────────────────
function windowFor(a: Record<string, string | string[]>): [string, string] {
  const t = (a.triggers as string[]) || [];
  if (t.includes('Late at night') || t.includes('On my phone in bed') || t.includes('When I can’t sleep')) return ['11:00 pm', 'before the tide rises'];
  if (t.includes('After stress or a hard day')) return ['6:00 pm', 'as the day lets go'];
  if (t.includes('Bored during the day')) return ['9:00 pm', 'when the evening goes slack'];
  return ['9:30 pm', 'before the quiet hours'];
}
export function O3DayOne({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const tone = useTone();
  const [time, why] = windowFor(answers);
  return (
    <>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
        <AppText style={[sans('600'), { fontSize: 15, letterSpacing: 4, textTransform: 'uppercase', color: tone.ink }]}>Day I</AppText>
        <View style={{ width: 40, height: 1.5, backgroundColor: tone.ink, marginTop: 12 }} />
        <O3Sub style={{ marginTop: 26, fontSize: 15, color: tone.ink }}>Already lit — the wave you rode counts.</O3Sub>
        <O3Sub style={{ marginTop: 8 }}>Days are counted, never owed. A slip does not send you to zero.</O3Sub>
        <View style={{ marginTop: 34, backgroundColor: tone.card, borderRadius: 20, padding: 20, flexDirection: 'row', gap: 15, alignItems: 'flex-start' }}>
          <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" style={{ marginTop: 2 }}>
            <Path d="M12 3.4a5.8 5.8 0 0 1 5.8 5.8v3.6l1.7 2.4a1 1 0 0 1-.8 1.6H5.3a1 1 0 0 1-.8-1.6l1.7-2.4V9.2A5.8 5.8 0 0 1 12 3.4z" stroke={tone.ink} strokeWidth={1.7} strokeLinejoin="round" />
            <Path d="M9.8 18.8a2.2 2.2 0 0 0 4.4 0" stroke={tone.ink} strokeWidth={1.7} />
          </Svg>
          <View style={{ flex: 1 }}>
            <AppText style={[sans('600'), { fontSize: 14, color: tone.ink }]}>A quiet word at {time}</AppText>
            <AppText style={[sans('400'), { fontSize: 12.5, lineHeight: 19, color: tone.ink2, marginTop: 3 }]}>Your window, {why}. One line, once a day. Never “your streak misses you.”</AppText>
          </View>
        </View>
      </View>
      <O3CTA label="Set the quiet word" onClick={next} />
      <O3CTA ghost label="You can ask for it later" onClick={next} />
    </>
  );
}

// ── notification permission (pre-screened) ───────────────────────────
export function O3Notify({ answers, next }: { answers: Record<string, string | string[]>; next: () => void }) {
  const tone = useTone();
  const [ask, setAsk] = useState(false);
  const [time] = windowFor(answers);
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 40 }}>
        <O3H size={24}>Your phone will ask its own question now.</O3H>
        <O3Sub>Allowing it turns on exactly one thing — the {time} word you just asked for. Nothing else, ever.</O3Sub>
        <View style={{ marginTop: 28, backgroundColor: tone.card, borderRadius: 18, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'flex-start', transform: [{ rotate: '-1.5deg' }] }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: tone.fill, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={18} height={12} viewBox="0 0 34 20" fill="none">
              <Path d="M2 11h6l2.6-8 4.4 16 2.6-8h3l1.6-3 1.6 3H32" stroke={tone.onFill} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <AppText style={[sans('600'), { fontSize: 13, color: tone.ink }]}>VICI</AppText>
              <AppText style={[sans('500'), { fontSize: 10.5, color: tone.ink3 }]}>{time}</AppText>
            </View>
            <AppText style={[sans('400'), { fontSize: 12.5, lineHeight: 18, color: tone.ink2, marginTop: 2 }]}>The tide is rising. You know the move.</AppText>
          </View>
        </View>
      </View>
      <O3CTA label="Continue" onClick={() => setAsk(true)} />
      {ask ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(19,19,19,0.32)', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <View style={{ width: 268, borderRadius: 16, backgroundColor: '#F6F5F2', overflow: 'hidden' }}>
            <View style={{ padding: 20, paddingBottom: 16, alignItems: 'center' }}>
              <AppText center style={{ fontFamily: fonts.body, fontWeight: '600', fontSize: 15.5, color: '#111' }}>“VICI” Would Like to Send You Notifications</AppText>
              <AppText center style={{ fontFamily: fonts.body, fontSize: 12.5, color: '#4B4B4B', marginTop: 7, lineHeight: 17 }}>One quiet word a day, at the time you chose.</AppText>
            </View>
            <View style={{ flexDirection: 'row', borderTopWidth: 0.8, borderTopColor: 'rgba(0,0,0,0.16)' }}>
              <Pressable onPress={next} style={{ flex: 1, paddingVertical: 13, alignItems: 'center', borderRightWidth: 0.8, borderRightColor: 'rgba(0,0,0,0.16)' }}>
                <AppText style={{ fontFamily: fonts.body, fontSize: 15.5, color: '#0A66C2' }}>Don’t Allow</AppText>
              </Pressable>
              <Pressable onPress={next} style={{ flex: 1, paddingVertical: 13, alignItems: 'center' }}>
                <AppText style={{ fontFamily: fonts.body, fontWeight: '600', fontSize: 15.5, color: '#0A66C2' }}>Allow</AppText>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
}

// ── save ─────────────────────────────────────────────────────────────
const HOLDINGS: [string, string][] = [
  ['Your map', 'ten grounds, routed'],
  ['Your mark', 'the pledge, signed'],
  ['Your letter', 'sealed for day III'],
  ['The First Wave', 'a medallion, earned'],
  ['Day I', 'already lit'],
];
export function O3Save({ next }: { next: () => void }) {
  const tone = useTone();
  return (
    <>
      <O3Eyebrow>Deferred, on purpose</O3Eyebrow>
      <O3H size={24} style={{ marginTop: 10 }}>Keep your campaign safe.</O3H>
      <O3Sub style={{ marginTop: 10 }}>You now hold five things worth not losing.</O3Sub>
      <View style={{ flex: 1, marginTop: 20 }}>
        <View style={{ backgroundColor: tone.card, borderRadius: 20, paddingHorizontal: 20 }}>
          {HOLDINGS.map(([t, s], i) => (
            <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13.5, borderBottomWidth: i < HOLDINGS.length - 1 ? 1 : 0, borderBottomColor: tone.line }}>
              <View style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: tone.ink }} />
              <AppText style={[sans('500'), { flex: 1, fontSize: 14, color: tone.ink }]}>{t}</AppText>
              <AppText style={[sans('400'), { fontSize: 12, color: tone.ink3 }]}>{s}</AppText>
            </View>
          ))}
        </View>
      </View>
      <View style={{ paddingTop: 16 }}>
        <O3CTA label="Save with a passkey" onClick={next} />
        <O3CTA ghost label="Later" onClick={next} style={{ fontSize: 12.5, color: tone.ink3 }} />
      </View>
    </>
  );
}

// ── paywall ──────────────────────────────────────────────────────────
function O3PlanRow({ tone, on, name, price, note, onPress }: { tone: Tone; on: boolean; name: string; price: string; note: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: tone.card, borderRadius: 18, padding: 16, borderWidth: on ? 1.7 : 0, borderColor: tone.ink }}>
      <View style={{ width: 19, height: 19, borderRadius: 9999, borderWidth: on ? 0 : 1.6, borderColor: tone.soft2, backgroundColor: on ? tone.fill : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {on ? (
          <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
            <Path d="M4.5 12.5l4.6 4.6L19.5 7" stroke={tone.onFill} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <AppText style={[sans('600'), { fontSize: 14.5, color: tone.ink }]}>{name}</AppText>
        <AppText style={[sans('400'), { fontSize: 12, color: tone.ink2, marginTop: 2 }]}>{note}</AppText>
      </View>
      <AppText style={[sans('600'), { fontSize: 15.5, color: tone.ink }]}>
        {price}
        <AppText style={[sans('400'), { fontSize: 11.5, color: tone.ink3 }]}>/yr</AppText>
      </AppText>
    </Pressable>
  );
}

export function O3Paywall({ answers, next, onFree }: { answers: Record<string, string | string[]>; next: () => void; onFree: () => void }) {
  const tone = useTone();
  const [plan, setPlan] = useState<'plus' | 'coach'>('plus');
  const prize = ((answers.prize as string[]) || []).slice(0, 3).map((x) => x.toLowerCase());
  return (
    <>
      <O3Eyebrow>Vici Plus</O3Eyebrow>
      <O3H size={24} style={{ marginTop: 10 }}>The full campaign, to week XII.</O3H>
      <ScrollView style={{ flex: 1, marginTop: 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: tone.card, borderRadius: 20, padding: 14 }}>
          <RouteMap />
        </View>
        <View style={{ marginTop: 14, paddingHorizontal: 18, backgroundColor: tone.card, borderRadius: 18 }}>
          {[
            ['All ten grounds', 'the campaign past the Landing'],
            ['Insights', prize.length ? `read off your logs — ${prize.join(', ')}` : 'read off your own logs'],
            ['Medallions & letters', 'earned, kept, delivered'],
          ].map(([t, s], i, arr) => (
            <View key={t} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, paddingVertical: 11.5, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: tone.line }}>
              <View style={{ width: 5, height: 5, borderRadius: 9999, backgroundColor: tone.ink }} />
              <AppText style={[sans('600'), { fontSize: 13, color: tone.ink }]}>{t}</AppText>
              <AppText style={[sans('400'), { flex: 1, fontSize: 12, color: tone.ink2 }]}>{s}</AppText>
            </View>
          ))}
        </View>
        <View style={{ gap: 9, marginTop: 14 }}>
          <O3PlanRow tone={tone} on={plan === 'plus'} name="Plus" price="$39.99" note="The full campaign" onPress={() => setPlan('plus')} />
          <O3PlanRow tone={tone} on={plan === 'coach'} name="Plus, with coach" price="$99.99" note="A human in your corner, weekly" onPress={() => setPlan('coach')} />
        </View>
      </ScrollView>
      <View style={{ paddingTop: 14 }}>
        <O3CTA label={plan === 'coach' ? 'Continue — $99.99 a year' : 'Continue — $39.99 a year'} onClick={next} />
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Pressable onPress={onFree} style={{ borderWidth: 1.4, borderColor: tone.soft2, borderRadius: 9999, paddingVertical: 11, paddingHorizontal: 24 }}>
            <AppText style={[sans('600'), { fontSize: 13.5, color: tone.ink }]}>Continue with the free tools</AppText>
          </Pressable>
        </View>
        <O3Note style={{ marginTop: 11 }}>The urge tool is free forever. Price is the price — no timers, no “deals.”</O3Note>
      </View>
    </>
  );
}
