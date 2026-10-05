import fs from 'node:fs'; import path from 'node:path';
import { parse } from '../../../scripts/overhaul/decl.mjs';
const SVG_ATTRS = ['viewBox','width','height','x','y','cx','cy','r','rx','ry','x1','y1','x2','y2','points','d','fill','fill-opacity','fill-rule','opacity','stroke','stroke-width','stroke-opacity','stroke-linecap','stroke-linejoin','stroke-dasharray','stroke-dashoffset','offset','stop-color','stop-opacity','gradientUnits','gradientTransform','transform','clip-path','mask','src','alt','id','text-anchor','dominant-baseline','font-size','font-weight','letter-spacing','preserveAspectRatio'];
const missing={};
for (const b of ['Email-Login','Lesson-Illustrations-v4']) for (const f of fs.readdirSync(path.join('.overhaul/final',b)).filter(f=>f.endsWith('.html')&&!f.startsWith('_'))) {
  for (const r of parse(fs.readFileSync(path.join('.overhaul/final',b,f),'utf8'))) {
    if (r.tag==='#text'||!r.attrs) continue;
    for (const k of Object.keys(r.attrs)) if (!SVG_ATTRS.includes(k) && k!=='style' && k!=='xmlns' && k!=='class') { (missing[k]=missing[k]||new Set()).add(b+'/'+f); }
  }
}
for (const [k,v] of Object.entries(missing)) console.log(k, v.size, [...v].filter(x=>/Week-/.test(x)).slice(0,5).join(' '));
