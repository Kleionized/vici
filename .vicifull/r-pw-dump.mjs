/* dump one device row or column of red-channel values, for reading an edge */
import fs from 'node:fs'; import {PNG} from 'pngjs';
const [f,mode,cx,cy,n]=process.argv.slice(2);
const P=PNG.sync.read(fs.readFileSync(f));
let s='';
for(let i=0;i<Number(n)*2;i++){
  const x=mode==='row'?Math.round(Number(cx)*2)+i:Math.round(Number(cx)*2);
  const y=mode==='row'?Math.round(Number(cy)*2):Math.round(Number(cy)*2)+i;
  s+=String(P.data[(y*P.width+x)*4]).padStart(4);
}
console.log(f.split('/').pop().padEnd(24), s);
