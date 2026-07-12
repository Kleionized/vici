import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useId, useRef, useState } from 'react';
import { Animated, type LayoutChangeEvent, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, ClipPath, Defs, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, Card, Glyph, type GlyphName, SectionLabel } from '@/components/ui';
import { useTodayCheckin, useUpsertCheckin } from '@/lib/backend';
import { todayKey } from '@/lib/date';
import { colors, spacing } from '@/lib/theme';

// ── mood model (maps to the app's 1–5 mood scale) ───────────────────────────
const MOODS = [
  { key: 'low', label: 'Low' },
  { key: 'down', label: 'Down' },
  { key: 'fine', label: 'Fine' },
  { key: 'good', label: 'Good' },
  { key: 'radiant', label: 'Radiant' },
] as const;
type MoodKey = (typeof MOODS)[number]['key'];

const FEELINGS: Record<MoodKey, string[]> = {
  low: ['Drained', 'Anxious', 'Overwhelmed', 'Numb', 'Lonely', 'Defeated', 'Tense', 'Foggy', 'Irritable'],
  down: ['Tired', 'Restless', 'Annoyed', 'Discouraged', 'Distracted', 'Worried', 'Flat', 'Insecure', 'Bored'],
  fine: ['Okay', 'Steady', 'Neutral', 'Settled', 'Present', 'Reserved', 'Even', 'Quiet', 'Patient'],
  good: ['Content', 'Motivated', 'Hopeful', 'Focused', 'Rested', 'Grateful', 'Capable', 'Connected', 'Light'],
  radiant: ['Energised', 'Joyful', 'Grateful', 'Proud', 'Inspired', 'Confident', 'Playful', 'Alive', 'Free'],
};

// the reasons icon set (canvas: FIcon) — solid engraved marks, one per reason
const FIcon: Record<string, (c: string) => React.ReactNode> = {
  work: (c) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path fillRule="evenodd" d="M7.5 2.5h6.1L18 6.9V20a1.6 1.6 0 01-1.6 1.6H7.6A1.6 1.6 0 016 20V4.1A1.6 1.6 0 017.6 2.5zM8.5 9.2h7v1.7h-7zM8.5 12.7h7v1.7h-7zM8.5 16.2h4.6v1.7H8.5z" fill={c} />
    </Svg>
  ),
  sleep: (c) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path fillRule="evenodd" d="M20.1 15.1A8.7 8.7 0 1 1 8.9 3.9 8.7 8.7 0 0 0 20.1 15.1ZM9.4 11.3a1.4 1.4 0 1 0 .001 0ZM12.8 16.1a1 1 0 1 0 .001 0Z" fill={c} />
    </Svg>
  ),
  health: (c) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path d="M12 21S3.4 14.4 3.4 8.7A4.5 4.5 0 0112 6a4.5 4.5 0 018.6 2.7C20.6 14.4 12 21 12 21z" fill={c} />
    </Svg>
  ),
  people: (c) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Circle cx={12} cy={7.7} r={4.1} fill={c} />
      <Path d="M3.6 20.4c0-4.2 3.8-6.6 8.4-6.6s8.4 2.4 8.4 6.6z" fill={c} />
    </Svg>
  ),
  money: (c) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path fillRule="evenodd" d="M4 5.5h16a2 2 0 012 2V16.5a2 2 0 01-2 2H4a2 2 0 01-2-2V7.5a2 2 0 012-2zM2 9.3h20v2.1H2zM5.5 14.4h4v1.7h-4z" fill={c} />
    </Svg>
  ),
  weather: (c) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={4.7} fill={c} />
      <G stroke={c} strokeWidth={2.1} strokeLinecap="round">
        <Path d="M12 2.4v2.6M12 19v2.6M2.4 12H5M19 12h2.6M5.1 5.1l1.8 1.8M17.1 17.1l1.8 1.8M18.9 5.1l-1.8 1.8M6.9 17.1l-1.8 1.8" />
      </G>
    </Svg>
  ),
  rest: (c) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path d="M20.5 3.5C12 3 5 7 4.4 14.2c-.3 3.6 1.7 5.4 1.7 5.4S7 14 11 11c0 0-3.4 3.4-4.4 8.8 0 0 9.8 1.6 13-7.2 1.2-3.3 1.4-6.6.9-9.1z" fill={c} />
    </Svg>
  ),
  focus: (c) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path fillRule="evenodd" d="M12 4.5C5.5 4.5 2 12 2 12s3.5 7.5 10 7.5S22 12 22 12 18.5 4.5 12 4.5zM12 8.6a3.4 3.4 0 100 6.8 3.4 3.4 0 000-6.8z" fill={c} />
    </Svg>
  ),
  time: (c) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path fillRule="evenodd" d="M12 2.7a9.3 9.3 0 100 18.6 9.3 9.3 0 000-18.6zM11.1 6.6h1.8v6.1l4.2 2.4-.9 1.6-5.1-3z" fill={c} />
    </Svg>
  ),
};

