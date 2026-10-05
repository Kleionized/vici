import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a, b, x0, y0, w, h] = process.argv.slice(2);
const st = (p) => { const I = PNG.sync.read(fs.readFileSync(p)); let s = 0, s2 = 0, n = 0, mn = 999, mx = 0; for (let y = y0 * 2; y < (+y0 + +h) * 2; y++) for (let x = x0 * 2; x < (+x0 + +w) * 2; x++) { const k = (I.width * y + x) << 2; const v = I.data[k]; s += v; s2 += v * v; n++; mn = Math.min(mn, v); mx = Math.max(mx, v); } const m = s / n; return { mean: m.toFixed(2), sd: Math.sqrt(s2 / n - m * m).toFixed(2), mn, mx }; };
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
let d = 0, n = 0; for (let y = y0 * 2; y < (+y0 + +h) * 2; y++) for (let x = x0 * 2; x < (+x0 + +w) * 2; x++) { const k = (A.width * y + x) << 2; d += Math.abs(A.data[k] - B.data[k]); n++; }
console.log('design', st(a), 'app', st(b), 'meanAbsDiff', (d / n).toFixed(2));
