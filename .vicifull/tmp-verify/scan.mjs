import fs from 'node:fs';
import { PNG } from 'pngjs';
const [, , A, B, mode, fixed, from, to] = process.argv;
const a = PNG.sync.read(fs.readFileSync(A));
const b = PNG.sync.read(fs.readFileSync(B));
const px = (img, x, y) => { const i = ((y*2)*img.width + x*2)*4; return [img.data[i], img.data[i+1], img.data[i+2]]; };
for (let v = Number(from); v <= Number(to); v += 1) {
  const x = mode === 'h' ? v : Number(fixed);
  const y = mode === 'h' ? Number(fixed) : v;
  const p = px(a, x, y), q = px(b, x, y);
  const d = Math.max(...[0,1,2].map(i=>Math.abs(p[i]-q[i])));
  console.log(`${mode==='h'?'x':'y'}=${v}  design ${p.join(',')}  app ${q.join(',')}  Δ${d}`);
}
