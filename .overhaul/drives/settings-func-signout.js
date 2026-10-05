/* GROUP settings — the sign-out sheet: scrim and "Stay signed in" close it,
   only the pill signs out (→ /). */
const out = {};
const dlg = () => !!document.querySelector('[role="dialog"]');
await waitFor('Manage subscription'); await __sleep(400);
await tap('Sign out'); await __sleep(700);
out.opened = dlg();
await tap('Stay signed in'); await __sleep(600);
out.stayClosed = !dlg();
await tap('Sign out'); await __sleep(700);
await tap('Dismiss'); await __sleep(600);
out.scrimClosed = !dlg();
await tap('Sign out'); await __sleep(700);
const pills = __btns().filter((b) => b.textContent.trim() === 'Sign out');
out.signOutControls = pills.length;
__fire(pills[pills.length - 1]); await __sleep(2000);
out.after = location.pathname;
out.session = localStorage.getItem('tideline.session.userId');
return out;
