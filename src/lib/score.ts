/**
 * The recovery score.
 *
 * Deliberately not a streak: it is a running total that a slip dents rather
 * than erases (invariant #2). Clean days do most of the work, the daily
 * practice adds up quietly, and a lapse costs about four days — enough to
 * matter, not enough to make coming back feel pointless.
 */

import type { DailyCheckin, TidelineEvent } from '@/lib/types';

export const SCORE_BASE = 1_000;

export const SCORE_WEIGHTS = {
  cleanDay: 4,
  checkin: 2,
  lesson: 3,
  urgeRidden: 2,
  slip: -16,
} as const;

export type ScoreLine = { label: string; points: number };

export type Rank = { name: string; at: number };

/** The ladder the score climbs. */
export const RANKS: Rank[] = [
  { name: 'Deckhand', at: 1_000 },
  { name: 'Navigator', at: 1_150 },
  { name: 'Helmsman', at: 1_300 },
  { name: 'Captain', at: 1_500 },
];

export type ScoreBreakdown = {
  total: number;
  lines: ScoreLine[];
  net: number;
  rank: Rank;
  next?: Rank;
  toGo: number;
  /** How far between this rank and the next, 0–1. */
  progress: number;
  /** What today has added so far — the ▲ beside the number on Today. */
  delta: number;
};

/** Which rank a score sits in, and how far it is up the rung. */
export function rankFor(total: number): { rank: Rank; next?: Rank; toGo: number; progress: number } {
  let rank = RANKS[0];
  for (const r of RANKS) if (total >= r.at) rank = r;
  const next = RANKS.find((r) => r.at > total);
  const toGo = next ? next.at - total : 0;
  const span = next ? next.at - rank.at : 1;
  return { rank, next, toGo, progress: next ? Math.max(0, Math.min(1, (total - rank.at) / span)) : 1 };
}

/**
 * Build the score from the log. `days` bounds the "what moved it" window;
 * the total itself is all-time.
 */
export function buildScore(checkins: DailyCheckin[], events: TidelineEvent[], lessonsDone: number, createdAt?: number): ScoreBreakdown {
  const dayCount = createdAt ? Math.max(1, Math.floor((Date.now() - createdAt) / 86_400_000) + 1) : 1;
  const slips = events.filter((e) => e.type === 'lapse').length;
  const ridden = events.filter((e) => e.type === 'urge_rode_out').length;
  const cleanDays = Math.max(0, dayCount - slips);

  const lines: ScoreLine[] = [
    { label: 'Clean days', points: cleanDays * SCORE_WEIGHTS.cleanDay },
    { label: 'Check-ins', points: checkins.length * SCORE_WEIGHTS.checkin },
    { label: 'Lessons', points: lessonsDone * SCORE_WEIGHTS.lesson },
    { label: 'Urges ridden', points: ridden * SCORE_WEIGHTS.urgeRidden },
  ];
  if (slips) lines.push({ label: slips === 1 ? 'Slip' : `${slips} slips`, points: slips * SCORE_WEIGHTS.slip });

  const net = lines.reduce((sum, l) => sum + l.points, 0);
  const total = SCORE_BASE + net;

  // Today's own contribution, so the card can show what the day has earned.
  const midnight = new Date().setHours(0, 0, 0, 0);
  const todayKey = dateKey(new Date(midnight));
  const since = (e: TidelineEvent) => e.createdAt >= midnight;
  const delta =
    (slips && events.some((e) => e.type === 'lapse' && since(e)) ? 0 : SCORE_WEIGHTS.cleanDay) +
    (checkins.some((c) => c.date === todayKey) ? SCORE_WEIGHTS.checkin : 0) +
    events.filter((e) => e.type === 'urge_rode_out' && since(e)).length * SCORE_WEIGHTS.urgeRidden +
    events.filter((e) => e.type === 'lapse' && since(e)).length * SCORE_WEIGHTS.slip;

  return { total, lines, net, delta, ...rankFor(total) };
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ------------------------------------------------------------ over time (D230) */

const DAY = 86_400_000;
/** "This month" for the score's ledger — a rolling window, not a calendar month. */
export const LEDGER_WINDOW = 30;

/** Local calendar key, `2025-07-18`. */
export function scoreDayKey(t: number) {
  return dateKey(new Date(t));
}

export type ScoreHistory = {
  /** the score at the close of each day, the account's first day to today */
  values: number[];
  /** local midnight of day `i` */
  dayAt: (i: number) => number;
};

type ProgressRow = { status?: string; completedAt?: number } | undefined;

/**
 * Replay the score one day at a time, so a chart is the user's own history
 * rather than a drawn shape. Same weights as the total; the series is then
 * shifted so its last point lands exactly on the number beside it, because two
 * answers to "what is my score" would be worse than a rough line. (Was
 * `score.tsx`'s own; Today's thirty-day chart reads it too now.)
 */
export function scoreHistory(
  checkins: DailyCheckin[],
  events: TidelineEvent[],
  progress: Record<string, ProgressRow>,
  createdAt: number,
  now: number,
  total: number,
): ScoreHistory {
  const start = new Date(createdAt).setHours(0, 0, 0, 0);
  const days = Math.max(1, Math.floor((now - start) / DAY) + 1);

  const gained = new Map<string, number>();
  const add = (key: string, pts: number) => gained.set(key, (gained.get(key) ?? 0) + pts);
  const lapsed = new Set<string>();
  for (const e of events) {
    if (e.type === 'lapse') {
      lapsed.add(scoreDayKey(e.createdAt));
      add(scoreDayKey(e.createdAt), SCORE_WEIGHTS.slip);
    }
    if (e.type === 'urge_rode_out') add(scoreDayKey(e.createdAt), SCORE_WEIGHTS.urgeRidden);
  }
  for (const c of checkins) add(c.date, SCORE_WEIGHTS.checkin);
  for (const p of Object.values(progress)) if (p?.status === 'completed' && p.completedAt) add(scoreDayKey(p.completedAt), SCORE_WEIGHTS.lesson);

  const dayAt = (i: number) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d.getTime();
  };

  const values: number[] = [];
  let running = SCORE_BASE;
  for (let i = 0; i < days; i++) {
    const key = scoreDayKey(dayAt(i));
    running += (lapsed.has(key) ? 0 : SCORE_WEIGHTS.cleanDay) + (gained.get(key) ?? 0);
    values.push(running);
  }

  const drift = total - values[values.length - 1];
  return { values: values.map((v) => v + drift), dayAt };
}

