import fs from 'node:fs';
import { PNG } from 'pngjs';
const [src, out, x, y, w, h] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(src));
const D = new PNG({ width: +w, height: +h });
for (let j = 0; j < +h; j++) for (let i = 0; i < +w; i++) {
  const s = ((+y + j) * P.width + (+x + i)) * 4, d = (j * +w + i) * 4;
  for (let c = 0; c < 4; c++) D.data[d + c] = P.data[s + c];
}
fs.writeFileSync(out, PNG.sync.write(D));
