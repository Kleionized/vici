#!/usr/bin/env node
/**
 * Pass 2 — the entity sweep.
 *
 * The canvas writes its copy with HTML entities (`&rsquo;`, `&mdash;`), and
 * transcribing a run into the app carries them along. JSX decodes some of those
 * positions and not others, so whether an entity reaches the screen as a
 * character or as the literal text `&rsquo;` depends on where it was pasted:
 *
 *   <Text>I&apos;m</Text>          -> decoded by the JSX transform
 *   <Foo title="I&apos;m" />       -> decoded
 *   <Foo title={'I&apos;m'} />     -> NOT decoded, renders literally
 *   const s = "I&apos;m"           -> NOT decoded, renders literally
 *
 * Rather than reason about which is which, this runs the real JSX transform and
 * looks at what survives it. An entity still present in the output is one the
 * user would actually read on screen.
 *
 *   node scripts/uifinal/entity-sweep.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

import esbuild from 'esbuild';

const ROOT = process.cwd();

function sourceFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

// Named entities the canvas actually uses, plus numeric ones. Deliberately not
// `&amp;`-anything: a bare `&` is not a defect and `&&` is an operator.
const ENTITY = /&(nbsp|rsquo|lsquo|ldquo|rdquo|mdash|ndash|middot|hellip|times|deg|apos|quot|amp|lt|gt|minus|#\d+|#x[0-9a-f]+);/gi;

const findings = [];
for (const file of sourceFiles(path.join(ROOT, 'src'))) {
  const src = fs.readFileSync(file, 'utf8');
  if (!ENTITY.test(src)) continue;
  ENTITY.lastIndex = 0;
  let out;
  try {
    out = esbuild.transformSync(src, { loader: file.endsWith('.tsx') ? 'tsx' : 'ts' }).code;
  } catch (err) {
    findings.push({ file, error: String(err.message).split('\n')[0] });
    continue;
  }
  // Map each surviving entity back to the line it came from.
  const survivors = [...new Set(out.match(ENTITY) ?? [])];
  if (!survivors.length) continue;
  const lines = src.split('\n');
  for (const ent of survivors) {
    // `&amp;` survives legitimately inside a regex or a URL query, so report
    // the line and let the reader judge rather than guessing.
    lines.forEach((line, i) => {
      if (line.includes(ent)) findings.push({ file: path.relative(ROOT, file), line: i + 1, ent, text: line.trim().slice(0, 130) });
    });
  }
}

console.log(`files scanned: ${sourceFiles(path.join(ROOT, 'src')).length}`);
console.log(`entities surviving the JSX transform: ${findings.length}`);
console.log('');
for (const f of findings) {
  if (f.error) {
    console.log(`!! ${f.file}: ${f.error}`);
    continue;
  }
  console.log(`${f.file}:${f.line}  ${f.ent}`);
  console.log(`    ${f.text}`);
}
