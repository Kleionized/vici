/* GROUP logs — the account `Urge Overview When` (91D · Timing) draws.

   The frame's band strip fills 2 dots for Late night, 2 for Evening and 1 for
   Afternoon — a FIVE-urge week, where `Urge Overview Summary` two frames earlier
   draws three. The pages are drawn from different samples (see the head of
   `.vicifull/logs-triggers-seed.js`), so each gets its own seed. This one puts
   the five where the frame's dots do, keeps the peak hour at 23 so the insight
   reads `11 pm – 1 am`, and logs Bedroom twice and Desk once for the place list.

   The frame's third place row — `3. Bathroom 0` — is NOT seedable: the list is a
   tally of the locations actually logged and a tally has no zero rows. */
const uid = 'logs-timing-user';
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

/* `tally` sorts by count and keeps insertion order on a tie, and the overview
   takes the store's own order, which is newest first — so the two Late nights
   have to be the most recent for the strip to run Late night · Evening ·
   Afternoon, and Bedroom the most recent place for the list to run Bedroom ·
   Desk. */
const rows = [
  [1, 23, 40, 'Bedroom'],
  [2, 23, 10, 'Bedroom'],
  [3, 20, 15, 'Desk'],
  [4, 19, 20, null],
  [5, 15, 10, null],
];
const events = rows.map(([d, h, m, place], i) => ({
  _id: 'seed-w-' + i,
  userId: uid,
  type: 'urge_rode_out',
  createdAt: midnight - d * DAY + h * HOUR + m * MIN,
  severity: 6,
  trigger: 'Stress',
  whatHelped: 'Rode it out',
  durationSeconds: 300,
  precedingState: place ? { feeling: 'Tense', location: place } : { feeling: 'Tense' },
}));

localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt, onboardingComplete: true, settings: { showStreak: false } },
  progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events, checkins: {}, journalEntries: [],
}));
