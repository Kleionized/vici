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
};

export const DEFAULT_ROUTINES: Routines = {
  morning: { hour: 7, minute: 0, period: 'AM' },
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

/** "7:00 AM" — the label the Today pill and Settings both show. */
export function formatTime(time: TimeOfDay): string {
  return `${time.hour}:${String(time.minute).padStart(2, '0')} ${time.period}`;
}
