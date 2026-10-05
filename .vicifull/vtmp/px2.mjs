import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [files, ptsJson] = [process.argv[2].split(','), process.argv[3]];
const pts = JSON.parse(ptsJson);
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
for (const f of files) {
  const buf = fs.readFileSync(`.vicifull/shots/${f}.png`).toString('base64');
  const out = await p.evaluate(async ([b64, pts]) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    return pts.map(([x, y, l]) => l + '=' + [...g.getImageData(x*2, y*2, 1, 1).data].slice(0,3).join(','));
  }, [buf, pts]);
  console.log(f.padEnd(22), out.join('  '));
}
await b.close();
