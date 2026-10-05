import fs from 'fs';
const files = fs.readdirSync('.').filter(f=>/^SOS-.*\.txt$/.test(f));
const templ = {};
for (const f of files) {
  const L = fs.readFileSync(f,'utf8').split('\n');
  // normalise: drop text lines and lines deeper than svg children
  const shape = [];
  const texts = [];
  let inSvg=false, svgIndent=-1;
  for (const l of L) {
    if(!l.trim()) continue;
    const ind = l.match(/^ */)[0].length;
    if (inSvg && ind<=svgIndent) inSvg=false;
    if (l.trim().startsWith('·')) { texts.push(l.trim().slice(2)); continue; }
    if (inSvg) continue;
    if (l.trim().startsWith('<svg>') && ind===2) { inSvg=true; svgIndent=ind; }
    shape.push(l);
  }
  const key = shape.join('\n');
  (templ[key] ||= []).push([f, texts]);
}
let i=0;
for (const [k,v] of Object.entries(templ)) {
  console.log(`##### TEMPLATE ${++i} (${v.length})`);
  console.log(k);
  for (const [f,t] of v) console.log('  ', f, JSON.stringify(t));
}
