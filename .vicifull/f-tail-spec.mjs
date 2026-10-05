/* Replace a spec's `## Transcription` section with one generated from THIS drop.
   The section runs from its own heading to the next `## ` heading (or EOF). */
import fs from 'node:fs';
import { execSync } from 'node:child_process';
const [, , bundle, label, specFile] = process.argv;
const tmp = '.vicifull/.spec-tmp.md';
if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
execSync(`node scripts/vicifull/spec.mjs ${bundle} ${JSON.stringify(label)} ../${tmp}`, { stdio: 'inherit' });
const fresh = fs.readFileSync(tmp, 'utf8');
const body = fresh.slice(fresh.indexOf('## Transcription'));
const p = 'specs/' + specFile;
const cur = fs.readFileSync(p, 'utf8');
const i = cur.indexOf('## Transcription');
if (i < 0) throw new Error('no transcription section in ' + p);
let j = cur.indexOf('\n## ', i + 1);
const out = cur.slice(0, i) + body.trimEnd() + '\n' + (j < 0 ? '' : cur.slice(j));
fs.writeFileSync(p, out);
fs.unlinkSync(tmp);
console.log('refreshed ' + p);
