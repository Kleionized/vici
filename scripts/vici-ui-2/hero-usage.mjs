// Every hero ([data-hero] svg) on every artboard of every canvas, as rendered:
// its id, inner markup hash, box, CSS transform and origin, and the inner markup
// of each distinct drawing. → pixel-diff/hero-usage.json
import { webkit } from 'playwright-core';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileKey, CLOCK, SETTLE_MS } from './common.mjs';
import { serve } from './serve.mjs';

const root = 'Vici UI 2/project';
const server = await serve(root, 4796);
const browser = await webkit.launch();
const files = fs.readdirSync(root).filter((f) => f.endsWith('.dc.html') && !f.includes('before label'));
const uses = [];
const drawings = {};
for (const f of files) {
  const page = await browser.newPage({ viewport: { width: 1800, height: 1200 } });
  await page.clock.install({ time: new Date(CLOCK) });
  await page.clock.pauseAt(new Date(CLOCK));
  await page.route('**/fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await page.goto(`http://localhost:4796/${encodeURIComponent(f)}`, { waitUntil: 'networkidle', timeout: 180000 });
  await page.clock.runFor(SETTLE_MS);
  await page.waitForTimeout(800);
  const found = await page.evaluate(() => {
    const frames = [...document.querySelectorAll('[data-screen-label]')];
    const out = [];
    frames.forEach((fr, i) => {
      const R = fr.getBoundingClientRect();
      for (const s of fr.querySelectorAll('svg[data-hero]')) {
        const cs = getComputedStyle(s);
        const r = s.getBoundingClientRect();
        out.push({ frame: i, id: s.getAttribute('data-hero'), inner: s.innerHTML, attrs: { width: s.getAttribute('width'), height: s.getAttribute('height'), viewBox: s.getAttribute('viewBox'), style: s.getAttribute('style') }, transform: cs.transform, origin: cs.transformOrigin, box: [r.left - R.left, r.top - R.top, r.width, r.height] });
      }
    });
    return out;
  });
  for (const u of found) {
    const h = crypto.createHash('sha1').update(u.inner).digest('hex').slice(0, 8);
    drawings[`${u.id}:${h}`] = u.inner;
    uses.push({ file: fileKey(f), frame: u.frame, id: u.id, h, attrs: u.attrs, transform: u.transform, origin: u.origin, box: u.box.map((v) => Math.round(v * 100) / 100) });
  }
  console.log(f, found.length, 'heroes');
  await page.close();
}
fs.writeFileSync('pixel-diff/hero-usage.json', JSON.stringify({ uses, drawings }, null, 1));
await browser.close();
server.close();
