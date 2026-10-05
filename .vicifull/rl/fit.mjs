import fs from 'node:fs'; import { PNG } from 'pngjs';
const keys=['A','S0','S1','S2','S3','S4','S5','S6'];
const labels=['css','s9','s10','s10.5','s11','s11.5','s12','s13'];
const P=keys.map(k=>PNG.sync.read(fs.readFileSync(`.vicifull/rl/st-${k}.png`)));
const at=(Q,x,y)=>Q.data[(y*Q.width+x)*4];
const prof=Q=>{const a=[];for(let cx=126;cx<=157;cx++){let s=0,n=0;for(let x=cx*2;x<cx*2+2;x++)for(let y=256;y<280;y++){s+=at(Q,x,y);n++;}a.push(s/n);}return a;};
const R=P.map(prof);
console.log('rms error vs css drop-shadow, left penumbra x126..157:');
for(let i=1;i<keys.length;i++){
  let e=0; for(let j=0;j<R[0].length;j++) e+=(R[i][j]-R[0][j])**2;
  console.log(` ${labels[i]}: rms ${Math.sqrt(e/R[0].length).toFixed(3)}  maxd ${Math.max(...R[i].map((v,j)=>Math.abs(v-R[0][j]))).toFixed(2)}`);
}
