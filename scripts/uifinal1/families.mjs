#!/usr/bin/env node
/**
 * Group frames into template families.
 *
 * `scene.mjs` signs a frame on its exact declaration keys, which splits two
 * frames that differ by one `text-wrap`. This signs on the tag tree alone —
 * the shape of the composition — so a family of pickers that differ only in
 * their glyph and their words lands in one group.
 *
 * Usage: node scripts/uifinal1/families.mjs <bundle> [minSize]
 */
import fs from 'node:fs';
const [, , bundle, min = '2'] = process.argv;
const { frames } = JSON.parse(fs.readFileSync(`.uifinal1/scenes/${bundle}.json`, 'utf8'));
const groups = new Map();
const SVG_KIDS = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'defs', 'lineargradient', 'radialgradient', 'stop', 'g', 'text', 'clippath', 'mask', 'use', 'tspan', 'filter', 'fegaussianblur']);
for (const f of frames) {
  // An icon is one node. Two pickers that differ only in the shape of their
  // glyph are the same screen with a different glyph, not two screens.
  const sig = f.nodes
    .filter((n) => !SVG_KIDS.has(n.tag))
    .map((n) => '  '.repeat(n.d) + (n.tag === '#text' ? 't' : n.tag))
    .join('\n');
  if (!groups.has(sig)) groups.set(sig, []);
  groups.get(sig).push(f.label);
}
const list = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
let singles = 0;
for (const [, labels] of list) {
  if (labels.length < Number(min)) { singles += labels.length; continue; }
  console.log(`[${labels.length}] ${labels.join(' · ')}`);
}
console.log(`--- ${frames.length} frames, ${list.length} shapes; ${singles} in groups smaller than ${min}`);
