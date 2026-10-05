/* GROUP settings — every Settings row opens what it opened before the rebuild,
   and Back comes home. Run: shot.mjs app /settings <png> --initseed=.overhaul/settings-seed.js
   --script=.overhaul/drives/settings-func-nav.js */
const out = {};
const rows = [
  ['Morning check-in', '/routines/morning-time'],
  ['Night check-in', '/routines/night-time'],
  ['Weekly report', '/weekly-report'],
  ['Your vow', '/vow'],
  ['Your letter', '/letter'],
  ['App lock', '/applock'],
  ['Data & privacy', '/privacy'],
  ['Edit profile', '/profile'],
  ['Manage subscription', '/subscription'],
];
for (const [label, want] of rows) {
  await waitFor('Manage subscription');
  await __sleep(400);
  await tap(label);
  await __sleep(1200);
  out[label] = location.pathname + location.search + (location.pathname === want ? ' ✓' : ' ✗ want ' + want);
  history.back();
  await __sleep(1200);
}
out.backHome = location.pathname;
return out;
