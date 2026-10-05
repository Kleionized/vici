import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a, b] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const x0 = 0, y0 = 1240, w = 780, h = 200; // device px, ground band (canvas 620-720)
let best = [];
for (let dy = -100; dy <= 100; dy += 2) for (let dx = -100; dx <= 100; dx += 2) {
  let d = 0, n = 0;
  for (let y = y0; y < y0 + h; y += 2) for (let x = 100; x < 680; x += 2) { const k = (A.width * y + x) << 2, kb = (B.width * (y + dy) + (x + dx)) << 2; d += Math.abs(A.data[k] - B.data[kb]); n++; }
  best.push([d / n, dx, dy]);
}
best.sort((p, q) => p[0] - q[0]); console.log(best.slice(0, 4).map((p) => p.map((v) => +v.toFixed(3))));
