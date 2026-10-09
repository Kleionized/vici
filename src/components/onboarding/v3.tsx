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
 * The letter is the same for everyone, so every place it appears says VICI
 * wrote it, in the voice of him at week XII — never "from you" (D476).
 */
export function buildWeekXiiLetter(a: Record<string, string | string[]>): { name: string; paragraphs: string[] } {
  return { name: String(a.name || '').trim(), paragraphs: WEEK_XII_LETTER };
}

// ── the cost boards: the rate he reported ────────────────────────────
/**
 * `07 · Frequency` read as days in thirty that end with porn — what `29 · The
 * Next 30 Days`, `30 · One Year From Now` and `31 · If Nothing Changes` draw
 * (D471). The canvas drew its own nine for everyone; these are the six
 * answers' plain arithmetic ("a few times a week" ≈ 3 × 30/7 ≈ 13). Once a day
 * and more than once a day both fill every day — the boards count days, not
 * times.
 */
const DAYS_PER_30: Record<string, number> = {
  'More than once a day': 30,
  'About once a day': 30,
  'A few times a week': 13,
  'About once a week': 4,
  'A few times a month': 3,
  'Less than once a month': 1,
};

/** Days in thirty at his reported rate, or null when the question went unanswered. */
export function daysPer30(freq: unknown): number | null {
  return typeof freq === 'string' && freq in DAYS_PER_30 ? DAYS_PER_30[freq] : null;
}

/** The same rate over a year: 365 × n/30, never more than the year. */
export function daysPerYear(per30: number): number {
  return Math.min(365, Math.round((per30 * 365) / 30));
}

/**
 * The same rate from his age to 80 — rounded to the hundred once it is in the
 * thousands (the frame's "About 6,100 days"), to the ten below that.
 */
export function daysToAge80(per30: number, age: number): number {
  const total = ((per30 * 365) / 30) * Math.max(0, 80 - age);
  if (total >= 1000) return Math.round(total / 100) * 100;
  if (total >= 100) return Math.round(total / 10) * 10;
  return Math.round(total);
}

/**
 * `count` marked cells of `total`, for the dot fields: one in each of `count`
 * even stretches, its place inside the stretch drawn by the designer's own LCG
 * (`onboardingTail.ts`), so the spread is even without reading as a ruler and
 * the same answer always draws the same field.
 */
export function spreadDays(total: number, count: number, seed = 3): boolean[] {
  const out = Array.from({ length: total }, () => false);
  const n = Math.max(0, Math.min(total, Math.round(count)));
  let s = seed;
  for (let k = 0; k < n; k++) {
    const from = Math.floor((k * total) / n);
    const to = Math.floor(((k + 1) * total) / n);
    s = (s * 9301 + 49297) % 233280;
    out[from + Math.floor((s / 233280) * (to - from))] = true;
  }
  return out;
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
