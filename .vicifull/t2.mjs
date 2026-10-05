import fs from 'node:fs';
const files = process.argv.slice(2);
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  const t = s
    .replace(/<[^>]*>/g, '')
    .split('')
    .map((x) => x.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  console.log('### ' + f);
  console.log(t.join(' | '));
  console.log();
}
