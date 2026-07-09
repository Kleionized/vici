/**
 * The journey's 10 worlds + 2 side-worlds — a 1:1 port of the design bundle's
 * `screens-worlds-art.jsx` data. A sea-to-summit metaphor: each world is a
 * themed cluster of the curriculum, tinted by an accent hue that shifts as you
 * climb (sea-blue → island-green → summit-violet).
 *
 * `state` / `done` here are the design defaults; the live screen overlays real
 * lesson progress on top (see `(app)/weeks.tsx`).
 */

export type WorldState = 'done' | 'current' | 'locked' | 'open';

export interface World {
  /** 1–10 for main-path worlds; undefined for side-worlds. */
  n?: number;
  key: string;
  name: string;
  sub: string;
  hue: number;
  count: number;
  mins: number;
  state: WorldState;
  done?: number;
  lessons: string[];
  side?: boolean;
  crisis?: boolean;
}

// ── the 10 main worlds ───────────────────────────────────────────────────────
export const WORLDS: World[] = [
  { n: 1, key: 'shore', name: 'The Landing', sub: 'Notice the pull', hue: 224, count: 20, mins: 7, state: 'current', done: 4,
    lessons: ['Why it grips you', 'Urges crest and fade', 'An urge is a wave', 'Spotting your triggers', 'HALT: four warning lights', 'The body before the urge'] },
  { n: 2, key: 'sailing', name: 'The Crossing', sub: 'Tools for the moment', hue: 210, count: 16, mins: 6, state: 'locked',
    lessons: ['HALT & the 10-minute delay', 'Play the tape forward', 'If-then plans', 'The chaser effect', 'The flatline', 'Name the emotion'] },
  { n: 3, key: 'deep', name: 'Deep Waters', sub: 'The why beneath', hue: 250, count: 6, mins: 8, state: 'locked',
    lessons: ["What it's really for", 'The EasyPeasy bleach', 'The willpower myth', 'Trigger chains', 'Boredom', "Replace, don't remove"] },
  { n: 4, key: 'island', name: 'Held Ground', sub: 'Meaning & values', hue: 176, count: 9, mins: 6, state: 'locked',
    lessons: ['Lead with the life', 'Your ordinary Tuesday', "What you're protecting", 'Values over rules', 'The life you actually want'] },
  { n: 5, key: 'base', name: 'First Camp', sub: "You're not alone", hue: 150, count: 10, mins: 6, state: 'locked',
    lessons: ['Telling one person', 'The power of being seen', 'When loneliness hits', 'Finding your people', 'Asking for help'] },
  { n: 6, key: 'climb', name: 'The Long March', sub: 'Mental models', hue: 134, count: 7, mins: 5, state: 'locked',
    lessons: ['Restructure the lapse', 'Self-compassion', "The hero's journey", 'A lapse is data', "Progress isn't linear", 'Identity change', 'Never fail twice'] },
  { n: 7, key: 'cave', name: 'The Watchfire', sub: 'Mindfulness', hue: 268, count: 4, mins: 5, state: 'locked',
    lessons: ['Urge surfing', 'You are not your thoughts', 'The mindfulness base', 'Curiosity over control'] },
  { n: 8, key: 'higher', name: 'High Ground', sub: 'Advanced toolkit', hue: 280, count: 9, mins: 7, state: 'locked',
    lessons: ['Healthy substitutes', 'Contingency management', 'Cue exposure', 'Behavioural activation', 'Acceptance & defusion', 'Distress tolerance', 'Breathing', 'Commitment devices', 'Relapse-prevention plan'] },
  { n: 9, key: 'clouds', name: 'The Gates', sub: 'Clinical roots', hue: 290, count: 9, mins: 8, state: 'locked',
    lessons: ['The science of craving', 'Your reward system', 'Neuroplasticity & rewiring', 'Why shame backfires', 'The addiction cycle', 'Tolerance & escalation', 'Sleep & recovery', 'Exercise as medicine', 'When to see a pro'] },
  { n: 10, key: 'summit', name: 'The Triumph', sub: 'Give it forward', hue: 300, count: 6, mins: 6, state: 'locked',
    lessons: ['Contribution', 'Build your stack', 'Leading indicators', 'The two-week experiment', 'Replacement, not a vacuum', 'The journal'] },
];

// ── the 2 branching side-worlds ──────────────────────────────────────────────
export const SIDE: World[] = [
  { key: 'curio', name: 'Curiosities & Experiments', sub: 'Optional self-tests', hue: 332, count: 7, mins: 4, state: 'open', side: true,
    lessons: ['Cold shower', 'Urge windows', 'Heavy meals', 'Greyscale phone', 'Dopamine reframe', 'Time-boxed challenges', 'Semen retention'] },
  { key: 'help', name: 'Get Help Now', sub: 'Crisis support', hue: 26, count: 4, mins: 0, state: 'open', side: true, crisis: true,
    lessons: ['Talk to someone now', 'Crisis & support lines', 'Grounding in 60 seconds', 'Make your space safe'] },
];

export const ALL_WORLDS: World[] = [...WORLDS, ...SIDE];
export const worldByKey = (k: string) => ALL_WORLDS.find((w) => w.key === k);

// short labels for the compact map nodes
export const SHORT: Record<string, string> = {
  shore: 'Shore', sailing: 'Sailing', deep: 'Deep Waters', island: 'New Island', base: 'Base camp',
  climb: 'The climb', cave: 'Checkpoint', higher: 'Higher up', clouds: 'Final stretch', summit: 'Summit',
};

// main-path node centres on the 402×874 map (bottom shore → top summit)
export const NODES: Record<string, [number, number]> = {
  summit: [204, 176], clouds: [270, 246], higher: [150, 316], cave: [262, 386],
  climb: [144, 456], base: [258, 526], island: [150, 596], deep: [264, 666],
  sailing: [156, 736], shore: [250, 806],
};
export const SIDE_NODES: Record<string, [number, number]> = { curio: [340, 492], help: [66, 770] };
export const PATH_ORDER = ['shore', 'sailing', 'deep', 'island', 'base', 'climb', 'cave', 'higher', 'clouds', 'summit'];

// smooth repeating wave-path helper (quadratic, repeats across the width)
export const seaPath = (y: number, a: number) => `M-10 ${y} q 52 ${-a} 104 0 t 104 0 t 104 0 t 104 0 t 104 0`;
export const seaFill = (y: number, a: number, h: number) => `${seaPath(y, a)} L 412 ${h} L -10 ${h} Z`;
