import { query } from './_generated/server';
import { getUserIdOrNull } from './utils';

/**
 * Server-side dashboard aggregation — mirrors `src/lib/dashboard.ts`. Leading
 * indicators are the hero; the optional "days since last lapse" is computed only
 * when the user opted in (invariant #1).
 */

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function lastNDateKeys(n: number, now: number): string[] {
  const out: string[] = [];
  const base = new Date(now);
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    out.push(toDateKey(d));
  }
  return out;
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const userId = await getUserIdOrNull(ctx);

    const lessons = await ctx.db.query('lessons').collect();
    if (!userId) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', userId))
      .unique();
    const showStreak = user?.settings.showStreak ?? false;
    const userCreatedAt = user?.createdAt ?? now;

    const progress = await ctx.db
      .query('lessonProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    const reflections = await ctx.db
      .query('reflections')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    const events = await ctx.db
      .query('events')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    const checkins = await ctx.db
      .query('dailyCheckins')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const checkinByDate = new Map(checkins.map((c) => [c.date, c]));
    const week = lastNDateKeys(7, now);
    const weekCheckins = week.map((d) => checkinByDate.get(d)).filter(Boolean) as typeof checkins;

    const lapses = events.filter((e) => e.type === 'lapse').sort((a, b) => b.createdAt - a.createdAt);
    const lastLapseAt = lapses[0]?.createdAt ?? userCreatedAt;
    const daysSince = Math.max(0, Math.floor((now - lastLapseAt) / (24 * 60 * 60 * 1000)));

    return {
      lessonsCompleted: progress.filter((p) => p.status === 'completed').length,
      lessonsTotal: lessons.length,
      sleepTrend: week.map((date) => ({ date, value: checkinByDate.get(date)?.sleepHours ?? null })),
      moodTrend: week.map((date) => ({ date, value: checkinByDate.get(date)?.mood ?? null })),
      movedBodyDays: weekCheckins.filter((c) => c.movedBody).length,
      socialContactDays: weekCheckins.filter((c) => c.socialContact).length,
      structureDays: weekCheckins.filter((c) => c.structureFollowed).length,
      checkinDays: weekCheckins.length,
      reflectionsCount: reflections.length,
      fitsMeCount: progress.filter((p) => p.fitsMeRating != null).length,
      recentEvents: [...events].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8),
      optionalDaysSinceLapse: showStreak ? daysSince : null,
    };
  },
});
