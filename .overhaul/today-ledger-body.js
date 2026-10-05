/* GROUP today — the account Score Detail Moves' ledger states (D134): 17 days
   alive, one slip on Jul 8, nine check-ins, four lessons, four urges ridden.
   Its header reads 1,086 · Deckhand I — the frame's header is another account.
   Used after clock.js (Fri 18 Jul 2025 09:00) by .overhaul/today-ledger-seed.js. */
(() => {
  const DAY = 86400000;
  const UID = 'today-ledger-user';
  const midnight = new Date().setHours(0, 0, 0, 0);
  const at = (daysAgo, hour = 21) => midnight - daysAgo * DAY + hour * 3600e3;
  const key = (t) => { const d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  let n = 0;
  const events = [];
  const ev = (type, createdAt, extra) => events.push(Object.assign({ _id: 'led-' + ++n, userId: UID, type, createdAt }, extra || {}));
  ev('lapse', at(10, 22), { severity: 5 });
  for (let i = 0; i < 4; i++) ev('urge_rode_out', at(2 + i * 3, 20), { severity: 5, trigger: 'Late night', precedingState: 'Bored', whatHelped: 'Left the room', reopens: 0 });
  const checkins = {};
  for (let i = 0; i < 9; i++) { const k = key(at(i)); checkins[k] = { _id: 'led-c-' + i, userId: UID, date: k, mood: 3, energy: 3, note: '' }; }
  const progress = {};
  ['day-11', 'day-10', 'day-09', 'day-08'].forEach((slug, i) => { progress[slug] = { userId: UID, lessonSlug: slug, status: 'completed', completedAt: at(i * 2, 8), fitsMeRating: 4 }; });
  const seed = { user: { clerkUserId: UID, displayName: 'Jerry', createdAt: midnight - 16 * DAY, onboardingComplete: true, settings: { showStreak: false } }, progress, reflections: {}, checkins, events, journalEntries: [], lifeMap: { userId: UID, values: [] } };
  localStorage.setItem('tideline.mock.users', JSON.stringify({ 'led@vici.app': { userId: UID, email: 'led@vici.app', password: 'x', displayName: 'Jerry' } }));
  localStorage.setItem('tideline.session.userId', UID);
  localStorage.setItem('tideline.mock.userdata.' + UID, JSON.stringify(seed));
  const mon = (t) => { const x = new Date(t); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
  localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(mon(midnight).getTime() - 7 * DAY)));
  localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now()));
})();
