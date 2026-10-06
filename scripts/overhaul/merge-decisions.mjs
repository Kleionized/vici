#!/usr/bin/env node
/**
 * Append this run's decision records (`.overhaul/decisions/*.md`) to DECISIONS.md, once, in a fixed
 * order: the orchestrator's rulings first (they override the rest), then the kit, the prerequisites and
 * the screen groups. Each file's own `# title` becomes a section heading; its `## Dnnn` entries keep their
 * numbers. Re-running replaces the section instead of appending it twice.
 *
 *   node scripts/overhaul/merge-decisions.mjs
 */
import fs from 'node:fs';

const ORDER = [
  'orchestrator', 'kit-choices', 'kit-overlay', 'kit-hero', 'kit-chrome', 'splits', 'curriculum',
  'auth-funnel', 'tail', 'paywall-reminders', 'today', 'day', 'library', 'lessons', 'sos-flow', 'sos-boards',
  'medallions-letters', 'logs', 'settings', 'slip',
];
const START = '<!-- vici-overhaul-decisions:start -->';
const END = '<!-- vici-overhaul-decisions:end -->';

let doc = fs.readFileSync('DECISIONS.md', 'utf8');
const a = doc.indexOf(START), b = doc.indexOf(END);
if (a >= 0 && b > a) doc = doc.slice(0, a).trimEnd() + '\n' + doc.slice(b + END.length);

const parts = [
  START,
  '',
  '# Vici Overhaul run (Oct 2026) — D200–D407',
  '',
  'The UI rebuilt to the `Vici Overhaul` bundle (flat dark monochrome, Lato, the new five-tab bar and the',
  'rebuilt 84-lesson course). D320–D349 and D400–D407 are the orchestrator\'s rulings and override any group',
  'entry they touch; D350–D399 the shared kit and prerequisites; D200–D319 the screen groups. Analysis behind them:',
  '`.overhaul/understand/`; the run\'s report: `.overhaul/REPORT.md`.',
  '',
];
for (const name of ORDER) {
  const f = `.overhaul/decisions/${name}.md`;
  if (!fs.existsSync(f)) continue;
  const body = fs.readFileSync(f, 'utf8').trim().replace(/^# (.*)$/m, '## $1 — `' + name + '`');
  parts.push(body, '');
}
parts.push(END, '');
fs.writeFileSync('DECISIONS.md', doc.trimEnd() + '\n\n' + parts.join('\n'));
console.log(`DECISIONS.md: merged ${ORDER.filter((n) => fs.existsSync(`.overhaul/decisions/${n}.md`)).length} decision files`);
