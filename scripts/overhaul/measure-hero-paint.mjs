#!/usr/bin/env node
/**
 * Measure each illustration card's painted horizontal extent (art units) — the
 * floors and beams run past the 393 viewBox on purpose, and only the browser's
 * own geometry knows where they stop. Reads the 53 `Lesson-Illustrations-v4`
 * cards from the design server, takes the first `0 0 393 240` svg's content
 * `getBBox()`, and writes `scripts/overhaul/hero-paint.json` ({ id: [x0, x1] }),
 * an input of gen-heroes.mjs.
 */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const idx = JSON.parse(fs.readFileSync('.overhaul/final/Lesson-Illustrations-v4/_index.json', 'utf8'));
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await (await b.newContext({ viewport: { width: 900, height: 900 } })).newPage();
const out = {};
for (const f of idx.frames) {
  await p.goto(`http://localhost:8097/f/Lesson-Illustrations-v4/${f.file}`, { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const svg = [...document.querySelectorAll('svg')].find((s) => s.getAttribute('viewBox') === '0 0 393 240');
    if (!svg) return null;
    const id = svg.getAttribute('data-hero') || svg.closest('[data-hero]')?.getAttribute('data-hero');
    let x0 = Infinity, x1 = -Infinity;
    for (const el of svg.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon,text')) {
      const bb = el.getBBox();
      const m = el.getCTM(), root = svg.getCTM();
      if (!m || !root) continue;
      const inv = root.inverse().multiply(m); // element → svg user space
      for (const [x, y] of [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]]) {
        const X = inv.a * x + inv.c * y + inv.e;
        x0 = Math.min(x0, X); x1 = Math.max(x1, X);
      }
    }
    return { id, x0: Math.round(x0 * 10) / 10, x1: Math.round(x1 * 10) / 10 };
  });
  if (r?.id) out[r.id] = [r.x0, r.x1];
}
await b.close();
fs.writeFileSync('scripts/overhaul/hero-paint.json', JSON.stringify(out, null, 1));
console.log(Object.keys(out).length + ' cards', Object.entries(out).filter(([, v]) => v[0] < -30 || v[1] > 420).map(([k, v]) => `${k} ${v}`).join(' | '));
