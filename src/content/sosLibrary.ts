/**
 * The SOS task library (`Vici UI 2/project/sos-library.js`): 120 tasks across
 * twelve situations, the answers the SOS asks for, and the rules that pick the
 * one task to suggest. The data is generated (`sosLibrary.data.ts`); the rules
 * below are the bundle's own, line for line, typed.
 */

import { SOS_ACTIONS, SOS_NEEDS, SOS_SITUATIONS } from './sosLibrary.data';

export { SOS_ACTIONS, SOS_NEEDS, SOS_SITUATIONS };

export type SosSituation = { id: string; name: string; open: string };

/** What a task asks of the place and the person (`a.t` in the bundle). */
export type SosTraits = Partial<
  Record<
    | 'seated' | 'quiet' | 'laptop' | 'move' | 'home' | 'kitchen' | 'sink' | 'book' | 'person' | 'shared' | 'clothes' | 'bag'
    | 'awake' | 'sleep' | 'inbed' | 'thirsty' | 'rest' | 'up' | 'toothbrush' | 'hungry' | 'out' | 'daytime' | 'shop'
    | 'purchase' | 'daylight' | 'task' | 'surface' | 'named' | 'paper' | 'plant' | 'library' | 'bench' | 'thread'
    | 'letter' | 'machine' | 'bread' | 'brk' | 'bathroom' | 'bottle' | 'workOnly',
    number
  >
>;

export type SosAction = {
  id: string;
  sit: string;
  title: string;
  steps: string;
  /** minutes, as the card prints them before " min" ("3", "1–2", "3–5") */
  dur: string;
  min: number;
  max: number;
  done: string;
  /** the drawing (`SOS_VIZ` key) */
  viz: string;
  /** the family no two suggestions in a row share */
  fam: string;
  t: SosTraits;
  timer?: number;
  count?: number;
  unit?: string;
  named?: string;
  taskTypes?: string[];
};

export const SOS_BY_ID: Record<string, SosAction> = Object.fromEntries(SOS_ACTIONS.map((a) => [a.id, a]));

/** `02 · Where are you` — key, label. */
export const SOS_PLACES = [
  ['private', 'Somewhere private'],
  ['bed', 'In bed'],
  ['public', 'A public space'],
  ['work', 'At work or school'],
  ['out', 'Out and about'],
] as const;
export type SosPlace = (typeof SOS_PLACES)[number][0];

/** `02B · In bed` — "Are you trying to sleep?" */
export const SOS_BED = [
  ['sleep', 'Yes'],
  ['awake', 'No, I’m staying up'],
  ['woke', 'I just woke up'],
  ['unsure', 'Not sure'],
] as const;
export type SosBed = (typeof SOS_BED)[number][0];

/** `03 · What’s feeding it` */
export const SOS_TRIGGERS = [
  ['online', 'Something online'],
  ['doom', 'Doomscrolling'],
  ['thought', 'A thought I keep returning to'],
  ['phonebed', 'Phone in bed'],
  ['routine', 'My usual routine'],
  ['cantsleep', 'Can’t sleep'],
  ['argument', 'An argument'],
  ['alone', 'Being alone'],
  ['putoff', 'Putting something off'],
  ['unknown', 'I don’t know'],
] as const;

/** `04 · What you’re feeling` */
export const SOS_FEELINGS = [
  ['on', 'Turned on'],
  ['bored', 'Bored'],
  ['lonely', 'Lonely'],
  ['stressed', 'Stressed or anxious'],
  ['angry', 'Angry'],
  ['low', 'Low'],
  ['tired', 'Tired'],
  ['restless', 'Restless'],
  ['hungry', 'Hungry'],
  ['unknown', 'I don’t know'],
] as const;

/** `03B · What you’re putting off` */
export const SOS_TASK_TYPES = [
  ['document', 'Document'],
  ['study', 'Study'],
  ['email', 'Email'],
  ['dishes', 'Dishes'],
  ['tidying', 'Tidying'],
  ['laundry', 'Laundry'],
  ['bill', 'Bill or letter'],
  ['other', 'Other'],
] as const;

/** The answers the rules read (`f` in the bundle). */
export type SosAnswers = {
  urge: number | null;
  loc: string | null;
  bed: string | null;
  trig: string[];
  feel: string[];
  task: string | null;
  /** needs the user has said no to */
  no: string[];
  /** every task suggested so far, in order */
  shown: string[];
  shortcut?: boolean;
  /** the tie-break seed (the bundle's frames use 7; a live urge picks one) */
  seed: number;
};

