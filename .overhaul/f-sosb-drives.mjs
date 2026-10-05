#!/usr/bin/env node
/**
 * sos-boards: write one drive per response board (`.overhaul/drives/b-SOS-<Key>.js`)
 * and the group's recipes (`.overhaul/recipes/sos-boards.json`).
 *
 * The drives walk `/urge` the way a person does (sos-boards §13). The flow's
 * own pages belong to sos-flow, who is renaming their labels in the same phase
 * (`Start the interrupt` → `Start`, `I’m up`/`I’ve left`/`Phone is away` →
 * `Continue`, `The First 90 Seconds` → `The first 90 seconds.`), so every step
 * accepts either wording. The pickers may become multi-select with a default
 * (D324: board = first selection in canvas order) — `only()` clears every
 * other checked chip before picking, so the board reached is the one named.
 *
 * Unreachable boards (D038: Loc-Bathroom, Loc-Home-Alone, Trig-Rejection) are
 * reached with the mock-only `?board=<key>` (D336).
 *
 * Usage: node .overhaul/f-sosb-drives.mjs
 */
import fs from 'node:fs';

const PRELUDE = `await __sleep(900);
const any = async (labels) => { let last; for (const l of labels) { try { await tap(l); return l; } catch (e) { last = e; } } throw last; };
const seen = async (needles, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = __txt(); if (needles.some((n) => t.includes(n))) return; await __sleep(90); } throw new Error('never saw ' + JSON.stringify(needles) + ' :: ' + __txt().slice(0, 200)); };
const only = async (label) => {
  const chips = [...document.querySelectorAll('[role="checkbox"],[role="radio"]')];
  for (const c of chips) if (c.getAttribute('aria-checked') === 'true' && c.textContent.trim() !== label) { __fire(c); await __sleep(200); }
  const me = chips.find((c) => c.textContent.trim() === label);
  if (!me || me.getAttribute('aria-checked') !== 'true') await tap(label);
};
await seen(['The first 90 seconds.', 'The First 90 Seconds']);
await any(['Start', 'Start the interrupt']);
await seen(['How strong is it right now?']);
await tap('Continue');
await seen(['Where are you right now?']);
`;

const PLACE = { 'SOS-Loc-Bed': 'In bed', 'SOS-Loc-Private-Room': 'Somewhere private', 'SOS-Loc-Work': 'At work or school', 'SOS-Loc-Public': 'A public space', 'SOS-Loc-Elsewhere': 'Out and about' };
const TRIGGER = {
  'SOS-Trig-Content': 'Something online',
  'SOS-Trig-Doomscroll': 'Doomscrolling',
  'SOS-Trig-Fantasy': 'A stuck fantasy',
  'SOS-Trig-Late-Phone': 'Phone in bed',
  'SOS-Trig-Habit': 'Pure habit',
  'SOS-Trig-Cant-Sleep': 'Can’t sleep',
  'SOS-Trig-Argument': 'An argument',
  'SOS-Trig-Alone': 'Being alone',
  'SOS-Trig-Unknown': 'I don’t know',
};
/** feeling board → [picker answer, "Give me another" presses] (FEELING_ROTATION order) */
const FEELING = {
  'SOS-Feel-Turned-On': ['Turned on', 0],
  'SOS-Feel-Bored': ['Bored', 0],
  'SOS-Feel-Lonely': ['Lonely', 0],
  'SOS-Feel-Stressed': ['Stressed or anxious', 0],
  'SOS-Feel-Anxious': ['Stressed or anxious', 1],
  'SOS-Feel-Angry': ['Angry', 0],
  'SOS-Feel-Low': ['Low', 0],
  'SOS-Feel-Rejected': ['Low', 1],
  'SOS-Feel-Tired': ['Tired', 0],
  'SOS-Feel-Restless': ['Restless', 0],
  'SOS-Feel-Numb': ['Restless', 1],
  'SOS-Feel-Ashamed': ['Restless', 2],
  'SOS-Feel-Unknown': ['I don’t know', 0],
  'SOS-Challenge': ['I don’t know', 1],
};
const UNREACHABLE = ['SOS-Loc-Bathroom', 'SOS-Loc-Home-Alone', 'SOS-Trig-Rejection'];

const boards = {};
for (const m of fs.readFileSync('src/content/sosResponses.ts', 'utf8').matchAll(/^  "(SOS-[A-Za-z-]+)": (\{.*\}),$/gm)) boards[m[1]] = JSON.parse(m[2]);
const first = (s) => s.split('\n')[0];
const q = (s) => JSON.stringify(s);

