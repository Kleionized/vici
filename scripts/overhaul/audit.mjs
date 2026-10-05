#!/usr/bin/env node
/**
 * Run the whole parity audit from the recipes on disk.
 *
 * `.overhaul/recipes/*.json` says how to reach each screen. This walks them,
 * captures the design frame and the app side by side, diffs the two signatures,
 * and writes one report. It is the second pass's instrument: a screen that has
 * no recipe is reported as unaudited rather than quietly skipped, which is the
 * only way "every screen was checked" can be a fact rather than a claim.
 *
 * Usage: node scripts/overhaul/audit.mjs [--group=<key>] [--frame=<label>] [--jobs=4]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const flag = (n, d) => { const a = args.find((x) => x.startsWith(`--${n}=`)); return a ? a.slice(n.length + 3) : d; };
const onlyGroup = flag('group', '');
const onlyFrame = flag('frame', '');

/* The frame list is the split itself — every frame the bundle draws, in canvas
   order — with each frame's group from `.overhaul/groups.json`. */
const groupsOf = JSON.parse(fs.readFileSync('.overhaul/groups.json', 'utf8'));
const groupByFile = new Map(Object.entries(groupsOf).flatMap(([g, fl]) => fl.map((f) => [f, g])));
const map = JSON.parse(fs.readFileSync('.overhaul/final/Email-Login/_index.json', 'utf8')).frames.map((f) => ({ label: f.label, file: f.file, group: groupByFile.get(f.file) }));
const byLabel = new Map(map.map((r) => [r.label, r]));

