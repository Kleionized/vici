#!/usr/bin/env node
/**
 * The onboarding tail's dot fields, read off this drop's frames.
 *
 * Forked from `scripts/vicifull/gen-tail.mjs` and repointed at
 * `.overhaul/final/Email-Login/`. `Vici Overhaul` redrew all three cost boards
 * as circles in an svg, and retired the ring gauge, the ELO curve and the
 * eleven-star sky the previous generator transcribed (`Starting Score` is now a
 * tick gauge drawn from the score itself, so it needs no data):
 *
 *  - `29 · The Next 30 Days` (`Cost Next 30`): 30 circles, 6 across — the nine
 *    relapse days are the ones filled `#0D0D0D` (the rest `#111111`).
 *  - `30 · One Year From Now` (`Cost Next 365`): 365 circles, 25 across — a
 *    relapse day is `r="4.4"`, the rest `r="2.4"`.
 *  - `31 · If Nothing Changes` (`Cost By Age 80`): 33 × 71 circles over the
 *    whole frame — a bright dot is `r="2.6"`, a dim one `r="1.6"`.
 *
 * Both large fields are the designer's own LCG (`gen/mono-onboarding.js`:
 * `seed = (seed·9301 + 49297) mod 233280`; the year from seed 7, dark while
 * fewer than 110 and `rnd() < 0.31`; the age-80 field from seed 3, bright when
 * `rnd() < 0.3`, row by row). The run fails unless the LCG reproduces the
 * frames exactly — that is what licenses `AGE_80_NEXT_SEED`, the generator's
 * state after the frame's 2,343 draws, which the board continues from to fill
 * a screen larger than 393 × 852 without changing a dot the frame draws.
 *
 * Writes `src/content/onboardingTail.ts`.
 */
import fs from 'node:fs';

const read = (f) => fs.readFileSync(`.overhaul/final/Email-Login/${f}.html`, 'utf8');
// every frame also carries the status bar's own r 1.5 circle — not a day
const circles = (html, radii) =>
  [...html.matchAll(/<circle ([^>]*)>/g)]
    .map((m) => Object.fromEntries([...m[1].matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1], a[2]])))
    .filter((c) => radii.includes(c.r));

// 30
const c30 = circles(read('Cost-Next-30'), ['14']);
if (c30.length !== 30) throw new Error(`Cost Next 30: ${c30.length} circles`);
c30.forEach((c, i) => {
  if (+c.cx !== 22 + 58 * (i % 6) || +c.cy !== 22 + 50 * Math.floor(i / 6) || c.r !== '14') throw new Error('Cost Next 30 grid moved at ' + i);
});
const cost30 = c30.map((c) => c.fill === '#0D0D0D');

// 365
const c365 = circles(read('Cost-Next-365'), ['4.4', '2.4']);
if (c365.length !== 365) throw new Error(`Cost Next 365: ${c365.length} circles`);
c365.forEach((c, i) => {
  if (+c.cx !== 7 + (i % 25) * 13.8 || +c.cy !== 7 + Math.floor(i / 25) * 13.8) throw new Error('Cost Next 365 grid moved at ' + i);
});
const cost365 = c365.map((c) => c.r === '4.4');

// age 80
const c80 = circles(read('Cost-By-Age-80'), ['2.6', '1.6']);
if (c80.length !== 33 * 71) throw new Error(`Cost By Age 80: ${c80.length} circles`);
c80.forEach((c, i) => {
  if (+c.cx !== 6 + (i % 33) * 12 || +c.cy !== 6 + Math.floor(i / 33) * 12) throw new Error('Cost By Age 80 field moved at ' + i);
});
const age80 = c80.map((c) => c.r === '2.6');

// the designer's LCG must reproduce both large fields
let seed = 7;
const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
let dark = 0;
const lcg365 = Array.from({ length: 365 }, () => {
  const d = dark < 110 && rnd() < 0.31;
  if (d) dark++;
  return d;
});
if (lcg365.some((v, i) => v !== cost365[i])) throw new Error('the LCG does not reproduce Cost Next 365');
seed = 3;
const lcg80 = Array.from({ length: 33 * 71 }, () => rnd() < 0.3);
if (lcg80.some((v, i) => v !== age80[i])) throw new Error('the LCG does not reproduce Cost By Age 80');
const nextSeed = seed;

const score = Number((read('Starting-Score').match(/font-size="76"[^>]*>(\d+)</) || [])[1]);
if (!score) throw new Error('no sample score on Starting Score');

const bits = (a) => a.map((v) => (v ? '1' : '0')).join('');
const wrap = (s, n = 99) => s.match(new RegExp(`.{1,${n}}`, 'g')).map((l) => `  '${l}' +`).join('\n').replace(/ \+$/, '');
const out = [
  '/**',
  ' * The onboarding tail’s dot fields, read off the canvas.',
  ' *',
  ' * GENERATED FILE — do not edit by hand. Written by `scripts/overhaul/gen-tail.mjs`',
  ' * from `.overhaul/final/Email-Login/{Cost-Next-30,Cost-Next-365,Cost-By-Age-80}.html`.',
  ' * Re-run the generator instead.',
  ' */',
  '',
  "const bits = (s: string): boolean[] => [...s].map((c) => c === '1');",
  '',
  '/** `29 · The Next 30 Days` — 30 circles, 6 across; true is a relapse day (filled `#0D0D0D`). */',
  `export const COST_30: boolean[] = bits('${bits(cost30)}');`,
  '',
  '/** `30 · One Year From Now` — 365 circles, 25 across; true is a relapse day (`r 4.4`). */',
  'export const COST_365: boolean[] = bits(',
  wrap(bits(cost365)),
  ');',
  '',
  '/** `31 · If Nothing Changes` — 33 × 71 circles, row by row; true is a bright dot (`r 2.6`). */',
  'export const AGE_80_COLS = 33;',
  'export const AGE_80_ROWS = 71;',
  'export const AGE_80_FIELD: boolean[] = bits(',
  wrap(bits(age80)),
  ');',
  '',
  '/**',
  ' * The designer’s LCG state after the frame’s 2,343 draws (checked: the LCG from seed 3',
  ' * reproduces `AGE_80_FIELD` exactly). A screen larger than the frame continues from it,',
  ' * `seed = (seed·9301 + 49297) mod 233280`, bright when `seed/233280 < 0.3`.',
  ' */',
  `export const AGE_80_NEXT_SEED = ${nextSeed};`,
  '',
  '/** `28 · Your VICI Rating` — the frame’s sample number (D329: the app shows its own rating). */',
  `export const SCORE_SAMPLE = { score: ${score} };`,
  '',
].join('\n');
fs.writeFileSync('src/content/onboardingTail.ts', out);
console.log(
  `src/content/onboardingTail.ts — cost30 ${cost30.length} (${cost30.filter(Boolean).length} relapse), cost365 ${cost365.length} (${cost365.filter(Boolean).length}), age80 ${age80.length} (${age80.filter(Boolean).length} bright), next seed ${nextSeed}, sample ${score}`,
);
