import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { checkText, LIMITS, openReflection, sealReflection } from './model';
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
    const row = await ctx.db
      .query('reflections')
      .withIndex('by_user_lesson', (q) => q.eq('userId', userId).eq('lessonSlug', slug))
      .first();
    return row ? await openReflection(row) : null;
  },
});

export const save = mutation({
  args: {
    slug: v.string(),
    answers: v.record(v.string(), v.union(v.string(), v.number())),
  },
  handler: async (ctx, { slug, answers }) => {
    const userId = await requireUserId(ctx);
    checkText(slug, 80, 'slug');
    const entries = Object.entries(answers);
    if (entries.length > LIMITS.answers) throw new Error(`Too many answers (max ${LIMITS.answers})`);
    for (const [key, value] of entries) {
      checkText(key, 80, 'answer key');
      if (typeof value === 'string') checkText(value, LIMITS.answer, 'answer');
    }
    const now = Date.now();
    const sealed = await sealReflection(userId, answers);
    const existing = await ctx.db
      .query('reflections')
      .withIndex('by_user_lesson', (q) => q.eq('userId', userId).eq('lessonSlug', slug))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { answers: sealed, updatedAt: now });
    } else {
      await ctx.db.insert('reflections', { userId, lessonSlug: slug, answers: sealed, createdAt: now, updatedAt: now });
    }
  },
});
