/* Side-by-side crop of two frames at a css box, magnified. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a, b, box, out, zArg] = process.argv.slice(2);
const [bx, by, bw, bh] = box.split(',').map(Number);
const z = Number(zArg ?? 3);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const S = A.width / 393;
const w = Math.round(bw * S), h = Math.round(bh * S);
const O = new PNG({ width: (w * 2 + 8) * z, height: h * z });
const put = (P, ox, sx) => {
  for (let y = 0; y < h * z; y++) for (let x = 0; x < w * z; x++) {
    const px = Math.round(bx * S) + Math.floor(x / z), py = Math.round(by * S) + Math.floor(y / z);
    const s = (py * P.width + px) * 4, d = ((y) * O.width + (ox + x)) * 4;
    for (let c = 0; c < 4; c++) O.data[d + c] = P.data[s + c];
  }
};
put(A, 0); put(B, (w + 8) * z);
fs.writeFileSync(out, PNG.sync.write(O));
console.log('wrote', out);