/**
 * The last `n` days of a history, oldest first. A younger account is padded at
 * the front with its first day's score — the line starts flat where the
 * account started rather than inventing a past (today-day OQ-T3).
 */
export function lastDays(history: ScoreHistory, n: number): number[] {
  const v = history.values;
  if (v.length >= n) return v.slice(v.length - n);
  return [...Array.from({ length: n - v.length }, () => v[0]), ...v];
}

export type LedgerLine = ScoreLine & { slip?: boolean };

/**
 * What moved the score over the rolling month, on the same weights as the
 * total. One slip names its day (`Slip on Jul 8`, Score Detail Moves); more
 * than one is counted (`3 slips`).
 */
export function monthLedger(
  checkins: DailyCheckin[],
  events: TidelineEvent[],
  progress: Record<string, ProgressRow>,
  now: number,
  daysAlive: number,
): { lines: LedgerLine[]; net: number; days: number } {
  const since = now - LEDGER_WINDOW * DAY;
  const slips = events.filter((e) => e.type === 'lapse' && e.createdAt >= since);
  const ridden = events.filter((e) => e.type === 'urge_rode_out' && e.createdAt >= since).length;
  const logged = checkins.filter((c) => new Date(`${c.date}T00:00:00`).getTime() >= since).length;
  const lessons = Object.values(progress).filter((p) => p?.status === 'completed' && p.completedAt != null && p.completedAt >= since).length;
  const days = Math.min(LEDGER_WINDOW, Math.max(1, daysAlive));

  const lines: LedgerLine[] = [
    { label: 'Clean days', points: Math.max(0, days - slips.length) * SCORE_WEIGHTS.cleanDay },
    { label: 'Check-ins', points: logged * SCORE_WEIGHTS.checkin },
    { label: 'Lessons', points: lessons * SCORE_WEIGHTS.lesson },
    { label: 'Urges ridden', points: ridden * SCORE_WEIGHTS.urgeRidden },
  ];
  if (slips.length) {
    const last = new Date(slips.reduce((a, b) => (a.createdAt > b.createdAt ? a : b)).createdAt);
    lines.push({
      label: slips.length === 1 ? `Slip on ${MONTHS[last.getMonth()]} ${last.getDate()}` : `${slips.length} slips`,
      points: slips.length * SCORE_WEIGHTS.slip,
      slip: true,
    });
  }

  return { lines, net: lines.reduce((sum, l) => sum + l.points, 0), days };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
