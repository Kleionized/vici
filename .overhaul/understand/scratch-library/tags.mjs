import fs from 'node:fs'; import path from 'node:path';
import { parse } from '../../../scripts/overhaul/decl.mjs';
const dir='.overhaul/final/Lesson-Illustrations-v4';
const tags={}, attrs={}, styled=[];
for (const f of fs.readdirSync(dir).filter(f=>f.endsWith('.html')&&!f.startsWith('_'))) {
  const rows=parse(fs.readFileSync(path.join(dir,f),'utf8'));
  const i=rows.findIndex(r=>r.tag==='svg'&&r.attrs.viewBox==='0 0 393 240');
  const d=rows[i].depth;
  for (let j=i+1;j<rows.length&&rows[j].depth>d;j++){ const r=rows[j]; if(r.tag==='#text') continue; tags[r.tag]=(tags[r.tag]||0)+1; for (const k of Object.keys(r.attrs)) attrs[k]=(attrs[k]||0)+1; if (Object.keys(r.decls).length) styled.push(f+' '+r.tag+' '+JSON.stringify(r.decls)); }
  // svg own decls
  const s=rows[i]; if (s.decls.transform!=='scale(1.1)'||s.decls['transform-origin']!=='196px 190px') console.log('odd svg', f, JSON.stringify(s.decls));
}
console.log(tags); console.log(attrs); console.log(styled.slice(0,20));
