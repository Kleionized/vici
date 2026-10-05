import fs from 'node:fs';
import { PNG } from 'pngjs';
const [a,b,X,Y,W,H,axis] = process.argv.slice(2);
const x0=Number(X)*2,y0=Number(Y)*2,w=Number(W)*2,h=Number(H)*2;
const P=[a,b].map(f=>PNG.sync.read(fs.readFileSync(f)));
const prof=(p,i0,n,other)=>{const r=[];for(let i=0;i<n;i++){let s=0;for(let j=0;j<other;j++){const x=axis==='x'?x0+i:x0+j,y=axis==='x'?y0+j:y0+i;s+=255-p.data[((y*p.width)+x)*4+1];}r.push(s);}return r;};
const n=axis==='x'?w:h,other=axis==='x'?h:w;
const A=prof(P[0],0,n,other),B=prof(P[1],0,n,other);
for(let i=0;i<n;i++){ if(A[i]>60||B[i]>60||Math.abs(A[i]-B[i])>60) console.log(`${axis} ${(axis==='x'?x0+i:y0+i)/2}\t${A[i]}\t${B[i]}\t${B[i]-A[i]}`); }
console.log('total', A.reduce((s,v)=>s+v,0), B.reduce((s,v)=>s+v,0));