type Ctx = {
  hour: number;
  loc: string | null;
  T: string[];
  F: string[];
  no: string[];
  night: boolean;
  evening: boolean;
  away: boolean;
  sleep: boolean;
  woke: boolean;
  bedQuiet: boolean;
  home: boolean | null;
  outdoorOK: boolean;
  hungry: boolean;
  primary: string[];
};

const TRIG_SIT: Record<string, string> = { online: 'A', doom: 'A', thought: 'J', routine: 'D', argument: 'G', alone: 'F', putoff: 'H', unknown: 'J' };
const FEEL_SIT: Record<string, string> = { on: 'J', bored: 'D', lonely: 'F', stressed: 'E', angry: 'G', low: 'L', tired: 'I', restless: 'L', hungry: 'I', unknown: 'J' };

const outdoor = (a: SosAction) => Boolean(a.t.out || a.t.shop || a.t.library || a.t.bench);

export function sosContext(f: SosAnswers, hour: number): Ctx {
  const T = f.trig || [];
  const F = f.feel || [];
  const loc = f.loc;
  const no = f.no || [];
  const night = hour >= 22 || hour < 5;
  const evening = hour >= 17 && hour < 22;
  const away = loc === 'public' || loc === 'work' || loc === 'out';
  const sleep = !away && ((loc === 'bed' && f.bed === 'sleep') || (T.includes('cantsleep') && f.bed !== 'awake' && f.bed !== 'woke'));
  const woke = loc === 'bed' && f.bed === 'woke';
  const bedQuiet = loc === 'bed' && !sleep && !woke && f.bed !== 'awake';
  let home: boolean | null = loc === 'bed' ? true : away ? false : null;
  if (no.includes('home')) home = false;
  const outdoorOK = !night && !sleep && loc !== 'work' && !bedQuiet;
  const hungry = F.includes('hungry');
  const p: string[] = [];
  if (!f.shortcut) {
    if (sleep) p.push('B');
    if (woke) p.push('C');
    if (away) p.push('K');
    for (const [k] of SOS_TRIGGERS) {
      if (!T.includes(k)) continue;
      const s = k === 'phonebed' ? (sleep ? 'B' : 'A') : k === 'cantsleep' ? (sleep ? 'B' : 'L') : TRIG_SIT[k];
      if (!p.includes(s)) p.push(s);
    }
    for (const [k] of SOS_FEELINGS) {
      if (!F.includes(k)) continue;
      const s = FEEL_SIT[k];
      if (!p.includes(s)) p.push(s);
    }
  }
  return { hour, loc, T, F, no, night, evening, away, sleep, woke, bedQuiet, home, outdoorOK, hungry, primary: p };
}

export function sosNeeds(a: SosAction, c: Ctx): string[] {
  const t = a.t;
  const n: string[] = [];
  if (t.person) n.push('person');
  if (t.shop) n.push('shop');
  else if (t.library) n.push('library');
  else if (t.bench) n.push('bench');
  else if (t.out) n.push('route');
  if (t.home && c.home === null) n.push('home');
  if (t.task && !a.taskTypes) n.push('task');
  if (t.brk) n.push('brk');
  if (t.book) n.push('book');
  if (t.paper) n.push('paper');
  if (a.named) n.push(a.named);
  if (t.clothes) n.push(a.id === 'G09' ? 'towels' : 'clothes');
  if (t.bag) n.push('bag');
  if (t.bottle) n.push('bottle');
  if (t.plant) n.push('plant');
  if (t.machine) n.push('machine');
  if (t.thirsty) n.push('thirsty');
  if (t.bathroom) n.push('bathroom');
  if (t.laptop) n.push('laptop');
  return n;
}

