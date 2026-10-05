import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,X0,Y0,X1,Y1] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(`.overhaul/shots/${a}.png`));
const B = PNG.sync.read(fs.readFileSync(`.overhaul/shots/${b}.png`));
const S = A.width/393;
let n=0,max=0,at=null,hist={};
for(let y=Math.round(Y0*S);y<Math.round(Y1*S);y++)for(let x=Math.round(X0*S);x<Math.round(X1*S);x++){
 const i=(y*A.width+x)*4,j=(y*B.width+x)*4;
 const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
 if(d>6){n++;const k=Math.floor(d/10)*10;hist[k]=(hist[k]||0)+1;}
 if(d>max){max=d;at=[x/S,y/S];}
}
console.log(`region ${X0},${Y0}-${X1},${Y1}: ${n} px >6Δ, max ${max} at ${at&&at.map(v=>v.toFixed(1))}`, JSON.stringify(hist));
