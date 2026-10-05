/* Every text-bearing signature row, design vs app, matched on the text itself.
   Reports box/type differences. Excludes nothing. */
import fs from 'node:fs';
const rows = (f) => fs.readFileSync(f,'utf8').split('\n').filter(Boolean).map(l=>l.split(' | ').map(s=>s.trim())).filter(r=>r[10] && r[10]!=='-');
let bad = 0, n = 0;
for (let i=1;i<=12;i++) for (const s of ['','p2']) {
  const D = rows(`.overhaul/sig/r-weeks-d-${i}${s}.txt`), A = rows(`.overhaul/sig/r-weeks-a-${i}${s}.txt`);
  const pool = A.slice();
  for (const d of D) {
    n++;
    const j = pool.findIndex(a=>a[10]===d[10] && Math.abs(+a[2]-+d[2])<2);
    if (j<0) { console.log(`w${i}${s} NO MATCH: ${d[10]}`); bad++; continue; }
    const a = pool.splice(j,1)[0];
    const diffs=[];
    for (const k of [1,2,3,4]) if (Math.abs(+a[k]-+d[k])>=0.25) diffs.push(`${['','x','y','w','h'][k]} ${d[k]}→${a[k]}`);
    if (a[9]!==d[9]) diffs.push(`type ${d[9]}→${a[9]}`);
    if (diffs.length) { console.log(`w${i}${s} "${d[10]}": ${diffs.join('  ')}`); bad++; }
  }
}
console.log(`--- ${n} design text rows compared, ${bad} with a difference`);
