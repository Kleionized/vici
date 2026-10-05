/* Bundle-wide: which canvas boxes does `text-wrap: pretty|balance` actually
   move a line break in? RN has no equivalent, so each of those is a break the
   device cannot reproduce — and the web capture hides it, because AppText
   applies the same property on web. */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const bundle = process.argv[2] || 'Email-Login';
const frames = fs.readdirSync(`.overhaul/final/${bundle}`).filter((f) => f.endsWith('.html') && !f.startsWith('_'));
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
const p = await (await b.newContext({ viewport: { width: 393, height: 852 } })).newPage();
let total = 0, moved = 0;
for (const f of frames) {
  await p.goto(`http://localhost:8097/f/${bundle}/${f}`, { waitUntil: 'domcontentloaded' });
  const rows = await p.evaluate(() => {
    const rects = (el) => { const r = document.createRange(); r.selectNodeContents(el); return [...r.getClientRects()].map((x) => Math.round(x.width * 10) / 10 + '@' + Math.round(x.top)).join(' '); };
    const out = [];
    for (const el of document.querySelectorAll('*')) {
      const v = el.style.textWrap || el.style.getPropertyValue('text-wrap');
      if (!v || v === 'wrap') continue;
      const was = rects(el); el.style.textWrap = 'wrap'; const now = rects(el); el.style.textWrap = v;
      out.push({ v, same: was === now, was, now, text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70) });
    }
    return out;
  });
  for (const r of rows) { total++; if (!r.same) { moved++; console.log(`${f}  [${r.v}]  ${r.text}\n     canvas ${r.was}\n     plain  ${r.now}`); } }
}
console.log(`\n${moved} of ${total} text-wrap boxes in ${bundle} actually move a line break`);
await b.close();
