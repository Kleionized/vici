import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,yy,X0,X1,STEP] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(`.overhaul/shots/${a}.png`));
const B = PNG.sync.read(fs.readFileSync(`.overhaul/shots/${b}.png`));
const S=A.width/393, y=Math.round(Number(yy)*S), step=Number(STEP||20);
for(let x=Number(X0);x<Number(X1);x+=step){
  // average an 8x8 device-pixel patch to kill grain noise
  let sa=0,sb=0,n=0;
  for(let dy=-4;dy<4;dy++)for(let dx=-4;dx<4;dx++){
    const px=Math.round(x*S)+dx, py=y+dy; if(px<0||py<0||px>=A.width||py>=A.height)continue;
    sa+=A.data[(py*A.width+px)*4]; sb+=B.data[(py*B.width+px)*4]; n++;
  }
  console.log(`x=${x}  d=${(sa/n).toFixed(2)}  a=${(sb/n).toFixed(2)}  Δ=${((sb-sa)/n).toFixed(2)}`);
}
