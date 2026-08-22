import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  ActionCard,
  ChangePledgeSheet,
  CheckinCover,
  DayBadge,
  DayClosing,
  DayDots,
  DayShell,
  DayTitle,
  LedgerMark,
  LedgerRow,
  LedgerRule,
  MoodDial,
  MorningSky,
  NightActionArt,
  ScaleReading,
  dayAction,
} from '@/components/day/kit';
import { BoardTitle } from '@/components/MoodLogger';
import { AppText, PressScale } from '@/components/ui';
import { useCheckins, useCreateJournalEntry, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap, useLessons, useUpsertCheckin } from '@/lib/backend';
import { toDateKey, todayKey } from '@/lib/date';
import { roman } from '@/lib/lessonArt';
import { buildScore, SCORE_WEIGHTS } from '@/lib/score';
import { fonts, sans } from '@/lib/theme';

/**
 * 21D0–21D6 · the morning check-in.
 *
 * A cover, then six steps on the rail: whether yesterday's task happened, what
 * yesterday came to, how the day feels, what is in the tank, the pledge re-signed,
 * and the ground it all puts you on.
 *
 * `UI Final 1` re-cuts the flow. It puts a cover in front of it, swaps the first
 * two steps so the day opens on a question rather than on the recap, takes the
 * rail from seven dots to six, withdraws the standalone "One action for today"
 * board, and replaces the compose-a-pledge screen with a re-sign-the-standing-one
 * screen behind which a sheet does the composing. Five of the eight frames are
 * new; none is unchanged.
 */

/** The steps, in the order `UI Final 1` numbers them. */
const COVER = 0;
const TASK = 1;
const LEDGER = 2;
const FEELING = 3;
const ENERGY = 4;
const PLEDGE = 5;
const DONE = 6;

const RAIL = 6;
/** The rail index each screen shows, or `null` where the frame draws none. */
const RAIL_AT = [null, 0, 1, 2, 3, 4, 5] as const;

/** What the mood dial reads back. The canvas draws the third rung. */
const MOOD_READ: [string, string][] = [
  ['Rough', 'Start slow'],
  ['Low', 'Not much in reserve'],
  ['Steady', 'On level ground'],
  ['Good', 'Steady and clear'],
  ['Great', 'Ready for it'],
];

/** What the energy dial reads back. The canvas draws the second rung. */
const ENERGY_READ: [string, string][] = [
  ['Empty', 'Ask little of yourself'],
  ['Low', 'Still warming up'],
  ['Enough', 'Steady pace'],
  ['Good', 'Room to push'],
  ['Full', 'Use it'],
];

/** Day one is the day you signed up, not the day after. */
function dayNumber(createdAt?: number): number {
  if (!createdAt) return 1;
  return Math.max(1, Math.floor((Date.now() - createdAt) / 86_400_000) + 1);
}

/**
 * `21D1 · Did you complete this task?` answers with two glyph pills rather than
 * the two 74pt discs the previous bundle drew: one row, 54 tall, split down the
 * middle with a 12 gap.
 *
 * Neither `<path>` on the canvas carries a `fill`, so both fall back to black —
 * the cross encloses nothing and paints nothing, but the check's three points
 * enclose a thin triangle that paints `#000000` over the ink pill. `fill="none"`
 * is stated on both here.
 */
