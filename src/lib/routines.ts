/**
 * Routines — when the two daily check-ins arrive.
 *
 * Personalization asks two questions and no more: what time the morning
 * check-in should come, and what time the nightly one should — and, under
 * each, which days. They are local preferences (this phone's reminders are
 * scheduled from them, `src/lib/reminders.ts`), and they also decide which
 * check-in the app offers when it opens (`checkinPartNow`).
 *
 * The stores are tiny module-level caches with listeners so Today re-renders
 * the moment a picker saves, without threading a provider through the tree.
 * Both are kept per account on this phone (`src/lib/accountState.ts`, D490):
 * when the account changes, the caches drop back to the defaults and read the
 * new account's times and days.
 */

import { useCallback, useSyncExternalStore } from 'react';

import { ACCOUNT_KEYS, onAccountChange, readAccountJSON, writeAccountJSON } from '@/lib/accountState';

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

export type CheckinKind = 'morning' | 'night';

export const DEFAULT_ROUTINES: Routines = {
  // `Morning Check-in Time` parks on 8:00 AM, and so does the Settings frame's
  // Morning row — the two frames that state it agree (D324)
  morning: { hour: 8, minute: 0, period: 'AM' },
  // `19C · Nightly check-in time` draws the wheel at 10:30 PM before it is touched
  night: { hour: 10, minute: 30, period: 'PM' },
};

const DAY = 24 * 60;

/** Minutes past local midnight for a wheel time (12 AM = 0, 12 PM = 720). */
export function minutesOf(time: TimeOfDay): number {
  return ((time.hour % 12) + (time.period === 'PM' ? 12 : 0)) * 60 + time.minute;
}

/**
 * When each check-in becomes the one the app offers, at the default times.
 *
 * Nothing tells a cold launch which check-in is meant, so the clock decides.
 * The old test was noon, which put the nightly check-in in front of someone at
 * half past twelve. These are the two edges instead: the morning one from 4:30,
 * the nightly one from 18:30, and the small hours belong to the night that has
 * not been closed yet rather than to a morning nobody is awake for.
 *
 * Minutes past local midnight. They are what `checkinEdges` gives for the
 * default 8:00 AM / 10:30 PM — the user's own times move them (D421).
 */
export const MORNING_OPENS_AT = 4 * 60 + 30;
export const NIGHT_OPENS_AT = 18 * 60 + 30;

/** The morning check-in is offered from this long before the morning time… */
const MORNING_LEAD = 3 * 60 + 30;
/** …and the night one from this long before the night time. */
const NIGHT_LEAD = 4 * 60;
/** The morning part lasts at least this long after the morning time… */
const MORNING_HOLD = 8 * 60;
/** …and the night part at least this long after the night time. */
const NIGHT_HOLD = 4 * 60 + 30;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/**
 * The two cut-overs for a pair of check-in times (D421), in minutes past
 * midnight (`nightOpens` may run past 1440 when the night time is after
 * midnight).
 *
 * The morning check-in is offered from 3½ hours before the morning time and
 * the night one from 4 hours before the night time — at the defaults that is
 * exactly the old 4:30 and 18:30. Two holds keep either part from being
 * squeezed by an unusual pair: the night one is never offered within 8 hours
 * of the morning time (an early night time no longer says "Good evening." at
 * 1 PM), and the morning one never within 4½ hours of the night time (the
 * small hours stay with the night not yet closed). Neither edge passes its own
 * check-in time, so the check-in a reminder announces is always the one the
 * app opens at that minute.
 */
export function checkinEdges(routines: Routines): { morningOpens: number; nightOpens: number } {
  const m = minutesOf(routines.morning);
  let n = minutesOf(routines.night);
  // the night that follows this morning: a 12:30 AM night time is tomorrow's 00:30
  if (n <= m) n += DAY;
  const morningOpens = clamp(m - MORNING_LEAD, n + NIGHT_HOLD - DAY, m);
  const nightOpens = clamp(n - NIGHT_LEAD, m + MORNING_HOLD, n);
  return { morningOpens, nightOpens };
}

/**
 * Which check-in the clock says it is — by the user's saved times once they
 * have loaded (the defaults until then, which are the old fixed edges).
 */
export function checkinPartNow(now: Date = new Date(), routines: Routines = currentRoutines()): CheckinKind {
  const { morningOpens, nightOpens } = checkinEdges(routines);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const sinceMorning = (((minutes - morningOpens) % DAY) + DAY) % DAY;
  return sinceMorning < Math.min(nightOpens - morningOpens, DAY - 1) ? 'morning' : 'night';
}

// ── the times ─────────────────────────────────────────────────────────

const KEY = ACCOUNT_KEYS.routines;

let cache: Routines = DEFAULT_ROUTINES;
let loading: Promise<void> | null = null;
/** times are saved on this phone: found on disk, or saved since */
let saved = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/** The one disk read every caller shares. */
function readRoutines(): Promise<void> {
  if (!loading) {
    const read: Promise<void> = readAccountJSON<Routines>(KEY).then((stored) => {
      // an account change since this read began reset the cache: its answer is the old account's
      if (loading !== read) return;
      if (stored) {
        saved = true;
        cache = {
          morning: { ...DEFAULT_ROUTINES.morning, ...stored.morning },
          night: { ...DEFAULT_ROUTINES.night, ...stored.night },
        };
        emit();
      }
    });
    loading = read;
  }
  return loading;
}

