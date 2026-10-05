/* Sample identical canvas-coordinate points out of two PNGs. 3x3 mean, because
   the frame paints a 0.12 grain over everything and a lone device pixel is
   dithered by it. Both sides are 393x852 CSS at dsf 2 and the app injects the
   54pt inset, so one coordinate addresses both. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [A, B, P] = process.argv.slice(2);
const a = PNG.sync.read(fs.readFileSync(A)), b = PNG.sync.read(fs.readFileSync(B));
const dev = a.width / 393;
const mean = (p, X, Y) => { const s = [0,0,0]; let n = 0;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const x = Math.round(X*dev)+i, y = Math.round(Y*dev)+j; if (x<0||y<0||x>=p.width||y>=p.height) continue;
    const k = (y*p.width+x)*4; s[0]+=p.data[k]; s[1]+=p.data[k+1]; s[2]+=p.data[k+2]; n++; }
  return s.map((v)=>Math.round(v/n)); };
for (const [x, y, label] of JSON.parse(fs.readFileSync(P, 'utf8'))) {
  const A2 = mean(a, x, y), B2 = mean(b, x, y);
  const d = Math.max(...A2.map((v, i) => Math.abs(v - B2[i])));
  console.log(String(label).padEnd(34), `(${x},${y})`.padEnd(12), 'design', A2.join(',').padEnd(13), 'app', B2.join(',').padEnd(13), 'Δ' + d);
}
