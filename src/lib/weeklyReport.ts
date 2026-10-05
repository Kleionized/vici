/**
 * Weekly report — the end-of-week reflection (canvas: WeeklyReportScreen).
 * Everything is DERIVED from the same check-ins + events the app already
 * stores, so there's no new table: a report for any week is just a view over
 * that week's data compared to the week before. Weeks are Monday-start to match
 * the report's M–S day axis.
 */

import { toDateKey } from '@/lib/date';
import { dateRange, shortDate } from '@/lib/format';
import { SCORE_BASE, SCORE_WEIGHTS } from '@/lib/score';
import type { DailyCheckin, TidelineEvent } from '@/lib/types';

const DAY = 86_400_000;

export const MOOD_NAME = ['Low', 'Down', 'Fine', 'Good', 'Radiant'];

/** The Monday (00:00 local) of the week containing `d`. */
export function mondayOf(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const dow = (x.getDay() + 6) % 7; // 0 = Monday
  x.setDate(x.getDate() - dow);
  return x;
}

/** Monday keys for every fully-completed week from account start to now, newest first. */
export function completedWeekStarts(createdAt: number, now = Date.now()): string[] {
  const firstMon = mondayOf(new Date(createdAt)).getTime();
  const currentMon = mondayOf(new Date(now)).getTime();
  const out: string[] = [];
  for (let t = currentMon - 7 * DAY; t >= firstMon; t -= 7 * DAY) out.push(toDateKey(new Date(t)));
  return out;
}

/** The most recent completed week's Monday key, or null if the account is < 1 week old. */
export function latestCompletedWeek(createdAt: number, now = Date.now()): string | null {
  return completedWeekStarts(createdAt, now)[0] ?? null;
}

/**
 * A report week's name: `dateRange()`'s `Jul 14–20` — except across two
 * months, where the one frame that draws such a week (Log Reports' row
 * `Jun 30 – Jul 6`, bytes `30 – Jul`) spaces the en dash that `dateRange()`
 * closes up. The frame's string wins; every register prints this one label.
 */
