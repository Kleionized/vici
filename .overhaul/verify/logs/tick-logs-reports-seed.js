window.__CLOCK_TICK = true;
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
/* GROUP logs — 91-3 Log Reports (Mon 21 Jul 2025, 09:00): five closed weeks since the
   account opened on Mon 16 Jun, moving the score +5, +6, −4, +8, +12 to 1,240 on the
   app's own weights (`scoreAt`: clean day 4, check-in 2, lesson 3, ride 2, slip −16 −4).
   The frame's +5 is odd, which only a lesson makes; 1,240 needs 213 points before the
   first report week — 105 rides and one lesson logged before the account opened (sample
   arithmetic, D097 style; nothing else reads them). */
(() => {
const at = window.__at, days = window.__days;
const events = [];
const ride = (s) => events.push({ type: 'urge_rode_out', createdAt: at(s), severity: 4, trigger: 'Stress', whatHelped: 'Rode it out', durationSeconds: 300 });
const slip = (s) => events.push({ type: 'lapse', createdAt: at(s), trigger: 'Late night' });
for (let i = 0; i < 105; i += 1) ride(`2025-06-${String(1 + Math.floor(i / 7)).padStart(2, '0')}T${String(8 + (i % 7)).padStart(2, '0')}:00`);
// W1 Jun 16–22: two slips, seven check-ins, a lesson   → +5
slip('2025-06-17T22:00'); slip('2025-06-20T22:00');
// W2 Jun 23–29: two slips, seven check-ins, two rides  → +6
slip('2025-06-24T22:00'); slip('2025-06-27T22:00'); ride('2025-06-25T20:00'); ride('2025-06-28T20:00');
// W3 Jun 30–Jul 6: two slips, four check-ins           → −4
slip('2025-07-01T22:00'); slip('2025-07-04T22:00');
// W4 Jul 7–13: one slip                               → +8
slip('2025-07-09T22:00');
// W5 Jul 14–20: one slip, two check-ins               → +12 → 1,240
slip('2025-07-16T22:00');
const checkins = [...days('2025-06-16', 7), ...days('2025-06-23', 7), ...days('2025-06-30', 4), '2025-07-18', '2025-07-19'].map((date) => ({ date, mood: 4, energy: 4 }));
const progress = {
  'seed-lesson-a': { userId: 'logs-seed-user', lessonSlug: 'seed-lesson-a', status: 'completed', completedAt: at('2025-06-10T09:00') },
  'seed-lesson-b': { userId: 'logs-seed-user', lessonSlug: 'seed-lesson-b', status: 'completed', completedAt: at('2025-06-18T09:00') },
};
window.__logsSeed({ createdAt: at('2025-06-16T08:00'), events, checkins, progress });
})();
