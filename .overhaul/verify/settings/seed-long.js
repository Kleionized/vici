/* GROUP settings — Edit Profile and its two sheets on the day their own rows are true:
   `Started VICI · 14 Mar 2026` and `Current week · Week VI, Discipline` hold together only
   on 15–21 Apr 2026 (week VI of an account made on 14 Mar). Pinned to Sun 19 Apr 2026
   10:00, the main seed's `36 days back` IS 14 Mar 2026, so D121's contradiction does not
   arise in this capture. Generated: clock.js + settings-seed.js (re-run the cat in
   .overhaul/recipes/settings.json's note if either changes). */
window.__CLOCK = '2026-04-19T10:00';
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
/* GROUP settings — a signed-in mock account that lands straight on /settings and
   the pages it pushes. `.overhaul/reseed.js` cannot be used: nothing signs a mock
   user in when the capture opens /settings directly, and a post-load seed needs a
   reload that destroys the context shot.mjs drives from.

   The account carries the canvas's own sample identity (Sam Reyes, @sam,
   samuel.alexander.reyes@longcompanyname-example.com), an active (Yearly) membership, and enough history for Edit
   Profile's `Medallions · 10 of 12`. Those are capture-time values only — the
   app renders them from live data, it never hard-codes them.

   `tideline.checkinPromptAt` is stamped `now` because (app)/_layout pushes the
   morning/night check-in over the first launch of the hour, and that gate would
   otherwise cover every screen in this group. */
const uid = 'settings-seed-user';
const DAY = 86400000;
const midnight = new Date().setHours(0, 0, 0, 0);
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'samuel.alexander.reyes@longcompanyname-example.com': { userId: uid, email: 'samuel.alexander.reyes@longcompanyname-example.com', password: 'x', displayName: 'Samuel Alexander Reyes-Montgomery' } }));
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now()));
/* (app)/_layout also pushes `Report Ready` over the first launch after a week has
   closed with something in it, and this account has one. Marking last Monday seen
   is what the layout itself would write the first time; without it the gate covers
   Settings on roughly every other capture. */
const lastMonday = (() => {
  const d = new Date(midnight);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(lastMonday));
/* Settings.html samples the two pills as 8:00 AM / 9:30 PM. The app's own
   defaults are 7:00 AM / 10:30 PM, and 10:30 PM is what Settings-Check-in-Time
   parks its wheel on — the canvas disagrees with itself here, so neither value
   is authored. Seeding the sample keeps the captured text runs the frame's
   width; the defaults in src/lib/routines.ts are left alone. */
localStorage.setItem('tideline.routines.v2', JSON.stringify({ morning: { hour: 8, minute: 0, period: 'AM' }, night: { hour: 9, minute: 30, period: 'PM' } }));
/* the app keys check-ins on the LOCAL date, so this cannot go through toISOString */
const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const checkins = {};
const events = [];
for (let i = 1; i <= 8; i += 1) {
  const t = midnight - i * DAY;
  checkins[key(t)] = { _id: 'p-c-' + i, userId: uid, date: key(t), mood: 4, energy: 3 };
  /* six ride-outs clears Vici's first rung (5) and Logbook's (5); eight distinct
     recorded days clears Vidi's (7) */
  if (i <= 6) events.push({ _id: 'p-e-' + i, userId: uid, type: 'urge_rode_out', createdAt: t + 20 * 3600e3, note: '', severity: i === 1 ? 9 : 6 });
}
events.push({ _id: 'p-e-lapse', userId: uid, type: 'lapse', createdAt: midnight - 9 * DAY, note: '' });
/* Edit Profile draws "Medallions · 10 of 12" — the album's own count (src/lib/album.ts).
   The history above earns Veni, First light, Vidi (10 recorded days), Vici (6),
   Rebound (the check-in the morning after the lapse), Logbook and Pulse; the
   severity-9 ride-out adds Breakwater, this one slip logged adds Black Box, and
   the five finished lessons below add Lessons — ten. Archive (2 entries of 10)
   and Return (no 7-day gap) stay unearned. */
events.push({ _id: 'p-e-slip', userId: uid, type: 'urge_acted_on', createdAt: midnight - 3 * DAY + 21 * 3600e3, note: '', severity: 7 });
const progress = {};
for (let n = 1; n <= 5; n += 1) {
  const slug = 'day-' + String(n).padStart(2, '0');
  progress[slug] = { userId: uid, lessonSlug: slug, status: 'completed', completedAt: midnight - (36 - n) * DAY };
}
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  /* Edit Profile draws "Started VICI · 14 Mar 2026" and "Current week · VI ·
     Discipline" in the same card, and those two cannot both be seeded: the app
     derives the week from the sign-up date, and 14 Mar 2026 is 25 weeks back
     from this run's today. 36 days back is the reading that keeps the week on
     VI, which is the row with the more interesting content; the Started line
     then reads its own date. */
  user: {
    clerkUserId: uid,
    displayName: 'Samuel Alexander Reyes-Montgomery',
    username: 'sam',
    email: 'samuel.alexander.reyes@longcompanyname-example.com',
    createdAt: midnight - 10 * DAY + 9 * 3600e3,
    onboardingComplete: true,
    /* Data & privacy draws `Pause analytics` in its ON state and no other, so the
       capture has to be seeded into it; the app's own default is off. */
    /* `premium` is what the mock PurchasesProvider reads: Settings' `Manage
       subscription · Yearly` names the plan of an active membership. */
    settings: { showStreak: false, premium: true, pauseAnalytics: true, appLockFaceId: true, appLockOnLeave: true, hideSensitivePreviews: true },
  },
  progress,
  reflections: {},
  lifeMap: { userId: uid, values: ['Presence', 'Health', 'Honesty'], updatedAt: midnight },
  events,
  checkins,
  /* under Archive's first rung (10), which stays unearned */
  journalEntries: [
    { _id: 'p-j-1', userId: uid, tag: 'Pledge', title: 'Pledge', body: 'The mornings are mine again.', createdAt: midnight - 2 * DAY },
    /* Your Vow Page reads the Vow entry for both the line and the signing date */
    { _id: 'p-j-vow', userId: uid, tag: 'Vow', title: 'Vow', body: 'I’m done letting the wave decide. One evening at a time, I take the watch back.', createdAt: midnight - 36 * DAY + 9 * 3600e3 },
  ],
}));
setTimeout(() => location.reload(), 0);
