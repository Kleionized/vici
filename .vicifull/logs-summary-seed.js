/* GROUP logs — the account `Urge Overview Summary` (91B) draws: three urges in
   the rolling week at Strong intensity, two ridden out (4 and 6 minutes) and the
   third ending in a slip, read forward. The four overview pages are drawn from
   different samples — this one contradicts the triggers page's 29 and the timing
   page's 5 — so each has its own seed; see `.vicifull/logs-triggers-seed.js`. */
const uid = 'logs-sum-user';
const DAY = 86400000;
const HOUR = 3600000;
const MIN = 60000;
const now = Date.now();
const midnight = new Date(now).setHours(0, 0, 0, 0);
const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const createdAt = midnight - 41 * DAY;

localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(now));
const monday = midnight - ((new Date(midnight).getDay() + 6) % 7) * DAY;
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(monday - 7 * DAY)));

const events = [
  { _id: 'seed-s-3', type: 'urge_acted_on', createdAt: midnight - 1 * DAY + 4 * MIN, severity: 6, trigger: 'Late night', precedingState: { feeling: 'Tense', location: 'Bedroom' } },
  { _id: 'seed-s-2', type: 'urge_rode_out', createdAt: midnight - 2 * DAY + 23 * HOUR + 26 * MIN, severity: 6, trigger: 'Stress', whatHelped: 'Rode it out', durationSeconds: 360, precedingState: { feeling: 'Tense', location: 'Bedroom' } },
  { _id: 'seed-s-1', type: 'urge_rode_out', createdAt: midnight - 4 * DAY + 19 * HOUR + 42 * MIN, severity: 6, trigger: 'Boredom', whatHelped: 'Rode it out', durationSeconds: 240, precedingState: { feeling: 'Tense', location: 'Desk' } },
].map((e) => Object.assign({ userId: uid }, e));

localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt, onboardingComplete: true, settings: { showStreak: false } },
  progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events, checkins: {}, journalEntries: [],
}));
