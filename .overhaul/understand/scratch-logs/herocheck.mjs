import fs from 'node:fs';
const pairs = [['Log-Chooser','Open-notebook'],['Lapse-Trigger','Lit-match'],['Urge-Log-Trigger','Lit-match'],['Urge-Log-Outcome','Clipboard'],['Urge-Log-Intensity','Thermometer'],['Report-Ready','Progress-chart']];
const svgs = (html) => [...html.matchAll(/<svg[^>]*viewBox="0 0 393 240"[^>]*>([\s\S]*?)<\/svg>/g)].map((m) => ({ open: m[0].slice(0, m[0].indexOf('>') + 1), body: m[1].replace(/\s+/g, ' ').trim() }));
for (const [f, c] of pairs) {
  const a = svgs(fs.readFileSync(`.overhaul/final/Email-Login/${f}.html`, 'utf8'));
  const b = svgs(fs.readFileSync(`.overhaul/final/Lesson-Illustrations-v4/${c}.html`, 'utf8'));
  const hit = b.findIndex((s) => s.body === a[0].body);
  console.log(f, '->', c, 'frame svgs', a.length, 'card svgs', b.length, 'exact body match at card svg #', hit);
  console.log('   frame open:', a[0].open.replace(/\s+/g,' ').slice(0, 260));
}
