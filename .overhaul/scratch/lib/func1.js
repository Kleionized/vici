const out = {};
const vis = () => { const hs=[...document.querySelectorAll('[role="heading"]')].filter(e=>{const r=e.getBoundingClientRect();return r.left>-1&&r.right<innerWidth+1&&r.width>0}); return hs.map(e=>e.textContent); };
out.open = { path: location.pathname + location.search, heading: vis() };
// pager: turn to week VII by scrolling the horizontal scroller
const pager = [...document.querySelectorAll('*')].find(e => /(auto|scroll)/.test(getComputedStyle(e).overflowX) && e.scrollWidth > e.clientWidth * 5);
pager.scrollLeft = 6 * innerWidth; pager.dispatchEvent(new Event('scroll'));
await __sleep(800);
out.swiped = vis();
pager.scrollLeft = 5 * innerWidth; pager.dispatchEvent(new Event('scroll'));
await __sleep(800);
out.back6 = vis();
// row tap → lesson reader
await tap('Keep rules that serve a purpose, lesson 38, today');
await __sleep(1500);
out.row = location.pathname;
return out;
