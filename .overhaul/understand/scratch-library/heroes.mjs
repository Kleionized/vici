// Map every hero (week pages, lesson covers, any 393x240 art) to its Lesson-Illustrations-v4 source.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../../../scripts/overhaul/decl.mjs';
const FINAL = '.overhaul/final';
const SVG_ATTRS = ['viewBox','width','height','x','y','cx','cy','r','rx','ry','x1','y1','x2','y2','points','d','fill','fill-opacity','fill-rule','opacity','stroke','stroke-width','stroke-opacity','stroke-linecap','stroke-linejoin','stroke-dasharray','transform'];
// returns array of {svgDecls, attrs, body:string} for each 393x240 svg (top-level hero svgs)
function heroes(file) {
  const rows = parse(fs.readFileSync(file,'utf8'));
  const res = [];
  for (let i=0;i<rows.length;i++){
    const r=rows[i];
    if (r.tag==='svg' && r.attrs.viewBox==='0 0 393 240') {
      const lines=[];
      for (let j=i+1;j<rows.length && rows[j].depth>r.depth;j++){
        const c=rows[j]; if (c.tag==='#text') continue;
        lines.push(' '.repeat(c.depth-r.depth)+c.tag+' '+SVG_ATTRS.filter(k=>c.attrs[k]!=null).map(k=>`${k}=${c.attrs[k]}`).join(' '));
      }
      // ancestor chain transform/scale?
      let anc=[]; for (let k=i-1, d=r.depth;k>=0;k--){ if (rows[k].depth<d){ d=rows[k].depth; if (rows[k].decls.transform) anc.push(rows[k].decls.transform);} }
      res.push({decls:r.decls, body:lines.join('\n'), anc});
    }
  }
  return res;
}
const norm = s => s.replace(/^ +/gm, m=>m); // keep
// illustration library: first 393x240 svg in each card is the current art
const lib = {};
const libDir = path.join(FINAL,'Lesson-Illustrations-v4');
for (const f of fs.readdirSync(libDir).filter(f=>f.endsWith('.html') && !f.startsWith('_'))) {
  const html = fs.readFileSync(path.join(libDir,f),'utf8');
  const id = (html.match(/id="(\w+)"/)||[])[1];
  const uses = (html.match(/· (\d+) uses?/)||html.match(/(\d+) uses?/)||[])[1];
  const hs = heroes(path.join(libDir,f));
  lib[f] = { id, uses, art: hs[0]?.body, before: hs[1]?.body };
}
const byBody = new Map();
for (const [f,v] of Object.entries(lib)) { if (v.art) byBody.set(v.art, f); }
const byBefore = new Map();
for (const [f,v] of Object.entries(lib)) { if (v.before) byBefore.set(v.before, f); }
function match(body){
  if (byBody.has(body)) return 'LIB:'+byBody.get(body);
  if (byBefore.has(body)) return 'BEFORE:'+byBefore.get(body);
  // try ignoring outer translate group
  return null;
}
const mode = process.argv[2];
if (mode==='lib') { for (const [f,v] of Object.entries(lib)) console.log(f, v.id, v.uses, v.art? v.art.split('\n').length:0, v.before? 'before':'' ); }
if (mode==='weeks') {
  for (const f of fs.readdirSync(path.join(FINAL,'Email-Login')).filter(f=>/^Week-[IVX]+-/.test(f))) {
    const hs = heroes(path.join(FINAL,'Email-Login',f));
    console.log(f, hs.map(h=>`${match(h.body)} top=${h.decls.top}`).join(' | '));
  }
}
if (mode==='covers') {
  const bundles = fs.readdirSync(FINAL).filter(b=>/^Week-\d\d/.test(b)).sort();
  const unmatched = new Map();
  for (const b of bundles) {
    const files = fs.readdirSync(path.join(FINAL,b)).filter(f=>/^L\d+-Frame-\d+\.html$/.test(f));
    files.sort((a,c)=>{const [x1,y1]=a.match(/\d+/g).map(Number);const [x2,y2]=c.match(/\d+/g).map(Number);return x1-x2||y1-y2;});
    for (const f of files) {
      const hs = heroes(path.join(FINAL,b,f));
      if (!hs.length) continue;
      const out = hs.map(h=>{ const m=match(h.body); if(!m){ const k=h.body; if(!unmatched.has(k)) unmatched.set(k,[]); unmatched.get(k).push(b+'/'+f);} return `${m||'??'} top=${h.decls.top}`; });
      console.log(b, f, out.join(' | '));
    }
  }
  console.log('UNMATCHED distinct', unmatched.size);
  for (const [k,v] of unmatched) console.log('  ', v.length, v.slice(0,6).join(' '), '\n     ', k.split('\n').slice(0,3).join(' / '));
}
if (mode==='email') {
  for (const f of fs.readdirSync(path.join(FINAL,'Email-Login')).filter(f=>f.endsWith('.html')&&!f.startsWith('_'))) {
    const hs = heroes(path.join(FINAL,'Email-Login',f));
    if (hs.length) console.log(f, hs.map(h=>`${match(h.body)||'??'} top=${h.decls.top} left=${h.decls.left} tf=${h.decls.transform||''} anc=${h.anc.join(';')}`).join(' | '));
  }
}
if (mode==='usage') {
  const use = {};
  const add=(k,where)=>{ (use[k]=use[k]||[]).push(where); };
  for (const b of fs.readdirSync(FINAL).filter(b=>/^Week-\d\d|^Email-Login$/.test(b))) {
    for (const f of fs.readdirSync(path.join(FINAL,b)).filter(f=>f.endsWith('.html')&&!f.startsWith('_'))) {
      for (const h of heroes(path.join(FINAL,b,f))) { const m=match(h.body)||'??'; add(m, (b==='Email-Login'?'':b.slice(5,7)+':')+f.replace('.html','').replace('-Frame-','F')); }
    }
  }
  for (const [f,v] of Object.entries(lib)) { const k='LIB:'+f; const u=use[k]||[]; console.log(f.padEnd(34), v.id.padEnd(13), 'canvas says', String(v.uses).padStart(2), '| found', String(u.length).padStart(2), '|', u.join(' ')); }
  for (const k of Object.keys(use).filter(k=>!k.startsWith('LIB:'))) console.log(k, use[k].join(' '));
}
