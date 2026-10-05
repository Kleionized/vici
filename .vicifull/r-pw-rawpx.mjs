/* GROUP paywall pass-2 verify — raw per-pixel diff, no exclusions at all.
   Reports, per CSS band of 50 and overall: count of device pixels whose max
   channel delta exceeds thr, and the worst delta with its CSS location.
   EXCLUDES: nothing except the rows named by --from/--to (default 0..full).
   Unlike a block mean this cannot dilute a one-pixel hairline. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const argv = process.argv.slice(2);
const flag = (n,d)=>{const a=argv.find(x=>x.startsWith(`--${n}=`)); return a?Number(a.slice(n.length+3)):d;};
const [a,b,thrArg] = argv.filter(x=>!x.startsWith('--'));
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const W=Math.min(A.width,B.width), H=Math.min(A.height,B.height);
const thr=Number(thrArg??8);
const y0=Math.max(0,Math.round(flag('from',0)*2)), y1=Math.min(H,Math.round(flag('to',H/2)*2));
const bands=new Map(); let worst=0, wx=0, wy=0, total=0;
for(let y=y0;y<y1;y++) for(let x=0;x<W;x++){
  let d=0; for(let c=0;c<3;c++){const v=Math.abs(A.data[(y*A.width+x)*4+c]-B.data[(y*B.width+x)*4+c]); if(v>d)d=v;}
  if(d>worst){worst=d;wx=x/2;wy=y/2;}
  if(d>thr){total++; const k=Math.floor(y/2/50)*50; bands.set(k,(bands.get(k)||0)+1);}
}
console.log(`${a.split('/').pop()} vs ${b.split('/').pop()}: ${total} device px over ${thr}/255, worst ${worst} at css ${wx},${wy} — css rows ${y0/2}..${y1/2}, ALL columns, no flatness filter, no other exclusion`);
for(const k of [...bands.keys()].sort((p,q)=>p-q)) console.log(`   y${k}-${k+49}: ${bands.get(k)}`);
