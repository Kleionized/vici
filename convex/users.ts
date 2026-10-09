import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getUserDoc, getUserIdOrNull, requireUserId } from './utils';

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

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

/**
 * Onboarding is done. `programmeStartedAt` is the phone's local date
 * (`YYYY-MM-DD`) — the server cannot know the user's calendar — and becomes
 * Day 1 of the programme. A start already recorded is never moved: finishing
 * the funnel a second time must not restart the course.
 */
export const completeOnboarding = mutation({
  args: { programmeStartedAt: v.optional(v.string()) },
  handler: async (ctx, { programmeStartedAt }) => {
    const userId = await requireUserId(ctx);
    const user = await getUserDoc(ctx, userId);
    const start = !user.programmeStartedAt && programmeStartedAt && DATE_KEY.test(programmeStartedAt) ? programmeStartedAt : undefined;
    await ctx.db.patch(user._id, { onboardingComplete: true, ...(start ? { programmeStartedAt: start } : {}) });
  },
});

/**
 * What the client may change about its own settings. `premium` is not here
 * (B12): it is the entitlement, and the client cannot be the one to grant it.
 * RevenueCat is the truth on the phone (`usePurchases`), and nothing on the
 * server reads `settings.premium`.
 */
export const updateSettings = mutation({
  args: {
    showStreak: v.optional(v.boolean()),
    reminderTime: v.optional(v.string()),
    theme: v.optional(v.string()),
    yearlyDrop: v.optional(v.boolean()),
    morningCheckin: v.optional(v.boolean()),
    riskTimeSupport: v.optional(v.boolean()),
    eveningWindDown: v.optional(v.boolean()),
    weeklyReflection: v.optional(v.boolean()),
    appLockFaceId: v.optional(v.boolean()),
    appLockOnLeave: v.optional(v.boolean()),
    hideSensitivePreviews: v.optional(v.boolean()),
    pauseAnalytics: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const user = await getUserDoc(ctx, userId);
    await ctx.db.patch(user._id, { settings: { ...user.settings, ...args } });
  },
});

export const updateProfile = mutation({
  args: { displayName: v.string() },
  handler: async (ctx, { displayName }) => {
    const userId = await requireUserId(ctx);
    const user = await getUserDoc(ctx, userId);
    await ctx.db.patch(user._id, { displayName: displayName.trim() || undefined });
  },
});
