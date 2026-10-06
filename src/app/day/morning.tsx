import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { CONTROLS, CheckinCover, DoneMark, RecordRows, Stack, StepStack, TaskCard, dayNumber } from '@/components/day/board';
import { dayAction } from '@/components/day/kit';
import { lessonForDay } from '@/content/curriculum84';
import {
  EnergyBars,
  GhostLink,
  Grid2,
  Hero,
  MonoText,
  NavBar,
  NextFab,
  PledgeCard,
  PrimaryButton,
  SHEET_TOP,
  ScaleReading,
  Screen,
  Sheet,
  TextField,
  ToneScale,
} from '@/components/mono';
import { useCheckins, useCreateJournalEntry, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap, useLessons, useUpsertCheckin } from '@/lib/backend';
import { toDateKey, todayKey } from '@/lib/date';
import { countOf, groupDigits, roman } from '@/lib/format';
import { buildScore, SCORE_WEIGHTS } from '@/lib/score';
import { pledgeText, standingPledge } from '@/lib/pledge';

/**
 * The morning check-in (today-day §3): a cover, then five steps on the eight
 * dashes — whether yesterday's task happened, what yesterday came to, how the
 * day feels, what is in the tank, and the pledge re-signed — and the close.
 *
 * The flow and what it writes are unchanged; every board is the overhaul's
 * mono kit at the frame's own canvas numbers. The rail's lit count is the
 * kit's `round(step / 5 × 8)`, which lights 2, 3, 5, 6 and 8 as the frames do.
 */

const COVER = 0;
const TASK = 1;
const LEDGER = 2;
const FEELING = 3;
const ENERGY = 4;
const PLEDGE = 5;
const DONE = 6;

/** Steps the dashes count: TASK … PLEDGE. */
const RAIL = 5;

/** What the mood discs read back. The canvas draws the third rung. */
const MOOD_READ: [string, string][] = [
  ['Rough', 'Start slow'],
  ['Low', 'Not much in reserve'],
  ['Steady', 'On level ground'],
  ['Good', 'Steady and clear'],
  ['Great', 'Ready for it'],
];

/** What the energy meter reads back. The canvas draws the second bar. */
const ENERGY_READ: [string, string][] = [
  ['Empty', 'Ask little of yourself'],
  ['Low', 'Still warming up'],
  ['Enough', 'Steady pace'],
  ['Good', 'Room to push'],
  ['Full', 'Use it'],
];

const ANSWERS = ['Yes', 'Not yet'] as const;
type Answer = (typeof ANSWERS)[number];

