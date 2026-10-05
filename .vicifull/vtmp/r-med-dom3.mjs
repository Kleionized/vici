import { chromium } from 'playwright-core';
const [route, seed, ms] = process.argv.slice(2);
import fs from 'node:fs';
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
if (seed && seed !== '-') { const s = fs.readFileSync(seed, 'utf8').replace('setTimeout(() => location.reload(), 0);', ''); await ctx.addInitScript(`try { ${s} } catch(e){}`); }
const p = await ctx.newPage();
await p.goto('http://localhost:8096' + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
await p.waitForTimeout(Number(ms || 3000));
const out = await p.evaluate(() => [...document.querySelectorAll('*')].filter((e) => { const c = getComputedStyle(e); return c.backgroundImage && c.backgroundImage.includes('noise'); })
  .map((e) => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return { rect: [r.x, r.y, r.width, r.height], pos: c.backgroundPosition, size: c.backgroundSize, rep: c.backgroundRepeat, op: c.opacity }; }));
console.log(JSON.stringify(out));
await b.close();
