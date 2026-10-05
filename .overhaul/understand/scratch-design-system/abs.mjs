import fs from 'node:fs'; import path from 'node:path';
import { parse } from '../../../scripts/overhaul/decl.mjs';
const DIR='/Users/admin/Documents/Vici/.overhaul/final/Email-Login'; const bag={};
for (const f of fs.readdirSync(DIR).filter(x=>x.endsWith('.html')&&!x.startsWith('_'))) {
  const rows=parse(fs.readFileSync(path.join(DIR,f),'utf8'));
  for (const r of rows) { if (r.depth!==1||r.decls.position!=='absolute') continue; if (r.decls.inset==='0') continue; if (r.decls.height==='54px'&&r.decls.top==='0') continue; if (r.decls.width==='139px') continue;
    const k=['left','right','top','bottom','width','height'].filter(k=>r.decls[k]!=null).map(k=>`${k}:${r.decls[k]}`).join(' ') + ' | ' + ['display','flex-direction','gap','align-items'].filter(k=>r.decls[k]).map(k=>r.decls[k]).join(',') + ' <'+r.tag+'>';
    (bag[k] ||= []).push(f.replace('.html','')); }
}
for (const [k,v] of Object.entries(bag).sort((a,b)=>b[1].length-a[1].length)) if (v.length>=2) console.log(String(v.length).padStart(4), k, '  e.g.', v.slice(0,6).join(' '));
