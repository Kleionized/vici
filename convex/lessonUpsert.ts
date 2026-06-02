import type { Doc } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';

export type LessonInput = Omit<Doc<'lessons'>, '_id' | '_creationTime'>;

/** Idempotent bulk upsert by slug. Shared by `seed` and `importLessons`. */
export async function upsertLessons(ctx: MutationCtx, lessons: LessonInput[]): Promise<number> {
  let count = 0;
  for (const lesson of lessons) {
    const existing = await ctx.db
      .query('lessons')
      .withIndex('by_slug', (q) => q.eq('slug', lesson.slug))
      .unique();
    if (existing) await ctx.db.patch(existing._id, lesson);
    else await ctx.db.insert('lessons', lesson);
    count += 1;
  }
  return count;
}
