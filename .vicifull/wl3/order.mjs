import fs from 'node:fs';
function load(file,name){let s=fs.readFileSync(file,'utf8');const i=s.indexOf(`export const ${name}`);const j=s.indexOf('= {',i);let k=j+2,d=0;for(;k<s.length;k++){if(s[k]==='{')d++;else if(s[k]==='}'){d--;if(!d){k++;break;}}}return JSON.parse(s.slice(j+2,k));}
const T=load('src/content/taskScenes.ts','TASK_SCENES'), L=load('src/content/lessonPlates.ts','LESSON_PLATES');
let castBeforeRing=[],multiCast=[],multiRing=[],insetBeforeOuter=[],multiInset=[],blurAndInsetSameLayer=0;
function walk(ls,w){for(const l of ls||[]){if(l.kind==='svg')continue;if(l.children?.length){walk(l.children,w);continue;}
 if(!l.shadow)continue;
 const parts=l.shadow.split(/,(?![^(]*\))/).map(s=>s.trim()).filter(Boolean);
 const kinds=[];
 for(const t of parts){const ink=t.match(/rgba?\([^)]*\)|#[0-9A-Fa-f]{3,8}/);if(!ink)continue;
  const n=[...t.replace(ink[0],'').matchAll(/-?[\d.]+/g)].map(m=>Number(m[0]));if(n.length<3)continue;
  const [dx,dy,blur,spread=0]=n;
  kinds.push(t.startsWith('inset')?'inset':blur?'cast':spread?'ring':'none');}
 const ci=kinds.indexOf('cast'), ri=kinds.indexOf('ring');
 if(ci>=0&&ri>=0&&ci<ri) castBeforeRing.push(w+' :: '+l.shadow);
 if(kinds.filter(k=>k==='cast').length>1) multiCast.push(w+' :: '+l.shadow);
 if(kinds.filter(k=>k==='ring').length>1) multiRing.push(w+' :: '+l.shadow);
 if(kinds.filter(k=>k==='inset').length>1) multiInset.push(w+' :: '+l.shadow);
 const ii=kinds.indexOf('inset'); const oi=kinds.findIndex(k=>k==='cast'||k==='ring');
 if(ii>=0&&oi>=0&&ii<oi) insetBeforeOuter.push(w+' :: '+l.shadow);
 if(l.blur&&kinds.includes('inset')) blurAndInsetSameLayer++;
}}
for(const [k,v] of Object.entries(T)) walk(v,'task'+k);
for(const [k,v] of Object.entries(L)) walk(v,'plate'+k);
const p=(n,a)=>{console.log(`${n}: ${a.length}`); a.slice(0,6).forEach(s=>console.log('   '+s));};
p('cast listed before ring (code draws ring on top regardless)',castBeforeRing);
p('two or more casts on one layer',multiCast);
p('two or more rings on one layer',multiRing);
p('two or more insets on one layer',multiInset);
p('inset listed before an outer part',insetBeforeOuter);
console.log('layers with filter:blur AND an inset shadow:',blurAndInsetSameLayer);
