import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { checkText, LIMITS, openJournal, sealJournal } from './model';
import { getUserIdOrNull, MAX_ROWS, requireUserId } from './utils';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    const rows = await ctx.db
      .query('journalEntries')
      .withIndex('by_user_createdAt', (q) => q.eq('userId', userId))
      .order('desc')
      .take(MAX_ROWS.journal);
    return await Promise.all(rows.map(openJournal));
  },
});

function check(tag: string, title: string, body: string) {
  checkText(tag, LIMITS.tag, 'tag');
  checkText(title, LIMITS.journalTitle, 'title');
  checkText(body, LIMITS.journalBody, 'body');
}

export const create = mutation({
  args: { tag: v.string(), title: v.string(), body: v.string() },
  handler: async (ctx, { tag, title, body }) => {
    const userId = await requireUserId(ctx);
    check(tag, title, body);
    const now = Date.now();
    const id = await ctx.db.insert('journalEntries', { userId, createdAt: now, updatedAt: now, tag, ...(await sealJournal(userId, { title, body })) });
    const row = await ctx.db.get(id);
    return row ? await openJournal(row) : null;
  },
});

export const update = mutation({
  args: { id: v.id('journalEntries'), tag: v.string(), title: v.string(), body: v.string() },
  handler: async (ctx, { id, tag, title, body }) => {
    const userId = await requireUserId(ctx);
    check(tag, title, body);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== userId) return null;
    await ctx.db.patch(id, { tag, ...(await sealJournal(userId, { title, body })), updatedAt: Date.now() });
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id('journalEntries') },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== userId) return null;
    await ctx.db.delete(id);
    return null;
  },
});
