/* High-frequency energy inside a box: rms of the horizontal first difference of
   luminance, computed on the DEVICE pixel grid. A tiled grain and a magnified
   one have the same mean and a very different value here (F31/F47). */
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,, a, b, box] = process.argv;
const [x0,y0,x1,y1] = box.split(',').map(Number);
const S = 2;
function hf(P){
  let s=0,n=0,mean=0,mn=0;
  for(let y=Math.round(y0*S); y<Math.round(y1*S); y++){
    for(let x=Math.round(x0*S); x<Math.round(x1*S)-1; x++){
      const i=(P.width*y+x)<<2, j=(P.width*y+x+1)<<2;
      const l1=0.299*P.data[i]+0.587*P.data[i+1]+0.114*P.data[i+2];
      const l2=0.299*P.data[j]+0.587*P.data[j+1]+0.114*P.data[j+2];
      s+=(l2-l1)*(l2-l1); n++; mean+=l1; mn++;
    }
  }
  return [Math.sqrt(s/n), mean/mn];
}
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const [ha,ma]=hf(A), [hb,mb]=hf(B);
console.log(`box ${box}  design hf-rms ${ha.toFixed(3)} mean-L ${ma.toFixed(2)} | app hf-rms ${hb.toFixed(3)} mean-L ${mb.toFixed(2)}  ratio ${(hb/ha).toFixed(3)}`);
