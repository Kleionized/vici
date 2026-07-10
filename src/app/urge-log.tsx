import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { type LayoutChangeEvent, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppText, bandToSeverity, Button, Icon, type IconName, IntensityBands, INTENSITY_BANDS } from '@/components/ui';
import { useCreateEvent } from '@/lib/backend';
import { setJSON } from '@/lib/storage';
import { colors, fonts, sans, spacing } from '@/lib/theme';
import type { EventType } from '@/lib/types';

// ── "Log an urge" (canvas: screens-urge-log) — the record-keeping
// companion to urge surfing: how strong, what set it off, what you did,
// when — landing on a quiet confirmation. Neutral ink scale throughout.

const BANDS = ['Faint', 'Mild', 'Strong', 'Intense', 'Overwhelming'];
const bandIndex = (t: number) => Math.min(BANDS.length - 1, Math.round(t * (BANDS.length - 1)));
// pale → richest ink as the pull grows (no hue swing)
const TONES = ['#C9C6BE', '#A9A69D', '#8B8882', '#5E5B55', '#33312D'];

const TRIGGERS: { label: string; icon: IconName }[] = [
  { label: 'Stress', icon: 'pulse' },
  { label: 'Boredom', icon: 'mood' },
  { label: 'Lonely', icon: 'people' },
  { label: 'Tired', icon: 'moon' },
  { label: 'Social', icon: 'people' },
  { label: 'Phone', icon: 'book' },
  { label: 'Late night', icon: 'moon' },
  { label: 'Argument', icon: 'heart' },
  { label: 'Craving', icon: 'sparkle' },
];

const OUTCOMES: { label: string; note: string; icon: IconName; slip?: boolean; type: EventType }[] = [
  { label: 'Rode it out', note: 'Waited; it passed', icon: 'wave', type: 'urge_rode_out' },
  { label: 'Used the timer', note: 'The breathing exercise', icon: 'anchor', type: 'urge_rode_out' },
  { label: 'Did something else', note: 'Changed the scene', icon: 'compass', type: 'urge_rode_out' },
  { label: 'Told someone', note: 'Reached out', icon: 'heart', type: 'urge_rode_out' },
  { label: 'I slipped', note: 'It happened', icon: 'moon', slip: true, type: 'urge_acted_on' },
];

const WHEN_CHIPS = [
  { label: 'Just now', offsetMs: 0 },
  { label: 'Earlier today', offsetMs: 4 * 3600_000 },
  { label: 'Yesterday', offsetMs: 24 * 3600_000 },
];

