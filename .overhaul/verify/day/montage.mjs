// node montage.mjs out.png a.png b.png ... [--scale=2]  (downsample by scale, side by side, 6px gap)
import fs from 'node:fs';
import { PNG } from 'pngjs';
const args = process.argv.slice(2);
const sc = Number((args.find((a) => a.startsWith('--scale=')) ?? '--scale=2').slice(8));
const files = args.filter((a) => !a.startsWith('--'));
const out = files.shift();
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
const G = 6;
const W = imgs.reduce((s, i) => s + Math.floor(i.width / sc) + G, -G), H = Math.max(...imgs.map((i) => Math.floor(i.height / sc)));
const o = new PNG({ width: W, height: H }); o.data.fill(255);
let ox = 0;
for (const im of imgs) {
  const w = Math.floor(im.width / sc), h = Math.floor(im.height / sc);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ks = (im.width * Math.floor(y * sc) + Math.floor(x * sc)) << 2, kt = (W * y + ox + x) << 2;
    o.data[kt] = im.data[ks]; o.data[kt + 1] = im.data[ks + 1]; o.data[kt + 2] = im.data[ks + 2]; o.data[kt + 3] = 255;
  }
  ox += w + G;
}
fs.writeFileSync(out, PNG.sync.write(o));
console.log(out, W, H);
