/* Point sampler in CSS/frame coordinates. node r-logs-px.mjs a.png b.png "x,y x,y" */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, pts] = process.argv.slice(2);
const list = pts.split(' ').map((p) => p.split(',').map(Number));
for (const f of [a, b]) {
  const P = PNG.sync.read(fs.readFileSync(f));
  const s = P.width / 393;
  const o = list.map(([x, y]) => { const i = (Math.round(y * s) * P.width + Math.round(x * s)) * 4; return `${x},${y}=${P.data[i]},${P.data[i + 1]},${P.data[i + 2]}`; }).join('  ');
  console.log(f.split('/').pop().padEnd(38), o);
}
