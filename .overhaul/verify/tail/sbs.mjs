// side-by-side montage of several PNGs scaled to a common height: node sbs.mjs out.png h a.png b.png ...
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, H, ...imgs] = process.argv.slice(2);
const h = +H;
const srcs = imgs.map((p) => PNG.sync.read(fs.readFileSync(p)));
const ws = srcs.map((s) => Math.round((s.width * h) / s.height));
const gap = 10;
const o = new PNG({ width: ws.reduce((a, b) => a + b, 0) + gap * (srcs.length - 1), height: h });
o.data.fill(90);
let x0 = 0;
srcs.forEach((s, k) => {
  const sc = s.height / h;
  for (let j = 0; j < h; j++) for (let i = 0; i < ws[k]; i++) {
    const sx = Math.min(s.width - 1, Math.floor(i * sc)), sy = Math.min(s.height - 1, Math.floor(j * sc));
    const si = (s.width * sy + sx) << 2, di = (o.width * j + x0 + i) << 2;
    for (let c = 0; c < 4; c++) o.data[di + c] = s.data[si + c];
  }
  x0 += ws[k] + gap;
});
fs.writeFileSync(out, PNG.sync.write(o));
console.log('ok', o.width, o.height);
