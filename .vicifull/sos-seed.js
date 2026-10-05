/* GROUP sos — the account the interrupt's own frames draw.
   `Surf Complete` states `Logged — rode it out · ×3`, and the count is
   `events.filter(type === 'urge_rode_out').length` with the run just finished
   included — so the account starts with two, not none. Seeded rather than
   excused as sample data (FINDINGS F28). An init script: nothing signs a mock
   user in at /urge. */
const uid = 'sos-seed-user';
const DAY = 86400000;
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sos@vici.app': { userId: uid, email: 'sos@vici.app', password: 'x', displayName: 'Marcus' } }));
localStorage.setItem('tideline.session.userId', uid);
const now = Date.now();
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Marcus', createdAt: now - 13 * DAY, onboardingComplete: true, settings: { showStreak: false } },
  progress: {},
  reflections: {},
  events: [
    { _id: 'sos-e-1', userId: uid, type: 'urge_rode_out', createdAt: now - 3 * DAY, severity: 6, severityAfter: 3, durationSeconds: 840 },
    { _id: 'sos-e-2', userId: uid, type: 'urge_rode_out', createdAt: now - DAY, severity: 7, severityAfter: 4, durationSeconds: 1320 },
  ],
  checkins: {},
  journalEntries: [],
}));
