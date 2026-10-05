import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AddToRecord, CONTROLS, CheckinCover, ClosedLine, RecordRows, Stack, StepStack, dayNumber } from '@/components/day/board';
import { nightAction } from '@/components/day/kit';
import { EmotionsBoard, ReasonsBoard } from '@/components/MoodLogger';
import { GhostLink, Hero, HeroBoard, MonoText, NavBar, NextFab, PrimaryButton, ScaleReading, Screen, TextField, ToneScale } from '@/components/mono';
import { lessonForDay } from '@/content/curriculum84';
import { useCreateJournalEntry, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap, useLessons, useUpsertCheckin } from '@/lib/backend';
import { toDateKey, todayKey } from '@/lib/date';
import { countOf, roman } from '@/lib/format';

/**
 * The night check-in (today-day §4): a cover, then six steps on the eight
 * dashes — how today was, what it felt like, what caused it, anything worth
 * keeping, today's record read back, and tonight's action — and the close.
 *
 * Every step now draws Back, the dashes and ✕ (the frames dropped the old
 * rail-less action aside and the two Back-less steps). The rail lights
 * `round(step / 6 × 8)` — 1, 3, 4, 5, 7, 8 — as the frames do. What the flow
 * writes is unchanged.
 */

const COVER = 0;
const MOOD = 1;
const EMOTIONS = 2;
const REASONS = 3;
const REFLECTION = 4;
const RECORD = 5;
const ACTION = 6;
const CLOSED = 7;

/** Steps the dashes count: MOOD … ACTION. */
const RAIL = 6;

/** What the tone discs read back. The canvas draws the middle rung. */
const MOOD_READ: [string, string][] = [
  ['Heavy', 'A hard one'],
  ['Low', 'It took something'],
  ['Mixed', 'Some of both'],
  ['Good', 'More right than wrong'],
  ['Bright', 'One to keep'],
];

