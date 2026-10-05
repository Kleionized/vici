const out = {}; try {
const sw = () => [...document.querySelectorAll('[role="switch"]')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.textContent.trim().slice(0, 12) + '=' + e.getAttribute('aria-checked'));
const st = () => { const s = JSON.parse(localStorage.getItem('tideline.mock.userdata.settings-seed-user')).user.settings; return [s.appLockFaceId, s.appLockOnLeave, s.hideSensitivePreviews, s.pauseAnalytics]; };
await waitFor('Hide sensitive previews'); await __sleep(500);
out.before = sw(); out.storedBefore = st();
// tap each row by its painted position (rows at 402, 457, 606)
for (const y of [402, 457, 606]) { let el = document.elementFromPoint(120, y); while (el && el.getAttribute('role') !== 'switch') el = el.parentElement; __fire(el); await __sleep(400); }
out.after = sw(); out.storedAfter = st();
// Ask after row is inert
let el = document.elementFromPoint(120, 512); let r = null; for (let i = 0; i < 6 && el; i++, el = el.parentElement) if (el.getAttribute('role')) { r = el.getAttribute('role'); break; } out.askAfterRole = r;
} catch (e) { out.err = e.message.slice(0, 200); }
console.error('RESULT ' + JSON.stringify(out)); return 1;
