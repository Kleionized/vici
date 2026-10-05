// Where does the design frame paint chrome? Report rows that are non-uniform in the top/bottom bands.
import fs from 'node:fs'; import { PNG } from 'pngjs';
const A = PNG.sync.read(fs.readFileSync(process.argv[2])); const S=2;
const px=(x,y)=>{const i=(A.width*y+x)<<2;return [A.data[i],A.data[i+1],A.data[i+2]];};
for (const [y0,y1] of [[0,60],[820,852]]) {
  console.log(`--- band ${y0}-${y1}`);
  for (let y=y0*S;y<y1*S;y+=2){
    // find leftmost/rightmost column differing from the row's own mode-ish (col 5)
    const base=px(5,y); let lo=null,hi=null;
    for(let x=0;x<A.width;x++){const c=px(x,y);const d=Math.max(Math.abs(c[0]-base[0]),Math.abs(c[1]-base[1]),Math.abs(c[2]-base[2]));if(d>8){if(lo===null)lo=x;hi=x;}}
    if(lo!==null) console.log(`  y ${(y/S).toFixed(1)}  x ${(lo/S).toFixed(1)}..${(hi/S).toFixed(1)}`);
  }
}
