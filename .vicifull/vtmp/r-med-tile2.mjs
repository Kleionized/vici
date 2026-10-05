import fs from 'node:fs';
import { PNG } from 'pngjs';
const [d, a, X0, Y0, X1, Y1] = process.argv.slice(2);
const rd = (n) => PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const A = rd(d), B = rd(a);
const [x0, y0, x1, y1] = [+X0 * 2, +Y0 * 2, +X1 * 2, +Y1 * 2];
const lum = (I, px, py) => { const i = (py * I.width + px) * 4; return 0.299 * I.data[i] + 0.587 * I.data[i + 1] + 0.114 * I.data[i + 2]; };
const cmp = (dx, dy) => { let s = 0, n = 0; for (let y = y0; y < y1; y += 1) for (let x = x0 + 100; x < x1 - 100; x += 1) { s += Math.abs(lum(A, x, y) - lum(B, x + dx, y + dy)); n++; } return s / n; };
let best = null;
for (let dy = -96; dy < 96; dy += 2) for (let dx = -96; dx < 96; dx += 2) { const v = cmp(dx, dy); if (!best || v < best.v) best = { dx, dy, v: +v.toFixed(3) }; }
// refine
let ref = best;
for (let dy = best.dy - 3; dy <= best.dy + 3; dy++) for (let dx = best.dx - 3; dx <= best.dx + 3; dx++) { const v = cmp(dx, dy); if (v < ref.v) ref = { dx, dy, v: +v.toFixed(3) }; }
console.log('full-tile best:', JSON.stringify(ref), ' at(0,0):', cmp(0, 0).toFixed(3));
