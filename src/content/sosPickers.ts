/**
 * The two SOS grid pickers, generated from the frames by
 * `scripts/uifinal1/gen-pickers.mjs` — do not edit by hand.
 *
 * `102 · SOS Reason Picker` and `103 · SOS Feeling Picker` each replaced a
 * six-row list with a nine-card grid. Every label and every glyph below is the
 * canvas's own, read out of the frame's markup.
 *
 * The glyphs are the canvas's, and on twelve of the eighteen cards the canvas's
 * glyph belongs to a label from the list this grid replaced — see
 * `DECISIONS.md` D036. They are drawn as the frames draw them.
 */

/** One glyph, in the canvas's own `0 0 24 24` box. */
export interface PickerGlyphShape {
  /** Set only where the canvas fills the glyph instead of stroking it. */
  fill?: string;
  parts: { tag: 'path' | 'rect' | 'circle'; d?: string; x?: string; y?: string; width?: string; height?: string; rx?: string; cx?: string; cy?: string; r?: string; fill?: string }[];
}

export interface PickerCard {
  label: string;
  glyph: PickerGlyphShape;
}

/** `102 · What’s feeding it right now?` — nine cards, in the canvas's order. */
export const URGE_TRIGGERS: PickerCard[] = [
  { label: "Something online", glyph: { parts: [{ tag: "path", d: "M12 20.5s-7.6-4.7-9.3-9.1A5.2 5.2 0 0 1 12 6.4a5.2 5.2 0 0 1 9.3 5c-1.7 4.4-9.3 9.1-9.3 9.1z" }] } },
  { label: "Doomscrolling", glyph: { parts: [{ tag: "rect", x: "5", y: "3.5", width: "14", height: "17", rx: "2.5" }, { tag: "path", d: "M8.5 8h7M8.5 12h7M8.5 16h4.5" }] } },
  { label: "A stuck fantasy", glyph: { parts: [{ tag: "rect", x: "3", y: "8", width: "18", height: "12", rx: "2.5" }, { tag: "path", d: "M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" }] } },
  { label: "Phone in bed", glyph: { parts: [{ tag: "path", d: "M3 18v-6a2 2 0 0 1 2-2h9" }, { tag: "path", d: "M3 15h18v3" }, { tag: "rect", x: "15.5", y: "6", width: "5.5", height: "9", rx: "1.4" }] } },
  { label: "Pure habit", glyph: { parts: [{ tag: "path", d: "M4 11.5 12 4l8 7.5" }, { tag: "path", d: "M6.5 10v10h11V10" }] } },
  { label: "Can’t sleep", glyph: { parts: [{ tag: "rect", x: "3", y: "7", width: "18", height: "10.5", rx: "2.2" }, { tag: "circle", cx: "12", cy: "12.2", r: "2.5" }, { tag: "path", d: "M6.2 10h.01M17.8 14.5h.01" }] } },
  { label: "An argument", glyph: { parts: [{ tag: "path", d: "M3 12.5h4l2.5-6 3 11 2.5-6.5H21" }] } },
  { label: "Being alone", glyph: { parts: [{ tag: "circle", cx: "12", cy: "12", r: "8.5" }, { tag: "path", d: "M9.8 9.7a2.3 2.3 0 0 1 4.4.5c0 1.5-2.2 1.7-2.2 3.2M12 16.6h.01" }] } },
  { label: "I don’t know", glyph: { fill: "#1D1C1A", parts: [{ tag: "circle", cx: "5", cy: "12", r: "1.9" }, { tag: "circle", cx: "12", cy: "12", r: "1.9" }, { tag: "circle", cx: "19", cy: "12", r: "1.9" }] } },
];

/** `103 · What’s underneath it?` — nine cards, in the canvas's order. */
export const URGE_FEELINGS: PickerCard[] = [
  { label: "Turned on", glyph: { parts: [{ tag: "path", d: "M4.5 10.5h15a7.5 6.5 0 0 1-15 0z" }, { tag: "path", d: "M9.5 7c0-1 .7-1.3.7-2.3M13.8 7c0-1 .7-1.3.7-2.3" }] } },
  { label: "Bored", glyph: { parts: [{ tag: "path", d: "M13 2L5 13.5h5.5L10 22l8-11.5h-5.5z" }] } },
  { label: "Lonely", glyph: { parts: [{ tag: "circle", cx: "12", cy: "8", r: "3.6" }, { tag: "path", d: "M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" }] } },
  { label: "Stressed or anxious", glyph: { parts: [{ tag: "path", d: "M14.5 3.5a8.5 8.5 0 1 0 6 12.5 8 8 0 0 1-6-12.5z" }] } },
  { label: "Angry", glyph: { parts: [{ tag: "path", d: "M3.5 13c2.4-3.4 4.6-3.4 7 0s4.6 3.4 7 0" }, { tag: "path", d: "M6.5 7h.01M14.5 7h.01" }] } },
  { label: "Low", glyph: { parts: [{ tag: "path", d: "M3 13.5h3.5L9 8l3 9 2.5-6.5 1.5 3H21" }] } },
  { label: "Tired", glyph: { parts: [{ tag: "path", d: "M4.5 10.5h15a7.5 6.5 0 0 1-15 0z" }, { tag: "path", d: "M9.5 7c0-1 .7-1.3.7-2.3M13.8 7c0-1 .7-1.3.7-2.3" }] } },
  { label: "Restless", glyph: { parts: [{ tag: "path", d: "M13 2L5 13.5h5.5L10 22l8-11.5h-5.5z" }] } },
  { label: "I don’t know", glyph: { parts: [{ tag: "circle", cx: "12", cy: "8", r: "3.6" }, { tag: "path", d: "M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" }] } },
];
