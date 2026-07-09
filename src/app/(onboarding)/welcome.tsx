import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import {
  O3DayOne,
  O3Door,
  O3Letter,
  O3Name,
  O3Notify,
  O3Paywall,
  O3Pledge,
  O3Privacy,
  O3_QUESTIONS,
  O3Question,
  O3Reading,
  O3ReadingPause,
  O3Save,
  O3Shell,
  O3Streaks,
  O3Threshold,
  O3Wave,
} from '@/components/onboarding/v3';
import { useCompleteOnboarding, useCreateJournalEntry, useUpdateLifeMap, useUpdateProfile } from '@/lib/backend';

// ── Onboarding v3 · "the campaign" funnel (canvas screens-onb3*). Opens on
// night water; light gathers and breaks to paper at the reading. Threshold →
// privacy oath → the door → name → assessment (8 Qs + reflections) → streak
// interstitial → the reading (route map) → the wave, ridden → pledge → letter
// → Day I → notifications → save → Plus. Persists name, the letter (as the
// life-map "why"), and the prize (as values), then marks onboarding done. ──

type Answers = Record<string, string | string[]>;

type Step =
  | { id: string; kind: 'threshold' | 'privacy' | 'door' | 'name' | 'streaks' | 'pause' | 'reading' | 'wave' | 'pledge' | 'letter' | 'dayone' | 'notify' | 'save' | 'paywall' }
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
    if (s.id === 'notify') return a.reminder !== 'yes';
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
    const letter = String(a.letter || '').trim();
    const prize = (a.prize as string[]) || [];
    if (name) await updateProfile(name).catch(() => {});
    if (letter) {
      await updateLifeMap({ whyStatement: letter }).catch(() => {});
      await createJournalEntry({ tag: 'Reflection', title: 'A letter to week XII', body: letter }).catch(() => {});
    }
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
        return (
          <O3Question title={q.title} options={q.options} multi={q.multi} value={a[key]} onSet={(v) => set(key, v)} next={next} reflect={q.reflect} note={q.note} ctaLabel={q.ctaLabel} skip={q.skip} />
        );
      }
      case 'streaks':
        return <O3Streaks next={next} />;
      case 'pause':
        return <O3ReadingPause answers={a} next={next} />;
      case 'reading':
        return <O3Reading answers={a} next={next} />;
      case 'pledge':
        return <O3Pledge name={String(a.name || '')} next={next} />;
      case 'letter':
        return <O3Letter value={String(a.letter || '')} onSet={(v) => set('letter', v)} next={next} />;
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
        return <O3Paywall answers={a} next={finish} onFree={finish} />;
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, a, i]);

  // the wave owns the entire frame (its own shell + full-screen surf)
  if (step.kind === 'wave') return <O3Wave next={next} />;

  return (
    <O3Shell progress={(i + 1) / STEPS.length} onBack={i > 0 ? back : null} bar={!NOBAR.has(step.id)} lit={lit}>
      {body}
    </O3Shell>
  );
}
