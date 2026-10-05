import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,,a,out,x0,y0,w,h,zoom=4] = process.argv;
const A = PNG.sync.read(fs.readFileSync(a));
const S=2, Z=Number(zoom);
const O = new PNG({ width: Number(w)*S*Z, height: Number(h)*S*Z });
for (let y=0;y<O.height;y++) for (let x=0;x<O.width;x++){
  const sx=Number(x0)*S+Math.floor(x/Z), sy=Number(y0)*S+Math.floor(y/Z);
  const i=(A.width*sy+sx)<<2, j=(O.width*y+x)<<2;
  O.data[j]=A.data[i];O.data[j+1]=A.data[i+1];O.data[j+2]=A.data[i+2];O.data[j+3]=255;
}
fs.writeFileSync(out, PNG.sync.write(O));
