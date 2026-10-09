import { v } from 'convex/values';

import { internalMutation } from './_generated/server';
import { upsertLessons } from './lessonUpsert';
import { lessonFields } from './schema';

/**
 * Bulk content import. This is the seam the human uses later to load the real
 * ~94-lesson curriculum: pass an array of objects matching the `lessons` schema
 * and they are upserted by slug. Intentionally generic — no curriculum here.
 *
 * Internal (B12, D459): it is not part of the public API, so no client
 * holding the deployment URL can overwrite the lessons table. Run it from the
 * dashboard (Functions → importLessons:importLessons → Run) or the CLI:
 *   npx convex run importLessons:importLessons '{ "lessons": [ ... ] }'
 * (add `--prod` for the production deployment).
 */
export const importLessons = internalMutation({
  args: { lessons: v.array(v.object(lessonFields)) },
  handler: async (ctx, { lessons }) => {
    const upserted = await upsertLessons(ctx, lessons);
    return { upserted };
  },
});
