import fs from 'node:fs';
function load(f,n){let s=fs.readFileSync(f,'utf8');const i=s.indexOf(`export const ${n}`);const j=s.indexOf('= {',i);let k=j+2,d=0;for(;k<s.length;k++){if(s[k]==='{')d++;else if(s[k]==='}'){d--;if(!d){k++;break;}}}return JSON.parse(s.slice(j+2,k));}
const T=load('src/content/taskScenes.ts','TASK_SCENES'), L=load('src/content/lessonPlates.ts','LESSON_PLATES');
let fracH=0,fracW=0,fracL=0,fracT=0,tot=0,h35=0; const days=new Set();
function walk(ls,w){for(const l of ls||[]){if(l.kind==='svg')continue;if(l.children?.length){walk(l.children,w);continue;}tot++;
 const fr=v=>v!=null&&Math.abs(v-Math.round(v))>1e-9;
 let any=false;
 if(fr(l.height)){fracH++;any=true;} if(fr(l.width)){fracW++;any=true;}
 if(fr(l.left)){fracL++;any=true;} if(fr(l.top)){fracT++;any=true;}
 if(l.height===3.5)h35++;
 if(any)days.add(w);
}}
for(const [k,v] of Object.entries(T)) walk(v,'task'+k);
for(const [k,v] of Object.entries(L)) walk(v,'plate'+k);
console.log({tot,fracH,fracW,fracL,fracT,h35,scenesTouched:days.size});
