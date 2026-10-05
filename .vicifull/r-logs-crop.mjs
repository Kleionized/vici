/* Crop the same CSS rect out of two PNGs, side by side, into one PNG.
   node r-logs-crop.mjs a.png b.png out.png x y w h */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,out,X,Y,W,H] = process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const s=A.width/393, x=Math.round(X*s), y=Math.round(Y*s), w=Math.round(W*s), h=Math.round(H*s);
const gap=8;
const O=new PNG({width:w, height:h*2+gap});
O.data.fill(255);
for(const [P,oy] of [[A,0],[B,h+gap]]) for(let j=0;j<h;j++) for(let i=0;i<w;i++){
  const si=((y+j)*P.width+(x+i))*4, di=((oy+j)*w+i)*4;
  O.data[di]=P.data[si];O.data[di+1]=P.data[si+1];O.data[di+2]=P.data[si+2];O.data[di+3]=255;
}
fs.writeFileSync(out, PNG.sync.write(O));
console.log(`${out}: design top, app bottom, css ${X},${Y} ${W}x${H} at ${s}x`);
