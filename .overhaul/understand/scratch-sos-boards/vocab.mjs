import fs from 'fs';
const files = fs.readdirSync('.').filter(f=>/^SOS-.*\.txt$/.test(f));
const tags = {}, attrs = {}, colors = {}, gx = {};
for (const f of files) {
  const L = fs.readFileSync(f,'utf8').split('\n');
  let inSvg=false, svgIndent=-1;
  for (const l of L) {
    if(!l.trim()) continue;
    const ind = l.match(/^ */)[0].length;
    if (inSvg && ind<=svgIndent) inSvg=false;
    if (l.trim().startsWith('<svg>') && ind===2) { inSvg=true; svgIndent=ind; continue; }
    if (!inSvg) continue;
    const m = l.trim().match(/^<(\w+)>/); if(!m) continue;
    const t=m[1]; tags[t]=(tags[t]||0)+1;
    for (const a of l.matchAll(/([\w-]+)="([^"]*)"/g)) { attrs[t+'.'+a[1]]=(attrs[t+'.'+a[1]]||0)+1; if (/fill|stroke$|stop-color/.test(a[1])) colors[a[2]]=(colors[a[2]]||0)+1; if(t==='g'&&a[1]==='transform') (gx[a[2]] ||= []).push(f.replace('.txt','')); }
    for (const a of l.matchAll(/  ([\w-]+):([^ ]+(?: [^ :]+)*)/g)) attrs[t+'.css.'+a[1]]=(attrs[t+'.css.'+a[1]]||0)+1;
  }
}
console.log(tags); console.log(attrs); console.log(colors); console.log(gx);