export default function Morning() {
  const router = useRouter();
  const user = useCurrentUser();
  const events = useEvents();
  const checkins = useCheckins();
  const journal = useJournalEntries();
  const lessons = useLessons();
  const progress = useLessonProgressMap();
  const upsert = useUpsertCheckin();
  const createJournalEntry = useCreateJournalEntry();

  const [step, setStep] = useState(COVER);
  const [yesterdayDone, setYesterdayDone] = useState<boolean | undefined>(undefined);
  const [mood, setMood] = useState(2);
  const [energy, setEnergy] = useState(1);
  const [signed, setSigned] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [sheetText, setSheetText] = useState('');
  const [draft, setDraft] = useState<string | null>(null);

  const day = dayNumber(user?.createdAt);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  // Yesterday's ledger, read out of the log rather than from a placeholder.
  const midnight = new Date().setHours(0, 0, 0, 0);
  const dawn = midnight - 86_400_000;
  const yesterday = (ms: number) => ms >= dawn && ms < midnight;

  // The action the flow asks after, read off yesterday's check-in row so it never
  // invents an action the user was never actually given. When the row names
  // none, yesterday's Today showed that day's lesson task (`cardSummary`, D339),
  // so that is what the morning asks after; past the course, the generic list.
  const yesterdayTask =
    (checkins ?? []).find((c) => c.date === toDateKey(new Date(dawn)))?.dailyAction ??
    lessonForDay(day - 1)?.task.cardSummary ??
    dayAction(Math.max(1, day - 1));

  const urges = (events ?? []).filter((e) => e.type.startsWith('urge') && yesterday(e.createdAt));
  const lapses = (events ?? []).filter((e) => e.type === 'lapse' && yesterday(e.createdAt)).length;
  const signedPledge = (journal ?? []).find((entry) => entry.tag === 'Pledge' && yesterday(entry.createdAt));
  const finished = (lessons ?? []).find((lesson) => {
    const at = progress?.[lesson.slug]?.completedAt;
    return at != null && yesterday(at);
  });

  // The standing pledge — the latest `Pledge` entry, the words Today p3 prints.
  // A draft written in the sheet stands in until it is signed.
  const standing = standingPledge(journal);
  const pledgeBody = draft ?? (pledgeText(standing) || 'The mornings are mine again.');

  // The score row shows what yesterday alone put on the board, on the same
  // weights the score itself is built from.
  const score = buildScore(checkins ?? [], events ?? [], Object.values(progress ?? {}).filter((p) => p.status === 'completed').length, user?.createdAt);
  const gained =
    (lapses ? 0 : SCORE_WEIGHTS.cleanDay) +
    ((checkins ?? []).some((c) => c.date === toDateKey(new Date(dawn))) ? SCORE_WEIGHTS.checkin : 0) +
    (finished ? SCORE_WEIGHTS.lesson : 0) +
    urges.filter((e) => e.type === 'urge_rode_out').length * SCORE_WEIGHTS.urgeRidden +
    lapses * SCORE_WEIGHTS.slip;

  async function finish() {
    // The upsert merges, so only what this flow asked for is written.
    await upsert({ date: todayKey(), mood: mood + 1, energy: energy + 1 }).catch(() => {});
    // The answer about yesterday's action belongs to yesterday's row.
    if (yesterdayDone !== undefined) {
      await upsert({ date: toDateKey(new Date(dawn)), dailyActionDone: yesterdayDone }).catch(() => {});
    }
    // Re-signing files today's promise; a draft written in the sheet is what
    // gets filed if one was written.
    await createJournalEntry({ tag: 'Pledge', title: `Day ${day} pledge`, body: pledgeBody }).catch(() => {});
    close();
  }

  // Day 1 has no yesterday: no task to ask after and no ledger to read out, so the
  // flow opens on the feeling and its dashes count the three steps it has —
  // nothing is written to a row dated before the account (D400). Only a loaded
  // account is a first day: while it loads `day` reads 1 for everyone, and a
  // quick Begin would skip yesterday's task for a user on day 13.
  const firstDay = user != null && day <= 1;
  if (step === COVER) return <CheckinCover part="morning" day={day} onBegin={() => setStep(firstDay ? FEELING : TASK)} onClose={close} />;

  const back = () => setStep((s) => (firstDay && s === FEELING ? COVER : s - 1));
  const next = () => setStep((s) => s + 1);
  const answer: Answer | null = yesterdayDone === undefined ? null : yesterdayDone ? 'Yes' : 'Not yet';
  const openSheet = () => {
    // the field opens on the pledge as it stands, never on an abandoned edit
    setSheetText(pledgeBody);
    setSheet(true);
  };

  return (
    <Screen>
      {step === TASK ? (
        <>
          {/* The sentence is yesterday's lesson task — up to seven lines (L58). */}
          <StepStack gap={18} controls={CONTROLS.fab} hero={{ id: 'charger', top: 506 }}>
            <MonoText v="h1">Did you complete this task?</MonoText>
            <View style={{ height: 4 }} />
            <TaskCard label="Yesterday" sentence={yesterdayTask} />
            <View style={{ height: 4 }} />
            {/* Nothing is chosen until it is tapped: a default "Yes" would write a
                completion the user never claimed (CRITIC §5, OQ-M1). */}
            <Grid2 options={ANSWERS} value={answer} onChange={(a) => setYesterdayDone(a === 'Yes')} />
          </StepStack>
          <NextFab onPress={next} disabled={answer == null} />
        </>
      ) : null}

      {step === LEDGER ? (
        <>
          <Stack gap={20}>
            <MonoText v="h1">Yesterday’s record.</MonoText>
          </Stack>
          <RecordRows
            rows={[
              // A day that put nothing on the board — or took some off — is not a
              // row the day earned, so it gets the kit's empty disc like the others (D237).
              { label: 'Recovery score', value: `${gained < 0 ? '−' : '+'}${Math.abs(gained)} → ${groupDigits(score.total)}`, done: gained > 0 },
              { label: signedPledge ? 'Pledge kept' : 'No pledge signed', done: !!signedPledge },
              {
                label: urges.length === 0 ? 'No urges logged' : urges.length === 1 ? 'One urge surfed' : `${urges.length} urges surfed`,
                done: urges.length > 0,
              },
              { label: countOf(lapses, 'slip'), done: lapses === 0 },
              { label: finished ? `Part ${roman(finished.dayInWeek)} finished` : 'No lesson yesterday', done: !!finished },
            ]}
          />
          <Hero id="sunrise" top={506} controls={CONTROLS.primary} />
          <PrimaryButton label="Continue" onPress={next} />
        </>
      ) : null}

      {step === FEELING ? (
        <>
          <Hero id="sunrise" top={506} controls={CONTROLS.primary} />
          <Stack gap={20}>
            <MonoText v="h1">How are you feeling?</MonoText>
          </Stack>
          <ToneScale value={mood} onChange={setMood} labels={MOOD_READ.map((r) => r[0])} />
          <ScaleReading word={MOOD_READ[mood][0]} line={MOOD_READ[mood][1]} />
          <PrimaryButton label="Continue" onPress={next} />
        </>
      ) : null}

      {step === ENERGY ? (
        <>
          <Hero id="battery" top={506} controls={CONTROLS.primary} />
          <Stack gap={20}>
            <MonoText v="h1">Where’s your energy?</MonoText>
          </Stack>
          <EnergyBars value={energy} onChange={setEnergy} labels={ENERGY_READ.map((r) => r[0])} />
          <ScaleReading word={ENERGY_READ[energy][0]} line={ENERGY_READ[energy][1]} />
          <PrimaryButton label="Continue" onPress={next} />
        </>
      ) : null}

      {step === PLEDGE ? (
        <>
          {/* The pledge is the user's own words, any length. */}
          <StepStack gap={18} controls={CONTROLS.ghost} hero={{ id: 'fountainPen', top: 458 }}>
            <MonoText v="h1">Re-sign your pledge.</MonoText>
            <View style={{ height: 6 }} />
            {/* One step, two frames: the first press inks the line, the second
                moves on. The line itself signs and un-signs — the old plate's
                clear-× is not drawn, so the line keeps that function (OQ-M4). */}
            <PledgeCard pledge={pledgeBody} name={user?.displayName || 'You'} signed={signed} onPressLine={() => setSigned((s) => !s)} />
          </StepStack>
          <PrimaryButton label={signed ? 'Confirm' : 'Sign for today'} bottom={96} onPress={() => (signed ? next() : setSigned(true))} />
          <GhostLink label="Change the pledge" onPress={openSheet} />
        </>
      ) : null}

      {step === DONE ? (
        <>
          <DoneMark />
          <Stack top={458} gap={18} center>
            <MonoText v="h1" center style={{ alignSelf: 'stretch' }}>{`Day ${day}, underway.`}</MonoText>
            <MonoText v="caps" center style={{ alignSelf: 'stretch' }}>{`Pledge re-signed on Day ${day}`}</MonoText>
          </Stack>
          <PrimaryButton label="Done" onPress={() => void finish()} />
        </>
      ) : null}

      {/* Back walks to the cover; the ✕ leaves without saving. On the closing
          board the day is already complete, so its ✕ files it like Done (D235). */}
      <NavBar
        left={step === DONE ? 'empty' : 'back'}
        centre={step === DONE ? null : firstDay ? { step: step - LEDGER, total: RAIL - LEDGER } : { step, total: RAIL }}
        right="close"
        onBack={back}
        onClose={step === DONE ? () => void finish() : close}
      />

      <Sheet
        open={sheet}
        top={SHEET_TOP.pledge}
        onClose={() => setSheet(false)}
        footer={
          <>
            <PrimaryButton
              label="Sign the new pledge"
              bottom={96}
              onPress={() => {
                // The sheet writes the words; the page behind it still has to be
                // signed for today, which is what its own pill is for.
                setDraft(sheetText.trim() || pledgeBody);
                setSigned(false);
                setSheet(false);
              }}
            />
            <GhostLink label="Keep current pledge" zIndex={42} onPress={() => setSheet(false)} />
          </>
        }>
        <MonoText v="h1">Change the pledge</MonoText>
        <MonoText v="p">One promise you can keep every day.</MonoText>
        <View style={{ height: 8 }} />
        <TextField variant="card" value={sheetText} onChangeText={setSheetText} accessibilityLabel="Your pledge" />
      </Sheet>
    </Screen>
  );
}
