/* GROUP paywall — the signed-in-but-unonboarded mock account `/welcome` needs.

   `43 · Day 0` is only reachable at the end of the onboarding funnel, and the
   funnel will not start without a session. `.overhaul/funnel-cap.mjs` planted
   one by navigating twice; `shot.mjs --initseed` plants it before the first
   paint instead, which is what the audit runner can drive (FINDINGS F27).
   The user data key is deliberately absent: the funnel writes it as it goes. */
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@example.com': { userId: 'mockuser_funnel', email: 'sam@example.com', password: 'p', displayName: 'Sam' } }));
localStorage.setItem('tideline.session.userId', 'mockuser_funnel');
localStorage.removeItem('tideline.mock.userdata.mockuser_funnel');
