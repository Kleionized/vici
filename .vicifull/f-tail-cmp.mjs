/* Replace a spec's `## Comparison` section with one built from THIS pass's
   two signatures. spec-verify.mjs appends, so the stale section is cut first. */
import fs from 'node:fs';
import { execSync } from 'node:child_process';
const [, , specFile, dsig, asig] = process.argv;
const p = 'specs/' + specFile;
const cur = fs.readFileSync(p, 'utf8');
const i = cur.indexOf('## Comparison');
if (i < 0) throw new Error('no Comparison section in ' + p);
let j = cur.indexOf('\n## ', i + 1);
const kept = cur.slice(0, i).trimEnd() + '\n' + (j < 0 ? '' : cur.slice(j + 1));
fs.writeFileSync(p, kept);
execSync(`node scripts/vicifull/spec-verify.mjs ${specFile} ${dsig} ${asig}`, { stdio: 'inherit' });
// spec-verify appends at EOF; move the section back to where the old one was
const now = fs.readFileSync(p, 'utf8');
const k = now.indexOf('## Comparison');
const section = now.slice(k).trimEnd() + '\n';
const rest = now.slice(0, k).trimEnd() + '\n';
const cut = rest.indexOf('\n## Resolutions');
fs.writeFileSync(p, cut < 0 ? rest + '\n' + section : rest.slice(0, cut + 1) + '\n' + section + rest.slice(cut + 1));
console.log('placed ' + p);
