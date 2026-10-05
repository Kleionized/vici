import fs from 'node:fs'; import { PNG } from 'pngjs';
const [A,B,X0,Y0,X1,Y1]=process.argv.slice(2);
const a=PNG.sync.read(fs.readFileSync(A)),b=PNG.sync.read(fs.readFileSync(B));
const dev=a.width/393;
const g=(p,x,y)=>{const k=(y*p.width+x)*4;return [p.data[k],p.data[k+1],p.data[k+2]];};
const x0=Math.round(X0*dev),y0=Math.round(Y0*dev),x1=Math.round(X1*dev),y1=Math.round(Y1*dev);
let best=null;
for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){
 let s=0,n=0,mx=0;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  const P=g(a,x,y),Q=g(b,x+dx,y+dy);
  const d=Math.max(...P.map((v,k)=>Math.abs(v-Q[k])));s+=d;n++;if(d>mx)mx=d;}
 const m=s/n; if(!best||m<best.m)best={dx,dy,m,mx};
 if(Math.abs(dx)<=1&&Math.abs(dy)<=1) console.log(`dx${dx} dy${dy}  mean ${m.toFixed(3)} worst ${mx}`);
}
console.log('BEST', JSON.stringify(best));
