import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [a, b, thrArg, cropArg] = process.argv.slice(2);
const thr = Number(thrArg ?? 12);
const crop = cropArg ? cropArg.split(',').map(Number) : null; // x,y,w,h in CSS px (design coords)
const bufA = fs.readFileSync(`.vicifull/shots/${a}.png`).toString('base64');
const bufB = fs.readFileSync(`.vicifull/shots/${b}.png`).toString('base64');
const br = await chromium.launch({ channel: 'chrome', headless: true });
const p = await br.newPage();
const out = await p.evaluate(async ([b64a, b64b, thr, crop]) => {
  const load = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode(); return i; };
  const ia = await load(b64a), ib = await load(b64b);
  const w = Math.min(ia.width, ib.width), h = Math.min(ia.height, ib.height);
  const mk = (img) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, w, h).data; };
  const da = mk(ia), db = mk(ib);
  const scale = w / 393;
  let x0 = 0, y0 = 0, x1 = w, y1 = h;
  if (crop) { x0 = Math.round(crop[0]*scale); y0 = Math.round(crop[1]*scale); x1 = Math.round((crop[0]+crop[2])*scale); y1 = Math.round((crop[1]+crop[3])*scale); }
  let n = 0, worst = 0, wx = 0, wy = 0; const rows = {};
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * w + x) * 4;
    const d = Math.max(Math.abs(da[i]-db[i]), Math.abs(da[i+1]-db[i+1]), Math.abs(da[i+2]-db[i+2]));
    if (d > thr) { n++; rows[Math.round(y/scale)] = (rows[Math.round(y/scale)]||0)+1; if (d > worst) { worst = d; wx = x/scale; wy = y/scale; } }
  }
  const top = Object.entries(rows).sort((p,q)=>q[1]-p[1]).slice(0,14);
  return { size:[w,h], differing:n, worst, at:[Math.round(wx),Math.round(wy)], topRows: top };
}, [bufA, bufB, thr, crop]);
console.log(JSON.stringify(out));
await br.close();
