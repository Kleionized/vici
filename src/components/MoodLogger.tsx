import { useState } from 'react';
import { Modal, View } from 'react-native';

import { CONTROLS } from '@/components/day/board';
import { Grid2, Hero, MonoText, NavBar, NextFab, PrimaryButton, ScaleReading, Screen, ToneScale } from '@/components/mono';
import { checkinPartNow } from '@/lib/routines';
import { colors, mono } from '@/lib/theme';

/**
 * The check-in boards — what the day felt like, and what caused it — drawn
 * once and shown three ways: as the night check-in's second and third steps
 * (Checkin Emotions, Checkin Reasons), pushed as the standalone `/checkin`, and
 * lifted as a modal wherever a mood is logged on the spot.
 *
 * Each board is the overhaul's question board: a hero under the content (drawn
 * first, as the frames order it), the question and "Select all that apply." at
 * canvas 136, and the kit's two-column tiles at 232. The caller draws the nav
 * row and the control that moves on.
 */

/** The standalone check-in's five rungs (its own words; no frame draws this flow). */
const MOODS = ['Rough', 'Low', 'Steady', 'Good', 'Great'] as const;

/** Checkin Emotions' eight words, in the frame's order — the same eight whatever the mood. */
export const EMOTIONS: readonly string[] = ['Calm', 'Tense', 'Tired', 'Hopeful', 'Flat', 'Proud', 'Lonely', 'Restless'];

/**
 * Checkin Reasons' eight, in the frame's order. The label is also the stored
 * value: the overhaul shortened `Health / wellbeing` to `Health`, so rows saved
 * before it are mapped on read (D324).
 */
export const REASONS: readonly string[] = ['Relationship', 'Family', 'School / work', 'Money', 'Self-image', 'Loneliness', 'Health', 'None / unknown'];

const REASON_ALIASES: Record<string, string> = { 'Health / wellbeing': 'Health' };

/** Stored reasons in today's words — old `Health / wellbeing` rows read as `Health`. */
export function normalizeReasons(reasons: readonly string[] | null | undefined): string[] {
  const out: string[] = [];
  for (const r of reasons ?? []) {
    const v = REASON_ALIASES[r] ?? r;
    if (!out.includes(v)) out.push(v);
  }
  return out;
}

/**
 * The same three steps run morning and evening; only the framing moves. A
 * morning check-in asks what you're walking into, an evening one asks what the
 * day actually was — and the second question is worded in that tense too.
 */
const PART_COPY = {
  morning: {
    head: 'How are you feeling?',
    feel: 'What does today feel like so far?',
  },
  evening: {
    head: 'How was today?',
    feel: 'What did today feel like?',
  },
} as const;

/**
 * The prompt opens in the morning register unless told otherwise — the same
 * clock test `(app)/_layout` uses to choose morning over night, so a check-in
 * reached from the tab bar and one reached from a card agree.
 */
export function isMorningCheckin(part?: string) {
  if (part === 'morning' || part === 'evening') return part === 'morning';
  return checkinPartNow() === 'morning';
}

export function checkinCopy(part?: string) {
  return isMorningCheckin(part) ? PART_COPY.morning : PART_COPY.evening;
}

const moodRung = (n: number) => Math.max(0, Math.min(MOODS.length - 1, n - 1));

export const moodLabel = (n: number | null | undefined) => (n ? MOODS[moodRung(n)] : null);
export const moodTint = (n: number | null | undefined) => (n ? colors.moodTones[moodRung(n)] : colors.textSofter);

/** `[question] stack: top 136; gap 8` — the question, then "Select all that apply." 15/22 mute. */
function QuestionHead({ title }: { title: string }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 8 }}>
      <MonoText v="h1">{title}</MonoText>
      <MonoText v="pTight" color={mono.mute}>
        Select all that apply.
      </MonoText>
    </View>
  );
}

/**
 * Checkin Emotions: the night moon at 506 drawn at 0.954 (the frame tags it
 * `windowNight`, which is the `nightMoon` card's art — D338), and eight tiles.
 * `controls` is what the caller's bottom control takes off the screen edge, so
 * the hero drops out on a phone too short for it (D320).
 */
export function EmotionsBoard({
  feel,
  emotions,
  onChange,
  controls = CONTROLS.fab,
}: {
  feel: string;
  emotions: string[];
  onChange: (next: string[]) => void;
  controls?: number;
}) {
  return (
    <>
      <Hero id="nightMoon" top={506} scale={0.954} controls={controls} />
      <QuestionHead title={feel} />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 232 }}>
        <Grid2 multi options={EMOTIONS} value={emotions} onChange={onChange} />
      </View>
    </>
  );
}

