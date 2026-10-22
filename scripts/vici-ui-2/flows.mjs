// Pass 3's walk through the real app: each step is reached the way a user
// reaches it — from a starting screen, by tapping through the app's own
// navigators (tab bar, nav rows, sheets) — never by opening its route. Each
// arrival is shot and diffed against the frame of the board it lands on, so a
// board that matches in the harness but sits wrong inside its navigator shows.
//
//   node scripts/vici-ui-2/flows.mjs [flowFilter]
//
// Output: pixel-diff/out/flow__<flow>__<step>.{side,mask,overlay}.png and a
// summary line per step.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { shoot } from './shoot-app.mjs';

const h12 = (c = '09:41') => new Date(2026, 9, 21, Number(c.split(':')[0]), Number(c.split(':')[1])).toISOString();

/** [flow, start route, seed, [[step name, steps to reach it from the start, design row it should match]]] */
const FLOWS = [
  ['tabs', '/today', 'today-0900-seed', [
    ['today', [], 'app__052__21-today'],
    ['sos', ['tap:SOS', 'wait:1200'], 'app__293__97-sos-urge-or-relapse'],
  ]],
  ['log-tab', '/today', 'logs-seed', [
    ['chooser', ['tap:Log', 'wait:1200'], 'app__265__90-log-chooser'],
  ]],
  ['journey-tab', '/today', 'medallions-seed', [
    ['medallions', ['tap:Journey', 'wait:1200'], 'app__243__88-medallions'],
  ]],
  ['library-tab', '/today', 'library-seed', [
    ['week', ['tap:Library', 'wait:1600'], null],
  ]],
  ['score', '/today', 'today-0900-seed', [
    ['score', ['tap:Recovery rating', 'wait:1200'], 'app__053__21b-score-detail'],
  ]],
  ['settings', '/today', 'settings-seed', [
    ['settings', ['tap:Open settings', 'wait:1200'], 'app__283__92-settings'],
    ['app-lock', ['tap:Open settings', 'wait:1200', 'tap:App lock', 'wait:1200'], 'app__292__95-app-lock'],
    ['privacy', ['tap:Open settings', 'wait:1200', 'tap:Data & privacy', 'wait:1200'], 'app__291__94-data-privacy'],
  ]],
  ['profile', '/today', 'settings-profile-seed', [
    ['profile', ['tap:Open settings', 'wait:1200', 'tap:Edit profile', 'wait:1200'], 'app__284__93-edit-profile'],
  ]],
  ['vow', '/today', 'settings-vow-dated-seed', [
    ['vow', ['tap:Open settings', 'wait:1200', 'tap:Your vow', 'wait:1200'], 'app__289__92c-your-vow'],
  ]],
  ['morning', '/today', 'day-seed-own', [
    ['cover', ['tap:Morning check-in', 'wait:1200'], 'app__059__21d0-morning-check-in'],
    ['task', ['tap:Morning check-in', 'wait:1200', 'tap:Begin', 'wait:900'], 'app__060__21d1-morning-yesterdays-task'],
  ]],
  ['log', '/log', 'logs-reports-seed', [
    ['reports', ['tap:Reports', 'wait:900'], 'app__268__91-3-log-reports'],
  ]],
  ['medallion', '/milestones', 'medallions-seed', [
    ['tiers', ['tap:Breakwater', 'wait:1200'], null],
  ]],
];

const filter = process.argv[2] ?? '';
const ROWS = new Map(JSON.parse(fs.readFileSync('scripts/vici-ui-2/ledger.json', 'utf8')).rows.map((r) => [r.id, r]));
for (const [flow, route, seed, steps] of FLOWS) {
  if (!flow.includes(filter)) continue;
  for (const [step, path, design] of steps) {
    const name = `flow__${flow}__${step}`;
    await shoot({ route, seed, steps: path.length ? ['wait:600', ...path] : undefined, name, time: h12(), wait: 2600 + path.reduce((a, s) => a + (s.startsWith('wait:') ? Number(s.slice(5)) : 450), 0) });
    if (!design || !ROWS.has(design)) {
      console.log(`${name}: shot (no frame for this arrival)`);
      continue;
    }
    let out;
    try {
      out = execFileSync('node', ['scripts/pixel-diff.mjs', `pixel-diff/design/${design}.png`, `pixel-diff/app/${name}.png`, name]).toString();
    } catch (e) {
      out = String(e.stdout ?? e);
    }
    console.log(`${name} vs ${design}: ${(out.match(/\(([\d.]+) %\)/) ?? [])[1] ?? out.split('\n')[0]} %`);
  }
}
