// node zoom.mjs design.png app.png out.png x y w h [k]  -> side by side, upscaled k (nearest)
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,out,X,Y,W,H,K='4'] = process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const s=A.width/393, k=Number(K), x=Math.round(X*s), y=Math.round(Y*s), w=Math.round(W*s), h=Math.round(H*s), gap=6;
const O=new PNG({width:(w*2+gap)*k, height:h*k}); O.data.fill(255);
[[A,0],[B,w+gap]].forEach(([P,ox])=>{ for(let j=0;j<h*k;j++) for(let i=0;i<w*k;i++){ const si=((y+Math.floor(j/k))*P.width+(x+Math.floor(i/k)))*4, di=(j*O.width+ox*k+i)*4; O.data[di]=P.data[si];O.data[di+1]=P.data[si+1];O.data[di+2]=P.data[si+2];O.data[di+3]=255; } });
fs.writeFileSync(out, PNG.sync.write(O)); console.log(out, 'design left, app right');
