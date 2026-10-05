/* side-by-side crop: design left, app right, optional zoom. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [a,b,x0,y0,x1,y1,out,zArg]=process.argv.slice(2);
const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
const X0=Number(x0)*2,Y0=Number(y0)*2,X1=Number(x1)*2,Y1=Number(y1)*2,z=Number(zArg??1);
const w=X1-X0,h=Y1-Y0, gap=8;
const O=new PNG({width:(w*2+gap)*z, height:h*z});
const put=(P,ox)=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++){const s=((Y0+y)*P.width+(X0+x))*4;
  for(let dy=0;dy<z;dy++)for(let dx=0;dx<z;dx++){const d=(((y*z+dy))*O.width+(ox+x)*z+dx)*4;
    O.data[d]=P.data[s];O.data[d+1]=P.data[s+1];O.data[d+2]=P.data[s+2];O.data[d+3]=255;}}};
put(A,0); put(B,w+gap);
fs.writeFileSync(out, PNG.sync.write(O));
console.log('->', out, `${O.width}x${O.height}  design left, app right, css ${x0},${y0}-${x1},${y1} @${z}x`);
