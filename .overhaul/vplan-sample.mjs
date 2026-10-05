import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [a, b, ptsArg] = process.argv.slice(2);
const pts = JSON.parse(ptsArg); // [[x,y,label],...] in CSS px
const br = await chromium.launch({ channel: 'chrome', headless: true });
const p = await br.newPage();
const res = {};
for (const f of [a, b]) {
  const buf = fs.readFileSync(`.overhaul/shots/${f}.png`).toString('base64');
  res[f] = await p.evaluate(async ([b64, pts]) => {
    const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode();
    const dev = i.width / 393;
    const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
    const g = c.getContext('2d'); g.drawImage(i, 0, 0);
    return pts.map(([x, y, l]) => l + '=' + [...g.getImageData(Math.round(x*dev), Math.round(y*dev), 1, 1).data].slice(0,3).join(','));
  }, [buf, pts]);
}
for (const k of Object.keys(res)) console.log(k.padEnd(30), res[k].join('  '));
await br.close();
