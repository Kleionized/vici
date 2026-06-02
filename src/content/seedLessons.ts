/**
 * Placeholder seed lessons — THREE only, by design (build spec §7).
 *
 * These exist to exercise the content engine end-to-end (every field, every
 * reflection input type, the sensitive-lesson footer, the urge-tool CTA). They
 * are NOT real curriculum. The human loads the real ~94-lesson curriculum later
 * via `convex/importLessons.ts`, which accepts an array of exactly this shape.
 *
 * All prose is obvious placeholder text marked [PLACEHOLDER CONTENT].
 */

import type { Lesson } from '@/lib/types';

export const SEED_LESSONS: Lesson[] = [
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
    bodyMarkdown: `**[PLACEHOLDER CONTENT — not real curriculum.]**

# Starting with why

Change that lasts is pulled forward by something you are moving *toward*, not
only pushed by something you are moving away from. This lesson is a placeholder
that stands in for the real opening lesson on motivation.

## What this is

- A short reading that names the **direction** you want your life to move.
- A reflection saved in your own words, so the app can hand it back to you on a
  hard day.
- A reframe: this is not about willpower or counting days. It is about building a
  life worth living.

## A note on method

Different approaches fit different people. As you read, notice what resonates and
what does not — you will get to mark how well each lesson fits you. There is no
single correct path here.

When you are ready, write down the *because* underneath the want. Lorem ipsum
dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
labore et dolore magna aliqua.`,
    reflectionPrompt: 'Name the life you are building toward — in your own words.',
    reflectionFields: [
      {
        key: 'becauseStatement',
        label: 'I want this because…',
        type: 'shortText',
      },
      {
        key: 'endOfWeekWin',
        label: 'One small win that would make this week feel good',
        type: 'shortText',
      },
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
    bodyMarkdown: `**[PLACEHOLDER CONTENT — not real curriculum.]**

# The body comes first

Self-control is not only a mental skill — it runs on a body. When sleep, food,
water, and daily structure slip, the capacity to act on your values slips with
them. This placeholder lesson stands in for the real physiological-week content.

## The four levers

1. **Sleep** — the foundation beneath everything else.
2. **Food** — steady fuel beats willpower.
3. **Water** — small, boring, easy to forget.
4. **Structure** — a shape to the day that does not depend on motivation.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## The move

You do not need to fix all four. Pick the **one** lever that is most broken right
now and make one small change to it. Leading indicators, not heroics.`,
    reflectionPrompt: 'Which lever is most broken, and what is the one change?',
    reflectionFields: [
      {
        key: 'mostBrokenLever',
        label: 'Which lever is most broken right now?',
        type: 'choice',
        options: ['Sleep', 'Food', 'Water', 'Structure'],
      },
      {
        key: 'oneChange',
        label: 'The one small change I will make',
        type: 'shortText',
      },
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
    bodyMarkdown: `**[PLACEHOLDER CONTENT — not real curriculum.]**

# Urges crest and fade

An urge is a wave, not a command. Left alone — not fought, not fed — it rises,
peaks, and passes. *Urge surfing* is the practice of riding it out with curious
attention instead of white-knuckling or giving in. This placeholder stands in for
the real psychological-week lesson.

## What riding it out looks like

- Notice the wave starting. Name it: "this is an urge."
- Get curious about where you feel it in the body.
- Breathe, and let it move. It will not last forever.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua.

## Practice it now

Whatever happens, it is **data, not a verdict**. Riding one out is a win; acting
on one is information about what you needed. Both belong in your log.`,
    reflectionPrompt: 'How intense was the urge, and what did riding it teach you?',
    reflectionFields: [
      {
        key: 'urgeIntensity',
        label: 'Peak urge intensity',
        type: 'scale',
        options: ['1', '10'],
      },
      {
        key: 'whatItTaught',
        label: 'What riding it out taught me',
        type: 'longText',
      },
    ],
  },
];

/** Slugs whose lesson CTA opens the "Ride It Out" urge tool. */
export const URGE_TOOL_LESSON_SLUGS = ['urge-surfing'];

export default SEED_LESSONS;
