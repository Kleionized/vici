/* Point sampler: reads css-coordinate pixels out of a 2x capture. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [file, ...pts] = process.argv.slice(2);
const P = PNG.sync.read(fs.readFileSync(file));
const px = (x, y) => { const i = ((y * 2) * P.width + x * 2) * 4; return [P.data[i], P.data[i + 1], P.data[i + 2]].join(','); };
console.log(file.split('/').pop().padEnd(30), pts.map((s) => { const [x, y] = s.split(',').map(Number); return `${s}=${px(x, y)}`; }).join('  '));
