import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, aPath, bPath, ...rest] = process.argv;
const A = PNG.sync.read(fs.readFileSync(aPath));
const B = PNG.sync.read(fs.readFileSync(bPath));
if (A.width !== B.width || A.height !== B.height) { console.log('SIZE', A.width, A.height, 'vs', B.width, B.height); }
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 2; // deviceScaleFactor
let sum = 0, n = 0, max = 0, maxAt = null;
// 16x16 css-pt tiles
const TW = 16 * S;
const tiles = new Map();
const Y0 = 54*S, Y1 = 834*S;
for (let y = Y0; y < Math.min(H, Y1); y++) {
  for (let x = 0; x < W; x++) {
    if (x < 64*S && y > 788*S) continue; // Expo dev-tools floating badge in the app capture
    const ia = (A.width * y + x) << 2, ib = (B.width * y + x) << 2;
    const d = Math.max(Math.abs(A.data[ia]-B.data[ib]), Math.abs(A.data[ia+1]-B.data[ib+1]), Math.abs(A.data[ia+2]-B.data[ib+2]));
    sum += d; n++;
    if (d > max) { max = d; maxAt = [x/S, y/S]; }
    if (d > 12) {
      const k = `${Math.floor(x/TW)},${Math.floor(y/TW)}`;
      const t = tiles.get(k) ?? { c: 0, s: 0, mx: 0 };
      t.c++; t.s += d; if (d > t.mx) t.mx = d;
      tiles.set(k, t);
    }
  }
}
const top = [...tiles.entries()].sort((p,q)=>q[1].s-p[1].s).slice(0, Number(rest[0] ?? 12));
console.log(`mean|Δ| ${(sum/n).toFixed(3)}  max ${max} at ${maxAt && maxAt.map(v=>v.toFixed(0)).join(',')}  tiles>12: ${tiles.size}`);
for (const [k, t] of top) {
  const [tx, ty] = k.split(',').map(Number);
  console.log(`  box ${tx*16},${ty*16}-${tx*16+16},${ty*16+16}  px ${t.c}  max ${t.mx}  meanΔ ${(t.s/t.c).toFixed(1)}`);
}
