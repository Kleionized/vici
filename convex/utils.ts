import type { Doc } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';

/** Authenticate against the Clerk identity; reject unauthenticated calls. */
export async function requireUserId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');
  return identity.subject;
}

/** Fetch the current user's `users` doc, throwing if it doesn't exist yet. */
export async function getUserDoc(ctx: QueryCtx | MutationCtx, userId: string): Promise<Doc<'users'>> {
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', userId))
    .unique();
  if (!user) throw new Error('User not found — call users.ensureUser first');
  return user;
}

/** Like requireUserId but returns null instead of throwing (for soft-fail reads). */
export async function getUserIdOrNull(ctx: QueryCtx | MutationCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}
