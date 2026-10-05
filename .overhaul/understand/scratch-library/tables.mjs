import fs from 'node:fs';
const covers = fs.readFileSync('.overhaul/understand/scratch-library/covers.txt','utf8').split('\n').filter(l=>/^Week-\d\d/.test(l));
const libIds = {}; 
for (const f of fs.readdirSync('.overhaul/final/Lesson-Illustrations-v4').filter(f=>f.endsWith('.html')&&!f.startsWith('_'))) { const h=fs.readFileSync('.overhaul/final/Lesson-Illustrations-v4/'+f,'utf8'); libIds[f]=h.match(/id="(\w+)"/)[1]; }
const per = {};
for (const l of covers) { const [b,f,m,top]=l.split(' '); const n=+f.match(/L(\d+)/)[1]; const k=+f.match(/Frame-(\d+)/)[1]; const file=m.replace('LIB:',''); (per[n]=per[n]||[]).push({k, id:libIds[file], file, top:top.replace('top=','')}); }
// titles
const t = fs.readFileSync('/dev/stdin','utf8');
const titles = {}; for (const line of t.split('\n')) { const m=line.match(/^\s*(\d+) = "([^"]*)"/); if(m) titles[+m[1]]=m[2]; }
const roman=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const frameCount = {};
for (const b of fs.readdirSync('.overhaul/final').filter(b=>/^Week-\d\d/.test(b))) for (const f of fs.readdirSync('.overhaul/final/'+b)) { const m=f.match(/^L(\d+)-Frame-(\d+)\.html$/); if(m){ const n=+m[1]; frameCount[n]=Math.max(frameCount[n]||0, +m[2]); } }
console.log('| L | Wk | title (new) | frames | cover hero (F1) | cover svg top | other illustrated frames |');
console.log('|---|---|---|---|---|---|---|');
for (let n=1;n<=84;n++){ const a=(per[n]||[]).sort((x,y)=>x.k-y.k); const c=a.find(x=>x.k===1); const others=a.filter(x=>x.k!==1).map(x=>`F${x.k} ${x.id}`).join(', '); console.log(`| ${n} | ${roman[Math.ceil(n/7)-1]} | ${titles[n]} | ${frameCount[n]} | \`${c.id}\` (${c.file.replace('.html','')}) | ${c.top} | ${others} |`); }
