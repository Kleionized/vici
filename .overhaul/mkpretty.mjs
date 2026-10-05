import fs from 'node:fs';
import { pretty } from '../scripts/uifinal/pretty.mjs';
const changed = JSON.parse(fs.readFileSync('.overhaul/changed-email.json', 'utf8'));
for (const [pf, ff] of changed) {
  fs.writeFileSync('.overhaul/pretty/prev/' + pf, pretty(fs.readFileSync('.overhaul/prev/Email-Login/' + pf, 'utf8')));
  fs.writeFileSync('.overhaul/pretty/final/' + ff, pretty(fs.readFileSync('.overhaul/final/Email-Login/' + ff, 'utf8')));
}
console.log('pretty', changed.length);
