window.__CLOCK = '2025-07-21T09:00';
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
/* GROUP logs — shared account scaffolding for the report seeds: `window.__logsSeed(
   { createdAt, events, checkins, progress })` writes the mock user and pre-meets the
   launch gates (check-in asked just now, the newest closed week's report seen). */
window.__logsSeed = ({ createdAt, events, checkins, progress }) => {
  const uid = 'logs-seed-user';
  const DAY = 86400000;
  const now = Date.now();
  const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const midnight = new Date(now).setHours(0, 0, 0, 0);
  localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
  localStorage.setItem('tideline.session.userId', uid);
  localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(now));
  const monday = midnight - ((new Date(midnight).getDay() + 6) % 7) * DAY;
  localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(monday - 7 * DAY)));
  let n = 0;
  localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
    user: { clerkUserId: uid, displayName: 'Marcus', createdAt, onboardingComplete: true, settings: { showStreak: false } },
    progress: progress || {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
    events: events.map((e) => Object.assign({ _id: 'seed-r-' + ++n, userId: uid }, e)),
    checkins: Object.fromEntries(checkins.map((c) => [c.date, Object.assign({ _id: 'seed-c-' + c.date, userId: uid, emotions: [], reasons: [] }, c)])),
    journalEntries: [],
  }));
};
window.__at = (s) => new Date(s).getTime();
window.__days = (from, count) => Array.from({ length: count }, (_, i) => { const d = new Date(from + 'T12:00'); d.setDate(d.getDate() + i); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
/* GROUP logs — 91C Weekly Report · Score (and 93D Settings Weekly Report), week Jul 14–20,
   read on Mon 21 Jul 2025 09:00. The frame's line (y 108, 93.3, 78.7, 71.3, 49.3, 34.7, 20)
   is day-end scores rising 0, 8, 16, 20, 32, 40, 48 above Monday, and its caption is +12 on
   1,240 — on the app's weights that is a Monday with two slips (−36), then +8 (check-in and a
   ride), +8, +4 (a clean day alone), +12 (check-in, three rides), +8, +8. The 1,228 it starts
   from is 28 days since the account opened (112) and 58 rides before the week (116). Sample
   arithmetic: the Days frame's "7 of 7" is its own seed (D126 style). */
(() => {
const at = window.__at, days = window.__days;
const events = [];
const ride = (s) => events.push({ type: 'urge_rode_out', createdAt: at(s), severity: 6, trigger: 'Stress', whatHelped: 'Rode it out', durationSeconds: 300 });
const slip = (s) => events.push({ type: 'lapse', createdAt: at(s), trigger: 'Late night' });
for (let i = 0; i < 58; i += 1) ride(`2025-06-${String(17 + Math.floor(i / 6)).padStart(2, '0')}T${String(9 + (i % 6)).padStart(2, '0')}:00`);
slip('2025-07-14T21:00'); slip('2025-07-14T23:00');
ride('2025-07-15T20:00'); ride('2025-07-16T20:00');
ride('2025-07-18T19:00'); ride('2025-07-18T20:00'); ride('2025-07-18T21:00');
ride('2025-07-19T20:00'); ride('2025-07-20T20:00');
const checkins = ['2025-07-15', '2025-07-16', '2025-07-18', '2025-07-19', '2025-07-20'].map((date) => ({ date, mood: 4, energy: 4 }));
window.__logsSeed({ createdAt: at('2025-06-16T08:00'), events, checkins });
})();
