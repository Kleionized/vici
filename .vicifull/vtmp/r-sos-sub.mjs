import fs from 'node:fs'; import { PNG } from 'pngjs';
const [,,a,b,cx,cy,rad=3]=process.argv; const S=2;
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const R=Number(rad)*S;
for(let y=Number(cy)*S-R;y<=Number(cy)*S+R;y++){let row='';
 for(let x=Number(cx)*S-R;x<=Number(cx)*S+R;x++){const i=(A.width*y+x)<<2,j=(B.width*y+x)<<2;
  const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
  row+=String(d).padStart(4);}
 console.log(`y ${(y/S).toFixed(1).padStart(7)} |${row}`);}
