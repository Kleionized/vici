/* Side-by-side crop: design | app | 8x-amplified |Δ| map, at canvas coords. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [A,B,X,Y,W,H,OUT,SC]=process.argv.slice(2);
const a=PNG.sync.read(fs.readFileSync(A)),b=PNG.sync.read(fs.readFileSync(B));
const dev=a.width/393, s=Number(SC||2);
const x0=Math.round(Number(X)*dev),y0=Math.round(Number(Y)*dev),w=Math.round(Number(W)*dev),h=Math.round(Number(H)*dev);
const gap=8;
const out=new PNG({width:(w*3+gap*2)*s,height:h*s});
const put=(px,py,c)=>{for(let j=0;j<s;j++)for(let i=0;i<s;i++){const k=(((py*s+j))*out.width+(px*s+i))*4;out.data[k]=c[0];out.data[k+1]=c[1];out.data[k+2]=c[2];out.data[k+3]=255;}};
const g=(p,x,y)=>{const k=(y*p.width+x)*4;return [p.data[k],p.data[k+1],p.data[k+2]];};
for(let j=0;j<h;j++)for(let i=0;i<w;i++){
 const P=g(a,x0+i,y0+j),Q=g(b,x0+i,y0+j);
 put(i,j,P); put(w+gap+i,j,Q);
 const d=Math.min(255,Math.max(...P.map((v,k)=>Math.abs(v-Q[k])))*8);
 put(w*2+gap*2+i,j,[255-d,255-d,255-d]);
}
fs.writeFileSync(OUT,PNG.sync.write(out)); console.log('wrote',OUT,out.width+'x'+out.height);
