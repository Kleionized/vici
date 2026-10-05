/* Isolation: does the missing `filter: blur(8px)` on the Cue-Intro-Modal halo
   account for the residual, or is it gradient interpolation?
   Draws (a) the canvas's own CSS layer, (b) the app's SVG radial with no blur,
   (c) the same SVG radial under an feGaussianBlur — over the same ground. */
import { chromium } from 'playwright-core'; import fs from 'node:fs'; import { PNG } from 'pngjs';
const W=260,H=340,BG='#F4F3F0';
const cell=(inner)=>`<div style="position:relative;width:${W}px;height:${H}px;background:${BG};overflow:hidden">${inner}</div>`;
const css=`<div style="position:absolute;left:30px;top:30px;width:200px;height:280px;border-radius:50%;background:radial-gradient(closest-side, rgba(220,222,216,0.28), rgba(220,222,216,0) 75%);filter:blur(8px)"></div>`;
const svg=(id,blur)=>`<svg width="${W}" height="${H}" style="position:absolute;left:0;top:0"><defs>
  <radialGradient id="g${id}" cx="50%" cy="50%" rx="50%" ry="50%"><stop offset="0" stop-color="rgb(220,222,216)" stop-opacity="0.28"/><stop offset="0.75" stop-color="rgb(220,222,216)" stop-opacity="0"/></radialGradient>
  ${blur?`<filter id="f${id}" x="0" y="0" width="${W}" height="${H}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="8"/></filter>`:''}
  </defs><ellipse cx="130" cy="170" rx="100" ry="140" fill="url(#g${id})" ${blur?`filter="url(#f${id})"`:''}/></svg>`;
const html=`<body style="margin:0;display:flex;background:#fff">${cell(css)}${cell(svg('a',false))}${cell(svg('b',true))}</body>`;
const b=await chromium.launch({channel:'chrome',headless:true,args:['--disable-gpu','--disable-dev-shm-usage']});
const p=await b.newPage({viewport:{width:W*3,height:H},deviceScaleFactor:2});
await p.setContent(html); await p.screenshot({path:'.vicifull/vtmp/r-sos-washtest.png'}); await b.close();
const A=PNG.sync.read(fs.readFileSync('.vicifull/vtmp/r-sos-washtest.png')); const S=2;
const px=(k,x,y)=>{const i=(A.width*(y*S)+((k*W+x)*S))<<2;return [A.data[i],A.data[i+1],A.data[i+2]];};
const cmp=(k)=>{let s=0,n=0,mx=0,at=null;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const a=px(0,x,y),c=px(k,x,y);
  const d=Math.max(Math.abs(a[0]-c[0]),Math.abs(a[1]-c[1]),Math.abs(a[2]-c[2]));s+=d;n++;if(d>mx){mx=d;at=[x,y];}}
  return `mean ${(s/n).toFixed(3)} max ${mx} at ${at}`;};
console.log('CSS-blurred vs SVG-radial-no-blur (what the app draws): '+cmp(1));
console.log('CSS-blurred vs SVG-radial-WITH-blur (D151):            '+cmp(2));
for(const y of [40,60,90,170,250,300]) console.log(`  y ${y}: css ${px(0,130,y)}  noblur ${px(1,130,y)}  blur ${px(2,130,y)}`);
