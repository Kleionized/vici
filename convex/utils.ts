import type { Doc } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';

/**
 * How many rows a list query hands back at most. The app computes its score
 * and its charts from the whole log, so these are generous — years of daily
 * use — but bounded, so no single account can make a query unbounded.
 */
export const MAX_ROWS = {
  events: 5_000,
  checkins: 2_000,
  journal: 3_000,
  progress: 500,
  reflections: 500,
} as const;

/** Authenticate against the Clerk identity; reject unauthenticated calls. */
export async function requireUserId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');
  // Rows are keyed by the Clerk subject. There is exactly one identity provider
  // (convex/auth.config.ts), so the subject is unique within it.
  return identity.subject;
}

/** Fetch the current user's `users` doc, throwing if it doesn't exist yet. */
export async function getUserDoc(ctx: QueryCtx | MutationCtx, userId: string): Promise<Doc<'users'>> {
  const user = await findUserDoc(ctx, userId);
  if (!user) throw new Error('User not found — call users.ensureUser first');
  return user;
}

export async function findUserDoc(ctx: QueryCtx | MutationCtx, userId: string): Promise<Doc<'users'> | null> {
  return await ctx.db
    .query('users')
    .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', userId))
    .unique();
}

/** Like requireUserId but returns null instead of throwing (for soft-fail reads). */
export async function getUserIdOrNull(ctx: QueryCtx | MutationCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}
