/**
 * Convex implementation of the backend hook contract — the real-backend twin of
 * `./mock.ts`. Active when `EXPO_PUBLIC_CONVEX_URL` is set (see `./index.ts`).
 *
 * Uses `makeFunctionReference` (string-addressed) rather than importing the
 * generated `api` object, so the app bundle never depends on `convex/_generated`
 * existing — it builds and runs in mock mode with zero Convex setup. Once the
 * human runs `npx convex dev`, these references resolve to the real functions.
 */

import { useConvex, useMutation, useQuery } from 'convex/react';
import { makeFunctionReference } from 'convex/server';

import type {
  AccountDataExport,
  AppUser,
  DailyCheckin,
  DailyCheckinInput,
  DashboardData,
  JournalEntry,
  JournalEntryInput,
  Lesson,
  LessonProgress,
  LifeMap,
  Reflection,
  TidelineEvent,
  TidelineEventInput,
  UserSettings,
} from '@/lib/types';
import { CURRICULUM_LESSONS } from '@/lib/curriculum';
import { todayKey } from '@/lib/date';
import type { CurrentLesson, LessonDetail } from './mock';

/** The curriculum, in the order it is walked. Sorted once at module load. */
const SORTED_LESSONS: Lesson[] = [...CURRICULUM_LESSONS].sort((a, b) => a.orderIndex - b.orderIndex);

const qref = <T,>(name: string) => makeFunctionReference<'query', Record<string, unknown>, T>(name);
const mref = <T = unknown,>(name: string) => makeFunctionReference<'mutation', Record<string, unknown>, T>(name);

const R = {
  getCurrentUser: qref<AppUser | null>('users:getCurrentUser'),
  ensureUser: mref('users:ensureUser'),
  completeOnboarding: mref('users:completeOnboarding'),
  updateSettings: mref('users:updateSettings'),
  updateProfile: mref('users:updateProfile'),

  journalList: qref<JournalEntry[]>('journal:list'),
  journalCreate: mref<JournalEntry>('journal:create'),
  journalUpdate: mref('journal:update'),
  journalRemove: mref('journal:remove'),

  lessonsProgress: qref<LessonProgress[]>('lessons:progress'),
  startLesson: mref('lessons:startLesson'),
  completeLesson: mref('lessons:completeLesson'),

  reflectionForLesson: qref<Reflection | null>('reflections:getForLesson'),
  saveReflection: mref('reflections:save'),

  lifeMapGet: qref<LifeMap | null>('lifemap:get'),
  lifeMapUpdate: mref('lifemap:update'),

  eventsList: qref<TidelineEvent[]>('events:list'),
  eventsCreate: mref('events:create'),

  checkinsList: qref<DailyCheckin[]>('checkins:list'),
  checkinForDate: qref<DailyCheckin | null>('checkins:getForDate'),
  checkinUpsert: mref('checkins:upsert'),

  dashboardGet: qref<DashboardData | null>('dashboard:get'),

  exportData: qref<AccountDataExport>('account:exportData'),
  deleteAccountData: mref<null>('account:deleteAccountData'),
};

const orUndef = <T,>(v: T | null | undefined): T | undefined => (v == null ? undefined : v);

// ---------- queries ----------

export function useCurrentUser(): AppUser | undefined {
  return orUndef(useQuery(R.getCurrentUser, {}));
}

/**
 * Lesson *content* is compiled into the app (`src/content/curriculum84.ts`)
 * and is the same for everyone, so it is read from the bundle rather than the
 * database — which otherwise has to hold a second copy of it, and answers
 * "lesson not found" for every slug it has not been seeded with. Convex owns
 * what is actually per-user: progress and reflections.
 */
export function useLessons(): Lesson[] | undefined {
  return SORTED_LESSONS;
}

export function useLessonProgressMap(): Record<string, LessonProgress> | undefined {
  const rows = useQuery(R.lessonsProgress, {});
  if (rows === undefined) return undefined;
  return Object.fromEntries(rows.map((p) => [p.lessonSlug, p]));
}

export function useLessonDetail(slug: string): LessonDetail | undefined | null {
  const progress = useLessonProgressMap();
  const reflection = useQuery(R.reflectionForLesson, { slug });
  const lesson = SORTED_LESSONS.find((l) => l.slug === slug);
  if (!lesson) return null;
  if (progress === undefined || reflection === undefined) return undefined;
  return { lesson, progress: progress[slug] ?? null, reflection: reflection ?? null };
}

