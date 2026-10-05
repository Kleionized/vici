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
  /** The seeded rows carry one; the twelve-week curriculum states none. */
  category?: LessonCategory;
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
  /** `SOS Feeling Picker` — the one feeling under the urge. */
  feeling?: string;
  /** `SOS Reason Picker` — what was feeding it; the board is multi-select. */
  reasons?: string[];
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
  /** Peak urge severity (1–10) for urge events. */
  severity?: number;
  /**
   * The second reading, taken after the interrupt — `105 · Where is the urge
   * now?` asks for it, and the pair is what makes an urge's arc legible.
   */
  severityAfter?: number;
  /** How many times the app was reopened during the same urge (severe flow). */
  reopens?: number;
  /**
   * How long the urge lasted, start to resolution. The urge hub's own panes —
   * `85C · Your proof` and `85D · Surfed before` — are read out in minutes, and
   * nothing else in the log records a length.
   */
  durationSeconds?: number;
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
  mood?: number; // 1–5 (pleasantness)
  /** 1–5, as the morning check-in logs it. */
  energy?: number;
  /** Apple-style mood logging: the feeling words + what's driving them. */
  emotions?: string[];
  reasons?: string[];
  /**
   * The one thing set for the day — the night check-in names it, Today carries
   * it on the task card, and the next morning's check-in asks whether it
   * happened. Stored on the day it is *for*, not the day it was named.
   */
  dailyAction?: string;
  dailyActionDone?: boolean;
  movedBody?: boolean;
  socialContact?: boolean;
  structureFollowed?: boolean;
  note?: string;
}

export type DailyCheckinInput = Omit<DailyCheckin, '_id' | 'userId'>;

/** A free-form journal entry. Matches the `journalEntries` table. */
export interface JournalEntry {
  _id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  /** Reflection | Urge | Lesson — a light category, not the structured Log. */
  tag: string;
  title: string;
  body: string;
}

export type JournalEntryInput = { tag: string; title: string; body: string };

export interface UserSettings {
  /** Off by default — a streak is opt-in and secondary, never the hero (invariant #1). */
  showStreak: boolean;
  reminderTime?: string;
  theme?: string;
  /**
   * Mirror of the `vici_unlimited` entitlement, written down from RevenueCat.
   * Treat it as a cache — `usePremium()` in `@/lib/purchases` is the truth.
   */
  premium?: boolean;
  /** The yearly-drop enclosure was claimed — $26.99/yr. */
  yearlyDrop?: boolean;
  // Notification preferences (reminders screen)
  morningCheckin?: boolean;
  riskTimeSupport?: boolean;
  eveningWindDown?: boolean;
  weeklyReflection?: boolean;
  // App-lock & privacy preferences
  appLockFaceId?: boolean;
  appLockOnLeave?: boolean;
  hideSensitivePreviews?: boolean;
  pauseAnalytics?: boolean;
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

// ── the interactive curriculum (generated from src/content/interactive) ──
// Every lesson runs the same shape: teach pages, a multi-select "ask", a
// multi-select grid, a branch page whose copy answers what was picked, a
// single-select, and a collect page that writes the takeaway in your words.

/**
 * A pull-quote, shown on a page of its own straight after the teach page that
 * carries it (canvas: Lesson Quote Lao Tzu · Seneca · Marcus).
 */
export interface ILessonQuote {
  text: string;
  /** Who said it — set in caps between two short rules. */
  who: string;
}

export interface ITeachPage {
  kind: 'teach';
  headline: string;
  body: string;
  /**
   * Set only where the copy is a genuine enumeration. Most teach pages are
   * prose and must stay prose — bullets imposed on an argument break it into
   * fragments that read as unrelated.
   */
  list?: { ordered: boolean; items: string[]; note?: string };
  /**
   * A quote page follows this one where one is authored. It hangs off the teach
   * page rather than being an eighth `IPage` kind so that adding one cannot
   * break any `page.kind` switch already written against the union.
   */
  quote?: ILessonQuote;
  cta: string;
}

export interface ICheckOption {
  key: string;
  label: string;
  /** The "as in…" line under the label. */
  asIn: string;
  /** The short name this option goes by in the collected summary. */
  short: string;
}

export interface IAskPage {
  kind: 'ask';
  headline: string;
  /** The line that takes the pressure off — "No wrong answer." */
  helper?: string;
  checks: ICheckOption[];
}

export interface IGridPage {
  kind: 'grid';
  key: string;
  headline: string;
  helper: string;
  options: string[];
  cta: string;
}

/** Copy chosen by what the reader selected on the ask and grid pages. */
export interface IBranchPage {
  kind: 'branch';
  title: string;
  fromChecks: { key: string; headline: string; body: string }[];
  fromGrid: { options: string[]; body: string }[];
}

export interface IPickPage {
  kind: 'pick';
  key: string;
  headline: string;
  helper: string;
  options: string[];
  /** Template for the chosen answer, e.g. "Starting on: {pick}". */
  result: string;
}

export interface ICollectPage {
  kind: 'collect';
  title: string;
  /** Template using {pick}, {checks} and {grid}. */
  template: string;
  /** Used when nothing was selected. */
  fallback: string;
  source: 'checks' | 'grid';
  label: string;
  cta: string;
}

export type IPage = ITeachPage | IAskPage | IGridPage | IBranchPage | IPickPage | ICollectPage;

export interface InteractiveLesson {
  slug: string;
  /** Lesson number across the whole curriculum (1–110). */
  number: number;
  heading: string;
  /** The short title shown on cards and the cover. */
  title: string;
  tag: string;
  tagColor: string;
  /** The subsection code this lesson sits under, e.g. "I.C". */
  sub: string;
  week: number;
  day: number;
  order: number;
  pages: IPage[];
  sources: string;
  action: string;
  reflection: string;
}

export interface InteractiveSub {
  code: string;
  title: string;
  description: string;
  lessons: InteractiveLesson[];
}

export interface InteractiveWeek {
  n: number;
  /** e.g. "Part II · Fewer moments of choice". */
  title: string;
  /** e.g. "Ground III · Deep Waters". */
  ground: string;
  description: string;
  subs: InteractiveSub[];
}
