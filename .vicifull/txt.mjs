import fs from 'node:fs';
const [, , bundle, ...labels] = process.argv;
const s = JSON.parse(fs.readFileSync(`.vicifull/scenes/${bundle}.json`, 'utf8'));
for (const l of labels) {
  const f = s.frames.find((x) => x.label === l);
  if (!f) { console.log('## ' + l + ' — NOT FOUND'); continue; }
  console.log('## ' + l + '  [' + f.file + ']');
  console.log(f.text.join(' ⏎ '));
  console.log();
}
