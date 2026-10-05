import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f,x0,y0,w,h,thr=128]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(f));
let minx=1e9,miny=1e9,maxx=-1,maxy=-1,n=0;
for(let y=y0*2;y<(+y0+ +h)*2;y++)for(let x=x0*2;x<(+x0+ +w)*2;x++){
  const i=(A.width*y+x)<<2;
  if(A.data[i]>Number(thr)){n++;if(x<minx)minx=x;if(x>maxx)maxx=x;if(y<miny)miny=y;if(y>maxy)maxy=y;}
}
console.log(f.split('/').pop(),`n=${n} box=${minx/2},${miny/2} -> ${maxx/2},${maxy/2}  (${(maxx-minx+1)/2} x ${(maxy-miny+1)/2})`);