export default function UrgeLog() {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const [step, setStep] = useState(0);
  const [intensity, setIntensity] = useState<number | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [outcome, setOutcome] = useState(0);
  const [when, setWhen] = useState(0);
  const [saving, setSaving] = useState(false);

  const close = () => router.back();
  const back = () => (step === 0 ? close() : setStep(step - 1));

  async function save() {
    setSaving(true);
    const out = OUTCOMES[outcome];
    await createEvent({
      type: out.type,
      severity: bandToSeverity(intensity ?? 2),
      trigger: triggers.length ? triggers.join(' · ') : undefined,
      whatHelped: out.slip ? undefined : out.label,
      createdAt: Date.now() - WHEN_CHIPS[when].offsetMs,
    });
    if (out.slip) await setJSON('tideline.letter.pending', Date.now());
    setSaving(false);
    setStep(4);
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.bg }}>
      {step < 4 ? <Top index={step} onBack={back} onClose={close} /> : null}

      {step === 0 ? (
        <View style={{ flex: 1, paddingHorizontal: spacing.xl + 5 }}>
          <Heading sub="How strong was the urge?">Rate it</Heading>
          <ScrollView style={{ flex: 1, marginTop: 26 }} showsVerticalScrollIndicator={false}>
            <IntensityBands value={intensity} onSelect={setIntensity} />
          </ScrollView>
          <View style={{ paddingVertical: 24, opacity: intensity == null ? 0.35 : 1 }}>
            <Button label="Continue" onPress={() => (intensity != null ? setStep(1) : undefined)} />
          </View>
        </View>
      ) : null}

      {step === 1 ? (
        <View style={{ flex: 1, paddingHorizontal: spacing.xl + 5 }}>
          <Heading sub="Tap anything that fed the wave.">What set it off?</Heading>
          <ScrollView style={{ flex: 1, marginTop: 26 }} showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {TRIGGERS.map((t) => {
                const on = triggers.includes(t.label);
                return (
                  <Pressable
                    key={t.label}
                    onPress={() => setTriggers(on ? triggers.filter((x) => x !== t.label) : [...triggers, t.label])}
                    style={{
                      width: '31%',
                      flexGrow: 1,
                      alignItems: 'center',
                      gap: 10,
                      paddingVertical: 18,
                      paddingHorizontal: 8,
                      borderRadius: 18,
                      backgroundColor: colors.surface,
                      borderWidth: 1.8,
                      borderColor: on ? colors.ink : 'transparent',
                    }}>
                    <View
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 9999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: on ? colors.ink : colors.accentSoft,
                      }}>
                      <Icon name={t.icon} size={24} color={on ? colors.inkText : colors.text} strokeWidth={1.8} />
                    </View>
                    <AppText style={[sans('500'), { fontSize: 14, color: colors.text }]}>{t.label}</AppText>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
          <View style={{ paddingVertical: 20 }}>
            <Button
              label={triggers.length ? `Continue · ${triggers.length}` : 'Continue'}
              onPress={() => setStep(2)}
              disabled={triggers.length === 0}
            />
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View style={{ flex: 1, paddingHorizontal: spacing.xl + 5 }}>
          <Heading sub="No wrong answer — just the truth.">What did you do?</Heading>
          <View style={{ flex: 1, justifyContent: 'center', gap: 10, marginTop: 12 }}>
            {OUTCOMES.map((o, i) => {
              const on = outcome === i;
              const ring = on ? (o.slip ? colors.danger : colors.ink) : colors.border;
              return (
                <Pressable
                  key={o.label}
                  onPress={() => setOutcome(i)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    paddingVertical: 16,
                    paddingHorizontal: 18,
                    borderRadius: 18,
                    backgroundColor: colors.surface,
                    borderWidth: on ? 1.8 : 1.5,
                    borderColor: ring,
                  }}>
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: on ? (o.slip ? 'rgba(181,98,79,0.18)' : colors.ink) : colors.accentSoft,
                    }}>
                    <Icon name={o.icon} size={22} color={on ? (o.slip ? colors.danger : colors.inkText) : colors.textMuted} strokeWidth={1.8} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText style={[sans('500'), { fontSize: 15, color: colors.text }]}>{o.label}</AppText>
                    <AppText style={[sans('400'), { fontSize: 13.5, color: colors.textMuted, marginTop: 1 }]}>{o.note}</AppText>
                  </View>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 9999,
                      borderWidth: on ? 0 : 2,
                      borderColor: colors.borderStrong,
                      backgroundColor: on ? (o.slip ? colors.danger : colors.ink) : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {on ? (
                      <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
                        <Path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View style={{ paddingVertical: 20 }}>
            <Button label="Continue" onPress={() => setStep(3)} />
          </View>
        </View>
      ) : null}

      {step === 3 ? (
        <View style={{ flex: 1, paddingHorizontal: spacing.xl + 5 }}>
          <Heading>When was it?</Heading>
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            {WHEN_CHIPS.map((c, i) => (
              <Pressable
                key={c.label}
                onPress={() => setWhen(i)}
                style={{
                  paddingVertical: 13,
                  paddingHorizontal: 20,
                  borderRadius: 9999,
                  backgroundColor: when === i ? colors.ink : colors.surface,
                }}>
                <AppText style={[sans('500'), { fontSize: 14 }]} color={when === i ? colors.inkText : colors.text}>
                  {c.label}
                </AppText>
              </Pressable>
            ))}
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ paddingVertical: 20 }}>
            <Button label="Log the urge" onPress={save} loading={saving} />
          </View>
        </View>
      ) : null}

      {step === 4 ? <Done intensity={intensity ?? 2} triggers={triggers} outcome={outcome} onClose={close} /> : null}
    </SafeAreaView>
  );
}

// ── top bar: back · segmented progress · close ───────────────────────
function Top({ index, onBack, onClose }: { index: number; onBack: () => void; onClose: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.xl + 5, paddingTop: 8 }}>
      <Pressable onPress={onBack} hitSlop={10} accessibilityLabel="Back">
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M15 5l-7 7 7 7" stroke={colors.text} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={{ width: 36, height: 4, borderRadius: 9999, backgroundColor: i <= index ? colors.ink : 'rgba(0,0,0,0.1)' }} />
        ))}
      </View>
      <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Close">
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M6 6l12 12M18 6L6 18" stroke={colors.text} strokeWidth={2.1} strokeLinecap="round" />
        </Svg>
      </Pressable>
    </View>
  );
}

function Heading({ children, sub }: { children: string; sub?: string }) {
  return (
    <View style={{ alignItems: 'center', marginTop: 26 }}>
      <AppText center style={{ fontFamily: fonts.serif, fontSize: 26, lineHeight: 30, letterSpacing: 0.26, color: colors.text }}>
        {children}
      </AppText>
      {sub ? (
        <AppText center variant="muted" style={{ fontSize: 13.5, lineHeight: 19.5, marginTop: 10, marginHorizontal: 14 }}>
          {sub}
        </AppText>
      ) : null}
    </View>
  );
}

