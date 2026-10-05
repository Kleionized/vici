/* A brand-new account (medallions-letters, unframed states): onboarded today, nothing recorded — the album's
   Earned segment holds Veni alone (a centred row, D271) and Still to earn holds eleven (two pages of the grid). */
(function () {
  var uid = 'mockuser_fresh';
  localStorage.setItem('tideline.mock.users', JSON.stringify({ 'new@example.com': { userId: uid, email: 'new@example.com', password: 'x', displayName: 'Alex' } }));
  localStorage.setItem('tideline.session.userId', uid);
  localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({ user: { clerkUserId: uid, displayName: 'Alex', createdAt: Date.now() - 3600000, onboardingComplete: true, settings: { showStreak: false } }, progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], whyStatement: '', updatedAt: Date.now() }, events: [], checkins: {}, journalEntries: [] }));
  localStorage.setItem('tideline.checkinPromptAt', String(Date.now()));
  localStorage.setItem('tideline.weeklyReport.seenWeek', '"2099-01-01"');
})();
