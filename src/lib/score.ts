/**
 * The recovery rating (deploy rating, D510–D519).
 *
 * One number, 0–100, that answers "how have the last seven days gone?". It
 * replaces the old running score entirely: nothing accrues, so a slip leaves
 * the rating once its day has left the window, and a quiet week cannot be
 * banked against a hard one. Three parts, on fixed weights:
 *
 * - **Showing up** — the window's days with a check-in (`isCheckin`) or a
 *   logged slip (`isSlip`). Logging a slip counts as showing up, so honesty
 *   never costs points.
 * - **Clean days** — the window's days with a check-in and no slip. A day with
 *   no check-in earns nothing here: there is no credit for silence.
 * - **Lessons** — lessons finished inside the window over the lessons the
 *   window scheduled (one per day on programme days 1–84), capped at all of
 *   them. Past the course the rating is showing up and clean days alone.
 *
 * The window is seven calendar days (`src/lib/day.ts`, never 86,400,000 ms
 * steps). It ends today once today has a check-in or a logged slip, and
 * yesterday until then, so the rating never dips just because today has not
 * been checked in yet. Days before the programme began are outside it, but the
 * denominator stays seven, so a new account builds up over its first week.
 *
 * Everything is computed on the phone from the account's check-ins, events and
 * lesson progress; both backends feed it the same rows and nothing is stored.
 */

import { toDateKey } from '@/lib/date';
import { COURSE_DAYS, calendarDaysBetween, isCheckin, isSlip, isDateKey, keyToDate, programmeStartKey, shiftKey, type ProgrammeStart } from '@/lib/day';
import type { DailyCheckin, LessonProgress, TidelineEvent } from '@/lib/types';

/** The days the rating covers. */
export const RATING_WINDOW = 7;

/** The scale every chart of the rating is drawn on — fixed, so a small change never fills the chart. */
export const RATING_SCALE = [0, 100] as const;

/**
 * What each part is worth. While the window schedules a lesson the parts are
 * 30 / 45 / 25; once it schedules none (after day 84) the lessons' share goes
 * to the other two, 40 / 60.
 */
export const RATING_WEIGHTS = {
  course: { showingUp: 30, cleanDays: 45, lessons: 25 },
  afterCourse: { showingUp: 40, cleanDays: 60, lessons: 0 },
} as const;

/** The four bands a rating falls in, lowest first. `min` and `max` are inclusive. */
export const RATING_BANDS = [
  { key: 'starting', label: 'Starting', min: 0, max: 39 },
  { key: 'steadying', label: 'Steadying', min: 40, max: 59 },
  { key: 'holding', label: 'Holding', min: 60, max: 79 },
  { key: 'strong', label: 'Strong', min: 80, max: 100 },
] as const;

export type RatingBand = (typeof RATING_BANDS)[number];

export type RatingPartKey = 'showingUp' | 'cleanDays' | 'lessons';

export type RatingPart = { key: RatingPartKey; label: string; earned: number; max: number };

export type Rating = {
  /** 0–100, whole */
  value: number;
  band: RatingBand;
  /** the window does not yet hold seven programme days (the account's first week) */
  building: boolean;
  /** programme days inside the window, 0–7 */
  lived: number;
  /** what a screen prints beside the number: the band's word, or `Building · 3 of 7 days` */
  label: string;
  /** the parts in order; a part worth nothing (lessons after the course) is left out. `earned` adds up to `value`. */
  parts: RatingPart[];
  /** the window's first programme day (its first calendar day while it holds none), `YYYY-MM-DD` */
  windowStart: string;
  /** the window's last day, `YYYY-MM-DD` */
  windowEnd: string;
};

/** What the rating is computed from — the same rows on either backend. */
export type RatingInput = {
  checkins: readonly Pick<DailyCheckin, 'date' | 'mood' | 'energy' | 'emotions' | 'reasons' | 'nightMood'>[];
  events: readonly Pick<TidelineEvent, 'type' | 'createdAt'>[];
  /** when each finished lesson was finished (ms); a completion with no date is in no window */
  lessons: readonly (number | null | undefined)[];
  start: ProgrammeStart;
};

