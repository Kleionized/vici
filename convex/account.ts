import { makeFunctionReference } from 'convex/server';
import { v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { internalAction, internalMutation, mutation, query, type MutationCtx, type QueryCtx } from './_generated/server';
import { requireUserId } from './utils';

/**
 * The account's own data, as a whole: export it, or erase it.
 *
 * Every table a user writes to is keyed by the Clerk subject (`userId`, or
 * `clerkUserId` on `users`) and indexed `by_user`; `lessons` is shared course
 * content and belongs to nobody. Erasing runs in batches (a mutation is one
 * transaction with a write limit): the first batch runs in the caller's
 * mutation, and the rest continue on the scheduler, so a long history keeps
 * being erased after the client has deleted its Clerk user and signed out.
 */

/** The tables holding one user's rows, each with a `by_user` index on `userId`. */
const USER_TABLES = ['events', 'dailyCheckins', 'journalEntries', 'lessonProgress', 'reflections', 'lifeMap'] as const;
type UserTable = (typeof USER_TABLES)[number];

/** Rows deleted per transaction. */
const PURGE_BATCH = 250;
/** Rows exported per table; six tables stay well inside a query's read limits. */
const EXPORT_CAP = 2500;
/** When the second RevenueCat sweep runs: well after the client has signed out. */
const REVENUECAT_SECOND_SWEEP_MS = 10 * 60_000;

/**
 * Addressed by name rather than through `internal`: the generated API is only
 * rewritten by `npx convex dev`/`deploy`, and this module is new. The name
 * resolves to the internal mutation below either way.
 */
const purgeBatchRef = makeFunctionReference<'mutation', { userId: string }, null>('account:purgeBatch');
const purgeRevenueCatRef = makeFunctionReference<'action', { userId: string }, null>('account:purgeRevenueCat');

async function idsFor(ctx: MutationCtx, table: UserTable, userId: string, n: number): Promise<Id<UserTable>[]> {
  switch (table) {
    case 'events':
      return (await ctx.db.query('events').withIndex('by_user', (q) => q.eq('userId', userId)).take(n)).map((r) => r._id);
    case 'dailyCheckins':
      return (await ctx.db.query('dailyCheckins').withIndex('by_user', (q) => q.eq('userId', userId)).take(n)).map((r) => r._id);
    case 'journalEntries':
      return (await ctx.db.query('journalEntries').withIndex('by_user', (q) => q.eq('userId', userId)).take(n)).map((r) => r._id);
    case 'lessonProgress':
      return (await ctx.db.query('lessonProgress').withIndex('by_user', (q) => q.eq('userId', userId)).take(n)).map((r) => r._id);
    case 'reflections':
      return (await ctx.db.query('reflections').withIndex('by_user', (q) => q.eq('userId', userId)).take(n)).map((r) => r._id);
    case 'lifeMap':
      return (await ctx.db.query('lifeMap').withIndex('by_user', (q) => q.eq('userId', userId)).take(n)).map((r) => r._id);
  }
}

/** Delete up to one batch of the user's rows; true when rows may remain. */
async function purgeSome(ctx: MutationCtx, userId: string): Promise<boolean> {
  let budget = PURGE_BATCH;
  for (const table of USER_TABLES) {
    while (budget > 0) {
      const ids = await idsFor(ctx, table, userId, budget);
      for (const id of ids) await ctx.db.delete(id);
      budget -= ids.length;
      if (ids.length === 0) break;
    }
    if (budget === 0) return true;
  }
  return false;
}

/**
 * Erase everything the signed-in user has stored: the `users` row now, every
 * other row in batches. Idempotent — calling it again (a retry after the
 * Clerk deletion failed) finds nothing and returns.
 */
export const deleteAccountData = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', userId))
      .unique();
    if (user) await ctx.db.delete('users', user._id);
    if (await purgeSome(ctx, userId)) await ctx.scheduler.runAfter(0, purgeBatchRef, { userId });
    // Two sweeps: one now, and one after the phone has deleted the Clerk user
    // and logged out of RevenueCat, since the SDK can recreate the customer
    // in between (an attribute sync or a customer-info read under this id).
    await ctx.scheduler.runAfter(0, purgeRevenueCatRef, { userId });
    await ctx.scheduler.runAfter(REVENUECAT_SECOND_SWEEP_MS, purgeRevenueCatRef, { userId });
    return null;
  },
});

/** The scheduled continuation of `deleteAccountData`. Server-only. */
export const purgeBatch = internalMutation({
  args: { userId: v.string() },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    if (await purgeSome(ctx, userId)) await ctx.scheduler.runAfter(0, purgeBatchRef, { userId });
    return null;
  },
});

/**
 * RevenueCat holds the customer under the same id (the app `logIn`s the Clerk
 * user id) with the name and email the app sent it. With a secret key on the
 * deployment (`npx convex env set REVENUECAT_SECRET_API_KEY sk_…`) that
 * customer is deleted too; without one this does nothing. Store receipts and
 * an active subscription stay with Apple / Google — the user cancels there.
 */
export const purgeRevenueCat = internalAction({
  args: { userId: v.string() },
  returns: v.null(),
  handler: async (_ctx, { userId }) => {
    const key = process.env.REVENUECAT_SECRET_API_KEY;
    if (!key) return null;
    const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${key}` },
    });
    // 404: RevenueCat never saw this user — nothing to delete.
    if (!res.ok && res.status !== 404) throw new Error(`RevenueCat customer deletion failed (${res.status})`);
    return null;
  },
});

async function rowsFor(ctx: QueryCtx, table: UserTable, userId: string) {
  const n = EXPORT_CAP + 1;
  switch (table) {
    case 'events':
      return await ctx.db.query('events').withIndex('by_user', (q) => q.eq('userId', userId)).take(n);
    case 'dailyCheckins':
      return await ctx.db.query('dailyCheckins').withIndex('by_user', (q) => q.eq('userId', userId)).take(n);
    case 'journalEntries':
      return await ctx.db.query('journalEntries').withIndex('by_user', (q) => q.eq('userId', userId)).take(n);
    case 'lessonProgress':
      return await ctx.db.query('lessonProgress').withIndex('by_user', (q) => q.eq('userId', userId)).take(n);
    case 'reflections':
      return await ctx.db.query('reflections').withIndex('by_user', (q) => q.eq('userId', userId)).take(n);
    case 'lifeMap':
      return await ctx.db.query('lifeMap').withIndex('by_user', (q) => q.eq('userId', userId)).take(n);
  }
}

/**
 * Everything the signed-in user has stored, for "Export my data". Each table
 * is capped at EXPORT_CAP rows (oldest first); a table that ran past it is
 * named in `truncated`, so the file never claims to be whole when it is not.
 */
export const exportData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', userId))
      .unique();
    const truncated: string[] = [];
    const read = async (table: UserTable) => {
      const rows = await rowsFor(ctx, table, userId);
      if (rows.length > EXPORT_CAP) {
        truncated.push(table);
        return rows.slice(0, EXPORT_CAP);
      }
      return rows;
    };
    const events = await read('events');
    const checkins = await read('dailyCheckins');
    const journalEntries = await read('journalEntries');
    const lessonProgress = await read('lessonProgress');
    const reflections = await read('reflections');
    const lifeMap = await read('lifeMap');
    return {
      user,
      events,
      checkins,
      journalEntries,
      lessonProgress,
      reflections,
      lifeMap: lifeMap[0] ?? null,
      truncated,
    };
  },
});
