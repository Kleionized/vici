/* verifier: each Settings row -> its route; the destination's own visible back chevron returns to /settings */
const out = {};
const rows = [
  ['Morning check-in', '/routines/morning-time?from=settings'],
  ['Night check-in', '/routines/night-time?from=settings'],
  ['Weekly report', '/weekly-report?from=settings'],
  ['Your vow', '/vow'],
  ['Your letter', '/letter?variant=week12'],
  ['App lock', '/applock'],
  ['Data & privacy', '/privacy'],
  ['Edit profile', '/profile'],
  ['Manage subscription', '/subscription'],
];
const visBack = () => {
  // the topmost element painted at the nav's back slot
  let el = document.elementFromPoint(30, 80);
  while (el && !(el.getAttribute && el.getAttribute('role') === 'button')) el = el.parentElement;
  return el;
};
for (const [label, want] of rows) {
  await waitFor('Manage subscription');
  await __sleep(500);
  await tap(label);
  await __sleep(1500);
  const got = location.pathname + location.search;
  const b = visBack();
  const bl = b ? (b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 20) : null;
  if (b) { __fire(b); await __sleep(1500); } else { history.back(); await __sleep(1500); }
  out[label] = `${got}${got === want ? ' OK' : ' WANT ' + want} | back[${bl}] -> ${location.pathname}`;
}
// Settings' own back with history -> wherever it came from (here: history start)
console.error("RESULT " + JSON.stringify(out)); return 1;
