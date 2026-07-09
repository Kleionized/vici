import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Icon } from '@/components/ui';
import { colors, radius, spacing } from '@/lib/theme';

const PLEASANT_LABELS = ['Very unpleasant', 'Unpleasant', 'Neutral', 'Pleasant', 'Very pleasant'];
// The mood ramp — the app-wide neutral ink scale (never a hue).
const PLEASANT_TINTS = [...colors.moodTones];

const EMOTIONS: Record<'pleasant' | 'neutral' | 'unpleasant', string[]> = {
  pleasant: ['Calm', 'Content', 'Happy', 'Grateful', 'Hopeful', 'Excited', 'Proud', 'Confident', 'Relieved', 'Peaceful', 'Energised', 'Connected'],
  neutral: ['Indifferent', 'Tired', 'Restless', 'Distracted', 'Bored', 'Numb', 'Flat', 'Unsure'],
  unpleasant: ['Anxious', 'Stressed', 'Sad', 'Lonely', 'Frustrated', 'Angry', 'Ashamed', 'Guilty', 'Overwhelmed', 'Empty', 'Hopeless', 'Irritated', 'Scared', 'Tense'],
};

const REASONS = [
  'Health', 'Sleep', 'Work', 'Money', 'Family', 'Friends', 'Partner', 'Dating', 'Identity', 'Self-worth', 'Loneliness',
  'Boredom', 'Stress', 'Fitness', 'Faith', 'The future', 'This habit', 'Something else',
];

export const moodLabel = (n: number | null | undefined) => (n ? PLEASANT_LABELS[n - 1] : null);
export const moodTint = (n: number | null | undefined) => (n ? PLEASANT_TINTS[n - 1] : colors.textSofter);

export interface MoodLoggerProps {
  visible: boolean;
  initialMood?: number | null;
  initialEmotions?: string[];
  initialReasons?: string[];
  onSave: (mood: number, emotions: string[], reasons: string[]) => void;
  onClose: () => void;
}

export function MoodLogger({ visible, initialMood, initialEmotions, initialReasons, onSave, onClose }: MoodLoggerProps) {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<number | null>(initialMood ?? null);
  const [emotions, setEmotions] = useState<string[]>(initialEmotions ?? []);
  const [reasons, setReasons] = useState<string[]>(initialReasons ?? []);

  useEffect(() => {
    if (visible) {
      setStep(0);
      setMood(initialMood ?? null);
      setEmotions(initialEmotions ?? []);
      setReasons(initialReasons ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const valence = mood == null ? 'neutral' : mood >= 4 ? 'pleasant' : mood <= 2 ? 'unpleasant' : 'neutral';
  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const title = step === 0 ? 'How are you feeling?' : step === 1 ? 'What best describes it?' : 'What’s affecting you most?';
  const canNext = step !== 0 || mood != null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            {/* top bar: back · progress · close */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
              <Pressable onPress={() => (step > 0 ? setStep(step - 1) : onClose())} hitSlop={10}>
                <View style={{ transform: [{ rotate: '180deg' }] }}>
                  <Icon name="arrow" size={18} color={colors.textMuted} />
                </View>
              </Pressable>
              <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
                {[0, 1, 2].map((s) => (
                  <View key={s} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: s <= step ? colors.text : colors.border }} />
                ))}
              </View>
              <Pressable onPress={onClose} hitSlop={10}>
                <AppText style={{ color: colors.textMuted, fontSize: 20 }}>✕</AppText>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false}>
              <AppText variant="display" style={{ marginBottom: spacing.xl }}>
                {title}
              </AppText>

              {step === 0 ? (
                <View style={{ alignItems: 'center', gap: spacing.xxl, paddingTop: spacing.lg }}>
                  <AppText variant="hero" center color={moodTint(mood)}>
                    {moodLabel(mood) ?? 'Choose one'}
                  </AppText>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' }}>
                    {[1, 2, 3, 4, 5].map((v) => {
                      const sel = mood === v;
                      const tint = PLEASANT_TINTS[v - 1];
                      return (
                        <Pressable key={v} onPress={() => setMood(v)} hitSlop={6}>
                          <View
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius: radius.pill,
                              backgroundColor: sel ? tint : tint + '2E',
                              borderWidth: sel ? 2 : 0,
                              borderColor: colors.text,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            {sel ? <Icon name="check" size={22} color="#FFFFFF" strokeWidth={2.6} /> : null}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' }}>
                    <AppText variant="soft">Unpleasant</AppText>
                    <AppText variant="soft">Pleasant</AppText>
                  </View>
                </View>
              ) : null}

              {step === 1 ? (
                <View style={{ gap: spacing.lg }}>
                  <AppText variant="muted">Pick any that fit — there’s no wrong answer.</AppText>
                  <Chips options={EMOTIONS[valence]} selected={emotions} onToggle={(v) => toggle(emotions, setEmotions, v)} />
                </View>
              ) : null}

              {step === 2 ? (
                <View style={{ gap: spacing.lg }}>
                  <AppText variant="muted">What’s driving the feeling right now?</AppText>
                  <Chips options={REASONS} selected={reasons} onToggle={(v) => toggle(reasons, setReasons, v)} />
                </View>
              ) : null}
            </ScrollView>

            <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.lg }}>
              <Button
                label={step < 2 ? 'Next' : 'Save'}
                disabled={!canNext}
                onPress={() => {
                  if (step < 2) setStep(step + 1);
                  else if (mood != null) onSave(mood, emotions, reasons);
                }}
              />
            </View>
          </SafeAreaView>
      </View>
    </Modal>
  );
}

function Chips({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <Pressable
            key={o}
            onPress={() => onToggle(o)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm + 3,
              borderRadius: radius.pill,
              backgroundColor: on ? colors.accent : colors.surface,
              borderWidth: 1,
              borderColor: on ? colors.accent : colors.border,
            }}>
            <AppText color={on ? colors.accentText : colors.text} weightOverride={on ? '600' : '400'}>
              {o}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
