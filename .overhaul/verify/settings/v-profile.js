const out = {}; try {
const dlg = () => !!document.querySelector('[role="dialog"]');
const visAt = (x, y) => { let el = document.elementFromPoint(x, y); while (el && !(el.getAttribute && el.getAttribute('role') === 'button')) el = el.parentElement; return el; };
const roleAt = (x, y) => { let el = document.elementFromPoint(x, y); for (let i = 0; i < 6 && el; i++, el = el.parentElement) if (el.getAttribute && el.getAttribute('role')) return el.getAttribute('role'); return null; };
await waitFor('Medallions'); await __sleep(500);
out.roles = { name: roleAt(196, 316), username: roleAt(196, 371), email: roleAt(196, 426), started: roleAt(196, 524), week: roleAt(196, 579), medals: roleAt(196, 634) };
// disc opens photo sheet
__fire(visAt(196, 172)); await __sleep(800); out.discOpens = dlg();
out.photoRows = [...document.querySelectorAll('[role="dialog"] [role="button"]')].map((b) => b.textContent.trim() || b.getAttribute('aria-label'));
__fire(visAt(196, 637)); await __sleep(700); out.takeCloses = !dlg();
__fire(visAt(196, 241)); await __sleep(800); out.wordsOpen = dlg();
__fire(visAt(196, 692)); await __sleep(700); out.libraryCloses = !dlg();
__fire(visAt(196, 241)); await __sleep(800);
__fire(visAt(196, 747)); await __sleep(700); out.removeCloses = !dlg();
__fire(visAt(196, 241)); await __sleep(800);
__fire(visAt(196, 787)); await __sleep(700); out.cancelCloses = !dlg();
__fire(visAt(196, 241)); await __sleep(800);
__fire(visAt(196, 300)); await __sleep(700); out.scrimCloses = !dlg();
// name sheet
__fire(visAt(196, 316)); await __sleep(900); out.nameOpen = dlg();
const inp = document.querySelector('[role="dialog"] input') || document.querySelector('input');
out.prefill = inp && inp.value; out.focused = document.activeElement === inp;
await typeIn([...document.querySelectorAll('input')].indexOf(inp), 'Sam Draft'); 
__fire(visAt(196, 200)); await __sleep(800);
out.scrimDiscards = !dlg() && (__txt().includes('Sam Reyes')) && !__txt().includes('Sam Draft');
__fire(visAt(196, 316)); await __sleep(900);
const inp2 = document.querySelector('[role="dialog"] input') || document.querySelector('input');
out.prefillAfterDiscard = inp2 && inp2.value;
await typeIn([...document.querySelectorAll('input')].indexOf(inp2), 'Sam Rivers');
__fire(visAt(196, 775)); await __sleep(1000);
out.saveCloses = !dlg();
out.rowNow = (__txt().match(/Name (Sam \w+)/) || [])[1];
out.initialNow = document.elementFromPoint(196, 172) && document.elementFromPoint(196, 172).textContent.trim();
out.stored = JSON.parse(localStorage.getItem('tideline.mock.userdata.settings-seed-user')).user.displayName;
__fire(visAt(196, 634)); await __sleep(1500); out.medallions = location.pathname;
} catch (e) { out.err = e.message.slice(0, 200); out.at = location.pathname; }
console.error('RESULT ' + JSON.stringify(out)); return 1;
