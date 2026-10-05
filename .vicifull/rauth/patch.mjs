/* Patch mean sampler: mean RGB of an NxN css-px patch centred on a css point,
   read from a 2x capture. Averaging only inside the patch; nothing excluded.
   node patch.mjs a.png b.png N x,y x,y ... */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [fa, fb, nArg, ...pts] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(fa)), B = PNG.sync.read(fs.readFileSync(fb));
const N = Number(nArg);
const mean = (P, cx, cy) => {
  const m = [0,0,0]; let n = 0;
  for (let y = (cy - N/2)*2; y < (cy + N/2)*2; y++) for (let x = (cx - N/2)*2; x < (cx + N/2)*2; x++) {
    const i = ((y|0) * P.width + (x|0)) * 4; m[0]+=P.data[i]; m[1]+=P.data[i+1]; m[2]+=P.data[i+2]; n++;
  }
  return m.map(v => v/n);
};
for (const s of pts) {
  const [x, y] = s.split(',').map(Number);
  const a = mean(A, x, y), b = mean(B, x, y);
  console.log(`css ${s.padEnd(9)} design ${a.map(v=>v.toFixed(2)).join(',').padEnd(20)} app ${b.map(v=>v.toFixed(2)).join(',').padEnd(20)} Δ ${a.map((v,i)=>(b[i]-v).toFixed(2)).join(',')}`);
}
