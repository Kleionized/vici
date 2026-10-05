/* Row histogram of pixels over a threshold. Excludes only the top 54 CSS rows. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a, b, t] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const thr = Number(t ?? 2); const rows = new Map();
for (let y = 108; y < Math.min(A.height, B.height); y++) for (let x = 0; x < Math.min(A.width, B.width); x++) {
  let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(A.data[(y*A.width+x)*4+c] - B.data[(y*B.width+x)*4+c]));
  if (d > thr) rows.set(Math.floor(y/2/10)*10, (rows.get(Math.floor(y/2/10)*10) ?? 0) + 1);
}
[...rows.entries()].sort((p,q)=>q[1]-p[1]).slice(0,12).forEach(([y,n]) => console.log(`  css y ${y}-${y+9}: ${n}`));
