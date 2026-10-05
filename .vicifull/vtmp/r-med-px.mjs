#!/usr/bin/env node
/* Whole-image |Δ| between a design shot and an app shot.
   EXCLUDES: the top 54 frame-points (108 device rows) of status bar the app
   never draws — and NOTHING else. Gradients, grain, blurred washes, text and
   the Expo dev badge are all counted. A second row reports the same numbers
   with the dev-badge box (x 0-40, y 780-830 frame points) also removed, so the
   badge can never be mistaken for app content or hide a defect under it. */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const pairs = JSON.parse(process.argv[2]);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const p = await b.newPage();
for (const [d, a, label] of pairs) {
  const bd = fs.readFileSync(`.vicifull/shots/${d}.png`).toString('base64');
  const ba = fs.readFileSync(`.vicifull/shots/${a}.png`).toString('base64');
  const out = await p.evaluate(async ([x, y]) => {
    const load = async (b64) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; c.getContext('2d').drawImage(i, 0, 0); return c.getContext('2d').getImageData(0, 0, i.width, i.height); };
    const A = await load(x), B = await load(y);
    if (A.width !== B.width || A.height !== B.height) return { err: `size ${A.width}x${A.height} vs ${B.width}x${B.height}` };
    const skipTop = 108;
    const stat = (badge) => {
      let sum = 0, o8 = 0, o32 = 0, worst = 0, wx = 0, wy = 0, n = 0;
      for (let py = skipTop; py < A.height; py++) for (let px = 0; px < A.width; px++) {
        if (badge && px < 80 && py >= 1560 && py < 1660) continue;
        const i = (py * A.width + px) * 4;
        const dd = Math.max(Math.abs(A.data[i]-B.data[i]), Math.abs(A.data[i+1]-B.data[i+1]), Math.abs(A.data[i+2]-B.data[i+2]));
        sum += dd; n++; if (dd > 8) o8++; if (dd > 32) o32++;
        if (dd > worst) { worst = dd; wx = px; wy = py; }
      }
      return { mean: +(sum / n).toFixed(3), pct8: +(100 * o8 / n).toFixed(2), pct32: +(100 * o32 / n).toFixed(3), worst, at: [Math.round(wx/2), Math.round(wy/2)] };
    };
    return { all: stat(false), noBadge: stat(true) };
  }, [bd, ba]);
  console.log(label.padEnd(26), JSON.stringify(out));
}
await b.close();
