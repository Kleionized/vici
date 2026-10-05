/**
 * Shared reading of a lesson reader frame.
 *
 * Every reader page is one of two shapes:
 *
 *  - a **centred column** — `position:absolute; inset:0; … justify-content:center;
 *    gap:Npx; padding:0 38px` — whose direct children are the page's parts in
 *    order. 1,241 of the 1,398 frames. The gap is the geometry; there are no
 *    absolute tops to owe the status bar's 54pt on.
 *  - a **board** — the pick and task-options pages, which lay themselves out
 *    from the top with a CTA at the foot and so state real tops.
 *
 * Both are read here so the extractor and the audits share one parser rather
 * than two that can drift.
 */

const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”',
  '&mdash;': '—', '&ndash;': '–', '&middot;': '·', '&hellip;': '…',
  '&times;': '×', '&deg;': '°', '&apos;': "'", '&#39;': "'", '&minus;': '−',
};

export const decode = (s) => s.replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e);

/**
 * The canvas prefixes a run it has edited with "· ". It is a design-tool
 * artefact, not drawn copy — every frame carries it on its status-bar clock.
 */
export const clean = (s) => decode(s).replace(/\s+/g, ' ').replace(/^·\s+/, '').trim();

export const decl = (style, prop) => (style.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`)) || [])[1]?.trim();
export const px = (v) => (v == null ? undefined : Number(String(v).replace('px', '')));

/**
 * True HTML voids only. The canvas writes every SVG child with an explicit
 * closing tag (`<path …></path>`), so listing `path`/`circle`/… here would make
 * the depth counter go negative and end a subtree early — which silently
 * truncated every option row that contains a glyph.
 */
const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source']);

/** End index (exclusive) of the tag opening at `from`, respecting quotes. */
function tagEnd(html, from) {
  let j = from + 1;
  let quote = null;
  while (j < html.length) {
    const ch = html[j];
    if (quote) { if (ch === quote) quote = null; }
    else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '>') return j + 1;
    j++;
  }
  return html.length;
}

/** The balanced subtree starting at the tag that opens at `from`. */
export function subtree(html, from) {
  let depth = 0;
  let i = from;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    const end = tagEnd(html, lt);
    const raw = html.slice(lt, end);
    const tag = (raw.match(/^<\/?\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase();
    if (raw[1] === '/') {
      depth--;
      if (depth === 0) return html.slice(from, end);
    } else if (!raw.endsWith('/>') && !VOID.has(tag)) {
      depth++;
    }
    i = end;
  }
  return html.slice(from);
}

/** Direct children of an element's subtree, as raw strings. */
export function children(sub) {
  const inner = sub.slice(sub.indexOf('>') + 1);
  const out = [];
  let i = 0;
  while (i < inner.length) {
    const lt = inner.indexOf('<', i);
    if (lt < 0) break;
    if (inner.startsWith('</', lt)) break;
    const s = subtree(inner, lt);
    out.push(s);
    i = lt + s.length;
  }
  return out;
}

export const styleOf = (sub) => (sub.match(/^<[a-z]+[^>]*\sstyle="([^"]*)"/i) || [])[1] ?? '';

/** The text an element draws, with its own tags stripped. */
export const textOf = (sub) => clean(sub.replace(/<[^>]*>/g, ''));

/** True when the element draws copy rather than art. */
export const isText = (sub) => /font-size:/.test(styleOf(sub));

const COLUMN_RE = /<div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:(\d+)px;[^"]*">/;

/**
 * The page's centred column: its gap and its direct children in paint order.
 * Returns null for the board pages, which have no such column.
 */
export function column(html) {
  const m = html.match(COLUMN_RE);
  if (!m) return null;
  const sub = subtree(html, m.index);
  return { gap: Number(m[1]), padding: px(decl(styleOf(sub), 'padding')?.split(/\s+/)[1]), kids: children(sub), raw: sub };
}

/** The thin progress rail every reader frame draws under the Close row. */
export function progress(html) {
  const m = html.match(/<div style="position:absolute; left:16px; right:16px; top:(\d+)px; height:(\d+)px;[^"]*">\s*<div style="[^"]*width:([\d.]+)%/);
  if (!m) return null;
  return { top: Number(m[1]) - 54, height: Number(m[2]), percent: Number(m[3]) };
}

/** Every absolutely-positioned box in a board page, with its own geometry. */
export function boxes(html) {
  const out = [];
  for (const m of html.matchAll(/<div style="(position:absolute;[^"]*)"/g)) {
    const style = m[1];
    out.push({
      style,
      left: px(decl(style, 'left')),
      right: px(decl(style, 'right')),
      // The canvas's 54pt status bar is not built, so the app owes 54 less.
      top: decl(style, 'top') != null ? px(decl(style, 'top')) - 54 : undefined,
      bottom: px(decl(style, 'bottom')),
      width: px(decl(style, 'width')),
      height: px(decl(style, 'height')),
      at: m.index,
    });
  }
  return out;
}
