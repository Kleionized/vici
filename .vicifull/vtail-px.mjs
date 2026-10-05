/* Compare two shots numerically: mean/max abs channel diff over the body
   (y 54…830), a coarse 8-column x 16-row block map of where they differ, and
   optional point samples. Usage: node vtail-px.mjs d a [x,y ...] */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [d, a, ...pts] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
const load = (n) => fs.readFileSync(`.vicifull/shots/${n}.png`).toString('base64');
const out = await p.evaluate(async ([b1, b2, pts]) => {
  const get = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode();
    const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
    const g = c.getContext('2d'); g.drawImage(i, 0, 0); return g.getImageData(0, 0, i.width, i.height); };
  const A = await get(b1), B = await get(b2);
  const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
  const S = W / 393; // deviceScaleFactor
  const y0 = Math.round(54 * S), y1 = Math.round(830 * S);
  let sum = 0, n = 0, max = 0, maxAt = null;
  const BX = 8, BY = 16; const blocks = Array.from({ length: BY }, () => Array(BX).fill(0));
  for (let y = y0; y < y1; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const dd = Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i+1] - B.data[i+1]), Math.abs(A.data[i+2] - B.data[i+2]));
    sum += dd; n++; if (dd > max) { max = dd; maxAt = [Math.round(x / S), Math.round(y / S)]; }
    if (dd > 12) blocks[Math.min(BY - 1, Math.floor((y - y0) / ((y1 - y0) / BY)))][Math.floor(x / (W / BX))]++;
  }
  const samples = pts.map((q) => { const [x, y] = q.split(',').map(Number); const i = ((Math.round(y*S)) * W + Math.round(x*S)) * 4;
    return `${x},${y}  d=${A.data[i]},${A.data[i+1]},${A.data[i+2]}  a=${B.data[i]},${B.data[i+1]},${B.data[i+2]}`; });
  return { mean: (sum / n).toFixed(2), max, maxAt, blocks, samples, px: n };
}, [load(d), load(a), pts]);
console.log(`mean|Δ| ${out.mean}   max ${out.max} at ${out.maxAt}`);
console.log('blocks with >12Δ pixels (rows of 8 columns, body y54-830):');
for (const [i, r] of out.blocks.entries()) console.log(String(54 + Math.round(i * 776 / 16)).padStart(4), r.map((v) => String(v).padStart(6)).join(''));
for (const s of out.samples) console.log(s);
await b.close();
