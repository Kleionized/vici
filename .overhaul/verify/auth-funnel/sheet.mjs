// tile PNGs into a contact sheet: node sheet.mjs out.png cols scale a.png b.png ...
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, colsS, scaleS, ...files] = process.argv.slice(2);
const cols = Number(colsS), sc = Number(scaleS);
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
const w = Math.max(...imgs.map((i) => i.width)), h = Math.max(...imgs.map((i) => i.height));
const tw = Math.round(w * sc), th = Math.round(h * sc), gap = 6;
const rows = Math.ceil(imgs.length / cols);
const O = new PNG({ width: cols * (tw + gap), height: rows * (th + gap) });
O.data.fill(255);
imgs.forEach((im, k) => {
  const ox = (k % cols) * (tw + gap), oy = Math.floor(k / cols) * (th + gap);
  for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
    const sx = Math.min(im.width - 1, Math.floor(x / sc)), sy = Math.min(im.height - 1, Math.floor(y / sc));
    if (sx >= im.width || sy >= im.height) continue;
    const si = (sy * im.width + sx) * 4, di = ((oy + y) * O.width + ox + x) * 4;
    O.data[di] = im.data[si]; O.data[di + 1] = im.data[si + 1]; O.data[di + 2] = im.data[si + 2]; O.data[di + 3] = 255;
  }
});
fs.writeFileSync(out, PNG.sync.write(O));
console.log(out, O.width, O.height);
