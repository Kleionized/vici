import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  O3CleanDay,
  O3IfNothingChanges,
  O3LineIfNothingChanges,
  O3LineWithThePlan,
  O3Next30,
  O3OneBadDay,
  O3OneYear,
  O3PuttingTogether,
  O3StartingPoint,
  O3WhatYouWantBack,
  wantBackPills,
} from '@/components/onboarding/tail';
import {
  O3StartHere,
  O3StartHereStep1,
  O3StartHereStep2,
  O3WhereWedStart,
  O3YourPlan,
  planReading,
} from '@/components/onboarding/plan';
import { O3AgeGate, O3FunnelStep, O3Shell, O3_AGE_MIN } from '@/components/onboarding/funnel';
import {
  O3LetterArrived,
  O3LetterRead,
  O3MedallionEarned,
  O3TheVow,
} from '@/components/onboarding/handover';
import { O3DayZero, O3Reminders } from '@/components/onboarding/reminders';
import { buildWeekXiiLetter, daysPer30, daysPerYear, daysToAge80, windowFor } from '@/components/onboarding/v3';
import { GhostLink, LoadingView, MonoText, PrimaryButton, SHEET_TOP, Sheet } from '@/components/mono';
import { PaywallFlow } from '@/components/paywall/PaywallFlow';
import { lessonForDay } from '@/content/curriculum84';
import { FUNNEL_STEPS } from '@/content/onboardingFunnel';
import { ACCOUNT_KEYS, readAccountJSON, removeAccountKey, writeAccountJSON } from '@/lib/accountState';
import { FORCE_MOCK } from '@/lib/config';
import { shortDate } from '@/lib/format';
import { VOW_TEXT } from '@/lib/pledge';
import { useAuth } from '@/lib/auth';
import { useCompleteOnboarding, useCreateJournalEntry, useUpdateProfile } from '@/lib/backend';
import { todayKey } from '@/lib/date';
import { usePurchases } from '@/lib/purchases';
import { cancelAllReminders } from '@/lib/reminders';
import { suggestCheckinBefore } from '@/lib/routines';
import { mono } from '@/lib/theme';

/**
 * The onboarding funnel, in the order `Latest Vici FULL` numbers it.
 *
 * The account is made first (`02 · Login`), so the questionnaire opens on the
 * three that name him — `03 · Name`, `04 · Age`, `05 · Gender` — then runs
 * `06 · Start` through `23 · Goal confirmation` and hands over to the plan.
 * This drop withdraws `What Happens First`, `We Have Enough` and
 * `What It Affects`, and adds five: `09B · Relapse`, `14 · What starts it`,
 * `15 · Transition`, `17 · What it affects` (a redesign of the withdrawn one)
 * and `23 · Goal confirmation`.
 *
 * The twenty-two questionnaire screens are data: `src/content/onboardingFunnel.ts`
 * is generated from the frames themselves, and `O3FunnelStep` draws whichever
 * shape a step declares.
 */

type Answers = Record<string, string | string[]>;

/**
 * Where he is in the funnel, kept on the phone under his account as he goes
 * (D2, D496): an app the OS reclaims, or a crash, reopens on the same board
 * with every answer, instead of at question one. `filed` names the end-of-
 * funnel writes that have landed, so a "Begin" run again after a failure
 * never files the letter or the vow twice. Removed once onboarding is done,
 * and on sign-out (`src/lib/accountState.ts`).
 */
type Draft = { v: 1; step: string; answers: Answers; planPick: number; filed: string[] };

type Step =
  | { id: string; kind: 'funnel'; fi: number }
  | {
      id: string;
      kind:
        | 'planTogether'
        | 'wheredStart'
        | 'startHere'
        | 'startHere1'
        | 'startHere2'
        | 'yourPlan'
        | 'startingPoint'
        | 'next30'
        | 'oneYear'
        | 'age80'
        | 'lineNothing'
        | 'linePlan'
        | 'cleanDay'
        | 'oneBadDay'
        | 'wantBack'
        | 'letterArrived'
        | 'letterRead'
        | 'vow'
        | 'medallion'
        | 'reminders'
        | 'paywall'
        | 'dayZero';
    };

/*
 * The plan and the tail, by the canvas's own badges (`.overhaul/FLOW.txt`),
 * with the frame's name after it where it differs. `Vici Overhaul` splits
 * `32 · Change the Line` into two line boards and withdraws the three-page
 * campaign map (badges 35–37) — `34 · What You Want Back` goes straight to the
 * letter (D324).
 */
