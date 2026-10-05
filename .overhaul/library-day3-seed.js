/* GROUP library — an account on day 3 with lesson 1 completed: /first-steps draws
   step 1 done, step 3 current (`Continue`), steps 4–6 locked; the week pages draw
   Week I with 01–02 done and 03 current. Otherwise identical to library-seed.js
   (launch gates pre-satisfied). */
const uid = 'library-seed-user';
const DAY = 86400000;
const now = Date.now();
const midnight = new Date(now).setHours(0, 0, 0, 0);
const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
localStorage.setItem('tideline.session.userId', uid);
/* the launch prompts: check-in asked within the hour, the newest weekly report seen */
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(now));
const monday = midnight - ((new Date(midnight).getDay() + 6) % 7) * DAY;
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(monday - 7 * DAY)));
/* the day counts as `floor((now − createdAt) / 86.4e6) + 1`, so thirty-seven whole
   days back from this morning is day 38 whatever the clock says */
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt: midnight - 2 * DAY, onboardingComplete: true, settings: { showStreak: false } },
  progress: { 'day-01': { userId: uid, lessonSlug: 'day-01', status: 'completed', completedAt: midnight - DAY } },
  reflections: {},
  lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events: [],
  checkins: {},
  journalEntries: [],
}));
setTimeout(() => location.reload(), 0);
