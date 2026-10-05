/* Read exact pixels out of a PNG at css coordinates (deviceScaleFactor 2).
   usage: node f-handover-px.mjs img.png x,y x,y ...   or  img.png row=Y,x0,x1,step */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [file, ...pts] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(file));
const px = (x, y) => { const i = ((y * 2) * P.width + x * 2) * 4; return [P.data[i], P.data[i + 1], P.data[i + 2]]; };
for (const p of pts) {
  if (p.startsWith('row=')) {
    const [y, x0, x1, st] = p.slice(4).split(',').map(Number);
    const row = [];
    for (let x = x0; x <= x1; x += (st || 1)) row.push(`${x}:${px(x, y).join(',')}`);
    console.log(`y${y}  ${row.join('  ')}`);
  } else if (p.startsWith('col=')) {
    const [x, y0, y1, st] = p.slice(4).split(',').map(Number);
    const col = [];
    for (let y = y0; y <= y1; y += (st || 1)) col.push(`${y}:${px(x, y).join(',')}`);
    console.log(`x${x}  ${col.join('  ')}`);
  } else {
    const [x, y] = p.split(',').map(Number);
    console.log(`${x},${y} -> ${px(x, y).join(',')}`);
  }
}
