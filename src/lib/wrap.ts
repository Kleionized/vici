/**
 * Line breaks the design's engine chose.
 *
 * The frames set headings in `text-wrap: balance` and paragraphs in
 * `text-wrap: pretty`; iOS has neither and wraps greedily, so the same words
 * break in other places. `scripts/vici-ui-2/gen-wraps.mjs` reads every such run
 * out of the WebKit renders of `Vici UI 2` — the words (a paragraph with a 700
 * run in it is one run), the size, the box width and the lines it was drawn
 * on — and `WRAPS` holds the result. `wrapAs` gives a run back with a `\n` at
 * each of those breaks when the box it is laid out in is the width the frame
 * drew it at; at any other width, or with the text made larger in Settings,
 * the run wraps as the platform wraps it.
 */
import { PixelRatio } from 'react-native';

import { WRAPS } from '@/content/wraps';

const near = (a: number, b: number) => Math.abs(a - b) < 0.5;

/** Whether the frames drew this run broken at all (at any width). */
export function hasWraps(text: string, size: number): boolean {
  return WRAPS[`${size}|${text}`] !== undefined;
}

/** The lines the frame drew the run on in a box `width` wide, or null. */
export function linesAs(text: string, size: number, width: number | null): string[] | null {
  const entries = WRAPS[`${size}|${text}`];
  if (!entries || width == null || PixelRatio.getFontScale() !== 1) return null;
  return entries.find((e) => near(e.w, width))?.lines ?? null;
}

export function wrapAs(text: string, size: number, width: number | null): string {
  return linesAs(text, size, width)?.join('\n') ?? text;
}
