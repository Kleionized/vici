/* Is the residual over the flat ground a grain PHASE offset or just dither?
   Slide the app image over the design in x and y (device px) and report the
   mean |delta| in a region with no content on it. */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [a, b, x, y, w, h] = process.argv.slice(2);
const L = (n) => fs.readFileSync(`.vicifull/shots/${n}.png`).toString('base64');
const br = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
const p = await br.newPage();
const out = await p.evaluate(async ([A, B, r]) => {
  const get = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode();
    const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
    const g = c.getContext('2d'); g.drawImage(i, 0, 0); return { d: g.getImageData(0,0,i.width,i.height), w: i.width }; };
  const ga = await get(A), gb = await get(B);
  const dev = ga.w / 393;
  const x0 = Math.round(r[0]*dev), y0 = Math.round(r[1]*dev), x1 = Math.round((r[0]+r[2])*dev), y1 = Math.round((r[1]+r[3])*dev);
  const res = [];
  for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
    let s = 0, n = 0;
    for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) {
      const i = (yy*ga.w + xx)*4, j = ((yy+dy)*ga.w + (xx+dx))*4;
      s += Math.abs(ga.d.data[i] - gb.d.data[j]); n++;
    }
    res.push({ dx, dy, mean: +(s/n).toFixed(3) });
  }
  res.sort((p,q)=>p.mean-q.mean);
  return { best: res.slice(0,3), zero: res.find((v)=>v.dx===0&&v.dy===0) };
}, [L(a), L(b), [Number(x),Number(y),Number(w),Number(h)]]);
console.log(JSON.stringify(out));
await br.close();
