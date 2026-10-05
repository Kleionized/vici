// usage: node crop.mjs out.png x y w h scale a.png b.png ...   (x,y,w,h in frame pt; images at dpr 2)
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, X, Y, W, H, S, ...imgs] = process.argv.slice(2);
const x = +X * 2, y = +Y * 2, w = +W * 2, h = +H * 2, s = +S / 2;
const srcs = imgs.map((p) => PNG.sync.read(fs.readFileSync(p)));
const cw = Math.round(w * s), ch = Math.round(h * s), gap = 6;
const o = new PNG({ width: srcs.length * (cw + gap), height: ch });
o.data.fill(60);
srcs.forEach((src, k) => {
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
    const sx = Math.min(src.width - 1, x + Math.floor(i / s)), sy = Math.min(src.height - 1, y + Math.floor(j / s));
    const si = (src.width * sy + sx) << 2, di = (o.width * j + k * (cw + gap) + i) << 2;
    for (let c = 0; c < 4; c++) o.data[di + c] = src.data[si + c];
  }
});
fs.writeFileSync(out, PNG.sync.write(o));
console.log('ok', o.width, o.height);
