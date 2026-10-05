import { chromium } from 'playwright-core';
const [route] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto('http://localhost:8096' + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
await p.waitForTimeout(1800);
const out = await p.evaluate(() => [...document.querySelectorAll('*')].filter((e) => {
  const c = getComputedStyle(e); return c.backgroundImage && c.backgroundImage !== 'none' && c.backgroundRepeat.includes('repeat');
}).map((e) => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e);
  return { tag: e.tagName, rect: [r.x, r.y, r.width, r.height], bg: c.backgroundImage.slice(-60), rep: c.backgroundRepeat, pos: c.backgroundPosition, size: c.backgroundSize, op: c.opacity }; }));
console.log(JSON.stringify(out, null, 1));
await b.close();
