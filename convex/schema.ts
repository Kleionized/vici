import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

/**
 * Tideline schema (build spec §4). Field names match `src/lib/types.ts` so the
 * mock layer and this real backend stay drop-in interchangeable.
 *
 * INVARIANT: there is deliberately NO `streak` / `daysClean` field anywhere.
 * Every lapse is just one row in `events`; daily/weekly aggregates are computed
 * from that table, never stored as a resetting counter (invariant #1, #2).
 *
 * `userId` everywhere is the Clerk identity subject string (also stored on
 * `users.clerkUserId`), so no extra join is needed to scope a user's data.
 */

const category = v.union(
  v.literal('motivation'),
  v.literal('physiological'),
  v.literal('environmental'),
  v.literal('psychological'),
  v.literal('existential'),
  v.literal('social'),
  v.literal('psychiatric'),
  v.literal('meta'),
);

const reflectionFieldType = v.union(
  v.literal('shortText'),
  v.literal('longText'),
  v.literal('scale'),
  v.literal('choice'),
);

const lessonStatus = v.union(v.literal('not_started'), v.literal('in_progress'), v.literal('completed'));

export const eventType = v.union(
  v.literal('urge_rode_out'),
  v.literal('urge_acted_on'),
  v.literal('lapse'),
  v.literal('win'),
  v.literal('check_in'),
);

export const reflectionField = v.object({
  key: v.string(),
  label: v.string(),
  type: reflectionFieldType,
  options: v.optional(v.array(v.string())),
});

export const lessonFields = {
  slug: v.string(),
  title: v.string(),
  week: v.number(),
  dayInWeek: v.number(),
  orderIndex: v.number(),
  category: v.optional(category),
  bodyMarkdown: v.string(),
  reflectionPrompt: v.string(),
  reflectionFields: v.array(reflectionField),
  approachTags: v.array(v.string()),
  sensitive: v.boolean(),
  estimatedMinutes: v.optional(v.number()),
};

export const precedingState = v.object({
  mood: v.optional(v.number()),
  hungry: v.optional(v.boolean()),
  tired: v.optional(v.boolean()),
  lonely: v.optional(v.boolean()),
  bored: v.optional(v.boolean()),
  location: v.optional(v.string()),
  /** `SOS Feeling Picker` — the one feeling under the urge. */
  feeling: v.optional(v.string()),
  /** `SOS Reason Picker` — what was feeding it; the board is multi-select. */
  reasons: v.optional(v.array(v.string())),
});

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    displayName: v.optional(v.string()),
    createdAt: v.number(),
    onboardingComplete: v.boolean(),
    settings: v.object({
      showStreak: v.boolean(),
      reminderTime: v.optional(v.string()),
      theme: v.optional(v.string()),
      premium: v.optional(v.boolean()),
      // The yearly-drop enclosure was claimed — the year at the drop's price.
      yearlyDrop: v.optional(v.boolean()),
      morningCheckin: v.optional(v.boolean()),
      riskTimeSupport: v.optional(v.boolean()),
      eveningWindDown: v.optional(v.boolean()),
      weeklyReflection: v.optional(v.boolean()),
      appLockFaceId: v.optional(v.boolean()),
      appLockOnLeave: v.optional(v.boolean()),
      hideSensitivePreviews: v.optional(v.boolean()),
      pauseAnalytics: v.optional(v.boolean()),
      // Retired. `Your Vow Page` lost the white signature card in this drop and
      // types the first name in a script face instead, so nothing draws or
      // stores strokes any more (F16); the pad, the mark and the mutation
      // argument are gone. The field stays declared only because dropping it
      // fails the schema push for any account that already wrote one — it goes
      // in a widen-migrate-narrow pass, not in a UI parity pass.
      signature: v.optional(v.string()),
    }),
  }).index('by_clerkUserId', ['clerkUserId']),

  lessons: defineTable(lessonFields).index('by_slug', ['slug']).index('by_orderIndex', ['orderIndex']),

  lessonProgress: defineTable({
    userId: v.string(),
    lessonSlug: v.string(),
    status: lessonStatus,
    completedAt: v.optional(v.number()),
    fitsMeRating: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_user_lesson', ['userId', 'lessonSlug']),

  reflections: defineTable({
    userId: v.string(),
    lessonSlug: v.string(),
    answers: v.record(v.string(), v.union(v.string(), v.number())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_lesson', ['userId', 'lessonSlug']),

  lifeMap: defineTable({
    userId: v.string(),
    whyStatement: v.optional(v.string()),
    values: v.array(v.object({ label: v.string(), importance: v.number() })),
    oneYearAnswer: v.optional(v.string()),
    updatedAt: v.number(),
  }).index('by_user', ['userId']),

  events: defineTable({
    userId: v.string(),
    type: eventType,
    createdAt: v.number(),
    trigger: v.optional(v.string()),
    precedingState: v.optional(precedingState),
    whatHelped: v.optional(v.string()),
    lesson: v.optional(v.string()),
    note: v.optional(v.string()),
    /** Peak urge severity (1–10) for urge events. */
    severity: v.optional(v.number()),
    /** The second reading, taken after the interrupt (`105 · Reassess`). */
    severityAfter: v.optional(v.number()),
    /** App reopens during the same urge (severe flow's close-your-phone loop). */
    reopens: v.optional(v.number()),
    /** How long the urge lasted, start to resolution — the urge hub reads it. */
    durationSeconds: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_user_createdAt', ['userId', 'createdAt']),

  dailyCheckins: defineTable({
    userId: v.string(),
    date: v.string(),
    sleepHours: v.optional(v.number()),
    mood: v.optional(v.number()),
    energy: v.optional(v.number()),
    emotions: v.optional(v.array(v.string())),
    reasons: v.optional(v.array(v.string())),
    dailyAction: v.optional(v.string()),
    dailyActionDone: v.optional(v.boolean()),
    movedBody: v.optional(v.boolean()),
    socialContact: v.optional(v.boolean()),
    structureFollowed: v.optional(v.boolean()),
    note: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_user_date', ['userId', 'date']),

  journalEntries: defineTable({
    userId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    tag: v.string(),
    title: v.string(),
    body: v.string(),
  })
    .index('by_user', ['userId'])
    .index('by_user_createdAt', ['userId', 'createdAt']),
});
