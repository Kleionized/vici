/* Grain statistics inside a stated rect. Excludes NOTHING inside that rect —
   it high-passes each row (subtract a 9-device-px moving average) so a smooth
   wash or gradient underneath cancels and only the texture is left.
   Reports, per image: rms of the high-passed signal, mean sign changes per row
   (a tile magnified ~9x has far fewer), and the row autocorrelation at lag 192
   device px = the 96 CSS px the file's own tile size would repeat at.
   usage: node r-handover-grain.mjs img... -- x y w h   (css) */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const args = process.argv.slice(2);
const i = args.indexOf('--');
const files = args.slice(0, i);
const [x0, y0, w, h] = args.slice(i + 1).map((n) => +n * 2);
for (const f of files) {
  const P = PNG.sync.read(fs.readFileSync(f));
  let rms = 0, flips = 0, ac = 0, acn = 0, n = 0, rows = 0;
  for (let y = y0; y < y0 + h; y++) {
    const v = [];
    for (let x = x0; x < x0 + w; x++) { const j = (y * P.width + x) * 4; v.push((P.data[j] + P.data[j+1] + P.data[j+2]) / 3); }
    const hp = v.map((_, k) => { let s = 0, c = 0; for (let d = -4; d <= 4; d++) { const t = k + d; if (t >= 0 && t < v.length) { s += v[t]; c++; } } return v[k] - s / c; });
    let prev = 0, fl = 0;
    for (const u of hp) { rms += u * u; n++; if (u !== 0) { if (prev !== 0 && Math.sign(u) !== prev) fl++; prev = Math.sign(u); } }
    flips += fl; rows++;
    for (let k = 0; k + 192 < hp.length; k++) { ac += hp[k] * hp[k + 192]; acn++; }
  }
  const r = Math.sqrt(rms / n);
  console.log(`${f.split('/').pop().padEnd(16)} rms ${r.toFixed(3)}   flips/row ${(flips / rows).toFixed(1)}   autocorr@96css ${(ac / acn / (r * r)).toFixed(3)}`);
}
