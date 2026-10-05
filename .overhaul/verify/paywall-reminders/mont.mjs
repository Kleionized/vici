// verifier: put n PNGs side by side (top-aligned, 10px gutter, grey bg)
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [out, ...ins] = process.argv.slice(2);
const imgs = ins.filter((f) => fs.existsSync(f)).map((f) => PNG.sync.read(fs.readFileSync(f)));
const W = imgs.reduce((s, i) => s + i.width, 0) + 10 * (imgs.length - 1), H = Math.max(...imgs.map((i) => i.height));
const o = new PNG({ width: W, height: H }); o.data.fill(128);
let x0 = 0; for (const i of imgs) { PNG.bitblt(i, o, 0, 0, i.width, i.height, x0, 0); x0 += i.width + 10; }
fs.writeFileSync(out, PNG.sync.write(o)); console.log('->', out, W, H);
