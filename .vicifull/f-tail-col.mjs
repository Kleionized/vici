import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,xx,Y0,Y1] = process.argv.slice(2).map((v,i)=> i<2? v : v);
const A = PNG.sync.read(fs.readFileSync(`.vicifull/shots/${a}.png`));
const B = PNG.sync.read(fs.readFileSync(`.vicifull/shots/${b}.png`));
const S=A.width/393, x=Math.round(Number(xx)*S);
const y0=Math.round(Number(Y0)*S), y1=Math.round(Number(Y1)*S);
const cen=(src)=>{let sw=0,sy=0;for(let y=y0;y<y1;y++){const w=255-src.data[(y*src.width+x)*4]; if(w>8){sw+=w; sy+=w*y;}} return sw? (sy/sw)/S : NaN;};
const da=cen(A), db=cen(B);
console.log(`x=${xx} [${Y0}..${Y1}]  design y=${da.toFixed(3)}  app y=${db.toFixed(3)}  Δ=${(db-da).toFixed(3)}`);
