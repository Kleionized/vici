import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, TextInput, View } from 'react-native';

import {
  CupMark,
  DawnBand,
  DayBadge,
  DayClosing,
  DayDots,
  DayShell,
  DayTitle,
  EnergyBars,
  LedgerMark,
  LedgerRow,
  LedgerRule,
  MoodDial,
  RerollGlyph,
  ScaleEnds,
  ScaleReading,
  SignaturePad,
  SunMark,
} from '@/components/day/kit';
import { AppText, PressScale } from '@/components/ui';
import { useCheckins, useCreateJournalEntry, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap, useLessons, useUpsertCheckin } from '@/lib/backend';
import { toDateKey, todayKey } from '@/lib/date';
import { roman } from '@/lib/lessonArt';
import { buildScore, SCORE_WEIGHTS } from '@/lib/score';
import { fonts } from '@/lib/theme';

/**
 * Frames 126–130 · the morning check-in.
 *
 * Five steps: what yesterday came to, how the day feels, what is in the tank,
 * the pledge, and the ground it puts you on. The recap is deliberately first —
 * the day opens on evidence that the last one held, not on a question.
 *
 * The day's one action is not asked for here: it belongs to the morning variant
 * of the daily check-in (frames 158–159, `components/MoodLogger`).
 */

const STEPS = 5;

/** The openers the reroll cycles; the first is the one the canvas draws. */
const OPENERS = ['I am abstaining today because…', 'What I am protecting today is…', 'Today stays clean because…'];

/** What the mood dial reads back. The canvas draws the fourth rung. */
const MOOD_READ: [string, string][] = [
  ['Rough', 'Start slow'],
  ['Low', 'Not much in reserve'],
  ['Even', 'Nothing pulling'],
  ['Good', 'Steady and clear'],
  ['Great', 'Ready for it'],
];

/** What the tank reads back. The canvas draws the second rung. */
const ENERGY_READ: [string, string][] = [
  ['Empty', 'Ask little of yourself'],
  ['Low', 'Go gentle today'],
  ['Enough', 'Steady pace'],
  ['Good', 'Room to push'],
  ['Full', 'Use it'],
];

/** Day one is the day you signed up, not the day after. */
function dayNumber(createdAt?: number): number {
  if (!createdAt) return 1;
  return Math.max(1, Math.floor((Date.now() - createdAt) / 86_400_000) + 1);
}

