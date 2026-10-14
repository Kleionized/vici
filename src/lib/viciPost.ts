/**
 * Which of VICI's words arrive when: the morning notification (the day's note,
 * or a relapse note the morning after a slip) and the letters (a relapse letter
 * the morning after a slip, a milestone letter as a clean run reaches each
 * mark). The words are the owner's (`src/content/morningNotes.ts`,
 * `src/content/viciLetters.ts`); this file only chooses (D550–D554).
 *
 * A slip is either kind (`isSlip`), on the local calendar day it was logged.
 * A clean run is the days in a row without a slip, counted back from a given
 * day and never past the programme's first day. A day the app was not opened
 * counts as clean: milestones are the time the boundary was kept, which the
 * owner counts that way (the streak, which needs a check-in, is a different
 * number).
 */

import { LETTER_BY_ID, type LetterGreeting, type ViciLetter } from '@/content/viciLetters';
import { MORNING_NOTES, RELAPSE_NOTES } from '@/content/morningNotes';
import { toDateKey } from '@/lib/date';
import { isSlip, keyToDate, programmeStartKey, shiftKey, type ProgrammeStart } from '@/lib/day';
import type { TidelineEvent } from '@/lib/types';

type Ev = Pick<TidelineEvent, 'type' | 'createdAt' | 'trigger' | 'precedingState'>;

// ── names ────────────────────────────────────────────────────────────

const NAME = '[user name]';

/**
 * Put the name in, or take the placeholder out with the words that only
 * framed it: "[user name], the days…" → "The days…", "…well, [user name]. What"
 * → "…well. What".
 */
export function fillName(text: string, name?: string | null): string {
  const n = name?.trim();
  if (n) return text.split(NAME).join(n);
  return text
    .replace(/(^|\n)\[user name\], (\S)/g, (_m, lead: string, c: string) => lead + c.toUpperCase())
    .replace(/,? \[user name\]/g, '')
    .replace(/\[user name\]/g, '');
}

/** "Hi Sam," or, with no name, "Hi,". */
export function salutation(greeting: LetterGreeting, name?: string | null): string {
  const n = name?.trim();
  return n ? `${greeting} ${n},` : `${greeting},`;
}

/** The first name a letter or a note uses, from the account's display name. */
export const firstName = (displayName?: string | null): string => displayName?.trim().split(/\s+/)[0] ?? '';

// ── the days ─────────────────────────────────────────────────────────

const keyOf = (t: number) => toDateKey(new Date(t));

/** The local days with a slip, as a set of date keys. */
export function slipDays(events: readonly Ev[]): Set<string> {
  const out = new Set<string>();
  for (const e of events) if (isSlip(e) && Number.isFinite(e.createdAt)) out.add(keyOf(e.createdAt));
  return out;
}

/**
 * The run of clean days ending on `through` (a date key): how many, the day it
 * began, and whether a slip came before it (a return, not a first run). Zero
 * when `through` itself had a slip or is before the programme.
 */
export function cleanRun(slips: Set<string>, start: string | null, through: string): { days: number; from: string; afterSlip: boolean } {
  let days = 0;
  let k = through;
  // a run cannot be longer than the time since the programme began; with no start, ten years is the bound
  for (let guard = 0; guard < 3660; guard++) {
    if (start != null && k < start) break;
    if (slips.has(k)) break;
    days += 1;
    k = shiftKey(k, -1);
  }
  const from = shiftKey(through, -(days - 1));
  const afterSlip = [...slips].some((s) => s < from);
  return { days, from, afterSlip };
}

/** What the slips on one day were put down to, in the words of every slip path (98D, the logs, the SOS). */
type Situation = 'tired' | 'stress' | 'lonely' | 'bored' | 'scrolling' | 'latePhone' | 'noCause';

