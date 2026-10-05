#!/usr/bin/env node
// paywall-reminders: side-by-side montage of PNGs at 1/2 scale (dpr-2 captures → 1x), top-aligned.
// node .overhaul/pr-montage.mjs out.png a.png b.png ...
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, ...ins] = process.argv.slice(2);
const imgs = ins.map((f) => PNG.sync.read(fs.readFileSync(f)));
const half = (p) => { const w = p.width >> 1, h = p.height >> 1; const o = new PNG({ width: w, height: h }); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const s = ((y * 2) * p.width + x * 2) * 4, d = (y * w + x) * 4; for (let c = 0; c < 4; c++) o.data[d + c] = p.data[s + c]; } return o; };
const hs = imgs.map(half);
const gap = 8, W = hs.reduce((a, p) => a + p.width + gap, 0), H = Math.max(...hs.map((p) => p.height));
const o = new PNG({ width: W, height: H }); o.data.fill(255);
let x0 = 0; for (const p of hs) { for (let y = 0; y < p.height; y++) for (let x = 0; x < p.width; x++) { const s = (y * p.width + x) * 4, d = (y * W + x0 + x) * 4; for (let c = 0; c < 4; c++) o.data[d + c] = p.data[s + c]; } x0 += p.width + gap; }
fs.writeFileSync(out, PNG.sync.write(o));
console.log('montage ->', out, W + 'x' + H);
