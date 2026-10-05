// node mont.mjs out.png a.png b.png ...  — side by side, downscaled 2x, 8px gutter (red)
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, ...ins] = process.argv.slice(2);
const imgs = ins.map((p) => PNG.sync.read(fs.readFileSync(p)));
const sc = 2, gut = 8;
const W = imgs.reduce((s, i) => s + Math.floor(i.width / sc), 0) + gut * (imgs.length - 1);
const H = Math.max(...imgs.map((i) => Math.floor(i.height / sc)));
const o = new PNG({ width: W, height: H });
for (let k = 0; k < o.data.length; k += 4) { o.data[k] = 200; o.data[k + 1] = 30; o.data[k + 2] = 30; o.data[k + 3] = 255; }
let ox = 0;
for (const im of imgs) {
  const w = Math.floor(im.width / sc), h = Math.floor(im.height / sc);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let r = 0, g = 0, b = 0;
    for (let dy = 0; dy < sc; dy++) for (let dx = 0; dx < sc; dx++) { const i = ((y * sc + dy) * im.width + (x * sc + dx)) * 4; r += im.data[i]; g += im.data[i + 1]; b += im.data[i + 2]; }
    const j = (y * W + ox + x) * 4; o.data[j] = r / 4; o.data[j + 1] = g / 4; o.data[j + 2] = b / 4; o.data[j + 3] = 255;
  }
  ox += w + gut;
}
fs.writeFileSync(out, PNG.sync.write(o));
console.log(out, W, H);
