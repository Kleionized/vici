const out = {}; try {
const dlg = () => !!document.querySelector('[role="dialog"]');
const visAt = (x, y) => { let el = document.elementFromPoint(x, y); while (el && !(el.getAttribute && el.getAttribute('role') === 'button')) el = el.parentElement; return el; };
const pills = () => (__txt().match(/Held for \d+ days?|Signed \w+ \d+/g) || []);
const jr = () => JSON.parse(localStorage.getItem('tideline.mock.userdata.settings-vow-user')).journalEntries;
await waitFor('Re-sign the vow'); await __sleep(500);
out.before = pills(); out.entriesBefore = jr().length;
__fire(visAt(196, 795)); await __sleep(800); out.opened = dlg();
out.sheet = document.querySelector('[role="dialog"]') && document.querySelector('[role="dialog"]').innerText.replace(/\s+/g, ' ');
__fire(visAt(196, 783)); await __sleep(700); out.cancelText = 'x'; out.cancelCloses = !dlg();
__fire(visAt(196, 795)); await __sleep(800);
__fire(visAt(196, 200)); await __sleep(700); out.scrimCloses = !dlg();
out.unchanged = JSON.stringify(pills()) === JSON.stringify(out.before) && jr().length === out.entriesBefore;
__fire(visAt(196, 795)); await __sleep(800);
__fire(visAt(196, 727)); await __sleep(1500);
out.closedAfterSign = !dlg();
out.after = pills(); out.entriesAfter = jr().length;
const v = jr().filter((e) => e.tag === 'Vow'); out.vows = v.length; out.same = v.length > 1 && v[0].body === v[1].body;
out.newestFirst = jr()[0].tag;
__fire(visAt(30, 80)); await __sleep(1500); out.back = location.pathname;
} catch (e) { out.err = e.message.slice(0, 200); out.at = location.pathname; }
console.error('RESULT ' + JSON.stringify(out)); return 1;
