/* Top differing 8x8 frame-point blocks. EXCLUDES only the top 54pt status bar. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [d,a,N='12']=process.argv.slice(2);
const rd=(n)=>PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const A=rd(d),B=rd(a); const S=16; // 8 frame points at dsf 2
const out=[];
for(let by=Math.ceil(108/S);by*S<A.height;by++)for(let bx=0;bx*S<A.width;bx++){
 let s=0,n=0,w=0;
 for(let y=by*S;y<Math.min((by+1)*S,A.height);y++)for(let x=bx*S;x<Math.min((bx+1)*S,A.width);x++){
  const i=(A.width*y+x)<<2;
  const dd=Math.max(Math.abs(A.data[i]-B.data[i]),Math.abs(A.data[i+1]-B.data[i+1]),Math.abs(A.data[i+2]-B.data[i+2]));
  s+=dd;n++;if(dd>w)w=dd;}
 out.push({x:bx*8,y:by*8,mean:s/n,worst:w});
}
out.sort((p,q)=>q.mean-p.mean);
console.log(out.slice(0,+N).map(o=>`(${o.x},${o.y}) mean ${o.mean.toFixed(1)} worst ${o.worst}`).join('\n'));
