import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,thrArg] = process.argv.slice(2);
const thr = Number(thrArg ?? 4);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
const W=Math.min(A.width,B.width), H=Math.min(A.height,B.height), S=8;
const at=(P,x,y,c)=>P.data[(y*P.width+x)*4+c];
const pts=[];
for(let by=108;by+S<=H;by+=S)for(let bx=0;bx+S<=W;bx+=S){
  const m=[0,0,0],n=[0,0,0];
  for(let y=by;y<by+S;y++)for(let x=bx;x<bx+S;x++)for(let c=0;c<3;c++){m[c]+=at(A,x,y,c);n[c]+=at(B,x,y,c);}
  let d=0;for(let c=0;c<3;c++)d=Math.max(d,Math.abs(m[c]-n[c])/(S*S));
  if(d>=thr)pts.push({d,x:bx/2,y:by/2});
}
// cluster into rects
const used=new Array(pts.length).fill(false); const groups=[];
for(let i=0;i<pts.length;i++){ if(used[i])continue; const q=[i]; used[i]=true; const g=[pts[i]];
  while(q.length){ const k=q.pop();
    for(let j=0;j<pts.length;j++){ if(used[j])continue;
      if(Math.abs(pts[j].x-pts[k].x)<=12 && Math.abs(pts[j].y-pts[k].y)<=12){used[j]=true;q.push(j);g.push(pts[j]);}}}
  groups.push(g);
}
groups.sort((p,q)=>Math.max(...q.map(z=>z.d))-Math.max(...p.map(z=>z.d)));
console.log(`${a.split('/').pop()}: ${pts.length} blocks over ${thr}/255, ${groups.length} clusters`);
for(const g of groups.slice(0,14)){
  const xs=g.map(z=>z.x), ys=g.map(z=>z.y);
  console.log(`  worst ${Math.max(...g.map(z=>z.d)).toFixed(1)}  n=${g.length}  x ${Math.min(...xs)}–${Math.max(...xs)+4}  y ${Math.min(...ys)}–${Math.max(...ys)+4}`);
}
