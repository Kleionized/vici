import fs from 'node:fs'; import { PNG } from 'pngjs';
const keys=['A','T0','T1','T2'];
const P=keys.map(k=>PNG.sync.read(fs.readFileSync(`.vicifull/rl/st-${k}.png`)));
const at=(Q,x,y)=>Q.data[(y*Q.width+x)*4];
const prof=(Q,x0,x1,y0,y1)=>{const a=[];for(let cx=x0;cx<=x1;cx++){let s=0,n=0;for(let x=cx*2;x<cx*2+2;x++)for(let y=y0*2;y<y1*2;y++){s+=at(Q,x,y);n++;}a.push(s/n);}return a;};
for (const [lbl,x0,x1,y0,y1] of [['left penumbra',126,157,128,140],['below disc',126,157,168,180]]) {
  const R=P.map(Q=>prof(Q,x0,x1,y0,y1));
  console.log(lbl+':');
  for(let i=1;i<keys.length;i++){
    let e=0; for(let j=0;j<R[0].length;j++) e+=(R[i][j]-R[0][j])**2;
    console.log(`  ${keys[i]}: rms ${Math.sqrt(e/R[0].length).toFixed(3)}  maxd ${Math.max(...R[i].map((v,j)=>Math.abs(v-R[0][j]))).toFixed(2)}`);
  }
}
