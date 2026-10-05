import fs from 'node:fs';
import { execSync } from 'node:child_process';
const sub = (file) => {
  const lines = execSync(`node scripts/overhaul/body.mjs "${file}"`).toString().split('\n');
  const i = lines.findIndex((l) => /<svg> viewBox="0 0 393 240"/.test(l));
  if (i < 0) return null;
  const d = lines[i].match(/^ */)[0].length;
  const head = lines[i];
  const kids = [];
  for (let j = i + 1; j < lines.length; j++) { const dd = lines[j].match(/^ */)[0].length; if (dd <= d || !lines[j].trim()) break; kids.push(lines[j].slice(d)); }
  return { head, kids: kids.join('\n') };
};
const lib = {};
for (const f of fs.readdirSync('.overhaul/final/Lesson-Illustrations-v4').filter((f) => f.endsWith('.html') && !f.startsWith('_'))) {
  const s = sub(`.overhaul/final/Lesson-Illustrations-v4/${f}`); if (s) lib[f.replace('.html', '')] = s;
}
for (const f of process.argv.slice(2)) {
  const s = sub(`.overhaul/final/Email-Login/${f}.html`);
  if (!s) { console.log(`${f}: no hero`); continue; }
  const top = s.head.match(/top:(\S+)/)[1], sc = s.head.match(/scale\(([^)]+)\)/)?.[1];
  const exact = Object.entries(lib).filter(([, v]) => v.kids === s.kids).map(([k, v]) => `${k}(lib scale ${v.head.match(/scale\(([^)]+)\)/)?.[1]})`);
  console.log(`${f}: top ${top} scale ${sc} -> ${exact.length ? 'IDENTICAL to ' + exact.join(', ') : 'no identical lib entry'}`);
}
