/* Side-by-side magnifier: design | app | 4x-amplified abs diff, at a css box. */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,out,boxs,zs] = process.argv.slice(2);
const [bx,by,bw,bh] = boxs.split(',').map(Number);
const z = Number(zs ?? 4);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const S=A.width/393;
const x0=Math.round(bx*S), y0=Math.round(by*S), w=Math.round(bw*S), h=Math.round(bh*S);
const gap=6;
const O=new PNG({width:(w*3+gap*2)*z, height:h*z});
const at=(P,x,y,c)=>P.data[((y)*P.width+(x))*4+c];
for(let y=0;y<h*z;y++) for(let x=0;x<(w*3+gap*2)*z;x++){
  const sy=y0+Math.floor(y/z); let sx, src=null, dif=false;
  const cx=Math.floor(x/z);
  if(cx<w){src=A;sx=x0+cx;} else if(cx<w+gap){src=null;} else if(cx<w*2+gap){src=B;sx=x0+cx-w-gap;} else if(cx<w*2+gap*2){src=null;} else {dif=true;sx=x0+cx-w*2-gap*2;}
  const i=(y*O.width+x)*4; O.data[i+3]=255;
  if(dif){ for(let c=0;c<3;c++){ const d=Math.min(255,Math.abs(at(A,sx,sy,c)-at(B,sx,sy,c))*4); O.data[i+c]=255-d; } }
  else if(src){ for(let c=0;c<3;c++) O.data[i+c]=at(src,sx,sy,c); }
  else { O.data[i]=255;O.data[i+1]=0;O.data[i+2]=0; }
}
fs.writeFileSync(out, PNG.sync.write(O));
console.log('crop -> '+out+`  (design | app | diff x4), box ${boxs} zoom ${z}`);
