/* GROUP day — put the mock account into the state the check-in frames are drawn
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
  user: { clerkUserId: uid, displayName: 'Jerry', createdAt: midnight - 12 * DAY, onboardingComplete: true, settings: { showStreak: false } },
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
    [key(dawn)]: { _id: 'd-c-1', userId: uid, date: key(dawn), mood: 4, energy: 3, dailyAction: 'Write down each trigger the moment you notice it.', dailyActionDone: true },
  },
  journalEntries: [
    { _id: 'd-j-1', userId: uid, tag: 'Pledge', title: 'Day 12 pledge', body: 'I keep my word after dark.', createdAt: dawn + 8 * 3600e3 },
    { _id: 'd-j-2', userId: uid, tag: 'Pledge', title: 'Day 13 pledge', body: 'I keep my word after dark.', createdAt: midnight + 8 * 3600e3 },
  ],
}));
setTimeout(() => location.reload(), 0);
