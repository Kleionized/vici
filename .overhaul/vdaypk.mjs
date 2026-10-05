import fs from 'node:fs'; import { PNG } from 'pngjs';
const [f, ...pts] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(f));
for (const p of pts) { const [x,y] = p.split(',').map(Number); const i = (A.width*(y*2)+(x*2))<<2; console.log(p, A.data[i], A.data[i+1], A.data[i+2]); }
