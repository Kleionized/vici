import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, ...pts] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const at = (P, x, y) => { const i = ((y * 2) * P.width + x * 2) * 4; return [P.data[i], P.data[i+1], P.data[i+2]].join(','); };
for (const p of pts) { const [x, y] = p.split(',').map(Number); console.log(`${x},${y}  design ${at(A,x,y)}   app ${at(B,x,y)}`); }
