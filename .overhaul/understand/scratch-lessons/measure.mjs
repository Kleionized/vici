// Measure every week-canvas lesson frame in the design server (Lato from the app's TTFs):
// content-block extent, per-text line count and the exact line breaks Chrome draws
// (text-wrap: balance / pretty included), plus the natural content height at other widths.
// One Chrome, frames visited sequentially.  Usage: node measure.mjs [--only=L1] > /dev/null
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { lessons } from './tree.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-extensions', '--no-first-run', '--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

const PROBE = `(() => {
  const root = document.querySelector('[data-screen-label]');
  const fontsOk = document.fonts.check('700 24px Lato') && document.fonts.check('400 18px Lato');
  const block = [...root.children].find((e) => e.style.top === '140px' && e.style.bottom === '128px');
  const kids = [...block.children];
  const r = (e) => e.getBoundingClientRect();
  const top = Math.min(...kids.map((e) => r(e).top)), bottom = Math.max(...kids.map((e) => r(e).bottom));
  // every leaf text element inside the block
  const texts = [];
  const leaves = [...block.querySelectorAll('div,span')].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  for (const e of leaves) {
    const tn = [...e.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    const s = tn.textContent;
    const words = []; const re = /\\S+/g; let m;
    while ((m = re.exec(s))) { const rg = document.createRange(); rg.setStart(tn, m.index); rg.setEnd(tn, m.index + m[0].length); const rr = rg.getClientRects()[0]; words.push([m[0], Math.round(rr.top)]); }
    const lines = []; let cur = null;
    for (const [w, t] of words) { if (!cur || Math.abs(t - cur.t) > 3) { cur = { t, w: [] }; lines.push(cur); } cur.w.push(w); }
    const cs = getComputedStyle(e);
    texts.push({ text: s.replace(/\\s+/g, ' ').trim(), fs: cs.fontSize, lh: cs.lineHeight, wrap: cs.textWrap || cs.textWrapStyle || '', lines: lines.map((l) => l.w.join(' ')), w: Math.round(r(e).width * 10) / 10, top: Math.round(r(e).top * 10) / 10 });
  }
  return { fontsOk, top: Math.round(top * 10) / 10, bottom: Math.round(bottom * 10) / 10, h: Math.round((bottom - top) * 10) / 10, texts };
})()`;

// natural content height at another root width (the block's children laid out top-down)
const natural = (W) => `(() => {
  const root = document.querySelector('[data-screen-label]');
  root.style.width = '${W}px';
  const block = [...root.children].find((e) => e.style.top === '140px' && e.style.bottom === '128px');
  block.style.justifyContent = 'flex-start'; block.style.bottom = 'auto'; block.style.height = 'auto';
  const kids = [...block.children];
  const h = Math.max(...kids.map((e) => e.getBoundingClientRect().bottom)) - Math.min(...kids.map((e) => e.getBoundingClientRect().top));
  return Math.round(h * 10) / 10;
})()`;

const out = {};
let n = 0;
for (const L of lessons()) {
  if (only && `L${L.n}` !== only) continue;
  for (const F of L.frames) {
    const url = `http://localhost:8097/f/${L.weekDir}/${path.basename(F.file)}`;
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate("Promise.all([document.fonts.load('400 18px Lato'), document.fonts.load('700 18px Lato')]).then(() => document.fonts.ready)");
    const m = await page.evaluate(PROBE);
    if (!m.fontsOk) console.error('[fonts] Lato NOT loaded', F.label);
    const nat = {};
    for (const W of [393, 375, 430]) { await page.goto(url, { waitUntil: 'load' }); await page.evaluate('document.fonts.ready'); nat[W] = await page.evaluate(natural(W)); }
    out[F.label] = { ...m, natural: nat };
    if (++n % 50 === 0) { process.stderr.write(`${n}\n`); fs.writeFileSync(path.join(here, 'measure.json'), JSON.stringify(out)); }
  }
}
fs.writeFileSync(path.join(here, 'measure.json'), JSON.stringify(out));
await browser.close();
console.error('done', n);
