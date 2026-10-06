#!/usr/bin/env node
/**
 * Unit tests for src/lib/format.ts — run under plain Node (type stripping):
 *
 *   node scripts/overhaul/format-test.mjs
 *
 * Every expected string is either printed on a frame (cited) or follows the
 * rule a group doc derived from the frames (logs Q5/Q6, slip Q3, sos-flow Q8).
 * Dates are built from local components, so the run does not depend on the
 * machine's time zone.
 */
import assert from 'node:assert/strict';

// format.ts is ESM in a package without "type": "module"; Node reparses it and
// warns once — expected, so the warning is not printed.
process.removeAllListeners('warning');
const f = await import('../../src/lib/format.ts');

let n = 0;
const eq = (actual, expected, what) => {
  assert.equal(actual, expected, what ?? `${JSON.stringify(expected)}`);
  n++;
};

// ── numberWords ──
eq(f.numberWords(0), 'zero');
eq(f.numberWords(7), 'seven');
eq(f.numberWords(13), 'thirteen');
eq(f.numberWords(20), 'twenty');
eq(f.numberWords(22, { capital: true }), 'Twenty-two', 'Surf Complete — "Twenty-two minutes"');
eq(f.numberWords(23, { capital: true }), 'Twenty-three', 'Urge Log Done — "Twenty-three ridden out."');
eq(f.numberWords(2, { capital: true }), 'Two', 'Urge Log Done — "Two to Bronze."');
eq(f.numberWords(40), 'forty', 'Urge Hub Score — "past forty minutes"');
eq(f.numberWords(59), 'fifty-nine');
eq(f.numberWords(99), 'ninety-nine');
eq(f.numberWords(100), 'one hundred');
eq(f.numberWords(105), 'one hundred and five');
eq(f.numberWords(342), 'three hundred and forty-two');
eq(f.numberWords(999), 'nine hundred and ninety-nine');
eq(f.numberWords(1000), 'one thousand');
eq(f.numberWords(1001), 'one thousand and one');
eq(f.numberWords(1240), 'one thousand two hundred and forty');
eq(f.numberWords(12_345), 'twelve thousand three hundred and forty-five');
eq(f.numberWords(100_000), 'one hundred thousand');
eq(f.numberWords(2_100_005), 'two million one hundred thousand and five');
eq(f.numberWords(-3), 'minus three');
eq(f.numberWords(2.6), 'three');
eq(f.numberWords(1000, { capital: true }), 'One thousand');

// ── minutes, counts, grouping, roman ──
eq(f.minutesWords(22), 'Twenty-two minutes');
eq(f.minutesWords(1), 'One minute');
eq(f.minutesWords(40, { capital: false }), 'forty minutes');
eq(f.groupDigits(1240), '1,240', 'Today Home — "1,240"');
eq(f.groupDigits(842), '842');
eq(f.groupDigits(1_000_000), '1,000,000');
eq(f.groupDigits(-12_000), '-12,000');
eq(f.countOf(0, 'slip'), '0 slips', 'Morning 1 Yesterday — "0 slips"');
eq(f.countOf(1, 'slip'), '1 slip');
eq(f.countOf(3, 'day in a row', 'days in a row'), '3 days in a row');
eq(f.roman(1), 'I');
eq(f.roman(4), 'IV');
eq(f.roman(9), 'IX');
eq(f.roman(12), 'XII', 'Week XII');
eq(f.roman(14), 'XIV');
eq(f.roman(40), 'XL');
eq(f.roman(84), 'LXXXIV');
eq(f.roman(1994), 'MCMXCIV');
eq(f.roman(0), '0');

// ── joins ──
eq(f.joinLower(['Late night', 'Boredom']), 'Late night, boredom', 'Lapse Done — "Late night, boredom"');
eq(f.joinLower(['Phone in bed', 'Late night']), 'Phone in bed, late night', 'Slip Logged');
eq(f.joinLower(['Tired', 'Bored']), 'Tired, bored');
eq(f.joinLower(['Stress']), 'Stress');
eq(f.joinLower([]), '');
eq(f.joinLower(['Stress', 'TV in bed', 'I slipped']), 'Stress, TV in bed, I slipped', 'initialisms and "I" keep their case');
eq(f.joinLower([' Stress ', '', 'Lonely']), 'Stress, lonely');
assert.deepEqual(f.splitStored('Late night · Boredom'), ['Late night', 'Boredom']);
assert.deepEqual(f.splitStored(''), []);
assert.deepEqual(f.splitStored(undefined), []);
n += 3;
eq(f.joinLower(f.splitStored('Late night · Boredom')), 'Late night, boredom');

