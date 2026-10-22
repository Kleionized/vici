// Generates src/content/sosLibrary.data.ts and src/content/sosViz.ts from the
// bundle's own sos-library.js and sos-viz.js, so the app's 120 tasks, their
// rules' inputs and their 54 drawings are the bundle's, byte for byte.
//
//   node scripts/vici-ui-2/gen-sos.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import { unPaintOrder } from './svg.mjs';

const DIR = 'Vici UI 2/project';
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(`${DIR}/sos-library.js`, 'utf8'), ctx);
vm.runInContext(fs.readFileSync(`${DIR}/sos-viz.js`, 'utf8'), ctx);
const L = ctx.window.SOS_LIB;

/**
 * The tasks' copy, in plainer words where the bundle's read stiff or machine-made
 * (the copy pass, D49): each entry replaces that exact text wherever a task
 * carries it, and an entry that no longer matches stops the run.
 */
const PLAIN = {
  'You spent five minutes in agreed company.': 'You spent five minutes with someone.',
  'You spent five minutes beside someone who agreed to have company.': 'You sat with someone for five minutes.',
  'You spent five minutes on the task with agreed company.': 'You worked on the task for five minutes with someone nearby.',
  'You spent a few minutes in an agreed conversation about something else.': 'You talked about something else for a few minutes.',
  'You asked one question and stayed for the conversation if they wanted to talk.': 'You asked one question and talked if they wanted to.',
  'You took a permitted break; essential duties remained covered.': 'You took a five-minute break.',
  'You completed the permitted short break.': 'You took a short break.',
  'You made one appropriate attempt at conversation; their response is not required.': 'You asked one question. How they answered doesn’t matter.',
  'You had three seated minutes and water available.': 'You sat for three minutes with a glass of water.',
  'You ate one suitable snack without browsing.': 'You ate a snack without browsing.',
  'You ate a suitable snack with the phone down.': 'You ate a snack with the phone down.',
  'One normal load has started.': 'One load is in the wash.',
  'You returned with one chosen item.': 'You came back with one item.',
  'One chosen surface is clear.': 'One surface is clear.',
  'You spent five minutes eating in the chosen place.': 'You ate for five minutes away from the phone.',
  'You completed the short route and returned.': 'You walked the route and came back.',
  'You completed the short route.': 'You walked the route and came back.',
  'You completed the errand and returned.': 'You did the errand and came back.',
  'You completed the route with the conversation closed.': 'You walked the route without replying.',
  'You completed the short walk together and returned.': 'You walked together and came back.',
  'You spent five minutes in the public seating area and returned.': 'You sat outside for five minutes and came back.',
  'You identified the first question to attempt.': 'You found the first question to work on.',
  'You read two physical pages.': 'You read two pages.',
  'You named the event and paused for two minutes.': 'You named what happened and sat for two minutes.',
  'You prepared and ate breakfast away from the feed.': 'You ate breakfast away from the phone.',
  'You made and ate one snack away from the feed.': 'You ate a snack away from the phone.',
  'You spent two minutes on the intended activity.': 'You spent two minutes on what you meant to do.',
  'You worked on the required step for two minutes.': 'You worked on the next step for two minutes.',
  'You walked to the familiar point and returned.': 'You walked there and back.',
  'You left the bathroom and returned to the shared area.': 'You left the bathroom.',
  'The phone is away from the pillow and you have returned to bed.': 'The phone is away from the pillow and you’re back in bed.',
  'Wash your face with ordinary comfortable-temperature water, dry it, and return to bed.': 'Wash your face, dry it, and go back to bed.',
  'Wash your face with comfortable-temperature water and pat it dry.': 'Wash your face and pat it dry.',
  'Use your own equivalents; stop after the bag is ready.': 'Stop once the bag is ready.',
  'If daylight is available and privacy allows, put the phone down, open the curtains and sit facing the room for one minute.': 'If it’s light out, put the phone down, open the curtains and sit facing the room for one minute.',
  'lock it, finish what you came in to do, wash your hands and return to the appropriate shared area.': 'lock it, finish what you came in to do, wash your hands and leave.',
  'During an appropriate break, ask a willing colleague or classmate one normal question about the shared task or break plans. Keep the conversation brief; you do not need to disclose the urge.': 'On a break, ask a colleague or classmate one ordinary question about the work or their plans. Keep it short. You don’t need to mention the urge.',
};
const used = new Set();
const plain = (v) => {
  if (typeof v !== 'string') return v;
  let out = v;
  for (const [from, to] of Object.entries(PLAIN)) if (out.includes(from)) (out = out.split(from).join(to)), used.add(from);
  return out;
};
for (const a of L.acts) for (const k of Object.keys(a)) a[k] = plain(a[k]);
const unused = Object.keys(PLAIN).filter((k) => !used.has(k));
if (unused.length) throw new Error(`PLAIN entries match no task:\n${unused.join('\n')}`);
const head = (src) => `// Generated by scripts/vici-ui-2/gen-sos.mjs from \`Vici UI 2/project/${src}\`. Do not edit by hand.\n\n`;

const sits = Object.fromEntries(Object.entries(L.sits).map(([k, s]) => [k, { id: s.id, name: s.name, open: s.open }]));
fs.writeFileSync(
  'src/content/sosLibrary.data.ts',
  head('sos-library.js') +
    `import type { SosAction, SosSituation } from './sosLibrary';\n\n` +
    `export const SOS_SITUATIONS: Record<string, SosSituation> = ${JSON.stringify(sits, null, 2)};\n\n` +
    `export const SOS_ACTIONS: SosAction[] = ${JSON.stringify(L.acts, null, 2)};\n\n` +
    `export const SOS_NEEDS: Record<string, [string, string]> = ${JSON.stringify(L.NEEDS, null, 2)};\n`,
);
fs.writeFileSync(
  'src/content/sosViz.ts',
  head('sos-viz.js') +
    `/** The drawing for each task, as the inner markup of an SVG (\`#0D0D0D\` marks a cut-out; \`paint-order\` rewritten, scripts/vici-ui-2/svg.mjs). */\n` +
    `export const SOS_VIZ: Record<string, string> = ${JSON.stringify(Object.fromEntries(Object.entries(ctx.window.SOS_VIZ).map(([k, v]) => [k, unPaintOrder(v)])), null, 2)};\n\n` +
    `/** Each drawing's own bounding box, the viewBox it is shown through. */\n` +
    `export const SOS_VIZ_BOX: Record<string, string> = ${JSON.stringify(ctx.window.SOS_VIZ_BOX, null, 2)};\n`,
);
console.log(L.acts.length, 'actions', Object.keys(ctx.window.SOS_VIZ).length, 'drawings');
