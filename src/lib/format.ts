/**
 * Text the frames print from data — numbers spelled out, day-part phrases, the
 * display join, short dates, roman numerals — written once so the screens that
 * share a phrase (Lapse, Slip, Urge Log, the hub, Score, Settings) cannot drift
 * apart (CRITIC G2).
 *
 * Dates are assembled by hand in en-US order, never through `toLocale*`: the
 * output must not depend on the device's locale or on the JS engine's Intl data
 * (`en-GB` prints "Sept"; Hermes builds without full ICU print other things).
 * Every function reads the **device-local** calendar and clock, the way the
 * user reads the screen.
 *
 * No imports — `scripts/overhaul/format-test.mjs` runs this file under plain
 * Node (type stripping) as its unit test.
 */

// ── numbers ──

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES: [number, string][] = [
  [1_000_000_000, 'billion'],
  [1_000_000, 'million'],
  [1_000, 'thousand'],
];

/** 0–99: `seven`, `nineteen`, `forty`, `twenty-three`. */
function under100(n: number): string {
  if (n < 20) return ONES[n];
  const t = TENS[Math.floor(n / 10)];
  return n % 10 ? `${t}-${ONES[n % 10]}` : t;
}

/** 1–999: `one hundred`, `one hundred and five`, `forty-two`. */
function under1000(n: number): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (!h) return under100(rest);
  return rest ? `${ONES[h]} hundred and ${under100(rest)}` : `${ONES[h]} hundred`;
}

/**
 * A whole number in words: `twenty-three`, `one hundred and five`,
 * `one thousand two hundred and forty`, `one thousand and one`;
 * `capital: true` for the start of a sentence (`Twenty-three ridden out.`).
 *
 * Compounds under a hundred are hyphenated (`forty-two`); hundreds take "and"
 * before the tens, as the app's British copy does (`programme`, `behaviour`).
 * Non-integers round; negatives read `minus …`.
 */
export function numberWords(value: number, { capital = false }: { capital?: boolean } = {}): string {
  const w = spell(Math.round(value));
  return capital ? capitalise(w) : w;
}

function spell(value: number): string {
  let n = value;
  if (!Number.isFinite(n)) return String(value);
  if (n < 0) return `minus ${spell(-n)}`;
  if (n === 0) return 'zero';
  const parts: string[] = [];
  for (const [size, name] of SCALES) {
    if (n >= size) {
      parts.push(`${spell(Math.floor(n / size))} ${name}`);
      n %= size;
    }
  }
  if (n) parts.push(parts.length && n < 100 ? `and ${under100(n)}` : under1000(n));
  return parts.join(' ');
}

/** `One minute`, `Twenty-two minutes` (`capital: false` → `twenty-two minutes`). */
export function minutesWords(minutes: number, { capital = true }: { capital?: boolean } = {}): string {
  const n = Math.round(minutes);
  const phrase = `${numberWords(n)} ${n === 1 ? 'minute' : 'minutes'}`;
  return capital ? capitalise(phrase) : phrase;
}

