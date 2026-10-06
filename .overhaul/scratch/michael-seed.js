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
  JSON.stringify({ 'sam@example.com': { userId: uid, email: 'sam@example.com', password: 'p', displayName: 'Sam' } }),
);
localStorage.setItem('tideline.session.userId', uid);
localStorage.removeItem('tideline.mock.userdata.' + uid);

window.__ONB_ANSWERS = {name:'Michael',ageYears:'24',gender:'Male',freq:'A few times a week',duration:'1–3 years',quitAttempts:'Yes, once or twice',relapseSpan:'A few days',triggers:['Late at night','When I’m home alone'],emotions:['Bored'],places:['In bed'],before:['I start scrolling'],impact:'Quite a bit',affects:['Focus','Sleep','Confidence'],lonely:'Sometimes',alone:'Now and then',goalPorn:'Stop completely',goalMast:'Keep it, just without porn',tried:['Blocking sites or apps']};
