/* design | app | |Δ|×6 heat, for one frame-point rect. Nothing masked. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [d, a, out, X0, Y0, X1, Y1, MAG = '1'] = process.argv.slice(2);
const rd = (n) => PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const D = rd(d), A = rd(a); const s = D.width / 393, m = Number(MAG);
const w = Math.round((X1 - X0) * s), h = Math.round((Y1 - Y0) * s);
const o = new PNG({ width: (w * 3 + 16) * m, height: h * m });
o.data.fill(255);
const get = (p, x, y) => { const i = (p.width * y + x) << 2; return [p.data[i], p.data[i+1], p.data[i+2]]; };
const set = (x, y, c) => { for (let my = 0; my < m; my++) for (let mx = 0; mx < m; mx++) { const j = (o.width * (y * m + my) + x * m + mx) << 2; o.data[j] = c[0]; o.data[j+1] = c[1]; o.data[j+2] = c[2]; o.data[j+3] = 255; } };
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  const sx = Math.round(X0 * s) + x, sy = Math.round(Y0 * s) + y;
  const P = get(D, sx, sy), Q = get(A, sx, sy);
  set(x, y, P); set(w + 8 + x, y, Q);
  const v = Math.min(255, Math.max(Math.abs(P[0]-Q[0]), Math.abs(P[1]-Q[1]), Math.abs(P[2]-Q[2])) * 6);
  set(w * 2 + 16 + x, y, [255 - v, 255 - v, 255]);
}
fs.writeFileSync(out, PNG.sync.write(o));
console.log('heat ->', out);
