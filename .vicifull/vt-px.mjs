import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,...pts] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)); const B = PNG.sync.read(fs.readFileSync(b));
for (const p of pts) { const [x,y] = p.split(',').map(Number);
  const i=((y*2)*A.width+(x*2))*4, j=((y*2)*B.width+(x*2))*4;
  console.log(`${x},${y}  design ${A.data[i]},${A.data[i+1]},${A.data[i+2]}   app ${B.data[j]},${B.data[j+1]},${B.data[j+2]}`);
}
