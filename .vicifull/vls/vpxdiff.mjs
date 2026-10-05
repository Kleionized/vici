/* Pixel comparison of a design frame and the app screen, for the lesson-scroll
   group. A signature diff proves the boxes line up; this proves the paint does.
   Reports the fraction of pixels beyond a per-channel threshold and the worst
   64x64 tile, so art that is invisible or the wrong colour cannot pass. */
import fs from 'node:fs';
import { PNG } from 'pngjs';

/* usage: node pxdiff.mjs <design.png> <app.png> [threshold] [--worst] [--out] */
const [, , a, b, thrArg] = process.argv;
const thr = Number(thrArg?.startsWith('--') ? 12 : (thrArg ?? 12));
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
if (A.width !== B.width || A.height !== B.height) { console.log(`size ${A.width}x${A.height} vs ${B.width}x${B.height}`); process.exit(1); }
const T = 64 * 2; // tiles in device pixels (the shots are @2x)
const tiles = new Map();
let bad = 0, maxd = 0;
/* The status bar is chrome the app never builds (D009), so the first 54pt of
   the frame is always the design's clock and icons against the app's blank. */
const SKIP = 54 * 2;
for (let y = SKIP; y < A.height; y++) {
  for (let x = 0; x < A.width; x++) {
    const i = (y * A.width + x) * 4;
    const d = Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i + 1] - B.data[i + 1]), Math.abs(A.data[i + 2] - B.data[i + 2]));
    if (d > maxd) maxd = d;
    if (d <= thr) continue;
    bad++;
    const k = `${Math.floor(x / T) * 64},${Math.floor(y / T) * 64}`;
    tiles.set(k, (tiles.get(k) ?? 0) + 1);
  }
}
const total = A.width * (A.height - SKIP);
const top = [...tiles].sort((x, y) => y[1] - x[1]).slice(0, 8);
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${bad}/${total} px over ${thr} (${(bad / total * 100).toFixed(3)}%), max delta ${maxd}`);
if (top.length) console.log('  worst 64pt tiles (x,y in frame pt): ' + top.map(([k, v]) => `${k}=${v}`).join('  '));
if (process.argv.includes('--worst')) {
  /* The tile counts say where; this says what. A run of identical deltas at one
     x is a half-pixel edge; a scatter of large ones is art that is wrong. */
  const rows = [];
  for (let y = SKIP; y < A.height; y++) for (let x = 0; x < A.width; x++) {
    const i = (y * A.width + x) * 4;
    const d = Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i + 1] - B.data[i + 1]), Math.abs(A.data[i + 2] - B.data[i + 2]));
    if (d > thr) rows.push([d, x / 2, y / 2, [A.data[i], A.data[i + 1], A.data[i + 2]].join(','), [B.data[i], B.data[i + 1], B.data[i + 2]].join(',')]);
  }
  rows.sort((p, q) => q[0] - p[0]);
  for (const r of rows.slice(0, 12)) console.log(`  d=${r[0]} at (${r[1]}, ${r[2]})  design ${r[3]}  app ${r[4]}`);
}
if (process.argv.includes('--out')) {
  const out = new PNG({ width: A.width, height: A.height });
  for (let i = 0; i < A.data.length; i += 4) {
    const d = Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i + 1] - B.data[i + 1]), Math.abs(A.data[i + 2] - B.data[i + 2]));
    const on = d > thr && i >= SKIP * A.width * 4;
    out.data[i] = on ? 255 : A.data[i];
    out.data[i + 1] = on ? 0 : A.data[i + 1];
    out.data[i + 2] = on ? 0 : A.data[i + 2];
    out.data[i + 3] = 255;
  }
  fs.writeFileSync('.vicifull/vls/vpx.png', PNG.sync.write(out));
  console.log('  -> .vicifull/vls/vpx.png');
}
