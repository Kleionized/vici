import fs from 'node:fs'; import { PNG } from 'pngjs';
const [A,B,X0,Y0,W,H]=process.argv.slice(2);
const a=PNG.sync.read(fs.readFileSync(A)),b=PNG.sync.read(fs.readFileSync(B));
const dev=a.width/393;
const g=(p,x,y)=>{const k=(y*p.width+x)*4;return [p.data[k],p.data[k+1],p.data[k+2]];};
const x0=Math.round(Number(X0)*dev),y0=Math.round(Number(Y0)*dev);
for(let j=0;j<Number(H)*dev;j++){let row='';for(let i=0;i<Number(W)*dev;i++){
 const P=g(a,x0+i,y0+j),Q=g(b,x0+i,y0+j);const d=Math.max(...P.map((v,k)=>Math.abs(v-Q[k])));
 const sign = P[0]>Q[0] ? '-' : (P[0]<Q[0] ? '+' : '=');
 row += (d===0?'.':(d<3?String(d):String(d)))+sign+' ';}
 console.log(String(Math.round((y0+j)/dev*10)/10).padStart(6), row);}
