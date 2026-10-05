import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage'] });
const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
for (const route of process.argv.slice(2)) {
  await p.goto('http://localhost:8096' + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(3000);
  const bad = await p.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('path,rect,circle,ellipse,filter,radialGradient,linearGradient,stop')) {
      for (const a of el.attributes) if (/NaN|Infinity|undefined/.test(a.value)) out.push(el.tagName + ' ' + a.name + '=' + a.value.slice(0, 80));
    }
    return out.slice(0, 10);
  });
  console.log(route, bad.length ? bad : 'clean');
}
await b.close();
