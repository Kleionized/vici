import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,x0,y0,w,h,out] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const X=+x0*2, Y=+y0*2, W=+w*2, H=+h*2;
const gap=16;
const o = new PNG({width: W*2+gap, height: H});
for (let y=0;y<H;y++) for (let x=0;x<W*2+gap;x++){ const k=(y*(W*2+gap)+x)*4; o.data[k]=255;o.data[k+1]=0;o.data[k+2]=255;o.data[k+3]=255; }
for (let y=0;y<H;y++) for (let x=0;x<W;x++){
  const i=((Y+y)*A.width+(X+x))*4, k=(y*(W*2+gap)+x)*4;
  o.data[k]=A.data[i];o.data[k+1]=A.data[i+1];o.data[k+2]=A.data[i+2];o.data[k+3]=255;
  const j=((Y+y)*B.width+(X+x))*4, k2=(y*(W*2+gap)+W+gap+x)*4;
  o.data[k2]=B.data[j];o.data[k2+1]=B.data[j+1];o.data[k2+2]=B.data[j+2];o.data[k2+3]=255;
}
fs.writeFileSync(out, PNG.sync.write(o));
console.log('->',out);
