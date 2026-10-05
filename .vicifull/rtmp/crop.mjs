import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, src, out, box, scale] = process.argv;
const P = PNG.sync.read(fs.readFileSync(src));
const S=2, k=Number(scale??1);
const [x0,y0,x1,y1]=box.split(',').map(Number);
const w=Math.round((x1-x0)*S), h=Math.round((y1-y0)*S);
const O=new PNG({width:w*k,height:h*k});
for(let y=0;y<h*k;y++)for(let x=0;x<w*k;x++){
  const si=(P.width*(Math.round(y0*S)+Math.floor(y/k))+(Math.round(x0*S)+Math.floor(x/k)))<<2;
  const di=(O.width*y+x)<<2;
  O.data[di]=P.data[si];O.data[di+1]=P.data[si+1];O.data[di+2]=P.data[si+2];O.data[di+3]=255;
}
fs.writeFileSync(out, PNG.sync.write(O));
