/* Per-device-row ink count in a column band, both sides, and where they differ.
   Excludes nothing inside the band — the whole band is measured. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, x0s, x1s, y0s, y1s] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const x0 = +x0s, x1 = +x1s, y0 = +y0s, y1 = +y1s;   // device px
const ink = (P, y) => { let n = 0; for (let x = x0; x < x1; x++) { const i = (y * P.width + x) * 4; if (P.data[i] < 170) n++; } return n; };
let worst = [];
for (let y = y0; y < y1; y++) { const u = ink(A, y), v = ink(B, y); if (Math.abs(u - v) > 4) worst.push([y, u, v]); }
console.log(`${worst.length} device rows in ${y0}..${y1} whose ink count differs by >4`);
for (const [y, u, v] of worst.slice(0, 40)) console.log(`   y ${y} (css ${(y/2).toFixed(1)}): design ${u}  app ${v}`);
