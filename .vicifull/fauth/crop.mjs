import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f, x, y, w, h, out] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(f));
const X = +x * 2, Y = +y * 2, W = +w * 2, H = +h * 2;
const o = new PNG({ width: W, height: H });
PNG.bitblt(P, o, X, Y, W, H, 0, 0);
fs.writeFileSync(out, PNG.sync.write(o));
console.log(out);
