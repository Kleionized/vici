window.__CLOCK = '2026-10-05T14:00';
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
/* GROUP weeks — put the mock account on day 12, which is the day every one of
   the twenty-four week boards is drawn for: lessons 01–11 done, 12 current,
   13–84 locked. `.overhaul/reseed.js` cannot be used here because nothing signs
   a mock user in when the capture opens /week/N directly, and its own account
   sits on day 54, which draws all twelve boards fully unlocked. */
const uid = 'weeks-seed-user';
const DAY = 86400000;
const midnight = new Date().setHours(0, 0, 0, 0);
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
localStorage.setItem('tideline.session.userId', uid);
/* `/week/[week]` counts the day as `floor((now − createdAt) / 86.4e6) + 1`, so
   eleven whole days back from this morning is day 12 whatever the clock says. */
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt: midnight - 11 * DAY, onboardingComplete: true, settings: { showStreak: false } },
  progress: {},
  reflections: {},
  lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events: [],
  checkins: {},
  journalEntries: [],
}));
setTimeout(() => location.reload(), 0);
