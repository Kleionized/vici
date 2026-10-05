import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:8097/f/Email-Login/Campaign-Map-II.html', { waitUntil: 'networkidle' });
const r = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('div')) {
    const cs = getComputedStyle(el);
    if (cs.backgroundColor === 'rgb(138, 133, 124)') { const b = el.getBoundingClientRect(); out.push({ left: b.left, top: b.top, w: b.width, h: b.height, r: cs.borderRadius, tr: cs.transform }); }
  }
  return out;
});
console.log(JSON.stringify(r));
await browser.close();
