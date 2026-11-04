import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalMutation, mutation, query } from './_generated/server';
import type { MutationCtx } from './_generated/server';
import { checkText, LIMITS, openUser, sealDisplayName } from './model';
import { findUserDoc, getUserDoc, getUserIdOrNull, requireUserId } from './utils';

/** Soft-fail read used at mount — returns null when signed out. */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return null;
    const user = await findUserDoc(ctx, userId);
    return user ? await openUser(user) : null;
  },
});

/** Idempotent: create the user mirror on first authenticated load. */
export const ensureUser = mutation({
  args: { displayName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    checkText(args.displayName, LIMITS.shortText, 'displayName');
    const existing = await findUserDoc(ctx, userId);
    if (existing) return existing._id;
    return await ctx.db.insert('users', {
      clerkUserId: userId,
      displayName: await sealDisplayName(userId, args.displayName?.trim() || undefined),
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
    if (!user.onboardingComplete) await ctx.db.patch(user._id, { onboardingComplete: true });
  },
});

export const updateSettings = mutation({
  args: {
    showStreak: v.optional(v.boolean()),
    reminderTime: v.optional(v.string()),
    theme: v.optional(v.string()),
    premium: v.optional(v.boolean()),
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
    checkText(args.reminderTime, 16, 'reminderTime');
    checkText(args.theme, 32, 'theme');
    const user = await getUserDoc(ctx, userId);
    const patch = Object.fromEntries(Object.entries(args).filter(([, value]) => value !== undefined));
    await ctx.db.patch(user._id, { settings: { ...user.settings, ...patch } });
  },
});

export const updateProfile = mutation({
  args: { displayName: v.string() },
  handler: async (ctx, { displayName }) => {
    const userId = await requireUserId(ctx);
    checkText(displayName, LIMITS.shortText, 'displayName');
    const user = await getUserDoc(ctx, userId);
    await ctx.db.patch(user._id, { displayName: await sealDisplayName(userId, displayName.trim() || undefined) });
  },
});

// ── deleting an account ──────────────────────────────────────────────

/** Rows deleted per table per transaction, well inside Convex's write limits. */
const DELETE_BATCH = 200;

type UserTable = 'events' | 'dailyCheckins' | 'journalEntries' | 'reflections' | 'lessonProgress' | 'lifeMap';
const USER_TABLES: UserTable[] = ['events', 'dailyCheckins', 'journalEntries', 'reflections', 'lessonProgress', 'lifeMap'];

/** Delete up to one batch of the user's rows; true when nothing is left. */
async function deleteBatch(ctx: MutationCtx, userId: string): Promise<boolean> {
  let budget = DELETE_BATCH;
  for (const table of USER_TABLES) {
    if (budget <= 0) return false;
    const rows = await ctx.db
      .query(table)
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .take(budget);
    for (const row of rows) await ctx.db.delete(row._id);
    budget -= rows.length;
    if (rows.length > 0 && budget <= 0) return false;
  }
  return budget > 0;
}

/**
 * Erase everything the account wrote, then the account row itself. Runs in
 * batches: the first batch is deleted in this transaction and the rest is
 * scheduled, so a years-long log cannot exceed a transaction's limits. The app
 * signs the user out (and deletes the Clerk user) as soon as this returns.
 */
export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const done = await deleteBatch(ctx, userId);
    const user = await findUserDoc(ctx, userId);
    if (done) {
      if (user) await ctx.db.delete(user._id);
    } else {
      // hide the account at once; the scheduled job finishes the rest
      if (user) await ctx.db.patch(user._id, { onboardingComplete: false });
      await ctx.scheduler.runAfter(0, internal.users.continueDelete, { userId });
    }
    return null;
  },
});

export const continueDelete = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const done = await deleteBatch(ctx, userId);
    if (!done) {
      await ctx.scheduler.runAfter(0, internal.users.continueDelete, { userId });
      return null;
    }
    const user = await findUserDoc(ctx, userId);
    if (user) await ctx.db.delete(user._id);
    return null;
  },
});
