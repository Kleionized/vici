/**
 * Weekly report — the end-of-week reflection (canvas: WeeklyReportScreen).
 * Everything is DERIVED from the same check-ins + events the app already
 * stores, so there's no new table: a report for any week is just a view over
 * that week's data compared to the week before. Weeks are Monday-start to match
 * the report's M–S day axis.
 */

import { toDateKey } from '@/lib/date';
import { addDays, calendarDaysBetween, dayMood, isCheckin, isSlip, isSurfed, keyToDate, MOOD_WORDS, programmeStartMs, shiftKey, type ProgrammeStart } from '@/lib/day';
import { dateRange } from '@/lib/format';
import { ratingThrough, type RatingInput } from '@/lib/score';
import type { DailyCheckin, TidelineEvent } from '@/lib/types';

/** The one mood word list (`src/lib/day.ts`), under the name this module always exported. */
export const MOOD_NAME: readonly string[] = MOOD_WORDS;

/**
 * The programme's first week makes a report only if at least this many of its
 * days were lived (a Monday–Thursday start). A later start waits for the
 * first full week rather than delivering a "weekly" report built on an
 * evening or two.
 */
export const FIRST_WEEK_MIN_DAYS = 4;

/** The Monday (00:00 local) of the week containing `d`. */
export function mondayOf(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const dow = (x.getDay() + 6) % 7; // 0 = Monday
  x.setDate(x.getDate() - dow);
  return x;
}

/**
 * Monday keys for every completed week of the programme, newest first. Weeks
 * step back by the calendar (`setDate`), so a clock change cannot turn a
 * Monday into the Sunday before it. The week the programme began in counts
 * only when it held `FIRST_WEEK_MIN_DAYS` programme days.
 */
export function completedWeekStarts(start: ProgrammeStart, now = Date.now()): string[] {
  const first = programmeStartMs(start);
  if (first == null) return [];
  const firstMon = mondayOf(new Date(first));
  const livedInFirst = 7 - calendarDaysBetween(firstMon, first);
  if (livedInFirst < FIRST_WEEK_MIN_DAYS) firstMon.setDate(firstMon.getDate() + 7);
  const out: string[] = [];
  const cursor = mondayOf(new Date(now));
  cursor.setDate(cursor.getDate() - 7);
  while (cursor.getTime() >= firstMon.getTime()) {
    out.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() - 7);
  }
  return out;
}

/** The most recent completed week's Monday key, or null before the first one closes. */
export function latestCompletedWeek(start: ProgrammeStart, now = Date.now()): string | null {
  return completedWeekStarts(start, now)[0] ?? null;
}

/**
 * A report week's name, as `dateRange()` writes it: `Jul 14–20` within a
 * month, `Jun 30 – Jul 6` across two (Log Reports' row). Every register prints
 * this one label.
 */
