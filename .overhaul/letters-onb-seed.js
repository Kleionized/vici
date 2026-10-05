/* GROUP letters (pass 2) — the same account with onboarding still open, so
   `/welcome` renders the funnel instead of redirecting to Today. Used only to
   reach `40 · Medallion Earned`, which has no route of its own. The account are drawn for. `Letter Read` and
   `Medallion Letter` both open "Dear Sam," and `Letter Read` sets the reason he
   started in his own words, so the canvas's own sample can only be reproduced
   character for character by an account that holds those two strings. Nothing
   signs a mock user in when a capture opens /letter directly, so this goes in
   as an init script rather than through .overhaul/reseed.js. */
const uid = 'letters-seed-user';
const DAY = 86400000;
const now = Date.now();
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@vici.app': { userId: uid, email: 'sam@vici.app', password: 'x', displayName: 'Sam' } }));
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Sam', createdAt: now - 40 * DAY, onboardingComplete: false, settings: { showStreak: false } },
  progress: {},
  reflections: {},
  lifeMap: { userId: uid, values: [], whyStatement: 'I want to be present for the people I love', updatedAt: now },
  /* five urges met and outlasted — the rung `Vici` mints at, which is the face
     and the story the medallion post reads out of the album */
  events: Array.from({ length: 5 }, (_, i) => ({ _id: 'l-' + i, userId: uid, type: 'urge_rode_out', createdAt: now - (i + 1) * DAY, note: '' })),
  checkins: {},
  journalEntries: [],
}));
setTimeout(() => location.reload(), 0);
