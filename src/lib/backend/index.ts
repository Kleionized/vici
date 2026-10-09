/**
 * Backend facade. Screens import every data hook from `@/lib/backend` and stay
 * completely agnostic about whether the data is local-mock or Convex.
 *
 * The implementation is chosen once at module load from BACKEND_MODE (which
 * never changes at runtime), so the rules of hooks hold. Both modules implement
 * the same contract; convex's mutation hooks return Promise<unknown> vs the
 * mock's Promise<void>, so we assert structural parity here.
 */

import { BACKEND_MODE } from '@/lib/config';
import * as convex from './convex';
import * as mock from './mock';

const impl: typeof mock = BACKEND_MODE === 'convex' ? (convex as unknown as typeof mock) : mock;

export const useCurrentUser = impl.useCurrentUser;
export const useLessons = impl.useLessons;
export const useLessonProgressMap = impl.useLessonProgressMap;
export const useLessonDetail = impl.useLessonDetail;
export const useCurrentLesson = impl.useCurrentLesson;
export const useLifeMap = impl.useLifeMap;
export const useEvents = impl.useEvents;
export const useCheckins = impl.useCheckins;
export const useTodayCheckin = impl.useTodayCheckin;
export const useDashboard = impl.useDashboard;
export const useJournalEntries = impl.useJournalEntries;

export const useCompleteOnboarding = impl.useCompleteOnboarding;
export const useUpdateProfile = impl.useUpdateProfile;
export const useCreateJournalEntry = impl.useCreateJournalEntry;
export const useUpdateJournalEntry = impl.useUpdateJournalEntry;
export const useDeleteJournalEntry = impl.useDeleteJournalEntry;
export const useUpdateSettings = impl.useUpdateSettings;
export const useStartLesson = impl.useStartLesson;
export const useCompleteLesson = impl.useCompleteLesson;
export const useSaveReflection = impl.useSaveReflection;
export const useUpdateLifeMap = impl.useUpdateLifeMap;
export const useCreateEvent = impl.useCreateEvent;
export const useUpsertCheckin = impl.useUpsertCheckin;

export const useExportData = impl.useExportData;
export const useDeleteAccountData = impl.useDeleteAccountData;
export { clearDeviceState } from './deviceState';
export { retryBoot } from './bootRetry';

export type { LessonDetail, CurrentLesson } from './mock';
export { MockStoreProvider as BackendProvider } from './mockStore';
export { BACKEND_MODE } from '@/lib/config';
