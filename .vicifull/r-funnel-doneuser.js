/* A signed-in mock account whose onboarding IS complete — the state the auth
   door must still bounce (the other half of D122's guard). */
localStorage.setItem('tideline.mock.users', JSON.stringify({
  'sam@example.com': { userId: 'mockuser_done', email: 'sam@example.com', password: 'p', displayName: 'Sam' },
}));
localStorage.setItem('tideline.session.userId', 'mockuser_done');
const now = Date.now();
localStorage.setItem('tideline.mock.userdata.mockuser_done', JSON.stringify({
  user: { clerkUserId: 'mockuser_done', displayName: 'Sam', createdAt: now, onboardingComplete: true, settings: {} },
  progress: {}, reflections: {}, lifeMap: { userId: 'mockuser_done', values: [], updatedAt: now },
  events: [], checkins: {}, journalEntries: [],
}));
