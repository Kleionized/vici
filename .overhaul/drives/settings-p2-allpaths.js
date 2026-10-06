/* GROUP settings, Phase 2 — D340: the All drawer's doors into this group come
   back to All through the screens' own Back.
   Run: shot.mjs app /all <png> --initseed=.overhaul/settings-seed.js
        --script=.overhaul/drives/settings-p2-allpaths.js */
const out = {};
const tapTop = async (label) => {
  const el = __btns().filter(__onTop).find((b) => (b.getAttribute('aria-label') || '') === label) ?? __btns().find((b) => (b.getAttribute('aria-label') || '') === label);
  if (!el) throw new Error('no control ' + label);
  el.scrollIntoView({ block: 'center' }); await __sleep(200);
  __fire(el); await __sleep(260);
};
const rows = [
  ['Settings', '/settings'],
  ['Edit profile', '/profile'],
  ['App lock', '/applock'],
  ['Back Tap', '/backtap'],
  ['Your vow', '/vow'],
  ['Data & privacy', '/privacy'],
  ['Find support', '/support'],
];
await waitFor('Including the ones', 10000);
for (const [label, want] of rows) {
  await __sleep(500);
  await tapTop(label);
  await __sleep(1300);
  const at = location.pathname;
  await tap('Back'); await __sleep(1100);
  out[label] = at + (at === want ? ' ✓' : ' ✗ want ' + want) + ' → ' + location.pathname + (location.pathname === '/all' ? ' ✓' : ' ✗');
}
const bad = Object.entries(out).filter(([, v]) => v.includes('✗'));
return { ok: Object.keys(out).length - bad.length, of: Object.keys(out).length, bad };
