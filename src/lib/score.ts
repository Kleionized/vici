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