/** `1,240` — en-US grouping, assembled by hand. */
export function groupDigits(value: number): string {
  const n = Math.round(value);
  const sign = n < 0 ? '-' : '';
  return sign + String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** `0 slips`, `1 slip`, `2 slips` (the plural defaults to `+s`). */
export function countOf(n: number, singular: string, plural = `${singular}s`): string {
  return `${groupDigits(n)} ${n === 1 ? singular : plural}`;
}

const NUMERALS: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

/** `Week XII`, `Part III`. Zero and negatives have no numeral — they print as digits. */
export function roman(value: number): string {
  let n = Math.round(value);
  if (n <= 0) return String(n);
  let out = '';
  for (const [v, s] of NUMERALS) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

// ── strings ──

export function capitalise(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/** First letter down, unless the word is `I` or an initialism (`TV`, `ADHD`). */
function lowerFirst(s: string): string {
  if (!s) return s;
  if (/^I\b/.test(s) || /^[A-Z]{2}/.test(s)) return s;
  return s[0].toLowerCase() + s.slice(1);
}

/**
 * The frames' display join: `Late night, boredom`, `Phone in bed, late night` —
 * `", "` and lower case after the first item (Lapse Done, Slip Logged, Urge Log
 * Done). Display only: stored values keep their `' · '` join.
 */
export function joinLower(items: readonly string[]): string {
  return items
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s, i) => (i === 0 ? s : lowerFirst(s)))
    .join(', ');
}

/** Splits a stored `' · '` join back into its items. */
export function splitStored(value: string | null | undefined): string[] {
  return (value ?? '').split(' · ').map((s) => s.trim()).filter(Boolean);
}

// ── dates ──

export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

type When = number | Date;
const at = (d: When) => (d instanceof Date ? d : new Date(d));

/** `Jul 22` */
export function shortDate(d: When): string {
  const x = at(d);
  return `${MONTHS_SHORT[x.getMonth()]} ${x.getDate()}`;
}

/** `Tue Jul 22` (no comma — the date row's form) */
export function weekdayDate(d: When): string {
  const x = at(d);
  return `${WEEKDAYS_SHORT[x.getDay()]} ${MONTHS_SHORT[x.getMonth()]} ${x.getDate()}`;
}

/** `Jul 22, 2025` */
export function shortDateYear(d: When): string {
  const x = at(d);
  return `${shortDate(x)}, ${x.getFullYear()}`;
}

/** `14 Mar 2026` — Edit Profile's "Started" row keeps the day-first form. */
export function dayMonthYear(d: When): string {
  const x = at(d);
  return `${x.getDate()} ${MONTHS_SHORT[x.getMonth()]} ${x.getFullYear()}`;
}

/**
 * `11:40 PM` — or `11:40 pm` with `lower` (the Log rows and the hub write the
 * meridiem lower case; the slip and lapse boards write it upper case).
 */
export function clockTime(d: When, { lower = false }: { lower?: boolean } = {}): string {
  const x = at(d);
  const h = x.getHours();
  const m = x.getMinutes();
  const mer = h < 12 ? 'AM' : 'PM';
  const out = `${h % 12 || 12}:${String(m).padStart(2, '0')} ${mer}`;
  return lower ? out.replace(mer, mer.toLowerCase()) : out;
}

/**
 * A week's span: `Jul 14–20`, or `Jun 30–Jul 6` across a month (en dash, no
 * spaces — the Weekly Report pill and the Log Reports rows).
 */
export function dateRange(from: When, to: When): string {
  const a = at(from);
  const b = at(to);
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) return `${shortDate(a)}–${b.getDate()}`;
  return `${shortDate(a)}–${shortDate(b)}`;
}

/** Whole calendar days from `d` to `now`, by the local calendar (0 = same day, 1 = yesterday). */
export function daysAgo(d: When, now: When = Date.now()): number {
  const a = at(d);
  const b = at(now);
  const da = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const db = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((db - da) / 86_400_000);
}

/** Evening begins here: an event at or after 18:00 is "tonight" / "last night". */
export const EVENING_HOUR = 18;

export type DayPart = 'Tonight' | 'Today' | 'Last night' | 'Yesterday';

/**
 * The day-part word for a moment, read against `now` (logs Q5, slip Q3 — the
 * same rule, derived from Lapse When's `Tonight, Tue Jul 22` and Lapse Done's
 * `Last night`): today → `Today`, or `Tonight` from 18:00; yesterday →
 * `Yesterday`, or `Last night` from 18:00; anything older (or later) → `null`.
 * The hour is the moment's own, not the reader's.
 */
export function dayPart(d: When, now: When = Date.now()): DayPart | null {
  const days = daysAgo(d, now);
  const evening = at(d).getHours() >= EVENING_HOUR;
  if (days === 0) return evening ? 'Tonight' : 'Today';
  if (days === 1) return evening ? 'Last night' : 'Yesterday';
  return null;
}

/** The date row: `Tonight, Tue Jul 22` · `Yesterday, Mon Jul 21` · `Sun Jul 20`. */
export function dayPartDate(d: When, now: When = Date.now()): string {
  const word = dayPart(d, now);
  return word ? `${word}, ${weekdayDate(d)}` : weekdayDate(d);
}

/**
 * The summary's "When": `Tonight, 11:40 PM` · `Last night, 11:40 PM` ·
 * `Jul 20, 9:05 PM` (`lower` for the lower-case meridiem). `withTime: false`
 * gives the phrase alone — Lapse Done's `Last night` — falling back to the date.
 */
export function dayPartTime(
  d: When,
  now: When = Date.now(),
  { lower = false, withTime = true }: { lower?: boolean; withTime?: boolean } = {},
): string {
  const word = dayPart(d, now);
  if (!withTime) return word ?? shortDate(d);
  return `${word ?? shortDate(d)}, ${clockTime(d, { lower })}`;
}