/**
 * The saved times, once the disk has been read — the latest, so a save made
 * after the first read is what the reminder scheduler gets, not the first
 * read's snapshot. A read overtaken by an account change is read again.
 */
export function loadRoutines(): Promise<Routines> {
  const read = readRoutines();
  return read.then(() => (loading === read ? cache : loadRoutines()));
}

/** The times as last read or saved (the defaults until the first read lands). */
export function currentRoutines(): Routines {
  if (!loading) void readRoutines();
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  void readRoutines();
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
    await readRoutines();
    cache = { ...cache, ...patch };
    saved = true;
    emit();
    await writeAccountJSON(KEY, cache);
  }, []);
}

/** "9:30 pm" (the questionnaire's window) → a wheel time, or null if it is not one. */
export function parseClock(text: string): TimeOfDay | null {
  const m = /^\s*(\d{1,2}):(\d{2})\s*([ap])\.?m\.?\s*$/i.exec(text);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour < 1 || hour > 12 || minute > 59) return null;
  return { hour, minute, period: m[3].toLowerCase() === 'a' ? 'AM' : 'PM' };
}

/** Minutes past midnight (any day) → a wheel time. */
function timeAt(total: number): TimeOfDay {
  const m = ((total % DAY) + DAY) % DAY;
  const h24 = Math.floor(m / 60);
  return { hour: h24 % 12 === 0 ? 12 : h24 % 12, minute: m % 60, period: h24 < 12 ? 'AM' : 'PM' };
}

/** How far ahead of the window the suggested check-in lands. */
const SUGGEST_LEAD = 30;

/**
 * Onboarding's reminder step names the questionnaire's window and asks "Want
 * VICI there before that time?". A yes moves the check-in whose reminder
 * covers that window to half an hour before it — the night one for an evening
 * window, the morning one for a morning window — so the reminder the board
 * promises lands before the window, and the time board after Day 0 opens on
 * it. Only while no times are saved on this phone: a time the user picked is
 * never moved (D425).
 *
 * The change is registered on the disk read at call time, so a reminder sync
 * started after this call already sees the suggested time.
 */
export function suggestCheckinBefore(riskWindow: string): Promise<void> {
  const at = parseClock(riskWindow);
  if (!at) return Promise.resolve();
  const time = timeAt(minutesOf(at) - SUGGEST_LEAD);
  // a window just past midnight or noon would put it in the other half of the day
  if (time.period !== at.period) return Promise.resolve();
  return readRoutines().then(async () => {
    if (saved) return;
    const kind: CheckinKind = at.period === 'AM' ? 'morning' : 'night';
    cache = { ...cache, [kind]: time };
    saved = true;
    emit();
    await writeAccountJSON(KEY, cache);
  });
}

/** "7:00 AM" — the label the Today pill and Settings both show. */
export function formatTime(time: TimeOfDay): string {
  return `${time.hour}:${String(time.minute).padStart(2, '0')} ${time.period}`;
}

// ── the days ──────────────────────────────────────────────────────────
/**
 * Which days each check-in's reminder fires on, 0 = Sunday (the toggles'
 * order). Moved here from `components/routines/kit.tsx`, which re-exports it,
 * so the reminder scheduler can read it without importing a screen kit.
 */

export const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];
const DAYS_KEY = ACCOUNT_KEYS.checkinDays;

export type CheckinDays = Record<CheckinKind, number[]>;

let daysCache: CheckinDays = { morning: EVERY_DAY, night: EVERY_DAY };
let daysLoading: Promise<void> | null = null;
const dayListeners = new Set<() => void>();

function emitDays() {
  for (const l of dayListeners) l();
}

/** The one disk read every caller shares. */
function readDays(): Promise<void> {
  if (!daysLoading) {
    const read: Promise<void> = readAccountJSON<Partial<CheckinDays>>(DAYS_KEY).then((stored) => {
      if (daysLoading !== read) return;
      if (stored) {
        daysCache = { morning: stored.morning ?? EVERY_DAY, night: stored.night ?? EVERY_DAY };
        emitDays();
      }
    });
    daysLoading = read;
  }
  return daysLoading;
}

/** The saved days, once the disk has been read — the latest, saves since included. */
export function loadCheckinDays(): Promise<CheckinDays> {
  const read = readDays();
  return read.then(() => (daysLoading === read ? daysCache : loadCheckinDays()));
}

function subscribeDays(listener: () => void) {
  dayListeners.add(listener);
  void readDays();
  return () => {
    dayListeners.delete(listener);
  };
}

/** Read the saved days for one check-in. Returns every day until the store loads. */
export function useCheckinDays(kind: CheckinKind): number[] {
  const read = () => daysCache[kind];
  return useSyncExternalStore(subscribeDays, read, read);
}

export async function saveCheckinDays(kind: CheckinKind, days: number[]): Promise<void> {
  await readDays();
  daysCache = { ...daysCache, [kind]: days };
  emitDays();
  await writeAccountJSON(DAYS_KEY, daysCache);
}

// ── a different account ───────────────────────────────────────────────

/**
 * Signed out, or another account signed in: both stores start again from the
 * defaults and read that account's own times and days (D490). Anyone already
 * showing them re-reads at once.
 */
onAccountChange(() => {
  cache = DEFAULT_ROUTINES;
  loading = null;
  saved = false;
  daysCache = { morning: EVERY_DAY, night: EVERY_DAY };
  daysLoading = null;
  emit();
  emitDays();
  if (listeners.size) void readRoutines();
  if (dayListeners.size) void readDays();
});
