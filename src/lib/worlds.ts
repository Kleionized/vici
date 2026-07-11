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
  { n: 1, key: 'shore', name: 'The Landing', sub: "Motivation & framing", hue: 224, count: 11, mins: 4, state: 'current', done: 4,
    lessons: ["Your reason doesn't have to be…", "Toward, not away", "The bad-day spike is math, not…", "Shrink the horizon", "The future-self letter", "Say your why out loud"] },
  { n: 2, key: 'sailing', name: 'The Crossing', sub: "The body first", hue: 210, count: 13, mins: 3, state: 'locked',
    lessons: ["Sleep is impulse control", "The 1 a.m. trap is a staging pr…", "Eat regularly or the floor drops", "Hydration nudges mood", "A day with shape resists cravings", "Move your body, drain the charge"] },
  { n: 3, key: 'deep', name: 'Deep Waters', sub: "Rebuild the space", hue: 250, count: 12, mins: 3, state: 'locked',
    lessons: ["Cues beat willpower", "Add friction everywhere", "Blockers", "Greyscale your phone", "The bedroom is for sleep", "Put the device out of reach"] },
  { n: 4, key: 'island', name: 'Held Ground', sub: "The mind's tools", hue: 176, count: 8, mins: 3, state: 'locked',
    lessons: ["Urge surfing", "You are not your thoughts", "EasyPeasy: there's nothing to g…", "Drop the willpower model", "CBT trigger chains", "Restructure the lapse"] },
  { n: 5, key: 'base', name: 'First Camp', sub: "Deeper patterns", hue: 150, count: 8, mins: 3, state: 'locked',
    lessons: ["Name the emotion, rob the urge", "Build a mindfulness base", "The 5-minute delay & HALT", "Play the tape forward", "Boredom is the real enemy", "Self-compassion beats self-flag…"] },
  { n: 6, key: 'climb', name: 'The Long March', sub: "Meaning & values", hue: 134, count: 11, mins: 3, state: 'locked',
    lessons: ["Frankl's why", "The deathbed lens", "The existential vacuum", "Three sources of meaning", "Sam's weeds-from-the-root", "The spiritual route"] },
  { n: 7, key: 'cave', name: 'The Watchfire', sub: "You're not alone", hue: 268, count: 10, mins: 3, state: 'locked',
    lessons: ["Loneliness triggers; connection…", "The Harvard 85-year finding", "An accountability partner", "Community and groups", "Replace the parasocial with the…", "The opposite sex as people, not…"] },
  { n: 8, key: 'higher', name: 'High Ground', sub: "The deeper work", hue: 280, count: 10, mins: 3, state: 'locked',
    lessons: ["The behaviour is often a symptom", "Inner-child work", "Trauma and the nervous system", "Attachment style shapes the pat…", "Screen for what's underneath", "Therapy is a strategy, not a fa…"] },
  { n: 9, key: 'clouds', name: 'The Gates', sub: "The craft of change", hue: 290, count: 11, mins: 3, state: 'locked',
    lessons: ["Different methods fit different…", "A lapse is data, not a verdict", "Track leading indicators", "Progress isn't linear", "The two-week experiment", "Replacement, not vacuum"] },
  { n: 10, key: 'summit', name: 'The Triumph', sub: "Make it yours", hue: 300, count: 10, mins: 3, state: 'locked',
    lessons: ["The patch logic: substitutes as…", "Never fail twice", "Reward the progress", "Let the trigger lose its charge", "Act your way out of the low mood", "The slip starts upstream"] },
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
