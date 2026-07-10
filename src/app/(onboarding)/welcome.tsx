import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import {
  buildWeekXiiLetter,
  O3DayOne,
  O3Door,
  O3Hope,
  O3Letter,
  O3MapReveal,
  O3Name,
  O3Notify,
  O3PlanBuild,
  O3Pledge,
  O3Privacy,
  O3_QUESTIONS,
  O3Question,
  O3Reading,
  O3ReadingPause,
  O3Save,
  O3Shell,
  O3Stakes,
  O3Streaks,
  O3Threshold,
  O3Wave,
} from '@/components/onboarding/v3';
import { PaywallFlow } from '@/components/paywall/PaywallFlow';
import { useCompleteOnboarding, useCreateJournalEntry, useUpdateLifeMap, useUpdateProfile } from '@/lib/backend';

// ── Onboarding v3 · "the campaign" funnel (canvas screens-onb3*). Opens on
// night water; light gathers and breaks to paper at the reading. Threshold →
// privacy oath → the door → name → assessment (8 Qs + reflections) → streak
// interstitial → the reading (route map) → the wave, ridden → pledge → letter
// → Day I → notifications → save → Plus. Persists name, the letter (as the
// life-map "why"), and the prize (as values), then marks onboarding done. ──

type Answers = Record<string, string | string[]>;

type Step =
  | {
      id: string;
      kind:
        | 'threshold'
        | 'privacy'
        | 'door'
        | 'name'
        | 'streaks'
        | 'pause'
        | 'reading'
        | 'plan'
        | 'stakes'
        | 'hope'
        | 'map'
        | 'wave'
        | 'pledge'
        | 'letter'
        | 'dayone'
        | 'notify'
        | 'save'
        | 'paywall';
    }
  | { id: string; kind: 'question'; qi: number };

const STEPS: Step[] = [
  { id: 'threshold', kind: 'threshold' },
  { id: 'privacy', kind: 'privacy' },
  { id: 'door', kind: 'door' },
  { id: 'name', kind: 'name' },
  ...O3_QUESTIONS.map((q, i) => ({ id: q[0], kind: 'question' as const, qi: i })),
  { id: 'streaks', kind: 'streaks' },
  { id: 'pause', kind: 'pause' },
  { id: 'reading', kind: 'reading' },
  { id: 'plan', kind: 'plan' },
  { id: 'stakes', kind: 'stakes' },
  { id: 'hope', kind: 'hope' },
  { id: 'map', kind: 'map' },
  { id: 'wave', kind: 'wave' },
  { id: 'pledge', kind: 'pledge' },
  { id: 'letter', kind: 'letter' },
  { id: 'dayone', kind: 'dayone' },
  { id: 'notify', kind: 'notify' },
  { id: 'save', kind: 'save' },
  { id: 'paywall', kind: 'paywall' },
];

const READING_IDX = STEPS.findIndex((s) => s.id === 'reading');
const NOBAR = new Set(['pause']);

export default function Onboarding() {
  const router = useRouter();
  const completeOnboarding = useCompleteOnboarding();
  const updateProfile = useUpdateProfile();
  const updateLifeMap = useUpdateLifeMap();
  const createJournalEntry = useCreateJournalEntry();

  const [i, setI] = useState(0);
  const [a, setA] = useState<Answers>({});
  const set = (k: string, v: string | string[]) => setA((s) => ({ ...s, [k]: v }));

  const skip = (idx: number): boolean => {
    const s = STEPS[idx];
    if (!s) return false;
    if (s.id === 'streaks') return a.breaks !== 'The counter hitting zero';
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
    const name = String(a.name || '').trim();
    const letter = buildWeekXiiLetter(a);
    const prize = (a.prize as string[]) || [];
    const costs = (a.costs as string[]) || [];
    if (name) await updateProfile(name).catch(() => {});
    // the week-XII letter is kept in the Log; the named costs anchor the why
    await createJournalEntry({ tag: 'Letter', title: 'From the man at week XII', body: letter }).catch(() => {});
    if (costs.length) await updateLifeMap({ whyStatement: `Taking back ${costs.slice(0, 3).map((c) => c.toLowerCase()).join(', ')}.` }).catch(() => {});
    if (prize.length) await updateLifeMap({ values: prize.map((label) => ({ label, importance: 3 })) }).catch(() => {});
    await completeOnboarding().catch(() => {});
    router.replace('/(app)/today');
  }

  const step = STEPS[i];
  const lit = i >= READING_IDX;

  const body = useMemo(() => {
    switch (step.kind) {
      case 'threshold':
        return <O3Threshold next={next} />;
      case 'privacy':
        return <O3Privacy next={next} />;
      case 'door':
        return <O3Door value={(a.arrival as string[]) || []} onSet={(v) => set('arrival', v)} next={next} />;
      case 'name':
        return <O3Name value={String(a.name || '')} onSet={(v) => set('name', v)} next={next} />;
      case 'question': {
        const [key, q] = O3_QUESTIONS[step.qi];
        // key per question so each remounts — otherwise the shared O3Question
        // instance keeps its local `picked` state and the next single-select
        // can't be chosen or advanced (the "stuck on gender" bug).
        return (
          <O3Question key={key} title={q.title} options={q.options} multi={q.multi} kind={q.kind} value={a[key]} onSet={(v) => set(key, v)} next={next} note={q.note} ctaLabel={q.ctaLabel} skip={q.skip} />
        );
      }
      case 'streaks':
        return <O3Streaks next={next} />;
      case 'pause':
        return <O3ReadingPause answers={a} next={next} />;
      case 'reading':
        return <O3Reading answers={a} next={next} />;
      case 'plan':
        return <O3PlanBuild next={next} />;
      case 'stakes':
        return <O3Stakes answers={a} next={next} />;
      case 'hope':
        return <O3Hope next={next} />;
      case 'map':
        return <O3MapReveal next={next} />;
      case 'pledge':
        return <O3Pledge name={String(a.name || '')} next={next} />;
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
      case 'notify':
        return <O3Notify answers={a} next={next} />;
      case 'save':
        return <O3Save next={next} />;
      case 'paywall':
        return null; // rendered full-frame below, like the wave
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, a, i]);

  // the wave, the reading-pause, and the paywall own the entire frame
  if (step.kind === 'wave') return <O3Wave next={next} />;
  if (step.kind === 'pause') return <O3ReadingPause answers={a} next={next} />;
  if (step.kind === 'paywall') return <PaywallFlow prize={(a.prize as string[]) || []} onDone={() => void finish()} />;

  return (
    <O3Shell progress={(i + 1) / STEPS.length} onBack={i > 0 ? back : null} bar={!NOBAR.has(step.id)} lit={lit}>
      {body}
    </O3Shell>
  );
}
