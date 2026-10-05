import fs from 'node:fs'; import { PNG } from 'pngjs';
const P = PNG.sync.read(fs.readFileSync(process.argv[2]));
const cx = 196.5, cy = 426; // gauge centre (svg 150,156 at left 46.5 top 270)
const bright = (x, y) => { const i = (P.width * Math.round(y * 2) + Math.round(x * 2)) << 2; return P.data[i] > 140; };
const glyph = [], dot = [], tick = [];
for (let y = 330; y < 440; y += 0.5) for (let x = 100; x < 320; x += 0.5) {
  if (!bright(x, y)) continue;
  const r = Math.hypot(x - cx, y - cy);
  if (r >= 104) tick.push([x, y]);
  else if (Math.hypot(x - (cx + 96 * Math.cos(Math.PI * (1 - (+process.argv[3])))), y - (cy - 96 * Math.sin(Math.PI * (1 - (+process.argv[3]))))) <= 7.5) dot.push([x, y]);
  else if (y < 420) glyph.push([x, y]);
}
const md = (A, B) => { let m = 1e9; for (const a of A) for (const b of B) m = Math.min(m, Math.hypot(a[0] - b[0], a[1] - b[1])); return m.toFixed(1); };
console.log('glyph px', glyph.length, 'dot', dot.length, 'min glyph→dot', md(glyph, dot), 'min glyph→tick', md(glyph.filter((p)=>p[0]>240), tick.filter((p)=>p[0]>240)));
