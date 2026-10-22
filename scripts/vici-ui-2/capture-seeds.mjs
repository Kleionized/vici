// Runs the previous run's web seed scripts (.overhaul/*-seed.js) in Node with a
// stand-in localStorage, sessionStorage and window, and writes what each one
// stores to pixel-diff/seeds/<name>.json as { clock, kv }. The harness server
// hands these to the app (src/dev/HarnessDriver.tsx), which writes them into
// its own storage — the same keys the mock backend reads on every platform.
//
//   node scripts/vici-ui-2/capture-seeds.mjs [nameFilter]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { CLOCK } from './common.mjs';

const DIR = '.overhaul';
const OUT = 'pixel-diff/seeds';
const filter = process.argv[2] ?? '';
fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(DIR).filter((f) => (/seed.*\.js$/.test(f) || ['f-funnel-user.js', 'f-pw-sub-dated.js'].includes(f)) && f.includes(filter));
for (const f of files) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  const kv = {};
  const session = {};
  const store = (bag) => ({
    getItem: (k) => (k in bag ? bag[k] : null),
    setItem: (k, v) => { bag[k] = String(v); },
    removeItem: (k) => { delete bag[k]; },
    clear: () => { for (const k of Object.keys(bag)) delete bag[k]; },
  });
  // a seed that names no moment of its own is written at the renders' clock (D4), and says so
  const clockOf = (src.match(/window\.__CLOCK\s*=\s*['"]([^'"]+)['"]/) ?? [])[1] ?? CLOCK.slice(0, 16);
  const RealDate = Date;
  const frozen = clockOf ? new RealDate(clockOf).getTime() : null;
  class FrozenDate extends RealDate {
    constructor(...a) { if (a.length) super(...a); else super(frozen ?? RealDate.now()); }
    static now() { return frozen ?? RealDate.now(); }
  }
  const win = { localStorage: store(kv), sessionStorage: store(session), location: { reload() {}, search: '', href: 'http://localhost/' }, addEventListener() {}, document: { readyState: 'complete', addEventListener() {}, createElement: () => ({ style: {} }), head: { appendChild() {} }, documentElement: { appendChild() {} } } };
  const ctx = { ...win, window: win, Date: FrozenDate, setTimeout: () => 0, clearTimeout() {}, console, JSON, Math, Object, Array, String, Number };
  win.Date = FrozenDate;
  vm.createContext(ctx);
  try {
    vm.runInContext(src, ctx, { filename: f, timeout: 5000 });
  } catch (e) {
    console.log(`${f}: ${e.message}`);
    continue;
  }
  const name = f.replace(/\.js$/, '');
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify({ clock: clockOf, kv }, null, 1));
  console.log(`${name}: ${Object.keys(kv).length} keys${clockOf ? `, clock ${clockOf}` : ''}`);
}

// Seeds whose pledge is the frames' sample sentence, written with that sentence
// as the user's own (D37): the app never shows the sample itself as anyone's
// pledge (D475), so these carry it with a zero-width space after it — drawn
// the same, and not the sample to the app.
const SAMPLE = 'The mornings are mine again.';
for (const name of ['day-seed', 'vday-seed-d1', 'today-2000-seed']) {
  const at = path.join(OUT, `${name}.json`);
  if (!fs.existsSync(at)) continue;
  const seed = JSON.parse(fs.readFileSync(at, 'utf8'));
  for (const k of Object.keys(seed.kv)) seed.kv[k] = seed.kv[k].split(SAMPLE).join(`${SAMPLE}\u200B`);
  fs.writeFileSync(path.join(OUT, `${name}-own.json`), JSON.stringify(seed, null, 1));
  console.log(`${name}-own: the sample pledge as his own`);
}

