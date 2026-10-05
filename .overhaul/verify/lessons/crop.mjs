// crop.mjs design.png app.png x y w h scale out.png — design | app | diff(t) side by side, frame points, magnified
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [d, a, X, Y, Wd, Ht, S, out, T = '8'] = process.argv.slice(2);
const D = PNG.sync.read(fs.readFileSync(d)), A = PNG.sync.read(fs.readFileSync(a));
const x0 = +X * 2, y0 = +Y * 2, w = +Wd * 2, h = +Ht * 2, s = +S, t = +T;
const o = new PNG({ width: (w * 3 + 8) * s, height: h * s }); o.data.fill(255);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  const k = (D.width * (y0 + y) + x0 + x) << 2;
  const m = Math.max(...[0, 1, 2].map((c) => Math.abs(D.data[k + c] - A.data[k + c])));
  const px = [[D.data.slice(k, k + 3), 0], [A.data.slice(k, k + 3), w + 4], [m > t ? [230, 20, 20] : [D.data[k] / 3 + 150, D.data[k] / 3 + 150, D.data[k] / 3 + 150], 2 * w + 8]];
  for (const [rgb, ox] of px) for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) { const q = (o.width * (y * s + dy) + (ox + x) * s + dx) << 2; o.data[q] = rgb[0]; o.data[q + 1] = rgb[1]; o.data[q + 2] = rgb[2]; o.data[q + 3] = 255; }
}
fs.writeFileSync(out, PNG.sync.write(o)); console.log(out, o.width + 'x' + o.height);
