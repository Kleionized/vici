/**
 * Shared domain types for Tideline.
 *
 * These mirror the Convex schema in `convex/schema.ts` field-for-field so that
 * the mock backend (`src/lib/backend/mock.ts`) and the real Convex backend are
 * drop-in interchangeable behind the same hook interface. Keep field names in
 * sync with the schema — the human's content tooling targets these names.
 */

export type LessonCategory =
  | 'motivation'
  | 'physiological'
  | 'environmental'
  | 'psychological'
  | 'existential'
  | 'social'
  | 'psychiatric'
  | 'meta';

export const LESSON_CATEGORIES: LessonCategory[] = [
  'motivation',
  'physiological',
  'environmental',
  'psychological',
  'existential',
  'social',
  'psychiatric',
  'meta',
];

export type ReflectionFieldType = 'shortText' | 'longText' | 'scale' | 'choice';

export interface ReflectionField {
  key: string;
  label: string;
  type: ReflectionFieldType;
  /** Present for `choice` fields; also doubles as min/max hint for `scale`. */
  options?: string[];
}

/** A unit of content. Matches the `lessons` table. */
export interface Lesson {
  slug: string;
  title: string;
  week: number;
  dayInWeek: number;
  orderIndex: number;
  category: LessonCategory;
  bodyMarkdown: string;
  reflectionPrompt: string;
  reflectionFields: ReflectionField[];
  approachTags: string[];
  sensitive: boolean;
  estimatedMinutes?: number;
}

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

/** Matches the `lessonProgress` table. */
export interface LessonProgress {
  userId: string;
  lessonSlug: string;
  status: LessonStatus;
  completedAt?: number;
  /** "does this method fit me" signal (1–5) — invariant #4. */
  fitsMeRating?: number;
}

/** Matches the `reflections` table. */
export interface Reflection {
  userId: string;
  lessonSlug: string;
  answers: Record<string, string | number>;
  createdAt: number;
  updatedAt: number;
}

export interface LifeMapValue {
  label: string;
  importance: number;
}

/** Matches the `lifeMap` table (one per user). */
export interface LifeMap {
  userId: string;
  whyStatement?: string;
  values: LifeMapValue[];
  oneYearAnswer?: string;
  updatedAt: number;
}

/**
 * Event types for the neutral log. Note there is intentionally NO `lapse ===
 * failure` framing anywhere — a lapse is one neutral event type among several
 * (invariant #2).
 */
export type EventType =
  | 'urge_rode_out'
  | 'urge_acted_on'
  | 'lapse'
  | 'win'
  | 'check_in';

export const EVENT_TYPES: EventType[] = [
  'urge_rode_out',
  'urge_acted_on',
  'lapse',
  'win',
  'check_in',
];

/** HALT-style preceding state captured with an event. */
export interface PrecedingState {
  mood?: number;
  hungry?: boolean;
  tired?: boolean;
  lonely?: boolean;
  bored?: boolean;
  location?: string;
}

/**
 * Matches the `events` table. Named `TidelineEvent` to avoid clashing with the
 * DOM `Event` global. There is deliberately no `streak` / `daysClean` field.
 */
export interface TidelineEvent {
  _id: string;
  userId: string;
  type: EventType;
  createdAt: number;
  trigger?: string;
  precedingState?: PrecedingState;
  whatHelped?: string;
  /** "what this taught me" — primarily for lapse events. */
  lesson?: string;
  note?: string;
}

export type TidelineEventInput = Omit<TidelineEvent, '_id' | 'userId' | 'createdAt'> & {
  createdAt?: number;
};

/** Matches the `dailyCheckins` table. Leading indicators, not a streak. */
export interface DailyCheckin {
  _id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  sleepHours?: number;
  mood?: number; // 1–5
  movedBody?: boolean;
  socialContact?: boolean;
  structureFollowed?: boolean;
  note?: string;
}

export type DailyCheckinInput = Omit<DailyCheckin, '_id' | 'userId'>;

export interface UserSettings {
  /** Off by default — a streak is opt-in and secondary, never the hero (invariant #1). */
  showStreak: boolean;
  reminderTime?: string;
  theme?: string;
}

/** Matches the `users` table. */
export interface AppUser {
  clerkUserId: string;
  displayName?: string;
  createdAt: number;
  onboardingComplete: boolean;
  settings: UserSettings;
}

/** A single leading-indicator data point for the dashboard trend. */
export interface IndicatorPoint {
  date: string;
  value: number | null;
}

/** Computed dashboard aggregates — leading indicators are the hero, not a counter. */
export interface DashboardData {
  lessonsCompleted: number;
  lessonsTotal: number;
  // Leading-indicator 7-day trends (computed from dailyCheckins)
  sleepTrend: IndicatorPoint[];
  moodTrend: IndicatorPoint[];
  movedBodyDays: number;
  socialContactDays: number;
  structureDays: number;
  checkinDays: number;
  // Values alignment (from reflections + lessons marked as fitting)
  reflectionsCount: number;
  fitsMeCount: number;
  recentEvents: TidelineEvent[];
  /** Only populated when settings.showStreak is true (opt-in secondary stat). */
  optionalDaysSinceLapse: number | null;
}

export const DEFAULT_SETTINGS: UserSettings = {
  showStreak: false,
};
