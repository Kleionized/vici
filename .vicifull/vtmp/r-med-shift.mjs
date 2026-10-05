import fs from 'node:fs'; import { PNG } from 'pngjs';
const [d,a,X0,Y0,X1,Y1,...sh]=process.argv.slice(2);
const rd=(n)=>PNG.sync.read(fs.readFileSync(`.vicifull/shots/${n}.png`));
const A=rd(d),B=rd(a); const [x0,y0,x1,y1]=[+X0*2,+Y0*2,+X1*2,+Y1*2];
const lum=(I,px,py)=>{const i=(py*I.width+px)*4;return .299*I.data[i]+.587*I.data[i+1]+.114*I.data[i+2];};
const cmp=(dx,dy)=>{let s=0,n=0;for(let y=y0;y<y1;y++)for(let x=x0+20;x<x1-20;x++){s+=Math.abs(lum(A,x,y)-lum(B,x+dx,y+dy));n++;}return s/n;};
for(const p of sh){const [dx,dy]=p.split(',').map(Number);console.log(`dx=${dx} dy=${dy} -> ${cmp(dx,dy).toFixed(4)}`);}
