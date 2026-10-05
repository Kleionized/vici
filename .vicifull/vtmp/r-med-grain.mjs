#!/usr/bin/env node
/* Grain instrument. Over one frame-point rect (nothing masked inside it):
   - mean level of each side, and mean signed difference
   - horizontal and vertical high-frequency energy: mean |p(x+1)-p(x)| and
     |p(y+1)-p(y)| on the luma. A 96x96 tile repeated at native size keeps its
     1px speckle and reads ~1.3; the same tile stretched 4x/9x reads ~0.1.
   - best integer (dx,dy) shift of the app band against the design band, by
     minimising mean |Δ| over ±6 device pixels — a tiled texture in phase
     lands at (0,0).
   Usage: node r-med-grain.mjs <dSig> <aSig> x0 y0 x1 y1   (frame points) */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [d, a, X0, Y0, X1, Y1] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const p = await b.newPage();
const bd = fs.readFileSync(`.vicifull/shots/${d}.png`).toString('base64');
const ba = fs.readFileSync(`.vicifull/shots/${a}.png`).toString('base64');
const out = await p.evaluate(async ([x, y, r]) => {
  const load = async (b64) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; c.getContext('2d').drawImage(i, 0, 0); return c.getContext('2d').getImageData(0, 0, i.width, i.height); };
  const A = await load(x), B = await load(y);
  const [x0, y0, x1, y1] = r.map((v) => v * 2);
  const lum = (I, px, py) => { const i = (py * I.width + px) * 4; return 0.299 * I.data[i] + 0.587 * I.data[i + 1] + 0.114 * I.data[i + 2]; };
  const prof = (I) => {
    let s = 0, hx = 0, hy = 0, n = 0, m = 0;
    for (let py = y0; py < y1; py++) for (let px = x0; px < x1; px++) {
      const v = lum(I, px, py); s += v; n++;
      if (px + 1 < x1) { hx += Math.abs(lum(I, px + 1, py) - v); m++; }
      if (py + 1 < y1) hy += Math.abs(lum(I, px, py + 1) - v);
    }
    return { mean: +(s / n).toFixed(3), hEnergy: +(hx / m).toFixed(3), vEnergy: +(hy / m).toFixed(3) };
  };
  const shift = () => {
    let best = null;
    for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) {
      let s = 0, n = 0;
      for (let py = y0 + 8; py < y1 - 8; py++) for (let px = x0 + 8; px < x1 - 8; px++) {
        s += Math.abs(lum(A, px, py) - lum(B, px + dx, py + dy)); n++;
      }
      const v = s / n;
      if (!best || v < best.v) best = { dx, dy, v: +v.toFixed(3) };
    }
    return best;
  };
  let sum = 0, signed = 0, n = 0, worst = 0;
  for (let py = y0; py < y1; py++) for (let px = x0; px < x1; px++) {
    const i = (py * A.width + px) * 4;
    for (let k = 0; k < 3; k++) { const dd = A.data[i + k] - B.data[i + k]; signed += dd; sum += Math.abs(dd); n++; if (Math.abs(dd) > worst) worst = Math.abs(dd); }
  }
  return { design: prof(A), app: prof(B), absMean: +(sum / n).toFixed(3), signedMean: +(signed / n).toFixed(3), worst, bestShift: shift() };
}, [bd, ba, [+X0, +Y0, +X1, +Y1]]);
console.log(JSON.stringify(out, null, 1));
await b.close();
