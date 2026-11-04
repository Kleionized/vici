import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalMutation } from './_generated/server';
import { encryptionEnabled, isSealed } from './crypto';
import { sealCheckinText, sealDisplayName, sealEventText, sealJournal, sealLifeMapText, sealReflection } from './model';

/**
 * Seal rows written before `DATA_ENCRYPTION_KEY` was set. Idempotent and
 * resumable: it walks one table at a time in pages, seals whatever is still
 * plaintext, and schedules itself for the next page. Run once after setting the
 * key:
 *
 *   npx convex run migrations:encryptExisting '{}'
 */

const TABLES = ['users', 'journalEntries', 'events', 'dailyCheckins', 'reflections', 'lifeMap'] as const;
type Table = (typeof TABLES)[number];
const PAGE = 100;

const anyPlain = (values: (string | undefined)[]) => values.some((value) => value !== undefined && value !== '' && !isSealed(value));

export const encryptExisting = internalMutation({
  args: { table: v.optional(v.string()), cursor: v.optional(v.union(v.string(), v.null())) },
  handler: async (ctx, args) => {
    if (!(await encryptionEnabled())) throw new Error('Set DATA_ENCRYPTION_KEY first');
    const table = (args.table ?? TABLES[0]) as Table;
    if (!TABLES.includes(table)) throw new Error(`Unknown table ${table}`);

    const page = await ctx.db.query(table).paginate({ numItems: PAGE, cursor: args.cursor ?? null });
    let sealed = 0;
    for (const row of page.page) {
      switch (table) {
        case 'users': {
          const r = row as typeof row & { clerkUserId: string; displayName?: string };
          if (anyPlain([r.displayName])) {
            await ctx.db.patch(r._id as never, { displayName: await sealDisplayName(r.clerkUserId, r.displayName) } as never);
            sealed++;
          }
          break;
        }
        case 'journalEntries': {
          const r = row as never as { _id: never; userId: string; title: string; body: string };
          if (anyPlain([r.title, r.body])) {
            await ctx.db.patch(r._id, (await sealJournal(r.userId, r)) as never);
            sealed++;
          }
          break;
        }
        case 'events': {
          const r = row as never as { _id: never; userId: string; trigger?: string; whatHelped?: string; lesson?: string; note?: string; precedingState?: { location?: string; feeling?: string; reasons?: string[] } };
          const ps = r.precedingState;
          if (anyPlain([r.trigger, r.whatHelped, r.lesson, r.note, ps?.location, ps?.feeling, ...(ps?.reasons ?? [])])) {
            await ctx.db.patch(r._id, (await sealEventText(r.userId, r)) as never);
            sealed++;
          }
          break;
        }
        case 'dailyCheckins': {
          const r = row as never as { _id: never; userId: string; note?: string; dailyAction?: string; emotions?: string[]; reasons?: string[] };
          if (anyPlain([r.note, r.dailyAction, ...(r.emotions ?? []), ...(r.reasons ?? [])])) {
            await ctx.db.patch(r._id, (await sealCheckinText(r.userId, r)) as never);
            sealed++;
          }
          break;
        }
        case 'reflections': {
          const r = row as never as { _id: never; userId: string; answers: Record<string, string | number> };
          if (anyPlain(Object.values(r.answers).filter((x): x is string => typeof x === 'string'))) {
            await ctx.db.patch(r._id, { answers: await sealReflection(r.userId, r.answers) } as never);
            sealed++;
          }
          break;
        }
        case 'lifeMap': {
          const r = row as never as { _id: never; userId: string; whyStatement?: string; oneYearAnswer?: string; values: { label: string; importance: number }[] };
          if (anyPlain([r.whyStatement, r.oneYearAnswer, ...r.values.map((x) => x.label)])) {
            const s = await sealLifeMapText(r.userId, r);
            await ctx.db.patch(r._id, { whyStatement: s.whyStatement, oneYearAnswer: s.oneYearAnswer, values: s.values ?? r.values } as never);
            sealed++;
          }
          break;
        }
      }
    }

    if (!page.isDone) {
      await ctx.scheduler.runAfter(0, internal.migrations.encryptExisting, { table, cursor: page.continueCursor });
    } else {
      const next = TABLES[TABLES.indexOf(table) + 1];
      if (next) await ctx.scheduler.runAfter(0, internal.migrations.encryptExisting, { table: next, cursor: null });
    }
    return { table, sealed, done: page.isDone };
  },
});