const STEPS: Step[] = [
  // 03 · Name … 23 · Goal confirmation
  ...FUNNEL_STEPS.map((s, fi): Step => ({ id: s.id, kind: 'funnel', fi })),
  { id: 'plan-together', kind: 'planTogether' }, //   24 · Build plan (Enlisting Aegis)
  { id: 'whered-start', kind: 'wheredStart' }, //     25 · This Is Where We’d Start
  { id: 'start-here', kind: 'startHere' }, //         26 · Start Here
  { id: 'start-here-1', kind: 'startHere1' }, //      26A · Start Here — Step 1
  { id: 'start-here-2', kind: 'startHere2' }, //      26A2 · Start Here — Step 2
  { id: 'your-plan', kind: 'yourPlan' }, //           27 · Your Plan
  { id: 'starting-point', kind: 'startingPoint' }, // 28 · Your recovery rating (Starting Score)
  { id: 'next30', kind: 'next30' }, //                29 · The Next 30 Days (Cost Next 30)
  { id: 'one-year', kind: 'oneYear' }, //             30 · One Year From Now (Cost Next 365)
  { id: 'age80', kind: 'age80' }, //                  31 · If Nothing Changes (Cost By Age 80)
  { id: 'line-nothing', kind: 'lineNothing' }, //     32 · If Nothing Changes (Line If Nothing Changes)
  { id: 'line-plan', kind: 'linePlan' }, //           32A · With the Plan (Line With the Plan)
  { id: 'clean-day', kind: 'cleanDay' }, //           32B · A Clean Day
  { id: 'one-bad-day', kind: 'oneBadDay' }, //        33 · One Bad Day
  { id: 'want-back', kind: 'wantBack' }, //           34 · What You Want Back
  { id: 'letter-arrived', kind: 'letterArrived' }, // 38 · A Letter Arrived (Letter Received)
  { id: 'letter-read', kind: 'letterRead' }, //       39 · A Letter From Week XII
  { id: 'vow', kind: 'vow' }, //                      40 · The Vow
  { id: 'medallion', kind: 'medallion' }, //          41 · Medallion Earned (Medallion Received)
  { id: 'reminders', kind: 'reminders' }, //          42 · Reminders Setup
  { id: 'paywall', kind: 'paywall' }, //              43 · Paywall
  { id: 'day-zero', kind: 'dayZero' }, //             44 · Day 0
];

/** The screens that draw their own frame, chrome and all — everything after the questionnaire but the paywall. */
const WHOLE_FRAME = new Set([
  'plan-together', 'whered-start', 'start-here', 'start-here-1', 'start-here-2', 'your-plan',
  'starting-point', 'next30', 'one-year', 'age80', 'line-nothing', 'line-plan',
  'clean-day', 'one-bad-day', 'want-back',
  'letter-arrived', 'letter-read', 'vow', 'medallion', 'reminders', 'day-zero',
]);

/**
 * Mock builds only (`EXPO_PUBLIC_FORCE_MOCK=1`, the design preview): `/welcome?step=<id>`
 * opens on that board with the answers the canvas's own man gives — the ones
 * `.overhaul/drives/tail-walk.js` taps through twenty-two questions to reach —
 * so a board can be captured without the minute-long walk (D216). `&hold=1`
 * keeps `24 · Build plan` up instead of handing over after 6.8 s, and a capture
 * seed may set `window.__ONB_ANSWERS` to change any of the answers (the boards'
 * undrawn states: other signals, other picks, no name).
 */
const SAMPLE_ANSWERS: Answers = {
  name: 'Sam',
  ageYears: '24',
  gender: 'Male',
  freq: 'A few times a week',
  duration: '1–3 years',
  quitAttempts: 'Yes, once or twice',
  relapseSpan: 'A few days',
  triggers: ['Late at night', 'When I’m home alone'],
  emotions: ['Bored'],
  places: ['In bed'],
  before: ['I start scrolling'],
  impact: 'Quite a bit',
  affects: ['Focus', 'Sleep', 'Confidence'],
  lonely: 'Sometimes',
  alone: 'Now and then',
  goalPorn: 'Stop completely',
  goalMast: 'Keep it, just without porn',
  tried: ['Blocking sites or apps'],
};
const stepIndex = (id: string | undefined) => (id ? STEPS.findIndex((s) => s.id === id) : -1);
const sampleOverride = (): Answers | null => (globalThis as { __ONB_ANSWERS?: Answers }).__ONB_ANSWERS ?? null;