function clockTime(ms: number): string {
  return new Date(ms).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
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

  const [step, setStep] = useState(0);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(1);
  const [opener, setOpener] = useState(0);
  const [pledge, setPledge] = useState('');
  const [signed, setSigned] = useState(false);

  const day = dayNumber(user?.createdAt);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  // Yesterday's ledger, read out of the log rather than from a placeholder.
  const midnight = new Date().setHours(0, 0, 0, 0);
  const dawn = midnight - 86_400_000;
  const yesterday = (ms: number) => ms >= dawn && ms < midnight;

  const urges = (events ?? []).filter((e) => e.type.startsWith('urge') && yesterday(e.createdAt));
  const lapses = (events ?? []).filter((e) => e.type === 'lapse' && yesterday(e.createdAt)).length;
  const lastUrge = urges[urges.length - 1];
  const signedPledge = (journal ?? []).find((entry) => entry.tag === 'Pledge' && yesterday(entry.createdAt));
  const finished = (lessons ?? []).find((lesson) => {
    const at = progress?.[lesson.slug]?.completedAt;
    return at != null && yesterday(at);
  });

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
    if (pledge.trim()) {
      await createJournalEntry({ tag: 'Pledge', title: `Day ${day} pledge`, body: `${OPENERS[opener].replace('…', '')} ${pledge.trim()}` }).catch(() => {});
    }
    close();
  }

  const label = [`Begin day ${day}`, 'Continue', 'Continue', 'Sign the pledge', 'Done'][step];
  const onCta = () => {
    if (step === 3 && !signed) return setSigned(true);
    if (step === STEPS - 1) return void finish();
    setStep((s) => s + 1);
  };

  return (
    <>
      <StatusBar style="dark" />
      <DayShell rail={<DayDots step={step} count={STEPS} />} onBack={step === 0 ? close : () => setStep((s) => s - 1)} cta={onCta} ctaLabel={label}>
        {step === 0 ? (
          <>
            <LedgerMark top={96} />
            <DayTitle top={324}>Yesterday held.</DayTitle>
            <View style={{ position: 'absolute', left: 12, right: 12, top: 384, height: 242, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
              <LedgerRow top={14} mark="gauge" glyph={[18, 11]} title="Recovery score" detail={`+${gained} → ${score.total.toLocaleString()}`} strong />
              <LedgerRule top={62} />
              <LedgerRow
                top={70}
                mark="wave"
                glyph={[17, 12]}
                title={lastUrge ? `${urges.length === 1 ? 'One urge' : `${urges.length} urges`} · ${clockTime(lastUrge.createdAt)}` : 'No urges logged'}
                detail={lastUrge ? (lastUrge.type === 'urge_rode_out' ? 'rode it out' : 'logged') : undefined}
              />
              <LedgerRule top={118} />
              <LedgerRow
                top={126}
                mark="check"
                glyph={[13, 11]}
                title={signedPledge ? 'Pledge kept' : 'No pledge signed'}
                detail={signedPledge ? `signed ${clockTime(signedPledge.createdAt)}` : undefined}
              />
              <LedgerRule top={174} />
              <LedgerRow
                top={182}
                mark="play"
                glyph={[11, 14]}
                title={finished ? `Part ${roman(finished.dayInWeek)} finished` : 'No lesson yesterday'}
                detail={finished ? `${finished.estimatedMinutes ?? 7} min` : undefined}
              />
            </View>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <SunMark top={64} />
            <DayTitle top={236}>How are you feeling?</DayTitle>
            <MoodDial value={mood} onChange={setMood} top={346} />
            <ScaleEnds top={410} low="Rough" high="Great" />
            <ScaleReading top={468} label={MOOD_READ[mood][0]} note={MOOD_READ[mood][1]} />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <CupMark top={64} />
            <DayTitle top={226}>How much is in the tank?</DayTitle>
            <EnergyBars value={energy} onChange={setEnergy} top={354} />
            <ScaleEnds top={442} low="Empty" high="Full" />
            <ScaleReading top={500} label={ENERGY_READ[energy][0]} note={ENERGY_READ[energy][1]} />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <View style={{ position: 'absolute', left: 12, right: 12, top: 162, height: 210, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.07)' }}>
              <PressScale
                onPress={() => setOpener((i) => (i + 1) % OPENERS.length)}
                accessibilityRole="button"
                accessibilityLabel="Another opener"
                hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                style={{ position: 'absolute', right: 18, top: 18, minHeight: 0 }}>
                <RerollGlyph size={14} />
              </PressScale>
              <AppText style={{ position: 'absolute', left: 24, right: 50, top: 26, fontFamily: fonts.quote, fontStyle: 'italic', fontSize: 19, lineHeight: 30, color: '#8B8882' }}>
                {OPENERS[opener]}
              </AppText>
              <TextInput
                value={pledge}
                onChangeText={setPledge}
                multiline
                placeholder="the mornings are mine again"
                placeholderTextColor="rgba(139,136,130,0.6)"
                style={[
                  { position: 'absolute', left: 24, right: 28, top: 88, height: 92, fontFamily: fonts.quote, fontSize: 19, lineHeight: 30, color: '#1D1C1A', padding: 0 },
                  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
                ]}
              />
            </View>

            {/* one tap sets the mark, because this is a promise, not a form */}
            <SignaturePad
              top={392}
              name={user?.displayName || 'You'}
              stamp={`${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · Day ${day}`}
              signed={signed}
              onSign={() => setSigned(true)}
              onClear={() => setSigned(false)}
            />
          </>
        ) : null}

        {step === 4 ? (
          <>
            <DawnBand top={96} />
            <DayBadge top={438} mark="laurel" />
            <DayClosing top={526} headline={`Day ${day}, underway.`} note={`Pledge signed · ${day}-day run`} />
          </>
        ) : null}
      </DayShell>
    </>
  );
}
