import fs from 'node:fs';
import { PNG } from 'pngjs';
const [,,a,b,x0,y0,w,h] = process.argv;
const S=2;
const stat=(P,label)=>{
  let vals=[];
  for(let y=Number(y0)*S;y<(Number(y0)+Number(h))*S;y++) for(let x=Number(x0)*S;x<(Number(x0)+Number(w))*S;x++){
    const i=(P.width*y+x)<<2; vals.push((P.data[i]+P.data[i+1]+P.data[i+2])/3);
  }
  const m=vals.reduce((s,v)=>s+v,0)/vals.length;
  const sd=Math.sqrt(vals.reduce((s,v)=>s+(v-m)**2,0)/vals.length);
  // horizontal high-frequency energy: mean |p(x+1)-p(x)|
  let hf=0,n=0;
  for(let y=Number(y0)*S;y<(Number(y0)+Number(h))*S;y++) for(let x=Number(x0)*S;x<(Number(x0)+Number(w))*S-1;x++){
    const i=(P.width*y+x)<<2, j=(P.width*y+x+1)<<2;
    hf+=Math.abs((P.data[i]+P.data[i+1]+P.data[i+2])/3-(P.data[j]+P.data[j+1]+P.data[j+2])/3); n++;
  }
  console.log(`${label} mean ${m.toFixed(2)} sd ${sd.toFixed(2)} hf ${(hf/n).toFixed(3)}`);
};
stat(PNG.sync.read(fs.readFileSync(a)),'design');
stat(PNG.sync.read(fs.readFileSync(b)),'app   ');
