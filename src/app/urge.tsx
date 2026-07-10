import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { UrgeWave } from '@/components/urge';
import { Scene, UrgeVignette } from '@/components/scene/SceneKit';
import { useCreateEvent } from '@/lib/backend';
import { clearUrgeSession, newUrgeSession, saveUrgeSession } from '@/lib/urgeSession';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * Urge surfing (canvas: screens-urge) — two fast asks (where · how strong),
 * then a path tailored by strength:
 *   a flicker          → wave · pass · name · surf     (no need to flee)
 *   pulling hard       → wave · pass · move · name · surf
 *   about to give in   → move · surf                   (fastest way out)
 * The wave pages and the finish are full-bleed night imagery.
 */

// ── the two asks' content ────────────────────────────────────────────
const PLACES: [string, string][] = [
  ['bed', 'In bed'],
  ['couch', 'On the couch'],
  ['bathroom', 'In the bathroom'],
  ['desk', 'At my desk'],
  ['outside', 'Outside'],
  ['elsewhere', 'Somewhere else'],
];

const PLACE_MOVE: Record<string, { headline: string; sub: string; cta: string }> = {
  bed: { headline: 'Get out of bed', sub: 'Feet on the floor, lights on. The urge lives in the warm dark — stand up and walk to another room.', cta: "I'm up" },
  couch: { headline: 'Stand up off the couch', sub: 'Put the phone on the far side of the room and walk to the kitchen. Change what your hands are holding.', cta: "I'm up" },
  bathroom: { headline: 'Step out of the bathroom', sub: 'Cold water on your face, door open, out. Don’t linger where it’s easiest to hide.', cta: "I've stepped out" },
  desk: { headline: 'Push back from the desk', sub: 'Close the tabs, stand, and walk to a window. The work will keep for five minutes — the scene won’t.', cta: "I've moved" },
  outside: { headline: 'Keep moving', sub: 'Pick a point ahead and walk to it. New street, new input — don’t stop where the pull started.', cta: "I'm moving" },
  elsewhere: { headline: 'Change the room you’re in', sub: 'Any room will do. The urge is attached to the scene — break the scene.', cta: "I've moved" },
};

const STRENGTHS: [string, string, number][] = [
  ['A flicker', 'Noticeable, but quiet', 0.3],
  ['Pulling hard', 'It has my full attention', 0.62],
  ['About to give in', 'I need the fastest way out', 0.95],
];
const STRENGTH_SEVERITY = [3, 6, 10];

// ── place glyphs (design: PlaceGlyph) ────────────────────────────────
function PlaceIcon({ k, c }: { k: string; c: string }) {
  const common = { stroke: c, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' as const };
  switch (k) {
    case 'bed':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path d="M3 18v-8.5M3 13h18v5" {...common} />
          <Path d="M3 13V7.5h7c2.5 0 4 1.4 4 3.5v2" {...common} />
          <Circle cx={6.8} cy={10.2} r={1.3} stroke={c} strokeWidth={1.8} fill="none" />
        </Svg>
      );
    case 'bathroom':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path d="M7 20c-1.8-1.2-3-3.2-3-5.5h16c0 2.3-1.2 4.3-3 5.5M6 20l-.8 1.6M18 20l.8 1.6" {...common} />
          <Path d="M6 14.5V6a2.2 2.2 0 014.4 0" {...common} />
          <Path d="M13 7.5l1-1.4M15.6 9l1.4-1M14 11h1.8" {...common} />
        </Svg>
      );
    case 'desk':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path d="M4 5.8 h16 v8.4 a1.6 1.6 0 0 1 -1.6 1.6 h-12.8 a1.6 1.6 0 0 1 -1.6 -1.6 Z" {...common} />
          <Path d="M9.5 19h5M12 15.8v3.2" {...common} />
        </Svg>
      );
    case 'couch':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path d="M5 11V8.5A2.5 2.5 0 017.5 6h9A2.5 2.5 0 0119 8.5V11" {...common} />
          <Path d="M3.5 13.5a2 2 0 012-2c1.1 0 2 .9 2 2V14h9v-.5a2 2 0 114 0V17a1.5 1.5 0 01-1.5 1.5h-14A1.5 1.5 0 013.5 17z" {...common} />
          <Path d="M5.5 18.5V20M18.5 18.5V20" {...common} />
        </Svg>
      );
    case 'outside':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Circle cx={17.5} cy={6.5} r={2.5} stroke={c} strokeWidth={1.8} fill="none" />
          <Path d="M9 8.5L4.5 21M9 8.5c2.4 0 4.2 1.2 5.2 3.4M9 8.5C7 8.5 5.4 9.6 4.5 11.4" {...common} />
          <Path d="M12 21c.4-3.2 1.6-5.8 3.6-7.8M19.5 21H3" {...common} />
        </Svg>
      );
    default:
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path d="M12 21s-6.5-5.4-6.5-10.2A6.3 6.3 0 0112 4.5a6.3 6.3 0 016.5 6.3C18.5 15.6 12 21 12 21z" {...common} />
          <Circle cx={12} cy={10.8} r={2.2} stroke={c} strokeWidth={1.8} fill="none" />
        </Svg>
      );
  }
}

