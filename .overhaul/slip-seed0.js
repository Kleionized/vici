/* GROUP slip (Overhaul run) — clock pinned to Tue 22 Jul 2025 23:40 and ticking from there
   (98C's date row reads “Tonight, Tue Jul 22”, its wheel 11 · 40 · PM, and 98E “Tonight, 11:40 PM”),
   then a signed-in mock account (Jerry, a pledge signed six days ago) with 0 slip(s) already on
   today's log — 98G / 98H / 98I are chosen by that count. Ticking, not frozen: RN's Animated
   timing reads Date.now(), so a frozen clock would leave the wheel and the press scale mid-move. */
window.__CLOCK = '2025-07-22T23:40'; window.__CLOCK_TICK = true;
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
/* GROUP slip — a signed-in mock account with 0 slip(s) already on today's log
   and a signed pledge, put into localStorage BEFORE the first paint.
   `--initseed` is what 98H and 98I need (they are chosen by that count) and
   what makes 98J show a name and a pledge line instead of being skipped. */
(() => {
  const uid = 'slip-seed-user';
  const midnight = new Date().setHours(0, 0, 0, 0);
  localStorage.setItem('tideline.mock.users', JSON.stringify({ 'slip@vici.app': { userId: uid, email: 'slip@vici.app', password: 'x', displayName: 'Jerry' } }));
  localStorage.setItem('tideline.session.userId', uid);
  localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
    user: { clerkUserId: uid, displayName: 'Jerry', createdAt: midnight - 12 * 86400000, onboardingComplete: true, settings: {} },
    progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
    events: Array.from({ length: 0 }, (_, i) => ({ _id: 's-' + i, userId: uid, type: 'lapse', createdAt: midnight + (9 + i) * 3600000, note: '' })),
    checkins: {},
    journalEntries: [{ _id: 's-p', userId: uid, tag: 'Pledge', title: 'Pledge', body: 'The mornings are mine again.', createdAt: midnight - 6 * 86400000 }],
  }));
})();
