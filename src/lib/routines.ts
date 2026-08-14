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
  night: { hour: 10, minute: 0, period: 'PM' },
};

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
