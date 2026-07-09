/**
 * Convex implementation of the backend hook contract — the real-backend twin of
 * `./mock.ts`. Active when `EXPO_PUBLIC_CONVEX_URL` is set (see `./index.ts`).
 *
 * Uses `makeFunctionReference` (string-addressed) rather than importing the
 * generated `api` object, so the app bundle never depends on `convex/_generated`
 * existing — it builds and runs in mock mode with zero Convex setup. Once the
 * human runs `npx convex dev`, these references resolve to the real functions.
 */

import { useMutation, useQuery } from 'convex/react';
import { makeFunctionReference } from 'convex/server';

import type {
  AppUser,
  DailyCheckin,
  DailyCheckinInput,
  DashboardData,
  JournalEntry,
  JournalEntryInput,
  Lesson,
  LessonProgress,
  LifeMap,
  TidelineEvent,
  TidelineEventInput,
  UserSettings,
} from '@/lib/types';
import { todayKey } from '@/lib/date';
import type { CurrentLesson, LessonDetail } from './mock';

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

  lessonsList: qref<Lesson[]>('lessons:list'),
  lessonsProgress: qref<LessonProgress[]>('lessons:progress'),
  lessonDetail: qref<LessonDetail | null>('lessons:getDetail'),
  lessonCurrent: qref<CurrentLesson | null>('lessons:current'),
  startLesson: mref('lessons:startLesson'),
  completeLesson: mref('lessons:completeLesson'),

  saveReflection: mref('reflections:save'),

  lifeMapGet: qref<LifeMap | null>('lifemap:get'),
  lifeMapUpdate: mref('lifemap:update'),

  eventsList: qref<TidelineEvent[]>('events:list'),
  eventsCreate: mref('events:create'),

  checkinsList: qref<DailyCheckin[]>('checkins:list'),
  checkinForDate: qref<DailyCheckin | null>('checkins:getForDate'),
  checkinUpsert: mref('checkins:upsert'),

  dashboardGet: qref<DashboardData | null>('dashboard:get'),
};

const orUndef = <T,>(v: T | null | undefined): T | undefined => (v == null ? undefined : v);

// ---------- queries ----------

export function useCurrentUser(): AppUser | undefined {
  return orUndef(useQuery(R.getCurrentUser, {}));
}

export function useLessons(): Lesson[] | undefined {
  return useQuery(R.lessonsList, {});
}

export function useLessonProgressMap(): Record<string, LessonProgress> | undefined {
  const rows = useQuery(R.lessonsProgress, {});
  if (rows === undefined) return undefined;
  return Object.fromEntries(rows.map((p) => [p.lessonSlug, p]));
}

export function useLessonDetail(slug: string): LessonDetail | undefined | null {
  return useQuery(R.lessonDetail, { slug });
}

export function useCurrentLesson(): CurrentLesson | null | undefined {
  return useQuery(R.lessonCurrent, {});
}

export function useLifeMap(): LifeMap | undefined {
  return orUndef(useQuery(R.lifeMapGet, {}));
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

export function useCompleteOnboarding() {
  const fn = useMutation(R.completeOnboarding);
  return () => fn({});
}

export function useUpdateSettings() {
  const fn = useMutation(R.updateSettings);
  return (partial: Partial<UserSettings>) => fn({ ...partial });
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
