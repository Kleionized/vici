/* per-device-row ink profile inside an x/y window, for two shots */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [A,B,x0,x1,y0,y1] = process.argv.slice(2);
const b = await chromium.launch({ channel:'chrome', headless:true, args:['--disable-gpu'] });
const p = await b.newPage();
const prof = async (f) => {
  const s = fs.readFileSync(`.vicifull/shots/${f}.png`).toString('base64');
  return p.evaluate(async ([s,x0,x1,y0,y1]) => {
    const i=new Image(); i.src='data:image/png;base64,'+s; await i.decode();
    const c=document.createElement('canvas'); c.width=i.width;c.height=i.height;
    const g=c.getContext('2d'); g.drawImage(i,0,0);
    const d=g.getImageData(0,0,i.width,i.height);
    const out=[];
    for(let y=y0*2;y<y1*2;y++){let n=0,minv=255;for(let x=x0*2;x<x1*2;x++){const k=(y*i.width+x)*4;const v=(d.data[k]+d.data[k+1]+d.data[k+2])/3;if(v<160)n++;if(v<minv)minv=v;}out.push([y/2,n,Math.round(minv)]);}
    return out;
  },[s,Number(x0),Number(x1),Number(y0),Number(y1)]);
};
const a=await prof(A), bb=await prof(B);
for(let i=0;i<a.length;i++) console.log(a[i][0].toFixed(1).padStart(7), String(a[i][1]).padStart(5), String(a[i][2]).padStart(4), '  |', String(bb[i][1]).padStart(5), String(bb[i][2]).padStart(4), (a[i][1]!==bb[i][1]?'  <<':''));
await b.close();
