/* GROUP settings, pass-2 recheck — `.vicifull/settings-seed.js` with the page
   clock frozen at 19 Apr 2026, 10:00 local.
   D121 held that `Started VICI · 14 Mar 2026` and `Current week · VI` cannot
   both hold "for any single today". They can: the app derives the week from
   `floor((now - createdAt)/7d) + 1`, so any today 35–41 days after 14 Mar 2026
   satisfies both, and 19 Apr 2026 is one. Freezing the clock is the same
   instrument F47 used to settle `The Vow`'s date line and the slip group used
   for its 23:40 wheel; every other value in the seed is written relative to
   `midnight`, so it all moves with the clock. */
(() => {
  const RealDate = Date;
  const target = new RealDate(2026, 3, 19, 10, 0, 0, 0).getTime();
  const delta = target - RealDate.now();
  function FrozenDate(...args) {
    if (!(this instanceof FrozenDate)) return new RealDate(RealDate.now() + delta).toString();
    return args.length === 0 ? new RealDate(RealDate.now() + delta) : new RealDate(...args);
  }
  FrozenDate.prototype = RealDate.prototype;
  FrozenDate.now = () => RealDate.now() + delta;
  FrozenDate.parse = RealDate.parse;
  FrozenDate.UTC = RealDate.UTC;
  window.Date = FrozenDate;
})();
const uid = 'settings-seed-user';
const DAY = 86400000;
const midnight = new Date().setHours(0, 0, 0, 0);
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@example.com': { userId: uid, email: 'sam@example.com', password: 'x', displayName: 'Sam Reyes' } }));
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
  if (i <= 6) events.push({ _id: 'p-e-' + i, userId: uid, type: 'urge_rode_out', createdAt: t + 20 * 3600e3, note: '' });
}
events.push({ _id: 'p-e-lapse', userId: uid, type: 'lapse', createdAt: midnight - 9 * DAY, note: '' });
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  /* Edit Profile draws "Started VICI · 14 Mar 2026" and "Current week · VI ·
     Discipline" in the same card, and those two cannot both be seeded: the app
     derives the week from the sign-up date, and 14 Mar 2026 is 25 weeks back
     from this run's today. 36 days back is the reading that keeps the week on
     VI, which is the row with the more interesting content; the Started line
     then reads its own date. */
  user: {
    clerkUserId: uid,
    displayName: 'Sam Reyes',
    username: 'sam',
    email: 'sam@example.com',
    createdAt: midnight - 36 * DAY + 9 * 3600e3,
    onboardingComplete: true,
    /* Data & privacy draws `Pause analytics` in its ON state and no other, so the
       capture has to be seeded into it; the app's own default is off. */
    settings: { showStreak: false, pauseAnalytics: true, appLockFaceId: true, appLockOnLeave: true, hideSensitivePreviews: true },
  },
  progress: {},
  reflections: {},
  lifeMap: { userId: uid, values: ['Presence', 'Health', 'Honesty'], updatedAt: midnight },
  events,
  checkins,
  /* under Archive's first rung (10), so the shelf earns seven of eight and the
     chip reads +3 */
  journalEntries: [
    { _id: 'p-j-1', userId: uid, tag: 'Pledge', title: 'Pledge', body: 'The mornings are mine again.', createdAt: midnight - 2 * DAY },
    /* Your Vow Page reads the Vow entry for both the line and the signing date */
    { _id: 'p-j-vow', userId: uid, tag: 'Vow', title: 'Vow', body: 'I’m done letting the wave decide. One evening at a time, I take the watch back.', createdAt: midnight - 36 * DAY + 9 * 3600e3 },
  ],
}));
setTimeout(() => location.reload(), 0);
