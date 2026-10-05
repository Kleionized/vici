// node .overhaul/f-sosflow-montage.mjs out.png a.png b.png ... — side-by-side sheet (each image scaled to height H)
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
const [out, ...files] = process.argv.slice(2);
const H = Number(process.env.H ?? 560);
const imgs = files.map((f) => `<figure><img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}" style="height:${H}px"><figcaption>${path.basename(f)}</figcaption></figure>`).join('');
const html = `<html><body style="margin:0;background:#777;display:flex;flex-wrap:wrap;gap:6px;padding:6px;font:11px sans-serif">${imgs}<style>figure{margin:0;display:flex;flex-direction:column;align-items:center}</style></body></html>`;
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const page = await (await browser.newContext({ viewport: { width: Number(process.env.W ?? 1400), height: 400 }, deviceScaleFactor: 1 })).newPage();
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log('montage ->', out);
