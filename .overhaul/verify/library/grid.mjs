// grid.mjs out.png cols scale files... — grid montage, box-downscaled
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [out, cols, sc, ...files] = process.argv.slice(2); const k = Number(sc), C = Number(cols);
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
const w = Math.floor(imgs[0].width / k), h = Math.floor(imgs[0].height / k);
const R = Math.ceil(imgs.length / C); const W = C * w + (C - 1) * 6, H = R * h + (R - 1) * 6;
const O = new PNG({ width: W, height: H }); O.data.fill(255);
imgs.forEach((im, n) => { const ox = (n % C) * (w + 6), oy = Math.floor(n / C) * (h + 6);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let r = 0, g = 0, b = 0, c = 0;
    for (let dy = 0; dy < k; dy++) for (let dx = 0; dx < k; dx++) { const s = ((y * k + dy) * im.width + x * k + dx) * 4; r += im.data[s]; g += im.data[s + 1]; b += im.data[s + 2]; c++; }
    const o = ((oy + y) * W + ox + x) * 4; O.data[o] = r / c; O.data[o + 1] = g / c; O.data[o + 2] = b / c; O.data[o + 3] = 255; } });
fs.writeFileSync(out, PNG.sync.write(O)); console.log(out, W, H);
