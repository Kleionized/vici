/* Pixel diff for the sos recheck.
 *
 * EXCLUSIONS, stated because F35 says an instrument must:
 *   - device rows y < 54pt (status bar) and y >= 834pt (home indicator band):
 *     chrome the app never builds (D009).
 *   - NOTHING ELSE by default. The Expo dev-tools badge box (x<64, y>788) is
 *     reported SEPARATELY as `badge` so it can be seen rather than silently
 *     swallowed; pass --badge to subtract it from the totals.
 * Gradients, washes, grain, blurred solids are all INSIDE the measured area.
 */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const [aPath, bPath, nTop] = args.filter(a => !a.startsWith('--'));
const A = PNG.sync.read(fs.readFileSync(aPath));
const B = PNG.sync.read(fs.readFileSync(bPath));
if (A.width !== B.width || A.height !== B.height) console.log('SIZE', A.width, A.height, 'vs', B.width, B.height);
const W = Math.min(A.width, B.width), H = Math.min(A.height, B.height);
const S = 2, Y0 = 54*S, Y1 = Math.min(H, 834*S);
const inBadge = (x,y) => x < 64*S && y > 788*S;
let sum=0,n=0,max=0,maxAt=null,over6=0,over12=0,badgeMax=0,badgeN=0;
const TW = 16*S, tiles = new Map();
// 8x8 device-px block means: kills antialiasing without killing gradients (F35)
const BS = 8; const bw = Math.ceil(W/BS), bh = Math.ceil(H/BS);
const bsa = new Float64Array(bw*bh*3), bsb = new Float64Array(bw*bh*3), bcnt = new Float64Array(bw*bh);
for (let y=Y0; y<Y1; y++) for (let x=0; x<W; x++) {
  const badge = inBadge(x,y);
  const ia=(A.width*y+x)<<2, ib=(B.width*y+x)<<2;
  const d = Math.max(Math.abs(A.data[ia]-B.data[ib]),Math.abs(A.data[ia+1]-B.data[ib+1]),Math.abs(A.data[ia+2]-B.data[ib+2]));
  if (badge) { badgeN++; if (d>badgeMax) badgeMax=d; if (flags.has('--badge')) continue; }
  sum+=d; n++;
  if (d>max) { max=d; maxAt=[x/S,y/S]; }
  if (d>6) over6++;
  if (d>12) { over12++; const k=`${Math.floor(x/TW)},${Math.floor(y/TW)}`; const t=tiles.get(k)??{c:0,s:0,mx:0}; t.c++; t.s+=d; if(d>t.mx)t.mx=d; tiles.set(k,t); }
  const bi=(Math.floor(y/BS)*bw+Math.floor(x/BS));
  bsa[bi*3]+=A.data[ia]; bsa[bi*3+1]+=A.data[ia+1]; bsa[bi*3+2]+=A.data[ia+2];
  bsb[bi*3]+=B.data[ib]; bsb[bi*3+1]+=B.data[ib+1]; bsb[bi*3+2]+=B.data[ib+2];
  bcnt[bi]++;
}
let blkOver1=0, blkOver4=0, blkMax=0, blkAt=null, blkTot=0;
for (let i=0;i<bw*bh;i++){ if(!bcnt[i])continue; blkTot++;
  const d=Math.max(...[0,1,2].map(c=>Math.abs(bsa[i*3+c]/bcnt[i]-bsb[i*3+c]/bcnt[i])));
  if(d>1)blkOver1++; if(d>4)blkOver4++; if(d>blkMax){blkMax=d; blkAt=[(i%bw)*BS/S,Math.floor(i/bw)*BS/S];}
}
console.log(`mean|Δ| ${(sum/n).toFixed(3)}  max ${max} at ${maxAt&&maxAt.map(v=>v.toFixed(0)).join(',')}  px>6 ${over6}  px>12 ${over12}  | blocks8 ${blkOver1}/${blkTot} >1  ${blkOver4} >4  blkmax ${blkMax.toFixed(2)} at ${blkAt&&blkAt.join(',')}  | badge px ${badgeN} max ${badgeMax}`);
const top=[...tiles.entries()].sort((p,q)=>q[1].s-p[1].s).slice(0,Number(nTop??10));
for (const [k,t] of top){const [tx,ty]=k.split(',').map(Number);console.log(`  box ${tx*16},${ty*16}-${tx*16+16},${ty*16+16}  px ${t.c}  max ${t.mx}  meanΔ ${(t.s/t.c).toFixed(1)}`);}
