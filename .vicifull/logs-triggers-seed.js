/* GROUP logs — the account `Urge Overview` (037 · Common triggers) draws.

   The log family's frames are not one account: `Urge Overview Summary` draws a
   three-urge week (`2 of 3` ridden out, one ending in a slip) while the triggers
   page on the very next frame draws bars at 100 % / 62 % / 34 %, a ramp no
   three-urge week can produce — `Math.round(count / max * 100)` off three urges
   can only be 100, 67 and 33. So the two pages of one screen are drawn from
   different samples, and a seed has to pick one. This one serves the triggers
   page: 29 urges in the rolling week, every one tagged Stress, 18 also Boredom,
   10 also Tired, which tallies 29 / 18 / 10 = 100 % / 62 % / 34 % exactly. All
   of them land after 10 pm so the insight reads the canvas's `Most land after
   10 pm.` Use `.vicifull/logs-seed.js` for the summary page instead. */
const uid = 'logs-trig-user';
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

const events = [];
for (let i = 0; i < 29; i++) {
  /* spread over the last six days so every one is inside the rolling week, and
     all at 23:10 so the timing band is unambiguous */
  const at = midnight - (i % 6) * DAY - 1 * HOUR + 10 * 60000 - (i * 37) * 1000;
  const triggers = ['Stress'];
  if (i < 18) triggers.push('Boredom');
  if (i < 10) triggers.push('Tired');
  events.push({ _id: 'seed-t-' + i, userId: uid, type: 'urge_rode_out', createdAt: at, severity: 6, trigger: triggers.join(' · '), whatHelped: 'Rode it out', durationSeconds: 300, precedingState: { feeling: 'Tense', location: 'Bedroom' } });
}

localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt, onboardingComplete: true, settings: { showStreak: false } },
  progress: {},
  reflections: {},
  lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events,
  checkins: {},
  journalEntries: [],
}));
