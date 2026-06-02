import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { upsertLessons } from './lessonUpsert';
import { lessonFields } from './schema';

/**
 * Bulk content import. This is the seam the human uses later to load the real
 * ~94-lesson curriculum: pass an array of objects matching the `lessons` schema
 * and they are upserted by slug. Intentionally generic — no curriculum here.
 *
 * Example (from a script or the dashboard):
 *   await convex.mutation(api.importLessons.importLessons, { lessons: [...] })
 */
export const importLessons = mutation({
  args: { lessons: v.array(v.object(lessonFields)) },
  handler: async (ctx, { lessons }) => {
    const upserted = await upsertLessons(ctx, lessons);
    return { upserted };
  },
});
