// node montage.mjs out.png scale a.png b.png ... -> side by side, downscaled by integer `scale` (box filter)
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [out, S, ...files] = process.argv.slice(2); const s = Number(S);
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
const W = imgs.reduce((a, i) => a + Math.floor(i.width / s) + 8, 0), H = Math.max(...imgs.map((i) => Math.floor(i.height / s)));
const O = new PNG({ width: W, height: H }); O.data.fill(255);
let ox = 0;
for (const I of imgs) { const w = Math.floor(I.width / s), h = Math.floor(I.height / s);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const acc = [0, 0, 0]; for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) { const k = ((y * s + j) * I.width + (x * s + i)) * 4; acc[0] += I.data[k]; acc[1] += I.data[k + 1]; acc[2] += I.data[k + 2]; }
    const d = (y * W + ox + x) * 4; O.data[d] = acc[0] / s / s; O.data[d + 1] = acc[1] / s / s; O.data[d + 2] = acc[2] / s / s; O.data[d + 3] = 255; }
  ox += w + 8; }
fs.writeFileSync(out, PNG.sync.write(O)); console.log(out, W, H);
