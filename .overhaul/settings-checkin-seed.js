/* GROUP settings — the account `92B · Settings Check-in Time` is drawn for.

   The canvas contradicts itself across the two frames that state the night time:
   `Settings` draws the pill `9:30 PM` and `Settings Check-in Time` parks its
   wheel on `10:30 PM`. Neither is authored, so neither is written into
   `src/lib/routines.ts`; each capture seeds the value its own frame draws
   (D120). This one is the wheel's — `.overhaul/settings-seed.js` is the pill's.

   Everything else on the board is fixed or defaulted: the seven day chips are
   `EVERY_DAY` out of the box, which is what the frame draws. */
const uid = 'settings-seed-user';
const midnight = new Date().setHours(0, 0, 0, 0);
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@example.com': { userId: uid, email: 'sam@example.com', password: 'x', displayName: 'Sam Reyes' } }));
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now()));
const lastMonday = (() => {
  const d = new Date(midnight);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(lastMonday));
localStorage.setItem('tideline.routines.v2', JSON.stringify({ morning: { hour: 8, minute: 0, period: 'AM' }, night: { hour: 10, minute: 30, period: 'PM' } }));
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Sam Reyes', username: 'sam', email: 'sam@example.com', createdAt: midnight - 36 * 86400000, onboardingComplete: true, settings: { showStreak: false } },
  progress: {}, reflections: {}, events: [], checkins: {}, journalEntries: [],
}));
setTimeout(() => location.reload(), 0);
