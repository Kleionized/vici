// Lists every artboard in every design canvas: section, label, screen id, bounds.
import { webkit } from 'playwright-core';
import fs from 'node:fs';
import { serve } from './serve.mjs';

const root = 'Vici UI 2/project';
const server = await serve(root, 4791);
const files = fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();
const browser = await webkit.launch();
const out = {};
for (const f of files) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto(`http://localhost:4791/${encodeURIComponent(f)}`, { waitUntil: 'networkidle', timeout: 120000 }).catch(e => errs.push(String(e)));
  await page.waitForTimeout(2500);
  const frames = await page.evaluate(() => [...document.querySelectorAll('[data-screen-label]')].map(el => {
    const r = el.getBoundingClientRect();
    const label = el.previousElementSibling?.textContent?.trim() ?? '';
    let sec = '';
    let n = el.parentElement;
    while (n && !sec) { const t = n.previousElementSibling; if (t && getComputedStyle(t).borderRadius === '100px') sec = t.textContent.trim(); n = n.parentElement; }
    return { screen: el.getAttribute('data-screen-label'), label, sec, w: Math.round(r.width), h: Math.round(r.height) };
  }));
  out[f] = { count: frames.length, errs, frames };
  console.log(f, frames.length, errs.slice(0, 2).join(' | '));
  await page.close();
}
fs.mkdirSync('pixel-diff', { recursive: true });
fs.writeFileSync('pixel-diff/probe.json', JSON.stringify(out, null, 1));
await browser.close();
server.close();
