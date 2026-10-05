import fs from 'node:fs';
import { pretty } from '../scripts/uifinal/pretty.mjs';
const changed = JSON.parse(fs.readFileSync('.vicifull/changed-email.json', 'utf8'));
for (const [pf, ff] of changed) {
  fs.writeFileSync('.vicifull/pretty/prev/' + pf, pretty(fs.readFileSync('.vicifull/prev/Email-Login/' + pf, 'utf8')));
  fs.writeFileSync('.vicifull/pretty/final/' + ff, pretty(fs.readFileSync('.vicifull/final/Email-Login/' + ff, 'utf8')));
}
console.log('pretty', changed.length);
