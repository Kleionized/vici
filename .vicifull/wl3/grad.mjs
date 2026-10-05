import fs from 'node:fs';
function load(f,n){let s=fs.readFileSync(f,'utf8');const i=s.indexOf(`export const ${n}`);const j=s.indexOf('= {',i);let k=j+2,d=0;for(;k<s.length;k++){if(s[k]==='{')d++;else if(s[k]==='}'){d--;if(!d){k++;break;}}}return JSON.parse(s.slice(j+2,k));}
const T=load('src/content/taskScenes.ts','TASK_SCENES'), L=load('src/content/lessonPlates.ts','LESSON_PLATES');
const bad=[]; const angles=new Set(); const masks=[]; const rad=new Set();
function walk(ls,w){for(const l of ls||[]){if(l.kind==='svg')continue;if(l.children?.length){walk(l.children,w);continue;}
 const b=l.background; if(!b) continue;
 if(/conic/.test(b)) continue;
 if(!/gradient\(/.test(b)) continue;
 const inner=b.slice(b.indexOf('(')+1,b.lastIndexOf(')'));
 const chunks=[];let d=0,c='';for(const ch of inner){if(ch==='(')d++;if(ch===')')d--;if(ch===','&&d===0){chunks.push(c);c='';}else c+=ch;}chunks.push(c);
 const stops=chunks.map(s=>s.trim()).filter(s=>!/^(closest-side|farthest-side|closest-corner|farthest-corner|circle|ellipse|from|at |to |[0-9.]+deg)/.test(s));
 const noPos=stops.filter(s=>!/\s[0-9.]+%$/.test(s)).length;
 if(stops.length>2&&noPos>1) bad.push(w+' :: '+b);
 if(/linear/.test(b)) angles.add((b.match(/\(\s*(-?[\d.]+)deg/)||[])[1]??'none');
 if(/radial/.test(b)) rad.add(b.match(/radial-gradient\(([^,]*)/)[1].trim());
}}
for(const [k,v] of Object.entries(T)) walk(v,'task'+k);
for(const [k,v] of Object.entries(L)) walk(v,'plate'+k);
console.log('gradients with >2 stops and >1 unpositioned:',bad.length); bad.slice(0,8).forEach(s=>console.log('  '+s));
console.log('linear angles seen:',[...angles].join(', '));
console.log('radial size/shape keywords seen:',[...rad].join(' | '));