// The overview's urges as the SOS records them now (D9): what helped is the
// task done, with the strength after it. `91B` draws three tasks — walking
// indoors three times (4 → 2), the device down twice (3 → 2), a different
// chair once (3 → 1) — over the nine urges the old seed logs.
{
  const at = path.join(OUT, 'logs-overview-seed.json');
  if (fs.existsSync(at)) {
    const seed = JSON.parse(fs.readFileSync(at, 'utf8'));
    const key = Object.keys(seed.kv).find((k) => k.startsWith('tideline.mock.userdata.'));
    const data = JSON.parse(seed.kv[key]);
    const plan = [
      ['Walk indoors for three minutes', 8, 4],
      ['Walk indoors for three minutes', 8, 4],
      ['Walk indoors for three minutes', 8, 4],
      ['Put the device down for three minutes', 6, 4],
      ['Put the device down for three minutes', 6, 4],
      ['Sit in a different chair for three minutes', 6, 2],
    ];
    let i = 0;
    for (const e of data.events) {
      if (e.type !== 'urge_rode_out') continue;
      const p = plan[i++];
      if (p) Object.assign(e, { whatHelped: p[0], severity: p[1], severityAfter: p[2] });
      else delete e.whatHelped;
    }
    seed.kv[key] = JSON.stringify(data);
    fs.writeFileSync(path.join(OUT, 'logs-overview-sos.json'), JSON.stringify(seed, null, 1));
    console.log('logs-overview-sos: the urges as the SOS records them');
  }
}

// The weekly report's week as `Vici UI 2` draws it (91C … 91C6): the
// programme begun Monday Jul 7 2025, so Jul 14–20 is its second week and the
// third ("In the Moment") opens next; Tuesday's urge was in bed; walking
// indoors helped twice (4 → 2 both times) and the device down once (3 → 2);
// three journal entries, Wednesday night's what he was proud of. The slip
// week (91C6) is Jun 30 – Jul 6 with one slip, Friday 11:52 pm, logged that night.
{
  const at = path.join(OUT, 'logs-wr-urges-seed.json');
  if (fs.existsSync(at)) {
    const base = JSON.parse(fs.readFileSync(at, 'utf8'));
    const key = Object.keys(base.kv).find((k) => k.startsWith('tideline.mock.userdata.'));
    const uid = base.kv['tideline.session.userId'];
    const local = (y, m, d, h = 0, min = 0) => new Date(y, m - 1, d, h, min).getTime();
    const write = (name, edit, clock = base.clock) => {
      const seed = JSON.parse(JSON.stringify(base));
      const data = JSON.parse(seed.kv[key]);
      edit(data);
      seed.kv[key] = JSON.stringify(data);
      seed.clock = clock;
      fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(seed, null, 1));
      console.log(`${name}: the weekly report's week`);
    };
    const on = (data, y, m, d, h, min) => data.events.find((e) => e.createdAt === local(y, m, d, h, min));
    write('logs-wr-story', (data) => {
      data.user.createdAt = local(2025, 7, 7);
      Object.assign(on(data, 2025, 7, 15, 23, 40), { precedingState: { location: 'In bed' }, whatHelped: 'Walk indoors for three minutes', severity: 8, severityAfter: 4 });
      Object.assign(on(data, 2025, 7, 17, 15, 10), { whatHelped: 'Put the device down for three minutes', severity: 6, severityAfter: 4 });
      Object.assign(on(data, 2025, 7, 18, 21, 5), { whatHelped: 'Walk indoors for three minutes', severity: 8, severityAfter: 4 });
      const entry = (n, tag, title, body, ms) => ({ _id: `wr-j${n}`, userId: uid, tag, title, body, createdAt: ms, updatedAt: ms });
      data.journalEntries = [
        entry(1, 'Reflection', 'Day 8', 'Sam called at the right moment…', local(2025, 7, 14, 21, 40)),
        entry(2, 'Proud of', 'Day 10', 'Went for a run instead of scrolling in bed.', local(2025, 7, 16, 21, 35)),
        entry(3, 'Goal', 'Day 12 goal', 'Finish the essay draft before lunch.', local(2025, 7, 18, 8, 10)),
        ...(data.journalEntries ?? []),
      ];
    });
    write('logs-wr-slip', (data) => {
      data.events.push({ _id: 'wr-slip', userId: uid, type: 'lapse', createdAt: local(2025, 7, 4, 23, 52), trigger: 'Late night', relapse: { when: 'now', approx: true, causes: [] } });
    });
  }
}
