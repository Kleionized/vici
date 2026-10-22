// Fills in each ledger row's app file and spec from what it is (section and label).
// Re-runnable: only sets `app` and `spec` (and the SUPERSEDED/spec-only notes).
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const P = 'scripts/vici-ui-2/ledger.json';
const l = JSON.parse(fs.readFileSync(P, 'utf8'));
const set = (r, app, spec, note) => { r.app = app; r.spec = spec; if (note && !r.note) r.note = note; };
for (const r of l.rows) {
  const [file, n] = r.id.split('__');
  const i = Number(n);
  const sosRow = file === 'sos' || (file === 'app' && i >= 102 && i <= 242);
  const relRow = file === 'relapse' || (file === 'app' && i >= 294 && i <= 368);
  if (sosRow) set(r, 'src/components/urge/sos.tsx', 'specs/vici-ui-2/sos.md');
  else if (relRow) {
    const log = /Back in the app/.test(r.label);
    set(r, log ? 'src/app/relapses.tsx · src/components/slip/relapse.tsx' : 'src/app/slip.tsx · src/components/slip/relapse.tsx', 'specs/vici-ui-2/relapse.md');
    if (/Small phone|Larger text/.test(r.label)) r.note = 'verified by spec only: 393×667 / zoom 1.25 has no simulator counterpart (D22)';
  } else if (file === 'app' && i === 293) set(r, 'src/app/sos.tsx', 'specs/vici-ui-2/sos-chooser.md');
}
fs.writeFileSync(P, JSON.stringify(l, null, 1) + '\n');
execFileSync('node', ['scripts/vici-ui-2/ledger.mjs', 'md']);
console.log('mapped');
