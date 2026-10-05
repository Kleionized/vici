/* whole-frame |Δ| EXCLUDING only: top 54pt status bar, plus any rects named on
   the command line as x0,y0,x1,y1 (frame points). Everything else counted. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [d,a,...ex]=process.argv.slice(2);
const rd=(n)=>PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const A=rd(d),B=rd(a);
const R=ex.map(r=>r.split(',').map(Number).map(v=>v*2));
let s=0,n=0,o8=0,o32=0,w=0,wx=0,wy=0;
for(let y=108;y<A.height;y++)for(let x=0;x<A.width;x++){
 if(R.some(([x0,y0,x1,y1])=>x>=x0&&x<x1&&y>=y0&&y<y1))continue;
 const i=(A.width*y+x)<<2;
 const dd=Math.max(Math.abs(A.data[i]-B.data[i]),Math.abs(A.data[i+1]-B.data[i+1]),Math.abs(A.data[i+2]-B.data[i+2]));
 s+=dd;n++;if(dd>8)o8++;if(dd>32)o32++;if(dd>w){w=dd;wx=x/2;wy=y/2;}}
console.log(`mean ${(s/n).toFixed(3)}  >8 ${(100*o8/n).toFixed(3)}%  >32 ${(100*o32/n).toFixed(3)}%  worst ${w} at ${wx.toFixed(0)},${wy.toFixed(0)}  (n=${n})`);
