/* letters pass 2 — the same account with the medallion post already delivered,
   so /mail draws the post row whose tier this pass made derive. */
const uid = 'letters-seed-user';
const DAY = 86400000;
const now = Date.now();
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@vici.app': { userId: uid, email: 'sam@vici.app', password: 'x', displayName: 'Sam' } }));
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Sam', createdAt: now - 40 * DAY, onboardingComplete: true, settings: { showStreak: false } },
  progress: {},
  reflections: {},
  lifeMap: { userId: uid, values: [], whyStatement: 'I want to be present for the people I love', updatedAt: now },
  /* five urges met and outlasted — the rung `Vici` mints at, which is the face
     and the story the medallion post reads out of the album */
  events: Array.from({ length: 5 }, (_, i) => ({ _id: 'l-' + i, userId: uid, type: 'urge_rode_out', createdAt: now - (i + 1) * DAY, note: '' })),
  checkins: {},
  journalEntries: [],
}));
localStorage.setItem('tideline.post.backondeck.delivered', String(Date.now()));
setTimeout(() => location.reload(), 0);