// ── the strength mark: ring + growing ink disc ───────────────────────
function StrengthMark({ t, c }: { t: number; c: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      <Circle cx={13} cy={13} r={11} stroke={c} strokeWidth={1.5} opacity={0.5} />
      <Circle cx={13} cy={13} r={3.2 + t * 7.3} fill={c} />
    </Svg>
  );
}

// ── top bar: back · segmented progress · close ───────────────────────
function TopBar({ total, index, onBack, onClose, light = false }: { total: number; index: number; onBack: () => void; onClose: () => void; light?: boolean }) {
  const c = light ? '#F5F4F1' : colors.text;
  const on = light ? '#F5F4F1' : colors.ink;
  const off = light ? 'rgba(245,244,241,0.3)' : colors.borderStrong;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 29, paddingTop: 8 }}>
      <Pressable onPress={onBack} hitSlop={10} accessibilityLabel="Back" style={{ padding: 4, marginLeft: -4 }}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M15 5l-7 7 7 7" stroke={c} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 6, paddingHorizontal: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={{ flex: 1, maxWidth: 36, height: 4, borderRadius: 9999, backgroundColor: i <= index ? on : off }} />
        ))}
      </View>
      <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Close" style={{ padding: 4, marginRight: -4 }}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth={2.1} strokeLinecap="round" />
        </Svg>
      </Pressable>
    </View>
  );
}

