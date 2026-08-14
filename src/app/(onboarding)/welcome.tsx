import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import {
  O3CampaignLine,
  O3CostPage,
  O3CurrentPattern,
  O3DayOne,
  O3Handover,
  O3Interlude,
  O3Letter,
  O3Pattern,
  O3PlanReady,
  O3Pledge,
  O3PushIntro,
  O3Question,
  O3Reading,
  O3ReadingPause,
  O3Reversal,
  O3Rewire,
  O3Root,
  O3Save,
  O3SectionIntro,
  O3Shell,
  O3Streaks,
  O3_QUESTIONS,
  O3_SECTIONS,
  buildWeekXiiLetter,
  type O3Paper,
} from '@/components/onboarding/v3';
import { PaywallFlow } from '@/components/paywall/PaywallFlow';
import { useAuth } from '@/lib/auth';
import { useCompleteOnboarding, useCreateJournalEntry, useUpdateLifeMap, useUpdateProfile } from '@/lib/backend';

// ── Latest onboarding: notification primer, all 23 assessment states, four
// short teaching interludes, personalised cost/pattern results, campaign map,
// vow, week-XII letter, reminders, account save, and membership choice. ──

type Answers = Record<string, string | string[]>;

type Step =
  | {
      id: string;
      kind:
        | 'push'
        | 'willpower'
        | 'rewireLesson'
        | 'anchor'
        | 'smallSteps'
        | 'streaks'
        | 'pause'
        | 'root'
        | 'planReady'
        | 'currentPattern'
        | 'cost30'
        | 'cost365'
        | 'costAge80'
        | 'reversal'
        | 'campaignLine'
        | 'reading'
        | 'pattern'
        | 'rewire'
        | 'pledge'
        | 'letterReceived'
        | 'medallionReceived'
        | 'letter'
        | 'dayone'
        | 'save'
        | 'paywall';
    }
  | { id: string; kind: 'question'; qi: number }
  | { id: string; kind: 'sectionIntro'; si: number };

const STEPS: Step[] = [
  { id: 'push', kind: 'push' },
  ...O3_QUESTIONS.flatMap((q, i): Step[] => {
    const before: Step[] = [];
    // Each named stretch of the questionnaire opens on a card saying what the
    // next few questions are for.
    const si = O3_SECTIONS.findIndex((sec) => sec.at === i);
    if (si >= 0) before.push({ id: `section-${si}`, kind: 'sectionIntro', si });
    const question: Step = { id: q[0], kind: 'question', qi: i };
    if (i === 2) return [...before, question, { id: 'willpower', kind: 'willpower' }];
    if (i === 6) return [...before, question, { id: 'rewire-lesson', kind: 'rewireLesson' }];
    if (i === 16) return [...before, question, { id: 'anchor', kind: 'anchor' }];
    if (i === 18) return [...before, question, { id: 'small-steps', kind: 'smallSteps' }];
    return [...before, question];
  }),
  { id: 'pause', kind: 'pause' },
  { id: 'plan-ready', kind: 'planReady' },
  { id: 'root', kind: 'root' },
  { id: 'current-pattern', kind: 'currentPattern' },
  { id: 'cost30', kind: 'cost30' },
  { id: 'cost365', kind: 'cost365' },
  { id: 'cost-age80', kind: 'costAge80' },
  { id: 'reversal', kind: 'reversal' },
  { id: 'streaks', kind: 'streaks' },
  { id: 'campaign-line', kind: 'campaignLine' },
  { id: 'rewire', kind: 'rewire' },
  { id: 'pattern', kind: 'pattern' },
  { id: 'reading', kind: 'reading' },
  { id: 'pledge', kind: 'pledge' },
  { id: 'letter-received', kind: 'letterReceived' },
  { id: 'medallion-received', kind: 'medallionReceived' },
  { id: 'letter', kind: 'letter' },
  { id: 'dayone', kind: 'dayone' },
  { id: 'save', kind: 'save' },
  { id: 'paywall', kind: 'paywall' },
];

/** Daylight arrives on the plan card — 096 is the first paper frame. */
const PLAN_IDX = STEPS.findIndex((s) => s.id === 'plan-ready');

/**
 * The paper tail's chrome, frame by frame. 096–106 count in eight ticks rather
 * than the night funnel's one growing rule, each states how many are inked, and
 * three of them carry their own field: 096 the plan's warm paper, 107 the map's,
 * 108 none at all. Back sits at y 96 on the paper frames and 64 on the map;
 * 096 and 108 do not draw one.
 */
const PAPER_BACK = 96 - 54;
const CHROME: Record<string, { seg?: number; paper?: O3Paper; back?: false; backTop?: number }> = {
  // the four lesson frames drop Back the same 2pt the paper ones do
  willpower: { backTop: PAPER_BACK },
  'rewire-lesson': { backTop: PAPER_BACK },
  anchor: { backTop: PAPER_BACK },
  'small-steps': { backTop: PAPER_BACK },
  'plan-ready': { seg: 8, paper: 'plan', back: false },
  root: { seg: 2, backTop: PAPER_BACK },
  'current-pattern': { seg: 3, backTop: PAPER_BACK },
  cost30: { seg: 3, backTop: PAPER_BACK },
  cost365: { seg: 4, backTop: PAPER_BACK },
  'cost-age80': { seg: 4, backTop: PAPER_BACK },
  reversal: { seg: 4, backTop: PAPER_BACK },
  streaks: { seg: 5, backTop: PAPER_BACK },
  'campaign-line': { seg: 5, backTop: PAPER_BACK },
  rewire: { seg: 6, backTop: PAPER_BACK },
  pattern: { seg: 8, backTop: PAPER_BACK },
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
  const chrome = CHROME[step.id] ?? {};

  const body = useMemo(() => {
    switch (step.kind) {
      case 'push':
        return <O3PushIntro next={next} />;
      case 'willpower':
        return <O3Interlude kind="willpower" next={next} />;
      case 'rewireLesson':
        return <O3Interlude kind="rewire" next={next} />;
      case 'anchor':
        return <O3Interlude kind="anchor" next={next} />;
      case 'smallSteps':
        return <O3Interlude kind="steps" next={next} />;
      case 'sectionIntro':
        return <O3SectionIntro section={O3_SECTIONS[step.si]} next={next} />;
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
        return <O3Streaks answers={a} next={next} />;
      case 'pause':
        return <O3ReadingPause answers={a} next={next} />;
      case 'root':
        return <O3Root answers={a} next={next} />;
      case 'planReady':
        return <O3PlanReady next={next} back={back} />;
      case 'currentPattern':
        return <O3CurrentPattern answers={a} next={next} />;
      case 'cost30':
        return <O3CostPage answers={a} next={next} h={1} />;
      case 'cost365':
        return <O3CostPage answers={a} next={next} h={2} />;
      case 'costAge80':
        return <O3CostPage answers={a} next={next} h={3} />;
      case 'reversal':
        return <O3Reversal next={next} back={back} />;
      case 'campaignLine':
        return <O3CampaignLine next={next} />;
      case 'rewire':
        return <O3Rewire answers={a} next={next} />;
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
      case 'save':
        return <O3Save next={next} />;
      case 'paywall':
        return null; // rendered full-frame below, like the wave
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
