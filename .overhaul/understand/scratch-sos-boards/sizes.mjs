import { chromium } from 'playwright-core';
import fs from 'node:fs';
const files = fs.readdirSync('.overhaul/final/Email-Login').filter(f=>/^SOS-(Loc|Feel|Trig)-.*\.html$/.test(f)).sort();
const BREAKS = { 'SOS-Feel-Rejected': { t: 'Leave it alone\nfor ten minutes.' }, 'SOS-Loc-Elsewhere': { t: 'Get somewhere\nless private.' }, 'SOS-Trig-Habit': { t: 'Change what\nhappens next.' },
  'SOS-Loc-Bed': { b: 'Both feet on the floor. Stand up and leave\nthe bedroom.' }, 'SOS-Loc-Work': { b: 'Put your phone away. Don’t move somewhere\nmore private.' }, 'SOS-Feel-Unknown': { b: 'You don’t need to know why right now. Change\nrooms and put some distance between you and\nthe phone.' } };
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage','--js-flags=--max-old-space-size=256'] });
const page = await (await browser.newContext({ viewport: { width: 430, height: 932 } })).newPage();
const sizes = [[375,667,20],[390,844,54],[393,852,54],[430,932,54]];
const rows = [];
for (const f of files) {
  const k = f.replace('.html','');
  await page.goto(`http://localhost:8097/f/Email-Login/${f}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const another = await page.evaluate(() => document.body.textContent.includes('Give me another'));
  const r = await page.evaluate(({ br, sizes }) => {
    const stack = [...document.querySelectorAll('div')].find(d => d.style.top === '452px');
    const [h, p] = stack.children;
    h.style.textWrap = 'wrap'; p.style.textWrap = 'wrap'; h.style.whiteSpace = 'pre-line'; p.style.whiteSpace = 'pre-line';
    if (br?.t) h.textContent = br.t; if (br?.b) p.textContent = br.b;
    const out = [];
    for (const [W] of sizes) { stack.style.width = (W - 48) + 'px'; stack.style.right = 'auto'; out.push([h.getBoundingClientRect().height / 36, p.getBoundingClientRect().height / 24]); }
    return out;
  }, { br: BREAKS[k], sizes });
  const cells = sizes.map(([W, H, top], i) => { const [tl, bl] = r[i]; const bottom = top + 398 + tl * 36 + 18 + bl * 24; const cta = H - (another ? 96 : 48) - 58; return `${tl}/${bl} gap ${Math.round(cta - bottom)}`; });
  console.log(k.padEnd(22), another ? 'A' : ' ', cells.join(' | '));
}
await browser.close();