/**
 * Where the "Use a different account?" sheet's body may end inside its column
 * and still clear the pill: the 30 h1, the 10 gap and two 23 lines — the
 * sign-out sheet's drawn body, as Settings measures it (D488).
 */
const LEAVE_BODY_FOOT = 30 + 10 + 2 * 23;

const AGE_END = 80;
const AGE_DEFAULT = 24;
/** The three boards that carry his `07 · Frequency` answer forward (D471). */
const COST_BOARDS = new Set<Step['kind']>(['next30', 'oneYear', 'age80']);

/**
 * The two conditional questions, and what earns them.
 *
 * `18 · Loneliness` and `19 · Time alone` are shown only when an earlier answer
 * gives a reason to ask — the questionnaire doc's own rule, and the one thing
 * about these screens no frame can state. The doc names three signals for 18
 * (loneliness, being home alone, an argument or rejection); 19 measures
 * opportunity rather than feeling, so it follows the home/alone half of that
 * set, plus a loneliness he has just reported on 18.
 */
const has = (v: string | string[] | undefined, label: string) => Array.isArray(v) && v.includes(label);
const lonelySignal = (a: Answers) =>
  has(a.emotions, 'Lonely') || has(a.triggers, 'When I’m home alone') || has(a.before, 'I argue with someone or feel rejected');
const aloneSignal = (a: Answers) =>
  has(a.triggers, 'When I’m home alone') || has(a.emotions, 'Lonely') || a.lonely === 'Often' || a.lonely === 'Most days';

