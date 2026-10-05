#!/usr/bin/env node
// node .overhaul/scratch/lessons-montage.mjs <out.png> <a.png> <b.png> … — side by side at half size (2x captures → 1x), 8px gaps
import fs from 'node:fs';
import { PNG } from 'pngjs';

const [out, ...files] = process.argv.slice(2);
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
const half = imgs.map((I) => ({ w: Math.floor(I.width / 2), h: Math.floor(I.height / 2), I }));
const GAP = 8;
const W = half.reduce((s, x) => s + x.w, 0) + GAP * (half.length - 1);
const H = Math.max(...half.map((x) => x.h));
const M = new PNG({ width: W, height: H });
M.data.fill(255);
let ox = 0;
for (const { w, h, I } of half) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let r = 0, g = 0, b = 0;
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const k = (I.width * (2 * y + dy) + 2 * x + dx) << 2; r += I.data[k]; g += I.data[k + 1]; b += I.data[k + 2]; }
    const t = (W * y + ox + x) << 2;
    M.data[t] = r >> 2; M.data[t + 1] = g >> 2; M.data[t + 2] = b >> 2; M.data[t + 3] = 255;
  }
  ox += w + GAP;
}
fs.writeFileSync(out, PNG.sync.write(M));
console.log(out, W, H);
