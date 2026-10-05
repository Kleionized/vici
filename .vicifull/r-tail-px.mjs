#!/usr/bin/env node
/**
 * Independent pass-2 pixel instrument for GROUP tail.
 *
 * EXCLUDES NOTHING (F35). Reads the two PNGs whole, over the body band
 * y 54…830 in FRAME points (device rows 108…1660 at deviceScaleFactor 2),
 * and reports:
 *   - mean |Δ| and max |Δ| per channel over every device pixel in the band
 *   - the count of device pixels over a per-channel threshold
 *   - an 8x8-device-pixel BLOCK-MEAN map (kills antialiasing, keeps gradients)
 *     with the worst blocks listed in frame coordinates
 *   - optional point samples: `--at=x,y` in frame points, printing both sides
 *
 *   node .vicifull/r-tail-px.mjs <sigA-png> <sigB-png> [--y0=54] [--y1=830]
 *        [--thr=6] [--at=x,y] [--at=x,y] [--top=12] [--band=x0,y0,x1,y1]
 */
import fs from 'node:fs';
import { PNG } from 'pngjs';

const argv = process.argv.slice(2);
const pos = argv.filter((a) => !a.startsWith('--'));
const flags = {};
const ats = [];
for (const a of argv.filter((x) => x.startsWith('--'))) {
  const i = a.indexOf('=');
  const k = a.slice(2, i < 0 ? undefined : i);
  const v = i < 0 ? true : a.slice(i + 1);
  if (k === 'at') ats.push(v.split(',').map(Number));
  else flags[k] = v;
}
const A = PNG.sync.read(fs.readFileSync(pos[0]));
const B = PNG.sync.read(fs.readFileSync(pos[1]));
const S = 2; // deviceScaleFactor
const y0 = Math.round(Number(flags.y0 ?? 54) * S);
const y1 = Math.round(Number(flags.y1 ?? 830) * S);
let x0 = 0, x1 = A.width;
if (flags.band) { const b = String(flags.band).split(',').map(Number); x0 = b[0]*S; x1 = b[2]*S; }
const thr = Number(flags.thr ?? 6);
const px = (im, x, y) => { const o = (im.width * y + x) << 2; return [im.data[o], im.data[o+1], im.data[o+2]]; };

let n = 0, sum = 0, max = 0, over = 0, maxAt = null;
for (let y = y0; y < Math.min(y1, A.height, B.height); y++) {
  for (let x = x0; x < Math.min(x1, A.width, B.width); x++) {
    const a = px(A, x, y), b = px(B, x, y);
    const d = Math.max(Math.abs(a[0]-b[0]), Math.abs(a[1]-b[1]), Math.abs(a[2]-b[2]));
    n++; sum += d; if (d > max) { max = d; maxAt = [x/S, y/S]; } if (d > thr) over++;
  }
}
console.log(`whole band y${flags.y0 ?? 54}…${flags.y1 ?? 830}  px=${n}  mean|Δ|=${(sum/n).toFixed(3)}  max=${max} at frame ${maxAt ? maxAt.map(v=>v.toFixed(1)).join(',') : '-'}  over ${thr}/255: ${over} (${(100*over/n).toFixed(3)}%)`);

// 8x8 device-pixel block means — antialiasing dies, gradients survive
const BS = 8;
const blocks = [];
for (let by = y0; by + BS <= Math.min(y1, A.height, B.height); by += BS) {
  for (let bx = x0; bx + BS <= Math.min(x1, A.width, B.width); bx += BS) {
    let sa = [0,0,0], sb = [0,0,0];
    for (let y = by; y < by+BS; y++) for (let x = bx; x < bx+BS; x++) {
      const a = px(A,x,y), b = px(B,x,y);
      sa[0]+=a[0]; sa[1]+=a[1]; sa[2]+=a[2]; sb[0]+=b[0]; sb[1]+=b[1]; sb[2]+=b[2];
    }
    const c = BS*BS;
    const d = Math.max(Math.abs(sa[0]-sb[0]), Math.abs(sa[1]-sb[1]), Math.abs(sa[2]-sb[2]))/c;
    const sgn = (sb[0]+sb[1]+sb[2] - sa[0]-sa[1]-sa[2])/(3*c);
    blocks.push({ x: bx/S, y: by/S, d, sgn,
      a: sa.map(v=>+(v/c).toFixed(1)), b: sb.map(v=>+(v/c).toFixed(1)) });
  }
}
blocks.sort((p,q) => q.d - p.d);
const top = Number(flags.top ?? 12);
const bad = blocks.filter((b) => b.d > 2);
console.log(`blocks 8x8: ${blocks.length}  over 2.0: ${bad.length}  over 4.0: ${blocks.filter(b=>b.d>4).length}  over 8.0: ${blocks.filter(b=>b.d>8).length}`);
for (const b of blocks.slice(0, top)) {
  console.log(`  Δ${b.d.toFixed(2)} ${b.sgn>0?'app LIGHTER':'app DARKER'} at frame ${b.x},${b.y}  design ${b.a.join(',')}  app ${b.b.join(',')}`);
}
for (const [x, y] of ats) {
  const a = px(A, Math.round(x*S), Math.round(y*S)), b = px(B, Math.round(x*S), Math.round(y*S));
  console.log(`  point ${x},${y}: design ${a.join(',')}  app ${b.join(',')}  Δ${Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]),Math.abs(a[2]-b[2]))}`);
}
