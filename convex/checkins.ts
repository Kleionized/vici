import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getUserIdOrNull, requireUserId } from './utils';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    const rows = await ctx.db
      .query('dailyCheckins')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
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
    emotions: v.optional(v.array(v.string())),
    reasons: v.optional(v.array(v.string())),
    movedBody: v.optional(v.boolean()),
    socialContact: v.optional(v.boolean()),
    structureFollowed: v.optional(v.boolean()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query('dailyCheckins')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', args.date))
      .unique();
    const fields = {
      sleepHours: args.sleepHours,
      mood: args.mood,
      emotions: args.emotions,
      reasons: args.reasons,
      movedBody: args.movedBody,
      socialContact: args.socialContact,
      structureFollowed: args.structureFollowed,
      note: args.note,
    };
    if (existing) await ctx.db.patch(existing._id, fields);
    else await ctx.db.insert('dailyCheckins', { userId, date: args.date, ...fields });
  },
});
