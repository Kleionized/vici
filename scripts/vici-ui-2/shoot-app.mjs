// Screenshots the app in the iPhone 16 simulator through the dev harness.
//
//   node scripts/vici-ui-2/shoot-app.mjs <screen> <state>:<name>[:<time>] ...  [--wait=1800]
//
// For each shot: the status bar is overridden to the frame's time (default 9:41),
// the harness server (harness-server.mjs, which the app polls) is told the
// screen and state, and after `--wait` ms the screen is saved to
// pixel-diff/app/<name>.png.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

export const UDID = '741DA6CE-82DA-4A8B-A1D8-12DD7558A0C5';
const simctl = (...a) => execFileSync('xcrun', ['simctl', ...a], { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function shoot({ screen, state, route, seed, clock, name, time = new Date(2026, 9, 21, 9, 41).toISOString(), wait = 1800, extra = {} }) {
  simctl('status_bar', UDID, 'override', '--time', time, '--batteryState', 'charged', '--batteryLevel', '100', '--cellularMode', 'active', '--cellularBars', '4', '--wifiBars', '3', '--dataNetwork', 'wifi');
  // the app polls the harness server for its next state (src/dev/HarnessDriver.tsx)
  await fetch('http://localhost:8099/target', { method: 'POST', body: JSON.stringify({ screen, state, route, seed, clock, extra }) });
  await sleep(wait);
  fs.mkdirSync('pixel-diff/app', { recursive: true });
  const out = `pixel-diff/app/${name}.png`;
  simctl('io', UDID, 'screenshot', '--type=png', out);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
  const [screen, ...specs] = args.filter((a) => !a.startsWith('--'));
  for (const spec of specs) {
    const [state, name, time] = spec.split(':');
    const out = await shoot({ screen, state, name: name ?? `${screen}__${state}`, time: time ? time.replace('.', ':') : undefined, wait: Number(flags.wait ?? 1800) });
    console.log(out);
  }
}
