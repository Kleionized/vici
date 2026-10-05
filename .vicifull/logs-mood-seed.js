/* GROUP logs — the account `Urge Overview Mood` (91C · Mood) draws, as far as it
   can be drawn.

   The frame's four shares are 70 / 45 / 30 / 15 %, which sum to 160. The app
   records ONE preceding feeling per urge (`precedingState.feeling`), so the four
   shares of one week must sum to 100 and the frame's set is unreachable from any
   account — see DECISIONS D126. This seed gets the four labels, their order,
   their tones, the row geometry and the insight card (`Tense first`, `7 in 10
   urges`) exactly right on twenty urges, and leaves the three trailing percents
   as the only difference: Tense 14/20 = 70 %, Flat 3, Restless 2, Low 1. */
const uid = 'logs-mood-user';
const DAY = 86400000;
const HOUR = 3600000;
const now = Date.now();
const midnight = new Date(now).setHours(0, 0, 0, 0);
const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const createdAt = midnight - 41 * DAY;

localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(now));
const monday = midnight - ((new Date(midnight).getDay() + 6) % 7) * DAY;
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(monday - 7 * DAY)));

const FEELINGS = [].concat(Array(14).fill('Tense'), Array(3).fill('Flat'), Array(2).fill('Restless'), ['Low']);
const events = FEELINGS.map((feeling, i) => ({
  _id: 'seed-m-' + i,
  userId: uid,
  type: 'urge_rode_out',
  createdAt: midnight - (i % 6) * DAY - HOUR - i * 37000,
  severity: 6,
  trigger: 'Stress',
  whatHelped: 'Rode it out',
  durationSeconds: 300,
  precedingState: { feeling, location: 'Bedroom' },
}));

localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt, onboardingComplete: true, settings: { showStreak: false } },
  progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events, checkins: {}, journalEntries: [],
}));
