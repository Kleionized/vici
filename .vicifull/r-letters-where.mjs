/* which css bands hold the differing blocks. Excludes only css rows < 54 (D009 status bar). */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,thrArg]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const W=Math.min(A.width,B.width),H=Math.min(A.height,B.height),S=8,thr=Number(thrArg??4);
const at=(P,x,y,c)=>P.data[(y*P.width+x)*4+c];
const rows=new Map();
let minx=1e9,maxx=-1,miny=1e9,maxy=-1,n=0;
for(let by=108;by+S<=H;by+=S)for(let bx=0;bx+S<=W;bx+=S){
  const m=[0,0,0],q=[0,0,0];
  for(let y=by;y<by+S;y++)for(let x=bx;x<bx+S;x++)for(let c=0;c<3;c++){m[c]+=at(A,x,y,c);q[c]+=at(B,x,y,c);}
  let d=0; for(let c=0;c<3;c++) d=Math.max(d,Math.abs(m[c]-q[c])/(S*S));
  if(d>=thr){n++;minx=Math.min(minx,bx/2);maxx=Math.max(maxx,bx/2+4);miny=Math.min(miny,by/2);maxy=Math.max(maxy,by/2+4);
    const k=Math.floor(by/2/20)*20; rows.set(k,(rows.get(k)||0)+1);}
}
console.log(`${n} blocks >= ${thr}/255; bbox css ${minx},${miny} - ${maxx},${maxy}`);
console.log([...rows.entries()].sort((p,q)=>p[0]-q[0]).map(([k,v])=>`y${k}-${k+19}:${v}`).join('  '));
