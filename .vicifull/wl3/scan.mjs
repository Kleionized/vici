/* Print both sides' RGB along a css row (--row=Y) or column (--col=X). */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const args=process.argv.slice(2); const [a,b]=args.filter(s=>!s.startsWith('--'));
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b)); const S=A.width/393;
const g=(k,d)=>{const f=args.find(s=>s.startsWith('--'+k+'='));return f?Number(f.slice(k.length+3)):d;};
const row=g('row',NaN), col=g('col',NaN), from=g('from',0), to=g('to',NaN);
const at=(P,x,y)=>[0,1,2].map(c=>P.data[(y*P.width+x)*4+c]);
if(!Number.isNaN(row)){ const y=Math.round(row*S); const x1=Number.isNaN(to)?393:to;
  for(let x=from;x<x1;x+=0.5){const X=Math.round(x*S);const p=at(A,X,y),q=at(B,X,y);const d=Math.max(...p.map((v,i)=>Math.abs(v-q[i])));if(d>=3)console.log(`x${x} design ${p.join(',')}  app ${q.join(',')}  d${d}`);}}
else { const x=Math.round(col*S); const y1=Number.isNaN(to)?852:to;
  for(let y=from;y<y1;y+=0.5){const Y=Math.round(y*S);const p=at(A,x,Y),q=at(B,x,Y);const d=Math.max(...p.map((v,i)=>Math.abs(v-q[i])));if(d>=3)console.log(`y${y} design ${p.join(',')}  app ${q.join(',')}  d${d}`);}}
