#!/usr/bin/env node
// paywall-reminders: side-by-side montage of dpr-1 PNGs at full scale, top-aligned.
// node .overhaul/pr-row.mjs out.png a.png b.png ...
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, ...ins] = process.argv.slice(2);
const imgs = ins.map((f) => PNG.sync.read(fs.readFileSync(f)));
const gap = 8, W = imgs.reduce((a, p) => a + p.width + gap, 0) - gap, H = Math.max(...imgs.map((p) => p.height));
const o = new PNG({ width: W, height: H }); o.data.fill(255);
let x0 = 0; for (const p of imgs) { for (let y = 0; y < p.height; y++) p.data.copy(o.data, (y * W + x0) * 4, y * p.width * 4, (y + 1) * p.width * 4); x0 += p.width + gap; }
fs.writeFileSync(out, PNG.sync.write(o));
console.log('row ->', out, W + 'x' + H);
