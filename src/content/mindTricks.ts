/**
 * "Spot the trick" — the rationalisations an addiction whispers during an urge,
 * each paired with a grounded counter. Curated content (the AI-tailored, per-user
 * version is a future upgrade that can swap these strings). Tone stays anti-shame
 * (invariant #2): the brain is doing its thing; the user isn't bad for hearing it.
 */

export interface MindTrick {
  lie: string;
  truth: string;
}

export const MIND_TRICKS: MindTrick[] = [
  {
    lie: 'It’s not really that bad.',
    truth: 'If it were harmless you wouldn’t have opened this app. Your own actions already disagree with the thought.',
  },
  {
    lie: 'I can always quit later.',
    truth: '“Later” is the exact promise that’s kept its grip this long. The only quit that ever counts is the one in front of you now.',
  },
  {
    lie: 'Just this once won’t matter.',
    truth: 'There’s no “once.” Each time re-opens the loop you’re closing, and teaches your brain the pattern still pays off.',
  },
  {
    lie: 'I’ve got nothing to look forward to tomorrow.',
    truth: 'That’s the urge narrowing your view — not tomorrow being empty. Name one small thing, then go make it real.',
  },
  {
    lie: 'I’m just bored.',
    truth: 'Boredom is restlessness, not a need. It passes faster than the urge does. Give it five minutes and one different thing.',
  },
  {
    lie: 'I already slipped, so today’s a write-off.',
    truth: 'Never fail twice. One slip is one event, not a verdict — and the very next choice starts completely clean.',
  },
];
