import fs from 'node:fs';
import { PNG } from 'pngjs';
const [file, x0, x1, y0, y1] = process.argv.slice(2);
const png = PNG.sync.read(fs.readFileSync(file));
for (let y = +y0; y <= +y1; y++) {
  const row = [];
  for (let x = +x0; x <= +x1; x++) { const i = (png.width * y + x) * 4; row.push(String(png.data[i]).padStart(3)); }
  console.log(String(y / 2).padStart(6), row.join(' '));
}