/** Checkin Reasons: the speech bubbles at 506, and eight tiles. */
export function ReasonsBoard({
  reasons,
  onChange,
  controls = CONTROLS.fab,
}: {
  reasons: string[];
  onChange: (next: string[]) => void;
  controls?: number;
}) {
  return (
    <>
      <Hero id="bubbles" top={506} controls={controls} />
      <QuestionHead title="What caused the feeling?" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 232 }}>
        <Grid2 multi options={REASONS} value={reasons} onChange={onChange} />
      </View>
    </>
  );
}

/** What the flow comes back with. */
export interface CheckinResult {
  mood: number;
  emotions: string[];
  reasons: string[];
}

export interface CheckinFlowProps {
  /** Step one's question, in the register the time of day calls for. */
  head: string;
  /** Step two's question — same word, different tense, morning vs evening. */
  feel: string;
  initialMood?: number | null;
  initialEmotions?: string[];
  initialReasons?: string[];
  onDone: (result: CheckinResult) => void;
  onExit: () => void;
}

/**
 * The standalone check-in (`/checkin`, the modal). No frame draws it; it is
 * the night check-in's three boards on the same chrome — Night 1 Mood's tone
 * discs and bed for the first question (its five words under them), Checkin
 * Emotions, Checkin Reasons — over a three-step rail. The last step keeps its
 * own "Log it" pill rather than the round next, because it saves.
 */
export function CheckinFlow({ head, feel, initialMood, initialEmotions, initialReasons, onDone, onExit }: CheckinFlowProps) {
  const [step, setStep] = useState(0);
  // The fourth rung, 'Good', is where the flow has always opened.
  const [mood, setMood] = useState(initialMood != null ? moodRung(initialMood) : 3);
  const [emotions, setEmotions] = useState<string[]>(initialEmotions ?? []);
  const [reasons, setReasons] = useState<string[]>(() => normalizeReasons(initialReasons));

  const goBack = () => (step === 0 ? onExit() : setStep((s) => s - 1));

  return (
    <Screen>
      {step === 0 ? (
        <>
          <Hero id="bed" top={506} scale={1.075} controls={CONTROLS.primary} />
          <View style={{ position: 'absolute', left: 24, right: 24, top: 136 }}>
            <MonoText v="h1">{head}</MonoText>
          </View>
          <ToneScale value={mood} onChange={setMood} labels={MOODS} />
          <ScaleReading word={MOODS[mood]} />
          <PrimaryButton label="Continue" onPress={() => setStep(1)} />
        </>
      ) : null}

      {step === 1 ? (
        <>
          <EmotionsBoard feel={feel} emotions={emotions} onChange={setEmotions} />
          <NextFab onPress={() => setStep(2)} disabled={emotions.length === 0} />
        </>
      ) : null}

      {step === 2 ? (
        <>
          <ReasonsBoard reasons={reasons} onChange={setReasons} controls={CONTROLS.primary} />
          <PrimaryButton label="Log it" onPress={() => onDone({ mood: mood + 1, emotions, reasons })} disabled={reasons.length === 0} />
        </>
      ) : null}

      <NavBar left="back" centre={{ step: step + 1, total: 3 }} right="close" onBack={goBack} onClose={onExit} />
    </Screen>
  );
}

export interface MoodLoggerProps {
  visible: boolean;
  initialMood?: number | null;
  initialEmotions?: string[];
  initialReasons?: string[];
  onSave: (result: CheckinResult) => void;
  onClose: () => void;
}

/**
 * The same steps, lifted as a sheet from wherever a mood is logged on the spot.
 * Always the three-step register: the day's action belongs to the morning
 * ritual, not to a mood logged in passing.
 */
export function MoodLogger({ visible, initialMood, initialEmotions, initialReasons, onSave, onClose }: MoodLoggerProps) {
  // No reset to run: Modal drops its children while hidden, so each open gets a
  // fresh flow rather than reopening on whichever step was abandoned.
  const copy = checkinCopy();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <CheckinFlow
        head={copy.head}
        feel={copy.feel}
        initialMood={initialMood}
        initialEmotions={initialEmotions}
        initialReasons={initialReasons}
        onDone={onSave}
        onExit={onClose}
      />
    </Modal>
  );
}
