/**
 * Date helpers. The app runs on-device, so real wall-clock time is correct and
 * expected here (`Date.now()` / `new Date()`).
 */

/** Local YYYY-MM-DD for a given Date (defaults to now). */
export function toDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

/** Array of the last `n` date keys, oldest first, ending today. */
export function lastNDateKeys(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(toDateKey(d));
  }
  return out;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Whole days between two timestamps (a < b). */
export function daysBetween(aMs: number, bMs: number): number {
  return Math.floor((bMs - aMs) / MS_PER_DAY);
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
