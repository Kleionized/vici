/* Plant a signed-in mock user before the first paint, so `/welcome` opens on
   `03 · Name` rather than bouncing to sign-in. Same three keys
   `.overhaul/funnel-cap.mjs` writes; as an `--initseed` it needs no reload, and
   a reload would destroy the context the walk drives from. Group `plan`. */
localStorage.setItem(
  'tideline.mock.users',
  JSON.stringify({ 'sam@example.com': { userId: 'mockuser_funnel', email: 'sam@example.com', password: 'p', displayName: 'Sam' } }),
);
localStorage.setItem('tideline.session.userId', 'mockuser_funnel');
localStorage.removeItem('tideline.mock.userdata.mockuser_funnel');
