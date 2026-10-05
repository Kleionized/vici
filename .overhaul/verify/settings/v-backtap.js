const out = {}; try {
const visAt = (x, y) => { let el = document.elementFromPoint(x, y); while (el && !(el.getAttribute && el.getAttribute('role') === 'button')) el = el.parentElement; return el; };
await waitFor('Shortcut link'); await __sleep(500);
const row = __btns().find((b) => b.getAttribute('aria-label') === 'Copy the shortcut link');
out.rowText = row && row.textContent.trim();
__fire(row); await __sleep(300); out.afterTap = row.textContent.trim();
await __sleep(1700); out.afterRevert = row.textContent.trim();
const btns = __btns().filter((b) => b.getBoundingClientRect().width > 0).map((b) => (b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 30));
out.controls = btns;
const pr = visAt(196, 727); out.primary = pr && pr.textContent.trim();
const gh = visAt(196, 783); out.ghost = gh && gh.textContent.trim();
__fire(gh); await __sleep(1800); out.test = location.pathname;
history.back(); await __sleep(1500); out.backFromHub = location.pathname;
__fire(visAt(30, 80)); await __sleep(1500); out.back = location.pathname;
} catch (e) { out.err = e.message.slice(0, 200); out.at = location.pathname; }
console.error('RESULT ' + JSON.stringify(out)); return 1;
