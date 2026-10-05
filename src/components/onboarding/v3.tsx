/**
 * Onboarding v3 — what the tail still reads from the campaign funnel: the
 * week-XII letter's shape (`buildWeekXiiLetter`) and the risk window the
 * reminders name (`windowFor`).
 *
 * The funnel engine itself — `O3Shell`, `O3FunnelStep`, `O3AgeGate` — moved to
 * `funnel.tsx` (D390). The three-page campaign map (`O3Reading`) is gone: this
 * drop withdrew `Campaign Map I–III` and its flow runs `34 · What You Want
 * Back` straight to `38 · A Letter Arrived` (D324). This file is tail's.
 */

import { WEEK_XII_LETTER } from '@/content/weekXiiLetter';

// ── letter ───────────────────────────────────────────────────────────
/**
 * `39 · A Letter From Week XII`.
 *
 * The design writes the letter in full, so the prose is the frame's and only
 * the name is his. The shape of the return is unchanged, because the Log keeps
 * a copy (the plain text; the bold run is the reader's drawing, not the words).
 */
export function buildWeekXiiLetter(a: Record<string, string | string[]>): { name: string; paragraphs: string[] } {
  return { name: String(a.name || '').trim(), paragraphs: WEEK_XII_LETTER };
}

// ── Day I ────────────────────────────────────────────────────────────
/**
 * The window the reminders guard, in `11 · When`'s own labels.
 *
 * Returns the hour, the phrase the old primer used for it, and the name
 * `42 · Reminders` puts in its headline ("Late night is when you're most likely
 * to watch.").
 *
 * The old labels are kept beside the new ones because an account answered
 * before the rename still carries them.
 */
export function windowFor(a: Record<string, string | string[]>): [string, string, string] {
  const t = (a.triggers as string[]) || [];
  const has = (...names: string[]) => names.some((n) => t.includes(n));
  if (has('Late at night', 'When I can’t sleep', 'Phone in bed', 'Can’t sleep', 'Late night')) return ['11:00 pm', 'before the tide rises', 'Late night'];
  if (has('When I’m stressed', 'After stress')) return ['6:00 pm', 'as the day lets go', 'After stress'];
  if (has('When I’m bored', 'Bored in the day', 'Bored daytime')) return ['9:00 pm', 'when the evening goes slack', 'Boredom in the day'];
  if (has('After drinking')) return ['10:00 pm', 'before the evening turns', 'After drinking'];
  if (has('When I’m home alone', 'Home alone')) return ['8:00 pm', 'while the house is empty', 'Being home alone'];
  if (has('On weekends', 'Weekends')) return ['9:30 pm', 'before the quiet hours', 'The weekend'];
  if (has('In the morning', 'Early morning')) return ['6:30 am', 'before the day starts', 'Early morning'];
  if (has('While scrolling')) return ['9:00 pm', 'when the scrolling starts', 'Scrolling'];
  return ['9:30 pm', 'before the quiet hours', 'Late night'];
}
