import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import {
  O3ChangeTheLine,
  O3IfNothingChanges,
  O3Next30,
  O3OneBadDay,
  O3OneYear,
  O3PuttingTogether,
  O3StartingPoint,
  O3WhatComesBeforeIt,
  O3WhatYouWantBack,
  O3WhereYouGetCaught,
  O3WindowToProtect,
} from '@/components/onboarding/tail';
import { O3DayOne, O3FunnelStep, O3Handover, O3Letter, O3Pledge, O3Reading, O3Shell, buildWeekXiiLetter, o3Issue, type O3Paper } from '@/components/onboarding/v3';
import { PaywallFlow } from '@/components/paywall/PaywallFlow';
import { FUNNEL_STEPS } from '@/content/onboardingFunnel';
import { COST_30, COST_365 } from '@/content/onboardingTail';
import { SCORE_BASE } from '@/lib/score';
import { useAuth } from '@/lib/auth';
import { useCompleteOnboarding, useCreateJournalEntry, useUpdateLifeMap, useUpdateProfile } from '@/lib/backend';

/**
 * The onboarding funnel, in the order `UI Final 1` numbers it.
 *
 * The account is made first now (`02 · Login`), so the questionnaire opens on
 * the three that name him — `03 · Name`, `04 · Age`, `05 · Gender` — then runs
 * `06 · Start` through `22 · What You Have Tried`, and hands over to the
 * reading. The seven section intros, three of the four lesson interstitials,
 * eleven questions and the save-your-progress gate are all withdrawn from this
 * bundle; six screens are new.
 *
 * The twenty questionnaire screens are data: `src/content/onboardingFunnel.ts`
 * is generated from the frames themselves, and `O3FunnelStep` draws whichever
 * shape a step declares.
 */

type Answers = Record<string, string | string[]>;

type Step =
  | { id: string; kind: 'funnel'; fi: number }
  | {
      id: string;
      kind:
        | 'planTogether'
        | 'caught'
        | 'beforeIt'
        | 'window'
        | 'startingPoint'
        | 'next30'
        | 'oneYear'
        | 'age80'
        | 'changeLine'
        | 'oneBadDay'
        | 'wantBack'
        | 'reading'
        | 'letterReceived'
        | 'letter'
        | 'pledge'
        | 'medallionReceived'
        | 'dayone'
        | 'paywall';
    };

const STEPS: Step[] = [
  // 03 · Name … 22 · What You Have Tried
  ...FUNNEL_STEPS.map((s, fi): Step => ({ id: s.id, kind: 'funnel', fi })),
  { id: 'plan-together', kind: 'planTogether' }, //  23 · Putting Your Plan Together
  { id: 'caught', kind: 'caught' }, //               24 · Where You Get Caught
  { id: 'before-it', kind: 'beforeIt' }, //          25 · What Comes Before It
  { id: 'window', kind: 'window' }, //               26 · The Window to Protect
  { id: 'starting-point', kind: 'startingPoint' }, // 27 · Your Starting Point
  { id: 'next30', kind: 'next30' }, //               28 · The Next 30 Days
  { id: 'one-year', kind: 'oneYear' }, //            29 · One Year From Now
  { id: 'age80', kind: 'age80' }, //                 30 · If Nothing Changes
  { id: 'change-line', kind: 'changeLine' }, //      31 · Change the Line
  { id: 'one-bad-day', kind: 'oneBadDay' }, //       32 · One Bad Day
  { id: 'want-back', kind: 'wantBack' }, //          33 · What You Want Back
  { id: 'reading', kind: 'reading' }, //             34–36 · Twelve Weeks
  { id: 'letter-received', kind: 'letterReceived' }, // 37 · A Letter Arrived
  { id: 'letter', kind: 'letter' }, //               38 · A Letter From Week XII
  { id: 'pledge', kind: 'pledge' }, //               39 · The Vow
  { id: 'medallion-received', kind: 'medallionReceived' }, // 40 · Medallion Earned
  { id: 'dayone', kind: 'dayone' }, //               41 · Reminders
  { id: 'paywall', kind: 'paywall' }, //             42 · Paywall
];

/** Daylight arrives on the plan board — the funnel itself is all night. */
const PLAN_IDX = STEPS.findIndex((s) => s.id === 'plan-together');

/**
 * The eleven tail frames draw neither the rule nor the Back row, and each owns
 * its whole frame, so they are rendered outside the shell entirely. What is
 * left here is the chrome the last handful still state.
 */
const CHROME: Record<string, { seg?: number; paper?: O3Paper; back?: false; backTop?: number }> = {
  reading: { paper: 'map', backTop: 64 - 54 },
  pledge: { paper: 'plain', back: false },
};
const NOBAR = new Set(['reading', 'pledge']);
/** The eleven screens that draw their own frame, chrome and all. */
const WHOLE_FRAME = new Set([
  'plan-together', 'caught', 'before-it', 'window', 'starting-point',
  'next30', 'one-year', 'age80', 'change-line', 'one-bad-day', 'want-back',
]);
const AGE_END = 80;
const AGE_DEFAULT = 24;
/** `28 · The Next 30 Days` draws nine dark cells and says "about 9". */
const NEXT_30_TIMES = COST_30.filter(Boolean).length;
/** `29 · One Year From Now` draws 110 and says "about 110 days". */
const YEAR_DAYS = COST_365.filter(Boolean).length;

