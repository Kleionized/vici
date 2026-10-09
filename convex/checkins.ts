import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getUserIdOrNull, requireUserId } from './utils';

/**
 * At most one row a day, so this is years of history; the bound keeps the
 * read inside a query's limits however long an account lives.
 */
const LIST_CAP = 2_000;

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    // newest first, by the day each row is for
    return await ctx.db
      .query('dailyCheckins')
      .withIndex('by_user_date', (q) => q.eq('userId', userId))
      .order('desc')
      .take(LIST_CAP);
  },
});

export const getForDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return null;
    return await ctx.db
      .query('dailyCheckins')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', date))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    date: v.string(),
    sleepHours: v.optional(v.number()),
    mood: v.optional(v.number()),
    energy: v.optional(v.number()),
    nightMood: v.optional(v.number()),
    emotions: v.optional(v.array(v.string())),
    reasons: v.optional(v.array(v.string())),
    dailyAction: v.optional(v.string()),
    dailyActionDone: v.optional(v.boolean()),
    movedBody: v.optional(v.boolean()),
    socialContact: v.optional(v.boolean()),
    structureFollowed: v.optional(v.boolean()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    // every reader keys a row by its local `YYYY-MM-DD`; anything else would be a row no screen can find
    if (!DATE_KEY.test(args.date)) throw new Error('date must be YYYY-MM-DD');
    const existing = await ctx.db
      .query('dailyCheckins')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', args.date))
      .unique();
    // A day is written by several hands — the morning check-in, the night one,
    // and Today ticking off the day's action. `patch` clears any key set to
    // undefined, so an upsert that named every field would have the last writer
    // erase everything it happened not to carry. Only send what was passed.
    const { date, ...rest } = args;
    const fields = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
    if (existing) await ctx.db.patch(existing._id, fields);
    else await ctx.db.insert('dailyCheckins', { userId, date, ...fields });
  },
});
