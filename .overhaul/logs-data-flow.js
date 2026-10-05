/* GROUP logs — the flows' world (Lapse / Urge Log, 90B–91H): Tue 22 Jul 2025, 23:40
   (the clock is pinned above this by `window.__CLOCK` + clock.js). Twenty-two urges
   already ridden out, so 91H reads `Twenty-three ridden out. Two to Bronze.`; today's
   check-in carries the day's action 90D's `Changed` row draws. Launch gates pre-met. */
(() => {
const uid = 'logs-seed-user';
const DAY = 86400000, HOUR = 3600000, MIN = 60000;
const now = Date.now();
const midnight = new Date(now).setHours(0, 0, 0, 0);
const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const createdAt = midnight - 60 * DAY;
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(now));
const monday = midnight - ((new Date(midnight).getDay() + 6) % 7) * DAY;
localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(monday - 7 * DAY)));
const events = [];
for (let i = 0; i < 22; i += 1) events.push({ _id: 'seed-f-' + i, userId: uid, type: 'urge_rode_out', createdAt: midnight - (2 + 2 * i) * DAY + 21 * HOUR + 10 * MIN, severity: 6, trigger: 'Late night', whatHelped: 'Rode it out', durationSeconds: 300 });
const checkins = {};
checkins[key(midnight)] = { _id: 'seed-c-0', userId: uid, date: key(midnight), mood: 3, energy: 3, emotions: [], reasons: [], dailyAction: 'Phone charges outside bedroom' };
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt, onboardingComplete: true, settings: { showStreak: false } },
  progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
  events, checkins, journalEntries: [],
}));
})();
