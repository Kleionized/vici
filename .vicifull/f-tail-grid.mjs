import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(`.vicifull/shots/${a}.png`));
const B = PNG.sync.read(fs.readFileSync(`.vicifull/shots/${b}.png`));
const S=A.width/393;
const patch=(src,x,y)=>{let s=0,n=0;for(let dy=-5;dy<5;dy++)for(let dx=-5;dx<5;dx++){
 const px=Math.round(x*S)+dx,py=Math.round(y*S)+dy; if(px<0||py<0||px>=src.width||py>=src.height)continue;
 s+=src.data[(py*src.width+px)*4];n++;} return s/n;};
process.stdout.write('  y\\x  ');
for(let x=20;x<=380;x+=40) process.stdout.write(String(x).padStart(7));
console.log();
for(let y=58;y<=130;y+=8){
 process.stdout.write(String(y).padStart(5)+' ');
 for(let x=20;x<=380;x+=40){ const d=patch(A,x,y),v=patch(B,x,y); process.stdout.write((v-d).toFixed(2).padStart(7)); }
 console.log();
}
