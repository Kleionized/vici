import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { requireUserId } from './utils';

export const save = mutation({
  args: {
    slug: v.string(),
    answers: v.record(v.string(), v.union(v.string(), v.number())),
  },
  handler: async (ctx, { slug, answers }) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();
    const existing = await ctx.db
      .query('reflections')
      .withIndex('by_user_lesson', (q) => q.eq('userId', userId).eq('lessonSlug', slug))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { answers, updatedAt: now });
    } else {
      await ctx.db.insert('reflections', { userId, lessonSlug: slug, answers, createdAt: now, updatedAt: now });
    }
  },
});
