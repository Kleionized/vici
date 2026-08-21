#!/usr/bin/env node
/**
 * Write a spec file's transcription section straight from the frame.
 *
 * Phase 2 asks for a picture converted into numbers. The numbers are already in
 * the frame's inline styles, so typing them out by hand would only introduce
 * transcription errors. This emits the frame's full declaration tree — every
 * offset, colour, radius, shadow, type metric and SVG attribute — into
 * `specs/<file>.md`, and leaves the comparison table and the resolutions, which
 * are judgement rather than transcription, to be written under it.
 *
 * Usage: node scripts/uifinal1/spec.mjs <bundle> <frameLabel> <specFile> [appFile]
 */
import fs from 'node:fs';
import path from 'node:path';

const [, , bundle, label, specFile, appFile = ''] = process.argv;
const { frames, source } = JSON.parse(fs.readFileSync(`.uifinal1/scenes/${bundle}.json`, 'utf8'));
const f = frames.find((x) => x.label === label);
if (!f) { console.error('no frame ' + label); process.exit(1); }

const ORDER = ['position', 'left', 'right', 'top', 'bottom', 'inset', 'width', 'height', 'min-height', 'max-width', 'margin-left', 'margin', 'padding', 'box-sizing', 'display', 'flex', 'flex-direction', 'flex-wrap', 'flex-shrink', 'align-items', 'align-self', 'justify-content', 'gap', 'grid-template-columns', 'aspect-ratio', 'background', 'background-color', 'background-image', 'background-size', 'backdrop-filter', 'border', 'border-radius', 'box-shadow', 'opacity', 'filter', 'mix-blend-mode', 'transform', 'transform-origin', 'overflow', 'z-index', 'color', 'font-family', 'font-size', 'font-weight', 'font-style', 'font-variant-numeric', 'font-feature-settings', 'letter-spacing', 'line-height', 'text-align', 'text-transform', 'text-decoration', 'text-wrap', 'white-space', 'text-overflow', '-webkit-line-clamp', '-webkit-box-orient', 'animation', 'transition', 'cursor', 'pointer-events'];
const SVG = ['id', 'viewBox', 'width', 'height', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry', 'x1', 'y1', 'x2', 'y2', 'points', 'd', 'transform', 'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'offset', 'stop-color', 'stop-opacity', 'gradientUnits', 'gradientTransform', 'clip-path', 'mask', 'text-anchor', 'font-size', 'font-weight', 'letter-spacing', 'src', 'alt'];

const lines = [];
for (const n of f.nodes) {
  const pad = '  '.repeat(n.d);
  if (n.tag === '#text') { lines.push(pad + '· ' + n.text); continue; }
  const css = n.css ?? {};
  const seen = new Set();
  const parts = [];
  for (const k of ORDER) if (css[k] != null) { parts.push(`${k}:${css[k]}`); seen.add(k); }
  for (const k of Object.keys(css)) if (!seen.has(k)) parts.push(`${k}:${css[k]}`);
  const attrs = SVG.filter((k) => n.attrs?.[k] != null).map((k) => `${k}="${n.attrs[k]}"`);
  lines.push(pad + `<${n.tag}> ` + [...attrs, ...parts].join('  '));
}

const out = `## Transcription — \`${label}\`

Source \`${source}\`, frame \`${f.file}\`. Emitted by \`scripts/uifinal1/spec.mjs\` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (\`DECISIONS.md\` D009); every other
element on the frame is here, in paint order, indented by depth.

\`\`\`
${lines.join('\n')}
\`\`\`
`;

const target = path.join('specs', specFile);
if (fs.existsSync(target)) fs.appendFileSync(target, '\n' + out);
else fs.writeFileSync(target, `# ${label}\n\n* **Design frame** \`${bundle}/${label}\`\n* **App file** ${appFile || '(to fill)'}\n\n` + out);
console.log('wrote ' + target + ` (${lines.length} lines)`);
