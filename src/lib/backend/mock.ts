/**
 * Mock implementation of the backend hook contract (see `./index.ts`). Reads
 * from the in-memory/AsyncStorage-backed store and shapes data exactly like the
 * Convex hooks will, so screens are backend-agnostic.
 *
 * Convention: query hooks return `undefined` while loading (mirrors Convex
 * `useQuery`), then the value (which may be `null` for "loaded, none").
 */

import { computeDashboard } from '@/lib/dashboard';
import { todayKey } from '@/lib/date';
import { useMockStore } from './mockStore';
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
  Reflection,
  TidelineEvent,
  TidelineEventInput,
  UserSettings,
} from '@/lib/types';

export interface LessonDetail {
  lesson: Lesson;
  progress: LessonProgress | null;
  reflection: Reflection | null;
}

export interface CurrentLesson {
  lesson: Lesson;
  progress: LessonProgress | null;
  index: number;
  total: number;
}

// ---------- queries ----------

export function useCurrentUser(): AppUser | undefined {
  const { hydrated, data } = useMockStore();
  if (!hydrated) return undefined;
  return data?.user;
}

export function useLessons(): Lesson[] | undefined {
  const { lessons } = useMockStore();
  return [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);
}

export function useLessonProgressMap(): Record<string, LessonProgress> | undefined {
  const { hydrated, data } = useMockStore();
  if (!hydrated) return undefined;
  return data?.progress ?? {};
}

export function useLessonDetail(slug: string): LessonDetail | undefined | null {
  const { hydrated, data, lessons } = useMockStore();
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) return null;
  if (!hydrated) return undefined;
  return {
    lesson,
    progress: data?.progress[slug] ?? null,
    reflection: data?.reflections[slug] ?? null,
  };
}

export function useCurrentLesson(): CurrentLesson | null | undefined {
  const { hydrated, data, lessons } = useMockStore();
  if (!hydrated || !data) return hydrated ? null : undefined;
  const sorted = [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);
  const idx = sorted.findIndex((l) => data.progress[l.slug]?.status !== 'completed');
  const resolvedIdx = idx === -1 ? sorted.length - 1 : idx;
  const lesson = sorted[resolvedIdx];
  if (!lesson) return null;
  return { lesson, progress: data.progress[lesson.slug] ?? null, index: resolvedIdx, total: sorted.length };
}

export function useLifeMap(): LifeMap | undefined {
  const { hydrated, data } = useMockStore();
  if (!hydrated) return undefined;
  return data?.lifeMap;
}

export function useEvents(): TidelineEvent[] | undefined {
  const { hydrated, data } = useMockStore();
  if (!hydrated) return undefined;
  return [...(data?.events ?? [])].sort((a, b) => b.createdAt - a.createdAt);
}

export function useCheckins(): DailyCheckin[] | undefined {
  const { hydrated, data } = useMockStore();
  if (!hydrated) return undefined;
  return Object.values(data?.checkins ?? {}).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function useTodayCheckin(): DailyCheckin | null | undefined {
  const { hydrated, data } = useMockStore();
  if (!hydrated) return undefined;
  return data?.checkins[todayKey()] ?? null;
}

export function useDashboard(): DashboardData | undefined {
  const { hydrated, data, lessons } = useMockStore();
  if (!hydrated || !data) return undefined;
  return computeDashboard({
    lessons,
    progress: Object.values(data.progress),
    reflections: Object.values(data.reflections),
    events: data.events,
    checkins: Object.values(data.checkins),
    userCreatedAt: data.user.createdAt,
    showStreak: data.user.settings.showStreak,
  });
}

export function useJournalEntries(): JournalEntry[] | undefined {
  const { hydrated, data } = useMockStore();
  if (!hydrated) return undefined;
  return [...(data?.journalEntries ?? [])].sort((a, b) => b.createdAt - a.createdAt);
}

// ---------- mutations ----------

export function useCompleteOnboarding() {
  return useMockStore().completeOnboarding;
}

export function useUpdateProfile() {
  const { updateProfile } = useMockStore();
  return (displayName: string) => updateProfile(displayName);
}

export function useCreateJournalEntry() {
  const { createJournalEntry } = useMockStore();
  return (input: JournalEntryInput) => createJournalEntry(input);
}

export function useUpdateJournalEntry() {
  const { updateJournalEntry } = useMockStore();
  return (id: string, input: JournalEntryInput) => updateJournalEntry(id, input);
}

export function useDeleteJournalEntry() {
  const { deleteJournalEntry } = useMockStore();
  return (id: string) => deleteJournalEntry(id);
}

export function useUpdateSettings() {
  const { updateSettings } = useMockStore();
  return (partial: Partial<UserSettings>) => updateSettings(partial);
}

export function useStartLesson() {
  const { startLesson } = useMockStore();
  return (slug: string) => startLesson(slug);
}

export function useCompleteLesson() {
  const { completeLesson } = useMockStore();
  return (slug: string, fitsMeRating?: number) => completeLesson(slug, fitsMeRating);
}

export function useSaveReflection() {
  const { saveReflection } = useMockStore();
  return (slug: string, answers: Record<string, string | number>) => saveReflection(slug, answers);
}

export function useUpdateLifeMap() {
  const { updateLifeMap } = useMockStore();
  return (partial: Partial<Omit<LifeMap, 'userId' | 'updatedAt'>>) => updateLifeMap(partial);
}

export function useCreateEvent() {
  const { createEvent } = useMockStore();
  return (input: TidelineEventInput) => createEvent(input);
}

export function useUpsertCheckin() {
  const { upsertCheckin } = useMockStore();
  return (input: DailyCheckinInput) => upsertCheckin(input);
}