const REASONS: [string, string][] = [
  ['Work', 'work'],
  ['Sleep', 'sleep'],
  ['Health', 'health'],
  ['People', 'people'],
  ['Money', 'money'],
  ['Weather', 'weather'],
  ['Rest', 'rest'],
  ['Focus', 'focus'],
  ['Time', 'time'],
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const moodIndex = (t: number) => Math.round(t * (MOODS.length - 1));

// ── colour helpers — RN-SVG can't do color-mix(), so blend hex → rgb ─────────
const MTONE = colors.moodTones;
function hexToRgb(h: string): [number, number, number] {
  // accepts '#RRGGBB' or an 'rgb(r, g, b)' string (mix() output feeds back in)
  if (h.startsWith('rgb')) {
    const m = h.match(/(\d+)[^\d]+(\d+)[^\d]+(\d+)/);
    if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  }
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)}, ${Math.round(A[1] + (B[1] - A[1]) * t)}, ${Math.round(A[2] + (B[2] - A[2]) * t)})`;
}
const smooth = (t: number, a: number, b: number) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

// wavy sea band (filled to the bottom) + its crest line, in the disc's 200×200 space
function mBand(y: number, a: number, segs = 3): string {
  const seg = 200 / segs;
  let d = `M-2 ${y}`;
  for (let i = 0; i < segs; i++) {
    const x0 = -2 + i * seg;
    const dir = i % 2 === 0 ? -1 : 1;
    d += ` C ${x0 + seg * 0.33} ${y + dir * a}, ${x0 + seg * 0.66} ${y + dir * a}, ${x0 + seg} ${y}`;
  }
  return `${d} L202 202 L-2 202 Z`;
}
function mLine(y: number, a: number, segs = 3): string {
  const seg = 204 / segs;
  let d = `M-2 ${y}`;
  for (let i = 0; i < segs; i++) {
    const sx = -2 + i * seg;
    const dir = i % 2 === 0 ? -1 : 1;
    d += ` C ${sx + seg * 0.33} ${y + dir * a}, ${sx + seg * 0.66} ${y + dir * a}, ${sx + seg} ${y}`;
  }
  return d;
}
const gullPath = (x: number, y: number, s: number) =>
  `M${x - 6 * s} ${y} Q ${x - 3 * s} ${y - 4 * s} ${x} ${y - 0.6 * s} Q ${x + 3 * s} ${y - 4 * s} ${x + 6 * s} ${y}`;

// ── central visual: the WEATHER medallion (canvas: MoodSceneWeatherToned) —
// the day over the bay, morphing along the mood ramp: storm & rain at Low,
// the cloud thinning, the sun rising out of the sea for Good / Radiant. Ground
// deepens along MOOD_TONES; content flips dark→paper as the disc darkens. ──
function MoodWeather({ t, size = 200 }: { t: number; size?: number }) {
  const uid = useId().replace(/:/g, '');
  const seg = Math.min(3.999, Math.max(0, t * 4));
  const si = Math.floor(seg);
  const bg = mix(MTONE[si], MTONE[Math.min(4, si + 1)], seg - si);
  const flip = smooth(t, 0.5, 0.72);
  const fg = mix('#2E2E2E', '#F6F6F5', flip);
  const into = (o: number) => mix(bg, fg, o);

  const sunOn = smooth(t, 0.55, 0.8);
  const rain = 1 - smooth(t, 0.1, 0.42);
  const bolt = 1 - smooth(t, 0.04, 0.16);
  const cloudOp = 1 - smooth(t, 0.55, 0.78);
  const amp = lerp(6.5, 2.2, t);
  const sunX = lerp(124, 60, t);
  const sunY = lerp(122, 52, t);

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id={`clip-${uid}`}>
          <Circle cx={100} cy={100} r={96} />
        </ClipPath>
        <RadialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={fg} stopOpacity={0.8} />
          <Stop offset="60%" stopColor={fg} stopOpacity={0.28} />
          <Stop offset="100%" stopColor={fg} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`vig-${uid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <Stop offset="72%" stopColor="#000000" stopOpacity={0} />
          <Stop offset="100%" stopColor="#000000" stopOpacity={0.22} />
        </RadialGradient>
      </Defs>
      <G clipPath={`url(#clip-${uid})`}>
        <Rect width={200} height={200} fill={bg} />
        {/* the sun climbing out of the sea as the day clears */}
        <Circle cx={sunX} cy={sunY} r={lerp(26, 44, t)} fill={`url(#glow-${uid})`} opacity={sunOn * 0.55} />
        <Circle cx={sunX} cy={sunY} r={lerp(11, 17, t)} fill={fg} opacity={sunOn} />
        {/* the faceted peak across the bay — low-poly planes fanning from the
            summit, base under the waterline so the sea bands meet it clean */}
        <Path d="M2 142 L56 82 L36 142 Z" fill={into(0.3)} />
        <Path d="M36 142 L56 82 L82 142 Z" fill={into(0.42)} />
        <Path d="M56 82 L118 142 L82 142 Z" fill={into(0.56)} />
        <Path d="M56 82 L62 96 L50 99 Z" fill={into(0.72)} />
        {/* the low ridge on the far right */}
        <Path d="M100 142 L154 116 L198 142 Z" fill={into(0.3)} />
        <Path d="M154 116 L198 142 L166 142 Z" fill={into(0.44)} />
        {/* THE cloud — thins as the mood lifts, gone by Good; rain + bolt at the low end */}
        <G opacity={cloudOp}>
          <Path d="M86 80 A 12.5 12.5 0 0 1 90.5 57 A 15.5 15.5 0 0 1 118 46 A 14 14 0 0 1 144 50.5 A 12 12 0 0 1 163.5 62 A 10.5 10.5 0 0 1 165 80 Z" fill={into(0.88)} />
          <Path d="M90 80 L162 80 C 160 84.5 154 87 146 87 L105 87 C 97 87 92 84.5 90 80 Z" fill={into(0.68)} />
          <G stroke={into(0.7)} strokeWidth={2.1} strokeLinecap="round" opacity={rain}>
            <Path d="M100 94 l-4 13 M120 96 l-4 13 M140 94 l-4 13 M110 110 l-3.4 11 M130 112 l-3.4 11 M150 108 l-3.4 11" />
          </G>
          <Path d="M126 86 L118 104 L125 104 L116 122 L132 102 L124 102 L132 86 Z" fill={fg} opacity={bolt} />
        </G>
        {/* the sea — three banded planes, choppy → glassy */}
        <Path d={mBand(132, amp)} fill={into(0.16 * (1 - 0.58 * sunOn))} />
        <Path d={mLine(132, amp)} stroke={into(0.6)} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.8 - 0.5 * sunOn} />
        {/* the light path — sharp facet diamonds stepping down the water */}
        <G opacity={smooth(t, 0.55, 0.82) * 0.92}>
          <Path d="M47 137 L60 134.2 L73 137 L60 139.8 Z" fill={fg} />
          <Path d="M46 146 L55 143.8 L64 146 L55 148.2 Z" fill={fg} opacity={0.85} />
          <Path d="M54 155 L65 152.8 L76 155 L65 157.2 Z" fill={fg} opacity={0.7} />
          <Path d="M50 166 L58 164.2 L66 166 L58 167.8 Z" fill={fg} opacity={0.55} />
          <Path d="M56 177 L65 175.4 L74 177 L65 178.6 Z" fill={fg} opacity={0.4} />
        </G>
        <Path d={mBand(154, amp * 0.85)} fill={into(0.26 * (1 - 0.58 * sunOn))} />
        <Path d={mLine(154, amp * 0.85)} stroke={into(0.6)} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.65 - 0.42 * sunOn} />
        <Circle cx={54} cy={149} r={1.8} fill={into(0.7)} opacity={rain * 0.9} />
        <Circle cx={74} cy={152} r={1.3} fill={into(0.7)} opacity={rain * 0.7} />
        <Circle cx={142} cy={150} r={1.6} fill={into(0.7)} opacity={rain * 0.8} />
        <Path d={mBand(176, amp * 0.7)} fill={into(0.36 * (1 - 0.58 * sunOn))} />
        <Path d={mLine(176, amp * 0.7)} stroke={into(0.6)} strokeWidth={1.6} strokeLinecap="round" fill="none" opacity={0.55 - 0.36 * sunOn} />
        {/* gulls return with the light */}
        <Path d={gullPath(58, 96, 0.9)} stroke={fg} strokeWidth={1.7} strokeLinecap="round" fill="none" opacity={smooth(t, 0.55, 0.8) * 0.8} />
        <Path d={gullPath(78, 86, 0.7)} stroke={fg} strokeWidth={1.3} strokeLinecap="round" fill="none" opacity={smooth(t, 0.64, 0.88) * 0.6} />
        {/* soft edge vignette — the disc breathes darker at its rim */}
        <Circle cx={100} cy={100} r={96} fill={`url(#vig-${uid})`} opacity={0.35 + 0.55 * t} />
      </G>
      <Circle cx={100} cy={100} r={95.2} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={1.6} />
    </Svg>
  );
}