const PART_LABEL: Record<RatingPartKey, string> = { showingUp: 'Showing up', cleanDays: 'Clean days', lessons: 'Lessons' };

/**
 * The completion times of finished lessons, from the lesson-progress map both
 * backends serve (`completedAt`, set when the lesson is finished). A row
 * marked complete without a date is left out rather than guessed.
 */
export function lessonCompletions(progress: Record<string, Pick<LessonProgress, 'status' | 'completedAt'> | undefined> | null | undefined): number[] {
  if (!progress) return [];
  const out: number[] = [];
  for (const p of Object.values(progress)) if (p?.status === 'completed' && typeof p.completedAt === 'number' && p.completedAt > 0) out.push(p.completedAt);
  return out;
}

/** The band a value falls in. */
export function bandFor(value: number): RatingBand {
  let band: RatingBand = RATING_BANDS[0];
  for (const b of RATING_BANDS) if (value >= b.min) band = b;
  return band;
}

// ── the counting ─────────────────────────────────────────────────────────────

type Index = {
  start: string | null;
  startDate: Date | null;
  /** days with a check-in */
  checked: Set<string>;
  /** days with a slip of either kind — several on one day are one slip day */
  slipped: Set<string>;
  /** lessons finished, by the day they were finished */
  lessons: Map<string, number>;
};

const keyOf = (t: number | Date) => toDateKey(t instanceof Date ? t : new Date(t));

/**
 * The rows, indexed by day — once per input: a screen builds one input per
 * render and reads several numbers off it (Today: the rating, its change and
 * thirty days of history; the Log: eight closes per report week). Kept only
 * while the input still holds the same rows.
 */
const indexed = new WeakMap<RatingInput, { of: [unknown, unknown, unknown, unknown]; ix: Index }>();

function indexOf(input: RatingInput): Index {
  const of: [unknown, unknown, unknown, unknown] = [input.checkins, input.events, input.lessons, input.start];
  const hit = indexed.get(input);
  if (hit && hit.of.every((v, i) => v === of[i])) return hit.ix;
  const ix = buildIndex(input);
  indexed.set(input, { of, ix });
  return ix;
}

function buildIndex(input: RatingInput): Index {
  const start = programmeStartKey(input.start);
  const checked = new Set<string>();
  for (const c of input.checkins) if (isCheckin(c) && isDateKey(c.date)) checked.add(c.date);
  const slipped = new Set<string>();
  for (const e of input.events) if (isSlip(e) && Number.isFinite(e.createdAt)) slipped.add(keyOf(e.createdAt));
  const lessons = new Map<string, number>();
  for (const t of input.lessons) {
    if (typeof t !== 'number' || !Number.isFinite(t) || t <= 0) continue;
    const k = keyOf(t);
    lessons.set(k, (lessons.get(k) ?? 0) + 1);
  }
  return { start, startDate: start ? keyToDate(start) : null, checked, slipped, lessons };
}

/** Today's window ends today once today has a check-in or a logged slip; until then, yesterday. */
function endFor(ix: Index, today: string): string {
  return ix.checked.has(today) || ix.slipped.has(today) ? today : shiftKey(today, -1);
}

/**
 * Round the parts so they add up to the rounded total (largest remainder): the
 * rows under the number never sum to one more or one less than it.
 */
function roundParts(raw: number[], total: number): number[] {
  const floors = raw.map((v) => Math.floor(v + 1e-9));
  let left = total - floors.reduce((s, v) => s + v, 0);
  const order = raw.map((v, i) => ({ i, frac: v - floors[i] })).sort((a, b) => b.frac - a.frac);
  for (const { i, frac } of order) {
    if (left <= 0) break;
    if (frac <= 1e-9) continue;
    floors[i] += 1;
    left -= 1;
  }
  return floors;
}

