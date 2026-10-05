import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, cy, cx0, cx1] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const y = Math.round(+cy * 2);
let la = '', lb = '';
for (let x = +cx0 * 2; x <= +cx1 * 2; x++) { const i = (y*A.width+x)*4, j=(y*B.width+x)*4; la += String(A.data[i]).padStart(4); lb += String(B.data[j]).padStart(4); }
console.log(`dev row ${y} (css ${y/2}), dev x ${+cx0*2}..${+cx1*2}`);
console.log('  design' + la);
console.log('  app   ' + lb);
