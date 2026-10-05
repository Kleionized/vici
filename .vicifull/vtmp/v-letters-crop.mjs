/* node v-letters-crop.mjs <shot> <y0> <y1> [out] — crop a shot to a y band (CSS px) */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [f, y0, y1, out] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args:['--disable-gpu'] });
const p = await b.newPage();
const b64 = fs.readFileSync(`.vicifull/shots/${f}.png`).toString('base64');
const d = await p.evaluate(async ([s, y0, y1]) => {
  const i = new Image(); i.src='data:image/png;base64,'+s; await i.decode();
  const c=document.createElement('canvas'); c.width=i.width; c.height=(y1-y0)*2;
  const g=c.getContext('2d'); g.drawImage(i,0,-y0*2);
  return c.toDataURL('image/png').split(',')[1];
}, [b64, Number(y0), Number(y1)]);
fs.writeFileSync(out || `.vicifull/shots/${f}-crop.png`, Buffer.from(d,'base64'));
console.log('ok', out || `.vicifull/shots/${f}-crop.png`);
await b.close();
