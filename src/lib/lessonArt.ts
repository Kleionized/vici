/**
 * One source of truth for how a lesson is *pictured* and *titled* across the
 * browser, the overview, and the player. Before this, each screen rotated the
 * cover art on its own index, so the same lesson wore three different faces.
 */

import { WORLDS } from '@/lib/worlds';

const ART = [
  require('../../assets/images/next-lesson-dark.webp'),
  require('../../assets/images/urge-wave.webp'),
  require('../../assets/images/urge-calm.webp'),
  require('../../assets/images/urge-waves.webp'),
];

/** Stable per-lesson cover, keyed on the lesson's place in the curriculum. */
export function lessonArt(orderIndex: number): number {
  return ART[Math.abs(orderIndex) % ART.length];
}

const NUMERALS: [number, string][] = [
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/** Weeks run past ten and evenings past nine, so this converts properly
 * rather than indexing a ten-entry table and falling back to digits. */
export function roman(n: number): string {
  let rest = Math.max(0, Math.round(n));
  let out = '';
  for (const [value, numeral] of NUMERALS) {
    while (rest >= value) {
      out += numeral;
      rest -= value;
    }
  }
  return out || String(n);
}

/** "Week II · The body first" — the week heading used by the browser. */
export function weekHeading(week: number): string {
  const world = WORLDS.find((item) => item.n === week);
  return world ? `Week ${roman(week)} · ${world.sub}` : `Week ${roman(week)}`;
}

/** "WEEK 2 · THE BODY FIRST" — the eyebrow used above a lesson title. */
export function weekEyebrow(week: number): string {
  const world = WORLDS.find((item) => item.n === week);
  return world ? `WEEK ${week} · ${world.sub.toUpperCase()}` : `WEEK ${week}`;
}

/** "Evening II · 6 min" — the meta line on a lesson tile. */
export function lessonTileMeta(dayInWeek: number, minutes: number): string {
  return `Evening ${roman(dayInWeek)} · ${minutes} min`;
}
