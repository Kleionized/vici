// node .overhaul/f-sosb-sheet.mjs <size> <outPrefix> — the sos-boards size-sweep PNGs, 8 per sheet with captions
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [size, prefix] = process.argv.slice(2);
const files = JSON.parse(fs.readFileSync('.overhaul/groups.json', 'utf8'))['sos-boards'].map((f) => f.replace(/\.html$/, ''));
const [W, H] = size.split('x').map(Number);
const h = 520, w = Math.round((W / H) * h);
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await (await b.newContext({ viewport: { width: w * 4 + 40, height: 400 }, deviceScaleFactor: 1 })).newPage();
for (let i = 0; i < files.length; i += 8) {
  const imgs = files.slice(i, i + 8).map((f) => `<figure><img src="data:image/png;base64,${fs.readFileSync(`.overhaul/size-sweep/${size}/${f}.png`).toString('base64')}" style="width:${w}px;height:${h}px"><figcaption>${f}</figcaption></figure>`).join('');
  await p.setContent(`<html><body style="margin:0;background:#777;display:grid;grid-template-columns:repeat(4,auto);gap:6px;padding:6px;font:12px sans-serif;justify-content:start">${imgs}<style>figure{margin:0}</style></body></html>`);
  await p.screenshot({ path: `${prefix}-${size}-${i / 8 + 1}.png`, fullPage: true });
}
await b.close();
