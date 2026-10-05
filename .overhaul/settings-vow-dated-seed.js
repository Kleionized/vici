/* GROUP settings — Your Vow Page on the day its own two pills are true: `Signed Apr 18` and
   `Held for 92 days` coexist only on 19 Jul 2026 (Apr 18 + 92 days). Pinned to Sun 19 Jul
   2026 10:00, settings-vow-seed.js's `signed = midnight − 92 days` IS 18 Apr 2026.
   Generated: clock.js + settings-vow-seed.js. */
window.__CLOCK = '2026-07-19T10:00';
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
/* GROUP settings — the account `92C · Your Vow Page` is actually drawn for.

   `.overhaul/settings-seed.js` is Edit Profile's account: Sam Reyes, 36 days in,
   which holds `Current week · VI` on that card. This frame draws a different
   sample — the name signed in the hand is **Jerry** and the line under it reads
   **Held for 92 days.** — so the two cannot be one seed, and reading the vow's
   two live rows off Sam's account leaves them permanently unequal.

   Nothing else on the page is data: the vow line, the sun, the rule and the
   closing sentence are all fixed. So this seed exists only to put the frame's own
   two values on the screen and let them be compared instead of excused (F28). */
const uid = 'settings-vow-user';
const DAY = 86400000;
const midnight = new Date().setHours(0, 0, 0, 0);
/* dated to local midnight, not to a time of day: `Held for N days` floors the
   elapsed milliseconds, so an afternoon stamp reads 91 whenever the capture runs
   before that hour */
const signed = midnight - 92 * DAY;
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'jerry@example.com': { userId: uid, email: 'jerry@example.com', password: 'x', displayName: 'Jerry Adeyemi' } }));
localStorage.setItem('tideline.session.userId', uid);
/* the same two first-launch gates the group's main seed closes */
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now()));
const lastMonday = (() => {
  const d = new Date(midnight);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(lastMonday));
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: {
    clerkUserId: uid,
    displayName: 'Jerry Adeyemi',
    username: 'jerry',
    email: 'jerry@example.com',
    /* the vow is signed during onboarding, so the account and the vow start on
       the same day and the stamp reads Day 0 — which is what `The Vow` draws */
    createdAt: signed,
    onboardingComplete: true,
    settings: { showStreak: false },
  },
  progress: {},
  reflections: {},
  events: [],
  checkins: {},
  journalEntries: [
    { _id: 'v-j-vow', userId: uid, tag: 'Vow', title: 'Vow', body: 'I’m done letting the wave decide. One evening at a time, I take the watch back.', createdAt: signed },
  ],
}));
setTimeout(() => location.reload(), 0);
