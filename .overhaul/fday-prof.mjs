/* print a vertical or horizontal scanline of both images, canvas coords */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,axis,fixed,from,to] = process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const px=(I,x,y)=>{const i=(I.width*Math.round(y*2)+Math.round(x*2))<<2;return [I.data[i],I.data[i+1],I.data[i+2]];};
for(let v=Number(from);v<=Number(to);v+=0.5){
  const x = axis==='v'?Number(fixed):v, y = axis==='v'?v:Number(fixed);
  const p=px(A,x,y), q=px(B,x,y);
  console.log(`${axis==='v'?'y':'x'}=${v}  design ${p.join(',')}  app ${q.join(',')}  d${Math.max(...p.map((c,i)=>Math.abs(c-q[i])))}`);
}
