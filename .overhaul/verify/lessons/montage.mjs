#!/usr/bin/env node
// montage.mjs out.png cols scale img1 img2 ... — tile PNGs (box-downsampled by `scale`) into a grid
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, colsS, scaleS, ...files] = process.argv.slice(2);
const cols = Number(colsS), s = Number(scaleS);
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
const cw = Math.max(...imgs.map((i) => Math.floor(i.width / s))), ch = Math.max(...imgs.map((i) => Math.floor(i.height / s)));
const gap = 6, rows = Math.ceil(imgs.length / cols);
const W = cols * cw + (cols - 1) * gap, H = rows * ch + (rows - 1) * gap;
const o = new PNG({ width: W, height: H });
o.data.fill(255);
imgs.forEach((im, n) => {
  const ox = (n % cols) * (cw + gap), oy = Math.floor(n / cols) * (ch + gap);
  const w = Math.floor(im.width / s), h = Math.floor(im.height / s);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let r = 0, g = 0, b = 0, c = 0;
    for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) {
      const k = (im.width * (y * s + dy) + (x * s + dx)) << 2; r += im.data[k]; g += im.data[k + 1]; b += im.data[k + 2]; c++;
    }
    const k = (W * (oy + y) + ox + x) << 2;
    o.data[k] = r / c; o.data[k + 1] = g / c; o.data[k + 2] = b / c; o.data[k + 3] = 255;
  }
});
fs.writeFileSync(out, PNG.sync.write(o));
console.log(out, W + 'x' + H);
