const out = {}; try {
const st = () => JSON.parse(localStorage.getItem('tideline.mock.userdata.settings-seed-user')).user.settings.pauseAnalytics;
const roleAt = (x, y) => { let el = document.elementFromPoint(x, y); for (let i = 0; i < 6 && el; i++, el = el.parentElement) if (el.getAttribute && el.getAttribute('role')) return el.getAttribute('role'); return null; };
await waitFor('Pause analytics'); await __sleep(500);
out.roles = { exportRow: roleAt(120, 304), policy: roleAt(120, 359), terms: roleAt(120, 414), del: roleAt(120, 565) };
let el = document.elementFromPoint(120, 510); while (el && el.getAttribute('role') !== 'switch') el = el.parentElement;
out.before = [el.getAttribute('aria-checked'), st()];
__fire(el); await __sleep(500); out.after1 = [el.getAttribute('aria-checked'), st()];
__fire(el); await __sleep(500); out.after2 = [el.getAttribute('aria-checked'), st()];
let b = document.elementFromPoint(30, 80); while (b && b.getAttribute('role') !== 'button') b = b.parentElement; __fire(b); await __sleep(1500); out.back = location.pathname;
} catch (e) { out.err = e.message.slice(0, 200); }
console.error('RESULT ' + JSON.stringify(out)); return 1;
