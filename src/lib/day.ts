/**
 * The programme's calendar — one answer to "what day is it" for every screen
 * (deploy WP3, D430–D449).
 *
 * The programme starts on a local calendar date: the day onboarding finished
 * (`programmeStartedAt`, `YYYY-MM-DD`), or — for an account from before that
 * was stored — the local date the account was made. Day N is the number of
 * whole local calendar days from that date, plus one, so the day, the lesson
 * and every date-keyed record (check-ins, the week strip, the rating) turn over
 * together at local midnight. Nothing here steps a date by 86,400,000 ms: a
 * day around a clock change is 23 or 25 hours, so "yesterday", "tomorrow" and
 * "a week ago" are calendar arithmetic (`setDate`).
 *
 * The same module says what counts: a check-in is a row with check-in content
 * (`isCheckin`), and a slip is a lapse or an urge acted on (`isSlip`). The rating,
 * reports, medallions, the Log and Today all read these, so no two screens can
 * count one night two ways.
 */

import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { toDateKey } from '@/lib/date';
import { checkinEdges, currentRoutines, type Routines } from '@/lib/routines';
import type { AppUser, DailyCheckin, TidelineEvent } from '@/lib/types';

/** The course: twelve weeks, a lesson a day. */
export const COURSE_DAYS = 84;
export const COURSE_WEEKS = 12;
/** The week the letter written on day zero opens in, and its first day (78). */
export const LETTER_WEEK = 12;
export const LETTER_OPENS_DAY = (LETTER_WEEK - 1) * 7 + 1;

type When = number | Date;
const at = (d: When) => (d instanceof Date ? d : new Date(d));

// ── calendar arithmetic ──────────────────────────────────────────────────────

const KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** A local `YYYY-MM-DD`. */
export function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && KEY.test(value);
}

/** `2026-10-08` as that date's local midnight (never parsed as UTC). */
export function keyToDate(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1);
}

/** Local midnight of the day `d` falls on. */
export function dayStart(d: When): number {
  const x = at(d);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
}

/** Local midnight `n` calendar days from `d`'s date (negative goes back). */
export function addDays(d: When, n: number): Date {
  const x = at(d);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate() + n);
}

/** A date key moved by `n` calendar days. */
export function shiftKey(key: string, n: number): string {
  return toDateKey(addDays(keyToDate(key), n));
}

/** Whole calendar days from `a`'s date to `b`'s (0 = same date, negative = `b` earlier). */
export function calendarDaysBetween(a: When, b: When): number {
  const x = at(a);
  const y = at(b);
  return Math.round((Date.UTC(y.getFullYear(), y.getMonth(), y.getDate()) - Date.UTC(x.getFullYear(), x.getMonth(), x.getDate())) / 86_400_000);
}

// ── the programme's start and day ────────────────────────────────────────────

export type ProgrammeUser = Pick<AppUser, 'createdAt' | 'programmeStartedAt'>;

/**
 * Anything a screen has that says when the programme began: the account (its
 * `programmeStartedAt`, else its `createdAt`), a timestamp (an older caller's
 * `createdAt`), or a date key.
 */
export type ProgrammeStart = ProgrammeUser | number | string | null | undefined;

/** The local date the programme began on, or null while it is unknown. */
export function programmeStartKey(start: ProgrammeStart): string | null {
  if (start == null) return null;
  if (typeof start === 'string') return isDateKey(start) ? start : null;
  if (typeof start === 'number') return Number.isFinite(start) && start > 0 ? toDateKey(new Date(start)) : null;
  if (isDateKey(start.programmeStartedAt)) return start.programmeStartedAt;
  return Number.isFinite(start.createdAt) && start.createdAt > 0 ? toDateKey(new Date(start.createdAt)) : null;
}

/** Local midnight of the programme's first day, or null while it is unknown. */
export function programmeStartMs(start: ProgrammeStart): number | null {
  const key = programmeStartKey(start);
  return key ? keyToDate(key).getTime() : null;
}

