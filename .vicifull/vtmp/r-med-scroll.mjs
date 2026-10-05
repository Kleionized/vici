import fs from 'node:fs'; import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const s = fs.readFileSync('.vicifull/medallions-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
await ctx.addInitScript(`try { ${s} } catch(e){}`);
const p = await ctx.newPage();
await p.goto('http://localhost:8096/milestones', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
await p.waitForTimeout(2200);
console.log(JSON.stringify(await p.evaluate(() => {
  const sc = [...document.querySelectorAll('div')].filter((d) => d.scrollHeight > d.clientHeight + 8).map((d) => { const r = d.getBoundingClientRect(); return { rect: [r.x, r.y, r.width, r.height], sh: d.scrollHeight, ct: d.clientHeight, top: d.scrollTop, ov: getComputedStyle(d).overflowY }; });
  const bar = [...document.querySelectorAll('div')].map((d) => ({ d, c: getComputedStyle(d) })).filter((x) => x.c.backgroundColor.includes('0.95')).map((x) => { const r = x.d.getBoundingClientRect(); return { rect: [r.x, r.y, r.width, r.height], bg: x.c.backgroundColor }; });
  return { scrollers: sc, bar };
}), null, 1));
await b.close();
