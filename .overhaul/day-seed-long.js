/* GROUP day (Phase 2) — STRESS variant of day-seed.js: day 59, yesterday's row naming lesson 58's
   196-character task sentence (the longest, D339), and a five-line standing pledge, so the
   task check, the pledge board and the night action can be checked with the longest copy
   real data puts on them. Everything else is day-seed.js.

   day-seed.js: put the mock account into the state the check-in frames are drawn
   for: day 13, yesterday clean with one urge surfed, a pledge signed on both
   days, and Part III finished. `.overhaul/reseed.js` cannot be used here because
   nothing signs a mock user in when the capture opens /day/* directly.

   The name is the canvas's own: `Morning Pledge Signed` writes `Jerry` on the
   signature line (Lato 700 italic in the overhaul), and it is the only frame in
   the group that prints a name at all (FINDINGS F28 — seed what the frame draws rather than
   parking the row as sample data). */
const uid = 'day-seed-user';
const DAY = 86400000;
const midnight = new Date().setHours(0, 0, 0, 0);
const dawn = midnight - DAY;
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Jerry' } }));
localStorage.setItem('tideline.session.userId', uid);
/* the app keys check-ins on the LOCAL date, so this cannot go through toISOString */
const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Jerry', createdAt: midnight - 58 * DAY, onboardingComplete: true, settings: { showStreak: false } },
  progress: {
    'day-03': { userId: uid, lessonSlug: 'day-03', status: 'completed', completedAt: dawn + 20 * 3600e3, fitsMeRating: 4 },
    'day-04': { userId: uid, lessonSlug: 'day-04', status: 'completed', completedAt: midnight + 10 * 3600e3, fitsMeRating: 4 },
  },
  reflections: {},
  lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events: [
    { _id: 'd-1', userId: uid, type: 'urge_rode_out', createdAt: dawn + 15 * 3600e3, note: '' },
    { _id: 'd-2', userId: uid, type: 'urge_rode_out', createdAt: midnight + 11 * 3600e3, note: '' },
  ],
  checkins: {
    [key(dawn)]: { _id: 'd-c-1', userId: uid, date: key(dawn), mood: 4, energy: 3, dailyAction: 'Choose the step that fits: more everyday contact through a shared activity, a one-to-one conversation with a safe person, or support from someone available when you’re missing a particular person.', dailyActionDone: true },
  },
  journalEntries: [
    { _id: 'd-j-1', userId: uid, tag: 'Pledge', title: 'Day 12 pledge', body: 'The mornings are mine again.', createdAt: dawn + 8 * 3600e3 },
    { _id: 'd-j-2', userId: uid, tag: 'Pledge', title: 'Day 13 pledge', body: 'I keep the phone out of the bedroom, I go outside before I go online, and I call someone when the night gets long.', createdAt: midnight + 8 * 3600e3 },
  ],
}));
setTimeout(() => location.reload(), 0);
