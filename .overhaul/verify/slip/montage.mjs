// node montage.mjs out.png a.png b.png ... — side by side at 1x (2x box downsample), 6px gap
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, ...ins] = process.argv.slice(2);
const imgs = ins.map((p) => PNG.sync.read(fs.readFileSync(p)));
const sc = (im) => ({ w: Math.floor(im.width / 2), h: Math.floor(im.height / 2) });
const W = imgs.reduce((s, im) => s + sc(im).w + 6, -6), H = Math.max(...imgs.map((im) => sc(im).h));
const o = new PNG({ width: W, height: H });
o.data.fill(255);
let x0 = 0;
for (const im of imgs) {
  const { w, h } = sc(im);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    for (let c = 0; c < 4; c++) {
      let s = 0;
      for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) s += im.data[((2 * y + dy) * im.width + 2 * x + dx) * 4 + c];
      o.data[(y * W + x0 + x) * 4 + c] = s >> 2;
    }
  }
  x0 += w + 6;
}
fs.writeFileSync(out, PNG.sync.write(o));
console.log(out, W, H);
