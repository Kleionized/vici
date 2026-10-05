// Chrome's own line breaks (balance/pretty) for every text run whose breaks differ from greedy wrapping,
// keyed by frame label then text. A generator can embed these as explicit breaks for native at 393 wide.
import fs from 'node:fs';
const M = JSON.parse(fs.readFileSync('measure.json')); const G = JSON.parse(fs.readFileSync('measure-greedy.json'));
const out = {}; let n = 0;
for (const [lab, m] of Object.entries(M)) m.texts.forEach((t, i) => {
  if (JSON.stringify(G[lab][i]) !== JSON.stringify(t.lines)) { (out[lab] ||= {})[t.text] = t.lines; n++; }
});
fs.writeFileSync('breaks.json', JSON.stringify(out, null, 1));
console.log('runs', n, 'frames', Object.keys(out).length);
