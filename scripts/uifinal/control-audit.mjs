#!/usr/bin/env node
/**
 * Controls that cannot do anything.
 *
 * A pressable with no handler, or one wired to an empty function, looks exactly
 * like a working control until someone taps it. This reads every pressable in
 * the app and reports the ones with nothing behind them.
 *
 *   node scripts/uifinal/control-audit.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const PRESSABLE = /^(\s*)<(PressScale|Pressable|TouchableOpacity|TouchableHighlight|TouchableWithoutFeedback|Button|AnimatedPressable)\b/;

function files(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files(full, out);
    else if (/\.tsx$/.test(e.name)) out.push(full);
  }
  return out;
}

/** The whole opening tag from line `i`, however many lines it spans. */
function openingTag(lines, i) {
  let out = '';
  let depth = 0;
  for (let k = i; k < Math.min(i + 40, lines.length); k++) {
    out += lines[k] + '\n';
    for (const ch of lines[k]) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (depth <= 0 && /(\/>|>)\s*$/.test(lines[k].trimEnd())) break;
  }
  return out;
}

const dead = [];
const suspicious = [];
let total = 0;

for (const file of files('src')) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!PRESSABLE.test(lines[i])) continue;
    const tag = openingTag(lines, i);
    total++;
    const rel = `${path.relative(process.cwd(), file)}:${i + 1}`;
    const label = (tag.match(/accessibilityLabel="([^"]*)"/) || tag.match(/label=\{?["']([^"']*)/) || [])[1] ?? '';

    // Spread props can carry the handler in from a caller.
    const spread = /\{\.\.\.\w+\}/.test(tag);
    const hasPress = /\bonPress[=:]/.test(tag) || /\bonPressIn\b/.test(tag);
    if (!hasPress && !spread) {
      dead.push({ at: rel, label, why: 'no onPress at all', snippet: lines[i].trim().slice(0, 60) });
      continue;
    }
    // A handler that provably does nothing.
    const noop = tag.match(/onPress=\{\s*\(\s*\)\s*=>\s*(\{\s*\}|undefined|null|void 0)\s*\}/);
    if (noop) dead.push({ at: rel, label, why: 'onPress is a no-op', snippet: noop[0].slice(0, 60) });
    // A handler that is only a TODO.
    if (/onPress=\{[^}]*TODO/.test(tag)) suspicious.push({ at: rel, label, why: 'handler mentions TODO' });
    // Disabled with a literal true never becomes enabled.
    if (/disabled=\{true\}|disabled\s+/.test(tag) && !/disabled=\{[^}]*\w/.test(tag)) {
      suspicious.push({ at: rel, label, why: 'always disabled' });
    }
  }
}

console.log(`pressables: ${total}`);
console.log(`with nothing behind them: ${dead.length}`);
console.log(`worth a second look: ${suspicious.length}`);
if (dead.length) {
  console.log('\n## dead');
  for (const d of dead) console.log(`   ${d.at}  ${d.label ? `"${d.label}" ` : ''}— ${d.why}\n      ${d.snippet}`);
}
if (suspicious.length) {
  console.log('\n## suspicious');
  for (const d of suspicious) console.log(`   ${d.at}  ${d.label ? `"${d.label}" ` : ''}— ${d.why}`);
}
