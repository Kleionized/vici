import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { checkRange, checkText, LIMITS, openLifeMap, sealLifeMapText } from './model';
import { getUserIdOrNull, requireUserId } from './utils';

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return null;
    const row = await ctx.db
      .query('lifeMap')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    return row ? await openLifeMap(row) : null;
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
    checkText(args.whyStatement, LIMITS.note, 'whyStatement');
    checkText(args.oneYearAnswer, LIMITS.note, 'oneYearAnswer');
    if (args.values && args.values.length > LIMITS.values) throw new Error(`Too many values (max ${LIMITS.values})`);
    for (const value of args.values ?? []) {
      checkText(value.label, LIMITS.shortText, 'value label');
      checkRange(value.importance, 0, 10, 'importance');
    }
    const now = Date.now();
    const sealed = await sealLifeMapText(userId, args);
    const existing = await ctx.db
      .query('lifeMap')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        whyStatement: sealed.whyStatement ?? existing.whyStatement,
        oneYearAnswer: sealed.oneYearAnswer ?? existing.oneYearAnswer,
        values: sealed.values ?? existing.values,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('lifeMap', {
        userId,
        whyStatement: sealed.whyStatement,
        oneYearAnswer: sealed.oneYearAnswer,
        values: sealed.values ?? [],
        updatedAt: now,
      });
    }
  },
});
