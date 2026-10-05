import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f,x0,y0,w,h,thr=200]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(f));
let miny=1e9,maxy=-1,minx=1e9,maxx=-1,n=0;
for(let y=y0*2;y<(+y0+ +h)*2;y++)for(let x=x0*2;x<(+x0+ +w)*2;x++){
  const i=(A.width*y+x)<<2;
  if(A.data[i]<Number(thr)){n++;if(y<miny)miny=y;if(y>maxy)maxy=y;if(x<minx)minx=x;if(x>maxx)maxx=x;}
}
console.log(f.split('/').pop(),`n=${n} x=${minx/2}..${maxx/2} y=${miny/2}..${maxy/2}`);
