import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync('Vici Overhaul/project/gen/src-days.json', 'utf8')).daily;
const items = Array.isArray(d) ? d : Object.values(d);
const first = (s) => { const m = s.match(/^.*?[.!?](?=\s+[A-Z“"]|$)/); return (m ? m[0] : s).replace(/'/g, '’'); };
const out = items.map((x) => ({ day: x.day, s: first(x.practice[0]) }));
out.sort((a, b) => b.s.length - a.s.length);
console.log(out.slice(0, 12).map((x) => `${x.day} (${x.s.length}): ${x.s}`).join('\n'));
console.log('median', out.map((x) => x.s.length).sort((a, b) => a - b)[42], 'old L1', 'Put the device you use for porn out of reach before you sleep.'.length);