function AnswerRow({ onNo, onYes }: { onNo: () => void; onYes: () => void }) {
  return (
    <View style={{ position: 'absolute', left: 16, right: 16, bottom: 84, height: 54, flexDirection: 'row', gap: 12 }}>
      <PressScale
        onPress={onNo}
        accessibilityRole="button"
        accessibilityLabel="No"
        style={{ flex: 1, minHeight: 0, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}>
        <Svg width={17} height={17} viewBox="0 0 17 17">
          <Path d="M4 4L13 13M13 4L4 13" fill="none" stroke="#1D1C1A" strokeWidth={2.2} strokeLinecap="round" />
        </Svg>
      </PressScale>
      <PressScale
        onPress={onYes}
        accessibilityRole="button"
        accessibilityLabel="Yes"
        style={{ flex: 1, minHeight: 0, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: '#131313' }}>
        <Svg width={19} height={15} viewBox="0 0 19 15">
          <Path d="M2 8L7 13L17 2" fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </PressScale>
    </View>
  );
}

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
  const [draft, setDraft] = useState<string | null>(null);

  const day = dayNumber(user?.createdAt);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  // Yesterday's ledger, read out of the log rather than from a placeholder.
  const midnight = new Date().setHours(0, 0, 0, 0);
  const dawn = midnight - 86_400_000;
  const yesterday = (ms: number) => ms >= dawn && ms < midnight;

  // The action the flow asks after, read off the check-in row so it never
  // invents an action the user was never actually given.
  const yesterdayTask = (checkins ?? []).find((c) => c.date === toDateKey(new Date(dawn)))?.dailyAction ?? dayAction(Math.max(1, day - 1));

  const urges = (events ?? []).filter((e) => e.type.startsWith('urge') && yesterday(e.createdAt));
  const lapses = (events ?? []).filter((e) => e.type === 'lapse' && yesterday(e.createdAt)).length;
  const signedPledge = (journal ?? []).find((entry) => entry.tag === 'Pledge' && yesterday(entry.createdAt));
  const finished = (lessons ?? []).find((lesson) => {
    const at = progress?.[lesson.slug]?.completedAt;
    return at != null && yesterday(at);
  });

  // The standing pledge — the same entry `21 · Today — p3` prints, and the words
  // `21D5` sets in type. A draft written in the sheet stands in until it is signed.
  const standing = (journal ?? []).find((entry) => entry.tag === 'Pledge');
  const pledgeBody = draft ?? standing?.body ?? 'The mornings are mine again.';

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
    // The upsert merges now, so only what this flow asked for is written.
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

  const label = ['', '', 'Continue', 'Continue', 'Continue', 'Sign for today', 'Done'][step];
  // The task check carries its own two-pill row instead of the flow's pill.
  const own = step === TASK;
  const onCta = () => {
    // The pledge page draws the signature ghosted under a "Sign for today"
    // pill: the first press inks it, the second moves on.
    if (step === PLEDGE && !signed) return setSigned(true);
    if (step === DONE) return void finish();
    setStep((s) => s + 1);
  };
  const answer = (done: boolean) => {
    setYesterdayDone(done);
    setStep(LEDGER);
  };

  // The cover is a whole frame — no rail, no Back, no shell pill — so it is
  // returned rather than drawn inside `DayShell`.
  if (step === COVER) {
    return (
      <>
        <StatusBar style="dark" />
        <CheckinCover part="morning" day={day} onBegin={() => setStep(TASK)} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <DayShell
        rail={RAIL_AT[step] == null ? undefined : <DayDots step={RAIL_AT[step]!} count={RAIL} />}
        onBack={step === TASK ? () => setStep(COVER) : () => setStep((s) => s - 1)}
        cta={own ? undefined : onCta}
        ctaLabel={label}
        backdrop={
          step === FEELING ? (
            <MorningSky
              glow={{ top: 53, size: 240, color: '#E2BA78', opacity: 0.3 }}
              disc={{ top: 150, size: 46 }}
              clouds={[
                [76, 118, 48, 8, 0.55],
                [268, 138, 38, 8, 0.45],
              ]}
              hills={[
                { top: 196, height: 150, rise: 88, color: '#E7E5DB', fade: [0, 0.8] },
                { top: 218, height: 150, rise: 70, color: '#DFDDD3', fade: [0, 0.8] },
              ]}
            />
          ) : step === ENERGY ? (
            // the only frame whose glow and hills go warm
            <MorningSky
              glow={{ top: -8, size: 300, color: '#E2A25A', opacity: 0.34 }}
              disc={{ top: 118, size: 48 }}
              clouds={[
                [70, 96, 52, 8, 0.6],
                [262, 120, 40, 8, 0.5],
              ]}
              hills={[
                { top: 180, height: 150, rise: 88, color: '#E9E4D6', fade: [0, 0.8] },
                { top: 204, height: 150, rise: 70, color: '#E1DCCB', fade: [0, 0.8] },
              ]}
            />
          ) : step === PLEDGE ? (
            // the only frame with no clouds
            <MorningSky
              glow={{ top: -13, size: 260, color: '#E2B068', opacity: 0.32 }}
              disc={{ top: 92, size: 50 }}
              hills={[
                { top: 150, height: 150, rise: 88, color: '#EAE8DF', fade: [0, 0.8] },
                { top: 172, height: 150, rise: 70, color: '#E2E0D6', fade: [0, 0.8] },
              ]}
            />
          ) : step === DONE ? (
            <MorningSky
              glow={{ top: 27, size: 340, color: '#E2BA78', opacity: 0.34 }}
              disc={{ top: 168, size: 58 }}
              clouds={[
                [64, 140, 54, 8, 0.6],
                [272, 168, 42, 8, 0.5],
              ]}
              hills={[
                { top: 360, height: 150, rise: 88, color: '#E7E5DB', fade: [0, 0.8] },
                { top: 385, height: 150, rise: 70, color: '#DFDDD3', fade: [0, 0.8] },
              ]}
            />
          ) : undefined
        }
        footer={own ? <AnswerRow onNo={() => answer(false)} onYes={() => answer(true)} /> : undefined}>
        {step === TASK ? (
          <>
            <BoardTitle>Did you complete this task?</BoardTitle>
            {/* the canvas pins the card at `top: 236` rather than centring it in
                the band between the title and the answer row */}
            <ActionCard top={182} art={<NightActionArt />} mark="moon" label="Last night" line={yesterdayTask} />
          </>
        ) : null}

        {step === LEDGER ? (
          <>
            <LedgerMark top={96} />
            <DayTitle top={324}>Yesterday held.</DayTitle>
            {/* five rows now — the relapse count came in with `UI Final 1`, and
                every trailing detail string but the score's is gone */}
            <View style={{ position: 'absolute', left: 12, right: 12, top: 384, height: 298, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
              <LedgerRow top={14} mark="gauge" glyph={[18, 11]} title="Recovery score" detail={`+${gained} → ${score.total.toLocaleString()}`} strong />
              <LedgerRule top={62} />
              <LedgerRow top={70} mark="check" glyph={[13, 11]} title={signedPledge ? 'Pledge kept' : 'No pledge signed'} />
              <LedgerRule top={118} />
              <LedgerRow
                top={126}
                mark="wave"
                glyph={[17, 12]}
                title={urges.length === 0 ? 'No urges logged' : urges.length === 1 ? 'One urge surfed' : `${urges.length} urges surfed`}
              />
              <LedgerRule top={174} />
              <LedgerRow top={182} mark="cross" glyph={[16, 16]} plate="#F3E2C0" title={lapses === 1 ? '1 relapse' : `${lapses} relapses`} />
              <LedgerRule top={230} />
              <LedgerRow top={238} mark="play" glyph={[11, 14]} title={finished ? `Part ${roman(finished.dayInWeek)} finished` : 'No lesson yesterday'} />
            </View>
          </>
        ) : null}

        {step === FEELING ? (
          <>
            <DayTitle top={216}>How are you feeling?</DayTitle>
            <MoodDial value={mood} onChange={setMood} top={326} />
            <ScaleReading top={448} label={MOOD_READ[mood][0]} note={MOOD_READ[mood][1]} />
          </>
        ) : null}

        {step === ENERGY ? (
          <>
            <DayTitle top={216}>Where’s your energy?</DayTitle>
            {/* the bars are withdrawn: energy is the same five discs the feeling
                step turns */}
            <MoodDial value={energy} onChange={setEnergy} top={326} label="Energy" />
            <ScaleReading top={448} label={ENERGY_READ[energy][0]} note={ENERGY_READ[energy][1]} />
          </>
        ) : null}

        {step === PLEDGE ? (
          <>
            <DayTitle top={216}>Re-sign your pledge.</DayTitle>
            <AppText center style={{ position: 'absolute', left: 0, right: 0, top: 276, fontFamily: fonts.quote, fontSize: 46, lineHeight: 46, color: '#C9C6BE' }}>
              “
            </AppText>
            <AppText center style={[sans('500'), { position: 'absolute', left: 44, right: 44, top: 324, fontSize: 21, lineHeight: 31, color: '#1D1C1A' }]}>
              {pledgeBody}
            </AppText>
            <AppText
              center
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 494,
                fontFamily: fonts.script,
                fontSize: 42,
                lineHeight: 42,
                color: signed ? '#1D1C1A' : '#C9C6BE',
                transform: [{ rotate: '-3deg' }],
              }}>
              {user?.displayName || 'You'}
            </AppText>
            <View style={{ position: 'absolute', left: 64, right: 64, top: 562, height: 1.5, backgroundColor: '#131313' }} />
            <PressScale
              onPress={() => setSheet(true)}
              accessibilityRole="button"
              hitSlop={{ top: 14, bottom: 14, left: 24, right: 24 }}
              style={{ position: 'absolute', left: 0, right: 0, top: 662, minHeight: 0 }}>
              <AppText center style={[sans('500'), { fontSize: 13.5, color: '#8B8882' }]}>
                Change the pledge
              </AppText>
            </PressScale>
          </>
        ) : null}

        {step === DONE ? (
          <>
            <DayBadge top={438} mark="laurel" />
            <DayClosing top={526} headline={`Day ${day}, underway.`} note={`Pledge re-signed · Day ${day}`} />
          </>
        ) : null}
      </DayShell>

      {/* Mounted only while open, so the field opens on the standing pledge
          every time rather than on the last thing that was typed into it. */}
      {sheet ? (
        <ChangePledgeSheet
          pledge={pledgeBody}
          onKeep={() => setSheet(false)}
          onSign={(next: string) => {
            // The sheet writes the words; the page behind it still has to be
            // signed for today, which is what its own pill is for.
            setDraft(next.trim() || pledgeBody);
            setSigned(false);
            setSheet(false);
          }}
        />
      ) : null}
    </>
  );
}
