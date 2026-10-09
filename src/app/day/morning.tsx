import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';

import { CONTROLS, CheckinCover, DoneMark, RecordRows, Stack, StepStack, TaskCard } from '@/components/day/board';
import { dayStep } from '@/components/day/kit';
import { lessonForDay } from '@/content/curriculum84';
import {
  EnergyBars,
  GhostLink,
  Grid2,
  Hero,
  LoadingView,
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
import { toDateKey } from '@/lib/date';
import { ENERGY_WORDS, MOOD_WORDS, isSlip, isSurfed, keyToDate, programmeDay, shiftKey } from '@/lib/day';
import { countOf, roman } from '@/lib/format';
import { lessonCompletions, ratingThrough, type RatingInput } from '@/lib/score';
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

/**
 * What the mood discs read back: the one mood word list every screen names a
 * reading by (`MOOD_WORDS`), and this question's own second lines. The canvas
 * draws the third rung.
 */
const MOOD_LINES = ['Start slow', 'Not much in reserve', 'On level ground', 'Clear-headed', 'Ready for it'];
const MOOD_READ: [string, string][] = MOOD_WORDS.map((w, i) => [w, MOOD_LINES[i]]);

/** What the energy meter reads back (`ENERGY_WORDS`). The canvas draws the second bar. */
const ENERGY_LINES = ['Do the basics', 'Still warming up', 'Steady pace', 'Room to push', 'Use it'];
const ENERGY_READ: [string, string][] = ENERGY_WORDS.map((w, i) => [w, ENERGY_LINES[i]]);

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

  // The day is fixed when the check-in opens, so one finished after midnight
  // still files where it began.
  const [openedAt] = useState(() => Date.now());
  const day = programmeDay(user, openedAt);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  // Yesterday's ledger, read out of the log rather than from a placeholder —
  // on the calendar, so a clock change cannot make "yesterday" Saturday.
  const todayKey = toDateKey(new Date(openedAt));
  const yesterdayKey = shiftKey(todayKey, -1);
  const midnight = keyToDate(todayKey).getTime();
  const dawn = keyToDate(yesterdayKey).getTime();
  const yesterday = (ms: number) => ms >= dawn && ms < midnight;
  const yesterdayRow = (checkins ?? []).find((c) => c.date === yesterdayKey);

  // The action the flow asks after, read off yesterday's check-in row so it never
  // invents an action the user was never actually given. When the row names
  // none, yesterday's Today showed that day's lesson task (`cardSummary`, D339),
  // so that is what the morning asks after; past the course, the step Today
  // showed (the one list Today and the night read too).
  const yesterdayTask = yesterdayRow?.dailyAction ?? lessonForDay(day - 1)?.task.cardSummary ?? dayStep(Math.max(1, day - 1)).caption;

  const yesterdays = (events ?? []).filter((e) => yesterday(e.createdAt));
  // surfed is ridden out; an urge acted on is a slip, never "surfed"
  const surfed = yesterdays.filter(isSurfed).length;
  const urgesLogged = yesterdays.some((e) => e.type === 'urge_rode_out' || e.type === 'urge_acted_on');
  const lapses = yesterdays.filter(isSlip).length;
  const signedPledge = (journal ?? []).find((entry) => entry.tag === 'Pledge' && yesterday(entry.createdAt));
  const finished = (lessons ?? []).find((lesson) => {
    const at = progress?.[lesson.slug]?.completedAt;
    return at != null && yesterday(at);
  });

  // The standing pledge — the latest `Pledge` entry, the words Today p3 prints.
  // A draft written in the sheet stands in until it is signed.
  const standing = standingPledge(journal);
  // With no pledge of the user's own yet, the step asks for one instead of
  // putting the design's sample line in their mouth (P3).
  const pledgeBody = draft ?? pledgeText(standing);
  const hasPledge = pledgeBody.trim() !== '';

  // The rating row: the recovery rating as yesterday closed (the seven days
  // ending yesterday — what Today shows until today is checked in) and what
  // yesterday moved it by, against the day before (src/lib/score.ts, D514).
  const ratingInput: RatingInput = { checkins: checkins ?? [], events: events ?? [], lessons: lessonCompletions(progress), start: user };
  const rating = ratingThrough(ratingInput, yesterdayKey).value;
  const moved = rating - ratingThrough(ratingInput, shiftKey(yesterdayKey, -1)).value;

  /**
   * Done (and the closing ✕) file the check-in once (D2, D499): a second tap
   * while the writes are out does nothing. The screen closes at once and the
   * writes settle behind it, in order — on a slow or absent connection Convex
   * holds them until it is back, and Done no longer sits there looking dead.
   */
  const saving = useRef(false);
  function finish() {
    if (saving.current) return;
    saving.current = true;
    // Re-signing files today's promise; a draft written in the sheet is what
    // gets filed if one was written. Doing the check-in again the same day
    // files nothing new when the same words are already signed for today.
    const title = `Day ${day} pledge`;
    const filed = (journal ?? []).some((e) => e.tag === 'Pledge' && e.title === title && e.body === pledgeBody && toDateKey(new Date(e.createdAt)) === todayKey);
    void (async () => {
      // The upsert merges, so only what this flow asked for is written.
      await upsert({ date: todayKey, mood: mood + 1, energy: energy + 1 }).catch(() => {});
      // The answer about yesterday's action belongs to yesterday's row.
      if (yesterdayDone !== undefined) {
        await upsert({ date: yesterdayKey, dailyActionDone: yesterdayDone }).catch(() => {});
      }
      if (!filed && signed && hasPledge) await createJournalEntry({ tag: 'Pledge', title, body: pledgeBody }).catch(() => {});
    })();
    close();
  }

  // Day 1 has no yesterday: no task to ask after and no ledger to read out, so the
  // flow opens on the feeling and its dashes count the three steps it has —
  // nothing is written to a row dated before the account (D400). Only a loaded
  // account is a first day: while it loads `day` reads 1 for everyone, and a
  // quick Begin would skip yesterday's task for a user on day 13.
  const firstDay = user != null && day <= 1;
  // the cover names the day, so it waits for the account rather than say "Day 1" to everyone
  if (user === undefined) return <LoadingView spinner={false} onClose={close} />;
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
            <MonoText v="h1">Did you do this?</MonoText>
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
              // A day that took the rating down — or left it at nothing — is not a
              // row the day earned, so it gets the kit's empty disc like the others (D237).
              { label: 'Recovery rating', value: `${rating} (${moved < 0 ? '−' : '+'}${Math.abs(moved)})`, done: moved >= 0 && rating > 0 },
              // a pledge is kept only on a day without a slip; signed and slipped is "signed"
              { label: signedPledge ? (lapses ? 'Pledge signed' : 'Pledge kept') : 'No pledge signed', done: !!signedPledge && lapses === 0 },
              {
                label: surfed === 0 ? (urgesLogged ? 'No urges surfed' : 'No urges logged') : surfed === 1 ? 'One urge surfed' : `${surfed} urges surfed`,
                done: surfed > 0,
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
            {hasPledge ? (
              <PledgeCard pledge={pledgeBody} name={user?.displayName || 'You'} signed={signed} onPressLine={() => setSigned((s) => !s)} />
            ) : (
              <MonoText v="p">No pledge yet. Write one promise you can keep every day.</MonoText>
            )}
          </StepStack>
          {hasPledge ? (
            <>
              <PrimaryButton label={signed ? 'Confirm' : 'Sign for today'} bottom={96} onPress={() => (signed ? next() : setSigned(true))} />
              <GhostLink label="Change the pledge" onPress={openSheet} />
            </>
          ) : (
            <>
              <PrimaryButton label="Write your pledge" bottom={96} onPress={openSheet} />
              <GhostLink label="Skip for today" onPress={next} />
            </>
          )}
        </>
      ) : null}

      {step === DONE ? (
        <>
          <DoneMark />
          <Stack top={458} gap={18} center>
            <MonoText v="h1" center style={{ alignSelf: 'stretch' }}>{`Day ${day}, underway.`}</MonoText>
            <MonoText v="caps" center style={{ alignSelf: 'stretch' }}>{signed && hasPledge ? `Pledge re-signed on Day ${day}` : `Checked in on Day ${day}`}</MonoText>
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
                setDraft(sheetText.trim() || pledgeBody || null);
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
