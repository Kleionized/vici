import fs from 'node:fs'; import { PNG } from 'pngjs';
const A=PNG.sync.read(fs.readFileSync('.vicifull/shots/rday/d-Night-4-Closed.png'));
const B=PNG.sync.read(fs.readFileSync('.vicifull/shots/rday/a-Night-4-Closed.png'));
const g=(I,x,y)=>{const i=(I.width*Math.round(y*2)+Math.round(x*2))<<2;return [I.data[i],I.data[i+1],I.data[i+2]];};
for(const deg of [180,200,225,250,270,290,315,340,0,20,45,70,90,110,135,160]){
  const a=deg*Math.PI/180; const line=[];
  for(const r of [15.5,16.0,16.5,17.0,17.5,18.0]){
    const x=272+r*Math.cos(a), y=177+r*Math.sin(a);
    line.push(`${r}:${g(A,x,y)[0]}/${g(B,x,y)[0]}`);
  }
  console.log(String(deg).padStart(3),line.join('  '));
}
