#!/usr/bin/env node
/**
 * The line-break check for the SOS response boards (sos-boards §6).
 *
 * The frames set the title in `text-wrap: balance` and the body in `pretty`.
 * RN-web hands both to the browser, but native wraps greedily, so every run
 * whose balanced/pretty break differs from the greedy one at 393 carries an
 * explicit `\n` in `src/content/sosResponses.ts` (D332) — written by the
 * generator's `BREAKS` table. This renders each frame on the design server
 * (`:8097`, Lato loaded), reads the lines the frame draws and the lines a
 * greedy wrap would draw, and checks the generated file against both:
 *
 *   - a run whose greedy break differs must carry exactly the frame's lines;
 *   - a run whose greedy break matches must carry no `\n` at all.
 *
 * Covers the 30 boards and `SOS-Challenge` (its title, body and challenge
 * card). Exits 1 on any mismatch.
 *
 * Usage: node scripts/overhaul/sos-breaks.mjs [--print]
 */
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const print = process.argv.includes('--print');
const FRAMES = JSON.parse(fs.readFileSync('.overhaul/groups.json', 'utf8'))['sos-boards'].map((f) => f.replace(/\.html$/, ''));

// The generated strings, read back out of the emitted module (one JSON object per key).
const src = fs.readFileSync('src/content/sosResponses.ts', 'utf8');
const BOARDS = {};
for (const m of src.matchAll(/^  "(SOS-[A-Za-z-]+)": (\{.*\}),$/gm)) BOARDS[m[1]] = JSON.parse(m[2]);

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 })).newPage();
let bad = 0;
for (const f of FRAMES) {
  await page.goto(`http://localhost:8097/f/Email-Login/${f}.html`, { waitUntil: 'networkidle' });
  const r = await page.evaluate(async () => {
    await document.fonts.ready;
    const lines = (el) => {
      const tn = [...el.childNodes].find((n) => n.nodeType === 3);
      const t = tn.textContent;
      const res = [];
      let cur = '';
      let lastTop = null;
      for (let i = 0; i < t.length; i++) {
        const rg = document.createRange();
        rg.setStart(tn, i);
        rg.setEnd(tn, i + 1);
        const rc = rg.getClientRects()[0];
        if (!rc) { cur += t[i]; continue; }
        if (lastTop !== null && Math.abs(rc.top - lastTop) > 5) { res.push(cur); cur = ''; }
        lastTop = rc.top;
        cur += t[i];
      }
      res.push(cur);
      return res.map((s) => s.trim());
    };
    const both = (el) => {
      const drawn = lines(el);
      const keep = el.style.textWrap;
      el.style.textWrap = 'wrap';
      const greedy = lines(el);
      el.style.textWrap = keep;
      return { drawn, greedy };
    };
    const fonts = document.fonts.check('700 30px Lato') && document.fonts.check('400 15px Lato');
    const stack = [...document.querySelectorAll('div')].find((d) => d.style.left === '24px' && d.style.right === '24px' && d.style.flexDirection === 'column' && d.style.gap === '18px');
    const [h, p] = stack.children;
    const out = { fonts, title: both(h), body: both(p) };
    const card = [...stack.querySelectorAll('div')].find((d) => d.style.fontSize === '18px');
    if (card) out.challenge = both(card);
    return out;
  });
  if (!r.fonts) { console.error(`${f}: Lato NOT loaded — nothing measured`); bad++; continue; }
  const board = BOARDS[f];
  if (!board) { console.error(`${f}: not in src/content/sosResponses.ts`); bad++; continue; }
  for (const field of ['title', 'body', 'challenge']) {
    const m = r[field];
    if (!m) continue;
    const differs = m.drawn.join('\n') !== m.greedy.join('\n');
    const want = differs ? m.drawn.join('\n') : m.drawn.join(' ');
    const ok = board[field] === want;
    if (!ok) bad++;
    if (print || !ok || differs)
      console.log(`${ok ? 'ok  ' : 'BAD '}${f} ${field}${differs ? ' (greedy differs)' : ''}: ${JSON.stringify(m.drawn)}${ok ? '' : `  file has ${JSON.stringify(board[field])}`}`);
  }
}
await browser.close();
console.log(bad ? `${bad} mismatch(es)` : `${FRAMES.length} frames: every break matches`);
process.exit(bad ? 1 : 0);
