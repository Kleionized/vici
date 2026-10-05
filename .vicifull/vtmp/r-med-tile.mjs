#!/usr/bin/env node
/* Tile period and phase. Over a background band (frame points), for each side:
   self |Δ| against itself shifted dx device px (period shows as a minimum), and
   the cross |Δ| design-vs-app over a full tile of shifts. Nothing is masked. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [d, a, X0, Y0, X1, Y1] = process.argv.slice(2);
const rd = (n) => PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const A = rd(d), B = rd(a);
const [x0, y0, x1, y1] = [+X0 * 2, +Y0 * 2, +X1 * 2, +Y1 * 2];
const lum = (I, px, py) => { const i = (py * I.width + px) * 4; return 0.299 * I.data[i] + 0.587 * I.data[i + 1] + 0.114 * I.data[i + 2]; };
const stat = (I) => { let s = 0, n = 0; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { s += lum(I, x, y); n++; }
  const m = s / n; let v = 0; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const t = lum(I, x, y) - m; v += t * t; }
  return { mean: +m.toFixed(3), sd: +Math.sqrt(v / n).toFixed(3) }; };
const cmp = (P, Q, dx, dy) => { let s = 0, n = 0; for (let y = y0 + 4; y < y1 - 4; y++) for (let x = x0 + 200; x < x1 - 200; x++) { s += Math.abs(lum(P, x, y) - lum(Q, x + dx, y + dy)); n++; } return s / n; };
console.log('design', JSON.stringify(stat(A)), ' app', JSON.stringify(stat(B)));
const self = (I, name) => { const out = []; for (const dx of [0, 96, 192, 288, 384]) out.push(`${dx}:${cmp(I, I, dx, 0).toFixed(3)}`); console.log(name + ' self-|Δ| at dx(device)=', out.join('  ')); };
self(A, 'design'); self(B, 'app   ');
let best = null; const grid = [];
for (let dy = -8; dy <= 8; dy += 2) for (let dx = -192; dx <= 192; dx += 2) { const v = cmp(A, B, dx, dy); if (!best || v < best.v) best = { dx, dy, v: +v.toFixed(3) }; }
console.log('cross best over ±192 device px:', JSON.stringify(best), ' at (0,0):', cmp(A, B, 0, 0).toFixed(3));
