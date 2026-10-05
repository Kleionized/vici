/* Pixel diff, design vs app, at deviceScaleFactor 2.
 * Excludes ONLY the design's own clock strip (F49: x 47-360, y 23.5-36.5, padded)
 * and — when --badge is passed — the Expo dev-tools badge box in the app capture.
 * NOTHING else is masked: no gradient region, no band, no threshold-based skip.
 */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const args=process.argv.slice(2); const flags=args.filter(a=>a.startsWith('--'));
const [aPath,bPath]=args.filter(a=>!a.startsWith('--'));
const badge=flags.includes('--badge');
const nTiles=Number((flags.find(f=>f.startsWith('--tiles='))||'--tiles=10').slice(8));
const A=PNG.sync.read(fs.readFileSync(aPath)),B=PNG.sync.read(fs.readFileSync(bPath));
if(A.width!==B.width||A.height!==B.height)console.log('SIZE',A.width,A.height,'vs',B.width,B.height);
const W=Math.min(A.width,B.width),H=Math.min(A.height,B.height),S=2;
const excl=(x,y)=>{ if(x>=46*S&&x<=362*S&&y>=22*S&&y<=38*S)return true;
  if(badge&&x<70*S&&y>782*S)return true; return false; };
let sum=0,n=0,max=0,at=null,over4=0,over12=0;
const TW=16*S,tiles=new Map();
for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  if(excl(x,y))continue;
  const i=(A.width*y+x)<<2,j=(B.width*y+x)<<2;
  const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
  sum+=d;n++; if(d>max){max=d;at=[x/S,y/S];} if(d>=4)over4++; if(d>12){over12++;
    const k=`${Math.floor(x/TW)},${Math.floor(y/TW)}`;const t=tiles.get(k)??{c:0,s:0,mx:0};t.c++;t.s+=d;if(d>t.mx)t.mx=d;tiles.set(k,t);} }
console.log(`${aPath.split('/').pop()} vs ${bPath.split('/').pop()}: mean|Δ| ${(sum/n).toFixed(3)}  max ${max} at ${at&&at.map(v=>v.toFixed(0)).join(',')}  px>=4 ${over4}  px>12 ${over12}  tiles>12 ${tiles.size}`);
for(const [k,t] of [...tiles.entries()].sort((p,q)=>q[1].s-p[1].s).slice(0,nTiles)){
  const [tx,ty]=k.split(',').map(Number);
  console.log(`  box ${tx*16},${ty*16}-${tx*16+16},${ty*16+16}  px ${t.c}  max ${t.mx}  meanΔ ${(t.s/t.c).toFixed(1)}`);}
