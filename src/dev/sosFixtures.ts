/**
 * The SOS frames' presets, copied from `Vici UI 2/project/Vici SOS.dc.html`
 * (`build()`): every board the canvas draws, by the id it draws it under. The
 * dev harness opens the flow on one of them. Development builds only.
 */
import type { SosPreset } from '@/components/urge/sos';
import { SOS_ACTIONS, SOS_BY_ID } from '@/content/sosLibrary';

const ex1: SosPreset = { clock: '00:20', urge: 5, loc: 'bed', bed: 'sleep', trig: ['phonebed'], feel: ['on', 'tired'] };
const day: SosPreset = { clock: '15:00', urge: 2, loc: 'private', trig: ['routine'], feel: ['bored'] };
const work: SosPreset = { clock: '14:00', urge: 4, loc: 'work', trig: ['doom'], feel: ['stressed'] };

export const SOS_PRESETS: Record<string, SosPreset> = {
  live: {},
  s01: { step: 'rate' },
  s02: { step: 'loc', urge: 3 },
  s02b: { step: 'loc', urge: 3, loc: 'bed' },
  s03: { step: 'trig', urge: 3, loc: 'private' },
  s03b: { step: 'task', urge: 3, loc: 'private', trig: ['putoff'] },
  s04: { step: 'feel', urge: 3, loc: 'private' },
  s05: { step: 'suggest', ...ex1 },
  s05b: { step: 'suggest', cur: 'D06', ...day },
  s05d: { step: 'suggest', ...work },
  s06: { step: 'do', cur: 'D10', since: 252, ...day },
  s06b: { step: 'do', cur: 'D01', since: 518, ...ex1 },
  s06d: { step: 'do', cur: 'D10', hub: 'breathe', since: 340, ...day },
  s06e: { step: 'do', cur: 'D10', hub: 'reason', since: 340, ...day },
  s06f: { step: 'do', cur: 'D10', hub: 'helped', since: 340, ...day },
  s07: { step: 'check', cur: 'K01', ...work },
  s07b: { step: 'check', cur: 'K01', after: 2, ...work },
  s07c: { step: 'check', cur: 'D10', ...day, urge: 3, after: 3 },
  s07d: { step: 'more', cur: 'D10', ...day, urge: 3, after: 3 },
  s08: { step: 'end', cur: 'K01', after: 2, since: 412, ...work },
  s08b: { step: 'end', after: 0, noTask: true, ...day },
};

const SITP: Record<string, SosPreset> = {
  A: { clock: '15:10', urge: 3, loc: 'private', trig: ['doom'], feel: ['bored'] },
  B: { clock: '00:20', urge: 4, loc: 'bed', bed: 'sleep', trig: ['phonebed'], feel: ['tired'] },
  C: { clock: '08:10', urge: 3, loc: 'bed', bed: 'woke', trig: ['routine'], feel: ['bored'] },
  D: { clock: '15:00', urge: 2, loc: 'private', trig: ['routine'], feel: ['bored'] },
  E: { clock: '14:00', urge: 3, loc: 'private', trig: [], feel: ['stressed'] },
  F: { clock: '18:30', urge: 3, loc: 'private', trig: ['alone'], feel: ['lonely'] },
  G: { clock: '19:00', urge: 3, loc: 'private', trig: ['argument'], feel: ['angry'] },
  H: { clock: '11:00', urge: 2, loc: 'private', trig: ['putoff'], feel: [] },
  I: { clock: '21:30', urge: 2, loc: 'private', trig: [], feel: ['tired', 'hungry'] },
  J: { clock: '16:30', urge: 4, loc: 'private', trig: ['thought'], feel: ['on'] },
  K: { clock: '14:00', urge: 4, loc: 'work', trig: ['doom'], feel: ['stressed'] },
  L: { clock: '17:30', urge: 3, loc: 'private', trig: [], feel: ['low', 'restless'] },
};
const OVR: Record<string, SosPreset> = { I05: { clock: '23:30', loc: 'bed', bed: 'sleep' }, I07: { clock: '13:00', loc: 'work' }, I08: { clock: '13:00', loc: 'work' } };

for (const a of SOS_ACTIONS) {
  const p: SosPreset = { ...SITP[a.sit], ...OVR[a.id], step: 'suggest', cur: a.id };
  if (a.taskTypes) p.task = a.taskTypes[0] === '*' ? 'other' : a.taskTypes[0];
  SOS_PRESETS[a.id] = p;
}

/** The canvas's sample history (`helpedList`): id, when, strength before, after. */
const HISTORY: [string, string, number, number][] = [
  ['E02', 'Thu, 3:10 pm', 4, 2],
  ['A01', 'Wed, 10:40 pm', 3, 3],
  ['L02', 'Tue, 11:48 pm', 3, 1],
  ['F02', 'Sun, 9:22 pm', 4, 2],
  ['K01', 'Fri, 1:15 pm', 3, 2],
];

export function sosFixture(cur: string | null | undefined) {
  return {
    pledge: { words: 'The mornings are mine again.', name: 'Jerry', signed: 'Today, 8:12 am' },
    helped: HISTORY.filter((h) => h[0] !== cur && h[3] < h[2] && SOS_BY_ID[h[0]])
      .slice(0, 3)
      .map((h) => ({ id: h[0], title: SOS_BY_ID[h[0]].title, meta: `${h[1]} · Strength ${h[2]} → ${h[3]}` })),
  };
}

/** The renders' clock: the canvas builds its frames at 2026-10-21 09:41:00 and is captured 2 s later. */
export const HARNESS_BUILT = new Date('2026-10-21T09:41:00').getTime();
export const HARNESS_NOW = HARNESS_BUILT + 2000;
