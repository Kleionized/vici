/* Print one scanline of a capture in frame points, so an edge can be located
   to the device pixel. usage: node vrow.mjs <png> <y> <x0> <x1> */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [,,p,Y,X0,X1] = process.argv;
const A = PNG.sync.read(fs.readFileSync(p));
const y = Math.round(Number(Y)*2);
const out=[];
for (let x = Math.round(Number(X0)*2); x <= Math.round(Number(X1)*2); x++) {
  const i=(y*A.width+x)*4; out.push(`${x/2}:${A.data[i]},${A.data[i+1]},${A.data[i+2]}`);
}
console.log(out.join('  '));
