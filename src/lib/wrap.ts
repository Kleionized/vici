/**
 * Line breaks the design's engine chose.
 *
 * The frames set headings in `text-wrap: balance` and paragraphs in
 * `text-wrap: pretty`; iOS has neither and wraps greedily, so the same words
 * break in other places. `scripts/vici-ui-2/gen-wraps.mjs` reads every such run
 * out of the WebKit renders of `Vici UI 2` — the words, the size, the box width
 * and the lines it was drawn on — and `WRAPS` holds the result. `wrapAs` gives
 * a run back with a `\n` at each of those breaks when the box it is laid out in
 * is the width the frame drew it at; at any other width the run wraps as the
 * platform wraps it.
 */
import { WRAPS } from '@/content/wraps';

const near = (a: number, b: number) => Math.abs(a - b) < 0.5;

export function wrapAs(text: string, size: number, width: number | null): string {
  const entries = WRAPS[`${size}|${text}`];
  if (!entries || width == null) return text;
  const hit = entries.find((e) => near(e.w, width));
  return hit ? hit.lines.join('\n') : text;
}
