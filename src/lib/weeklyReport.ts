/**
 * Weekly report — the end-of-week reflection (canvas: WeeklyReportScreen).
 * Everything is DERIVED from the same check-ins + events the app already
 * stores, so there's no new table: a report for any week is just a view over
 * that week's data compared to the week before. Weeks are Monday-start to match
 * the report's M–S day axis.
 */

import { toDateKey } from '@/lib/date';
import type { DailyCheckin, TidelineEvent } from '@/lib/types';

const DAY = 86_400_000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

  const end = new Date(startMs + 6 * DAY);
  const start = new Date(startMs);
  const label =
    start.getMonth() === end.getMonth()
      ? `${MONTHS[start.getMonth()]} ${start.getDate()}–${end.getDate()}`
      : `${MONTHS[start.getMonth()]} ${start.getDate()} – ${MONTHS[end.getMonth()]} ${end.getDate()}`;

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
