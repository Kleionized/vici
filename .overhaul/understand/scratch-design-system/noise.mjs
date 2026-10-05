import fs from 'node:fs';
import { PNG } from 'pngjs';
for (const f of ['Vici Overhaul/project/noise.png','Vici Overhaul/project/noise-dark.png']) {
  const p = PNG.sync.read(fs.readFileSync(f));
  let n=p.width*p.height, sr=0,sg=0,sb=0,sa=0, amin=255,amax=0, rmin=255,rmax=0; const hist={};
  for (let i=0;i<n;i++){const r=p.data[i*4],g=p.data[i*4+1],b=p.data[i*4+2],a=p.data[i*4+3]; sr+=r;sg+=g;sb+=b;sa+=a; amin=Math.min(amin,a);amax=Math.max(amax,a); rmin=Math.min(rmin,r); rmax=Math.max(rmax,r); const k=`${r},${g},${b}`; hist[k]=(hist[k]||0)+1;}
  const top=Object.entries(hist).sort((a,b)=>b[1]-a[1]).slice(0,6);
  console.log(f, p.width,p.height,'mean rgba',(sr/n).toFixed(1),(sg/n).toFixed(1),(sb/n).toFixed(1),(sa/n).toFixed(1),'a',amin,amax,'r',rmin,rmax,'distinct',Object.keys(hist).length, JSON.stringify(top));
}
