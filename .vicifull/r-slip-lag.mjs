/* 1-D cross-correlation of the high-passed grain along one row band, over the
   full ± range given. Finds the tile phase offset between two images inside a
   frame rectangle. No exclusions inside the rectangle.
   Usage: node r-slip-lag.mjs a.png b.png x y w h [maxlag_device_px] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,X,Y,W,H,L]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const s=A.width/393,maxl=Number(L??200);
const x0=Math.round(X*s),y0=Math.round(Y*s),w=Math.round(W*s),h=Math.round(H*s);
const hp=(P)=>{const out=[];for(let y=0;y<h;y++){const r=[];for(let x=0;x<w;x++){
 let sum=0,n=0;for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
  const yy=y0+y+dy,xx=x0+x+dx;if(yy<0||xx<0||yy>=P.height||xx>=P.width)continue;
  const i=(yy*P.width+xx)*4;sum+=(P.data[i]+P.data[i+1]+P.data[i+2])/3;n++;}
 const i=((y0+y)*P.width+(x0+x))*4;r.push((P.data[i]+P.data[i+1]+P.data[i+2])/3-sum/n);}out.push(r);}return out;};
const HA=hp(A),HB=hp(B);
const res=[];
for(let dy=-maxl;dy<=maxl;dy++)for(let dx=-maxl;dx<=maxl;dx++){
 let num=0,d1=0,d2=0;
 for(let y=Math.max(0,-dy);y<Math.min(h,h-dy);y+=2)for(let x=Math.max(0,-dx);x<Math.min(w,w-dx);x+=2){
  num+=HA[y][x]*HB[y+dy][x+dx];d1+=HA[y][x]**2;d2+=HB[y+dy][x+dx]**2;}
 if(d1&&d2)res.push([num/Math.sqrt(d1*d2),dx,dy]);}
res.sort((p,q)=>q[0]-p[0]);
console.log('top correlations (device px shift of B relative to A):');
for(const [c,dx,dy] of res.slice(0,5))console.log(`   dx=${dx} dy=${dy} : r=${c.toFixed(3)}`);
const z=res.find(r=>r[1]===0&&r[2]===0);console.log(`   dx=0 dy=0 : r=${z[0].toFixed(3)}`);
