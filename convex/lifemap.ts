import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getUserIdOrNull, requireUserId } from './utils';

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return null;
    return await ctx.db
      .query('lifeMap')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();
  },
});

export const update = mutation({
  args: {
    whyStatement: v.optional(v.string()),
    oneYearAnswer: v.optional(v.string()),
    values: v.optional(v.array(v.object({ label: v.string(), importance: v.number() }))),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();
    const existing = await ctx.db
      .query('lifeMap')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        whyStatement: args.whyStatement ?? existing.whyStatement,
        oneYearAnswer: args.oneYearAnswer ?? existing.oneYearAnswer,
        values: args.values ?? existing.values,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('lifeMap', {
        userId,
        whyStatement: args.whyStatement,
        oneYearAnswer: args.oneYearAnswer,
        values: args.values ?? [],
        updatedAt: now,
      });
    }
  },
});