export function sosEligible(a: SosAction, f: SosAnswers, c: Ctx): boolean {
  const t = a.t;
  if (t.sleep && !c.sleep) return false;
  if (t.up && !c.woke) return false;
  if (c.sleep && (t.awake || outdoor(a))) return false;
  if (c.sleep && a.sit !== 'B' && a.sit !== 'I' && !(t.seated && t.quiet && a.max <= 3)) return false;
  if (t.inbed && c.loc !== 'bed') return false;
  if (t.home && c.home === false) return false;
  if (outdoor(a) && !c.outdoorOK) return false;
  if (t.daytime && c.night) return false;
  if (t.hungry && !c.hungry) return false;
  if (a.taskTypes) {
    if (!c.T.includes('putoff')) return false;
    if (a.taskTypes[0] !== '*' && !a.taskTypes.includes(f.task ?? '')) return false;
  }
  if (t.thread && !c.T.includes('argument')) return false;
  if (t.workOnly && c.loc !== 'work') return false;
  if (t.brk && c.loc !== 'work' && c.loc !== 'public') return false;
  if (a.id === 'I07' && c.loc !== 'work') return false;
  if (t.machine && (c.night || c.hour >= 21)) return false;
  if (t.daylight && (c.hour < 6 || c.hour >= 20)) return false;
  if (c.loc === 'out' && (t.move || t.sink) && !outdoor(a)) return false;
  if (c.loc === 'work' && a.sit === 'A' && a.id === 'A02') return false;
  if (c.bedQuiet && !(t.seated && t.quiet)) return false;
  if (c.night && !t.quiet && !t.person) return false;
  if (a.sit === 'A' && !c.T.includes('online') && !c.T.includes('doom') && !c.T.includes('phonebed')) return false;
  const nd = sosNeeds(a, c);
  for (const need of nd) if (c.no.includes(need)) return false;
  return true;
}

function jitter(id: string, seed: number): number {
  let h = seed || 7;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 9973;
  return (h % 30) / 10;
}

function score(a: SosAction, f: SosAnswers, c: Ctx, first: boolean): number {
  let s = 0;
  const t = a.t;
  const m = a.max;
  const u = f.urge ?? 0;
  const pi = c.primary.indexOf(a.sit);
  if (pi === 0) s += 40;
  else if (pi > 0) s += 34 - pi * 3;
  else if (a.sit === 'J' || a.sit === 'L') s += 12;
  if (u >= 4) {
    s += m <= 3 ? 20 : m <= 5 ? 0 : -25;
    if (t.shop || t.library || t.bench) s -= 40;
  } else if (u === 3) s += m >= 2 && m <= 5 ? 12 : m < 2 ? 6 : -10;
  else s += m >= 3 && m <= 5 ? 8 : m < 3 ? 4 : 0;
  const nd = sosNeeds(a, c);
  s -= nd.length * 6;
  if (first && !nd.length && !t.move && !outdoor(a)) s += 10;
  if (c.night) {
    s += t.quiet ? 6 : -10;
    if (m <= 5) s += 4;
  }
  if (c.sleep && t.quiet && t.seated) s += 6;
  if (c.sleep && m > 5) s -= 10;
  if (c.away && t.seated) s += 8;
  if (c.evening && t.person) s += 3;
  if (outdoor(a)) s -= c.loc === 'out' ? 4 : 10;
  if (t.hungry) s += 6;
  if (a.taskTypes && a.taskTypes[0] !== '*') s += 15;
  if (c.woke && (a.id === 'C01' || a.id === 'C02' || a.id === 'C05')) s += 16;
  if (t.thread) s += 8;
  return s + jitter(a.id, f.seed);
}

/** The next task to suggest for these answers at this hour. */
export function nextSosAction(f: SosAnswers, hour: number): string {
  if (f.shortcut) return f.shown[f.shown.length - 1] === 'L01' ? 'J02' : 'L01';
  const c = sosContext(f, hour);
  const shown = f.shown || [];
  const last = shown[shown.length - 1];
  const la = last ? SOS_BY_ID[last] : undefined;
  let pool = SOS_ACTIONS.filter((a) => sosEligible(a, f, c));
  if (!pool.length) pool = ['J01', 'J02', 'L01'].map((id) => SOS_BY_ID[id]);
  let cand = pool.filter((a) => !shown.includes(a.id));
  if (!cand.length) cand = pool.filter((a) => a.id !== last);
  if (!cand.length) cand = pool;
  const used: Record<string, true> = {};
  for (const id of shown) used[SOS_BY_ID[id].fam] = true;
  let best = cand[0];
  let bs = -1e9;
  const first = !shown.length;
  for (const a of cand) {
    let s = score(a, f, c, first);
    if (used[a.fam]) s -= 60;
    if (la && a.fam === la.fam) s -= 200;
    if (la && a.sit === la.sit) s -= 18;
    if (s > bs) {
      bs = s;
      best = a;
    }
  }
  return best.id;
}
