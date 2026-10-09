/**
 * Pure dashboard aggregation. LEADING INDICATORS are the hero (sleep, mood,
 * connection, structure, lessons, reflections) — never a streak counter
 * (invariant #1). The optional "days since last lapse" is computed only when the
 * user has explicitly opted in, and even then it is a neutral secondary stat.
 *
 * Kept pure + dependency-free so the Convex server (`convex/dashboard.ts`) can
 * mirror the same logic.
 */

import { daysBetween, lastNDateKeys } from '@/lib/date';
import { isCheckin, isSlip } from '@/lib/day';
import type {
  DailyCheckin,
  DashboardData,
  IndicatorPoint,
  Lesson,
  LessonProgress,
  Reflection,
  TidelineEvent,
} from '@/lib/types';

export interface DashboardInput {
  lessons: Lesson[];
  progress: LessonProgress[];
  reflections: Reflection[];
  events: TidelineEvent[];
  checkins: DailyCheckin[];
  userCreatedAt: number;
  showStreak: boolean;
  now?: number;
}

export function computeDashboard(input: DashboardInput): DashboardData {
  const { lessons, progress, reflections, events, checkins } = input;
  const now = input.now ?? Date.now();

  // only rows with check-in content — a row holding just the day's action is not a check-in
  const checkinByDate = new Map(checkins.filter(isCheckin).map((c) => [c.date, c]));
  const week = lastNDateKeys(7);

  const sleepTrend: IndicatorPoint[] = week.map((date) => ({
    date,
    value: checkinByDate.get(date)?.sleepHours ?? null,
  }));
  const moodTrend: IndicatorPoint[] = week.map((date) => ({
    date,
    value: checkinByDate.get(date)?.mood ?? null,
  }));

  const weekCheckins = week.map((d) => checkinByDate.get(d)).filter(Boolean) as DailyCheckin[];

  const lapses = events
    .filter(isSlip)
    .sort((a, b) => b.createdAt - a.createdAt);
  const lastLapseAt = lapses[0]?.createdAt ?? input.userCreatedAt;

  return {
    lessonsCompleted: progress.filter((p) => p.status === 'completed').length,
    lessonsTotal: lessons.length,
    sleepTrend,
    moodTrend,
    movedBodyDays: weekCheckins.filter((c) => c.movedBody).length,
    socialContactDays: weekCheckins.filter((c) => c.socialContact).length,
    structureDays: weekCheckins.filter((c) => c.structureFollowed).length,
    checkinDays: weekCheckins.length,
    reflectionsCount: reflections.length,
    fitsMeCount: progress.filter((p) => p.fitsMeRating != null).length,
    recentEvents: [...events].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8),
    optionalDaysSinceLapse: input.showStreak ? Math.max(0, daysBetween(lastLapseAt, now)) : null,
  };
}
