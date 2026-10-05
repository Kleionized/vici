/* Windowed pixel diff, canvas coordinates. Exclusions: NOTHING but the window.
   node .overhaul/rday-win.mjs a.png b.png x0 y0 x1 y1 [thresh=8] */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,x0,y0,x1,y1,t='8'] = process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const th=Number(t); let n=0,worst=0,wx=0,wy=0,sum=0,tot=0; const pts=[];
for(let y=Number(y0)*2;y<Number(y1)*2;y++) for(let x=Number(x0)*2;x<Number(x1)*2;x++){
  const i=(A.width*y+x)<<2;
  const d=Math.max(Math.abs(A.data[i]-B.data[i]),Math.abs(A.data[i+1]-B.data[i+1]),Math.abs(A.data[i+2]-B.data[i+2]));
  sum+=d; tot++;
  if(d>th){n++; pts.push([x/2,y/2,d]); if(d>worst){worst=d;wx=x/2;wy=y/2;}}
}
console.log(`window ${x0},${y0}..${x1},${y1}  n>${th}=${n}  of ${tot}  mean|d|=${(sum/tot).toFixed(3)}  worst=${worst} at ${wx},${wy}`);
if(pts.length){const cl=[];for(const[x,y,d]of pts){let h=null;for(const c of cl)if(x>=c.x0-6&&x<=c.x1+6&&y>=c.y0-6&&y<=c.y1+6){h=c;break;}
 if(h){h.x0=Math.min(h.x0,x);h.x1=Math.max(h.x1,x);h.y0=Math.min(h.y0,y);h.y1=Math.max(h.y1,y);h.n++;h.d=Math.max(h.d,d);}else cl.push({x0:x,x1:x,y0:y,y1:y,n:1,d});}
 cl.sort((p,q)=>q.n-p.n); for(const c of cl.slice(0,10))console.log(`  cluster ${c.x0}..${c.x1} x ${c.y0}..${c.y1} n=${c.n} maxd=${c.d}`); if(cl.length>10)console.log(`  … ${cl.length-10} more`);}