export default function Night() {
  const router = useRouter();
  const user = useCurrentUser();
  const events = useEvents();
  const journal = useJournalEntries();
  const lessons = useLessons();
  const progress = useLessonProgressMap();
  const upsert = useUpsertCheckin();
  const createJournalEntry = useCreateJournalEntry();

  const [step, setStep] = useState(COVER);
  const [mood, setMood] = useState(2);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [action, setAction] = useState(true);

  const day = dayNumber(user?.createdAt);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  const midnight = new Date().setHours(0, 0, 0, 0);
  const urges = (events ?? []).filter((e) => e.type.startsWith('urge') && e.createdAt >= midnight);
  const lapses = (events ?? []).filter((e) => e.type === 'lapse' && e.createdAt >= midnight).length;
  const pledge = (journal ?? []).find((entry) => entry.tag === 'Pledge' && entry.createdAt >= midnight);
  const finished = (lessons ?? []).find((lesson) => {
    const at = progress?.[lesson.slug]?.completedAt;
    return at != null && at >= midnight;
  });

  // Tonight's action is the day's lesson task: the caps, the lesson's title and
  // its one-line task (Night Action Reminder draws lesson 1's). A day past the
  // course falls back to the turning list, under the old "Tonight".
  const dayLesson = lessonForDay(day);
  const task = dayLesson?.task.cardSummary ?? nightAction(day);
  const lessonTitle = dayLesson?.task.cardTitle ?? 'Tonight';

  async function finish() {
    // The upsert merges, so only what this flow asked for is written.
    await upsert({
      date: todayKey(),
      mood: mood + 1,
      emotions: emotions.length ? emotions : undefined,
      reasons: reasons.length ? reasons : undefined,
    }).catch(() => {});
    if (reflection.trim()) {
      await createJournalEntry({ tag: 'Reflection', title: `Day ${day}`, body: reflection.trim() }).catch(() => {});
    }
    // The action lands on the day it is for, not the day it was named: it is
    // set tonight and answered for by tomorrow morning's check-in.
    if (action) {
      await upsert({ date: toDateKey(new Date(Date.now() + 86_400_000)), dailyAction: task }).catch(() => {});
    }
    close();
  }

  if (step === COVER) return <CheckinCover part="night" day={day} onBegin={() => setStep(MOOD)} onClose={close} />;

  if (step === CLOSED) {
    // The day is complete here, so the ✕ files it like Done (D235).
    return (
      <HeroBoard
        tone="dark"
        nav={{ left: 'empty', right: 'close', onClose: () => void finish() }}
        hero="nightMoon"
        stackTop={453}
        gap={12}
        title={`Day ${day}, closed.`}
        titleSize={34}
        body={<ClosedLine>See you in the morning.</ClosedLine>}
        cta="Done"
        onCta={() => void finish()}
      />
    );
  }

  const next = () => setStep((s) => s + 1);
  const take = (keep: boolean) => {
    setAction(keep);
    setStep(CLOSED);
  };

  return (
    <Screen>
      {step === MOOD ? (
        <>
          <Hero id="bed" top={506} scale={1.075} controls={CONTROLS.primary} />
          <Stack gap={20}>
            <MonoText v="h1">How was today?</MonoText>
          </Stack>
          <ToneScale value={mood} onChange={setMood} labels={MOOD_READ.map((r) => r[0])} />
          <ScaleReading word={MOOD_READ[mood][0]} line={MOOD_READ[mood][1]} />
          <PrimaryButton label="Continue" onPress={next} />
        </>
      ) : null}

      {step === EMOTIONS ? (
        <>
          <EmotionsBoard feel="What did today feel like?" emotions={emotions} onChange={setEmotions} />
          <NextFab onPress={next} disabled={emotions.length === 0} />
        </>
      ) : null}

      {step === REASONS ? (
        <>
          <ReasonsBoard reasons={reasons} onChange={setReasons} />
          <NextFab onPress={next} disabled={reasons.length === 0} />
        </>
      ) : null}

      {step === REFLECTION ? (
        <>
          {/* The field grows with what is written; a long entry scrolls between
              the nav and the pill instead of running under it, and the notebook
              steps aside when the writing reaches it (D320). At 852 the region
              holds the frame's stack exactly as drawn. */}
          <StepStack gap={14} controls={CONTROLS.primary} hero={{ id: 'notebook', top: 506 }}>
            <MonoText v="h1">Anything worth keeping?</MonoText>
            <MonoText v="caps">Optional</MonoText>
            <View style={{ height: 6 }} />
            <TextField variant="bare" value={reflection} onChangeText={setReflection} placeholder="Sam called at the right moment…" accessibilityLabel="Anything worth keeping" />
          </StepStack>
          <PrimaryButton label="Continue" onPress={next} />
        </>
      ) : null}

      {step === RECORD ? (
        <>
          <Stack gap={20}>
            <MonoText v="h1">Today’s record.</MonoText>
          </Stack>
          <RecordRows
            rows={[
              { label: pledge ? 'Pledge kept' : 'No pledge signed today', done: !!pledge },
              {
                label: urges.length === 0 ? 'No urges today' : urges.length === 1 ? 'One urge surfed' : `${urges.length} urges surfed`,
                done: urges.length > 0,
              },
              { label: countOf(lapses, 'slip'), done: lapses === 0 },
              { label: finished ? `Part ${roman(finished.dayInWeek)} finished` : 'No lesson today', done: !!finished },
            ]}
          />
          <AddToRecord onPress={() => router.push('/urge-log')} />
          <PrimaryButton label="Continue" onPress={next} />
        </>
      ) : null}

      {step === ACTION ? (
        <>
          {/* The day's lesson title and task: up to two lines over four (L64). */}
          <StepStack gap={14} controls={CONTROLS.ghost} hero={{ id: 'charger', top: 458 }}>
            <MonoText v="caps">Tonight’s action</MonoText>
            <MonoText v="h1">{lessonTitle}</MonoText>
            <MonoText v="p">{task}</MonoText>
          </StepStack>
          <PrimaryButton label="Done" bottom={96} onPress={() => take(true)} />
          <GhostLink label="Skip tonight" onPress={() => take(false)} />
        </>
      ) : null}

      {/* Back walks to the cover; the ✕ leaves without saving, as it always has. */}
      <NavBar left="back" centre={{ step, total: RAIL }} right="close" onBack={() => setStep((s) => s - 1)} onClose={close} />
    </Screen>
  );
}
