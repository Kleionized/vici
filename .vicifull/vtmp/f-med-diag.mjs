/* Signed (app − design) luminance along the coin's 135deg gloss axis, sampled in
   bands of the normalised distance t from the top-left of the 150pt disc. Only
   pixels inside the disc and away from the device art are counted. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [d, a] = process.argv.slice(2);
const rd = (n) => PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const D = rd(d), A = rd(a); const s = D.width / 393;
const lum = (p, x, y) => { const i = (p.width * y + x) << 2; return (p.data[i] + p.data[i+1] + p.data[i+2]) / 3; };
const L = 121.5, T = 128, S = 150, cx = L + 75, cy = T + 75;
const bins = Array.from({ length: 10 }, () => ({ s: 0, n: 0 }));
for (let y = T * s; y < (T + S) * s; y++) for (let x = L * s; x < (L + S) * s; x++) {
  const fx = x / s, fy = y / s;
  if ((fx - cx) ** 2 + (fy - cy) ** 2 > 70 ** 2) continue;           // inside the disc, off the rim
  if (fy > T + 0.55 * S) continue;                                    // above the dunes
  if (Math.abs(fx - cx) < 22 && fy > T + 0.15 * S) continue;          // clear of the device
  const t = ((fx - L) + (fy - T)) / (2 * S);                          // 135deg axis, 0..1
  const b = Math.min(9, Math.floor(t * 10));
  bins[b].s += lum(A, x, y) - lum(D, x, y); bins[b].n++;
}
console.log(d.replace('f-med-d-', '') + '  signed app-design by t: ' + bins.map((b, i) => `${(i/10).toFixed(1)}:${b.n ? (b.s / b.n).toFixed(2) : '-'}`).join('  '));
