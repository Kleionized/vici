// crop.mjs <design.png> <app.png> x y w h out.png [scale]  — side-by-side crop (frame pt, dpr 2), nearest-neighbour upscale
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [d, a, x, y, w, h, out, sc = '3'] = process.argv.slice(2);
const D = PNG.sync.read(fs.readFileSync(d)), A = PNG.sync.read(fs.readFileSync(a));
const dpr = Math.round(D.width / 393) || 1; const S = Number(sc);
const X = Number(x) * dpr, Y = Number(y) * dpr, W = Number(w) * dpr, H = Number(h) * dpr;
const O = new PNG({ width: (W * 2 + 4) * S, height: H * S });
for (let j = 0; j < H * S; j++) for (let i = 0; i < (W * 2 + 4) * S; i++) {
  const ii = Math.floor(i / S), jj = Math.floor(j / S); const o = (j * O.width + i) * 4;
  let src = null, sx = 0;
  if (ii < W) { src = D; sx = X + ii; } else if (ii >= W + 4) { src = A; sx = X + ii - W - 4; }
  if (!src || sx >= src.width || Y + jj >= src.height) { O.data[o] = 255; O.data[o + 1] = 0; O.data[o + 2] = 0; O.data[o + 3] = 255; continue; }
  const s = ((Y + jj) * src.width + sx) * 4; O.data[o] = src.data[s]; O.data[o + 1] = src.data[s + 1]; O.data[o + 2] = src.data[s + 2]; O.data[o + 3] = 255;
}
fs.writeFileSync(out, PNG.sync.write(O)); console.log('crop ->', out, O.width, O.height);
