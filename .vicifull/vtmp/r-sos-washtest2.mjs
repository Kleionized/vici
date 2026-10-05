import { chromium } from 'playwright-core'; import fs from 'node:fs'; import { PNG } from 'pngjs';
const W=200,H=200,BG='#F4F3F0',SZ=124,ST=0.74,A=0.45,BL=4,C='226,186,120';
const cell=(inner)=>`<div style="position:relative;width:${W}px;height:${H}px;background:${BG};overflow:hidden">${inner}</div>`;
const off=(W-SZ)/2;
const css=`<div style="position:absolute;left:${off}px;top:${off}px;width:${SZ}px;height:${SZ}px;border-radius:50%;background:radial-gradient(closest-side,rgba(${C},${A}),rgba(${C},0) ${ST*100}%);filter:blur(${BL}px)"></div>`;
const svg=(id,blur)=>`<svg width="${W}" height="${H}" style="position:absolute;left:0;top:0"><defs>
 <radialGradient id="g${id}" cx="50%" cy="50%" rx="50%" ry="50%"><stop offset="0" stop-color="rgb(${C})" stop-opacity="${A}"/><stop offset="${ST}" stop-color="rgb(${C})" stop-opacity="0"/></radialGradient>
 ${blur?`<filter id="f${id}" x="0" y="0" width="${W}" height="${H}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${BL}"/></filter>`:''}</defs>
 <ellipse cx="${W/2}" cy="${H/2}" rx="${SZ/2}" ry="${SZ/2}" fill="url(#g${id})" ${blur?`filter="url(#f${id})"`:''}/></svg>`;
const b=await chromium.launch({channel:'chrome',headless:true,args:['--disable-gpu','--disable-dev-shm-usage']});
const p=await b.newPage({viewport:{width:W*3,height:H},deviceScaleFactor:2});
await p.setContent(`<body style="margin:0;display:flex;background:#fff">${cell(css)}${cell(svg('a',false))}${cell(svg('b',true))}</body>`);
await p.screenshot({path:'.vicifull/vtmp/r-sos-washtest2.png'}); await b.close();
const I=PNG.sync.read(fs.readFileSync('.vicifull/vtmp/r-sos-washtest2.png')); const S=2;
const px=(k,x,y)=>{const i=(I.width*(y*S)+((k*W+x)*S))<<2;return [I.data[i],I.data[i+1],I.data[i+2]];};
const cmp=(k)=>{let s=0,n=0,mx=0,at=null;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const a=px(0,x,y),c=px(k,x,y);
 const d=Math.max(Math.abs(a[0]-c[0]),Math.abs(a[1]-c[1]),Math.abs(a[2]-c[2]));s+=d;n++;if(d>mx){mx=d;at=[x,y];}} return `mean ${(s/n).toFixed(3)} max ${mx} at ${at}`;};
console.log('warm glow — CSS blurred vs SVG no blur (app): '+cmp(1));
console.log('warm glow — CSS blurred vs SVG with blur    : '+cmp(2));
for(const y of [70,85,100,115,130]) console.log(`  y ${y}: css ${px(0,100,y)}  noblur ${px(1,100,y)}  blur ${px(2,100,y)}`);
