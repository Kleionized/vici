/* Contact sheet: every frame's signed (design-app) difference, amplified 10x
   about mid-grey, downscaled 4x by box average. Nothing is excluded; the top
   54 css pt (status-bar chrome the app never draws, D009) is blanked to mid
   grey so the design frame's own clock does not dominate every tile. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const files = fs.readdirSync('.vicifull/shots/rfunnel').filter(f => f.startsWith('r-funnel-d-') && f.endsWith('.png')).sort();
const S = 4, TW = Math.round(786 / S), TH = Math.round(1704 / S), COLS = 8, PAD = 3;
const O = new PNG({ width: COLS * (TW + PAD), height: Math.ceil(files.length / COLS) * (TH + PAD) });
O.data.fill(0);
files.forEach((f, i) => {
  const A = PNG.sync.read(fs.readFileSync('.vicifull/shots/rfunnel/' + f));
  const B = PNG.sync.read(fs.readFileSync('.vicifull/shots/rfunnel/' + f.replace('-d-', '-a-')));
  const ox = (i % COLS) * (TW + PAD), oy = Math.floor(i / COLS) * (TH + PAD);
  for (let ty = 0; ty < TH; ty++) for (let tx = 0; tx < TW; tx++) {
    const acc = [0, 0, 0]; let n = 0;
    for (let dy = 0; dy < S; dy++) for (let dx = 0; dx < S; dx++) {
      const x = tx * S + dx, y = ty * S + dy;
      if (x >= A.width || y >= A.height) continue;
      const inChrome = y < 108;
      for (let c = 0; c < 3; c++) acc[c] += inChrome ? 0 : (A.data[(y * A.width + x) * 4 + c] - B.data[(y * B.width + x) * 4 + c]);
      n++;
    }
    const p = ((oy + ty) * O.width + ox + tx) * 4;
    for (let c = 0; c < 3; c++) O.data[p + c] = Math.max(0, Math.min(255, 128 + (acc[c] / n) * 10));
    O.data[p + 3] = 255;
  }
  console.log(String(i).padStart(2), f.replace('r-funnel-d-', '').replace('.png', ''));
});
fs.writeFileSync('.vicifull/shots/rfunnel/sheet.png', PNG.sync.write(O));
