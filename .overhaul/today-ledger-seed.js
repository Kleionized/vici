/* GENERATED: clock.js at Fri 18 Jul 2025 09:00 + today-ledger-body.js */
window.__CLOCK = '2025-07-18T09:00';
/*
 * clock.js — freeze the page's `Date` for a recipe (CRITIC G3).
 *
 * The frames print dates and day parts that only one moment can produce
 * (`Tonight, Tue Jul 22` + 11:40 PM; Today's Fri 18 Jul 2025 09:00; Your Vow
 * Page's 19 Jul 2026 …). This init script pins `Date` to that moment before the
 * app's first line runs, so a capture is the same tomorrow as today.
 *
 * Where the moment comes from, first match wins:
 *   1. `window.__CLOCK`  — set by a line above this file when it is concatenated
 *                          into a seed:  window.__CLOCK = '2025-07-22T23:40';
 *   2. `?now=`           — on the captured route:  /lapse?now=2025-07-22T23:40
 *   3. sessionStorage `vici.clock` — written by 1 or 2, so a reload (seeds that
 *                          end in `location.reload()`) keeps the same moment.
 * A value is a local date-time (`YYYY-MM-DDTHH:MM[:SS]`, read in the machine's
 * zone — always give the time: a bare `YYYY-MM-DD` is UTC midnight in JS) or
 * epoch milliseconds.
 *
 * Frozen by default: every `new Date()` / `Date.now()` returns the moment. Set
 * `window.__CLOCK_TICK = true` (or `?clock=tick`) to start the clock at the
 * moment and let it run — for flows that wait on elapsed time (the urge timer).
 * `performance.now()` and animation timestamps are never touched.
 *
 * Use:
 *   node scripts/overhaul/shot.mjs app "/lapse?now=2025-07-22T23:40" out.png --initseed=.overhaul/clock.js
 * or, with a dataset, a seed file that begins
 *   window.__CLOCK = '2025-07-22T23:40';
 * followed by this file's text, then the seed's own:
 *   cat <(echo "window.__CLOCK='2025-07-22T23:40';") .overhaul/clock.js .overhaul/lapse-seed.js > .overhaul/lapse-2340-seed.js
 *
 * `window.__clockNow()` returns the pinned epoch; `window.__RealDate` is the
 * original constructor.
 */
(function () {
  if (window.__RealDate) return; // installed already (two copies concatenated)
  var KEY = 'vici.clock';
  var spec = window.__CLOCK;
  var tick = window.__CLOCK_TICK === true;
  try {
    var q = new URLSearchParams(window.location.search);
    if (spec == null && q.get('now')) spec = q.get('now');
    if (q.get('clock') === 'tick') tick = true;
  } catch (e) {}
  if (spec == null) {
    try {
      var saved = JSON.parse(window.sessionStorage.getItem(KEY) || 'null');
      if (saved) {
        spec = saved.spec;
        tick = tick || !!saved.tick;
      }
    } catch (e) {}
  }
  if (spec == null || spec === '') return;

  var RealDate = window.Date;
  var origin = typeof spec === 'number' || /^\d+$/.test(String(spec)) ? Number(spec) : new RealDate(String(spec)).getTime();
  if (!isFinite(origin)) {
    console.error('clock.js: cannot read the moment ' + JSON.stringify(spec));
    return;
  }
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify({ spec: spec, tick: tick }));
  } catch (e) {}

  var start = RealDate.now();
  function now() {
    return tick ? origin + (RealDate.now() - start) : origin;
  }

  // A function rather than a class so `Date()` (no `new`) still returns a
  // string; `Reflect.construct` with `new.target` makes real Date objects, so
  // `instanceof Date` and every Date method keep working.
  function FakeDate() {
    var args = Array.prototype.slice.call(arguments);
    if (!new.target) return new RealDate(now()).toString();
    return Reflect.construct(RealDate, args.length ? args : [now()], new.target);
  }
  FakeDate.prototype = RealDate.prototype;
  Object.setPrototypeOf(FakeDate, RealDate); // Date.UTC, Date.parse
  FakeDate.now = now;
  // Look like `Date` to code that checks: `d.constructor === Date` (the shared
  // prototype still named the real one), `Date.name`, `Date.length`.
  Object.defineProperty(RealDate.prototype, 'constructor', { value: FakeDate, writable: true, configurable: true, enumerable: false });
  Object.defineProperty(FakeDate, 'name', { value: 'Date' });
  Object.defineProperty(FakeDate, 'length', { value: 7 });

  window.__RealDate = RealDate;
  window.__clockNow = now;
  window.Date = FakeDate;
})();
/* GROUP today — the account Score Detail Moves' ledger states (D134): 17 days
   alive, one slip on Jul 8, nine check-ins, four lessons, four urges ridden.
   Its header reads 1,086 · Deckhand I — the frame's header is another account.
   Used after clock.js (Fri 18 Jul 2025 09:00) by .overhaul/today-ledger-seed.js. */
(() => {
  const DAY = 86400000;
  const UID = 'today-ledger-user';
  const midnight = new Date().setHours(0, 0, 0, 0);
  const at = (daysAgo, hour = 21) => midnight - daysAgo * DAY + hour * 3600e3;
  const key = (t) => { const d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  let n = 0;
  const events = [];
  const ev = (type, createdAt, extra) => events.push(Object.assign({ _id: 'led-' + ++n, userId: UID, type, createdAt }, extra || {}));
  ev('lapse', at(10, 22), { severity: 5 });
  for (let i = 0; i < 4; i++) ev('urge_rode_out', at(2 + i * 3, 20), { severity: 5, trigger: 'Late night', precedingState: 'Bored', whatHelped: 'Left the room', reopens: 0 });
  const checkins = {};
  for (let i = 0; i < 9; i++) { const k = key(at(i)); checkins[k] = { _id: 'led-c-' + i, userId: UID, date: k, mood: 3, energy: 3, note: '' }; }
  const progress = {};
  ['day-11', 'day-10', 'day-09', 'day-08'].forEach((slug, i) => { progress[slug] = { userId: UID, lessonSlug: slug, status: 'completed', completedAt: at(i * 2, 8), fitsMeRating: 4 }; });
  const seed = { user: { clerkUserId: UID, displayName: 'Jerry', createdAt: midnight - 16 * DAY, onboardingComplete: true, settings: { showStreak: false } }, progress, reflections: {}, checkins, events, journalEntries: [], lifeMap: { userId: UID, values: [] } };
  localStorage.setItem('tideline.mock.users', JSON.stringify({ 'led@vici.app': { userId: UID, email: 'led@vici.app', password: 'x', displayName: 'Jerry' } }));
  localStorage.setItem('tideline.session.userId', UID);
  localStorage.setItem('tideline.mock.userdata.' + UID, JSON.stringify(seed));
  const mon = (t) => { const x = new Date(t); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
  localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(mon(midnight).getTime() - 7 * DAY)));
  localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now()));
})();