/** to the place board (Somewhere private unless named), then on through the three moves to the reason picker */
const toPlace = (place) => `await only(${q(place)});
await tap('Continue');
`;
const toReason = `await seen(['Open the door and move.']);
await any(['Continue', 'Door is open']);
await seen(['Move I of 3', 'Stand up.']);
await any(['Continue', 'I’m up']);
await seen(['Move II of 3', 'Leave the room.']);
await any(['Continue', 'I’ve left']);
await seen(['Move III of 3', 'Put the phone away.']);
await any(['Continue', 'Phone is away']);
await seen(['What’s feeding it right now?']);
`;

const drives = {};
for (const key of Object.keys(boards)) {
  const b = boards[key];
  let js = PRELUDE;
  if (PLACE[key]) {
    js += toPlace(PLACE[key]) + `await seen([${q(first(b.title))}]);\n`;
  } else if (TRIGGER[key]) {
    js += toPlace('Somewhere private') + toReason + `await only(${q(TRIGGER[key])});\nawait tap('Continue');\nawait seen([${q(first(b.title))}]);\n`;
  } else if (FEELING[key]) {
    const [feeling, presses] = FEELING[key];
    js += toPlace('Somewhere private') + toReason + `await only('Doomscrolling');\nawait tap('Continue');\nawait seen(['Get off the feed.']);\nawait tap('Continue');\nawait seen(['What’s underneath it?']);\nawait only(${q(feeling)});\nawait tap('Continue');\n`;
    const order = Object.entries(FEELING).filter(([, [f, n]]) => f === feeling && n <= presses).sort((x, y) => x[1][1] - y[1][1]);
    for (const [k, [, n]] of order) {
      js += `await seen([${q(first(boards[k].title))}]);\n`;
      if (n < presses) js += `await tap('Give me another');\n`;
    }
  } else if (!UNREACHABLE.includes(key)) {
    throw new Error('no path for ' + key);
  }
  if (!UNREACHABLE.includes(key)) {
    js += `await __sleep(300);\nreturn __txt().slice(0, 120);\n`;
    drives[key] = js;
  }
}
// rotation boards reached through a press must still see their own title last
for (const [key, js] of Object.entries(drives)) {
  fs.writeFileSync(`.overhaul/drives/b-${key}.js`, js);
}

const label = (k) => k.replace(/-/g, ' ');
const recipes = Object.keys(boards).map((key) => {
  const r = { frame: label(key), route: UNREACHABLE.includes(key) ? `/urge?board=${key}` : '/urge', wait: 1200 };
  if (UNREACHABLE.includes(key)) {
    r.note = 'D038: no picker answer reaches this board. The route is the mock-only ?board= deep link (D336, sos-flow\'s to land in urge.tsx/flow.tsx). Until it lands, the render proof is a temporary swap in boards.tsx boardFor() (Loc-Bed→Loc-Bathroom, Loc-Work→Loc-Home-Alone, Trig-Content→Trig-Rejection), the sibling drive with its waited title changed, then reverted — 0.00 % against the frame (D268).';
  } else {
    r.script = `.overhaul/drives/b-${key}.js`;
    if (FEELING[key]?.[1]) r.note = `rotation only: "${FEELING[key][0]}" then Give me another ×${FEELING[key][1]}`;
  }
  return r;
});
// the unframed screens this group owns (no frame: the audit skips these labels; kept so the next pass can reach them)
recipes.push(
  { frame: 'unframed: Rough days', route: '/rough-days', initseed: '.overhaul/settings-seed.js', wait: 2000, note: 'No frame (routes §4.6) — styled after Settings (D265). In-app: All → "Rough days". The seed signs a user in; the route is /rough-days, not /(app)/rough-days.' },
  { frame: 'unframed: Rough protocol', route: '/rough-protocol?key=homealone', initseed: '.overhaul/settings-seed.js', do: "await waitFor('Empty house.'); await tap('Walk through it'); await waitFor('The door is a switch.'); await tap('Next'); await waitFor('Change the room.')", wait: 1200, note: 'No frame — the SOS board (D266); page III is the tallest stack (act line + dots). ?key=lonely (All) opens Loneliness (D267).' },
);
fs.writeFileSync('.overhaul/recipes/sos-boards.json', JSON.stringify(recipes, null, 2) + '\n');
console.log(`${Object.keys(drives).length} drives, ${recipes.length} recipes`);