/**
 * Day N on `now`'s date: 1 on the start date, 2 the calendar day after.
 * Never less than 1; 1 while the start is unknown (callers that must not
 * guess wait for the account before drawing a day).
 */
export function programmeDay(start: ProgrammeStart, now: When = Date.now()): number {
  const key = programmeStartKey(start);
  if (!key) return 1;
  return Math.max(1, calendarDaysBetween(keyToDate(key), now) + 1);
}

/** How many programme days had begun by `now` (0 before the start date). */
export function programmeDaysLived(start: ProgrammeStart, now: When = Date.now()): number {
  const key = programmeStartKey(start);
  if (!key) return 0;
  return Math.max(0, calendarDaysBetween(keyToDate(key), now) + 1);
}

/** The week a day falls in — past day 84 the course stays on Week XII. */
export function courseWeekForDay(day: number): number {
  return Math.min(COURSE_WEEKS, Math.max(1, Math.ceil(day / 7)));
}

/** Past the last lesson. */
export const courseComplete = (day: number) => day > COURSE_DAYS;

/** The day-zero letter is sealed until the first day of Week XII. */
export const letterOpen = (day: number) => day >= LETTER_OPENS_DAY;

// ── which day a check-in belongs to ──────────────────────────────────────────

/**
 * The date the night check-in closes. Until the morning check-in opens (4:30
 * at the default times — `checkinEdges`, D421), the small hours still belong
 * to the evening before: a night check-in at 00:40 closes yesterday, reads
 * yesterday's record and files yesterday's row.
 */
export function nightKey(now: When = Date.now(), routines: Routines = currentRoutines()): string {
  const x = at(now);
  const minutes = x.getHours() * 60 + x.getMinutes();
  const { morningOpens } = checkinEdges(routines);
  return toDateKey(minutes < morningOpens ? addDays(x, -1) : x);
}

/**
 * True in the small hours of the programme's first date, before the morning
 * check-in opens: the night the clock points at (`nightKey`) is the evening
 * before the programme began, which has nothing to close. Neither the launch
 * gate nor the Log's door asks for a night check-in then.
 */
export function nightBeforeProgramme(start: ProgrammeStart, now: When = Date.now(), routines: Routines = currentRoutines()): boolean {
  const first = programmeStartKey(start);
  return first != null && nightKey(now, routines) < first;
}

/**
 * The row a night check-in done at `now` closes: `nightKey`, but never a date
 * before the programme began. The night flow writes this row, and the launch
 * gate and the Log's door read it to ask whether tonight is done, so all three
 * always look at the same date.
 */
export function closingNightKey(start: ProgrammeStart, now: When = Date.now(), routines: Routines = currentRoutines()): string {
  const key = nightKey(now, routines);
  const first = programmeStartKey(start);
  return first != null && key < first ? first : key;
}

/** Today Home's greeting — its own rule, not the check-in switch (which says "morning" until 18:30). */
export function greetingFor(now: When = Date.now()): string {
  const h = at(now).getHours();
  if (h >= 5 && h < 12) return 'Good morning.';
  if (h >= 12 && h < 18) return 'Good afternoon.';
  return 'Good evening.';
}

// ── what counts ──────────────────────────────────────────────────────────────

type CheckinContent = Pick<DailyCheckin, 'mood' | 'energy' | 'emotions' | 'reasons' | 'nightMood'>;

/** The morning check-in (or the quick one) was done on this row: it carries a mood or an energy reading. */
export const isMorningCheckin = (c: CheckinContent | null | undefined): boolean => c != null && (c.mood != null || c.energy != null);

/** The row holds evening check-in content (its mood, feelings or reasons). Used for counting; whether tonight is done is `isNightClosed`. */
export const isNightCheckin = (c: CheckinContent | null | undefined): boolean =>
  c != null && (c.nightMood != null || !!c.emotions?.length || !!c.reasons?.length);

/**
 * Has the night flow closed this row? Only the night flow writes `nightMood`.
 * The quick check-in (`/checkin`) also writes feelings and reasons, at any hour,
 * so those fields cannot answer "is tonight done?" (the gate, the Log's door,
 * Today's disc). Counting still uses `isNightCheckin` and `isCheckin`.
 */
