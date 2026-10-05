/* Read the R channel at a list of css points on both PNGs, averaged over a
   3x3 device-pixel patch so the 0.12 grain does not dominate. Reports
   design − app at each point. Excludes nothing: it samples exactly where it is
   told, gradient bands included (F35). */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, ...pts] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const px = (P, x, y, c) => { let s = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += P.data[(((y + dy) * P.width) + x + dx) * 4 + c]; return s / 9; };
console.log('  css x,y     design R,G,B        app R,G,B         d-a');
for (const p of pts) {
  const [x, y] = p.split(',').map(Number);
  const dx = x * 2, dy = y * 2;
  const d = [0, 1, 2].map((c) => px(A, dx, dy, c));
  const n = [0, 1, 2].map((c) => px(B, dx, dy, c));
  console.log(`  ${String(x).padStart(3)},${String(y).padStart(3)}   ` +
    d.map((v) => v.toFixed(1).padStart(6)).join(' ') + '   ' +
    n.map((v) => v.toFixed(1).padStart(6)).join(' ') + '   ' +
    d.map((v, i) => (v - n[i]).toFixed(2).padStart(6)).join(' '));
}
