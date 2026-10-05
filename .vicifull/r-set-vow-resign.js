/* GROUP settings — the account `92C · Your Vow Page` is actually drawn for.

   `.vicifull/settings-seed.js` is Edit Profile's account: Sam Reyes, 36 days in,
   which holds `Current week · VI` on that card. This frame draws a different
   sample — the name signed in the hand is **Jerry** and the line under it reads
   **Held for 92 days.** — so the two cannot be one seed, and reading the vow's
   two live rows off Sam's account leaves them permanently unequal.

   Nothing else on the page is data: the vow line, the sun, the rule and the
   closing sentence are all fixed. So this seed exists only to put the frame's own
   two values on the screen and let them be compared instead of excused (F28). */
const uid = 'settings-vow-user';
const DAY = 86400000;
const midnight = new Date().setHours(0, 0, 0, 0);
/* dated to local midnight, not to a time of day: `Held for N days` floors the
   elapsed milliseconds, so an afternoon stamp reads 91 whenever the capture runs
   before that hour */
const signed = midnight - 92 * DAY;
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'jerry@example.com': { userId: uid, email: 'jerry@example.com', password: 'x', displayName: 'Jerry Adeyemi' } }));
localStorage.setItem('tideline.session.userId', uid);
/* the same two first-launch gates the group's main seed closes */
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now()));
const lastMonday = (() => {
  const d = new Date(midnight);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(lastMonday));
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: {
    clerkUserId: uid,
    displayName: 'Jerry Adeyemi',
    username: 'jerry',
    email: 'jerry@example.com',
    /* the vow is signed during onboarding, so the account and the vow start on
       the same day and the stamp reads Day 0 — which is what `The Vow` draws */
    createdAt: signed - 30 * DAY,
    onboardingComplete: true,
    settings: { showStreak: false },
  },
  progress: {},
  reflections: {},
  events: [],
  checkins: {},
  journalEntries: [
    { _id: 'v-j-vow', userId: uid, tag: 'Vow', title: 'Vow', body: 'I’m done letting the wave decide. One evening at a time, I take the watch back.', createdAt: signed },
  ],
}));
setTimeout(() => location.reload(), 0);
