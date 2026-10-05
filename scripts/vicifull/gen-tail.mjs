#!/usr/bin/env node
/**
 * Generate the onboarding tail's data from the canvas frames.
 *
 * Forked from `scripts/uifinal1/gen-tail.mjs` and repointed at this drop's
 * split (`.vicifull/scenes/Email-Login.json`).
 *
 * The tail's screens are drawings, not layouts: a 30-cell month, a 365-cell
 * year, an eleven-star night, a 240pt ring gauge with 48 tick marks, and an
 * ELO bell curve sampled at 61 points. Each is transcribed here rather than
 * re-derived, so the app draws the canvas's own geometry.
 *
 * `Latest Vici FULL` withdrew `Results Pattern` (`26 · The Window to Protect`),
 * so the seven-bar week it fed is gone from the output along with the screen.
 * `Cost Next 365` was redrawn 17 across on square cells at radius 4, and the
 * frame pads its last grid row with ten `visibility:hidden` cells — those are
 * layout filler, not days, and are dropped here.
 *
 * Writes `src/content/onboardingTail.ts`.
 */
import fs from 'node:fs';

const { frames, source } = JSON.parse(fs.readFileSync('.vicifull/scenes/Email-Login.json', 'utf8'));
const F = (l) => { const f = frames.find((x) => x.label === l); if (!f) throw new Error('no frame ' + l); return f; };

/** The dark cells of a grid of squares, in document order. */
function cells(label, match) {
  const f = F(label);
  const out = [];
  for (const n of f.nodes) {
    if (n.tag !== 'div' || !n.css) continue;
    if (n.css.visibility === 'hidden') continue;
    if (!match(n.css)) continue;
    out.push(n.css.background === '#131313');
  }
  return out;
}

const cost30 = cells('Cost Next 30', (c) => c['aspect-ratio'] === '1' && c['border-radius'] === '10px');
const cost365 = cells('Cost Next 365', (c) => c['aspect-ratio'] === '1' && c['border-radius'] === '4px');

/** `35 · If Nothing Changes` paints its stars as eleven 1.3px radial gradients. */
const age80Stars = (() => {
  const f = F('Cost By Age 80');
  const layer = f.nodes.find((n) => n.css && /radial-gradient\(circle 1\.3px/.test(n.css['background-image'] ?? ''));
  return [...layer.css['background-image'].matchAll(/circle 1\.3px at (\d+)px (\d+)px/g)].map((m) => [Number(m[1]), Number(m[2])]);
})();

/** `32 · Starting Score` — the ring's ticks and the ELO curve's samples. */
const score = (() => {
  const f = F('Starting Score');
  const ticks = f.nodes
    .filter((n) => n.tag === 'line' && n.attrs && n.attrs.stroke === '#DDDAD2')
    .map((n) => [Number(n.attrs.x1), Number(n.attrs.y1), Number(n.attrs.x2), Number(n.attrs.y2)]);
  const arc = f.nodes.find((n) => n.tag === 'circle' && n.attrs && n.attrs['stroke-dasharray']);
  const curvePath = f.nodes.find((n) => n.tag === 'path' && n.attrs && n.attrs.stroke === '#D8D5CE');
  const pts = [...curvePath.attrs.d.matchAll(/([\d.]+),([\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  const marker = f.nodes.find((n) => n.tag === 'line' && n.attrs && n.attrs['stroke-width'] === '1.8');
  const readout = f.nodes.find((n) => n.tag === '#text' && /^\d[\d,]*$/.test((n.text ?? '').trim()));
  return {
    ticks,
    trackR: 104,
    strokeW: 10,
    // The frame writes `stroke-dasharray: 89.7 653.5` — the gap is the WHOLE
    // circumference (2π·104 = 653.45), not the remainder, so summing the two
    // over-states the ring by 13.7%. The track's own radius is the authority.
    circumference: Math.round(2 * Math.PI * 104 * 100) / 100,
    sampleDash: Number(arc.attrs['stroke-dasharray'].split(' ')[0]),
    sampleScore: Number((readout.text ?? '').replace(/,/g, '')),
    curve: pts,
    sampleMarkerX: Number(marker.attrs.x1),
  };
})();

const j = (v) => JSON.stringify(v);
const out = [];
out.push('/**');
out.push(' * The onboarding tail\'s drawings, read off the canvas.');
out.push(' *');
out.push(' * GENERATED FILE — do not edit by hand. Written by');
out.push(' * `scripts/vicifull/gen-tail.mjs` from');
out.push(` * \`${source}\`. Re-run the generator instead.`);
out.push(' */');
out.push('');
out.push('/** `33 · Cost Next 30` — 30 cells, 6 across; true is a day that ends the same way. */');
out.push(`export const COST_30: boolean[] = ${j(cost30)};`);
out.push('');
out.push('/** `34 · Cost Next 365` — 365 cells, 17 across, square at radius 4. */');
out.push(`export const COST_365: boolean[] = ${j(cost365)};`);
out.push('');
out.push('/** `35 · Cost By Age 80` — eleven 1.3pt stars on #060606, at the frame\'s own points. */');
out.push(`export const AGE_80_STARS: [number, number][] = ${j(age80Stars)};`);
out.push('');
out.push('/**');
out.push(' * `32 · Starting Score` — the ring gauge and the ELO curve.');
out.push(' *');
out.push(' * 48 tick marks around a 240 x 240 box, a 104pt track at 10pt, and an arc whose');
out.push(' * dash length is the rating\'s share of the circumference: 2π·104 = 653.45.');
out.push(' * The frame\'s own `89.7 653.5` writes the gap as the whole circumference');
out.push(' * rather than the remainder, so the two do not sum to it. The curve is 61');
out.push(' * samples of a bell peaking at x 172.5, which is 1,500 on a 0…3,000 axis.');
out.push(' */');
out.push(`export const SCORE_RING = ${j({ ticks: score.ticks, trackR: score.trackR, strokeW: score.strokeW, circumference: score.circumference })};`);
out.push(`export const SCORE_CURVE: [number, number][] = ${j(score.curve)};`);
out.push('/** What the frame itself draws, kept so the spec can quote it — see DECISIONS D050. */');
out.push(`export const SCORE_SAMPLE = ${j({ score: score.sampleScore, dash: score.sampleDash, markerX: score.sampleMarkerX })};`);
out.push('');
fs.writeFileSync('src/content/onboardingTail.ts', out.join('\n'));
console.log(`src/content/onboardingTail.ts — cost30 ${cost30.length} (${cost30.filter(Boolean).length} dark), cost365 ${cost365.length} (${cost365.filter(Boolean).length} dark), stars ${age80Stars.length}, ticks ${score.ticks.length}, curve ${score.curve.length}, sample ${score.sampleScore} dash ${score.sampleDash} markerX ${score.sampleMarkerX}`);
