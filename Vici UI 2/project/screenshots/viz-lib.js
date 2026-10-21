// viz-lib: shared primitives for VICI lesson-day illustrations (240x200 canvas)
globalThis.V = (() => {
const INK='#55534E', INK2='#3A3934', G1='#E4E3DE', G2='#D6D5D0', G3='#C6C5C0', G4='#B4B1AB', G0='#EDECE6';
const PAPER='#F7F6F2', CARD='#FBFAF7', GOLD='#E9D2A4', GOLD2='#E2BA78', BLUE1='#C8D7E5', BLUE2='#D5E1EA';
const NIGHT='linear-gradient(180deg, #12151B 0%, #1A2027 100%)';
const d = (s, inner='') => `<div style="position:absolute; ${s}">${inner}</div>`;
const svg = (w,h,x,y,inner,extra='') => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="position:absolute; left:${x}px; top:${y}px;${extra}">${inner}</svg>`;
const R = n => Math.round(n*10)/10;
// soft warm glow
const glow = (cx,cy,r,a=0.40) => d(`left:${cx-r}px; top:${cy-r}px; width:${2*r}px; height:${2*r}px; border-radius:50%; background:radial-gradient(closest-side, rgba(226,186,120,${a}), rgba(226,186,120,0) 74%); filter:blur(5px);`);
const coolGlow = (cx,cy,r,a=0.35) => d(`left:${cx-r}px; top:${cy-r}px; width:${2*r}px; height:${2*r}px; border-radius:50%; background:radial-gradient(closest-side, rgba(203,218,232,${a}), rgba(203,218,232,0) 76%); filter:blur(5px);`);
// contact shadow
const cs = (cx,y,w,a=0.09) => d(`left:${cx-w/2}px; top:${y}px; width:${w}px; height:11px; border-radius:50%; background:rgba(0,0,0,${a}); filter:blur(5px);`);
// full-bleed ground band (no side clipping)
const ground = (top,color='#E9E8E2',lift=40) => d(`left:-28px; top:${top}px; width:296px; height:${200-top+30}px; border-radius:50% 50% 0 0 / ${lift}px ${lift}px 0 0; background:${color};`);
// two staggered hills
const hills = (t1=120,t2=146,c1='#ECEBE5',c2='#E2E1DB') =>
  d(`left:-70px; top:${t1}px; width:250px; height:${200-t1+30}px; border-radius:50% 50% 0 0 / 52px 52px 0 0; background:${c1};`) +
  d(`left:70px; top:${t1+10}px; width:250px; height:${200-t1+20}px; border-radius:50% 50% 0 0 / 48px 48px 0 0; background:${c1};`) +
  d(`left:-40px; top:${t2}px; width:330px; height:${200-t2+30}px; border-radius:50% 50% 0 0 / 40px 40px 0 0; background:${c2};`);
const water = (top,color='#C9D7E3') => d(`left:-28px; top:${top}px; width:296px; height:${200-top+30}px; border-radius:50% 50% 0 0 / 26px 26px 0 0; background:${color};`);
const waterDash = (x,y,w,a=0.55) => d(`left:${x}px; top:${y}px; width:${w}px; height:4px; border-radius:2px; background:rgba(255,255,255,${a});`);
const grassTuft = (x,y,a=0.5) => d(`left:${x}px; top:${y}px; width:12px; height:3.5px; border-radius:2px; background:rgba(255,255,255,${a});`);
const sun = (cx,cy,r=22,ga=0.5) => glow(cx,cy,r+30,ga) + d(`left:${cx-r}px; top:${cy-r}px; width:${2*r}px; height:${2*r}px; border-radius:50%; background:${GOLD};`);
const rays = (cx,cy,r) => svg(2*r+24,2*r+24,cx-r-12,cy-r-12,`<path d="M${r+12} 6 v-0 M${r+12} 2 v9 M${(r+12)-(r+7)*0.71} ${(r+12)-(r+7)*0.71} l-6 -6 M${(r+12)+(r+7)*0.71} ${(r+12)-(r+7)*0.71} l6 -6" stroke="${GOLD2}" stroke-width="2.5" stroke-linecap="round" fill="none"></path>`);
const sparkle = (x,y,s=2,a=0.4) => d(`left:${x}px; top:${y}px; width:${s}px; height:${s}px; border-radius:50%; background:rgba(200,225,235,${a});`);
const goldDot = (x,y,s=4,a=1) => d(`left:${x}px; top:${y}px; width:${s}px; height:${s}px; border-radius:50%; background:rgba(226,186,120,${a});`);
// night window w=58 h=72 at x,y (+sill)
const windowNight = (x,y,s=1) => {
  const w=58*s,h=72*s;
  return d(`left:${x}px; top:${y}px; width:${w}px; height:${h}px; border-radius:6px; background:${NIGHT}; box-shadow:0 0 0 ${6*s}px ${G1}, 0 5px 12px rgba(40,38,32,0.14);`)
  + d(`left:${x+w/2-2*s}px; top:${y}px; width:${4*s}px; height:${h}px; background:${G1};`)
  + d(`left:${x-7*s}px; top:${y+h}px; width:${w+14*s}px; height:${7*s}px; border-radius:3px; background:${G2};`)
  + d(`left:${x+w-20*s}px; top:${y+12*s}px; width:${13*s}px; height:${13*s}px; border-radius:50%; background:#DCDED8; box-shadow:0 0 10px rgba(220,222,216,0.6);`)
  + d(`left:${x+10*s}px; top:${y+34*s}px; width:2.5px; height:2.5px; border-radius:50%; background:rgba(244,243,240,0.6);`)
  + d(`left:${x+18*s}px; top:${y+52*s}px; width:2px; height:2px; border-radius:50%; background:rgba(244,243,240,0.4);`);
};
// table: top at (cx-w/2, topY), legs down legH
const table = (cx,topY,w,legH=36) =>
  cs(cx, topY+legH+3, w*0.92)
  + d(`left:${cx-w/2}px; top:${topY}px; width:${w}px; height:9px; border-radius:4.5px; background:#E0DFDA;`)
  + d(`left:${cx-w/2+10}px; top:${topY+9}px; width:6px; height:${legH}px; border-radius:3px; background:${G3};`)
  + d(`left:${cx+w/2-16}px; top:${topY+9}px; width:6px; height:${legH}px; border-radius:3px; background:${G3};`);
const stool = (cx,topY,w=42,legH=26) =>
  cs(cx, topY+legH+4, w*0.95, 0.08)
  + d(`left:${cx-w/2}px; top:${topY}px; width:${w}px; height:8px; border-radius:4px; background:#DEDDD7;`)
  + d(`left:${cx-w/2+7}px; top:${topY+8}px; width:5px; height:${legH}px; border-radius:2.5px; background:${G3};`)
  + d(`left:${cx+w/2-12}px; top:${topY+8}px; width:5px; height:${legH}px; border-radius:2.5px; background:${G3};`);
// bed side view, footprint x..x+118, floorY = bottom
const bed = (x,floorY) =>
  cs(x+60, floorY-3, 118)
  + d(`left:${x}px; top:${floorY-62}px; width:10px; height:62px; border-radius:5px 5px 3px 3px; background:${G2};`)   // headboard
  + d(`left:${x+8}px; top:${floorY-32}px; width:104px; height:24px; border-radius:6px 10px 5px 5px; background:#E0DFDA;`) // mattress
  + d(`left:${x+42}px; top:${floorY-34}px; width:70px; height:26px; border-radius:12px 12px 5px 4px; background:#C9C8C1;`) // duvet
  + d(`left:${x+48}px; top:${floorY-28}px; width:56px; height:4px; border-radius:2px; background:rgba(255,255,255,0.55);`) // duvet fold
  + d(`left:${x+12}px; top:${floorY-41}px; width:28px; height:14px; border-radius:7px 7px 5px 5px; background:#FFFFFF; box-shadow:inset 0 -2.5px 0 ${G2}, 0 1.5px 3px rgba(40,38,32,0.14);`) // pillow
  + d(`left:${x+10}px; top:${floorY-8}px; width:6px; height:8px; border-radius:0 0 2px 2px; background:${G3};`)
  + d(`left:${x+102}px; top:${floorY-8}px; width:6px; height:8px; border-radius:0 0 2px 2px; background:${G3};`);
// lit table lamp, base center bx, base line y
const lamp = (bx,baseY,lit=true) =>
  (lit? glow(bx,baseY-30,26,0.5):'')
  + d(`left:${bx-11}px; top:${baseY-38}px; width:22px; height:15px; border-radius:8px 8px 3px 3px; background:${lit?GOLD:G2};`)
  + d(`left:${bx-1.5}px; top:${baseY-23}px; width:3px; height:15px; background:${G3};`)
  + d(`left:${bx-8}px; top:${baseY-8}px; width:16px; height:5px; border-radius:2.5px; background:${G3};`);
// nightstand
const nightstand = (cx,floorY,w=44,h=34) =>
  cs(cx,floorY-3,w+6,0.08)
  + d(`left:${cx-w/2}px; top:${floorY-h}px; width:${w}px; height:${h-6}px; border-radius:5px; background:${G1};`)
  + d(`left:${cx-w/2+9}px; top:${floorY-h+9}px; width:${w-18}px; height:4px; border-radius:2px; background:${G4};`)
  + d(`left:${cx-w/2+4}px; top:${floorY-6}px; width:5px; height:6px; background:${G3};`)
  + d(`left:${cx+w/2-9}px; top:${floorY-6}px; width:5px; height:6px; background:${G3};`);
// alarm clock, soft ink ring (never black)
const clock = (cx,cy,r=20,hands='10:10') => {
  const ring = d(`left:${cx-r}px; top:${cy-r}px; width:${2*r}px; height:${2*r}px; border-radius:50%; background:${PAPER}; box-shadow:inset 0 0 0 2.4px ${INK}, 0 3px 7px rgba(40,38,32,0.14);`);
  const bells = d(`left:${cx-r*0.62-4}px; top:${cy-r-6}px; width:9px; height:6px; border-radius:5px 5px 0 0; background:${GOLD2}; transform:rotate(-24deg);`)
              + d(`left:${cx+r*0.62-5}px; top:${cy-r-6}px; width:9px; height:6px; border-radius:5px 5px 0 0; background:${GOLD2}; transform:rotate(24deg);`);
  const legs = d(`left:${cx-r*0.62-2}px; top:${cy+r-2}px; width:4px; height:7px; border-radius:2px; background:${INK}; transform:rotate(20deg);`)
             + d(`left:${cx+r*0.62-2}px; top:${cy+r-2}px; width:4px; height:7px; border-radius:2px; background:${INK}; transform:rotate(-20deg);`);
  const hh = d(`left:${cx-1.1}px; top:${cy-r*0.42}px; width:2.2px; height:${r*0.42}px; border-radius:1px; background:${INK}; transform:rotate(40deg); transform-origin:50% 100%;`)
           + d(`left:${cx-1.1}px; top:${cy-r*0.62}px; width:2.2px; height:${r*0.62}px; border-radius:1px; background:${INK}; transform:rotate(-52deg); transform-origin:50% 100%;`)
           + d(`left:${cx-1.5}px; top:${cy-1.5}px; width:3px; height:3px; border-radius:50%; background:${GOLD2};`);
  return bells + ring + legs + hh;
};
// coffee cup w/ steam
const cup = (cx,baseY,gold=false) =>
  d(`left:${cx-10}px; top:${baseY-15}px; width:20px; height:15px; border-radius:2px 2px 7px 7px; background:${gold?GOLD:PAPER}; box-shadow:inset 0 0 0 1.5px ${gold?GOLD2:G3};`)
  + d(`left:${cx+9}px; top:${baseY-12}px; width:7px; height:7px; border-radius:50%; box-shadow:inset 0 0 0 2px ${gold?GOLD2:G3};`)
  + svg(14,10,cx-7,baseY-27,`<path d="M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0" stroke="${G3}" stroke-width="1.6" fill="none" stroke-linecap="round"></path>`);
// open door w/ warm light spill; hinge left at x
const doorway = (x,y,h=104) => {
  const w=Math.round(h*0.62);
  return d(`left:${x}px; top:${y}px; width:${w}px; height:${h}px; border-radius:6px 6px 0 0; background:${PAPER}; box-shadow:inset 0 0 0 6px ${G1}, 0 6px 14px rgba(40,38,32,0.12);`)
  + d(`left:${x+8}px; top:${y+8}px; width:${w-22}px; height:${h-8}px; background:linear-gradient(90deg, rgba(233,210,164,0.8) 0%, rgba(243,227,196,0.3) 55%, rgba(244,243,240,0.12) 100%);`)
  + d(`left:${x+w-20}px; top:${y+6}px; width:20px; height:${h-6}px; border-radius:2px; background:${G2}; transform:skewY(-7deg); transform-origin:top right; box-shadow:-4px 3px 7px rgba(40,38,32,0.16);`)
  + d(`left:${x+w-16}px; top:${y+h*0.44}px; width:4px; height:4px; border-radius:50%; background:#8A857C;`)
  + d(`left:${x+4}px; top:${y+h}px; width:${w+20}px; height:12px; background:linear-gradient(100deg, rgba(233,210,164,0.5), rgba(233,210,164,0.06)); clip-path:polygon(6% 0, 78% 0, 100% 100%, 0 100%);`)
  + cs(x+w/2+6, y+h+2, w+18, 0.07);
};
// pair of sneakers facing right
const shoes = (cx,baseY) =>
  cs(cx,baseY+1,64,0.08)
  + d(`left:${cx-32}px; top:${baseY-12}px; width:30px; height:12px; border-radius:9px 5px 2px 3px; background:${INK};`)
  + d(`left:${cx-32}px; top:${baseY-3}px; width:30px; height:3px; border-radius:1.5px; background:${PAPER}; box-shadow:0 1px 1px rgba(0,0,0,0.12);`)
  + d(`left:${cx-25}px; top:${baseY-10}px; width:6px; height:3px; border-radius:1.5px; background:rgba(244,243,240,0.55);`)
  + d(`left:${cx+2}px; top:${baseY-12}px; width:30px; height:12px; border-radius:9px 5px 2px 3px; background:#6B6862;`)
  + d(`left:${cx+2}px; top:${baseY-3}px; width:30px; height:3px; border-radius:1.5px; background:${PAPER}; box-shadow:0 1px 1px rgba(0,0,0,0.12);`)
  + d(`left:${cx+9}px; top:${baseY-10}px; width:6px; height:3px; border-radius:1.5px; background:rgba(244,243,240,0.55);`);
// sage tree
const tree = (cx,baseY,s=1) =>
  cs(cx,baseY,54*s,0.08)
  + d(`left:${cx-2.5*s}px; top:${baseY-34*s}px; width:${5*s}px; height:${34*s}px; border-radius:2.5px; background:${G4};`)
  + d(`left:${cx-25*s}px; top:${baseY-60*s}px; width:${32*s}px; height:${32*s}px; border-radius:50%; background:#C9CEC1;`)
  + d(`left:${cx-8*s}px; top:${baseY-72*s}px; width:${34*s}px; height:${34*s}px; border-radius:50%; background:#D3D7CB;`)
  + d(`left:${cx-10*s}px; top:${baseY-52*s}px; width:${34*s}px; height:${30*s}px; border-radius:50%; background:#BEC4B4;`)
  + d(`left:${cx-18*s}px; top:${baseY-66*s}px; width:${26*s}px; height:${26*s}px; border-radius:50%; background:#CDD2C5;`);;
// calendar card
const calendar = (cx,cy,w=78,h=66,checks=7) => {
  let marks='';
  const cols=4, rows=2;
  for(let i=0;i<7;i++){
    const col=i%cols, row=Math.floor(i/cols);
    const mx=12+col*((w-24)/(cols-1))-5, my=h*0.42+row*15;
    marks += i<checks
      ? `<path d="M${R(mx)} ${R(my+3)} l3.4 3.4 5.2-6.4" stroke="${GOLD2}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(0,0)"></path>`
      : `<circle cx="${R(mx+4)}" cy="${R(my+2)}" r="3.4" fill="none" stroke="${G3}" stroke-width="2"></circle>`;
  }
  return d(`left:${cx-w/2}px; top:${cy-h/2}px; width:${w}px; height:${h}px; border-radius:9px; background:${CARD}; box-shadow:0 0 0 1px rgba(0,0,0,0.07), 0 6px 14px rgba(40,38,32,0.14);`)
  + d(`left:${cx-w/2}px; top:${cy-h/2}px; width:${w}px; height:${Math.round(h*0.28)}px; border-radius:9px 9px 0 0; background:${GOLD};`)
  + d(`left:${cx-w/2+14}px; top:${cy-h/2-5}px; width:4px; height:10px; border-radius:2px; background:${G4};`)
  + d(`left:${cx+w/2-18}px; top:${cy-h/2-5}px; width:4px; height:10px; border-radius:2px; background:${G4};`)
  + svg(w,h,cx-w/2,cy-h/2,marks);
};
// standing person silhouette
const person = (cx,topY,h,tone=INK) => {
  const hr=h*0.16;
  return d(`left:${cx-hr}px; top:${topY}px; width:${2*hr}px; height:${2*hr}px; border-radius:50%; background:${tone};`)
  + d(`left:${cx-h*0.19}px; top:${topY+2*hr+2}px; width:${h*0.38}px; height:${h-2*hr-2}px; border-radius:${h*0.19}px ${h*0.19}px ${h*0.08}px ${h*0.08}px; background:${tone};`);
};
// paper sheet with text lines
const sheet = (x,y,w,h,tone=CARD,lineTone=G3,gold=true) => {
  let lines='';
  const n=Math.max(2,Math.round((h-18)/9));
  for(let i=0;i<n;i++) lines += d(`left:${x+8}px; top:${y+9+i*9}px; width:${i===0&&gold? w*0.45 : w-16-(i%2)*8}px; height:3.5px; border-radius:2px; background:${i===0&&gold?GOLD2:lineTone};`);
  return d(`left:${x}px; top:${y}px; width:${w}px; height:${h}px; border-radius:4px; background:${tone}; box-shadow:0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1);`) + lines;
};
// dark phone
const phone = (cx,cy,w=30,h=52,rot=0) =>
  d(`left:${cx-w/2}px; top:${cy-h/2}px; width:${w}px; height:${h}px; border-radius:7px; background:${NIGHT}; box-shadow:0 0 0 2.5px #2A2E35, 0 5px 12px rgba(40,38,32,0.22); transform:rotate(${rot}deg);`)
  + d(`left:${cx-5}px; top:${cy-h/2+4}px; width:10px; height:3px; border-radius:1.5px; background:rgba(244,243,240,0.22); transform:rotate(${rot}deg);`);
// balance scale; tilt in deg (positive = right pan down)
const scaleB = (cx,baseY,tilt=0,goldPan=null) => {
  const pivotY=baseY-64, arm=62;
  const rad=tilt*Math.PI/180;
  const exL={x:cx-arm*Math.cos(rad), y:pivotY+arm*Math.sin(rad)}, exR={x:cx+arm*Math.cos(rad), y:pivotY-arm*Math.sin(rad)};
  const pan=(ex,gold)=>
    d(`left:${R(ex.x-2.5)}px; top:${R(ex.y-2.5)}px; width:5px; height:5px; border-radius:50%; background:${INK};`)
    + d(`left:${R(ex.x-1.25)}px; top:${R(ex.y)}px; width:2.5px; height:27px; border-radius:1px; background:#6B6862; transform:rotate(36deg); transform-origin:top center;`)
    + d(`left:${R(ex.x-1.25)}px; top:${R(ex.y)}px; width:2.5px; height:27px; border-radius:1px; background:#6B6862; transform:rotate(-36deg); transform-origin:top center;`)
    + d(`left:${R(ex.x-19)}px; top:${R(ex.y+20.5)}px; width:38px; height:11px; border-radius:3px 3px 19px 19px; background:${gold?GOLD:G2}; box-shadow:inset 0 -2px 0 ${gold?'rgba(196,152,86,0.55)':'rgba(0,0,0,0.08)'}, 0 2px 5px rgba(40,38,32,0.12);`)
    + (gold? glow(ex.x, ex.y+24, 22, 0.42):'');
  return cs(cx,baseY-2,64,0.1)
  + d(`left:${cx-23}px; top:${baseY-8}px; width:46px; height:8px; border-radius:4px; background:${G3};`)
  + d(`left:${cx-2.5}px; top:${pivotY}px; width:5px; height:${baseY-8-pivotY}px; border-radius:2.5px; background:${INK};`)
  + d(`left:${cx-arm}px; top:${pivotY-1.75}px; width:${2*arm}px; height:3.5px; border-radius:2px; background:${INK}; transform:rotate(${tilt}deg);`)
  + d(`left:${cx-4}px; top:${pivotY-4}px; width:8px; height:8px; border-radius:50%; background:${GOLD2};`)
  + pan(exL, goldPan==='L') + pan(exR, goldPan==='R');
};
// simple cloud
const cloud = (cx,cy,s=1,tone='#D2D1CB') =>
  d(`left:${cx-30*s}px; top:${cy-10*s}px; width:${34*s}px; height:${22*s}px; border-radius:50%; background:${tone};`)
  + d(`left:${cx-14*s}px; top:${cy-20*s}px; width:${40*s}px; height:${32*s}px; border-radius:50%; background:${tone};`)
  + d(`left:${cx+8*s}px; top:${cy-8*s}px; width:${30*s}px; height:${20*s}px; border-radius:50%; background:${tone};`)
  + d(`left:${cx-30*s}px; top:${cy+2*s}px; width:${68*s}px; height:${10*s}px; border-radius:8px; background:${tone};`);
const raindrops = (cx,y,spread=44,n=5,tone='#B9C3CC') => {
  let out='';
  for(let i=0;i<n;i++){ out += d(`left:${cx-spread/2 + i*(spread/(n-1))}px; top:${y + (i%2)*8}px; width:3px; height:8px; border-radius:2px; background:${tone}; opacity:${0.75-(i%2)*0.2}; transform:rotate(12deg);`);}
  return out;
};
// sailboat
const boat = (cx,waterY,s=1,tone=INK) =>
  d(`left:${cx-26*s}px; top:${waterY-14*s}px; width:${52*s}px; height:${14*s}px; border-radius:4px 4px ${16*s}px ${16*s}px / 4px 4px ${12*s}px ${12*s}px; background:${tone};`)
  + d(`left:${cx-1*s}px; top:${waterY-58*s}px; width:${2.5*s}px; height:${46*s}px; background:#8A857C;`)
  + d(`left:${cx-24*s}px; top:${waterY-52*s}px; width:0; height:0; border-right:${22*s}px solid ${G2}; border-top:${36*s}px solid transparent;`)
  + d(`left:${cx+4*s}px; top:${waterY-56*s}px; width:0; height:0; border-left:${24*s}px solid ${GOLD}; border-top:${40*s}px solid transparent;`);
const bird = (x,y,s=1) => svg(16*s,8*s,x,y,`<path d="M1 ${6*s} Q${4.5*s} ${1.5*s} ${8*s} ${5*s} Q${11.5*s} ${1.5*s} ${15*s} ${6*s}" fill="none" stroke="#8A857C" stroke-width="1.6" stroke-linecap="round"></path>`);
// framed flag on pole
const flagPole = (cx,baseY,h=54,gold=true) =>
  cs(cx,baseY-2,30,0.08)
  + d(`left:${cx-1.5}px; top:${baseY-h}px; width:3px; height:${h}px; border-radius:1.5px; background:#8A857C;`)
  + d(`left:${cx+1.5}px; top:${baseY-h}px; width:26px; height:16px; border-radius:2px 3px 3px 2px; background:${gold?GOLD:G3}; box-shadow:inset -2px -2px 0 rgba(0,0,0,0.05);`)
  + d(`left:${cx-3.5}px; top:${baseY-h-3.5}px; width:7px; height:7px; border-radius:50%; background:${gold?GOLD2:G4};`);
return {d,svg,glow,coolGlow,cs,ground,hills,water,waterDash,grassTuft,sun,rays,sparkle,goldDot,windowNight,table,stool,bed,lamp,nightstand,clock,cup,doorway,shoes,tree,calendar,person,sheet,phone,scaleB,cloud,raindrops,boat,bird,flagPole,
INK,INK2,G1,G2,G3,G4,G0,PAPER,CARD,GOLD,GOLD2,BLUE1,BLUE2,NIGHT};
})();
