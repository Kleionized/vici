/* GROUP settings — the four switches (App lock ×3, Pause analytics) flip, show it
   (aria-checked), and write the user's settings. Run on /applock; it walks to /privacy. */
const out = {};
const sw = () => Object.fromEntries([...document.querySelectorAll('[role="switch"]')].map((e) => [e.textContent.trim(), e.getAttribute('aria-checked')]));
const stored = () => JSON.parse(localStorage.getItem('tideline.mock.userdata.settings-seed-user')).user.settings;
await waitFor('Hide sensitive previews'); await __sleep(400);
out.lockBefore = sw();
for (const el of [...document.querySelectorAll('[role="switch"]')]) { __fire(el); await __sleep(350); }
out.lockAfter = sw();
const s = stored();
out.lockStored = [s.appLockFaceId, s.appLockOnLeave, s.hideSensitivePreviews];
for (const el of [...document.querySelectorAll('[role="switch"]')].slice(0, 1)) { __fire(el); await __sleep(350); }
out.faceIdBackOn = stored().appLockFaceId;
await tap('Back'); await __sleep(1000);
out.backTo = location.pathname;
return out;
