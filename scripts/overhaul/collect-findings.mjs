#!/usr/bin/env node
/**
 * Split a workflow run's verify results into one file per group.
 *
 * The fix pass hands each group its own verifier's findings verbatim; reading
 * them out of the journal here keeps that hand-off exact rather than summarised.
 *
 * Usage: node scripts/overhaul/collect-findings.mjs <journal.jsonl> [outDir]
 */
import fs from 'node:fs';
import path from 'node:path';

const [, , journal, outDir = '.overhaul/verify'] = process.argv;
const rows = fs
  .readFileSync(journal, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l))
  .filter((r) => r.result && typeof r.result === 'object' && r.result.group);

fs.mkdirSync(outDir, { recursive: true });
let total = 0;
for (const r of rows) {
  const g = r.result;
  fs.writeFileSync(path.join(outDir, g.group + '.json'), JSON.stringify(g, null, 2));
  total += (g.findings ?? []).length;
  const certain = (g.findings ?? []).filter((f) => f.confidence === 'certain').length;
  console.log(`${g.group.padEnd(16)} ${String((g.findings ?? []).length).padStart(3)} findings (${certain} certain)  reachedAll=${g.reachedAll}  unreachable=${(g.unreachable ?? []).length}`);
}
console.log(`\n${rows.length} groups, ${total} findings -> ${outDir}`);
