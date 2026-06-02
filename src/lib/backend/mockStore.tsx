/**
 * Mock data store — the offline "source of truth" used when no Convex URL is
 * set. Holds all per-user data in React state, write-through persisted to
 * AsyncStorage, namespaced by the signed-in user's id. The hooks in
 * `./mock.ts` read from here; screens never touch this directly.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '@/lib/auth';
import { SEED_LESSONS } from '@/content/seedLessons';
import { todayKey } from '@/lib/date';
import { genId } from '@/lib/id';
import { getJSON, setJSON } from '@/lib/storage';
import {
  DEFAULT_SETTINGS,
  type AppUser,
  type DailyCheckin,
  type DailyCheckinInput,
  type Lesson,
  type LessonProgress,
  type LifeMap,
  type Reflection,
  type TidelineEvent,
  type TidelineEventInput,
  type UserSettings,
} from '@/lib/types';

export interface UserData {
  user: AppUser;
  progress: Record<string, LessonProgress>;
  reflections: Record<string, Reflection>;
  lifeMap: LifeMap;
  events: TidelineEvent[];
  checkins: Record<string, DailyCheckin>;
}

interface MockStoreValue {
  hydrated: boolean;
  lessons: Lesson[];
  data: UserData | null;
  completeOnboarding(): Promise<void>;
  updateSettings(partial: Partial<UserSettings>): Promise<void>;
  startLesson(slug: string): Promise<void>;
  completeLesson(slug: string, fitsMeRating?: number): Promise<void>;
  saveReflection(slug: string, answers: Record<string, string | number>): Promise<void>;
  updateLifeMap(partial: Partial<Omit<LifeMap, 'userId' | 'updatedAt'>>): Promise<void>;
  createEvent(input: TidelineEventInput): Promise<void>;
  upsertCheckin(input: DailyCheckinInput): Promise<void>;
}

const MockStoreContext = createContext<MockStoreValue | null>(null);

const dataKey = (userId: string) => `tideline.mock.userdata.${userId}`;

function freshUserData(userId: string, displayName: string | null): UserData {
  const now = Date.now();
  return {
    user: {
      clerkUserId: userId,
      displayName: displayName ?? undefined,
      createdAt: now,
      onboardingComplete: false,
      settings: { ...DEFAULT_SETTINGS },
    },
    progress: {},
    reflections: {},
    lifeMap: { userId, values: [], updatedAt: now },
    events: [],
    checkins: {},
  };
}

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const { userId, displayName, isLoaded: authLoaded } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [data, setData] = useState<UserData | null>(null);
  const dataRef = useRef<UserData | null>(null);

  // Load (or initialise) the signed-in user's data whenever the user changes.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!authLoaded) return;
      if (!userId) {
        dataRef.current = null;
        setData(null);
        setHydrated(true);
        return;
      }
      setHydrated(false);
      const existing = await getJSON<UserData>(dataKey(userId));
      const next = existing ?? freshUserData(userId, displayName);
      if (cancelled) return;
      dataRef.current = next;
      setData(next);
      if (!existing) await setJSON(dataKey(userId), next);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, displayName, authLoaded]);

  const apply = useCallback(
    async (next: UserData) => {
      dataRef.current = next;
      setData(next);
      if (userId) await setJSON(dataKey(userId), next);
    },
    [userId],
  );

  const completeOnboarding = useCallback(async () => {
    const cur = dataRef.current;
    if (!cur) return;
    await apply({ ...cur, user: { ...cur.user, onboardingComplete: true } });
  }, [apply]);

  const updateSettings = useCallback(
    async (partial: Partial<UserSettings>) => {
      const cur = dataRef.current;
      if (!cur) return;
      await apply({ ...cur, user: { ...cur.user, settings: { ...cur.user.settings, ...partial } } });
    },
    [apply],
  );

  const startLesson = useCallback(
    async (slug: string) => {
      const cur = dataRef.current;
      if (!cur) return;
      const existing = cur.progress[slug];
      if (existing?.status === 'completed' || existing?.status === 'in_progress') return;
      const progress: LessonProgress = { userId: cur.user.clerkUserId, lessonSlug: slug, status: 'in_progress' };
      await apply({ ...cur, progress: { ...cur.progress, [slug]: progress } });
    },
    [apply],
  );

  const completeLesson = useCallback(
    async (slug: string, fitsMeRating?: number) => {
      const cur = dataRef.current;
      if (!cur) return;
      const progress: LessonProgress = {
        userId: cur.user.clerkUserId,
        lessonSlug: slug,
        status: 'completed',
        completedAt: Date.now(),
        fitsMeRating: fitsMeRating ?? cur.progress[slug]?.fitsMeRating,
      };
      await apply({ ...cur, progress: { ...cur.progress, [slug]: progress } });
    },
    [apply],
  );

  const saveReflection = useCallback(
    async (slug: string, answers: Record<string, string | number>) => {
      const cur = dataRef.current;
      if (!cur) return;
      const now = Date.now();
      const prev = cur.reflections[slug];
      const reflection: Reflection = {
        userId: cur.user.clerkUserId,
        lessonSlug: slug,
        answers,
        createdAt: prev?.createdAt ?? now,
        updatedAt: now,
      };
      await apply({ ...cur, reflections: { ...cur.reflections, [slug]: reflection } });
    },
    [apply],
  );

  const updateLifeMap = useCallback(
    async (partial: Partial<Omit<LifeMap, 'userId' | 'updatedAt'>>) => {
      const cur = dataRef.current;
      if (!cur) return;
      const lifeMap: LifeMap = { ...cur.lifeMap, ...partial, updatedAt: Date.now() };
      await apply({ ...cur, lifeMap });
    },
    [apply],
  );

  const createEvent = useCallback(
    async (input: TidelineEventInput) => {
      const cur = dataRef.current;
      if (!cur) return;
      const event: TidelineEvent = {
        _id: genId('evt'),
        userId: cur.user.clerkUserId,
        createdAt: input.createdAt ?? Date.now(),
        type: input.type,
        trigger: input.trigger,
        precedingState: input.precedingState,
        whatHelped: input.whatHelped,
        lesson: input.lesson,
        note: input.note,
      };
      await apply({ ...cur, events: [...cur.events, event] });
    },
    [apply],
  );

  const upsertCheckin = useCallback(
    async (input: DailyCheckinInput) => {
      const cur = dataRef.current;
      if (!cur) return;
      const date = input.date || todayKey();
      const prev = cur.checkins[date];
      const checkin: DailyCheckin = {
        _id: prev?._id ?? genId('chk'),
        userId: cur.user.clerkUserId,
        date,
        sleepHours: input.sleepHours,
        mood: input.mood,
        movedBody: input.movedBody,
        socialContact: input.socialContact,
        structureFollowed: input.structureFollowed,
        note: input.note,
      };
      await apply({ ...cur, checkins: { ...cur.checkins, [date]: checkin } });
    },
    [apply],
  );

  const value: MockStoreValue = {
    hydrated,
    lessons: SEED_LESSONS,
    data,
    completeOnboarding,
    updateSettings,
    startLesson,
    completeLesson,
    saveReflection,
    updateLifeMap,
    createEvent,
    upsertCheckin,
  };

  return <MockStoreContext.Provider value={value}>{children}</MockStoreContext.Provider>;
}

export function useMockStore(): MockStoreValue {
  const ctx = useContext(MockStoreContext);
  if (!ctx) throw new Error('useMockStore must be used within MockStoreProvider');
  return ctx;
}