/** The rating of the seven days ending on `end` (a date key). */
function rate(ix: Index, end: string): Rating {
  const keys = Array.from({ length: RATING_WINDOW }, (_, i) => shiftKey(end, i - (RATING_WINDOW - 1)));
  const inside = ix.start == null ? keys : keys.filter((k) => k >= (ix.start as string));
  const dayOf = (k: string) => (ix.startDate ? calendarDaysBetween(ix.startDate, keyToDate(k)) + 1 : null);
  // A window day on programme days 1–84 schedules a lesson. A day before the
  // start schedules one too, so lessons build up over the first week as the
  // other two parts do (the denominator stays seven).
  const scheduled = keys.filter((k) => {
    const d = dayOf(k);
    return d == null || d <= COURSE_DAYS;
  }).length;

  const showed = inside.filter((k) => ix.checked.has(k) || ix.slipped.has(k)).length;
  const clean = inside.filter((k) => ix.checked.has(k) && !ix.slipped.has(k)).length;
  const done = inside.reduce((n, k) => n + (ix.lessons.get(k) ?? 0), 0);

  const w = scheduled ? RATING_WEIGHTS.course : RATING_WEIGHTS.afterCourse;
  const raw = [(w.showingUp * showed) / RATING_WINDOW, (w.cleanDays * clean) / RATING_WINDOW, scheduled ? w.lessons * Math.min(1, done / scheduled) : 0];
  const value = Math.max(0, Math.min(100, Math.round(raw[0] + raw[1] + raw[2] + 1e-9)));
  const earned = roundParts(raw, value);
  const parts: RatingPart[] = (['showingUp', 'cleanDays', 'lessons'] as const)
    .map((key, i) => ({ key, label: PART_LABEL[key], earned: earned[i], max: w[key] as number }))
    .filter((p) => p.max > 0);

  const lived = ix.start == null ? RATING_WINDOW : inside.length;
  const building = lived < RATING_WINDOW;
  const band = bandFor(value);
  return {
    value,
    band,
    building,
    lived,
    label: building ? `Building · ${lived} of ${RATING_WINDOW} days` : band.label,
    parts,
    windowStart: inside[0] ?? keys[0],
    windowEnd: end,
  };
}

// ── the exports screens read ─────────────────────────────────────────────────

/**
 * The rating as of `asOf`: the seven days ending today if today has a
 * check-in or a logged slip, else the seven ending yesterday.
 */
export function computeRating(input: RatingInput, asOf: number | Date = Date.now()): Rating {
  const ix = indexOf(input);
  return rate(ix, endFor(ix, keyOf(asOf)));
}

/**
 * The rating as a day closed: the seven days ending on `day` (a date key or a
 * moment in it). A closed day has nothing left to wait for, so it is in its
 * own window whether it was checked in or not — this is what yesterday, a
 * report week's Sunday and every past point of a chart read.
 */
export function ratingThrough(input: RatingInput, day: string | number | Date): Rating {
  return rate(indexOf(input), typeof day === 'string' ? day : keyOf(day));
}

/**
 * The rating as of each of the last `days` days, oldest first: each past day
 * as it closed (`ratingThrough`), today as it stands now (`computeRating`), so
 * the line ends on the number beside it. A day before the programme reads 0.
 */
export function ratingHistory(input: RatingInput, days: number, asOf: number | Date = Date.now()): number[] {
  const ix = indexOf(input);
  const today = keyOf(asOf);
  const n = Math.max(1, Math.floor(days));
  return Array.from({ length: n }, (_, i) => (i === n - 1 ? rate(ix, endFor(ix, today)).value : rate(ix, shiftKey(today, i - (n - 1))).value));
}

/** Today's rating less yesterday's as it closed — the ▲ / ▼ beside the number. */
export function ratingChange(input: RatingInput, asOf: number | Date = Date.now()): number {
  const ix = indexOf(input);
  const today = keyOf(asOf);
  return rate(ix, endFor(ix, today)).value - rate(ix, shiftKey(today, -1)).value;
}
