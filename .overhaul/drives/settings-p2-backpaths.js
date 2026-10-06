/* GROUP settings, Phase 2 — D340 (tabs go back through history): every door
   into this group's screens comes back where it came from through the app's
   own Back chevron (not history.back()).
   Run: shot.mjs app /today <png> --initseed=.overhaul/settings-seed.js
        --script=.overhaul/drives/settings-p2-backpaths.js */
const out = {};
const here = () => location.pathname + location.search;
const back = async () => { await tap('Back'); await __sleep(1100); };
/* only controls painted on top: covered stack screens stay mounted on web, and
   Today's own `Morning check-in` card would win an exact-text match */
const tapTop = async (label) => {
  const el = __btns().filter(__onTop).find((b) => b.textContent.trim().startsWith(label) || (b.getAttribute('aria-label') || '').startsWith(label));
  if (!el) throw new Error('no top control ' + label);
  __fire(el); await __sleep(260);
};
await waitFor('Open settings', 10000).catch(() => {});
await __sleep(600);
await tap('Open settings');
await __sleep(1300);
out.todayToSettings = here();
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
  await __sleep(300);
  await tapTop(label);
  await __sleep(1300);
  const at = location.pathname;
  try { await back(); } catch (e) { out[label] = at + ' ✗ no Back: ' + e.message.slice(0, 60); continue; }
  out[label] = at + (at === want ? ' ✓' : ' ✗ want ' + want) + ' → ' + location.pathname + (location.pathname === '/settings' ? ' ✓' : ' ✗');
}
await back();
out.settingsBack = location.pathname + (location.pathname === '/today' ? ' ✓' : ' ✗ want /today');
// the Medallions row on Edit profile, and its way back
await tap('Open settings'); await __sleep(1200);
await tapTop('Edit profile'); await __sleep(1300);
await tapTop('Medallions'); await __sleep(1500);
const med = location.pathname;
await back();
out.profileMedallions = med + ' → ' + location.pathname + (location.pathname === '/profile' ? ' ✓' : ' ✗ want /profile');
const bad = Object.entries(out).filter(([k, v]) => k !== 'todayToSettings' && v.includes('✗'));
return { ok: Object.keys(out).length - 1 - bad.length, of: Object.keys(out).length - 1, todayToSettings: out.todayToSettings, bad };
