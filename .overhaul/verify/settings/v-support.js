const out = {}; try {
const visAt = (x, y) => { let el = document.elementFromPoint(x, y); while (el && !(el.getAttribute && el.getAttribute('role') === 'button')) el = el.parentElement; return el; };
await waitFor('not alone'); await __sleep(500);
out.controls = __btns().filter((b) => b.getBoundingClientRect().width > 0).map((b) => (b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 30));
const gh = visAt(196, 795); out.ghost = gh && gh.textContent.trim();
__fire(gh); await __sleep(1600); out.ghostBack = location.pathname;
} catch (e) { out.err = e.message.slice(0, 200); out.at = location.pathname; }
console.error('RESULT ' + JSON.stringify(out)); return 1;
