/* GROUP logs — shared account scaffolding for the report seeds: `window.__logsSeed(
   { createdAt, events, checkins, progress })` writes the mock user and pre-meets the
   launch gates (check-in asked just now, the newest closed week's report seen). */
window.__logsSeed = ({ createdAt, events, checkins, progress }) => {
  const uid = 'logs-seed-user';
  const DAY = 86400000;
  const now = Date.now();
  const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const midnight = new Date(now).setHours(0, 0, 0, 0);
  localStorage.setItem('tideline.mock.users', JSON.stringify({ 'seed@vici.app': { userId: uid, email: 'seed@vici.app', password: 'x', displayName: 'Marcus' } }));
  localStorage.setItem('tideline.session.userId', uid);
  localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(now));
  const monday = midnight - ((new Date(midnight).getDay() + 6) % 7) * DAY;
  localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(key(monday - 7 * DAY)));
  let n = 0;
  localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
    user: { clerkUserId: uid, displayName: 'Marcus', createdAt, onboardingComplete: true, settings: { showStreak: false } },
    progress: progress || {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
    events: events.map((e) => Object.assign({ _id: 'seed-r-' + ++n, userId: uid }, e)),
    checkins: Object.fromEntries(checkins.map((c) => [c.date, Object.assign({ _id: 'seed-c-' + c.date, userId: uid, emotions: [], reasons: [] }, c)])),
    journalEntries: [],
  }));
};
window.__at = (s) => new Date(s).getTime();
window.__days = (from, count) => Array.from({ length: count }, (_, i) => { const d = new Date(from + 'T12:00'); d.setDate(d.getDate() + i); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
