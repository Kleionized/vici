/**
 * The five urge-intensity bands, and how a band maps to what is stored.
 *
 * This was a component — a vertical list of five rows, each with a strength
 * mark. The screens that ask about intensity draw their own rows now, so what
 * is left is the vocabulary they share: the words, and the arithmetic that
 * turns a band into the 1–10 severity the log keeps.
 */

export const INTENSITY_BANDS: { label: string; note: string }[] = [
  { label: 'Faint', note: 'Barely noticeable' },
  { label: 'Mild', note: 'Easy to set aside' },
  { label: 'Strong', note: 'Hard to ignore' },
  { label: 'Intense', note: 'Hard to resist' },
  { label: 'Overwhelming', note: 'Almost gave in' },
];

/** Band index (0–4) → stored severity (1–10). */
export const bandToSeverity = (i: number) => i * 2 + 2; // 2 · 4 · 6 · 8 · 10
