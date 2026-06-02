import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getUserDoc, getUserIdOrNull, requireUserId } from './utils';

/** Soft-fail read used at mount — returns null when signed out (CLAUDE-style). */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return null;
    return await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', userId))
      .unique();
  },
});

/** Idempotent: create the user mirror on first authenticated load. */
export const ensureUser = mutation({
  args: { displayName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', userId))
      .unique();
    if (existing) return existing._id;
    return await ctx.db.insert('users', {
      clerkUserId: userId,
      displayName: args.displayName,
      createdAt: Date.now(),
      onboardingComplete: false,
      settings: { showStreak: false },
    });
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const user = await getUserDoc(ctx, userId);
    await ctx.db.patch(user._id, { onboardingComplete: true });
  },
});

export const updateSettings = mutation({
  args: {
    showStreak: v.optional(v.boolean()),
    reminderTime: v.optional(v.string()),
    theme: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const user = await getUserDoc(ctx, userId);
    await ctx.db.patch(user._id, {
      settings: {
        showStreak: args.showStreak ?? user.settings.showStreak,
        reminderTime: args.reminderTime ?? user.settings.reminderTime,
        theme: args.theme ?? user.settings.theme,
      },
    });
  },
});
