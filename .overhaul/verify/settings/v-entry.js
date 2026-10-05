const out = {}; try {
const visAt = (x, y) => { let el = document.elementFromPoint(x, y); while (el && !(el.getAttribute && el.getAttribute('role') === 'button')) el = el.parentElement; return el; };
await waitFor('Manage subscription'); await __sleep(500);
// direct load: no history -> back goes to /today
__fire(visAt(30, 80)); await __sleep(1800);
out.backNoHistory = location.pathname;
// Today -> Open settings
await tap('Open settings'); await __sleep(1800);
out.todayDoor = location.pathname;
// back now pops to today
__fire(visAt(30, 80)); await __sleep(1800);
out.backWithHistory = location.pathname;
await tap('Open settings'); await __sleep(1800);
// Night check-in -> Save time -> back to settings, and value updates
await tap('Night check-in'); await __sleep(1800);
out.night = location.pathname + location.search;
await tap('Save time'); await __sleep(1800);
out.afterSave = location.pathname;
out.nightValue = (__txt().match(/Night check-in (\S+ \S+)/) || [])[1];
await tap('Morning check-in'); await __sleep(1800);
out.morning = location.pathname + location.search;
await tap('Save time'); await __sleep(1800);
out.afterMorningSave = location.pathname;
} catch (e) { out.err = e.message.slice(0,200); out.at = location.pathname + location.search; }
console.error('RESULT ' + JSON.stringify(out)); return 1;
