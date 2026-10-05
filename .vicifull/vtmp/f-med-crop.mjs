/* Crop the same frame-point rect out of two shots and stack them side by side,
   optionally magnified, so the texture can actually be looked at. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [d, a, out, X0, Y0, X1, Y1, MAG = '1'] = process.argv.slice(2);
const rd = (n) => PNG.sync.read(fs.readFileSync(n.includes('/') ? n : `.vicifull/shots/${n}.png`));
const D = rd(d), A = rd(a); const s = D.width / 393, m = Number(MAG);
const w = Math.round((X1 - X0) * s), h = Math.round((Y1 - Y0) * s);
const o = new PNG({ width: (w * 2 + 8) * m, height: h * m });
const put = (src, ox, oy, sx, sy) => { const i = (src.width * sy + sx) << 2, j = (o.width * oy + ox) << 2; o.data[j] = src.data[i]; o.data[j+1] = src.data[i+1]; o.data[j+2] = src.data[i+2]; o.data[j+3] = 255; };
for (let y = 0; y < h * m; y++) for (let x = 0; x < (w * 2 + 8) * m; x++) { const j = (o.width * y + x) << 2; o.data[j] = 255; o.data[j+1] = 0; o.data[j+2] = 0; o.data[j+3] = 255; }
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let my = 0; my < m; my++) for (let mx = 0; mx < m; mx++) {
  put(D, x * m + mx, y * m + my, Math.round(X0 * s) + x, Math.round(Y0 * s) + y);
  put(A, (w + 8 + x) * m + mx, y * m + my, Math.round(X0 * s) + x, Math.round(Y0 * s) + y);
}
fs.writeFileSync(out, PNG.sync.write(o));
console.log('crop ->', out, `${(w*2+8)*m}x${h*m}  design left, app right`);
