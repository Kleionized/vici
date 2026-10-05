import fs from 'node:fs';
const src = fs.readFileSync('src/content/onboardingFunnel.ts','utf8');
const start = src.indexOf('export const FUNNEL_STEPS: FunnelStep[] = [');
const end = src.indexOf('];', start);
const arr = JSON.parse(src.slice(src.indexOf('= [', start)+2, end+1).replace(/,\s*\]$/, ']'));
for (const s of arr) {
  console.log(`${s.id} | ${s.label} | ${s.note} | kind=${s.kind} multi=${s.multi}`);
  console.log(`   title: ${s.title?.text}`);
  if (s.hint) console.log(`   hint: ${s.hint.text}`);
  if (s.note2) console.log(`   note2: ${s.note2.text}`);
  if (s.fine) console.log(`   fine: ${s.fine.text}`);
  if (s.placeholder) console.log(`   placeholder: ${s.placeholder}`);
  if (s.options?.length) console.log(`   options: ${s.options.map(o=>o.label).join(' / ')}`);
  if (s.cta) console.log(`   cta: ${s.cta.label}`);
  if (s.art) console.log(`   art: top=${s.art.top} h=${s.art.height}`);
}
