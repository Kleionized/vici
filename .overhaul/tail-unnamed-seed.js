/* GROUP tail — undrawn state: no name (an account with no display name and an empty 03 · Name). With /welcome?step=<id>. */
window.__ONB_ANSWERS = { name: '' };
/* GROUP tail — sign a fresh mock user in BEFORE the first paint.

   `/welcome` is the onboarding host and nothing on it signs a mock user in, so
   opening it cold leaves the questionnaire without an account and the first
   step draws no name field: `tail-walk.js` then dies on "no input #0". The
   group's own harness (`.overhaul/vtail-cap.mjs`) planted the session and
   navigated again, which `shot.mjs` cannot do — but `--initseed` lands before
   the first paint and needs no reload, so `scripts/overhaul/audit.mjs` can run
   these recipes unattended with `"seedScript"` pointing here.

   The account is deliberately EMPTY of progress: the tail is drawn at the end
   of onboarding, on day 0, and every number on its eight boards comes from the
   questionnaire answers `tail-walk.js` gives rather than from stored data. */
const uid = 'mockuser_funnel';
localStorage.setItem(
  'tideline.mock.users',
  JSON.stringify({ 'sam@example.com': { userId: uid, email: 'sam@example.com', password: 'p', displayName: '' } }),
);
localStorage.setItem('tideline.session.userId', uid);
localStorage.removeItem('tideline.mock.userdata.' + uid);
