/* GROUP slip — crop the same frame window out of N PNGs, side by side, upscaled ×k for looking.
   node .overhaul/slip-zoom.mjs out.png x y w h k a.png b.png … */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, X, Y, W, H, K, ...srcs] = process.argv.slice(2);
const imgs = srcs.map((f) => PNG.sync.read(fs.readFileSync(f)));
const s = imgs[0].width / 393, k = Number(K);
const w = Math.round(W * s), h = Math.round(H * s), x0 = Math.round(X * s), y0 = Math.round(Y * s), gap = 6;
const dst = new PNG({ width: (w * imgs.length + gap * (imgs.length - 1)) * k, height: h * k });
dst.data.fill(255);
imgs.forEach((img, i) => {
  const ox = i * (w + gap);
  for (let y = 0; y < h * k; y++) for (let x = 0; x < w * k; x++) {
    const si = ((y0 + (y / k | 0)) * img.width + (x0 + (x / k | 0))) * 4, di = (y * dst.width + (ox * k) + x) * 4;
    for (let c = 0; c < 4; c++) dst.data[di + c] = img.data[si + c] ?? 255;
  }
});
fs.writeFileSync(out, PNG.sync.write(dst));