export const isNightClosed = (c: Pick<DailyCheckin, 'nightMood'> | null | undefined): boolean => c?.nightMood != null;

/**
 * A row is a check-in only when it carries check-in content. A row that holds
 * only the day's action (`dailyAction`, `dailyActionDone`) — written by the
 * night for tomorrow, by the morning for yesterday, by Today's tick — is not.
 */
export const isCheckin = (c: CheckinContent | null | undefined): boolean => isMorningCheckin(c) || isNightCheckin(c);

/**
 * The check-ins the record counts: rows with content, dated no later than
 * `now`'s date — and, given a start, none from before the programme.
 */
export function livedCheckins<T extends CheckinContent & Pick<DailyCheckin, 'date'>>(rows: readonly T[], now: When = Date.now(), start?: ProgrammeStart): T[] {
  const today = toDateKey(at(now));
  const first = start === undefined ? null : programmeStartKey(start);
  return rows.filter((c) => isCheckin(c) && c.date <= today && (first == null || c.date >= first));
}

/** The day's mood: the morning's reading, else the night's. */
export const dayMood = (c: Pick<DailyCheckin, 'mood' | 'nightMood'> | null | undefined): number | undefined => c?.mood ?? c?.nightMood ?? undefined;

/** A slip: a lapse, or an urge that ended in one. Both doors (`/slip`, `/lapse`, the urge log) count the same. */
export const isSlip = (e: Pick<TidelineEvent, 'type'>): boolean => e.type === 'lapse' || e.type === 'urge_acted_on';

/** An urge surfed: ridden out. An urge acted on is a slip, never "surfed". */
export const isSurfed = (e: Pick<TidelineEvent, 'type'>): boolean => e.type === 'urge_rode_out';

// ── the words a reading is called by ─────────────────────────────────────────

/**
 * One word list per scale, for every screen that names a 1–5 reading — the
 * morning and night check-ins, Today's chips, the Log, Insights and the
 * weekly report. The check-ins' second lines stay their own.
 */
export const MOOD_WORDS = ['Rough', 'Low', 'Steady', 'Good', 'Great'] as const;
export const ENERGY_WORDS = ['Empty', 'Low', 'Enough', 'Good', 'Full'] as const;

const rung = (v: number) => Math.max(0, Math.min(4, Math.round(v) - 1));
/** A stored 1–5 mood in words. */
export const moodWord = (v: number) => MOOD_WORDS[rung(v)];
/** A stored 1–5 energy in words. */
export const energyWord = (v: number) => ENERGY_WORDS[rung(v)];

// ── the clock screens read ───────────────────────────────────────────────────

/** How long the midnight watch sleeps between looks (a day-long timer is not kept). */
const MIDNIGHT_POLL = 10 * 60_000;

/**
 * "Now" for a screen that stays mounted (a tab): read on mount and again when
 * the screen is focused, when the app comes back to the foreground, and just
 * after local midnight — so an app left open overnight shows, and writes to,
 * the new day. Between those moments it holds still, so a re-render cannot
 * move the day under a finger.
 *
 * Call it from a screen inside the navigator (it uses `useFocusEffect`).
 */
export function useToday(): number {
  const [now, setNow] = useState(() => Date.now());
  const tick = useCallback(() => setNow(Date.now()), []);

  useFocusEffect(tick);

  const last = useRef<AppStateStatus>(AppState.currentState);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && last.current !== 'active') tick();
      last.current = state;
    });
    return () => sub.remove();
  }, [tick]);

  const key = toDateKey(new Date(now));
  useEffect(() => {
    let id: ReturnType<typeof setTimeout> | undefined;
    const nextMidnight = addDays(keyToDate(key), 1).getTime();
    const arm = () => {
      const left = nextMidnight - Date.now();
      if (left <= 0) {
        tick();
        return;
      }
      id = setTimeout(arm, Math.min(left + 1000, MIDNIGHT_POLL));
    };
    arm();
    return () => {
      if (id) clearTimeout(id);
    };
  }, [key, tick]);

  return now;
}
