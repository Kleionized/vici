import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { eventType, precedingState } from './schema';
import { getUserIdOrNull, requireUserId } from './utils';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    return await ctx.db
      .query('events')
      .withIndex('by_user_createdAt', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

export const create = mutation({
  args: {
    type: eventType,
    trigger: v.optional(v.string()),
    precedingState: v.optional(precedingState),
    whatHelped: v.optional(v.string()),
    lesson: v.optional(v.string()),
    note: v.optional(v.string()),
    severity: v.optional(v.number()),
    severityAfter: v.optional(v.number()),
    // How long the urge ran, written by the SOS interrupt on resolve. An arg the
    // schema accepts but the validator here does not is a rejected call, and the
    // call site swallows the rejection — so a missing line means the event is
    // never written at all.
    durationSeconds: v.optional(v.number()),
    reopens: v.optional(v.number()),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await ctx.db.insert('events', {
      userId,
      type: args.type,
      createdAt: args.createdAt ?? Date.now(),
      trigger: args.trigger,
      precedingState: args.precedingState,
      whatHelped: args.whatHelped,
      lesson: args.lesson,
      note: args.note,
      severity: args.severity,
      severityAfter: args.severityAfter,
      durationSeconds: args.durationSeconds,
      reopens: args.reopens,
    });
  },
});
