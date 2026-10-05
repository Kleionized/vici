const log = [];
const url = () => location.pathname + location.search;
const step = async (name, fn, wait = 1300) => { try { await fn(); await __sleep(wait); log.push([name, url(), __txt().slice(0, 200)]); } catch (e) { log.push([name, 'ERR ' + e.message.slice(0, 200)]); } };
await __sleep(800);
await step('Still to earn', () => tap('Still to earn'), 700);
const pager = () => [...document.querySelectorAll('div')].find((x) => x.scrollWidth > x.clientWidth + 8);
log.push(['pager', !!pager(), pager() && [pager().scrollWidth, pager().clientWidth]]);
const p = pager(); if (p) { p.scrollLeft = p.clientWidth; await __sleep(600); log.push(['scrolled', p.scrollLeft]); }
await step('Earned', () => tap('Earned'), 600);
await step('Still to earn again', () => tap('Still to earn'), 700);
const p2 = pager(); log.push(['pager after re-switch scrollLeft', p2 && p2.scrollLeft]);
// tap a face on page 2
if (p2) { p2.scrollLeft = p2.clientWidth; await __sleep(600); }
const cells = __btns().map((b) => b.getAttribute('aria-label')).filter((l) => l && /\. /.test(l));
log.push(['cells', cells]);
await step('tap last cell', () => tap(cells[cells.length - 1]), 1400);
console.error("LOG " + JSON.stringify(log)); return 1;
