/* mean |Δ| over one frame-point rect. Nothing masked inside it. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [d,a,...rects]=process.argv.slice(2);
const rd=(n)=>PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const A=rd(d),B=rd(a);
for(const r of rects){const [X0,Y0,X1,Y1,label]=r.split(',');
 const [x0,y0,x1,y1]=[+X0*2,+Y0*2,+X1*2,+Y1*2];
 let s=0,n=0,o8=0,o32=0,w=0,wx=0,wy=0;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=(A.width*y+x)<<2;
  const dd=Math.max(Math.abs(A.data[i]-B.data[i]),Math.abs(A.data[i+1]-B.data[i+1]),Math.abs(A.data[i+2]-B.data[i+2]));
  s+=dd;n++;if(dd>8)o8++;if(dd>32)o32++;if(dd>w){w=dd;wx=x/2;wy=y/2;}}
 console.log(`${(label||r).padEnd(22)} mean ${(s/n).toFixed(3)}  >8 ${(100*o8/n).toFixed(2)}%  >32 ${(100*o32/n).toFixed(2)}%  worst ${w} at ${wx.toFixed(0)},${wy.toFixed(0)}`);}
