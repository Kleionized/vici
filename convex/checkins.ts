import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { checkDateKey, checkList, checkRange, checkText, LIMITS, openCheckin, sealCheckinText } from './model';
import { getUserIdOrNull, MAX_ROWS, requireUserId } from './utils';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    // the date index orders by date; newest first
    const rows = await ctx.db
      .query('dailyCheckins')
      .withIndex('by_user_date', (q) => q.eq('userId', userId))
      .order('desc')
      .take(MAX_ROWS.checkins);
    return await Promise.all(rows.map(openCheckin));
  },
});

export const getForDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return null;
    const row = await ctx.db
      .query('dailyCheckins')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', date))
      .first();
    return row ? await openCheckin(row) : null;
  },
});

export const upsert = mutation({
  args: {
    date: v.string(),
    sleepHours: v.optional(v.number()),
    mood: v.optional(v.number()),
    energy: v.optional(v.number()),
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
    checkDateKey(args.date);
    checkRange(args.sleepHours, 0, 24, 'sleepHours');
    checkRange(args.mood, 1, 5, 'mood');
    checkRange(args.energy, 1, 5, 'energy');
    checkList(args.emotions, 'emotions');
    checkList(args.reasons, 'reasons');
    checkText(args.dailyAction, LIMITS.note, 'dailyAction');
    checkText(args.note, LIMITS.note, 'note');

    const existing = await ctx.db
      .query('dailyCheckins')
      .withIndex('by_user_date', (q) => q.eq('userId', userId).eq('date', args.date))
      .first();
    // A day is written by several hands — the morning check-in, the night one,
    // and Today ticking off the day's action. `patch` clears any key set to
    // undefined, so an upsert that named every field would have the last writer
    // erase everything it happened not to carry. Only send what was passed.
    const { date, ...rest } = args;
    const plain = Object.fromEntries(Object.entries(rest).filter(([, value]) => value !== undefined)) as Omit<typeof args, 'date'>;
    const fields = { ...plain, ...(await sealCheckinText(userId, plain)) };
    if (existing) await ctx.db.patch(existing._id, fields);
    else await ctx.db.insert('dailyCheckins', { userId, date, ...fields });
  },
});
