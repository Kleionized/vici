#!/usr/bin/env node
/**
 * Transcribe the twelve week-overview scenes out of the canvas into data.
 *
 * Each `Week …` frame draws its picture as a stack of absolutely-positioned
 * divs inside a 258pt band. Rather than retype 150-odd boxes, this reads them
 * straight off the frame: every layer's box, radius, fill, transform and blur,
 * in paint order, band-local (so no −54 is owed — the band's own top pays it).
 *
 * Rebuild: node scripts/uifinal/gen-week-scenes.mjs
 */
import fs from 'node:fs';

const LT = '.uifinal/final/Lessons and Tasks';

/** Split into tags/text, tracking depth, so a subtree can be lifted out whole. */
function sceneBand(html, marker) {
  const at = html.indexOf(marker);
  if (at < 0) return null;
  const start = html.lastIndexOf('<div', at);
  let depth = 0;
  let i = start;
  while (i < html.length) {
    const open = html.indexOf('<div', i);
    const close = html.indexOf('</div>', i);
    if (close < 0) break;
    if (open >= 0 && open < close) {
      depth++;
      i = open + 4;
    } else {
      depth--;
      i = close + 6;
      if (depth === 0) return html.slice(start, i);
    }
  }
  return null;
}

const num = (s) => (s == null ? undefined : Number(s));

/** Every direct child box of the band, in paint order. */
function layers(band) {
  const out = [];
  // Skip the band's own opening tag, then read each child's opening tag.
  const inner = band.slice(band.indexOf('>') + 1);
  const re = /<(div|svg)([^>]*)>/g;
  let m;
  let depth = 0;
  let i = 0;
  // Walk with a depth counter so only depth-0 children are collected.
  const parts = inner.split(/(<[^>]*>)/g).filter(Boolean);
  for (const part of parts) {
    if (part.startsWith('</')) {
      depth--;
      continue;
    }
    if (part.startsWith('<') && !part.startsWith('<!')) {
      const name = (part.match(/^<\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase();
      const style = (part.match(/\sstyle="([^"]*)"/) || [])[1] ?? '';
      if (depth === 0) {
        const g = (prop) => (style.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`)) || [])[1]?.trim();
        out.push({
          tag: name,
          left: num(g('left')?.replace('px', '')),
          right: num(g('right')?.replace('px', '')),
          top: num(g('top')?.replace('px', '')),
          bottom: g('bottom'),
          width: g('width'),
          height: g('height'),
          radius: g('border-radius'),
          background: g('background') ?? g('background-image'),
          filter: g('filter'),
          transform: g('transform'),
          clipPath: g('clip-path'),
          opacity: num(g('opacity')),
          raw: part.length > 400 ? part.slice(0, 400) + '…' : part,
        });
      }
      const selfClosing = part.endsWith('/>') || ['img', 'br', 'hr', 'input', 'meta', 'link', 'source'].includes(name);
      if (!selfClosing) depth++;
    }
  }
  return out;
}

const scenes = {};
const missing = [];
for (let day = 1; day <= 84; day++) {
  const nn = String(day).padStart(2, '0');
  const file = `${LT}/Task-D${nn}-Intro.html`;
  if (!fs.existsSync(file)) {
    missing.push(day);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  // The scene sits in a 340 x 200 box; the inner div is what holds the layers.
  const band = sceneBand(html, 'width:340px; height:200px; overflow:hidden');
  if (!band) {
    missing.push(day);
    continue;
  }
  scenes[day] = layers(band);
}

const counts = Object.entries(scenes).map(([n, l]) => l.length);
console.log(`task scenes: ${Object.keys(scenes).length}, layers min ${Math.min(...counts)} max ${Math.max(...counts)} total ${counts.reduce((a, b) => a + b, 0)}`);
if (missing.length) console.log(`no scene found for days: ${missing.join(', ')}`);
fs.mkdirSync('.uifinal/extract', { recursive: true });
fs.writeFileSync('.uifinal/extract/task-scenes.json', JSON.stringify(scenes, null, 2));
console.log('wrote .uifinal/extract/task-scenes.json');
