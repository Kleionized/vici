import { chromium } from 'playwright-core';
import fs from 'node:fs';
const files = fs.readdirSync('.overhaul/final/Email-Login').filter(f=>/^SOS-(Loc|Feel|Trig)-.*\.html$/.test(f)).sort();
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu','--disable-dev-shm-usage','--js-flags=--max-old-space-size=256'] });
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 } })).newPage();
const seen = new Set();
for (const f of files) {
  await page.goto(`http://localhost:8097/f/Email-Login/${f}`, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const s = document.querySelector('svg[data-hero]');
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    for (const el of s.querySelectorAll('rect,path,circle,ellipse')) {
      const b = el.getBoundingClientRect(); if (!b.width && !b.height) continue;
      x0=Math.min(x0,b.left); y0=Math.min(y0,b.top); x1=Math.max(x1,b.right); y1=Math.max(y1,b.bottom);
    }
    return { hero: s.dataset.hero, n: s.querySelectorAll('*').length, box: [x0,y0,x1,y1].map(v=>+v.toFixed(1)) };
  });
  console.log(f.padEnd(28), r.hero.padEnd(11), 'elements', String(r.n).padStart(3), 'frame bbox x', r.box[0], '..', r.box[2], ' y', r.box[1], '..', r.box[3]);
}
await browser.close();
