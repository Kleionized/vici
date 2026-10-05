/* GROUP day — exercise every morning check-in control and read back what the
   flow wrote. Run with `--initseed=.overhaul/day-seed.js` on /day/morning.
   Returns a JSON log: each step's visible state, then the stored rows. */
const log = [];
const has = (s) => __txt().includes(s);
const checked = (label) => [...document.querySelectorAll('[aria-checked="true"]')].some((e) => e.textContent.trim() === label || e.getAttribute('aria-label') === label);
const disabled = (label) => { const el = __btns().find((b) => b.getAttribute('aria-label') === label || b.textContent.trim() === label); return el ? el.getAttribute('aria-disabled') === 'true' : 'missing'; };
await tap('Begin'); await __sleep(600);
log.push(['task: next disabled before a choice', disabled('Next')]);
await tap('Not yet'); await __sleep(300);
log.push(['task: Not yet checked, next enabled', checked('Not yet'), !disabled('Next')]);
await tap('Next'); await __sleep(600);
log.push(['ledger', has('Yesterday’s record.')]);
await tap('Back'); await __sleep(500);
log.push(['back to task keeps Not yet', has('Did you complete this task?'), checked('Not yet')]);
await tap('Next'); await __sleep(600);
await tap('Continue'); await __sleep(600);
await tap('Great'); await __sleep(300);
log.push(['feeling: Great read back', has('Ready for it'), checked('Great')]);
await tap('Continue'); await __sleep(600);
await tap('Full'); await __sleep(300);
log.push(['energy: Full read back', has('Use it'), checked('Full')]);
await tap('Continue'); await __sleep(700);
log.push(['pledge unsigned', has('Sign here'), has('Sign for today')]);
await tap('Sign here'); await __sleep(400);
log.push(['line signs', has('Jerry'), has('Confirm')]);
await tap('Signed by Jerry'); await __sleep(400);
log.push(['line un-signs', has('Sign here'), has('Sign for today')]);
await tap('Change the pledge'); await __sleep(800);
log.push(['sheet open', has('One promise you can keep every day.')]);
await tap('Keep current pledge'); await __sleep(600);
log.push(['keep closes sheet', !has('One promise you can keep every day.')]);
await tap('Change the pledge'); await __sleep(800);
{
  const el = document.querySelector('textarea');
  const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
  d.set.call(el, 'Phone stays out of the bedroom');
  el.dispatchEvent(new Event('input', { bubbles: true }));
}
await __sleep(300);
await tap('Sign the new pledge'); await __sleep(700);
log.push(['new pledge on the card, unsigned', has('Phone stays out of the bedroom'), has('Sign for today')]);
await tap('Sign for today'); await __sleep(400);
await tap('Confirm'); await __sleep(700);
log.push(['done', has('Day 13, underway.'), has('Pledge re-signed on Day 13')]);
await tap('Done'); await __sleep(2000);
const key = Object.keys(localStorage).find((k) => k.startsWith('tideline.mock.userdata.'));
const data = JSON.parse(localStorage.getItem(key));
const d2 = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const today = d2(Date.now()), yest = d2(Date.now() - 86400000);
log.push(['url after Done', location.pathname]);
log.push(['today row', JSON.stringify(data.checkins[today])]);
log.push(['yesterday dailyActionDone', data.checkins[yest]?.dailyActionDone]);
log.push(['pledge filed', JSON.stringify((data.journalEntries || []).filter((j) => j.tag === 'Pledge' && !j._id.startsWith('d-j-')).map((j) => [j.title, j.body]))]);
// shot.mjs prints 400 characters: the failed checks (none expected) and the stored rows
return { failed: log.slice(0, -5).filter((r) => r.slice(1).some((v) => v === false || v === 'missing')).map((r) => r[0]), stored: log.slice(-5).map((r) => r.slice(1).join(' ')) };
