/* pass-1 stopcheck semantics, reconstructed, to audit what the tightened tool dropped. */
import fs from 'node:fs'; import path from 'node:path';
const files=[];(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?walk(p):/\.tsx$/.test(e.name)&&files.push(p);} })('src');
const hits=[];
for(const f of files){const lines=fs.readFileSync(f,'utf8').split('\n');
 for(let i=0;i<lines.length;i++){
  const m=/stopColor="(#[0-9A-Fa-f]{3,8})"[^/>]*stopOpacity=(?:\{0|"0)/.exec(lines[i]); if(!m)continue;
  for(let j=i-1;j>=Math.max(0,i-4);j--){const p=/stopColor="(#[0-9A-Fa-f]{3,8})"/.exec(lines[j]); if(!p)continue;
   if(p[1].toLowerCase()!==m[1].toLowerCase())hits.push(`${f}:${i+1}  ${p[1]} -> ${m[1]}   [${lines[i].trim().slice(0,90)}]`); break;}}}
console.log(hits.join('\n')); console.log('--- '+hits.length);
