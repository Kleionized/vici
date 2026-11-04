import { v } from 'convex/values';

import { query } from './_generated/server';
import { openEvent } from './model';
import { findUserDoc, getUserIdOrNull, MAX_ROWS } from './utils';

/**
 * Server-side dashboard aggregation — mirrors `src/lib/dashboard.ts`. Leading
 * indicators are the hero; the optional "days since last lapse" is computed only
 * when the user opted in (invariant #1).
 *
 * The server runs in UTC, so it cannot know which calendar day it is for the
 * person asking: the client sends its own `today` (`YYYY-MM-DD`, local) and the
 * week is counted back from that. Without it the week was the server's — a
 * check-in made at 9pm in California landed on "tomorrow".
 */

const DAY = 86_400_000;

/** `YYYY-MM-DD` plus `n` days, by the calendar (UTC arithmetic on a date-only value is exact). */
function shiftKey(key: string, n: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d) + n * DAY);
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`;
}

function utcKey(ms: number): string {
  const t = new Date(ms);
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`;
}

export const get = query({
  args: { today: v.optional(v.string()), lessonsTotal: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return null;
    const today = args.today && /^\d{4}-\d{2}-\d{2}$/.test(args.today) ? args.today : utcKey(now);

    const user = await findUserDoc(ctx, userId);
    const showStreak = user?.settings.showStreak ?? false;
    const userCreatedAt = user?.createdAt ?? now;

    const progress = await ctx.db
      .query('lessonProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .take(MAX_ROWS.progress);
    const reflections = await ctx.db
      .query('reflections')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .take(MAX_ROWS.reflections);
    const events = await ctx.db
      .query('events')
      .withIndex('by_user_createdAt', (q) => q.eq('userId', userId))
      .order('desc')
      .take(MAX_ROWS.events);
    const week = Array.from({ length: 7 }, (_, i) => shiftKey(today, i - 6));
    const checkins = await ctx.db
      .query('dailyCheckins')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).gte('date', week[0]).lte('date', week[6]))
      .take(14);

    const checkinByDate = new Map(checkins.map((c) => [c.date, c]));
    const weekCheckins = week.map((d) => checkinByDate.get(d)).filter((c): c is NonNullable<typeof c> => c != null);

    const lastLapseAt = events.find((e) => e.type === 'lapse')?.createdAt ?? userCreatedAt;
    const daysSince = Math.max(0, Math.floor((now - lastLapseAt) / DAY));

    return {
      lessonsCompleted: progress.filter((p) => p.status === 'completed').length,
      lessonsTotal: args.lessonsTotal ?? 84,
      sleepTrend: week.map((date) => ({ date, value: checkinByDate.get(date)?.sleepHours ?? null })),
      moodTrend: week.map((date) => ({ date, value: checkinByDate.get(date)?.mood ?? null })),
      movedBodyDays: weekCheckins.filter((c) => c.movedBody).length,
      socialContactDays: weekCheckins.filter((c) => c.socialContact).length,
      structureDays: weekCheckins.filter((c) => c.structureFollowed).length,
      checkinDays: weekCheckins.length,
      reflectionsCount: reflections.length,
      fitsMeCount: progress.filter((p) => p.fitsMeRating != null).length,
      recentEvents: await Promise.all(events.slice(0, 8).map(openEvent)),
      optionalDaysSinceLapse: showStreak ? daysSince : null,
    };
  },
});