const SITUATION: Readonly<Record<string, Situation>> = {
  Tired: 'tired',
  Tiredness: 'tired',
  Stressed: 'stress',
  Stress: 'stress',
  'Stressed or anxious': 'stress',
  Argument: 'stress',
  Lonely: 'lonely',
  Bored: 'bored',
  Boredom: 'bored',
  'Sexual content': 'scrolling',
  Social: 'scrolling',
  'Phone in bed': 'latePhone',
  Phone: 'latePhone',
  'Late night': 'latePhone',
  'Not sure': 'noCause',
  'I don’t know': 'noCause',
};

/** The situations reported for the slips on `day`, in the order they were given. */
function situationsOn(events: readonly Ev[], day: string): Situation[] {
  const out: Situation[] = [];
  for (const e of events) {
    if (!isSlip(e) || keyOf(e.createdAt) !== day) continue;
    const words = [...(e.trigger ? e.trigger.split(' · ') : []), ...(e.precedingState?.reasons ?? [])];
    for (const w of words) {
      const s = SITUATION[w.trim()];
      if (s && !out.includes(s)) out.push(s);
    }
  }
  return out;
}

/** Slip days in the seven days ending on `day`. Three or more is "repeated". */
const recentSlipDays = (slips: Set<string>, day: string) => [...slips].filter((s) => s <= day && s > shiftKey(day, -7)).length;
const REPEATED = 3;

/** Slip days before `day`: what turns the rotations, so two slips in a row read different words. */
const slipsBefore = (slips: Set<string>, day: string) => [...slips].filter((s) => s < day).length;

// ── the morning notification ─────────────────────────────────────────

/** The day's note, day 1 to 84; after the course the notes run again from day 1. */
export function morningNoteForDay(day: number): string {
  const d = Math.max(1, Math.floor(day));
  return MORNING_NOTES[(d - 1) % MORNING_NOTES.length];
}

const GENERAL_NOTES = RELAPSE_NOTES.filter((n) => !n.when);

/**
 * The relapse note for the morning after a slip on `slipDay`: one about
 * repeated slips, tiredness or stress only when that is what was reported
 * (the document's rule), else the next of the general ones.
 */
export function relapseNoteFor(events: readonly Ev[], slipDay: string): string {
  const slips = slipDays(events);
  const said = situationsOn(events, slipDay);
  const pick = (when: 'repeated' | 'tired' | 'stress') => RELAPSE_NOTES.find((n) => n.when === when)!.text;
  if (recentSlipDays(slips, slipDay) >= REPEATED) return pick('repeated');
  if (said.includes('tired')) return pick('tired');
  if (said.includes('stress')) return pick('stress');
  return GENERAL_NOTES[slipsBefore(slips, slipDay) % GENERAL_NOTES.length].text;
}

/**
 * The words for the morning notification of `day` (a date key): the relapse
 * note when the day before had a slip, else the programme day's note. The name
 * is filled in or left out.
 */
export function morningNoteFor(day: string, programmeDayNumber: number, events: readonly Ev[], name?: string | null): string {
  const before = shiftKey(day, -1);
  const text = slipDays(events).has(before) ? relapseNoteFor(events, before) : morningNoteForDay(programmeDayNumber);
  return fillName(text, name);
}

// ── the letters ──────────────────────────────────────────────────────

const GENERAL_RELAPSE = ['R01', 'R22', 'R23', 'R24', 'R25'];
const BY_SITUATION: Readonly<Record<Situation, string>> = {
  tired: 'R07',
  stress: 'R08',
  lonely: 'R09',
  bored: 'R10',
  scrolling: 'R11',
  latePhone: 'R12',
  noCause: 'R17',
};
/** A run this long, ended by a slip, was an established streak (R03). */
const ESTABLISHED = 7;

/**
 * The letter for the morning after a slip on `slipDay`, by what the record
 * says: the first slip ever (R02), repeated slips (R06), what the user said
 * fed it (R07–R12, R17), a streak of a week or more ended (R03), else the next
 * general letter. Situations the app never asks about (shame, giving up,
 * wanting more help…) are not guessed: those letters wait for questions that
 * record them.
 */
