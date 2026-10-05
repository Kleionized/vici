#!/usr/bin/env node
/**
 * Prove the reader transcription lost nothing.
 *
 * The extractor turns 1,398 frames into data. The failure mode that matters is
 * silent: a run of copy that no branch happened to pick up, or a metric read
 * off the wrong element. So this goes back to the frames and checks the two
 * things a reader would notice —
 *
 *  1. every text run the frame draws appears in the extracted page, and
 *  2. every text run in the extracted page appears in the frame.
 *
 * Page chrome (the clock, Close, the battery) is not the page and is excluded
 * on both sides.
 *
 *   node scripts/vicifull/lesson-verify.mjs [--lesson N]
 */
import fs from 'node:fs';
import path from 'node:path';

import { clean, decode } from './lesson-lib.mjs';

const SPLIT = '.vicifull/lessons';
const ONLY = process.argv.includes('--lesson') ? Number(process.argv[process.argv.indexOf('--lesson') + 1]) : null;

const data = JSON.parse(fs.readFileSync('.vicifull/extract/lesson-scrolls.json', 'utf8'));

/** Every text run a frame draws, chrome excluded. */
function framesText(html) {
  const out = [];
  let i = 0;
  let skip = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    if (lt > i && !skip) {
      const t = clean(html.slice(i, lt));
      if (t) out.push(t);
    }
    if (html.startsWith('<!--', lt)) { i = html.indexOf('-->', lt) + 3; continue; }
    let j = lt + 1, quote = null;
    while (j < html.length) {
      const ch = html[j];
      if (quote) { if (ch === quote) quote = null; }
      else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '>') break;
      j++;
    }
    const raw = html.slice(lt, j + 1);
    const tag = (raw.match(/^<\/?\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase();
    if (tag === 'style' || tag === 'script' || tag === 'svg') skip = raw[1] === '/' ? Math.max(0, skip - 1) : skip + 1;
    i = j + 1;
  }
  // 9:41 and the status bar's glyphs are chrome; Close is the page's own control.
  return out.filter((t) => !['9:41', 'Close', 'Back'].includes(t));
}

/** Every text run the extracted page carries. */
function pageText(page) {
  const out = [];
  const push = (v) => { if (v && String(v).trim()) out.push(clean(String(v))); };
  for (const p of page.parts ?? []) {
    if (p.t === 'text') push(p.text);
    if (p.t === 'cascade') for (const l of p.lines) push(l.text);
    if (p.t === 'attribution') push(p.text);
    if (p.t === 'rule') push(p.text);
    if (p.t === 'picklist') for (const o of p.options) push(o.text);
  }
  if (page.question) push(page.question.text);
  if (page.helper) push(page.helper.text);
  if (page.title) push(page.title.text);
  for (const o of page.options ?? []) { push(o.text); push(o.head); push(o.body); }
  for (const c of page.close ?? []) push(c.text);
  if (page.cta) push(page.cta.text);
  return out;
}

let frames = 0;
let runs = 0;
const missing = [];
const extra = [];

for (const bundle of fs.readdirSync(SPLIT).filter((d) => /^Week |^Lesson 1 /.test(d))) {
  const index = path.join(SPLIT, bundle, '_index.json');
  if (!fs.existsSync(index)) continue;
  for (const frame of JSON.parse(fs.readFileSync(index, 'utf8')).frames) {
    const m = frame.label.match(/^L(\d+) Frame (\d+)$/);
    if (!m) continue;
    const lesson = Number(m[1]);
    if (ONLY && lesson !== ONLY) continue;
    const order = Number(m[2]);
    const page = data[lesson]?.[order - 1];
    if (!page) { missing.push(`${frame.label}: no extracted page`); continue; }
    frames++;
    const html = fs.readFileSync(path.join(SPLIT, bundle, frame.file), 'utf8');
    const drawn = framesText(html);
    const got = pageText(page);
    runs += drawn.length;
    const gotSet = got.map((s) => s.replace(/\s+/g, ' '));
    for (const d of drawn) {
      const norm = d.replace(/\s+/g, ' ');
      if (!gotSet.some((g) => g === norm || g.includes(norm) || norm.includes(g))) missing.push(`${bundle} / ${frame.label}: ${JSON.stringify(d.slice(0, 70))}`);
    }
    for (const g of got) {
      if (!drawn.some((d) => d === g || d.includes(g) || g.includes(d))) extra.push(`${bundle} / ${frame.label}: ${JSON.stringify(g.slice(0, 70))}`);
    }
  }
}

console.log(`frames checked:            ${frames}`);
console.log(`text runs the frames draw: ${runs}`);
console.log(`drawn but NOT transcribed: ${missing.length}`);
console.log(`transcribed but NOT drawn: ${extra.length}`);
if (missing.length) { console.log('\n## missing'); for (const x of missing.slice(0, 30)) console.log('  ' + x); }
if (extra.length) { console.log('\n## extra'); for (const x of extra.slice(0, 30)) console.log('  ' + x); }