const recipes = new Map();
const RD = '.overhaul/recipes';
if (fs.existsSync(RD)) {
  for (const f of fs.readdirSync(RD).filter((x) => x.endsWith('.json'))) {
    const group = f.replace(/\.json$/, '');
    let list;
    try { list = JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8')); }
    catch (e) { console.error(`! ${f} is not valid JSON: ${e.message}`); continue; }
    for (const r of list) recipes.set(r.frame, { ...r, group });
    /* Some groups record a family once — `SOS Trig *`, `Slip Feel * / …`. Expand
       those over the frames whose labels they cover, so an audit still runs them
       instead of calling 30 boards unaudited. A per-frame driver still wins. */
    for (const r of list) {
      if (!/[*]/.test(r.frame)) continue;
      for (const part of r.frame.split('/').map((x) => x.trim())) {
        const rx = new RegExp('^' + part.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
        for (const m of map) if (rx.test(m.label) && !recipes.has(m.label)) recipes.set(m.label, { ...r, frame: m.label, group, viaFamily: r.frame });
      }
    }
  }
}

const sh = (cmd, argv) => {
  try { return { ok: true, out: execFileSync(cmd, argv, { encoding: 'utf8', maxBuffer: 1 << 26 }) }; }
  catch (e) { return { ok: false, out: (e.stdout ?? '') + (e.stderr ?? '') }; }
};

const rows = [];
for (const frame of map) {
  if (onlyFrame && frame.label !== onlyFrame) continue;
  const r = recipes.get(frame.label);
  // `--group` selects by this run's frame group (groups.json) or by recipe file.
  if (onlyGroup && frame.group !== onlyGroup && r?.group !== onlyGroup) continue;
  if (!r) { rows.push({ frame: frame.label, group: frame.group, status: 'NO RECIPE' }); continue; }
  if (r.unreachable) { rows.push({ frame: frame.label, group: r.group, status: 'UNREACHABLE', note: r.unreachable }); continue; }

  const slug = frame.label.replace(/[^A-Za-z0-9]+/g, '-');
  const d = `au-d-${slug}`;
  const a = `au-a-${slug}`;
  /* Almost every frame's design side is its own `Email-Login` file, and that is
     still the default. Lesson one is the exception D085 names: the bundle
     authors those 26 pages twice and only `Lesson 1 Surviving the Night` carries
     this drop's restyle, so the app is built from that copy and auditing it
     against Email-Login's leftovers would report 26 misses for a difference the
     decisions log already settled. A recipe may therefore state the bundle and
     file its frame is really drawn by. */
  const dbundle = r.designBundle ?? 'Email-Login';
  const dfile = r.designFile ?? frame.file;
  /* The design side is captured once per drop by shoot-design.mjs; only a frame
     missing from that pass is shot here. */
  const pre = `.overhaul/shots/design/${dbundle}/${dfile.replace(/\.html$/, '.png')}`;
  const preSig = `d-${dbundle}-${dfile.replace(/\.html$/, '')}`;
  let dPng = pre, dSig = preSig, dres = { ok: true, out: '' };
  if (!fs.existsSync(pre) || !fs.existsSync(`.overhaul/sig/${preSig.replace(/[^A-Za-z0-9._-]/g, '_')}.txt`)) {
    dPng = `.overhaul/shots/${d}.png`; dSig = d;
    dres = sh('node', ['scripts/overhaul/shot.mjs', 'design', dbundle, dfile, dPng, `--sig=${d}`]);
  }
  const argv = ['scripts/overhaul/shot.mjs', 'app', r.route, `.overhaul/shots/${a}.png`, `--sig=${a}`, `--wait=${r.wait ?? 1600}`];
  if (r.seed === true || r.seed === 'reload') argv.push('--seed');
  /* `initseed` is the flag shot.mjs takes and the name the brief documents, and
     nine of the ten recipe files were written with that key — 102 entries that
     this walker used to run unseeded, then report as wholly differing. Both
     spellings are read. */
  const seedFile = r.initseed ?? r.seedScript ?? (r.seed === 'init' ? '.overhaul/day-seed.js' : null);
  if (seedFile) argv.push(`--initseed=${seedFile}`);
  if (r.scroll != null) argv.push(`--scroll=${r.scroll}`);
  if (r.do) argv.push(`--do=${r.do}`);
  if (r.script) argv.push(`--script=${r.script}`);
  if (r.fast) argv.push('--fast');
  if (r.settle != null) argv.push(`--settle=${r.settle}`);
  const ares = sh('node', argv);
  if (!dres.ok || !ares.ok) {
    rows.push({ frame: frame.label, group: r.group, status: 'CAPTURE FAILED', note: (dres.out + ares.out).slice(-400) });
    continue;
  }
  const diff = sh('node', ['scripts/overhaul/sigdiff.mjs', dSig, a, ...(r.data ? ['--data'] : [])]);
  // Pixels, as well as numbers: a signature passes with the art gone (BRIEF).
  fs.mkdirSync('.overhaul/audit/strips', { recursive: true });
  const px = sh('node', ['scripts/overhaul/pxdiff.mjs', dPng, `.overhaul/shots/${a}.png`, `.overhaul/audit/strips/${slug}`, '--ignore=0,0,393,54', '--json']);
  let pxr = null;
  try { pxr = JSON.parse(fs.readFileSync(`.overhaul/audit/strips/${slug}.pxdiff.json`, 'utf8')); } catch {}
  for (const ext of ['diff', 'overlay']) fs.rmSync(`.overhaul/audit/strips/${slug}.${ext}.png`, { force: true });
  const tail = diff.out.trim().split('\n').pop() ?? '';
  const m = /(\d+) differing, (\d+) missing, (\d+) extra/.exec(tail);
  const rn = /(\d+) radius-notation only/.exec(tail);
  const sv = /(\d+) paint-absent-geometry-exact/.exec(tail);
  const radiusOnly = rn ? Number(rn[1]) : 0;
  const svgShape = sv ? Number(sv[1]) : 0;
  // A row that differs only in how a circle's radius is written is D015, not a
  // defect. `net` is what is actually still wrong.
  const net = m ? Number(m[1]) - radiusOnly - svgShape : null;
  rows.push({
    frame: frame.label, group: r.group, status: m && net === 0 && m[2] === '0' && pxr && pxr.share < 0.5 ? 'CLEAN' : 'DIFF',
    px: pxr ? Number(pxr.share.toFixed(2)) : null, pxRegions: pxr ? pxr.regions.length : null, topRegions: pxr ? pxr.regions.slice(0, 5) : null,
    differing: m ? Number(m[1]) : null, radiusOnly, svgShape, net, missing: m ? Number(m[2]) : null, extra: m ? Number(m[3]) : null,
    detail: diff.out,
  });
  process.stderr.write(`${frame.label}: ${tail}  px ${pxr ? pxr.share.toFixed(2) + '%' : '?'}\n`);
}

fs.mkdirSync('.overhaul/audit', { recursive: true });
/* A `--group=` or `--frame=` run used to overwrite the whole report with just
   its own rows, so two agents auditing their own groups at the same time each
   erased the other's. A partial run now merges into what is already there and
   only a full run replaces it. */
let all = rows;
if ((onlyGroup || onlyFrame) && fs.existsSync('.overhaul/audit/report.json')) {
  let prev = [];
  try { prev = JSON.parse(fs.readFileSync('.overhaul/audit/report.json', 'utf8')); } catch { prev = []; }
  const fresh = new Set(rows.map((r) => r.frame));
  all = [...prev.filter((r) => !fresh.has(r.frame)), ...rows];
  const order = new Map(map.map((m, i) => [m.label, i]));
  all.sort((x, y) => (order.get(x.frame) ?? 1e9) - (order.get(y.frame) ?? 1e9));
}
fs.writeFileSync('.overhaul/audit/report.json', JSON.stringify(all, null, 2));
const md = ['| Frame | Group | Status | px mismatch % | px regions | differing | radius-only | svg-shape (check PNG) | net | missing | extra |', '|---|---|---|---|---|---|---|---|---|---|---|'];
for (const r of all) md.push(`| ${r.frame} | ${r.group ?? ''} | ${r.status} | ${r.px ?? ''} | ${r.pxRegions ?? ''} | ${r.differing ?? ''} | ${r.radiusOnly ?? ''} | ${r.svgShape ?? ''} | ${r.net ?? ''} | ${r.missing ?? ''} | ${r.extra ?? ''} |`);
fs.writeFileSync('.overhaul/audit/report.md', md.join('\n') + '\n');
const by = (s) => rows.filter((r) => r.status === s).length;
console.log(`\n${rows.length} frames — clean ${by('CLEAN')}, differing ${by('DIFF')}, unreachable ${by('UNREACHABLE')}, capture failed ${by('CAPTURE FAILED')}, no recipe ${by('NO RECIPE')}`);
