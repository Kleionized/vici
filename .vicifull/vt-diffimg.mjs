import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,out,thr] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)); const B = PNG.sync.read(fs.readFileSync(b));
const W=Math.min(A.width,B.width),H=Math.min(A.height,B.height);
const o=new PNG({width:W,height:H});
const T=Number(thr??12);
for(let y=0;y<H;y++)for(let x=0;x<W;x++){
 const i=(y*A.width+x)*4,j=(y*B.width+x)*4,k=(y*W+x)*4;
 const d=Math.max(Math.abs(A.data[i]-B.data[j]),Math.abs(A.data[i+1]-B.data[j+1]),Math.abs(A.data[i+2]-B.data[j+2]));
 if(d>T){o.data[k]=255;o.data[k+1]=0;o.data[k+2]=0;o.data[k+3]=255;}
 else {const g=Math.round(255-(255-A.data[i])*0.25);o.data[k]=g;o.data[k+1]=g;o.data[k+2]=g;o.data[k+3]=255;}
}
fs.writeFileSync(out,PNG.sync.write(o));console.log('->'+out);
