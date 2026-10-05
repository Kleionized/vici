import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage','--js-flags=--max-old-space-size=256'] });
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 } })).newPage();
await page.goto('http://localhost:8097/f/Email-Login/SOS-Loc-Bed.html', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const lines = JSON.parse(process.argv[2]);
const r = await page.evaluate((lines) => {
  const out = [];
  for (const [txt, size, weight, ls] of lines) {
    const s = document.createElement('span');
    s.style.cssText = `font-family:Lato; font-size:${size}px; font-weight:${weight}; letter-spacing:${ls}px; white-space:nowrap; position:absolute; top:0; left:0`;
    s.textContent = txt; document.body.appendChild(s);
    out.push([txt, +s.getBoundingClientRect().width.toFixed(2)]); s.remove();
  }
  return out;
}, lines);
for (const x of r) console.log(x[1], JSON.stringify(x[0]));
await browser.close();
