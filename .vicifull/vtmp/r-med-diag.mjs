/* Signed app-design along the disc's 135deg gloss axis, averaged over a 5x5
   patch at each t. Nothing excluded. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [d,a,CX,CY,R]=process.argv.slice(2);
const rd=(n)=>PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const A=rd(d),B=rd(a);const cx=+CX,cy=+CY,r=+R;
for(let t=0.1;t<=0.95;t+=0.1){
 // 135deg CSS = axis pointing down-right; param from top-left corner of the box
 const x=cx+(t-0.5)*2*r*0.7071, y=cy+(t-0.5)*2*r*0.7071;
 let sa=[0,0,0],sb=[0,0,0],n=0;
 for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
  const i=(A.width*Math.round((y+dy/2)*2)+Math.round((x+dx/2)*2))<<2;
  for(let k=0;k<3;k++){sa[k]+=A.data[i+k];sb[k]+=B.data[i+k];}n++;}
 console.log(`t=${t.toFixed(1)} (${x.toFixed(0)},${y.toFixed(0)}) design ${sa.map(v=>(v/n).toFixed(1)).join(',')}  app ${sb.map(v=>(v/n).toFixed(1)).join(',')}  signed ${sb.map((v,k)=>((v-sa[k])/n).toFixed(2)).join(',')}`);
}
