/* Raw per-device-pixel diff, auth recheck (pass 2).
 * EXCLUSIONS, stated in full: css rows y < 54 and y >= 838 (D009 chrome).
 * NOTHING else: no flatness test, no edge suppression, no gradient skip,
 * every x, every channel, no averaging.
 *   node rawpx.mjs a.png b.png [thr=4]
 */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, thrArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const thr = Number(thrArg ?? 4);
const Y0 = 108, Y1 = 1676;
const at = (P, x, y, c) => P.data[(y * P.width + x) * 4 + c];
let over = 0, total = 0, worst = 0, wx = 0, wy = 0;
const hist = new Map();
for (let y = Y0; y < Math.min(H, Y1); y++) for (let x = 0; x < W; x++) {
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(at(A,x,y,c) - at(B,x,y,c)));
  total++;
  if (d > worst) { worst = d; wx = x/2; wy = y/2; }
  if (d >= thr) { over++; const k = `${Math.floor(x/2/20)*20},${Math.floor(y/2/20)*20}`; hist.set(k,(hist.get(k)||0)+1); }
}
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${over}/${total} px >= ${thr}, worst ${worst} at css ${wx},${wy}`);
[...hist].sort((p,q)=>q[1]-p[1]).slice(0,15).forEach(([k,v])=>console.log(`   ${v} px in 20x20 cell css ${k}`));
