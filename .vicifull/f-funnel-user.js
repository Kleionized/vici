/* A signed-in mock account with no answers yet — the state `03 · Name` opens in.
   Planted as an init script (shot.mjs --initseed) so it lands before the first
   paint: /welcome will not make a user of its own, and seeding after load needs
   a reload, which destroys the context the walk drives from. */
localStorage.setItem('tideline.mock.users', JSON.stringify({
  'sam@example.com': { userId: 'mockuser_funnel', email: 'sam@example.com', password: 'p', displayName: 'Sam' },
}));
localStorage.setItem('tideline.session.userId', 'mockuser_funnel');
localStorage.removeItem('tideline.mock.userdata.mockuser_funnel');
