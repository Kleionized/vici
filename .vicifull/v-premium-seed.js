const uid = 'mockuser_pw';
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@hey.com': { userId: uid, email: 'sam@hey.com', password: 'x', displayName: 'Sam' } }));
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Sam', createdAt: Date.now(), onboardingComplete: true, settings: { showStreak: false, premium: true } },
  progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: Date.now() },
  events: [], checkins: {}, journalEntries: [],
}));
