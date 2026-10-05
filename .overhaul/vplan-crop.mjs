import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [name, x, y, w, h, scaleArg, out] = process.argv.slice(2);
const buf = fs.readFileSync(`.overhaul/shots/${name}.png`).toString('base64');
const br = await chromium.launch({ channel: 'chrome', headless: true });
const p = await br.newPage();
const dataUrl = await p.evaluate(async ([b64, x, y, w, h, s]) => {
  const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode();
  const dev = i.width / 393;
  const c = document.createElement('canvas'); c.width = w * s; c.height = h * s;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  g.drawImage(i, x*dev, y*dev, w*dev, h*dev, 0, 0, w*s, h*s);
  return c.toDataURL('image/png');
}, [buf, +x, +y, +w, +h, +(scaleArg||3)]);
fs.writeFileSync(out, Buffer.from(dataUrl.split(',')[1], 'base64'));
console.log('->', out);
await br.close();
