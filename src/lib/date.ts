/**
 * Date helpers. The app runs on-device, so real wall-clock time is correct and
 * expected here (`Date.now()` / `new Date()`).
 *
 * Everything that talks about *days* goes through the calendar, never through
 * `ms / 86_400_000`. A day is not always 24 hours long (daylight saving makes
 * one 23 and one 25 a year), and a count of 24-hour blocks since sign-up is not
 * the calendar day either: an account made at 23:00 would roll over to "day 2"
 * at 23:00 the next night while the check-ins — filed under local calendar
 * dates — had rolled over an hour after sign-up. The two disagreed for most of
 * every day, which is how the day pill, the lesson it offered and the check-in
 * it asked after could each be talking about a different day.
 */

import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/** Local YYYY-MM-DD for a given Date (defaults to now). */
export function toDateKey(d: Date | number = new Date()): string {
  const x = typeof d === 'number' ? new Date(d) : d;
  const y = x.getFullYear();
  const m = `${x.getMonth() + 1}`.padStart(2, '0');
  const day = `${x.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayKey(now: number = Date.now()): string {
  return toDateKey(new Date(now));
}

/** `YYYY-MM-DD` read as local midnight. (`new Date(iso)` reads it as UTC and slips a day west of Greenwich.) */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1);
}

/** Whether a string is a real calendar date in `YYYY-MM-DD`. */
export function isDateKey(key: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  return toDateKey(fromDateKey(key)) === key;
}

/** Local midnight of the day `t` falls in. */
export function startOfDay(t: number | Date = Date.now()): number {
  const d = new Date(typeof t === 'number' ? t : t.getTime());
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** The same wall-clock time `n` calendar days later (DST-safe). */
export function addDays(t: number | Date, n: number): number {
  const d = new Date(typeof t === 'number' ? t : t.getTime());
  d.setDate(d.getDate() + n);
  return d.getTime();
}

/** Local midnight of the next day. */
export function nextMidnight(t: number = Date.now()): number {
  return addDays(startOfDay(t), 1);
}

/** Whole calendar days from `a` to `b` by the local calendar (0 = same day, 1 = the day after). */
export function calendarDaysBetween(a: number | Date, b: number | Date): number {
  const x = new Date(typeof a === 'number' ? a : a.getTime());
  const y = new Date(typeof b === 'number' ? b : b.getTime());
  const da = Date.UTC(x.getFullYear(), x.getMonth(), x.getDate());
  const db = Date.UTC(y.getFullYear(), y.getMonth(), y.getDate());
  return Math.round((db - da) / 86_400_000);
}

/**
 * The account's day number: the calendar day the account was made is day 1,
 * the next calendar day is day 2, and so on. Never less than 1, so a clock set
 * back (or a future `createdAt` from a skewed server) cannot show "day 0".
 */
export function programDay(createdAt: number | undefined | null, now: number = Date.now()): number {
  if (!createdAt) return 1;
  return Math.max(1, calendarDaysBetween(createdAt, now) + 1);
}

/** Array of the last `n` date keys, oldest first, ending today. */
export function lastNDateKeys(n: number, now: number = Date.now()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) out.push(toDateKey(new Date(addDays(now, -i))));
  return out;
}

/** Whole days between two timestamps (a < b), by the calendar. */
export function daysBetween(aMs: number, bMs: number): number {
  return Math.max(0, calendarDaysBetween(aMs, bMs));
}

/** Short human label like "Jun 2" or "Jun 2, 9:41 PM" for timestamps. */
export function formatTimestamp(ms: number, withTime = false): string {
  const d = new Date(ms);
  const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (!withTime) return date;
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date}, ${time}`;
}

/** "3:00" style mm:ss from a seconds count. */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = `${s % 60}`.padStart(2, '0');
  return `${mm}:${ss}`;
}

// ── a clock that knows when the day turns ─────────────────────────────

/**
 * "Now", held steady while a screen is open — so a number does not shift under
 * a re-render — but moved on when the day actually changes: at local midnight
 * while the app is open, and whenever the app comes back to the foreground on a
 * different day (the phone slept through midnight, or the clock or time zone
 * changed). Tabs stay mounted for the life of the app, so a screen that read the
 * clock once on mount would otherwise keep showing yesterday for as long as the
 * app stayed in memory.
 */
const RESUME_REFRESH_MS = 30 * 60 * 1000;

export function useNow(): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const arm = (from: number) => {
      if (timer) clearTimeout(timer);
      // a beat past midnight, so the new day's key is unambiguous; timers can
      // fire early by a few ms, and a long one may be clamped, so re-check
      const wait = Math.min(nextMidnight(from) - from + 500, 6 * 60 * 60 * 1000);
      timer = setTimeout(() => {
        const t = Date.now();
        setNow((prev) => (toDateKey(prev) === toDateKey(t) ? prev : t));
        arm(t);
      }, Math.max(1_000, wait));
    };
    arm(Date.now());
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      const t = Date.now();
      // a new day, or long enough away that "Good morning" may have become the evening
      setNow((prev) => (toDateKey(prev) === toDateKey(t) && t - prev < RESUME_REFRESH_MS ? prev : t));
      arm(t);
    });
    return () => {
      if (timer) clearTimeout(timer);
      sub.remove();
    };
  }, []);

  return now;
}

/** Today's local date key, kept current across midnight and app resumes. */
export function useTodayKey(): string {
  return toDateKey(new Date(useNow()));
}