export function weekLabel(weekStartKey: string): string {
  const start = keyToDate(weekStartKey);
  return dateRange(start, addDays(start, 6));
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

/**
 * A closed week, read off the log. The day's mood is the morning's reading,
 * else the night's (`dayMood`); a check-in is a row with check-in content; a
 * relapse is either kind of slip.
 */
export function buildWeeklyReport(weekStartKey: string, checkins: DailyCheckin[], events: TidelineEvent[]): WeeklyReport {
  const start = keyToDate(weekStartKey);
  const prev = addDays(start, -7);
  const end = addDays(start, 7).getTime();
  const keys = (base: Date) => Array.from({ length: 7 }, (_, i) => toDateKey(addDays(base, i)));
  const rows = checkins.filter(isCheckin);
  const moodBy = new Map(rows.filter((c) => dayMood(c) != null).map((c) => [c.date, dayMood(c) as number]));
  const thisKeys = keys(start);
  const thisMoods = thisKeys.map((k) => moodBy.get(k) ?? null);
  const lastMoods = keys(prev).map((k) => moodBy.get(k) ?? null);

  const mean = (a: (number | null)[]) => {
    const v = a.filter((x): x is number => x != null);
    return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null;
  };
  const evThis = events.filter((e) => e.createdAt >= start.getTime() && e.createdAt < end);
  const evLast = events.filter((e) => e.createdAt >= prev.getTime() && e.createdAt < start.getTime());
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
  const week = new Set(thisKeys);

  return {
    weekStart: weekStartKey,
    label,
    thisMoods,
    lastMoods,
    thisAvg: mean(thisMoods),
    lastAvg: mean(lastMoods),
    checkins: rows.filter((c) => week.has(c.date)).length,
    urges: evThis.filter(isUrge).length,
    urgesLast: evLast.filter(isUrge).length,
    relapses: evThis.filter(isSlip).length,
    relapsesLast: evLast.filter(isSlip).length,
    avgSeverity: sevMean(evThis),
    avgSeverityLast: sevMean(evLast),
    lateNightUrges,
  };
}

/**
 * Whether the launch gate delivers a closed week's report: the week holds
 * something the user did — a check-in, an urge or slip logged, a lesson
 * finished. The report screen draws the rating, the days and the urges for any
 * lived week, so a week of urge logs with no mood is delivered too; a week
 * with nothing in it is not announced.
 */
export function weekHasRecords(weekStartKey: string, checkins: DailyCheckin[], events: TidelineEvent[], lessons: readonly number[] = []): boolean {
  const start = keyToDate(weekStartKey).getTime();
  const end = addDays(start, 7).getTime();
  const lastKey = toDateKey(addDays(start, 6));
  return (
    checkins.some((c) => isCheckin(c) && c.date >= weekStartKey && c.date <= lastKey) ||
    events.some((e) => e.createdAt >= start && e.createdAt < end) ||
    lessons.some((t) => t >= start && t < end)
  );
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
 * The recovery rating as a day closed (`ratingThrough`, src/lib/score.ts):
 * the seven days ending on `day`. Every register that prints a week's rating
 * — the Log's Reports, the weekly report's line — reads this one function, so
 * "86 · +12 this week" is the same number on both screens (D284, D515).
 */
export function ratingAt(day: string | number, input: RatingInput): number {
  return ratingThrough(input, day).value;
}

export interface WeekRating {
  weekStart: string;
  /** the rating as each of the seven days closed, Monday first */
  days: number[];
  /** the rating the week closed on (its Sunday) */
  rating: number;
  /** what the week moved it by, against the Sunday before */
  delta: number;
}

/** A week's line and its close, read off `ratingAt` at each day's end. */
export function weekRating(weekStartKey: string, input: RatingInput): WeekRating {
  const before = ratingAt(shiftKey(weekStartKey, -1), input);
  const days = Array.from({ length: 7 }, (_, i) => ratingAt(shiftKey(weekStartKey, i), input));
  return { weekStart: weekStartKey, days, rating: days[6], delta: days[6] - before };
}

/** How a day of a report week went (Weekly Report — Days). */
export type DayStatus = 'clean' | 'ridden' | 'slip' | 'none';

/**
 * The seven days of a week, Monday first: `slip` — a lapse or an urge that
 * ended in one; `ridden` — an urge ridden out and no slip; `clean` — neither;
 * `none` — a day before the programme began or after `now`.
 */
export function dayStatuses(weekStartKey: string, events: TidelineEvent[], start: ProgrammeStart, now = Date.now()): DayStatus[] {
  const monday = keyToDate(weekStartKey);
  const firstDay = programmeStartMs(start) ?? -Infinity;
  return Array.from({ length: 7 }, (_, i) => {
    const from = addDays(monday, i).getTime();
    const to = addDays(monday, i + 1).getTime();
    if (to <= firstDay || from > now) return 'none';
    const day = events.filter((e) => e.createdAt >= from && e.createdAt < to);
    if (day.some(isSlip)) return 'slip';
    if (day.some(isSurfed)) return 'ridden';
    return 'clean';
  });
}
