const out = {}; try {
const visAt = (x, y) => { let el = document.elementFromPoint(x, y); while (el && !(el.getAttribute && el.getAttribute('role') === 'button')) el = el.parentElement; return el; };
await waitFor('Manage subscription'); await __sleep(500);
const row = visAt(196, 173); out.rowText = row.textContent.trim();
__fire(row); await __sleep(1800);
out.morning = location.pathname + location.search;
const save = visAt(196, 775); out.saveText = save && save.textContent.trim();
__fire(save); await __sleep(1800);
out.afterSave = location.pathname;
// Weekly report then its Back
__fire(visAt(196, 283)); await __sleep(1800); out.wr = location.pathname + location.search;
__fire(visAt(30, 80)); await __sleep(1500); out.wrBack = location.pathname;
} catch (e) { out.err = e.message.slice(0, 200); out.at = location.pathname; }
console.error('RESULT ' + JSON.stringify(out)); return 1;
