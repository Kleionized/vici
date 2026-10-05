// task-lib: wide-canvas (340x200) additions on top of viz-lib V
globalThis.T = (() => {
const {d,svg,glow,cs,sparkle,goldDot,INK,INK2,G1,G2,G3,G4,G0,PAPER,CARD,GOLD,GOLD2,NIGHT} = V;
const R = n => Math.round(n*10)/10;
const groundW = (top,color='#E9E8E2',lift=40) => d(`left:-30px; top:${top}px; width:400px; height:${200-top+30}px; border-radius:50% 50% 0 0 / ${lift}px ${lift}px 0 0; background:${color};`);
const hillsW = (t1=118,t2=146,c1='#ECEBE5',c2='#E2E1DB') =>
  d(`left:-80px; top:${t1}px; width:300px; height:${200-t1+30}px; border-radius:50% 50% 0 0 / 52px 52px 0 0; background:${c1};`) +
  d(`left:130px; top:${t1+10}px; width:300px; height:${200-t1+20}px; border-radius:50% 50% 0 0 / 48px 48px 0 0; background:${c1};`) +
  d(`left:-40px; top:${t2}px; width:430px; height:${200-t2+30}px; border-radius:50% 50% 0 0 / 40px 40px 0 0; background:${c2};`);
const waterW = (top,color='#C9D7E3') => d(`left:-30px; top:${top}px; width:400px; height:${200-top+30}px; border-radius:50% 50% 0 0 / 26px 26px 0 0; background:${color};`);
// winding path on ground, from bottom center-left to horizon right
const pathW = (y0=196,x0=96,y1=132,x1=252,w0=34,w1=8,tone='#DDDCD5') =>
  svg(340,200,0,0,`<path d="M${x0-w0/2} ${y0} Q ${x0+30} ${y1+28} ${(x0+x1)/2} ${(y0+y1)/2-6} T ${x1-w1/2} ${y1} L ${x1+w1/2} ${y1} Q ${(x0+x1)/2+30} ${(y0+y1)/2+2} ${(x0+x1)/2+10} ${(y0+y1)/2+14} T ${x0+w0/2} ${y0} Z" fill="${tone}"></path>`);
// open book
const book = (cx,baseY,w=56,tone=CARD) =>
  cs(cx,baseY-1,w+8,0.08)
  + d(`left:${cx-w/2}px; top:${baseY-16}px; width:${w/2}px; height:16px; border-radius:6px 2px 2px 4px; background:${tone}; box-shadow:inset 0 -3px 0 ${G2}, 0 1px 3px rgba(40,38,32,0.12); transform:skewY(-6deg); transform-origin:bottom right;`)
  + d(`left:${cx}px; top:${baseY-16}px; width:${w/2}px; height:16px; border-radius:2px 6px 4px 2px; background:${tone}; box-shadow:inset 0 -3px 0 ${G2}, 0 1px 3px rgba(40,38,32,0.12); transform:skewY(6deg); transform-origin:bottom left;`)
  + d(`left:${cx-1}px; top:${baseY-17}px; width:2px; height:15px; background:${G3};`)
  + d(`left:${cx-w/2+7}px; top:${baseY-11}px; width:${w/2-13}px; height:2.5px; border-radius:1px; background:${G3}; transform:skewY(-6deg);`)
  + d(`left:${cx+6}px; top:${baseY-11}px; width:${w/2-13}px; height:2.5px; border-radius:1px; background:${G3}; transform:skewY(6deg);`);
// steaming bowl
const bowl = (cx,baseY,gold=false) =>
  d(`left:${cx-16}px; top:${baseY-13}px; width:32px; height:13px; border-radius:3px 3px 16px 16px; background:${gold?GOLD:PAPER}; box-shadow:inset 0 0 0 1.6px ${gold?GOLD2:G3};`)
  + d(`left:${cx-10}px; top:${baseY-2}px; width:20px; height:2.5px; border-radius:1px; background:${G3};`)
  + svg(16,11,cx-8,baseY-26,`<path d="M4 10 Q2.5 7 4.5 5 Q6.5 3 5 1 M11 10 Q9.5 7 11.5 5 Q13.5 3 12 1" stroke="${G3}" stroke-width="1.6" fill="none" stroke-linecap="round"></path>`);
// drinking glass
const glass = (cx,baseY) =>
  d(`left:${cx-8}px; top:${baseY-20}px; width:16px; height:20px; border-radius:2px 2px 5px 5px; background:rgba(200,215,229,0.4); box-shadow:inset 0 0 0 1.6px ${G3};`)
  + d(`left:${cx-6}px; top:${baseY-11}px; width:12px; height:9px; border-radius:0 0 4px 4px; background:#C8D7E5;`);
// candle w/ warm flame
const candle = (cx,baseY,h=26,gold=true) =>
  (gold? glow(cx,baseY-h-7,15,0.5):'')
  + d(`left:${cx-6}px; top:${baseY-h}px; width:12px; height:${h}px; border-radius:3px 3px 2px 2px; background:${CARD}; box-shadow:inset 0 0 0 1.2px rgba(0,0,0,0.06);`)
  + d(`left:${cx-0.8}px; top:${baseY-h-4}px; width:1.6px; height:4px; background:${G4};`)
  + d(`left:${cx-3}px; top:${baseY-h-12}px; width:6px; height:9px; border-radius:50% 50% 50% 50% / 62% 62% 38% 38%; background:${GOLD2};`);
// sealed envelope
const envelope = (cx,cy,w=64,gold=true) => {
  const h=Math.round(w*0.62);
  return cs(cx,cy+h/2+2,w+6,0.08)
  + d(`left:${cx-w/2}px; top:${cy-h/2}px; width:${w}px; height:${h}px; border-radius:5px; background:${CARD}; box-shadow:0 0 0 1px rgba(0,0,0,0.07), 0 5px 12px rgba(40,38,32,0.12);`)
  + svg(w,h,cx-w/2,cy-h/2,`<path d="M2 4 L${w/2} ${h/2+3} L${w-2} 4" fill="none" stroke="${G3}" stroke-width="2" stroke-linejoin="round"></path>`)
  + (gold? d(`left:${cx-6}px; top:${cy-3}px; width:12px; height:12px; border-radius:50%; background:${GOLD2}; box-shadow:0 0 0 2.5px rgba(226,186,120,0.35);`):'');
};
// checklist card w/ n rows, k gold-checked
const listCard = (x,y,w,h,n=3,k=1) => {
  let rows='';
  const rh=(h-20)/n;
  for(let i=0;i<n;i++){
    const ry=y+12+i*rh;
    rows += i<k
      ? svg(10,9,x+10,ry,`<path d="M1.5 4.5l2.6 2.6 4.4-5.4" stroke="${GOLD2}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>`)
      : d(`left:${x+10}px; top:${ry+1}px; width:7px; height:7px; border-radius:50%; box-shadow:inset 0 0 0 1.8px ${G3};`);
    rows += d(`left:${x+24}px; top:${ry+2.5}px; width:${w-24-14-(i%2)*10}px; height:3.5px; border-radius:2px; background:${i<k?G3:G2};`);
  }
  return d(`left:${x}px; top:${y}px; width:${w}px; height:${h}px; border-radius:9px; background:${CARD}; box-shadow:0 0 0 1px rgba(0,0,0,0.07), 0 6px 14px rgba(40,38,32,0.12);`) + rows;
};
// pencil, angled
const pencil = (x,y,len=44,ang=-32) =>
  d(`left:${x}px; top:${y}px; width:${len}px; height:7px; border-radius:2px; background:${GOLD}; transform:rotate(${ang}deg); transform-origin:left center; box-shadow:inset 0 -1.5px 0 rgba(0,0,0,0.08);`)
  + d(`left:${x}px; top:${y}px; width:9px; height:7px; border-radius:2px 0 0 2px; background:${G3}; transform:rotate(${ang}deg) translateX(${len-9}px); transform-origin:left center;`)
  + d(`left:${x}px; top:${y+0.5}px; width:7px; height:6px; background:${INK}; clip-path:polygon(0 50%, 100% 0, 100% 100%); transform:rotate(${ang}deg) translateX(-6.5px); transform-origin:left center;`);
// kitchen timer w/ gold wedge (minutes m of 60)
const timer = (cx,cy,r=26,frac=0.33) => {
  const angle = frac*360;
  return cs(cx,cy+r+4,2*r+8,0.09)
  + d(`left:${cx-r}px; top:${cy-r}px; width:${2*r}px; height:${2*r}px; border-radius:50%; background:${PAPER}; box-shadow:inset 0 0 0 2.6px ${INK}, 0 4px 9px rgba(40,38,32,0.14);`)
  + d(`left:${cx-r+5}px; top:${cy-r+5}px; width:${2*(r-5)}px; height:${2*(r-5)}px; border-radius:50%; background:conic-gradient(${GOLD} 0deg ${angle}deg, rgba(0,0,0,0) ${angle}deg 360deg);`)
  + d(`left:${cx-1.4}px; top:${cy-r+5}px; width:2.8px; height:${r-5}px; border-radius:1.5px; background:${INK}; transform:rotate(${angle}deg); transform-origin:bottom center;`)
  + d(`left:${cx-2.5}px; top:${cy-2.5}px; width:5px; height:5px; border-radius:50%; background:${INK};`)
  + d(`left:${cx-5}px; top:${cy-r-7}px; width:10px; height:6px; border-radius:3px 3px 0 0; background:${GOLD2};`);
};
// dark phone face-down on surface
const phoneFlat = (cx,baseY,w=40) =>
  cs(cx,baseY-1,w+10,0.09)
  + d(`left:${cx-w/2}px; top:${baseY-9}px; width:${w}px; height:9px; border-radius:4px; background:${NIGHT}; box-shadow:0 0 0 1.6px #2A2E35;`)
  + d(`left:${cx-6}px; top:${baseY-6.5}px; width:12px; height:2.5px; border-radius:1px; background:rgba(190,205,220,0.28);`);
// wall shelf
const shelf = (cx,y,w=76) =>
  d(`left:${cx-w/2}px; top:${y}px; width:${w}px; height:7px; border-radius:3.5px; background:${G2};`)
  + d(`left:${cx-w/2+8}px; top:${y+7}px; width:5px; height:12px; background:${G3}; clip-path:polygon(0 0, 100% 0, 60% 100%, 0 100%);`)
  + d(`left:${cx+w/2-13}px; top:${y+7}px; width:5px; height:12px; background:${G3}; clip-path:polygon(0 0, 100% 0, 100% 100%, 40% 100%);`);
// speech bubble
const bubble = (cx,cy,w=44,h=26,tail='left',tone=CARD,lines=2) => {
  let ls='';
  for(let i=0;i<lines;i++) ls += d(`left:${cx-w/2+9}px; top:${cy-h/2+8+i*7}px; width:${w-22-(i%2)*8}px; height:3px; border-radius:1.5px; background:${G3};`);
  const tx = tail==='left'? cx-w/2+10 : cx+w/2-18;
  return d(`left:${cx-w/2}px; top:${cy-h/2}px; width:${w}px; height:${h}px; border-radius:11px; background:${tone}; box-shadow:0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.10);`)
  + d(`left:${tx}px; top:${cy+h/2-1.5}px; width:9px; height:8px; background:${tone}; clip-path:polygon(0 0, 100% 0, ${tail==='left'?20:80}% 100%);`)
  + ls;
};
// armchair side view facing right
const armchair = (cx,baseY,tone=G2) =>
  cs(cx,baseY-1,74,0.09)
  + d(`left:${cx-30}px; top:${baseY-58}px; width:16px; height:44px; border-radius:8px 6px 4px 4px; background:${tone};`)
  + d(`left:${cx-26}px; top:${baseY-30}px; width:52px; height:18px; border-radius:6px 10px 4px 4px; background:${tone}; box-shadow:inset 0 3px 0 rgba(255,255,255,0.35);`)
  + d(`left:${cx+18}px; top:${baseY-36}px; width:12px; height:24px; border-radius:6px 6px 4px 4px; background:${tone};`)
  + d(`left:${cx-24}px; top:${baseY-12}px; width:6px; height:11px; border-radius:0 0 3px 3px; background:${G4};`)
  + d(`left:${cx+18}px; top:${baseY-12}px; width:6px; height:11px; border-radius:0 0 3px 3px; background:${G4};`);
// potted plant (upright, healthy). droop=true for wilting
const plant = (cx,baseY,s=1,droop=false) => {
  const leaf=(dx,dy,w,h,rot,tone)=>d(`left:${cx+dx}px; top:${baseY+dy}px; width:${w*s}px; height:${h*s}px; border-radius:50% 50% 46% 46% / 66% 66% 34% 34%; background:${tone}; transform:rotate(${rot}deg);`);
  return cs(cx,baseY-1,40*s,0.08)
  + d(`left:${cx-14*s}px; top:${baseY-22*s}px; width:${28*s}px; height:${22*s}px; background:${G2}; clip-path:polygon(6% 0, 94% 0, 82% 100%, 18% 100%);`)
  + d(`left:${cx-17*s}px; top:${baseY-26*s}px; width:${34*s}px; height:${6*s}px; border-radius:3px; background:${G4};`)
  + d(`left:${cx-1.5*s}px; top:${baseY-46*s}px; width:${3*s}px; height:${22*s}px; border-radius:1.5px; background:#A9AF9E;`)
  + (droop
    ? leaf(-13*s,-46*s,12,16,-62,'#BEC4B4') + leaf(2*s,-48*s,12,17,58,'#C9CEC1') + leaf(-5*s,-40*s,10,13,110,'#CDD2C5')
    : leaf(-12*s,-56*s,12,17,-28,'#BEC4B4') + leaf(1*s,-58*s,12,19,24,'#C9CEC1') + leaf(-5.5*s,-62*s,11,15,-2,'#D3D7CB'));
};
// small crescent moon (clean two-circle mask)
const moon = (cx,cy,r=9,tone='#C5C4BD') =>
  d(`left:${cx-r}px; top:${cy-r}px; width:${2*r}px; height:${2*r}px; border-radius:50%; background:${tone}; -webkit-mask:radial-gradient(circle at ${r*1.7}px ${r*0.62}px, transparent ${r*0.78}px, #000 ${r*0.82}px); mask:radial-gradient(circle at ${r*1.7}px ${r*0.62}px, transparent ${r*0.78}px, #000 ${r*0.82}px);`);
return {R,groundW,hillsW,waterW,pathW,book,bowl,glass,candle,envelope,listCard,pencil,timer,phoneFlat,shelf,bubble,armchair,plant,moon};
})();
