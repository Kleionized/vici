import fs from 'fs';
const rd = (f) => fs.readFileSync(`.overhaul/final/Email-Login/${f}.html`, 'utf8');
// 365
let seed = 7; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
const gen365 = []; let dark = 0;
for (let i = 0; i < 365; i++) { const isDark = dark < 110 && rnd() < 0.31; if (isDark) dark++; gen365.push(isDark); }
const h365 = rd('Cost-Next-365');
const circ365 = [...h365.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="(4.4|2.4)"/g)].map(m => +m[3] === 4.4);
console.log('365 frame circles', circ365.length, 'dark', circ365.filter(Boolean).length, 'match', JSON.stringify(circ365) === JSON.stringify(gen365));
// age80
seed = 3; const gen80 = [];
for (let r = 0; r < 71; r++) for (let c = 0; c < 33; c++) gen80.push(rnd() < 0.3);
const h80 = rd('Cost-By-Age-80');
const circ80 = [...h80.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="(2.6|1.6)"/g)].map(m => +m[3] === 2.6);
console.log('80 frame circles', circ80.length, 'bright', circ80.filter(Boolean).length, 'match', JSON.stringify(circ80) === JSON.stringify(gen80));
// 30
const h30 = rd('Cost-Next-30');
const c30 = [...h30.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)" fill="([^"]+)" stroke="[^"]+" stroke-width="([\d.]+)"/g)].map((m,i) => m[4]==='#0D0D0D' ? i : -1).filter(i=>i>=0);
console.log('30 relapse idx', c30);
