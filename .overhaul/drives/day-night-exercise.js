/* GROUP day — exercise every night check-in control and read back what the
   flow wrote. Run with `--initseed=.overhaul/day-seed.js` on /day/night.
   `SKIP` chooses the action step's way out: true = "Skip tonight" then the ✕ on
   the closing board, false = "Done" then "Done". */
const SKIP = true;
const log = [];
const has = (s) => __txt().includes(s);
const checked = (label) => [...document.querySelectorAll('[aria-checked="true"]')].some((e) => e.textContent.trim() === label || e.getAttribute('aria-label') === label);
const disabled = (label) => { const el = __btns().find((b) => b.getAttribute('aria-label') === label || b.textContent.trim() === label); return el ? el.getAttribute('aria-disabled') === 'true' : 'missing'; };
await tap('Begin'); await __sleep(700);
await tap('Back'); await __sleep(500);
log.push(['back from mood reaches the cover', has('Night check-in.')]);
await tap('Begin'); await __sleep(700);
await tap('Bright'); await __sleep(300);
log.push(['mood: Bright read back', has('One to keep'), checked('Bright')]);
await tap('Continue'); await __sleep(700);
log.push(['emotions: next disabled before a pick', disabled('Next') === true]);
await tap('Calm'); await __sleep(250); await tap('Tired'); await __sleep(250); await tap('Tense'); await __sleep(250); await tap('Tense'); await __sleep(250);
log.push(['emotions: Calm + Tired on, Tense toggled off', checked('Calm'), checked('Tired'), !checked('Tense'), disabled('Next') === false]);
await tap('Next'); await __sleep(700);
log.push(['reasons: next disabled before a pick', disabled('Next') === true]);
await tap('Health'); await __sleep(300);
await tap('Next'); await __sleep(700);
{
  const el = document.querySelector('textarea');
  const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
  d.set.call(el, 'Sam called at the right moment…');
  el.dispatchEvent(new Event('input', { bubbles: true }));
}
await __sleep(300);
await tap('Continue'); await __sleep(800);
log.push(['record', has('Today’s record.')]);
await tap('Add to the record'); await __sleep(1500);
log.push(['add to the record opens the urge log', location.pathname]);
history.back(); await __sleep(1500);
log.push(['back on the record step', has('Today’s record.')]);
await tap('Continue'); await __sleep(800);
log.push(['action', has('Tonight’s action')]);
if (SKIP) { await tap('Skip tonight'); await __sleep(800); } else { await tap('Done'); await __sleep(800); }
log.push(['closed', has('Day 13, closed.')]);
if (SKIP) await tap('Close'); else await tap('Done');
await __sleep(2000);
const key = Object.keys(localStorage).find((k) => k.startsWith('tideline.mock.userdata.'));
const data = JSON.parse(localStorage.getItem(key));
const d2 = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
log.push(['url after close', location.pathname]);
const t = data.checkins[d2(Date.now())] || {};
log.push(['today row', JSON.stringify({ mood: t.mood, emotions: t.emotions, reasons: t.reasons })]);
log.push(['tomorrow action', JSON.stringify(data.checkins[d2(Date.now() + 86400000)]?.dailyAction ?? null)]);
log.push(['reflection filed', JSON.stringify((data.journalEntries || []).filter((j) => j.tag === 'Reflection').map((j) => j.body))]);
return { failed: log.slice(0, -4).filter((r) => r.slice(1).some((v) => v === false || v === 'missing')).map((r) => r[0]), urgeLog: log.find((r) => r[0].startsWith('add'))[1], stored: log.slice(-4).map((r) => r.slice(1).join(' ')) };
