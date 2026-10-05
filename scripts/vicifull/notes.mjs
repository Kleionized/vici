#!/usr/bin/env node
/**
 * Pull the canvas's own flow annotations.
 *
 * Between frame N and frame N+1 the canvas carries a sticky note whose text is
 * the *next* frame's number and name ("02 · Login"). That chain is the design's
 * own statement of flow order and screen numbering, and it is the tiebreaker
 * when a frame's label and its position in the file disagree.
 *
 * Usage: node scripts/vicifull/notes.mjs <bundleSlug>
 */
import fs from 'node:fs';
const [, , slug] = process.argv;
const idx = JSON.parse(fs.readFileSync(`.vicifull/final/${slug}/_index.json`, 'utf8'));
const src = fs.readFileSync(idx.source, 'utf8');
const rows = [];
for (let i = 0; i < idx.frames.length; i++) {
  const f = idx.frames[i];
  const next = idx.frames[i + 1];
  const gap = src.slice(f.end, next ? next.start : src.length);
  const text = gap.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  rows.push({ label: f.label, noteAfter: text });
}
// The note after frame N names frame N+1, so shift it onto the frame it names.
const out = idx.frames.map((f, i) => ({ label: f.label, note: i === 0 ? '' : rows[i - 1].noteAfter }));
for (const r of out) console.log((r.note || '—').padEnd(46), '|', r.label);
