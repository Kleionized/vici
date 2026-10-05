import fs from 'fs';
import { PNG } from 'pngjs';
const [,, out, cols, y0, y1, ...files] = process.argv;
const C = +cols, Y0 = +y0, Y1 = +y1; // canvas units
const W = 393, H = Y1 - Y0, R = Math.ceil(files.length / C);
const dst = new PNG({ width: W * C, height: H * R });
files.forEach((f, i) => {
  const src = PNG.sync.read(fs.readFileSync(f));
  const s = src.width / 393;
  const ox = (i % C) * W, oy = Math.floor(i / C) * H;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    // box average s x s
    let r=0,g=0,b=0,n=0;
    for (let dy=0; dy<s; dy++) for (let dx=0; dx<s; dx++) {
      const sx = Math.floor(x*s+dx), sy = Math.floor((y+Y0)*s+dy);
      if (sy>=src.height) continue;
      const k = (sy*src.width+sx)*4; r+=src.data[k]; g+=src.data[k+1]; b+=src.data[k+2]; n++;
    }
    const d = ((oy+y)*dst.width+ox+x)*4;
    dst.data[d]=r/n|0; dst.data[d+1]=g/n|0; dst.data[d+2]=b/n|0; dst.data[d+3]=255;
    if (x===0 || y===0) { dst.data[d]=200; dst.data[d+1]=40; dst.data[d+2]=40; }
  }
});
fs.writeFileSync(out, PNG.sync.write(dst));
