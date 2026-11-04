import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { checkMoment, checkRange, checkText, checkList, LIMITS, openEvent, sealEventText } from './model';
import { eventType, precedingState } from './schema';
import { findUserDoc, getUserIdOrNull, MAX_ROWS, requireUserId } from './utils';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    const rows = await ctx.db
      .query('events')
      .withIndex('by_user_createdAt', (q) => q.eq('userId', userId))
      .order('desc')
      .take(MAX_ROWS.events);
    return await Promise.all(rows.map(openEvent));
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
    checkText(args.trigger, LIMITS.note, 'trigger');
    checkText(args.whatHelped, LIMITS.note, 'whatHelped');
    checkText(args.lesson, LIMITS.note, 'lesson');
    checkText(args.note, LIMITS.note, 'note');
    checkText(args.precedingState?.location, LIMITS.shortText, 'location');
    checkText(args.precedingState?.feeling, LIMITS.shortText, 'feeling');
    checkList(args.precedingState?.reasons, 'reasons');
    checkRange(args.precedingState?.mood, 1, 10, 'mood');
    checkRange(args.severity, 0, 10, 'severity');
    checkRange(args.severityAfter, 0, 10, 'severityAfter');
    checkRange(args.durationSeconds, 0, 7 * 86_400, 'durationSeconds');
    checkRange(args.reopens, 0, 10_000, 'reopens', true);
    const user = await findUserDoc(ctx, userId);
    checkMoment(args.createdAt, user?.createdAt);

    const text = await sealEventText(userId, args);
    const id = await ctx.db.insert('events', {
      userId,
      type: args.type,
      createdAt: args.createdAt ?? Date.now(),
      ...text,
      severity: args.severity,
      severityAfter: args.severityAfter,
      durationSeconds: args.durationSeconds,
      reopens: args.reopens,
    });
    return id;
  },
});

/** Remove one of your own log entries (a mis-tapped slip, a duplicate). */
export const remove = mutation({
  args: { id: v.id('events') },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== userId) return null;
    await ctx.db.delete(id);
    return null;
  },
});
