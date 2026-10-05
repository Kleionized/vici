const out = {};
const dlg = () => !!document.querySelector('[role="dialog"]');
const visAt = (x, y) => { let el = document.elementFromPoint(x, y); while (el && !(el.getAttribute && el.getAttribute('role') === 'button')) el = el.parentElement; return el; };
await waitFor('Manage subscription'); await __sleep(500);
// the ghost by its painted position (canvas 0,786 393x18)
const ghost = visAt(196, 795); out.ghostText = ghost && ghost.textContent.trim();
__fire(ghost); await __sleep(800); out.opened = dlg();
out.sheetText = document.querySelector('[role="dialog"]') ? document.querySelector('[role="dialog"]').innerText.replace(/\s+/g, ' ').slice(0, 140) : null;
// Stay signed in by its painted position (canvas 774..792)
const stay = visAt(196, 783); out.stayText = stay && stay.textContent.trim();
__fire(stay); await __sleep(800); out.stayCloses = !dlg();
__fire(visAt(196, 795)); await __sleep(800);
// scrim: tap high on the screen, above the sheet (T 556)
const scrim = visAt(196, 300); out.scrimLabel = scrim && scrim.getAttribute('aria-label');
__fire(scrim); await __sleep(800); out.scrimCloses = !dlg();
out.stillSettings = location.pathname;
out.session1 = localStorage.getItem('tideline.session.userId');
__fire(visAt(196, 795)); await __sleep(800);
const pill = visAt(196, 727); out.pillText = pill && pill.textContent.trim();
__fire(pill); await __sleep(2500);
out.after = location.pathname;
out.session2 = localStorage.getItem('tideline.session.userId');
console.error('RESULT ' + JSON.stringify(out)); return 1;
