// side-by-side montage of PNGs at half size (dpr-2 captures -> 1x), top-aligned
//   node montage.mjs out.png a.png b.png ...
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, ...ins] = process.argv.slice(2);
const imgs = ins.filter((f) => fs.existsSync(f)).map((f) => PNG.sync.read(fs.readFileSync(f)));
const GAP = 12;
const W = imgs.reduce((a, p) => a + p.width / 2, 0) + GAP * (imgs.length - 1);
const H = Math.max(...imgs.map((p) => p.height / 2));
const m = new PNG({ width: W, height: H });
for (let i = 0; i < m.data.length; i += 4) { m.data[i] = 200; m.data[i + 1] = 40; m.data[i + 2] = 40; m.data[i + 3] = 255; }
let ox = 0;
for (const P of imgs) {
  const w = P.width / 2, h = P.height / 2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ks = (P.width * y * 2 + x * 2) << 2, kt = (W * y + ox + x) << 2;
    m.data[kt] = P.data[ks]; m.data[kt + 1] = P.data[ks + 1]; m.data[kt + 2] = P.data[ks + 2]; m.data[kt + 3] = 255;
  }
  ox += w + GAP;
}
fs.writeFileSync(out, PNG.sync.write(m));
