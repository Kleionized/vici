/* GROUP library — put the mock account on day 38, which is the day every one of
   the twenty-four Vici Overhaul week pages is drawn for: lessons 01–37 done,
   38 current (Week VI, `Continue`), 39–84 upcoming. `.overhaul/reseed.js`
   cannot be used here because nothing signs a mock user in when the capture
   opens /week/N directly, and its own account sits on day 54. */
const uid = 'library-seed-user';
const DAY = 86400000;
const midnight = new Date().setHours(0, 0, 0, 0);
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
localStorage.setItem('tideline.session.userId', uid);
/* `/week/[week]` counts the day as `floor((now − createdAt) / 86.4e6) + 1`, so
   thirty-seven whole days back from this morning is day 38 whatever the clock says. */
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt: midnight - 37 * DAY, onboardingComplete: true, settings: { showStreak: false } },
  progress: {},
  reflections: {},
  lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events: [],
  checkins: {},
  journalEntries: [],
}));
setTimeout(() => location.reload(), 0);
