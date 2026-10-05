// Print the label of the row the frame draws chosen (box-shadow 0 0 0 2px #1D1C1A).
import { execSync } from 'node:child_process';
const [, , file] = process.argv;
const out = execSync(`node scripts/vicifull/body.mjs ${JSON.stringify(file)}`, { encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n');
for (let i = 0; i < out.length; i++) {
  if (/box-shadow:0 0 0 2px #1D1C1A/.test(out[i])) {
    for (let j = i + 1; j < Math.min(i + 6, out.length); j++) {
      const m = out[j].match(/·\s+(.*)$/);
      if (m) { console.log(m[1].replace(/&rsquo;/g, '’').replace(/&mdash;/g,'—').replace(/&middot;/g,'·').replace(/&amp;/g,'&')); process.exit(0); }
    }
  }
}