export function relapseLetterFor(events: readonly Ev[], start: ProgrammeStart, slipDay: string): ViciLetter {
  const slips = slipDays(events);
  const before = slipsBefore(slips, slipDay);
  if (before === 0) return LETTER_BY_ID.R02;
  if (recentSlipDays(slips, slipDay) >= REPEATED) return LETTER_BY_ID.R06;
  const said = situationsOn(events, slipDay)[0];
  if (said) return LETTER_BY_ID[BY_SITUATION[said]];
  if (cleanRun(slips, programmeStartKey(start), shiftKey(slipDay, -1)).days >= ESTABLISHED) return LETTER_BY_ID.R03;
  return LETTER_BY_ID[GENERAL_RELAPSE[before % GENERAL_RELAPSE.length]];
}

/** The milestone letters by the days of a clean run they mark (once each). */
const BY_DAYS: readonly [number, string][] = [
  [1, 'M01'],
  [2, 'M02'],
  [3, 'M03'],
  [5, 'M04'],
  [7, 'M05'],
  [10, 'M06'],
  [14, 'M07'],
  [21, 'M08'],
  [30, 'M09'],
  [35, 'M10'],
  [42, 'M11'],
  [50, 'M12'],
  [56, 'M13'],
  [60, 'M14'],
  [70, 'M15'],
  [84, 'M16'],
  [90, 'M17'],
  [100, 'M18'],
];
/** …and by calendar months. */
const BY_MONTHS: readonly [number, string][] = [
  [4, 'M19'],
  [6, 'M20'],
  [9, 'M21'],
  [12, 'M22'],
];

/** `from` plus `months` calendar months, as a date key. */
function addMonths(from: string, months: number): string {
  const d = keyToDate(from);
  return toDateKey(new Date(d.getFullYear(), d.getMonth() + months, d.getDate()));
}

/** What `deliveredMilestone` returns: the letter to bring, and every mark that is now spent. */
export type MilestoneDue = { letter: ViciLetter; spent: string[] };

/**
 * The milestone letter due on `today` (a date key), or null. The run is
 * counted through yesterday, so a night is whole before it is marked. Each of
 * M01–M23 comes once per account; M24 and M25 (back after a slip) once per
 * run, marked `M24@<run start>`. When several are due at once (a phone that
 * was away) only the furthest comes, and the rest are spent, so none arrives
 * late and out of order. `delivered` holds the marks already spent.
 */
export function dueMilestone(events: readonly Ev[], start: ProgrammeStart, today: string, delivered: ReadonlySet<string>): MilestoneDue | null {
  const slips = slipDays(events);
  const run = cleanRun(slips, programmeStartKey(start), shiftKey(today, -1));
  const due: { mark: string; id: string; reach: number }[] = [];
  for (const [days, id] of BY_DAYS) if (run.days >= days) due.push({ mark: id, id, reach: days });
  for (const [months, id] of BY_MONTHS) if (run.days > 0 && addMonths(run.from, months) <= today) due.push({ mark: id, id, reach: months * 30 });
  if (run.afterSlip && run.days >= 1) due.push({ mark: `M24@${run.from}`, id: 'M24', reach: 1 });
  if (run.afterSlip && run.days >= 7) due.push({ mark: `M25@${run.from}`, id: 'M25', reach: 7 });
  const fresh = due.filter((d) => !delivered.has(d.mark));
  if (fresh.length) {
    // the furthest mark wins; at equal reach, the return letter (it says more about this run)
    const best = fresh.reduce((a, b) => (b.reach > a.reach || (b.reach === a.reach && b.id > a.id) ? b : a));
    return { letter: LETTER_BY_ID[best.id], spent: fresh.map((d) => d.mark) };
  }
  // the first urge ridden out, once, on a launch no run letter needs
  if (!delivered.has('M23') && events.some((e) => e.type === 'urge_rode_out')) return { letter: LETTER_BY_ID.M23, spent: ['M23'] };
  return null;
}

/** The whole letter as text: for the Journal and for anything that cannot draw the card. */
export function letterText(letter: ViciLetter, name?: string | null): string {
  return [salutation(letter.greeting, name), ...letter.paragraphs.map((p) => fillName(p, name)), 'Vici'].join('\n\n');
}
