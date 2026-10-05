import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [d, a, thr] = process.argv.slice(2);
const T = Number(thr || 12);
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
const load = (n) => fs.readFileSync(`.overhaul/shots/${n}.png`).toString('base64');
const out = await p.evaluate(async ([s1, s2, T]) => {
  const get = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode();
    const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
    const g = c.getContext('2d'); g.drawImage(i, 0, 0); return g.getImageData(0, 0, i.width, i.height); };
  const A = await get(s1), B = await get(s2); const W = A.width, S = W / 393;
  const runs = [];
  for (let y = Math.round(54*S); y < Math.round(830*S); y++) {
    let n = 0, minx = 1e9, maxx = -1, worst = 0;
    for (let x = 0; x < W; x++) { const i = (y*W+x)*4;
      const dd = Math.max(Math.abs(A.data[i]-B.data[i]), Math.abs(A.data[i+1]-B.data[i+1]), Math.abs(A.data[i+2]-B.data[i+2]));
      if (dd > T) { n++; if (x < minx) minx = x; if (x > maxx) maxx = x; if (dd > worst) worst = dd; } }
    if (n) runs.push(`y=${(y/S).toFixed(1)} n=${n} x=${(minx/S).toFixed(1)}..${(maxx/S).toFixed(1)} max=${worst}`);
  }
  return runs;
}, [load(d), load(a), T]);
console.log(out.join('\n') || 'no rows above threshold');
await b.close();
