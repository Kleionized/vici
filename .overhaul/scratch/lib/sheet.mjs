// usage: node sheet.mjs out.png a.png b.png ... — side by side at half size
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [out, ...imgs] = process.argv.slice(2);
const html = `<body style="margin:0;background:#444;display:flex;gap:6px;align-items:flex-start">` + imgs.map((p) => `<img src="data:image/png;base64,${fs.readFileSync(p).toString('base64')}" style="width:${Math.round(393*0.75)}px">`).join('') + `</body>`;
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const page = await browser.newPage({ viewport: { width: imgs.length * (Math.round(393*0.75) + 6), height: 1000 }, deviceScaleFactor: 1 });
await page.setContent(html); await page.waitForTimeout(200);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
