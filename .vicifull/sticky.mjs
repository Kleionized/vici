/* The canvas parks a sticky note between frames naming the screen that follows.
   The split cuts on the frame div, so the note lands in the gap between frame N
   and frame N+1. This prints those gaps. */
import fs from 'node:fs';
const src = fs.readFileSync('Latest Vici FULL/project/Email Login.dc.html', 'utf8');
const idx = JSON.parse(fs.readFileSync('.vicifull/final/Email-Login/_index.json', 'utf8'));
const want = process.argv.slice(2);
for (let i = 0; i < idx.frames.length; i++) {
  const f = idx.frames[i];
  if (want.length && !want.includes(f.label)) continue;
  const next = idx.frames[i + 1];
  const gap = src.slice(f.end, next ? next.start : f.end + 2000);
  const text = gap.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text) console.log(`${String(i + 1).padStart(3)} after ${f.label}:  ${text.slice(0, 260)}`);
}
