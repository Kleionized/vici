import { isSlip } from '@/lib/day';
import { clockTime, daysAgo, shortDate, splitStored, WEEKDAYS_LONG, WEEKDAYS_SHORT } from '@/lib/format';
import type { TidelineEvent } from '@/lib/types';
import { severityWord } from '@/lib/weeklyReport';

/**
 * What the Log and the overview print from an event or a day — written once so
 * the Log, the overview and the weekly report cannot read the same urge two
 * ways.
 */

export const DAY_MS = 86_400_000;

/** An urge, however it ended. */
export const isUrge = (e: TidelineEvent) => e.type === 'urge_rode_out' || e.type === 'urge_acted_on';
/** A log entry that ended in a slip: a lapse, or an urge acted on — the one rule (`src/lib/day.ts`) every screen counts by. */
export { isSlip };

/**
 * A Log row's left side: `Fri, 9:05 pm` — the short weekday for the fortnight
 * the Log reads by day, `Today` / `Yesterday` for the two nearest (as the
 * check-in rows say them), the date past thirteen days (`Jul 6, 9:05 pm`).
 */
export function entryWhen(at: number, now: number): string {
  const days = daysAgo(at, now);
  const day = days === 0 ? 'Today' : days === 1 ? 'Yesterday' : days > 1 && days < 14 ? WEEKDAYS_SHORT[new Date(at).getDay()] : shortDate(at);
  return `${day}, ${clockTime(at, { lower: true })}`;
}

/** A check-in row's day: `Today`, `Yesterday`, the weekday for a fortnight, then the date. */
export function dayWord(at: number, now: number): string {
  const days = daysAgo(at, now);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days > 1 && days < 14) return WEEKDAYS_LONG[new Date(at).getDay()];
  return shortDate(at);
}

/**
 * A Log row's right side: the band word for an urge (`Strong`), `Slipped` (with
 * the dot) for a lapse or an urge acted on, `Ridden out` for an urge logged
 * without a strength.
 */
export function entryRead(e: TidelineEvent): { word: string; slipped: boolean } {
  if (isSlip(e)) return { word: 'Slipped', slipped: true };
  return { word: severityWord(e.severity ?? null) ?? 'Ridden out', slipped: false };
}

/** `+12`, `−4` — a rise with a plus, a fall with a true minus. */
export function signed(delta: number): string {
  return delta >= 0 ? `+${delta}` : `−${Math.abs(delta)}`;
}

/** Count occurrences, biggest first; ties keep their first-seen order. */
export function tally(values: string[]): [string, number][] {
  const map = new Map<string, number>();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

/**
 * The trigger column reads nouns where the picker reads states — the frames
 * write `Tiredness` where the tile says `Tired` (D128). Only that one word is
 * mapped; the rest keep their own label.
 */
const TRIGGER_NOUN: Record<string, string> = { Tired: 'Tiredness' };
export const triggerNoun = (label: string) => TRIGGER_NOUN[label] ?? label;

/**
 * Every stored trigger of every urge, split back out of the `' · '` join.
 *
 * The SOS's "What’s feeding it" used to be kept only in
 * `precedingState.reasons`, where no chart looked; it now writes `trigger`
 * too (deploy WP5, D464). An urge from before that, with reasons and no
 * trigger, is read from its reasons — less the "I don’t know" answer, which
 * names no trigger — so the SOS urges already on record count as well.
 */
const NO_TRIGGER = 'I don’t know';
export const triggersOf = (urges: TidelineEvent[]) =>
  urges.flatMap((e) => (e.trigger ? splitStored(e.trigger) : (e.precedingState?.reasons ?? []).filter((r) => r !== NO_TRIGGER)));

/**
 * The HALT booleans the schema carries, in words — counted only where an urge
 * named no feeling (the feeling picker is where a feeling is named now).
 */
const STATE_WORD: Record<string, string> = { hungry: 'Hungry', tired: 'Tired', lonely: 'Lonely', bored: 'Bored' };

/** What each urge felt like before it: its named feeling, else its HALT flags. */
export function feelingsOf(urges: TidelineEvent[]): string[] {
  return urges.flatMap((e) => {
    const named = e.precedingState?.feeling;
    if (named) return [named];
    return Object.entries(e.precedingState ?? {})
      .filter(([key, on]) => on === true && key in STATE_WORD)
      .map(([key]) => STATE_WORD[key]);
  });
}

/** Urges per clock hour, 0–23. */
export function hourCounts(urges: TidelineEvent[]): number[] {
  const out = Array.from({ length: 24 }, () => 0);
  for (const e of urges) out[new Date(e.createdAt).getHours()] += 1;
  return out;
}

/**
 * The two-hour window with the most urges, wrapping past midnight — a sliding
 * sum, not the single top hour (which ties 23 against 0 on the frame's own
 * night). The earliest start wins a tie, counting from midnight.
 */
export function peakWindow(hours: number[]): number | null {
  let best = -1;
  let at: number | null = null;
  for (let h = 0; h < 24; h += 1) {
    const sum = hours[h] + hours[(h + 1) % 24];
    if (sum > best) {
      best = sum;
      at = h;
    }
  }
  return best > 0 ? at : null;
}

/** The urge's band, 0–4, from its stored 1–10 severity (`bandToSeverity` inverted). */
export const bandOf = (severity: number) => Math.max(0, Math.min(4, Math.round((severity - 2) / 2)));
