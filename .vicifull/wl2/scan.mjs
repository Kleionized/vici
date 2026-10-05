/* Print the colour at each css x along a css row (or each y down a css column). */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f, axis, fixed, from, to] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(f));
const S = P.width / 393;
const out = [];
for (let v = Number(from); v <= Number(to); v += 1) {
  const x = axis === 'x' ? v : Number(fixed);
  const y = axis === 'x' ? Number(fixed) : v;
  const i = (Math.round(y * S) * P.width + Math.round(x * S)) * 4;
  out.push(`${v}:${P.data[i]},${P.data[i + 1]},${P.data[i + 2]}`);
}
console.log(f.split('/').pop(), out.join(' '));
