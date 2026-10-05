const out = {}; try {
const visAt = (x, y) => { let el = document.elementFromPoint(x, y); while (el && !(el.getAttribute && el.getAttribute('role') === 'button')) el = el.parentElement; return el; };
await waitFor('Including the ones'); await __sleep(500);
const want = { 'Back Tap': '/backtap', 'Your vow': '/vow', 'Edit profile': '/profile', 'App lock': '/applock', 'Data & privacy': '/privacy', 'Weekly report': '/weekly-report', 'Settings': '/settings' };
out.rowCount = __btns().filter((b) => b.closest && b.getAttribute('aria-label') && b.getBoundingClientRect().height >= 54).length;
for (const [label, path] of Object.entries(want)) {
  const el = __btns().find((b) => b.getAttribute('aria-label') === label);
  if (!el) { out[label] = 'NO ROW'; continue; }
  __fire(el); await __sleep(1600);
  out[label] = location.pathname + location.search;
  // come back with the destination's own back chevron
  const b = visAt(30, 80); const bl = b && (b.getAttribute('aria-label') || '');
  if (b) __fire(b); else history.back();
  await __sleep(1600);
  out[label] += ' <' + bl + '> ' + location.pathname;
}
await __sleep(300); out.at2 = location.pathname;
// All's own back
__fire(visAt(30, 80)); await __sleep(1600); out.allBack = location.pathname;
} catch (e) { out.err = e.message.slice(0, 200); out.at = location.pathname; }
console.error('RESULT ' + JSON.stringify(out)); return 1;
