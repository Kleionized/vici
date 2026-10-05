/* Bounding box + pixel count of everything within tol of a colour, in css coords. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [f,hex,tolS,boxS]=process.argv.slice(2);
const P=PNG.sync.read(fs.readFileSync(f)); const S=P.width/393;
const [r,g,b]=[0,2,4].map(i=>parseInt(hex.replace('#','').slice(i,i+2),16));
const tol=Number(tolS??8);
let x0=1e9,y0=1e9,x1=-1,y1=-1,n=0;
let bx=0,by=0,bw=393,bh=852; if(boxS){[bx,by,bw,bh]=boxS.split(',').map(Number);}
for(let y=Math.round(by*S);y<Math.round((by+bh)*S);y++)for(let x=Math.round(bx*S);x<Math.round((bx+bw)*S);x++){
  const i=(y*P.width+x)*4;
  if(Math.abs(P.data[i]-r)<=tol&&Math.abs(P.data[i+1]-g)<=tol&&Math.abs(P.data[i+2]-b)<=tol){n++;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
}
console.log(`${f.split('/').pop()} ${hex}±${tol}: ${n} px, css box ${(x0/S).toFixed(2)},${(y0/S).toFixed(2)} .. ${((x1+1)/S).toFixed(2)},${((y1+1)/S).toFixed(2)}  (w ${((x1+1-x0)/S).toFixed(2)} h ${((y1+1-y0)/S).toFixed(2)})`);
