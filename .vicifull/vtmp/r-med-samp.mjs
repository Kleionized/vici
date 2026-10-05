import fs from 'node:fs'; import { PNG } from 'pngjs';
const [d,a,...pts]=process.argv.slice(2);
const rd=(n)=>PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const A=rd(d),B=rd(a);
for(const p of pts){const [x,y]=p.split(',').map(Number);const i=(A.width*(y*2)+x*2)<<2;
 console.log(`(${x},${y}) design ${A.data[i]},${A.data[i+1]},${A.data[i+2]}   app ${B.data[i]},${B.data[i+1]},${B.data[i+2]}`);}
