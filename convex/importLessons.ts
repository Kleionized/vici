import { v } from 'convex/values';

import { internalMutation } from './_generated/server';
import { upsertLessons } from './lessonUpsert';
import { lessonFields } from './schema';

/**
 * Bulk content import. This is the seam the human uses later to load the real
 * ~94-lesson curriculum: pass an array of objects matching the `lessons` schema
 * and they are upserted by slug. Intentionally generic — no curriculum here.
 *
 * Example (from a script or the dashboard):
 *   npx convex run importLessons:importLessons '{"lessons": [...]}'
 */
/**
 * Internal: run it from the dashboard or `npx convex run importLessons:importLessons`.
 * It used to be a public mutation with no auth check, so anyone holding the
 * deployment URL could overwrite the curriculum.
 */
export const importLessons = internalMutation({
  args: { lessons: v.array(v.object(lessonFields)) },
  handler: async (ctx, { lessons }) => {
    const upserted = await upsertLessons(ctx, lessons);
    return { upserted };
  },
});
