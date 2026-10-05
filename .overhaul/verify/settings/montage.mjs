// usage: node montage.mjs out.png heightPx a.png b.png ...  (side by side, each scaled to heightPx, with labels)
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
const [out, H, ...imgs] = process.argv.slice(2);
const h = +H;
const parts = imgs.map((p) => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><div style="font:12px sans-serif;color:#ff0">${path.basename(p)}</div><img src="data:image/png;base64,${fs.readFileSync(p).toString('base64')}" style="height:${h}px;outline:1px solid #f0f"></div>`).join('');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const page = await browser.newPage({ viewport: { width: 2400, height: h + 30 } });
await page.setContent(`<body style="margin:0;background:#444;display:flex;gap:10px;align-items:flex-start;width:max-content">${parts}</body>`);
const w = await page.evaluate(() => document.body.scrollWidth);
await page.setViewportSize({ width: w, height: h + 30 });
await page.screenshot({ path: out });
await browser.close();
console.log('ok', w);
