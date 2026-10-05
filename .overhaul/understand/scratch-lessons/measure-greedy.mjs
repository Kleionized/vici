// Second pass: the same frames with text-wrap forced to plain greedy `wrap`, to count where
// balance/pretty change a line break (what RN native, which has no text-wrap, would draw).
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { lessons } from './tree.mjs';
const here = path.dirname(new URL(import.meta.url).pathname);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-extensions', '--no-first-run', '--js-flags=--max-old-space-size=256'] });
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 })).newPage();
const PROBE = `(() => {
  const st = document.createElement('style'); st.textContent = '* { text-wrap: wrap !important; }'; document.head.appendChild(st);
  const root = document.querySelector('[data-screen-label]');
  const block = [...root.children].find((e) => e.style.top === '140px' && e.style.bottom === '128px');
  const leaves = [...block.querySelectorAll('div,span')].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  return leaves.map((e) => {
    const tn = [...e.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    const s = tn.textContent; const words = []; const re = /\\S+/g; let m;
    while ((m = re.exec(s))) { const rg = document.createRange(); rg.setStart(tn, m.index); rg.setEnd(tn, m.index + m[0].length); words.push([m[0], Math.round(rg.getClientRects()[0].top)]); }
    const lines = []; let cur = null;
    for (const [w, t] of words) { if (!cur || Math.abs(t - cur.t) > 3) { cur = { t, w: [] }; lines.push(cur); } cur.w.push(w); }
    return lines.map((l) => l.w.join(' '));
  });
})()`;
const out = {}; let n = 0;
for (const L of lessons()) for (const F of L.frames) {
  await page.goto(`http://localhost:8097/f/${L.weekDir}/${path.basename(F.file)}`, { waitUntil: 'load' });
  await page.evaluate("Promise.all([document.fonts.load('400 18px Lato'), document.fonts.load('700 18px Lato')]).then(() => document.fonts.ready)");
  out[F.label] = await page.evaluate(PROBE);
  if (++n % 100 === 0) process.stderr.write(n + '\n');
}
fs.writeFileSync(path.join(here, 'measure-greedy.json'), JSON.stringify(out));
await browser.close(); console.error('done', n);
