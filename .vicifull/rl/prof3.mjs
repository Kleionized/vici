import fs from 'node:fs'; import { PNG } from 'pngjs';
const P = ['A','B','C'].map(k => PNG.sync.read(fs.readFileSync(`.vicifull/rl/st-${k}.png`)));
const at=(Q,x,y)=>Q.data[(y*Q.width+x)*4];
// horizontal profile left of the disc, y band 128..140 css (inside the panel, panel-local coords)
console.log('x   A(css)   B(sig9)  C(sRGB)   B-A    C-A');
for(let cx=126;cx<=162;cx++){
  const v=P.map(Q=>{let s=0,n=0;for(let x=cx*2;x<cx*2+2;x++)for(let y=128*2;y<140*2;y++){s+=at(Q,x,y);n++;}return s/n;});
  console.log(`${cx}  ${v[0].toFixed(2)}  ${v[1].toFixed(2)}  ${v[2].toFixed(2)}   ${(v[1]-v[0]).toFixed(2)}  ${(v[2]-v[0]).toFixed(2)}`);
}
