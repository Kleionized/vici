#!/usr/bin/env node
/** Pixel diff two PNGs of the same size. Reports worst regions on a grid. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [, , A, B, outPath] = process.argv;
const a = PNG.sync.read(fs.readFileSync(A));
const b = PNG.sync.read(fs.readFileSync(B));
if (a.width !== b.width || a.height !== b.height) { console.log('size mismatch', a.width, a.height, b.width, b.height); process.exit(1); }
const W = a.width, H = a.height;
const out = new PNG({ width: W, height: H });
let n = 0, sum = 0, max = 0;
// 2x device pixel ratio; report in CSS px cells of 20
const CELL = 40;
const cells = new Map();
for (let y = 108; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 4;
  const d = Math.max(Math.abs(a.data[i]-b.data[i]), Math.abs(a.data[i+1]-b.data[i+1]), Math.abs(a.data[i+2]-b.data[i+2]));
  if (d > max) max = d;
  if (d > 6) { n++; sum += d;
    const k = `${Math.floor(x/CELL)},${Math.floor(y/CELL)}`;
    const c = cells.get(k) || { n: 0, max: 0 };
    c.n++; if (d > c.max) c.max = d; cells.set(k, c);
  }
  out.data[i] = d > 6 ? 255 : 255 - d*4; out.data[i+1] = d > 6 ? 0 : 255 - d*4; out.data[i+2] = d > 6 ? 0 : 255 - d*4; out.data[i+3] = 255;
}
if (outPath) fs.writeFileSync(outPath, PNG.sync.write(out));
const top = [...cells.entries()].sort((p,q)=>q[1].n*q[1].max - p[1].n*p[1].max).slice(0, 14);
console.log(`px>6: ${n} (${(100*n/(W*H)).toFixed(3)}%)  max Δ ${max}  mean over threshold ${(sum/(n||1)).toFixed(1)}`);
for (const [k, c] of top) { const [cx, cy] = k.split(',').map(Number); console.log(`  css box x ${cx*CELL/2}-${(cx+1)*CELL/2} y ${cy*CELL/2}-${(cy+1)*CELL/2}: ${c.n}px worst Δ${c.max}`); }
