/* Crop the same frame-coordinate window out of N PNGs and write them side by
   side, so a difference the numbers report can be looked at. Usage:
   node f-slip-crop.mjs out.png x y w h a.png b.png [c.png …]   (frame coords) */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, X, Y, W, H, ...srcs] = process.argv.slice(2);
const imgs = srcs.map((f) => PNG.sync.read(fs.readFileSync(f)));
const s = imgs[0].width / 393;
const w = Math.round(W * s), h = Math.round(H * s), x0 = Math.round(X * s), y0 = Math.round(Y * s);
const gap = 8;
const dst = new PNG({ width: w * imgs.length + gap * (imgs.length - 1), height: h });
dst.data.fill(255);
imgs.forEach((img, i) => {
  const ox = i * (w + gap);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const si = ((y0 + y) * img.width + (x0 + x)) * 4, di = (y * dst.width + ox + x) * 4;
    for (let c = 0; c < 4; c++) dst.data[di + c] = img.data[si + c] ?? 255;
  }
});
fs.writeFileSync(out, PNG.sync.write(dst));
console.log(out, `${w}x${h} each, frame ${X},${Y} ${W}x${H}`);
