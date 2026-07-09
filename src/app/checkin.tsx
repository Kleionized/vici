import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, type LayoutChangeEvent, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';

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

const REASONS: [string, GlyphName][] = [
  ['Work', 'doc'],
  ['Sleep', 'moon'],
  ['Health', 'heart'],
  ['People', 'user'],
  ['Money', 'card'],
  ['Weather', 'sun'],
  ['Rest', 'leaf'],
  ['Focus', 'compass'],
  ['Time', 'clock'],
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const moodIndex = (t: number) => Math.round(t * (MOODS.length - 1));

// mood-mapped tone: cool blue (low) → warm coral (radiant). RN-safe rgba.
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return [f(0), f(8), f(4)];
}
function moodTone(t: number, vivid: boolean) {
  const [r, g, b] = hslToRgb(lerp(248, 24, t), vivid ? 0.62 : 0.46, 0.64);
  return (al = 1) => `rgba(${r}, ${g}, ${b}, ${al})`;
}

// ── central visual: a soft layered bloom that morphs by mood ─────────────────
function MoodBloom({ t, vivid, size = 200 }: { t: number; vivid: boolean; size?: number }) {
  const tone = moodTone(t, vivid);
  const offset = lerp(9, 24, t);
  const ry = lerp(34, 48, t);
  const rx = lerp(23, 27, t);
  const op = lerp(0.34, 0.46, t);
  const core = lerp(9, 15, t);
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <RadialGradient id="ci-glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={tone(0.22)} />
          <Stop offset="100%" stopColor={tone(0)} />
        </RadialGradient>
      </Defs>
      <Circle cx={100} cy={100} r={96} fill="url(#ci-glow)" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Ellipse key={i} cx={100} cy={100 - offset} rx={rx} ry={ry} fill={tone(op)} transform={`rotate(${i * 45}, 100, 100)`} />
      ))}
      <Circle cx={100} cy={100} r={core} fill={tone(0.62)} />
    </Svg>
  );
}

/** Gentle 6s breathing pulse around the visual. */
function Breathe({ children }: { children: React.ReactNode }) {
  const [scale] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.035, duration: 3000, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 3000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale]);
  return <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>;
}

// ── draggable mood slider with a cool→warm track ────────────────────────────
function MoodSlider({ value, onChange, vivid }: { value: number; onChange: (t: number) => void; vivid: boolean }) {
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
          colors={[moodTone(0, vivid)(0.9), moodTone(0.5, vivid)(0.9), moodTone(1, vivid)(0.9)]}
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
            weightOverride={i === idx ? '700' : '600'}
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
      <AppText weightOverride="700" color={colors.accentText} style={{ fontSize: 18, letterSpacing: -0.2 }}>
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
        <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>{Glyph[glyph](on ? colors.accentText : colors.text)}</View>
      </View>
      <AppText weightOverride={on ? '700' : '600'} style={{ fontSize: 14.5, letterSpacing: -0.1 }}>
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
  const vivid = false;

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
                <MoodBloom t={value} vivid={vivid} />
              </Breathe>
              <AppText variant="hero" style={{ fontSize: 42, marginTop: 18 }}>
                {mood.label}
              </AppText>
              <AppText weightOverride="500" color={colors.textMuted} style={{ fontSize: 17, marginTop: 6 }}>
                How are you feeling today?
              </AppText>
            </View>
            <View style={{ paddingBottom: 8 }}>
              <MoodSlider value={value} onChange={setValue} vivid={vivid} />
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
                <MoodBloom t={value} vivid={vivid} size={150} />
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