export function weekLabel(weekStartKey: string): string {
  const start = new Date(`${weekStartKey}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return start.getMonth() === end.getMonth() ? dateRange(start, end) : `${shortDate(start)} – ${shortDate(end)}`;
}

export interface WeeklyReport {
  weekStart: string;
  label: string; // "Oct 1–7"
  thisMoods: (number | null)[]; // 7, Mon..Sun, 1–5 or null
  lastMoods: (number | null)[];
  thisAvg: number | null; // 1–5
  lastAvg: number | null;
  checkins: number;
  urges: number;
  urgesLast: number;
  relapses: number;
  relapsesLast: number;
  avgSeverity: number | null; // 1–10
  avgSeverityLast: number | null;
  lateNightUrges: number;
}

export function buildWeeklyReport(weekStartKey: string, checkins: DailyCheckin[], events: TidelineEvent[]): WeeklyReport {
  const startMs = new Date(`${weekStartKey}T00:00:00`).getTime();
  const prevMs = startMs - 7 * DAY;
  const keys = (base: number) => Array.from({ length: 7 }, (_, i) => toDateKey(new Date(base + i * DAY)));
  const moodBy = new Map(checkins.filter((c) => c.mood != null).map((c) => [c.date, c.mood as number]));
  const thisMoods = keys(startMs).map((k) => moodBy.get(k) ?? null);
  const lastMoods = keys(prevMs).map((k) => moodBy.get(k) ?? null);

  const mean = (a: (number | null)[]) => {
    const v = a.filter((x): x is number => x != null);
    return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null;
  };
  const inWeek = (t: number, base: number) => t >= base && t < base + 7 * DAY;
  const evThis = events.filter((e) => inWeek(e.createdAt, startMs));
  const evLast = events.filter((e) => inWeek(e.createdAt, prevMs));
  const isUrge = (e: TidelineEvent) => e.type === 'urge_rode_out' || e.type === 'urge_acted_on';
  const sevMean = (evs: TidelineEvent[]) => {
    const s = evs.filter(isUrge).map((e) => e.severity).filter((x): x is number => x != null);
    return s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;
  };
  const lateNightUrges = evThis
    .filter(isUrge)
    .filter((e) => {
      const h = new Date(e.createdAt).getHours();
      return h >= 22 || h < 6;
    }).length;

  const label = weekLabel(weekStartKey);

  return {
    weekStart: weekStartKey,
    label,
    thisMoods,
    lastMoods,
    thisAvg: mean(thisMoods),
    lastAvg: mean(lastMoods),
    checkins: thisMoods.filter((m) => m != null).length,
    urges: evThis.filter(isUrge).length,
    urgesLast: evLast.filter(isUrge).length,
    relapses: evThis.filter((e) => e.type === 'lapse').length,
    relapsesLast: evLast.filter((e) => e.type === 'lapse').length,
    avgSeverity: sevMean(evThis),
    avgSeverityLast: sevMean(evLast),
    lateNightUrges,
  };
}

/**
 * Whether a closed week actually has anything to report. The whole screen is
 * built on the mood rows, so a week with no mood logged in it has nothing to
 * show. Both the screen's empty state and the launch-time gate that decides
 * whether to open the report at all read this, so the two cannot drift apart:
 * the app must never deliver a report that then says it isn't written yet.
 */
export type PopulatedWeeklyReport = WeeklyReport & { thisAvg: number };

export function hasReportContent(report: WeeklyReport | null): report is PopulatedWeeklyReport {
  return report != null && report.thisAvg != null;
}

/** Severity 1–10 → the urge-log intensity word. */
export function severityWord(s: number | null): string | null {
  if (s == null) return null;
  if (s <= 2) return 'Faint';
  if (s <= 4) return 'Mild';
  if (s <= 6) return 'Strong';
  if (s <= 8) return 'Intense';
  return 'Overwhelming';
}

// ── the Vici Overhaul register (logs group, additive) ───────────────────────

/**
 * The score as it stood at a moment, on the weights Today's card uses — every
 * register that prints a week's score (the Log's Reports, the weekly report's
 * line) reads this one function, so "1,240 · +12 this week" is the same number
 * on both screens (D284). `lessons` are the completion times of finished lessons.
 */
export function scoreAt(at: number, createdAt: number, checkins: DailyCheckin[], events: TidelineEvent[], lessons: number[]): number {
  const days = Math.max(0, Math.floor((at - createdAt) / DAY) + 1);
  const slips = events.filter((e) => e.type === 'lapse' && e.createdAt <= at).length;
  const rode = events.filter((e) => e.type === 'urge_rode_out' && e.createdAt <= at).length;
  const logged = checkins.filter((c) => new Date(`${c.date}T00:00:00`).getTime() <= at).length;
  const done = lessons.filter((t) => t <= at).length;
  return (
    SCORE_BASE +
    Math.max(0, days - slips) * SCORE_WEIGHTS.cleanDay +
    logged * SCORE_WEIGHTS.checkin +
    done * SCORE_WEIGHTS.lesson +
    rode * SCORE_WEIGHTS.urgeRidden +
    slips * SCORE_WEIGHTS.slip
  );
}

export interface WeekScore {
  weekStart: string;
  /** the score at the end of each of the seven days, Monday first */
  days: number[];
  /** the score the week closed on */
  score: number;
  /** what the week moved it by, against the Sunday before */
  delta: number;
}

/** A week's line and its total, read off `scoreAt` at each day's end. */
export function weekScore(weekStartKey: string, createdAt: number, checkins: DailyCheckin[], events: TidelineEvent[], lessons: number[]): WeekScore {
  const start = new Date(`${weekStartKey}T00:00:00`).getTime();
  const base = scoreAt(start - 1, createdAt, checkins, events, lessons);
  const days = Array.from({ length: 7 }, (_, i) => scoreAt(new Date(start).setDate(new Date(start).getDate() + i + 1) - 1, createdAt, checkins, events, lessons));
  return { weekStart: weekStartKey, days, score: days[6], delta: Math.round(days[6] - base) };
}

/** How a day of a report week went (Weekly Report — Days). */
export type DayStatus = 'clean' | 'ridden' | 'slip' | 'none';

const isSlipEvent = (e: TidelineEvent) => e.type === 'lapse' || e.type === 'urge_acted_on';

/**
 * The seven days of a week, Monday first: `slip` — a lapse or an urge that
 * ended in one; `ridden` — an urge ridden out and no slip; `clean` — neither;
 * `none` — a day before the account existed or after `now`.
 */
export function dayStatuses(weekStartKey: string, events: TidelineEvent[], createdAt: number, now = Date.now()): DayStatus[] {
  const start = new Date(`${weekStartKey}T00:00:00`);
  const firstDay = new Date(createdAt).setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const from = new Date(start).setDate(start.getDate() + i);
    const to = new Date(start).setDate(start.getDate() + i + 1);
    if (to <= firstDay || from > now) return 'none';
    const day = events.filter((e) => e.createdAt >= from && e.createdAt < to);
    if (day.some(isSlipEvent)) return 'slip';
    if (day.some((e) => e.type === 'urge_rode_out')) return 'ridden';
    return 'clean';
  });
}
