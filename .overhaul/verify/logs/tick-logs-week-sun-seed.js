window.__CLOCK_TICK = true;
window.__CLOCK = '2025-07-20T21:30';
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
/* GROUP logs — the Log tab's world (91 / 91-2): Sun 20 Jul 2025, 21:30 (pinned above
   by `window.__CLOCK` + clock.js). This week (Mon 14 – Sun 20): urges Tue 23:40
   (Intense), Thu 15:10 (Mild), Fri 21:05 (Strong); last week: a lapse Sun 13 22:22 and
   an urge Wed 9 00:05 (Mild). Twelve mornings in a row (Jul 9 – 20), energies drawing
   the frame's 29.6 / 25.2 circles, words Steady · Flat · Good · Good · Calm. The same
   three urges are 91C3's week (`Tue · Thu · Fri`), so this world serves it from Jul 21. */
(() => {
const uid = 'logs-seed-user';
const DAY = 86400000, HOUR = 3600000, MIN = 60000;
const now = Date.now();
const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const at = (s) => new Date(s).getTime();
const midnight = new Date(now).setHours(0, 0, 0, 0);
const createdAt = at('2025-06-01T09:00');
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(now));
const monday = midnight - ((new Date(midnight).getDay() + 6) % 7) * DAY;
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(monday - 7 * DAY)));
let n = 0;
const ev = (type, when, extra) => Object.assign({ _id: 'seed-w-' + ++n, userId: uid, type, createdAt: at(when) }, extra);
const events = [
  ev('urge_rode_out', '2025-07-15T23:40', { severity: 8, trigger: 'Late night', whatHelped: 'Rode it out', durationSeconds: 240 }),
  ev('urge_rode_out', '2025-07-17T15:10', { severity: 4, trigger: 'Boredom', whatHelped: 'Surfed with the timer', durationSeconds: 360 }),
  ev('urge_rode_out', '2025-07-18T21:05', { severity: 6, trigger: 'Stress', whatHelped: 'Rode it out', durationSeconds: 420 }),
  ev('lapse', '2025-07-13T22:22', { trigger: 'Late night' }),
  ev('urge_rode_out', '2025-07-09T00:05', { severity: 4, trigger: 'Late night', whatHelped: 'Rode it out', durationSeconds: 300 }),
];
const checkins = {};
/* Jul 9 … Jul 20: energy 4 except Tue 15 and Fri 18 (3); the five newest read Steady
   (mood 3), Flat (night word), Good, Good (mood 4), Calm (night word) */
const WORDS = { '2025-07-20': { mood: 3 }, '2025-07-19': { mood: 3, emotions: ['Flat'] }, '2025-07-18': { mood: 4 }, '2025-07-17': { mood: 4 }, '2025-07-16': { mood: 4, emotions: ['Calm'] } };
for (let d = 9; d <= 20; d += 1) {
  const date = `2025-07-${String(d).padStart(2, '0')}`;
  const w = WORDS[date] || { mood: 4 };
  checkins[date] = { _id: 'seed-c-' + d, userId: uid, date, mood: w.mood, energy: d === 15 || d === 18 ? 3 : 4, emotions: w.emotions || [], reasons: [] };
}
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt, onboardingComplete: true, settings: { showStreak: false } },
  progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events, checkins, journalEntries: [],
}));
})();