export default function Onboarding() {
  const router = useRouter();
  const { displayName } = useAuth();
  const completeOnboarding = useCompleteOnboarding();
  const updateProfile = useUpdateProfile();
  const updateLifeMap = useUpdateLifeMap();
  const createJournalEntry = useCreateJournalEntry();

  const [i, setI] = useState(0);
  const [a, setA] = useState<Answers>(() => (displayName ? { name: displayName } : ({} as Answers)));
  const set = (k: string, v: string | string[]) => setA((s) => ({ ...s, [k]: v }));

  const skip = (idx: number): boolean => {
    const s = STEPS[idx];
    if (!s) return false;
    return false;
  };
  const move = (from: number, dir: number) => {
    let n = from + dir;
    while (n > 0 && n < STEPS.length && skip(n)) n += dir;
    return Math.max(0, Math.min(STEPS.length - 1, n));
  };
  const next = () => setI((v) => move(v, 1));
  const back = () => setI((v) => move(v, -1));

  async function finish() {
    const name = String(a.name || displayName || '').trim();
    const letter = buildWeekXiiLetter({ ...a, name });
    const emotions = (a.emotions as string[]) || [];
    if (name) await updateProfile(name).catch(() => {});
    // the week-XII letter rides with him — kept in the Log; the emotions
    // he named anchor the life map's why
    const body = `${letter.name ? letter.name + ' —' : 'Friend —'}\n\n${letter.paragraphs.join('\n\n')}\n\n— you, at week XII`;
    await createJournalEntry({ tag: 'Letter', title: 'A letter from the man at week XII', body }).catch(() => {});
    if (a.goalPorn) await updateLifeMap({ whyStatement: `${a.goalPorn}. The ${(((a.triggers as string[]) || [])[0] || 'late night').toLowerCase()} window, guarded first.` }).catch(() => {});
    if (emotions.length) await updateLifeMap({ values: emotions.slice(0, 3).map((label) => ({ label, importance: 3 })) }).catch(() => {});
    await completeOnboarding().catch(() => {});
    // Onboarding is finished before personalization runs, so backing out of the
    // drill pickers lands on Today rather than restarting the questionnaire.
    router.replace('/routines/morning-time');
  }

  const step = STEPS[i];
  const lit = i >= PLAN_IDX;
  const triggers = (a.triggers as string[]) || [];
  const affects = (a.affects as string[]) || [];
  // `30 · If Nothing Changes` states "about 6,100 days" for a 24-year-old at
  // nine times a month — 365 x 9/30 x (80 − 24), rounded to the nearest hundred.
  const typedAge = parseInt(String(a.ageYears || ''), 10);
  const age = Number.isFinite(typedAge) && typedAge > 0 && typedAge < AGE_END ? typedAge : AGE_DEFAULT;
  const byAge80 = Math.round(((365 * NEXT_30_TIMES) / 30) * (AGE_END - age) / 100) * 100;
  // The funnel frames each state their own Back top — 94 on every question,
  // 96 on `10 · First Principle`.
  const chrome = step.kind === 'funnel' ? { backTop: FUNNEL_STEPS[step.fi].backTop - 54 } : (CHROME[step.id] ?? {});

  const body = useMemo(() => {
    switch (step.kind) {
      case 'funnel': {
        const f = FUNNEL_STEPS[step.fi];
        // Keyed per step so each remounts — a shared instance would carry its
        // local `picked` into the next single-select and strand it.
        return (
          <O3FunnelStep
            key={f.id}
            step={f}
            value={a[f.id]}
            onSet={(v) => set(f.id, v)}
            next={next}
            name={String(a.name || displayName || '')}
          />
        );
      }
      case 'planTogether':
        return <O3PuttingTogether next={next} />;
      case 'caught':
        return <O3WhereYouGetCaught name={String(a.name || displayName || '')} triggers={triggers} issue={o3Issue(a).word} next={next} />;
      case 'beforeIt':
        return <O3WhatComesBeforeIt trigger={o3Issue(a).word} next={next} />;
      case 'window':
        return <O3WindowToProtect triggers={triggers} next={next} />;
      case 'startingPoint':
        return <O3StartingPoint score={SCORE_BASE} next={next} />;
      case 'next30':
        return <O3Next30 times={NEXT_30_TIMES} next={next} />;
      case 'oneYear':
        return <O3OneYear days={YEAR_DAYS} next={next} />;
      case 'age80':
        return <O3IfNothingChanges days={byAge80} next={next} />;
      case 'changeLine':
        return <O3ChangeTheLine next={next} />;
      case 'oneBadDay':
        return <O3OneBadDay day={41} next={next} />;
      case 'wantBack':
        return <O3WhatYouWantBack affects={affects} next={next} />;
      case 'reading':
        return <O3Reading answers={a} next={next} />;
      case 'pledge':
        return <O3Pledge name={String(a.name || displayName || '')} next={next} />;
      case 'letterReceived':
        return <O3Handover kind="letter" next={next} />;
      case 'medallionReceived':
        return <O3Handover kind="medallion" next={next} />;
      case 'letter':
        return <O3Letter answers={a} next={next} />;
      case 'dayone':
        return (
          <O3DayOne
            answers={a}
            next={() => {
              set('reminder', 'yes');
              next();
            }}
          />
        );
      case 'paywall':
        return null; // rendered full-frame below
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, a, i]);

  // the eleven tail frames and the paywall own the entire frame
  if (WHOLE_FRAME.has(step.id)) return <>{body}</>;
  if (step.kind === 'paywall') return <PaywallFlow embedded name={String(a.name || displayName || '').trim() || undefined} triggers={(a.triggers as string[]) || []} emotions={(a.emotions as string[]) || []} load={a.load as string} onDone={() => void finish()} />;

  return (
    <O3Shell
      progress={(i + 1) / STEPS.length}
      onBack={chrome.back === false || i === 0 ? null : back}
      bar={!NOBAR.has(step.id)}
      segments={chrome.seg}
      lit={lit}
      paper={chrome.paper}
      backTop={chrome.backTop}>
      {body}
    </O3Shell>
  );
}
