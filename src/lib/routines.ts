/**
 * Routines — when the two daily check-ins arrive.
 *
 * Personalization asks two questions and no more: what time the morning
 * check-in should come, and what time the nightly one should. Both are local
 * preferences; nothing about them needs to survive a reinstall on the server.
 *
 * The store is a tiny module-level cache with listeners so Today re-renders
 * the moment a picker saves, without threading a provider through the tree.
 */

import { useCallback, useSyncExternalStore } from 'react';

import { getJSON, setJSON } from '@/lib/storage';

export type TimeOfDay = {
  /** 1–12, as shown on the wheel. */
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
};

export type Routines = {
  morning: TimeOfDay;
  night: TimeOfDay;
  /**
   * When the risky window opens, as onboarding read it from the answers
   * (`windowFor`). The heads-up reminder lands half an hour before it. Absent
   * until onboarding (or Settings) sets it.
   */
  risk?: TimeOfDay;
};

export const DEFAULT_ROUTINES: Routines = {
  // `Morning Check-in Time` parks on 8:00 AM, and so does the Settings frame's
  // Morning row — the two frames that state it agree (D324)
  morning: { hour: 8, minute: 0, period: 'AM' },
  // `19C · Nightly check-in time` draws the wheel at 10:30 PM before it is touched
  night: { hour: 10, minute: 30, period: 'PM' },
};

/**
 * When each check-in becomes the one the app offers.
 *
 * Nothing tells a cold launch which check-in is meant, so the clock decides.
 * The old test was noon, which put the nightly check-in in front of someone at
 * half past twelve. These are the two edges instead: the morning one from 4:30,
 * the nightly one from 18:30, and the small hours belong to the night that has
 * not been closed yet rather than to a morning nobody is awake for.
 *
 * Minutes past local midnight, so a 4:30 boundary is expressible.
 */
export const MORNING_OPENS_AT = 4 * 60 + 30;
export const NIGHT_OPENS_AT = 18 * 60 + 30;

/** Which check-in the clock says it is. */
export function checkinPartNow(now: Date = new Date()): 'morning' | 'night' {
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= MORNING_OPENS_AT && minutes < NIGHT_OPENS_AT ? 'morning' : 'night';
}

/**
 * The calendar day a night check-in closes. The night belongs to the day it
 * ends: a check-in at 00:40 is still last night's (the small hours belong to
 * the night that has not been closed yet — see `checkinPartNow`), so it files
 * yesterday's mood and names *today's* action, not tomorrow's. Without this a
 * check-in after midnight wrote its mood onto the new day and its action two
 * days out, and the morning check-in asked after an action nobody was given.
 */
export function nightDayStart(now: number = Date.now()): number {
  const d = new Date(now);
  const minutes = d.getHours() * 60 + d.getMinutes();
  d.setHours(0, 0, 0, 0);
  if (minutes < MORNING_OPENS_AT) d.setDate(d.getDate() - 1);
  return d.getTime();
}

const KEY = 'tideline.routines.v2';

let cache: Routines = DEFAULT_ROUTINES;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!loaded) {
    loaded = true;
    void getJSON<Routines>(KEY).then((stored) => {
      if (stored) {
        cache = {
          morning: { ...DEFAULT_ROUTINES.morning, ...stored.morning },
          night: { ...DEFAULT_ROUTINES.night, ...stored.night },
          risk: stored.risk,
        };
        emit();
      }
    });
  }
  return () => {
    listeners.delete(listener);
  };
}

const snapshot = () => cache;

/** Read the saved check-in times. Returns the defaults until the store loads. */
export function useRoutines(): Routines {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/** Merge a patch into the saved routines and persist it. */
export function useSaveRoutines(): (patch: Partial<Routines>) => Promise<void> {
  return useCallback(async (patch: Partial<Routines>) => {
    cache = { ...cache, ...patch };
    emit();
    await setJSON(KEY, cache);
  }, []);
}

/** Minutes past midnight for a wheel time. */
export function minutesOf(time: TimeOfDay): number {
  const h = (time.hour % 12) + (time.period === 'PM' ? 12 : 0);
  return h * 60 + time.minute;
}

/** A wheel time from minutes past midnight (wraps). */
export function timeOfMinutes(total: number): TimeOfDay {
  const m = ((Math.round(total) % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  return { hour: h24 % 12 || 12, minute: m % 60, period: h24 >= 12 ? 'PM' : 'AM' };
}

/** "11:00 pm" / "6:30 AM" → a wheel time, or null. */
export function parseClock(text: string): TimeOfDay | null {
  const m = /^\s*(\d{1,2}):(\d{2})\s*([ap])\.?m\.?\s*$/i.exec(text);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour < 1 || hour > 12 || minute > 59) return null;
  return { hour, minute, period: m[3].toLowerCase() === 'p' ? 'PM' : 'AM' };
}

/** Save outside React (onboarding's reminder step, the notification sync). */
export async function saveRoutines(patch: Partial<Routines>): Promise<void> {
  cache = { ...cache, ...patch };
  emit();
  await setJSON(KEY, cache);
}

/** The current routines, outside React. */
export function readRoutines(): Routines {
  return cache;
}

/** "7:00 AM" — the label the Today pill and Settings both show. */
export function formatTime(time: TimeOfDay): string {
  return `${time.hour}:${String(time.minute).padStart(2, '0')} ${time.period}`;
}
