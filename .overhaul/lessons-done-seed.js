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

/* lessons: lesson 5 already completed two days ago (to prove `Finish lesson` does not re-stamp it) */
(() => {
  const k = 'tideline.mock.userdata.weeks-seed-user';
  const d = JSON.parse(localStorage.getItem(k));
  d.progress['day-05'] = { userId: 'weeks-seed-user', lessonSlug: 'day-05', status: 'completed', completedAt: Date.now() - 2 * 86400000 };
  localStorage.setItem(k, JSON.stringify(d));
})();
