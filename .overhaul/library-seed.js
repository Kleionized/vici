/* GROUP library — the mock account on day 38, the day every one of the twenty-four
   Vici Overhaul week pages is drawn for: lessons 01–37 done, 38 current (Week VI,
   `Continue`), 39–84 upcoming. Promoted from
   .overhaul/understand/scratch-library/library-seed.js, plus the launch gates in
   `(app)/_layout` pre-satisfied: the week pages are the Library tab now (D240), so
   a capture lands inside `(app)` and would otherwise be pushed into the day
   check-in. `/week/N` redirects to `/library?week=N`. */
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
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt: midnight - 37 * DAY, onboardingComplete: true, settings: { showStreak: false } },
  progress: {},
  reflections: {},
  lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events: [],
  checkins: {},
  journalEntries: [],
}));
setTimeout(() => location.reload(), 0);
