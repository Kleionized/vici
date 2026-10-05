import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f, xs, ys, ws, hs, mode, thrS] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(f));
const [x0, y0, w, h] = [+xs * 2, +ys * 2, +ws * 2, +hs * 2];
const thr = Number(thrS ?? 140);
const rows = [];
for (let y = 0; y < h; y++) { let s = 0; for (let x = 0; x < w; x++) { const i = ((y0 + y) * P.width + (x0 + x)) * 4; const L = 0.299*P.data[i]+0.587*P.data[i+1]+0.114*P.data[i+2]; s += mode === 'light' ? Math.max(0, L - thr) : Math.max(0, thr - L); } rows.push(Math.round(s)); }
console.log(f.split('/').pop() + '  device row ' + (y0) + '..' + (y0+h-1));
rows.forEach((v, i) => console.log(`  dev ${y0 + i} (css ${((y0+i)/2).toFixed(1)}): ${v}`));
