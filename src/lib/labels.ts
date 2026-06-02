/**
 * Display copy for enums. Event copy is intentionally NEUTRAL and CURIOUS — a
 * lapse is data, never failure (invariant #2). No "relapse", no "failed", no
 * shame language anywhere in here.
 */

import { colors } from '@/lib/theme';
import type { EventType, LessonCategory } from '@/lib/types';

export const CATEGORY_LABEL: Record<LessonCategory, string> = {
  motivation: 'Motivation',
  physiological: 'Physiological',
  environmental: 'Environmental',
  psychological: 'Psychological',
  existential: 'Existential',
  social: 'Social',
  psychiatric: 'Psychiatric',
  meta: 'Meta',
};

export const EVENT_LABEL: Record<EventType, string> = {
  urge_rode_out: 'Rode out an urge',
  urge_acted_on: 'Acted on an urge',
  lapse: 'A lapse',
  win: 'A win',
  check_in: 'Daily check-in',
};

/** One-line neutral framing shown under each event type when logging. */
export const EVENT_HINT: Record<EventType, string> = {
  urge_rode_out: 'A wave you let pass. Worth noticing what helped.',
  urge_acted_on: 'Information about what you needed in the moment.',
  lapse: 'A neutral event to learn from — not a verdict.',
  win: 'Something that moved you toward the life you want.',
  check_in: 'A quick read on the leading indicators.',
};

export const EVENT_TINT: Record<EventType, string> = colors.event;

export function eventTint(type: EventType): string {
  return EVENT_TINT[type] ?? colors.neutral;
}
