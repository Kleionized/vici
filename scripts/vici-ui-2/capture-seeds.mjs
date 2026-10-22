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

const DIR = '.overhaul';
const OUT = 'pixel-diff/seeds';
const filter = process.argv[2] ?? '';
fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(DIR).filter((f) => /seed.*\.js$/.test(f) && f.includes(filter));
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
  const clockOf = (src.match(/window\.__CLOCK\s*=\s*['"]([^'"]+)['"]/) ?? [])[1] ?? null;
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
