/* Walk the two generated corpora and count the shapes the renderer keys on. */
import fs from 'node:fs';
function load(file, name) {
  let src = fs.readFileSync(file,'utf8');
  const i = src.indexOf(`export const ${name}`);
  const j = src.indexOf('= {', i);
  let k = j+2, depth=0;
  for (; k<src.length; k++){ if(src[k]==='{')depth++; else if(src[k]==='}'){depth--; if(!depth){k++;break;}} }
  return JSON.parse(src.slice(j+2,k));
}
const T = load('src/content/taskScenes.ts','TASK_SCENES');
const L = load('src/content/lessonPlates.ts','LESSON_PLATES');
const stats={noBgWithShadow:0,noBgNoShadow:0,borders:0,bordersSized:[],castWithSpread:[],plainOffsetNoBlurNoSpread:[],clipWithShadow:[],insets:0,insetsOffset:0,radiiScaled:0,blurLayers:0,groups:0,total:0, radiusFrac:0};
function walk(layers, where){
  for(const l of layers||[]){
    if(l.kind==='svg') continue;
    stats.total++;
    if(l.children?.length){stats.groups++; walk(l.children, where); continue;}
    const w=l.width??0,h=l.height??0;
    if(l.borders){stats.borders++; if(w||h) stats.bordersSized.push(where+' '+JSON.stringify({w,h,b:l.borders}));}
    if(!l.background){ if(l.shadow) stats.noBgWithShadow++; else stats.noBgNoShadow++; }
    if(l.blur) stats.blurLayers++;
    if(l.shadow){
      for(const part of l.shadow.split(/,(?![^(]*\))/)){
        const t=part.trim(); if(!t) continue;
        const ink=t.match(/rgba?\([^)]*\)|#[0-9A-Fa-f]{3,8}/); if(!ink) continue;
        const n=[...t.replace(ink[0],'').matchAll(/-?[\d.]+/g)].map(m=>Number(m[0]));
        if(n.length<3) continue;
        const [dx,dy,blur,spread=0]=n;
        if(t.startsWith('inset')){stats.insets++; if(dx||dy)stats.insetsOffset++; continue;}
        if(blur&&spread) stats.castWithSpread.push(where+' '+t);
        if(!blur&&!spread&&(dx||dy)) stats.plainOffsetNoBlurNoSpread.push(where+' '+t);
        if(l.clip) stats.clipWithShadow.push(where+' clip+'+t);
      }
    }
  }
}
for(const [k,v] of Object.entries(T)) walk(v,'task'+k);
for(const [k,v] of Object.entries(L)) walk(v,'plate'+k);
console.log(JSON.stringify({...stats,
  bordersSized:stats.bordersSized.slice(0,10),
  castWithSpread:stats.castWithSpread.slice(0,12),
  plainOffsetNoBlurNoSpread:stats.plainOffsetNoBlurNoSpread.slice(0,12),
  clipWithShadow:stats.clipWithShadow.slice(0,12)},null,1));
console.log('counts: bordersSized',stats.bordersSized.length,'castWithSpread',stats.castWithSpread.length,'plainOffset',stats.plainOffsetNoBlurNoSpread.length,'clipWithShadow',stats.clipWithShadow.length);
