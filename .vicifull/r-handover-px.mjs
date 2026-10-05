/* Raw pixel readout at css points, both images side by side. Excludes nothing. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, ...pts] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const px = (P, x, y) => { const i = ((y * 2) * P.width + x * 2) * 4; return [P.data[i], P.data[i+1], P.data[i+2]]; };
for (const p of pts) { const [x, y] = p.split(',').map(Number); const u = px(A, x, y), v = px(B, x, y);
  console.log(`  ${x},${y}   design ${u.join(',')}   app ${v.join(',')}   Δ${Math.max(...u.map((c,i)=>Math.abs(c-v[i])))}`); }