/** The medallion sits still — no pulsation. */
function Breathe({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// ── draggable mood slider with a cool→warm track ────────────────────────────
function MoodSlider({ value, onChange }: { value: number; onChange: (t: number) => void }) {
  const width = useRef(0);
  const idx = moodIndex(value);
  const onLayout = (e: LayoutChangeEvent) => (width.current = e.nativeEvent.layout.width);
  const handle = (x: number) => {
    if (!width.current) return;
    onChange(Math.max(0, Math.min(1, x / width.current)));
  };
  return (
    <View>
      <View
        onLayout={onLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(e) => handle(e.nativeEvent.locationX)}
        onResponderMove={(e) => handle(e.nativeEvent.locationX)}
        style={{ height: 44, justifyContent: 'center' }}>
        <LinearGradient
          colors={[MTONE[0], MTONE[2], MTONE[4]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ position: 'absolute', left: 0, right: 0, height: 6, borderRadius: 9999 }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: `${value * 100}%`,
            marginLeft: -13,
            width: 26,
            height: 26,
            borderRadius: 9999,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOpacity: 0.22,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
        {MOODS.map((m, i) => (
          <AppText
            key={m.key}
            weightOverride={i === idx ? '600' : '500'}
            style={{ fontSize: 13.5, letterSpacing: -0.1, color: i === idx ? colors.text : colors.textSoft }}>
            {m.label}
          </AppText>
        ))}
      </View>
    </View>
  );
}

// ── shared chrome ───────────────────────────────────────────────────────────
function CheckTop({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 }}>
      <Pressable onPress={onBack} hitSlop={8} accessibilityLabel="Back" style={{ marginLeft: -4, padding: 4 }}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M15 5l-7 7 7 7" stroke={colors.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i <= step ? colors.text : colors.borderStrong }} />
        ))}
      </View>
      <View style={{ width: 22 }} />
    </View>
  );
}

