/* design | app | 8x-amplified difference, side by side, downscaled to 1x. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [,,a,b,out,cropArg]=process.argv;
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const S=2;
let [x0,y0,x1,y1]=cropArg?cropArg.split(',').map(Number):[0,0,393,852];
const w=(x1-x0),h=(y1-y0);
const O=new PNG({width:w*3+8,height:h});
const set=(px,py,r,g,bl)=>{const i=(O.width*py+px)<<2;O.data[i]=r;O.data[i+1]=g;O.data[i+2]=bl;O.data[i+3]=255;};
for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const sx=(x0+x)*S, sy=(y0+y)*S;
  const i=(A.width*sy+sx)<<2, j=(B.width*sy+sx)<<2;
  set(x,y,A.data[i],A.data[i+1],A.data[i+2]);
  set(x+w+4,y,B.data[j],B.data[j+1],B.data[j+2]);
  const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
  const v=255-Math.min(255,d*8); set(x+2*w+8,y,255,v,v);
}
fs.writeFileSync(out,PNG.sync.write(O)); console.log('->',out,O.width+'x'+O.height);
