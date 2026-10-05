import fs from 'node:fs';
import { PNG } from 'pngjs';
const cases=[['noise.png',0.05,0x0D],['noise-dark.png',0.06,0x0D],['noise-dark.png',0.09,0x11],['noise.png',0.05,0x12],['noise.png',0.05,0x1E],['noise-dark.png',0.06,0x1E]];
for (const [f,op,bg] of cases){
  const p=PNG.sync.read(fs.readFileSync('Vici Overhaul/project/'+f)); const n=p.width*p.height; let s=0, mn=255, mx=0;
  for(let i=0;i<n;i++){const c=p.data[i*4], a=p.data[i*4+3]/255*op; const o=bg*(1-a)+c*a; s+=o; mn=Math.min(mn,o); mx=Math.max(mx,o);}
  console.log(f, op, 'on', bg.toString(16), '-> mean', (s/n).toFixed(2), 'min', mn.toFixed(2), 'max', mx.toFixed(2));
}
