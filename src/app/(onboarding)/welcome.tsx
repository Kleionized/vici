import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import {
  O3CostPage,
  O3DayOne,
  O3FunnelStep,
  O3Handover,
  O3Letter,
  O3Pattern,
  O3Pledge,
  O3Reading,
  O3ReadingPause,
  O3Root,
  O3Shell,
  buildWeekXiiLetter,
  type O3Paper,
} from '@/components/onboarding/v3';
import { PaywallFlow } from '@/components/paywall/PaywallFlow';
import { FUNNEL_STEPS } from '@/content/onboardingFunnel';
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
        | 'pause'
        | 'root'
        | 'pattern'
        | 'cost30'
        | 'cost365'
        | 'costAge80'
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
  { id: 'pause', kind: 'pause' }, //                23 · Putting Your Plan Together
  { id: 'root', kind: 'root' }, //                  24 · Where You Get Caught
  { id: 'pattern', kind: 'pattern' }, //            26 · The Window to Protect
  { id: 'cost30', kind: 'cost30' }, //              28 · The Next 30 Days
  { id: 'cost365', kind: 'cost365' }, //            29 · One Year From Now
  { id: 'cost-age80', kind: 'costAge80' }, //       30 · If Nothing Changes
  { id: 'reading', kind: 'reading' }, //            34–36 · Twelve Weeks
  { id: 'letter-received', kind: 'letterReceived' }, // 37 · A Letter Arrived
  { id: 'letter', kind: 'letter' }, //              38 · A Letter From Week XII
  { id: 'pledge', kind: 'pledge' }, //              39 · The Vow
  { id: 'medallion-received', kind: 'medallionReceived' }, // 40 · Medallion Earned
  { id: 'dayone', kind: 'dayone' }, //              41 · Reminders
  { id: 'paywall', kind: 'paywall' }, //            42 · Paywall
];

/** Daylight arrives on the reading — the funnel itself is all night register. */
const PLAN_IDX = STEPS.findIndex((s) => s.id === 'pause');

/**
 * The paper tail's chrome. The tail counts in eight ticks rather than the
 * funnel's one growing rule, each frame states how many are inked, and two of
 * them carry their own field: the reading the map's, the vow none at all.
 */
const PAPER_BACK = 96 - 54;
const CHROME: Record<string, { seg?: number; paper?: O3Paper; back?: false; backTop?: number }> = {
  root: { seg: 2, backTop: PAPER_BACK },
  pattern: { seg: 8, backTop: PAPER_BACK },
  cost30: { seg: 3, backTop: PAPER_BACK },
  cost365: { seg: 4, backTop: PAPER_BACK },
  'cost-age80': { seg: 4, backTop: PAPER_BACK },
  reading: { paper: 'map', backTop: 64 - 54 },
  pledge: { paper: 'plain', back: false },
};
const NOBAR = new Set(['pause', 'reading', 'pledge']);

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
      case 'pause':
        return <O3ReadingPause answers={a} next={next} />;
      case 'root':
        return <O3Root answers={a} next={next} />;
      case 'cost30':
        return <O3CostPage answers={a} next={next} h={1} />;
      case 'cost365':
        return <O3CostPage answers={a} next={next} h={2} />;
      case 'costAge80':
        return <O3CostPage answers={a} next={next} h={3} />;
      case 'reading':
        return <O3Reading answers={a} next={next} />;
      case 'pattern':
        return <O3Pattern answers={a} next={next} />;
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

  // the reading-pause and paywall own the entire frame
  if (step.kind === 'pause') return <O3ReadingPause answers={a} next={next} />;
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
