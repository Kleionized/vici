const out = {};
const vis = () => [...document.querySelectorAll('[role="heading"]')].filter(e=>{const r=e.getBoundingClientRect();return r.left>-1&&r.right<innerWidth+1&&r.width>0}).map(e=>e.textContent);
await __sleep(500);
await tap('A week · board'); await __sleep(2000);
out.week1 = { path: location.pathname + location.search, h: vis() };
await tap('Back'); await __sleep(1200);
out.back = location.pathname;
// a second deep link while the tab is mounted
await tap('A week · board'); await __sleep(1500);
out.again = { path: location.pathname, h: vis() };
return out;
