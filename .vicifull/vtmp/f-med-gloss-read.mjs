import fs from 'node:fs';
import { PNG } from 'pngjs';
const png = PNG.sync.read(fs.readFileSync(process.argv[2]));
const at = (x, y) => { const i = (png.width * y + x) << 2; return [png.data[i], png.data[i+1], png.data[i+2]]; };
console.log('t     CSS            SVG-now        SVG-split       dNow  dSplit');
for (const t of [0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]) {
  const x = Math.min(Math.round(t * 149), 149), y = x;
  const a = at(x, y), c = at(200 + x, y), d = at(400 + x, y);
  console.log(`${t.toFixed(1)}   ${String(a).padEnd(15)}${String(c).padEnd(15)}${String(d).padEnd(16)}${(a[0]-c[0]).toString().padStart(4)}  ${(a[0]-d[0]).toString().padStart(4)}`);
}
