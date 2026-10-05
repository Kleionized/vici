import fs from 'node:fs';
import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage'] });
const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const seed = fs.readFileSync('.vicifull/weeks-seed.js','utf8').replace('setTimeout(() => location.reload(), 0);','');
await ctx.addInitScript(`try { ${seed} } catch(e){}`);
const p = await ctx.newPage();
await p.goto('http://localhost:8096/week/12', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(()=>{});
await p.waitForTimeout(2200);
const out = await p.evaluate(() => {
  const res = [];
  for (const n of document.querySelectorAll('div,span')) {
    const t = (n.textContent||'').trim();
    if (n.children.length) continue;
    if (!t) continue;
    const cs = getComputedStyle(n);
    if (parseFloat(cs.fontSize) < 10) continue;
    const r = n.getBoundingClientRect();
    res.push(`${t.slice(0,40)} | ${cs.fontSize} ${cs.fontWeight} | text-wrap:${cs.textWrap||cs.textWrapMode} style:${cs.textWrapStyle||''} | box ${r.x.toFixed(1)},${r.y.toFixed(1)},${r.width.toFixed(1)},${r.height.toFixed(1)} | -webkit-line-clamp:${cs.webkitLineClamp}`);
  }
  return res;
});
console.log(out.join('\n'));
await b.close();
