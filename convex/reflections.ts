import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getUserIdOrNull, requireUserId } from './utils';

/**
 * One lesson's reflection. Lesson *content* ships in the app bundle, so the
 * reader must be able to fetch what it wrote about a lesson without the
 * `lessons` table knowing that lesson exists.
 */
export const getForLesson = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return null;
    return await ctx.db
      .query('reflections')
      .withIndex('by_user_lesson', (q) => q.eq('userId', userId).eq('lessonSlug', slug))
      .unique();
  },
});

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