export function useCurrentLesson(): CurrentLesson | null | undefined {
  const progress = useLessonProgressMap();
  if (progress === undefined) return undefined;
  const index = Math.max(
    0,
    (() => {
      const first = SORTED_LESSONS.findIndex((l) => progress[l.slug]?.status !== 'completed');
      return first === -1 ? SORTED_LESSONS.length - 1 : first;
    })(),
  );
  const lesson = SORTED_LESSONS[index];
  if (!lesson) return null;
  return { lesson, progress: progress[lesson.slug] ?? null, index, total: SORTED_LESSONS.length };
}

/**
 * "Loaded, none" is an empty map, as the mock always holds one — `lifemap:get`
 * answers null for an account that never wrote a row, and turning that into
 * `undefined` left Life Map on its loading screen for good (D4).
 */
const EMPTY_LIFE_MAP: LifeMap = { userId: '', values: [], updatedAt: 0 };

export function useLifeMap(): LifeMap | undefined {
  const row = useQuery(R.lifeMapGet, {});
  if (row === undefined) return undefined;
  return row ?? EMPTY_LIFE_MAP;
}

export function useEvents(): TidelineEvent[] | undefined {
  return useQuery(R.eventsList, {});
}

export function useCheckins(): DailyCheckin[] | undefined {
  return useQuery(R.checkinsList, {});
}

export function useTodayCheckin(): DailyCheckin | null | undefined {
  return useQuery(R.checkinForDate, { date: todayKey() });
}

export function useDashboard(): DashboardData | undefined {
  return orUndef(useQuery(R.dashboardGet, {}));
}

export function useJournalEntries(): JournalEntry[] | undefined {
  return useQuery(R.journalList, {});
}

// ---------- mutations ----------

export function useUpdateProfile() {
  const fn = useMutation(R.updateProfile);
  return (displayName: string) => fn({ displayName });
}

export function useCreateJournalEntry() {
  const fn = useMutation(R.journalCreate);
  return (input: JournalEntryInput) => fn({ ...input }) as Promise<JournalEntry>;
}

export function useUpdateJournalEntry() {
  const fn = useMutation(R.journalUpdate);
  return (id: string, input: JournalEntryInput) => fn({ id, ...input });
}

export function useDeleteJournalEntry() {
  const fn = useMutation(R.journalRemove);
  return (id: string) => fn({ id });
}

/** Called by the Convex bootstrap to mirror the Clerk user into Convex. */
export function useEnsureUser() {
  const fn = useMutation(R.ensureUser);
  return (displayName?: string) => fn({ displayName });
}

/** `programmeStartedAt`: the phone's local date onboarding finished on — Day 1 (`src/lib/day.ts`). */
export function useCompleteOnboarding() {
  const fn = useMutation(R.completeOnboarding);
  return (opts?: { programmeStartedAt?: string }) => fn({ programmeStartedAt: opts?.programmeStartedAt });
}

/**
 * `premium` is the entitlement and the server no longer takes it from the
 * client (B12), so it is never sent: a caller that still passes it is a no-op
 * here rather than a rejected mutation, and the store stays the truth
 * (`usePurchases`). Only the offline mock keeps it, for its stand-in purchase.
 */
export function useUpdateSettings() {
  const fn = useMutation(R.updateSettings);
  return (partial: Partial<UserSettings>) => {
    const { premium: _premium, ...rest } = partial;
    return fn({ ...rest });
  };
}

export function useStartLesson() {
  const fn = useMutation(R.startLesson);
  return (slug: string) => fn({ slug });
}

export function useCompleteLesson() {
  const fn = useMutation(R.completeLesson);
  return (slug: string, fitsMeRating?: number) => fn({ slug, fitsMeRating });
}

export function useSaveReflection() {
  const fn = useMutation(R.saveReflection);
  return (slug: string, answers: Record<string, string | number>) => fn({ slug, answers });
}

export function useUpdateLifeMap() {
  const fn = useMutation(R.lifeMapUpdate);
  return (partial: Partial<Omit<LifeMap, 'userId' | 'updatedAt'>>) => fn({ ...partial });
}

export function useCreateEvent() {
  const fn = useMutation(R.eventsCreate);
  return (input: TidelineEventInput) => fn({ ...input });
}

export function useUpsertCheckin() {
  const fn = useMutation(R.checkinUpsert);
  return (input: DailyCheckinInput) => fn({ ...input });
}

// ---------- the account as a whole ----------

/** "Export my data": a one-off read (not a subscription) of everything the account stores. */
export function useExportData() {
  const client = useConvex();
  return () => client.query(R.exportData, {});
}

/**
 * Account deletion, first half: erase every row the account stored (the
 * server finishes long histories on its scheduler). The Clerk user goes next
 * (`useAuth().deleteAccount`), while this session can still call Convex.
 */
export function useDeleteAccountData() {
  const fn = useMutation(R.deleteAccountData);
  return () => fn({});
}
