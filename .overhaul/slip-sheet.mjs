/* GROUP slip — contact sheet: N PNGs downscaled by `k` into a grid of `cols`, for looking at many captures at once.
   node .overhaul/slip-sheet.mjs out.png k cols a.png b.png … */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, K, C, ...srcs] = process.argv.slice(2);
const k = Number(K), cols = Number(C);
const imgs = srcs.map((f) => PNG.sync.read(fs.readFileSync(f)));
const w = Math.floor(imgs[0].width / k), h = Math.floor(imgs[0].height / k), g = 6;
const rows = Math.ceil(imgs.length / cols);
const dst = new PNG({ width: cols * (w + g), height: rows * (h + g) });
dst.data.fill(255);
imgs.forEach((img, i) => {
  const ox = (i % cols) * (w + g), oy = Math.floor(i / cols) * (h + g);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const acc = [0, 0, 0, 0];
    for (let dy = 0; dy < k; dy++) for (let dx = 0; dx < k; dx++) { const si = ((y * k + dy) * img.width + (x * k + dx)) * 4; for (let c = 0; c < 4; c++) acc[c] += img.data[si + c]; }
    const di = ((oy + y) * dst.width + ox + x) * 4;
    for (let c = 0; c < 4; c++) dst.data[di + c] = acc[c] / (k * k);
  }
});
fs.writeFileSync(out, PNG.sync.write(dst));
