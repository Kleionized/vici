import fs from 'fs';
const src = fs.readFileSync('src/content/sosResponses.ts','utf8');
const old = {};
for (const m of src.matchAll(/^  "([^"]+)": (\{.*\}),$/gm)) old[m[1]] = JSON.parse(m[2]);
const lines = JSON.parse(fs.readFileSync('.overhaul/understand/scratch-sos-boards/lines.json','utf8'));
const S = '.overhaul/understand/scratch-sos-boards/';
for (const f of fs.readdirSync(S).filter(f=>/^SOS-.*\.txt$/.test(f)).sort()) {
  const k = f.replace('.txt','');
  const t = fs.readFileSync(S+f,'utf8').split('\n').filter(l=>l.trim().startsWith('·')).map(l=>l.trim().slice(2));
  const [kicker,title,body,cta,another] = t;
  const o = old[k];
  const d = [];
  if (o.title!==title) d.push(`title ${JSON.stringify(o.title)}→${JSON.stringify(title)}`);
  if (o.body!==body) d.push(`body ${JSON.stringify(o.body)}→${JSON.stringify(body)}`);
  if (o.cta!==cta) d.push(`cta ${JSON.stringify(o.cta)}→${JSON.stringify(cta)}`);
  if (!!o.another !== !!another) d.push(`another ${!!o.another}→${!!another}`);
  console.log(k.padEnd(22), '|', kicker, '|', d.join('; ') || 'copy unchanged');
}
