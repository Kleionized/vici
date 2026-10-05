/* Does the canvas's `text-wrap: pretty|balance` actually move a line break?
   RN has no equivalent, so wherever it does, the device breaks elsewhere. */
import { chromium } from 'playwright-core';
const [bundle, frame] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const p = await (await b.newContext({ viewport: { width: 393, height: 852 } })).newPage();
await p.goto(`http://localhost:8097/f/${bundle}/${frame}`, { waitUntil: 'networkidle' });
const rows = await p.evaluate(() => {
  const lines = (el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    return [...r.getClientRects()].map((x) => Math.round(x.width * 10) / 10 + '@' + Math.round(x.top));
  };
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    const v = el.style.textWrap || el.style.getPropertyValue('text-wrap');
    if (!v || v === 'wrap') continue;
    const was = lines(el);
    el.style.textWrap = 'wrap';
    const now = lines(el);
    el.style.textWrap = v;
    out.push({ v, same: JSON.stringify(was) === JSON.stringify(now), was, now, text: (el.textContent || '').trim().slice(0, 60) });
  }
  return out;
});
for (const r of rows) console.log(`${r.same ? 'same  ' : 'MOVES '} ${r.v.padEnd(8)} ${r.text}\n        pretty ${r.was.join(' ')}\n        plain  ${r.now.join(' ')}`);
await b.close();