export default function Onboarding() {
  const router = useRouter();
  const { displayName, email, signOut, userId } = useAuth();
  const { membership, membershipKnown } = usePurchases();
  /** Already a member — bought before the app was killed, or on another phone: the paywall is passed by (D2, D497). */
  const entitled = membershipKnown && membership.isActive;
  const completeOnboarding = useCompleteOnboarding();
  const updateProfile = useUpdateProfile();
  const createJournalEntry = useCreateJournalEntry();
  const params = useLocalSearchParams<{ step?: string; hold?: string }>();
  // D216: a mock build can open on any board (`?step=`) with the canvas's own answers
  const jump = FORCE_MOCK ? stepIndex(params.step) : -1;

  const [i, setI] = useState(() => Math.max(0, jump));
  // `26 · Start Here` draws "Choose another" with no destination frame in the
  // bundle; it swaps the proposed first change for the next signal instead.
  const [planPick, setPlanPick] = useState(0);
  // `04 · Age` carries a gate the canvas cannot draw: under 18 leaves the adult
  // flow instead of answering twenty more questions about porn.
  const [gated, setGated] = useState(false);
  // U4: Back on `03 · Name` asks before it signs him out (see `backToDoor`)
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveBodyFoot, setLeaveBodyFoot] = useState(LEAVE_BODY_FOOT);
  // one finish per run: "Begin" tapped twice must not file the letter and vow twice
  const finishing = useRef(false);
  const [finishingNow, setFinishingNow] = useState(false);
  /** The end-of-funnel writes that have landed (the draft's `filed`). */
  const filed = useRef<Set<string>>(new Set());
  /** The draft has been read back (or there is none to read: a mock `?step=` jump starts where it is told). */
  const [restored, setRestored] = useState(() => jump >= 0);
  const [a, setA] = useState<Answers>(() =>
    jump > 0 ? { ...SAMPLE_ANSWERS, ...(displayName ? { name: displayName } : null), ...sampleOverride() } : displayName ? { name: displayName } : ({} as Answers),
  );
  const set = (k: string, v: string | string[]) => setA((s) => ({ ...s, [k]: v }));

  const typedAge = parseInt(String(a.ageYears || ''), 10);
  const per30 = daysPer30(a.freq);
  const skip = (idx: number): boolean => {
    const s = STEPS[idx];
    if (!s) return false;
    // The cost boards draw his own rate (D471). With no rate to draw — the
    // question unanswered — they are left out rather than drawn from a sample;
    // "By age 80" is left out for a man already 80 or older.
    if (COST_BOARDS.has(s.kind)) return per30 == null || (s.kind === 'age80' && Number.isFinite(typedAge) && typedAge >= AGE_END);
    // a member is not sold the plan he already holds (D497)
    if (s.kind === 'paywall') return entitled;
    if (s.kind !== 'funnel') return false;
    switch (FUNNEL_STEPS[s.fi].id) {
      // 09B follows a stated quit attempt and nothing else: a man who has never
      // tried to stop has no relapse history to report.
      case 'relapseSpan':
        return !String(a.quitAttempts ?? '').startsWith('Yes');
      case 'lonely':
        return !lonelySignal(a);
      case 'alone':
        return !aloneSignal(a);
      default:
        return false;
    }
  };
  const move = (from: number, dir: number) => {
    let n = from + dir;
    while (n > 0 && n < STEPS.length && skip(n)) n += dir;
    return Math.max(0, Math.min(STEPS.length - 1, n));
  };
  const next = () => setI((v) => move(v, 1));
  const back = () => setI((v) => move(v, -1));

  // The draft, read back once (D496). The mock's `?step=` captures start where they are told and keep nothing.
  useEffect(() => {
    if (restored) return;
    let alive = true;
    void readAccountJSON<Draft>(ACCOUNT_KEYS.onboarding, userId).then((d) => {
      if (!alive) return;
      if (d?.v === 1 && d.answers && typeof d.answers === 'object') {
        setA(d.answers);
        const at = stepIndex(d.step);
        if (at > 0) setI(at);
        if (typeof d.planPick === 'number') setPlanPick(d.planPick);
        filed.current = new Set(Array.isArray(d.filed) ? d.filed : []);
      }
      setRestored(true);
    });
    return () => {
      alive = false;
    };
    // read once, for the account that opened the funnel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // …and written as he goes: every board and every answer.
  useEffect(() => {
    if (!restored || jump >= 0 || finishing.current) return;
    const draft: Draft = { v: 1, step: STEPS[i].id, answers: a, planPick, filed: [...filed.current] };
    void writeAccountJSON(ACCOUNT_KEYS.onboarding, draft, userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restored, i, a, planPick]);

  // Arriving on the paywall already a member — restored onto it after the app
  // was killed, or the store answered after he got there — passes it by. Once
  // the store has said "not a member" here, a purchase made on it runs its own
  // confirmation and moves on itself (D497).
  const paywallSeenFree = useRef(false);
  useEffect(() => {
    if (STEPS[i]?.kind !== 'paywall') {
      paywallSeenFree.current = false;
      return;
    }
    if (!membershipKnown) return;
    if (!membership.isActive) paywallSeenFree.current = true;
    else if (!paywallSeenFree.current) setI((v) => (STEPS[v]?.kind === 'paywall' ? move(v, 1) : v));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, membershipKnown, membership.isActive]);

  /** One end-of-funnel write that has not landed yet — run once, and marked in the draft when it lands. */
  async function fileOnce(key: string, write: () => Promise<unknown>) {
    if (filed.current.has(key)) return;
    const ok = await write().then(
      () => true,
      () => false,
    );
    if (!ok) return;
    filed.current.add(key);
    const draft: Draft = { v: 1, step: STEPS[i].id, answers: a, planPick, filed: [...filed.current] };
    await writeAccountJSON(ACCOUNT_KEYS.onboarding, draft, userId);
  }

  async function finish() {
    if (finishing.current) return;
    finishing.current = true;
    setFinishingNow(true);
    const name = String(a.name || displayName || '').trim();
    const letter = buildWeekXiiLetter({ ...a, name });
    if (name) await updateProfile(name).catch(() => {});
    // The week-XII letter rides with him, kept in the Journal — VICI's letter,
    // written as him at week XII, and titled so (D476).
    const body = `${letter.name ? letter.name + ' —' : 'Friend —'}\n\n${letter.paragraphs.join('\n\n')}\n\n— VICI, written as you at week XII`;
    await fileOnce('letter', () => createJournalEntry({ tag: 'Letter', title: 'A letter from week XII', body }));
    // `40 · The Vow`, if he signed it: the words he signed, dated today, which
    // `/vow` reads back (D474). "Not now" files nothing.
    if (a.vow === 'signed') await fileOnce('vow', () => createJournalEntry({ tag: 'Vow', title: 'Vow', body: VOW_TEXT }));
    // Nothing goes to the Life Map (D477): the questionnaire asks no "why", so
    // the sentence once assembled from two chip answers is not written, and
    // the feelings he has before watching are not his values.
    // Day 1 of the programme is today, on this phone's calendar (src/lib/day.ts)
    const done = await completeOnboarding({ programmeStartedAt: todayKey() }).then(
      () => true,
      () => false,
    );
    if (!done) {
      // Refused: he stays on Day 0 and "Begin" tries again (D498). Going on
      // anyway sent him to the time boards and then, unonboarded, back to
      // question one.
      finishing.current = false;
      setFinishingNow(false);
      return;
    }
    // Onboarding is finished before personalization runs, so backing out of the
    // drill pickers lands on Today rather than restarting the questionnaire.
    // Straight on, before the layout's own redirect to Today can run; the
    // draft goes after.
    router.replace('/routines/morning-time');
    void removeAccountKey(ACCOUNT_KEYS.onboarding, userId);
  }

  const step = STEPS[i];
  const who = String(a.name || displayName || '').trim();
  // `40 · The Vow` dates the signature the day it is signed: "Day 0, Jun 9".
  const vowDate = `Day 0, ${shortDate(new Date())}`;
  const riskWindow = windowFor(a)[2];
  /** `25 · Where We’d Start` … `27 · Your Plan` all read the same triple. */
  const plan = planReading(a, planPick);
  /** `38 · A Letter Arrived` — "Save it for later" skips past the reading of it, to the vow. */
  const skipLetter = () => setI((v) => Math.min(STEPS.length - 1, v + 2));
  /**
   * `03 · Name` draws the same Back row as every other funnel frame, and D122
   * reverses D016 to draw it. Step 0 has nothing behind it inside the flow.
   * The account is already made and signed in by now, and `02 · Login` cannot
   * work for a signed-in account (Clerk refuses a second sign-in or sign-up
   * while a session exists), so Back no longer drops him there (U4, D479): it
   * asks whether to sign out — the way to use a different account — and only
   * then opens the door. "Keep going" leaves him on the question.
   */
  const backToDoor = () => setLeaveOpen(true);
  // The body names his address, which can run it to a third line (a Hide My
  // Email relay address cannot share the first); the panel keeps its drawn
  // height, so it rises by what the body adds rather than run under the pill (D488).
  const leaveLift = Math.max(0, Math.ceil(leaveBodyFoot - LEAVE_BODY_FOOT - 0.5));
  const leave = async () => {
    setLeaveOpen(false);
    try {
      await signOut();
    } catch {
      // offline, Clerk cannot end the session (D491): he stays on the question
      return;
    }
    await cancelAllReminders().catch(() => {});
    router.replace('/');
  };
  const age = Number.isFinite(typedAge) && typedAge > 0 && typedAge < AGE_END ? typedAge : AGE_DEFAULT;
  // `29`–`31` at his reported rate (D471); the boards are skipped when it is unknown
  const next30 = per30 ?? 0;
  const yearDays = daysPerYear(next30);
  const byAge80 = daysToAge80(next30, age);
  /** `34 · What You Want Back` reads his `17 · What it affects` answers back (CRITIC §5, tail Q5). */
  const affectsOrder = FUNNEL_STEPS.find((f) => f.id === 'affects')?.options ?? [];
  /** `44 · Day 0` names the first lesson of the course as it now stands. */
  const firstLesson = lessonForDay(1);

  const body = useMemo(() => {
    switch (step.kind) {
      case 'funnel': {
        const f = FUNNEL_STEPS[step.fi];
        const years = parseInt(String(a.ageYears ?? ''), 10);
        const advance =
          f.id === 'ageYears' && Number.isFinite(years) && years > 0 && years < O3_AGE_MIN
            ? () => setGated(true)
            : next;
        // Keyed per step so each remounts — a shared instance would carry its
        // local `picked` into the next single-select and strand it.
        return (
          <O3FunnelStep
            key={f.id}
            step={f}
            value={a[f.id]}
            onSet={(v) => set(f.id, v)}
            next={advance}
            name={String(a.name || displayName || '')}
            answers={a}
          />
        );
      }
      case 'planTogether':
        return <O3PuttingTogether next={next} hold={FORCE_MOCK && params.hold === '1'} />;
      case 'wheredStart':
        return <O3WhereWedStart name={String(a.name || displayName || '')} triggers={(a.triggers as string[]) || []} next={next} />;
      case 'startHere':
        return <O3StartHere {...plan} onAccept={next} onAnother={() => setPlanPick((p) => p + 1)} />;
      case 'startHere1':
        return <O3StartHereStep1 change={plan.change} next={next} back={back} />;
      case 'startHere2':
        return <O3StartHereStep2 change={plan.change} next={next} back={back} />;
      case 'yourPlan':
        return <O3YourPlan {...plan} next={next} back={back} />;
      case 'startingPoint':
        // D516: the rating starts with the first check-in, so the board shows no starting figure
        return <O3StartingPoint next={next} back={back} />;
      case 'next30':
        return <O3Next30 times={next30} next={next} back={back} />;
      case 'oneYear':
        return <O3OneYear days={yearDays} next={next} back={back} />;
      case 'age80':
        return <O3IfNothingChanges days={byAge80} next={next} back={back} />;
      case 'lineNothing':
        return <O3LineIfNothingChanges next={next} back={back} />;
      case 'linePlan':
        return <O3LineWithThePlan next={next} back={back} />;
      case 'cleanDay':
        return <O3CleanDay next={next} back={back} />;
      case 'oneBadDay':
        // the week strip is the canvas's illustration of one bad day among six,
        // not a readout of his — he is on day 0
        return <O3OneBadDay next={next} back={back} />;
      case 'wantBack':
        return <O3WhatYouWantBack pills={wantBackPills((a.affects as string[]) || [], affectsOrder)} next={next} back={back} />;
      case 'letterArrived':
        return <O3LetterArrived next={next} skip={skipLetter} />;
      case 'letterRead':
        return <O3LetterRead name={who} paragraphs={buildWeekXiiLetter({ ...a, name: who }).paragraphs} onKeep={next} next={next} />;
      case 'vow':
        // signing is filed with the rest at the end (`finish`); "Not now" un-signs a vow signed and backed past
        return (
          <O3TheVow
            name={who}
            date={vowDate}
            onSign={() => {
              set('vow', 'signed');
              next();
            }}
            skip={() => {
              set('vow', '');
              next();
            }}
          />
        );
      case 'medallion':
        return <O3MedallionEarned eyebrow="Veni" title="Your first medallion." body="You started." next={next} />;
      case 'reminders':
        return (
          <O3Reminders
            window={riskWindow}
            onAllow={() => {
              set('reminder', 'yes');
              // the reminder lands before the window the board names (D425)
              void suggestCheckinBefore(windowFor(a)[0]);
              next();
            }}
            skip={next}
          />
        );
      case 'dayZero':
        return <O3DayZero lesson={`Lesson ${firstLesson?.day ?? 1} · ${firstLesson?.title ?? 'Prepare for tonight'}`} busy={finishingNow} next={() => void finish()} />;
      case 'paywall':
        return null; // rendered full-frame below
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, a, i, planPick, finishingNow]);

  // the ground alone while the draft is read back (a few ms): the board it reopens on, not question one first
  if (!restored) return <LoadingView spinner={false} />;
  // Back is the only control the gate offers, so a mistyped age is one tap from
  // being corrected.
  if (gated)
    return (
      <O3Shell onBack={() => setGated(false)}>
        <O3AgeGate />
      </O3Shell>
    );
  // the tail frames and the paywall own the entire frame
  if (WHOLE_FRAME.has(step.id)) return <>{body}</>;
  if (step.kind === 'paywall') return <PaywallFlow embedded name={String(a.name || displayName || '').trim() || undefined} triggers={(a.triggers as string[]) || []} emotions={(a.emotions as string[]) || []} load={a.load as string} onDone={next} />;

  return (
    <>
      <O3Shell onBack={i === 0 ? backToDoor : back}>{body}</O3Shell>
      {/* U4 (D479): the way out of the questionnaire for a signed-in account —
          the sign-out sheet's shell, in a modal so it covers the step's own frame */}
      <Sheet
        modal
        open={leaveOpen}
        top={SHEET_TOP.signOut - leaveLift}
        gap={10}
        onClose={() => setLeaveOpen(false)}
        footer={
          <>
            <PrimaryButton label="Sign out" bottom={96} sheet onPress={() => void leave()} />
            <GhostLink label="Keep going" zIndex={42} onPress={() => setLeaveOpen(false)} />
          </>
        }>
        <MonoText v="h1SheetLg">Use a different account?</MonoText>
        <MonoText
          v="p"
          color={mono.sub}
          style={{ lineHeight: 23 }}
          onLayout={(e) => setLeaveBodyFoot(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}>
          {email ? `You’re signed in as ${email}. Sign out to use another account.` : 'Sign out to use another account.'}
        </MonoText>
      </Sheet>
    </>
  );
}
