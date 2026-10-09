import { internalMutation } from './_generated/server';
import { upsertLessons, type LessonInput } from './lessonUpsert';

/**
 * Dev seeding — upserts the THREE placeholder lessons (build spec §7) so a fresh
 * Convex deployment has content on first run. Mirrors `src/content/seedLessons.ts`
 * (kept in sync by hand because Convex's bundler can't import the app's `@/`
 * aliased modules). NOT real curriculum — see `importLessons` for bulk loading.
 */
const SEED_LESSONS: LessonInput[] = [
  {
    slug: 'why-do-you-want-this',
    title: 'Why Do You Want This?',
    week: 1,
    dayInWeek: 1,
    orderIndex: 0,
    category: 'motivation',
    estimatedMinutes: 6,
    approachTags: ['evidence', 'ACT', 'reframe'],
    sensitive: false,
    bodyMarkdown:
      '**[PLACEHOLDER CONTENT — not real curriculum.]**\n\n# Starting with why\n\nChange that lasts is pulled forward by something you are moving *toward*. This placeholder stands in for the real opening lesson on motivation.\n\n## What this is\n\n- A short reading that names the **direction** you want your life to move.\n- A reflection saved in your own words.\n- A reframe: not willpower or counting days, but building a life worth living.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    reflectionPrompt: 'Name the life you are building toward — in your own words.',
    reflectionFields: [
      { key: 'becauseStatement', label: 'I want this because…', type: 'shortText' },
      { key: 'endOfWeekWin', label: 'One small win that would make this week feel good', type: 'shortText' },
    ],
  },
  {
    slug: 'sleep-and-self-control',
    title: 'Sleep & Self-Control',
    week: 2,
    dayInWeek: 1,
    orderIndex: 1,
    category: 'physiological',
    estimatedMinutes: 7,
    approachTags: ['evidence', 'plausible'],
    sensitive: false,
    bodyMarkdown:
      '**[PLACEHOLDER CONTENT — not real curriculum.]**\n\n# The body comes first\n\nSelf-control runs on a body. When sleep, food, water, and structure slip, the capacity to act on your values slips too. Placeholder for the physiological week.\n\n## The four levers\n\n1. **Sleep** — the foundation beneath everything else.\n2. **Food** — steady fuel beats willpower.\n3. **Water** — small, boring, easy to forget.\n4. **Structure** — a shape to the day that does not depend on motivation.\n\n## The move\n\nPick the **one** lever most broken right now and make one small change.',
    reflectionPrompt: 'Which lever is most broken, and what is the one change?',
    reflectionFields: [
      { key: 'mostBrokenLever', label: 'Which lever is most broken right now?', type: 'choice', options: ['Sleep', 'Food', 'Water', 'Structure'] },
      { key: 'oneChange', label: 'The one small change I will make', type: 'shortText' },
    ],
  },
  {
    slug: 'urge-surfing',
    title: 'Urge Surfing',
    week: 4,
    dayInWeek: 1,
    orderIndex: 2,
    category: 'psychological',
    estimatedMinutes: 8,
    approachTags: ['evidence', 'ACT'],
    sensitive: true,
    bodyMarkdown:
      '**[PLACEHOLDER CONTENT — not real curriculum.]**\n\n# Urges crest and fade\n\nAn urge is a wave, not a command. Left alone, it rises, peaks, and passes. *Urge surfing* is riding it out with curious attention. Placeholder for the psychological week.\n\n## What riding it out looks like\n\n- Notice the wave. Name it: "this is an urge."\n- Get curious about where you feel it in the body.\n- Breathe, and let it move.\n\n## Practice it now\n\nWhatever happens, it is **data, not a verdict**. Both riding one out and acting on one belong in your log.',
    reflectionPrompt: 'How intense was the urge, and what did riding it teach you?',
    reflectionFields: [
      { key: 'urgeIntensity', label: 'Peak urge intensity', type: 'scale', options: ['1', '10'] },
      { key: 'whatItTaught', label: 'What riding it out taught me', type: 'longText' },
    ],
  },
];

/**
 * Internal (B12, D459): not part of the public API, so no client holding the
 * deployment URL can write lessons. Run it from the dashboard (Functions →
 * seed:seedLessons → Run) or `npx convex run seed:seedLessons`.
 */
export const seedLessons = internalMutation({
  args: {},
  handler: async (ctx) => {
    const upserted = await upsertLessons(ctx, SEED_LESSONS);
    return { upserted };
  },
});
