import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getUserIdOrNull, requireUserId } from './utils';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    const rows = await ctx.db
      .query('journalEntries')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: { tag: v.string(), title: v.string(), body: v.string() },
  handler: async (ctx, { tag, title, body }) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();
    const id = await ctx.db.insert('journalEntries', { userId, createdAt: now, updatedAt: now, tag, title, body });
    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: { id: v.id('journalEntries'), tag: v.string(), title: v.string(), body: v.string() },
  handler: async (ctx, { id, tag, title, body }) => {
    const userId = await requireUserId(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== userId) return;
    await ctx.db.patch(id, { tag, title, body, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id('journalEntries') },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== userId) return;
    await ctx.db.delete(id);
  },
});
