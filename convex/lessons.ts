import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getUserIdOrNull, requireUserId } from './utils';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const lessons = await ctx.db.query('lessons').withIndex('by_orderIndex').collect();
    return lessons.sort((a, b) => a.orderIndex - b.orderIndex);
  },
});

/** All of the current user's lesson progress rows (the app builds a slug→row map). */
export const progress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    return await ctx.db
      .query('lessonProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
  },
});

export const getDetail = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const lesson = await ctx.db
      .query('lessons')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique();
    if (!lesson) return null;
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return { lesson, progress: null, reflection: null };
    const progressRow = await ctx.db
      .query('lessonProgress')
      .withIndex('by_user_lesson', (q) => q.eq('userId', userId).eq('lessonSlug', slug))
      .unique();
    const reflection = await ctx.db
      .query('reflections')
      .withIndex('by_user_lesson', (q) => q.eq('userId', userId).eq('lessonSlug', slug))
      .unique();
    return { lesson, progress: progressRow, reflection };
  },
});

/** The next not-yet-completed lesson (or the last one if all are done). */
export const current = query({
  args: {},
  handler: async (ctx) => {
    const lessons = (await ctx.db.query('lessons').withIndex('by_orderIndex').collect()).sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );
    if (lessons.length === 0) return null;
    const userId = await getUserIdOrNull(ctx);
    const progressRows = userId
      ? await ctx.db
          .query('lessonProgress')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .collect()
      : [];
    const bySlug = new Map(progressRows.map((p) => [p.lessonSlug, p]));
    let idx = lessons.findIndex((l) => bySlug.get(l.slug)?.status !== 'completed');
    if (idx === -1) idx = lessons.length - 1;
    const lesson = lessons[idx];
    return { lesson, progress: bySlug.get(lesson.slug) ?? null, index: idx, total: lessons.length };
  },
});

export const startLesson = mutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query('lessonProgress')
      .withIndex('by_user_lesson', (q) => q.eq('userId', userId).eq('lessonSlug', slug))
      .unique();
    if (existing) return; // already started or completed
    await ctx.db.insert('lessonProgress', { userId, lessonSlug: slug, status: 'in_progress' });
  },
});

export const completeLesson = mutation({
  args: { slug: v.string(), fitsMeRating: v.optional(v.number()) },
  handler: async (ctx, { slug, fitsMeRating }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query('lessonProgress')
      .withIndex('by_user_lesson', (q) => q.eq('userId', userId).eq('lessonSlug', slug))
      .unique();
    const patch = {
      status: 'completed' as const,
      completedAt: Date.now(),
      fitsMeRating: fitsMeRating ?? existing?.fitsMeRating,
    };
    if (existing) await ctx.db.patch(existing._id, patch);
    else await ctx.db.insert('lessonProgress', { userId, lessonSlug: slug, ...patch });
  },
});
