/* list every device pixel over thr with its css coord, clustered */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const argv=process.argv.slice(2);
const flag=(n,d)=>{const a=argv.find(x=>x.startsWith(`--${n}=`));return a?Number(a.slice(n.length+3)):d;};
const [a,b,thrArg]=argv.filter(x=>!x.startsWith('--'));
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const W=Math.min(A.width,B.width),H=Math.min(A.height,B.height),thr=Number(thrArg??12);
const y0=Math.max(0,Math.round(flag('from',0)*2)),y1=Math.min(H,Math.round(flag('to',H/2)*2));
const pts=[];
for(let y=y0;y<y1;y++)for(let x=0;x<W;x++){let d=0;for(let c=0;c<3;c++){const v=Math.abs(A.data[(y*A.width+x)*4+c]-B.data[(y*B.width+x)*4+c]);if(v>d)d=v;}
 if(d>thr)pts.push([x,y,d]);}
// cluster by 10-css-px cells
const cells=new Map();
for(const [x,y,d] of pts){const k=`${Math.floor(x/2/10)*10},${Math.floor(y/2/10)*10}`;const c=cells.get(k)||{n:0,w:0};c.n++;if(d>c.w)c.w=d;cells.set(k,c);}
console.log(`${pts.length} px over ${thr}; ${cells.size} cells of 10x10 css`);
for(const [k,c] of [...cells].sort((p,q)=>q[1].w-p[1].w).slice(0,40)) console.log(`  css ${k}  n=${c.n} worst=${c.w}`);
