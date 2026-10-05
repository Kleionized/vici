/* design | app | |Δ|x6 side by side over a frame-point rect, magnified. */
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [d,a,out,X0,Y0,X1,Y1,MAG='1',GAIN='6']=process.argv.slice(2);
const rd=(n)=>PNG.sync.read(fs.readFileSync(n.includes('/')?n:`.vicifull/shots/${n}.png`));
const D=rd(d),A=rd(a),s=D.width/393,m=+MAG,g=+GAIN;
const w=Math.round((X1-X0)*s),h=Math.round((Y1-Y0)*s);
const o=new PNG({width:(w*3+16)*m,height:h*m});
for(let i=0;i<o.data.length;i+=4){o.data[i]=255;o.data[i+1]=0;o.data[i+2]=0;o.data[i+3]=255;}
const put=(ox,oy,r,gg,bb)=>{const j=(o.width*oy+ox)<<2;o.data[j]=r;o.data[j+1]=gg;o.data[j+2]=bb;o.data[j+3]=255;};
for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=(D.width*(Math.round(Y0*s)+y)+Math.round(X0*s)+x)<<2;
  const dv=Math.min(255,Math.max(Math.abs(D.data[i]-A.data[i]),Math.abs(D.data[i+1]-A.data[i+1]),Math.abs(D.data[i+2]-A.data[i+2]))*g);
  for(let my=0;my<m;my++)for(let mx=0;mx<m;mx++){
    put(x*m+mx,y*m+my,D.data[i],D.data[i+1],D.data[i+2]);
    put((w+8+x)*m+mx,y*m+my,A.data[i],A.data[i+1],A.data[i+2]);
    put((2*w+16+x)*m+mx,y*m+my,255-dv,255-dv,255-dv);
  }
}
fs.writeFileSync(out,PNG.sync.write(o));
console.log('->',out,`design | app | |Δ|x${g}`);
