/* print RGB at canvas points: node .vicifull/rday-probe.mjs img.png "x,y" "x,y" ... */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [f,...pts]=process.argv.slice(2); const A=PNG.sync.read(fs.readFileSync(f));
for(const p of pts){const [x,y]=p.split(',').map(Number); const i=(A.width*Math.round(y*2)+Math.round(x*2))<<2;
 console.log(`${p}: ${A.data[i]},${A.data[i+1]},${A.data[i+2]}`);}
