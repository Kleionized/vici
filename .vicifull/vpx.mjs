import fs from 'node:fs';
import { chromium } from 'playwright-core';
// node vpx.mjs a.png b.png "x,y x,y ..."   (frame coords)
const [a, b, pts] = process.argv.slice(2);
const list = pts.split(' ').map((p) => p.split(',').map(Number));
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setContent('<body></body>');
for (const f of [a, b]) {
  const d = 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
  const out = await page.evaluate(async ({ d, list }) => {
    const img = new Image(); img.src = d; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const s = img.width / 393;
    return list.map(([x, y]) => { const p = g.getImageData(Math.round(x * s), Math.round(y * s), 1, 1).data; return `${x},${y}=${p[0]},${p[1]},${p[2]}`; }).join('  ');
  }, { d, list });
  console.log(f.split('/').pop().padEnd(34), out);
}
await browser.close();
