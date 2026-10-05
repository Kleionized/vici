// montage.mjs out.png scale a.png b.png ... — side by side, downscaled by box average
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [out, sc, ...files] = process.argv.slice(2); const k = Number(sc);
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
const ws = imgs.map((i) => Math.floor(i.width / k)), hs = imgs.map((i) => Math.floor(i.height / k));
const W = ws.reduce((a, b) => a + b + 8, 0), H = Math.max(...hs);
const O = new PNG({ width: W, height: H }); O.data.fill(255);
let x0 = 0;
imgs.forEach((im, n) => {
  for (let y = 0; y < hs[n]; y++) for (let x = 0; x < ws[n]; x++) {
    let r = 0, g = 0, b = 0, c = 0;
    for (let dy = 0; dy < k; dy++) for (let dx = 0; dx < k; dx++) { const s = ((y * k + dy) * im.width + x * k + dx) * 4; r += im.data[s]; g += im.data[s + 1]; b += im.data[s + 2]; c++; }
    const o = (y * W + x0 + x) * 4; O.data[o] = r / c; O.data[o + 1] = g / c; O.data[o + 2] = b / c; O.data[o + 3] = 255;
  }
  x0 += ws[n] + 8;
});
fs.writeFileSync(out, PNG.sync.write(O)); console.log(out, W, H);