// ── the intensity sea — calm bands that curl into a dark crest ───────
function IntensityScene({ t }: { t: number }) {
  const tone = TONES[bandIndex(t)];
  // the crest rises with the pull: amplitude 6 → 44
  const amp = 6 + t * 38;
  const y = 96;
  const d = `M10 ${y} C 60 ${y - amp * 1.9} 105 ${y - amp * 1.6} 140 ${y - amp * 0.4} C 170 ${y + amp * 0.35} 205 ${y + 4} 230 ${y + 2}`;
  return (
    <Svg width={240} height={132} viewBox="0 0 240 132" fill="none">
      {/* horizon */}
      <Path d={`M6 ${y + 22} h228`} stroke={colors.textSofter} strokeWidth={1.8} strokeLinecap="round" opacity={0.55} />
      {/* the swell */}
      <Path d={d} stroke={tone} strokeWidth={3.4} strokeLinecap="round" fill="none" />
      {/* under-swell echo */}
      <Path d={`M24 ${y + 12} C 70 ${y + 12 - amp * 0.7} 120 ${y + 12 - amp * 0.4} 216 ${y + 10}`} stroke={tone} strokeWidth={2.2} strokeLinecap="round" opacity={0.35} fill="none" />
      {/* buoy: upright when calm, spray dot when heavy */}
      <Circle cx={62} cy={y - amp * 1.32} r={3.4} fill={colors.surface} stroke={tone} strokeWidth={1.4} />
    </Svg>
  );
}

// ── draggable band slider — grayscale ramp track, pill thumb ─────────
function IntensitySlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const width = useRef(0);
  const handle = (x: number) => {
    if (width.current > 0) onChange(clamp(x / width.current));
  };

  const idx = bandIndex(value);
  return (
    <View>
      <View
        onLayout={(e: LayoutChangeEvent) => (width.current = e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(e) => handle(e.nativeEvent.locationX)}
        onResponderMove={(e) => handle(e.nativeEvent.locationX)}
        style={{ height: 44, justifyContent: 'center' }}>
        {/* grayscale ramp track (segments approximate the gradient) */}
        <View style={{ flexDirection: 'row', height: 6, borderRadius: 9999, overflow: 'hidden' }}>
          {TONES.map((c, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: c, opacity: 0.9 }} />
          ))}
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: `${value * 100}%`,
            marginLeft: -13,
            width: 26,
            height: 32,
            borderRadius: 11,
            backgroundColor: '#FFFFFF',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2.5,
          }}>
          <View style={{ width: 1.5, height: 10, borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.13)' }} />
          <View style={{ width: 1.5, height: 10, borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.13)' }} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        {BANDS.map((b, i) => (
          <AppText key={b} center style={[sans('500'), { flex: 1, fontSize: 11.5, color: i === idx ? colors.text : colors.textSoft }]}>
            {b}
          </AppText>
        ))}
      </View>
    </View>
  );
}

function clamp(x: number) {
  return Math.max(0, Math.min(1, x));
}

// ── done — quiet confirmation + summary card ─────────────────────────
function Done({ intensity, triggers, outcome, onClose }: { intensity: number; triggers: string[]; outcome: number; onClose: () => void }) {
  const out = OUTCOMES[outcome];
  const slip = !!out.slip;
  return (
    <View style={{ flex: 1, paddingHorizontal: spacing.xl + 5 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* settled water under a small moon */}
        <Svg width={200} height={110} viewBox="0 0 200 110" fill="none">
          <Circle cx={100} cy={34} r={20} fill={slip ? colors.textSofter : colors.text} opacity={slip ? 0.6 : 0.85} />
          <Path d="M18 78 C 45 70 72 70 100 78 C 128 86 155 86 182 78" stroke={colors.textMuted} strokeWidth={2.6} strokeLinecap="round" />
          <Path d="M34 94 C 57 88 79 88 100 94 C 121 100 143 100 166 94" stroke={colors.textMuted} strokeWidth={2} strokeLinecap="round" opacity={0.45} />
        </Svg>
        <AppText center style={{ fontFamily: fonts.serif, fontSize: 33, lineHeight: 36, letterSpacing: 0.33, color: colors.text, marginTop: 22 }}>
          Urge logged.
        </AppText>
        <AppText center variant="muted" style={{ fontSize: 13.5, lineHeight: 19.5, marginTop: 14, marginHorizontal: 10 }}>
          {slip ? 'It happened. The next choice is the one that counts.' : 'Each one adds to your pattern data.'}
        </AppText>

        <View style={{ width: '100%', marginTop: 28, backgroundColor: colors.surface, borderRadius: 18, paddingVertical: 4, paddingHorizontal: 20 }}>
          <SummaryRow label="Intensity" value={INTENSITY_BANDS[intensity].label} />
          <SummaryRow label="Set off by" value={triggers.length ? triggers.join(' · ') : '—'} />
          <SummaryRow label="What I did" value={out.label} last />
        </View>
      </View>
      <View style={{ paddingBottom: 8, paddingTop: 16 }}>
        <Button label="Done" onPress={onClose} />
      </View>
    </View>
  );
}

function SummaryRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        paddingVertical: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
      }}>
      <AppText style={[sans('600'), { fontSize: 11, letterSpacing: 1.54, textTransform: 'uppercase', color: colors.textSoft }]}>
        {label}
      </AppText>
      <AppText style={[sans('500'), { fontSize: 14.5, color: colors.text, textAlign: 'right', flexShrink: 1 }]}>{value}</AppText>
    </View>
  );
}
