import fs from 'node:fs';
const src=fs.readFileSync('src/content/sosResponses.ts','utf8');
const m=src.match(/\{[\s\S]*\}/); // whole object literal
const objs=[...src.matchAll(/^  "([^"]+)": (\{.*\}),$/gm)];
const feat=l=>{const f=[];
  f.push('bg:'+(l.bg?l.bg.kind:'none'));
  if(l.radius)f.push('rad:'+l.radius.kind+(l.radius.kind==='elliptic'?':'+JSON.stringify(l.radius.v):''));
  if(l.blur)f.push('blur:'+(l.bg?l.bg.kind:'none'));
  if(l.shadow)f.push('shadow:'+(/inset/.test(l.shadow)?'inset':'drop')+(l.bg?'+bg':'+nobg'));
  if(l.transform)f.push('transform');
  if(l.tri)f.push('tri');
  if(l.border)f.push('border');
  if(l.opacity!=null)f.push('opacity');
  return f;};
const D038=new Set(['SOS-Loc-Bathroom','SOS-Loc-Home-Alone','SOS-Trig-Rejection']);
const reachable=new Set(), unreach=new Map();
for(const [,k,json] of objs){ const o=JSON.parse(json);
  for(const l of (o.layers??[])) for(const f of feat(l)){ if(D038.has(k)){ if(!unreach.has(f))unreach.set(f,[]); unreach.get(f).push(k);} else reachable.add(f);} }
console.log('features only on the three D038 boards:');
let any=false;
for(const [f,ks] of unreach) if(!reachable.has(f)){any=true;console.log('  '+f+'  <- '+[...new Set(ks)].join(', '));}
if(!any) console.log('  (none — every layer feature on those three is drawn on a board that was captured)');
console.log('\nall features seen on reachable boards: '+[...reachable].sort().join(' | '));
