/* GROUP settings — "Re-sign the vow": the ghost opens the confirmation, Cancel and
   the scrim close it unchanged, "Sign it again" writes a new Vow entry with the
   same words and the pills read Held for 0 days / Signed <today>; signing again the
   same day writes no second entry (D294). */
const out = {};
const dlg = () => !!document.querySelector('[role="dialog"]');
const pills = () => [...document.querySelectorAll('div')].filter((d) => d.childElementCount === 0).map((d) => d.textContent).filter((t) => /^(Held for|Signed )/.test(t));
await waitFor('Re-sign the vow'); await __sleep(400);
out.before = pills();
await tap('Re-sign the vow'); await __sleep(700); out.opened = dlg();
await tap('Cancel'); await __sleep(600); out.cancelCloses = !dlg();
await tap('Re-sign the vow'); await __sleep(700);
await tap('Dismiss'); await __sleep(600); out.scrimCloses = !dlg();
out.unchanged = JSON.stringify(pills()) === JSON.stringify(out.before);
await tap('Re-sign the vow'); await __sleep(700);
await tap('Sign it again'); await __sleep(1200);
out.after = pills();
const j = JSON.parse(localStorage.getItem('tideline.mock.userdata.settings-vow-user')).journalEntries;
out.vows = j.filter((e) => e.tag === 'Vow').length;
out.sameWords = j[0].body === j[1].body;
await tap('Re-sign the vow'); await __sleep(700);
await tap('Sign it again'); await __sleep(1200);
out.secondSameDay = JSON.parse(localStorage.getItem('tideline.mock.userdata.settings-vow-user')).journalEntries.filter((e) => e.tag === 'Vow').length;
out.closedAfter = !dlg();
return out;
