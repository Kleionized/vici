// medallion-post: drop X from inside the post flow, targeted at the topmost Close
const log = [];
const url = () => location.pathname + location.search;
const ls = (k) => localStorage.getItem(k);
await __sleep(800);
await tap('Read'); await __sleep(900);
await tap('Open the enclosure'); await __sleep(1500);
const closes = __btns().filter((b) => b.getAttribute('aria-label') === 'Close');
log.push(['close controls', closes.length, closes.map((c) => { const r = c.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), r.width, r.height]; })]);
// what is painted at the drop ✕ (x 22-40, y 70-90)?
const hit = document.elementFromPoint(31, 80);
let h = hit; while (h && !(h.getAttribute && h.getAttribute('role') === 'button')) h = h.parentElement;
log.push(['hit at 31,80', h && h.getAttribute('aria-label')]);
__fire(h); await __sleep(1500);
log.push(['after drop X', url(), 'seen=' + ls('tideline.post.yearlydrop.seen'), 'postdone=' + ls('tideline.post.backondeck.delivered'), __txt().slice(0, 80)]);
// now the post letter's ✕ (top right)
const hit2 = document.elementFromPoint(362, 80);
let h2 = hit2; while (h2 && !(h2.getAttribute && h2.getAttribute('role') === 'button')) h2 = h2.parentElement;
log.push(['hit at 362,80', h2 && h2.getAttribute('aria-label')]);
__fire(h2); await __sleep(1500);
log.push(['after post X', url(), 'postdone=' + ls('tideline.post.backondeck.delivered')]);
console.error("LOG " + JSON.stringify(log)); return 1;
