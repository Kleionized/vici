/**
 * The curriculum: ten parts, one hundred and ten lessons, authored as
 * interactive flows in src/content/interactive and generated into
 * `interactiveLessons.ts`.
 *
 * The rest of the app already speaks `Lesson` (progress, reflections and the
 * backend are all keyed on it), so this module adapts each interactive lesson
 * into that shape and keeps the pages available by slug. Nothing downstream
 * needs to know the content changed shape.
 */

import { INTERACTIVE_WEEKS } from '@/content/interactiveLessons';
import type { InteractiveLesson, InteractiveWeek, Lesson, LessonCategory } from '@/lib/types';

export { INTERACTIVE_WEEKS };

/** Roughly a minute a page, floored at three — the pages are short. */
function minutesFor(lesson: InteractiveLesson): number {
  return Math.max(3, Math.round(lesson.pages.length * 0.8));
}

/**
 * The authored tag colours encode a claim's evidence strength. They map onto
 * the app's existing neutral category scale so nothing introduces a new hue.
 */
const TAG_CATEGORY: Record<string, LessonCategory> = {
  '#375623': 'motivation', // evidence
  '#0B3C49': 'psychological', // plausible
  '#4B3F72': 'existential', // reframe
  '#7F6000': 'meta', // contested
  '#843C3C': 'social', // folklore
};

export function lessonCategory(lesson: InteractiveLesson): LessonCategory {
  return TAG_CATEGORY[lesson.tagColor] ?? 'meta';
}

function toLesson(item: InteractiveLesson): Lesson {
  return {
    slug: item.slug,
    title: item.title,
    week: item.week,
    dayInWeek: item.day,
    orderIndex: item.order,
    category: lessonCategory(item),
    estimatedMinutes: minutesFor(item),
    approachTags: [item.tag],
    sensitive: false,
    // The reader never sees this — the interactive pages are the lesson. It
    // exists so search and any legacy markdown path still have something.
    bodyMarkdown: item.pages
      .filter((page) => page.kind === 'teach')
      .map((page) => (page.kind === 'teach' ? `## ${page.headline}\n\n${page.body}` : ''))
      .join('\n\n'),
    reflectionPrompt: item.reflection,
    reflectionFields: [{ key: 'reflection', label: 'In your own words', type: 'longText' }],
  };
}

const ALL: InteractiveLesson[] = INTERACTIVE_WEEKS.flatMap((week) => week.subs.flatMap((sub) => sub.lessons));

export const CURRICULUM_LESSONS: Lesson[] = ALL.map(toLesson);

const BY_SLUG = new Map(ALL.map((lesson) => [lesson.slug, lesson]));

export function interactiveLesson(slug: string): InteractiveLesson | null {
  return BY_SLUG.get(slug) ?? null;
}

export function weekFor(n: number): InteractiveWeek | null {
  return INTERACTIVE_WEEKS.find((week) => week.n === n) ?? null;
}

/** "Ground III · Deep Waters" → "Deep Waters". */
export function groundName(week: InteractiveWeek): string {
  const parts = week.ground.split('·');
  return (parts[1] ?? week.ground).trim();
}

/** "Ground III · Deep Waters" → "Ground III". */
export function groundNumberLabel(week: InteractiveWeek): string {
  return (week.ground.split('·')[0] ?? `Ground ${week.n}`).trim();
}

