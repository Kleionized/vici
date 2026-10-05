// node .overhaul/af-sheet.mjs out.png a.png b.png … — side-by-side contact sheet
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [out, ...files] = process.argv.slice(2);
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
const gap = 8, W = imgs.reduce((a, i) => a + i.width + gap, 0), H = Math.max(...imgs.map((i) => i.height));
const sheet = new PNG({ width: W, height: H }); sheet.data.fill(255);
let x = 0; for (const i of imgs) { PNG.bitblt(i, sheet, 0, 0, i.width, i.height, x, 0); x += i.width + gap; }
fs.writeFileSync(out, PNG.sync.write(sheet));
