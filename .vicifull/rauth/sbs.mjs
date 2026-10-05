/* Side-by-side crop of two 2x captures, optional gain to amplify low-amplitude
   differences. node sbs.mjs a.png b.png x y w h out.png [gain] */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [fa, fb, x, y, w, h, out, gainArg] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(fa)), B = PNG.sync.read(fs.readFileSync(fb));
const X=+x*2, Y=+y*2, W=+w*2, H=+h*2, gain = Number(gainArg ?? 1);
const o = new PNG({ width: W*2+16, height: H });
for (let i=0;i<o.data.length;i+=4){o.data[i]=255;o.data[i+1]=0;o.data[i+2]=0;o.data[i+3]=255;}
const blit=(P,dx)=>{for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++){
  const s=((Y+yy)*P.width+(X+xx))*4, d=(yy*o.width+dx+xx)*4;
  for(let c=0;c<3;c++) o.data[d+c]=Math.min(255, P.data[s+c]*gain);
  o.data[d+3]=255;}};
blit(A,0); blit(B,W+16);
fs.writeFileSync(out, PNG.sync.write(o));
console.log(`${out}  (design left, app right, gain ${gain})`);