function ContinueBtn({ label = 'Continue', enabled = true, onPress }: { label?: string; enabled?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={enabled ? onPress : undefined}
      disabled={!enabled}
      style={{
        width: '100%',
        backgroundColor: colors.accent,
        borderRadius: 9999,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        opacity: enabled ? 1 : 0.32,
      }}>
      <AppText weightOverride="500" color={colors.accentText} style={{ fontSize: 16, letterSpacing: 0.16 }}>
        {label}
      </AppText>
      <Arrow color={colors.accentText} />
    </Pressable>
  );
}

function Arrow({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h13M13 6l6 6-6 6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function WordPill({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 9999,
        backgroundColor: on ? colors.accent : colors.surface,
        borderWidth: on ? 0 : 1.5,
        borderColor: colors.border,
      }}>
      <AppText weightOverride="600" color={on ? colors.accentText : colors.text} style={{ fontSize: 16, letterSpacing: -0.1 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

function ReasonCell({ label, glyph, on, onPress }: { label: string; glyph: GlyphName; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: 'center',
        gap: 10,
        paddingVertical: 18,
        paddingHorizontal: 8,
        borderRadius: 18,
        backgroundColor: on ? colors.accentSoft : colors.surface,
        borderWidth: on ? 1.6 : 1.5,
        borderColor: on ? colors.text : colors.border,
      }}>
      <View style={{ width: 46, height: 46, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? colors.accent : colors.accentSoft }}>
        <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>{FIcon[glyph](on ? colors.accentText : colors.text)}</View>
      </View>
      <AppText weightOverride={on ? '600' : '500'} style={{ fontSize: 14.5, letterSpacing: -0.1 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

// ── the flow ────────────────────────────────────────────────────────────────
export default function CheckIn() {
  const router = useRouter();
  const today = useTodayCheckin();
  const upsert = useUpsertCheckin();

  const [step, setStep] = useState(0);
  const [value, setValue] = useState(0.5);
  const [feelings, setFeelings] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  const moodKey = MOODS[moodIndex(value)].key;
  const mood = MOODS[moodIndex(value)];

  const toggle = (list: string[], set: (v: string[]) => void) => (x: string) =>
    set(list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  async function save() {
    // Preserve any behavioural fields already logged today (sleep, movement…).
    await upsert({
      date: todayKey(),
      mood: moodIndex(value) + 1,
      emotions: feelings.length ? feelings : undefined,
      reasons: reasons.length ? reasons : undefined,
      sleepHours: today?.sleepHours,
      movedBody: today?.movedBody,
      socialContact: today?.socialContact,
      structureFollowed: today?.structureFollowed,
      note: today?.note,
    });
    setStep(3);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }} edges={['top', 'bottom']}>
        {/* STEP 0 — mood slider */}
        {step === 0 ? (
          <>
            <CheckTop step={0} onBack={close} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Breathe>
                <MoodWeather t={value} />
              </Breathe>
              <AppText variant="hero" style={{ fontSize: 42, marginTop: 18 }}>
                {mood.label}
              </AppText>
              <AppText weightOverride="500" color={colors.textMuted} style={{ fontSize: 17, marginTop: 6 }}>
                How are you feeling today?
              </AppText>
            </View>
            <View style={{ paddingBottom: 8 }}>
              <MoodSlider value={value} onChange={setValue} />
            </View>
            <View style={{ paddingTop: 26, paddingBottom: spacing.sm }}>
              <ContinueBtn onPress={() => setStep(1)} />
            </View>
          </>
        ) : null}

        {/* STEP 1 — feelings */}
        {step === 1 ? (
          <>
            <CheckTop step={1} onBack={() => setStep(0)} />
            <View style={{ marginTop: 20 }}>
              <AppText variant="display" style={{ fontSize: 30 }}>
                What best describes it?
              </AppText>
              <AppText weightOverride="500" color={colors.textMuted} style={{ fontSize: 16, lineHeight: 22, marginTop: 12 }}>
                You&apos;re feeling {mood.label.toLowerCase()}. Pick the words that fit — as many as you like.
              </AppText>
            </View>
            <ScrollView style={{ flex: 1, marginTop: 26 }} showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {FEELINGS[moodKey].map((w) => (
                  <WordPill key={w} label={w} on={feelings.includes(w)} onPress={() => toggle(feelings, setFeelings)(w)} />
                ))}
              </View>
            </ScrollView>
            <View style={{ paddingTop: 16, paddingBottom: spacing.sm }}>
              <ContinueBtn enabled={feelings.length > 0} onPress={() => setStep(2)} label={feelings.length ? `Continue · ${feelings.length}` : 'Continue'} />
            </View>
          </>
        ) : null}

        {/* STEP 2 — reasons */}
        {step === 2 ? (
          <>
            <CheckTop step={2} onBack={() => setStep(1)} />
            <View style={{ marginTop: 20 }}>
              <AppText variant="display" style={{ fontSize: 30 }}>
                What&apos;s behind it?
              </AppText>
              <AppText weightOverride="500" color={colors.textMuted} style={{ fontSize: 16, lineHeight: 22, marginTop: 12 }}>
                The things shaping today. Tap any that played a part.
              </AppText>
            </View>
            <ScrollView style={{ flex: 1, marginTop: 26 }} showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }}>
                {REASONS.map(([label, glyph]) => (
                  <View key={label} style={{ width: '31.5%' }}>
                    <ReasonCell label={label} glyph={glyph} on={reasons.includes(label)} onPress={() => toggle(reasons, setReasons)(label)} />
                  </View>
                ))}
              </View>
            </ScrollView>
            <View style={{ paddingTop: 16, paddingBottom: spacing.sm }}>
              <ContinueBtn enabled={reasons.length > 0} onPress={save} label="Save check-in" />
            </View>
          </>
        ) : null}

        {/* STEP 3 — done summary */}
        {step === 3 ? (
          <>
            <CheckTop step={2} onBack={close} />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center', paddingTop: spacing.sm }} showsVerticalScrollIndicator={false}>
              <Breathe>
                <MoodWeather t={value} size={150} />
              </Breathe>
              <SectionLabel style={{ marginTop: 8 }}>Checked in</SectionLabel>
              <AppText variant="hero" center style={{ fontSize: 40, marginTop: 10 }}>
                Feeling {mood.label.toLowerCase()}.
              </AppText>

              <View style={{ width: '100%', marginTop: 30, gap: 14 }}>
                <Card>
                  <SectionLabel style={{ marginBottom: 10 }}>In words</SectionLabel>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {(feelings.length ? feelings : ['—']).map((w) => (
                      <Chip key={w} label={w} />
                    ))}
                  </View>
                </Card>
                <Card>
                  <SectionLabel style={{ marginBottom: 10 }}>Behind it</SectionLabel>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {(reasons.length ? reasons : ['—']).map((r) => (
                      <Chip key={r} label={r} />
                    ))}
                  </View>
                </Card>
              </View>
            </ScrollView>
            <View style={{ paddingTop: 18, paddingBottom: spacing.sm }}>
              <ContinueBtn label="Done" onPress={close} />
            </View>
          </>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <View style={{ backgroundColor: colors.accentSoft, borderRadius: 9999, paddingHorizontal: 13, paddingVertical: 7 }}>
      <AppText weightOverride="600" style={{ fontSize: 14.5 }}>
        {label}
      </AppText>
    </View>
  );
}
