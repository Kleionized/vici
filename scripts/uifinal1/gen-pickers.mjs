#!/usr/bin/env node
/**
 * Generate the two SOS grid pickers' card tables from the frames themselves.
 *
 * `102 · SOS Reason Picker` and `103 · SOS Feeling Picker` each draw nine cards,
 * and each card is a label over a glyph built from `<path>`, `<rect>` and
 * `<circle>` children of a `viewBox="0 0 24 24"` svg. Typing those out by hand
 * is how transcription errors get in, so they are read out of the frame.
 *
 * Usage: node scripts/uifinal1/gen-pickers.mjs > src/content/sosPickers.ts
 */
import { parse } from './decl.mjs';
import fs from 'node:fs';

const DIR = '.uifinal1/final/Email-Login';

function cards(file) {
  const nodes = parse(fs.readFileSync(`${DIR}/${file}`, 'utf8'));
  const out = [];
  let glyph = null;
  for (const n of nodes) {
    if (n.tag === 'svg' && n.attrs?.viewBox === '0 0 24 24') { glyph = { fill: n.attrs.fill, stroke: n.attrs.stroke, parts: [] }; continue; }
    if (glyph && (n.tag === 'path' || n.tag === 'rect' || n.tag === 'circle')) {
      const p = { tag: n.tag };
      for (const k of ['d', 'x', 'y', 'width', 'height', 'rx', 'cx', 'cy', 'r', 'fill']) if (n.attrs?.[k] != null) p[k] = n.attrs[k];
      glyph.parts.push(p);
      continue;
    }
    if (glyph && n.tag === '#text') { out.push({ label: n.text, glyph }); glyph = null; }
  }
  return out;
}

const reason = cards('SOS-Reason-Picker.html');
const feeling = cards('SOS-Feeling-Picker.html');
if (reason.length !== 9 || feeling.length !== 9) {
  console.error(`expected 9 + 9, got ${reason.length} + ${feeling.length}`);
  process.exit(1);
}

const j = (v) => JSON.stringify(v);
const card = (c) =>
  `  { label: ${j(c.label)}, glyph: { ${c.glyph.fill && c.glyph.fill !== 'none' ? `fill: ${j(c.glyph.fill)}, ` : ''}parts: [${c.glyph.parts
    .map((p) => `{ ${Object.entries(p).map(([k, v]) => `${k}: ${j(v)}`).join(', ')} }`)
    .join(', ')}] } },`;

process.stdout.write(`/**
 * The two SOS grid pickers, generated from the frames by
 * \`scripts/uifinal1/gen-pickers.mjs\` — do not edit by hand.
 *
 * \`102 · SOS Reason Picker\` and \`103 · SOS Feeling Picker\` each replaced a
 * six-row list with a nine-card grid. Every label and every glyph below is the
 * canvas's own, read out of the frame's markup.
 *
 * The glyphs are the canvas's, and on twelve of the eighteen cards the canvas's
 * glyph belongs to a label from the list this grid replaced — see
 * \`DECISIONS.md\` D036. They are drawn as the frames draw them.
 */

/** One glyph, in the canvas's own \`0 0 24 24\` box. */
export interface PickerGlyphShape {
  /** Set only where the canvas fills the glyph instead of stroking it. */
  fill?: string;
  parts: { tag: 'path' | 'rect' | 'circle'; d?: string; x?: string; y?: string; width?: string; height?: string; rx?: string; cx?: string; cy?: string; r?: string; fill?: string }[];
}

export interface PickerCard {
  label: string;
  glyph: PickerGlyphShape;
}

/** \`102 · What’s feeding it right now?\` — nine cards, in the canvas's order. */
export const URGE_TRIGGERS: PickerCard[] = [
${reason.map(card).join('\n')}
];

/** \`103 · What’s underneath it?\` — nine cards, in the canvas's order. */
export const URGE_FEELINGS: PickerCard[] = [
${feeling.map(card).join('\n')}
];
`);
