import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, a, b, ...pts] = process.argv;
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const S = 2;
const px = (I, x, y) => { const i = (I.width*Math.round(y*S)+Math.round(x*S))<<2; return [I.data[i],I.data[i+1],I.data[i+2]]; };
for (const p of pts) {
  const [x,y] = p.split(',').map(Number);
  const pa = px(A,x,y), pb = px(B,x,y);
  console.log(`${p.padEnd(10)} design ${pa.join(',').padEnd(14)} app ${pb.join(',').padEnd(14)} Δ ${Math.max(...pa.map((v,i)=>Math.abs(v-pb[i])))}`);
}