// ── dates ──
const tue2340 = new Date(2025, 6, 22, 23, 40); // Tue 22 Jul 2025 23:40 — the When frames' clock
const tue0915 = new Date(2025, 6, 22, 9, 15);
const tue1800 = new Date(2025, 6, 22, 18, 0);
const tue1759 = new Date(2025, 6, 22, 17, 59);
const mon2340 = new Date(2025, 6, 21, 23, 40);
const mon1000 = new Date(2025, 6, 21, 10, 0);
const sun2105 = new Date(2025, 6, 20, 21, 5);
const tue0010 = new Date(2025, 6, 22, 0, 10);
eq(f.shortDate(tue2340), 'Jul 22');
eq(f.weekdayDate(tue2340), 'Tue Jul 22');
eq(f.shortDateYear(tue2340), 'Jul 22, 2025');
eq(f.dayMonthYear(new Date(2026, 2, 14)), '14 Mar 2026', 'Edit Profile — "Started 14 Mar 2026"');
eq(f.shortDate(new Date(2025, 8, 3)), 'Sep 3', 'three letters, never "Sept"');
eq(f.clockTime(tue2340), '11:40 PM', 'Lapse When wheel — 11:40 PM');
eq(f.clockTime(tue2340, { lower: true }), '11:40 pm');
eq(f.clockTime(new Date(2025, 6, 22, 0, 5)), '12:05 AM');
eq(f.clockTime(new Date(2025, 6, 22, 12, 0)), '12:00 PM');
eq(f.clockTime(new Date(2025, 6, 22, 8, 0)), '8:00 AM', 'Morning Check-in Time default');
eq(f.clockTime(new Date(2025, 6, 22, 9, 5), { lower: true }), '9:05 am');
eq(f.dateRange(new Date(2025, 6, 14), new Date(2025, 6, 20)), 'Jul 14–20', 'Weekly Report — "Jul 14–20"');
eq(f.dateRange(new Date(2025, 5, 30), new Date(2025, 6, 6)), 'Jun 30 – Jul 6', 'Log Reports — "Jun 30 – Jul 6"');
eq(f.dateRange(new Date(2025, 11, 29), new Date(2026, 0, 4)), 'Dec 29 – Jan 4');
eq(f.daysAgo(mon2340, tue0915), 1);
eq(f.daysAgo(tue0010, tue2340), 0);
eq(f.daysAgo(sun2105, tue0915), 2);
eq(f.daysAgo(new Date(2025, 2, 29, 12), new Date(2025, 2, 31, 12)), 2, 'across a DST change');

// ── day parts ──
eq(f.dayPart(tue2340, tue2340), 'Tonight');
eq(f.dayPart(tue1800, tue2340), 'Tonight');
eq(f.dayPart(tue1759, tue2340), 'Today');
eq(f.dayPart(tue0915, tue2340), 'Today');
eq(f.dayPart(tue0010, tue2340), 'Today', 'the moment’s own hour decides, not the reader’s');
eq(f.dayPart(mon2340, tue2340), 'Last night', 'Lapse Done — "When · Last night"');
eq(f.dayPart(mon1000, tue2340), 'Yesterday');
eq(f.dayPart(sun2105, tue2340), null);
eq(f.dayPart(new Date(2025, 6, 23, 9, 0), tue2340), null, 'a future day has no word');
eq(f.dayPartDate(tue2340, tue2340), 'Tonight, Tue Jul 22', 'Lapse/Slip/Urge Log When — date row');
eq(f.dayPartDate(mon1000, tue2340), 'Yesterday, Mon Jul 21');
eq(f.dayPartDate(sun2105, tue2340), 'Sun Jul 20');
eq(f.dayPartTime(tue2340, tue2340), 'Tonight, 11:40 PM', 'Slip Logged — "Tonight, 11:40 PM"');
eq(f.dayPartTime(mon2340, tue2340), 'Last night, 11:40 PM');
eq(f.dayPartTime(sun2105, tue2340), 'Jul 20, 9:05 PM', 'slip Q3 — older: date, time');
eq(f.dayPartTime(sun2105, tue2340, { lower: true }), 'Jul 20, 9:05 pm');
eq(f.dayPartTime(mon2340, tue2340, { withTime: false }), 'Last night', 'Lapse Done — phrase alone');
eq(f.dayPartTime(sun2105, tue2340, { withTime: false }), 'Jul 20');

console.log(`format.ts: ${n} checks passed`);