function PillButton({ label, onPress, enabled = true, light = false }: { label: string; onPress: () => void; enabled?: boolean; light?: boolean }) {
  return (
    <Pressable
      onPress={enabled ? onPress : undefined}
      accessibilityRole="button"
      style={({ pressed }) => ({
        width: '100%',
        backgroundColor: light ? '#FBFAF9' : colors.ink,
        borderRadius: 9999,
        paddingVertical: 16,
        alignItems: 'center',
        opacity: enabled ? 1 : 0.34,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      <AppText style={[sans('600'), { fontSize: 15.5, letterSpacing: 0.16, color: light ? '#131313' : colors.inkText }]}>{label}</AppText>
    </Pressable>
  );
}

// ── the full-bleed dark image page (design: JourneyPage fullMode) ─────
function DarkImagePage({
  total,
  index,
  img,
  label,
  headline,
  sub,
  cta,
  onBack,
  onClose,
  onNext,
}: {
  total: number;
  index: number;
  img: number;
  label?: string;
  headline: string;
  sub?: string;
  cta: string;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0C' }}>
      <Image source={img} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <LinearGradient
        colors={['rgba(7,8,10,0.55)', 'rgba(7,8,10,0.1)', 'rgba(7,8,10,0.14)', 'rgba(7,8,10,0.7)']}
        locations={[0, 0.3, 0.56, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TopBar total={total} index={index} onBack={onBack} onClose={onClose} light />
        <View style={{ flex: 1 }} />
        <View style={{ paddingHorizontal: 29, alignItems: 'center' }}>
          {label ? (
            <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: 'rgba(245,244,241,0.55)', marginBottom: 12 }]}>
              {label}
            </AppText>
          ) : null}
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 30, lineHeight: 34, letterSpacing: 0.3, color: '#F5F4F1' }}>
            {headline}
          </AppText>
          {sub ? (
            <AppText center style={[sans('400'), { fontSize: 13.5, lineHeight: 20, color: 'rgba(245,244,241,0.75)', marginTop: 14 }]}>
              {sub}
            </AppText>
          ) : null}
        </View>
        <View style={{ flex: 1.15 }} />
        <View style={{ paddingHorizontal: 29, paddingBottom: 12 }}>
          <PillButton label={cta} onPress={onNext} light />
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── the paper page with a scene vignette (remove / name) ─────────────
function VignettePage({
  total,
  index,
  stage,
  label,
  headline,
  sub,
  cta,
  onBack,
  onClose,
  onNext,
}: {
  total: number;
  index: number;
  stage: 'remove' | 'name';
  label: string;
  headline: string;
  sub: string;
  cta: string;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TopBar total={total} index={index} onBack={onBack} onClose={onClose} />
        <View style={{ flex: 1 }} />
        <View style={{ alignItems: 'center', paddingHorizontal: 18 }}>
          <Scene width={320} height={180} viewBox="0 0 320 180">
            <UrgeVignette stage={stage} />
          </Scene>
        </View>
        <View style={{ paddingHorizontal: 29, paddingTop: 32, alignItems: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft, marginBottom: 12 }]}>
            {label}
          </AppText>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 30, lineHeight: 34, letterSpacing: 0.3, color: colors.text }}>
            {headline}
          </AppText>
          <AppText center style={[sans('400'), { fontSize: 13.5, lineHeight: 20, color: colors.textMuted, marginTop: 14 }]}>
            {sub}
          </AppText>
        </View>
        <View style={{ flex: 1.15 }} />
        <View style={{ paddingHorizontal: 29, paddingBottom: 12 }}>
          <PillButton label={cta} onPress={onNext} />
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── ask 1 · where are you? ───────────────────────────────────────────
function AskWhere({ total, index, value, onPick, onBack, onClose, onNext }: { total: number; index: number; value: string | null; onPick: (k: string) => void; onBack: () => void; onClose: () => void; onNext: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TopBar total={total} index={index} onBack={onBack} onClose={onClose} />
        <View style={{ paddingHorizontal: 29, paddingTop: 26 }}>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 28, lineHeight: 32, letterSpacing: 0.28, color: colors.text }}>
            Where are you right now?
          </AppText>
        </View>
        <ScrollView style={{ flex: 1, marginTop: 26 }} contentContainerStyle={{ paddingHorizontal: 29 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {PLACES.map(([k, label]) => {
              const on = value === k;
              return (
                <Pressable
                  key={k}
                  onPress={() => onPick(k)}
                  style={{
                    width: '47.8%',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: colors.surface,
                    borderRadius: 18,
                    paddingTop: 18,
                    paddingBottom: 15,
                    paddingHorizontal: 8,
                    borderWidth: 1.8,
                    borderColor: on ? colors.ink : 'transparent',
                  }}>
                  <View style={{ width: 46, height: 46, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? colors.ink : colors.accentSoft }}>
                    <PlaceIcon k={k} c={on ? colors.inkText : colors.text} />
                  </View>
                  <AppText style={[sans(on ? '600' : '500'), { fontSize: 13.5, color: colors.text }]}>{label}</AppText>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 29, paddingBottom: 12, paddingTop: 20 }}>
          <PillButton label="Continue" enabled={!!value} onPress={onNext} />
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── ask 2 · how strong is it? ────────────────────────────────────────
function AskStrength({ total, index, value, onPick, onBack, onClose, onNext }: { total: number; index: number; value: number | null; onPick: (i: number) => void; onBack: () => void; onClose: () => void; onNext: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TopBar total={total} index={index} onBack={onBack} onClose={onClose} />
        <View style={{ paddingHorizontal: 29, paddingTop: 26 }}>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 28, lineHeight: 32, letterSpacing: 0.28, color: colors.text }}>
            How strong is the urge?
          </AppText>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 29, paddingTop: 24, gap: 10 }}>
          {STRENGTHS.map(([label, note, t], i) => {
            const on = value === i;
            return (
              <Pressable
                key={label}
                onPress={() => onPick(i)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  backgroundColor: colors.surface,
                  borderRadius: 18,
                  paddingVertical: 15,
                  paddingHorizontal: 16,
                  borderWidth: 1.8,
                  borderColor: on ? colors.ink : 'transparent',
                }}>
                <View style={{ width: 46, height: 46, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? colors.ink : colors.accentSoft }}>
                  <StrengthMark t={t} c={on ? colors.inkText : colors.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={[sans(on ? '600' : '500'), { fontSize: 15, color: colors.text }]}>{label}</AppText>
                  <AppText style={[sans('400'), { fontSize: 13, color: colors.textMuted, marginTop: 2 }]}>{note}</AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={{ paddingHorizontal: 29, paddingBottom: 12, paddingTop: 20 }}>
          <PillButton label={value === 2 ? 'Get me out of it' : 'Continue'} enabled={value != null} onPress={onNext} />
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── the surf: dark water, phases, timer ──────────────────────────────
const SURF_SECONDS = 180;
const PHASES = [
  { at: 0.0, name: 'Notice it', tip: 'The urge is here. Don’t push it away.' },
  { at: 0.22, name: 'It’s rising', tip: 'Let it build. You are not the wave.' },
  { at: 0.46, name: 'Cresting', tip: 'This is the peak. Breathe slow and wide.' },
  { at: 0.66, name: 'Passing', tip: 'Feel it recede. It always does.' },
  { at: 0.86, name: 'Calm returns', tip: 'You rode it out. Notice the quiet.' },
];

function SurfScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(SURF_SECONDS);
  const progressRef = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    let mounted = true;
    let lastUi = 0;
    const start = Date.now();
    const loop = () => {
      if (!mounted) return;
      const elapsed = (Date.now() - start) / 1000;
      const p = Math.min(1, elapsed / SURF_SECONDS);
      progressRef.current = p;
      const now = Date.now();
      if (now - lastUi > 110) {
        lastUi = now;
        setProgress(p);
        setRemaining(Math.max(0, Math.ceil(SURF_SECONDS - elapsed)));
      }
      if (p < 1) raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const cur = PHASES.reduce((acc, ph) => (progress >= ph.at ? ph : acc), PHASES[0]);
  const mm = String(Math.floor(remaining / 60));
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <View style={{ flex: 1, backgroundColor: '#131313', overflow: 'hidden' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <UrgeWave progressRef={progressRef} />
      </View>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 29, paddingTop: 8 }}>
          <Pressable onPress={onBack} hitSlop={10} accessibilityLabel="Back" style={{ padding: 4, marginLeft: -4 }}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M15 5l-7 7 7 7" stroke="#F5F4F1" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
          <AppText style={[sans('500'), { fontSize: 15.5, letterSpacing: 0.31, color: 'rgba(245,244,241,0.65)', fontVariant: ['tabular-nums'] }]}>
            {mm}:{ss}
          </AppText>
        </View>
        <View style={{ marginTop: 46, alignItems: 'center', paddingHorizontal: 36 }}>
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: 'rgba(245,244,241,0.5)' }]}>
            {cur.name}
          </AppText>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 25, lineHeight: 31, letterSpacing: 0.25, color: '#F5F4F1', marginTop: 14 }}>
            {cur.tip}
          </AppText>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ paddingHorizontal: 29, paddingBottom: 12 }}>
          <PillButton label="It passed — I'm through it" onPress={onDone} light />
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── you rode it out — the calm sea, full screen ──────────────────────
function DoneScreen({ onClose }: { onClose: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0C' }}>
      <Image source={require('../../assets/images/urge-calm.webp')} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <LinearGradient
        colors={['rgba(7,8,10,0.45)', 'rgba(7,8,10,0.05)', 'rgba(7,8,10,0.14)', 'rgba(7,8,10,0.78)']}
        locations={[0, 0.28, 0.55, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1.35 }} />
        <View style={{ paddingHorizontal: 34, alignItems: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: 'rgba(245,244,241,0.6)' }]}>
            The wave broke
          </AppText>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 34, lineHeight: 37, letterSpacing: 0.17, color: '#F5F4F1', marginTop: 14 }}>
            You rode it out.
          </AppText>
          <AppText center style={[sans('400'), { fontSize: 13.5, lineHeight: 20, color: 'rgba(245,244,241,0.72)', marginTop: 14 }]}>
            It rose, crested, and passed — and you were still here.
          </AppText>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ paddingHorizontal: 29, paddingBottom: 12 }}>
          <PillButton label="Done" onPress={onClose} light />
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── the flow ─────────────────────────────────────────────────────────
export default function Urge() {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const [i, setI] = useState(0);
  const [place, setPlace] = useState<string | null>(null);
  const [strength, setStrength] = useState<number | null>(null);
  const logged = useRef(false);

  // keep a light session so a mid-urge reopen returns here
  useEffect(() => {
    void saveUrgeSession(newUrgeSession(5));
    return () => {
      void clearUrgeSession();
    };
  }, []);

  const path = strength === 2 ? ['move', 'surf'] : strength === 0 ? ['wave', 'pass', 'name', 'surf'] : ['wave', 'pass', 'move', 'name', 'surf'];
  const steps = ['where', 'strength', ...path, 'done'];
  const total = steps.length - 1; // 'done' isn't on the bar
  const urgent = strength === 2;

  const close = () => {
    void clearUrgeSession();
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/today');
  };
  const next = () => setI((v) => Math.min(steps.length - 1, v + 1));
  const back = () => setI((v) => Math.max(0, v - 1));

  async function finish() {
    if (!logged.current) {
      logged.current = true;
      await createEvent({
        type: 'urge_rode_out',
        severity: strength != null ? STRENGTH_SEVERITY[strength] : undefined,
        trigger: place ? PLACES.find(([k]) => k === place)?.[1] : undefined,
      }).catch(() => {});
    }
    next();
  }

  const step = steps[i];
  const common = { total, index: i, onBack: i === 0 ? close : back, onClose: close, onNext: next };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={step === 'wave' || step === 'pass' || step === 'surf' || step === 'done' ? 'light' : 'dark'} />
      {step === 'where' ? <AskWhere {...common} value={place} onPick={setPlace} /> : null}
      {step === 'strength' ? <AskStrength {...common} value={strength} onPick={setStrength} /> : null}
      {step === 'wave' ? (
        <DarkImagePage
          {...common}
          img={require('../../assets/images/urge-wave.webp')}
          headline="The urge is a wave"
          sub={"It rises, peaks, and passes.\nYou don't have to obey it.\nStay with it for a moment."}
          cta="I'm ready"
        />
      ) : null}
      {step === 'pass' ? (
        <DarkImagePage
          {...common}
          img={require('../../assets/images/urge-waves.webp')}
          headline="It always passes"
          sub={"Usually within minutes — often less.\nYou don't have to fight it."}
          cta="Continue"
        />
      ) : null}
      {step === 'move' ? (
        <VignettePage
          {...common}
          stage="remove"
          label={urgent ? 'Right now · step one' : 'Step one'}
          headline={(PLACE_MOVE[place || 'elsewhere'] || PLACE_MOVE.elsewhere).headline}
          sub={(PLACE_MOVE[place || 'elsewhere'] || PLACE_MOVE.elsewhere).sub}
          cta={(PLACE_MOVE[place || 'elsewhere'] || PLACE_MOVE.elsewhere).cta}
        />
      ) : null}
      {step === 'name' ? (
        <VignettePage
          {...common}
          stage="name"
          label="Step two"
          headline="Name the urge out loud"
          sub={'Say it plainly: “I’m having the urge to ___.” Named, it shrinks.'}
          cta="I named it"
        />
      ) : null}
      {step === 'surf' ? <SurfScreen onBack={back} onDone={finish} /> : null}
      {step === 'done' ? <DoneScreen onClose={close} /> : null}
    </View>
  );
}
