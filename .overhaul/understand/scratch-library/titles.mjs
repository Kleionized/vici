import fs from 'node:fs'; import path from 'node:path';
import { parse } from '../../../scripts/overhaul/decl.mjs';
const FINAL='.overhaul/final';
// week frames
const weekTitles = {}; const weekMeta={};
for (const f of fs.readdirSync(path.join(FINAL,'Email-Login')).filter(f=>/^Week-[IVX]+-.*\.html$/.test(f))) {
  const rows=parse(fs.readFileSync(path.join(FINAL,'Email-Login',f),'utf8'));
  const texts=rows.filter(r=>r.tag==='#text').map(r=>r.text);
  // rows: number text (two digit) then title
  const w = texts[texts.findIndex(t=>/^Week [IVX]+$/.test(t))];
  const name = texts[texts.indexOf(w)+1]; const blurb=texts[texts.indexOf(w)+2];
  weekMeta[w]={name,blurb};
  const isP2=/-P2\.html$/.test(f);
  const rowTitles=[];
  // find spans with flex:1
  rows.forEach((r,i)=>{ if(r.tag==='span' && r.decls.flex==='1' && r.decls['font-size']==='15px'){ rowTitles.push(rows[i+1].text);} });
  weekTitles[w]=weekTitles[w]||{}; weekTitles[w][isP2?'p2':'p1']=rowTitles;
}
const roman=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const all=[]; roman.forEach(r=>{const t=weekTitles['Week '+r]; all.push(...t.p1,...t.p2);});
// covers
const covers={};
for (const b of fs.readdirSync(FINAL).filter(b=>/^Week-\d\d/.test(b))) {
  for (const f of fs.readdirSync(path.join(FINAL,b)).filter(f=>/^L\d+-Frame-1\.html$/.test(f))) {
    const n=+f.match(/\d+/)[0];
    const rows=parse(fs.readFileSync(path.join(FINAL,b,f),'utf8'));
    const texts=rows.filter(r=>r.tag==='#text').map(r=>r.text).filter(t=>t!=='9:41');
    covers[n]={texts, bundle:b};
  }
}
// old curriculum titles
const cur=fs.readFileSync('src/content/curriculum84.ts','utf8');
const old={}; for (const m of cur.matchAll(/day: (\d+),\n\s+week: \d+,\n\s+title: "([^"]*)"/g)) old[+m[1]]=m[2];
let mism=0;
for (let i=1;i<=84;i++){
  const wt=all[i-1]; const c=covers[i]; const ct=c? c.texts[c.texts.findIndex(t=>/^Lesson \d+$/.test(t))+1]:'(none)';
  const lessonLabel = c? c.texts.find(t=>/^Lesson \d+$/.test(t)) : '';
  const same = wt===ct;
  if(!same) mism++;
  console.log(String(i).padStart(2), same?'=':'≠', JSON.stringify(wt), same?'':JSON.stringify(ct), '| old:', JSON.stringify(old[i]), '| cover texts:', JSON.stringify(c?.texts));
}
console.log('mismatches', mism);
console.log(JSON.stringify(weekMeta,null,1));
