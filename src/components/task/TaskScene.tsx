import { useId } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  FeColorMatrix,
  FeComposite,
  FeGaussianBlur,
  FeOffset,
  Filter,
  G,
  Line,
  LinearGradient as SvgLinearGradient,
  Mask,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { TASK_SCENE_H, TASK_SCENE_W, TASK_SCENES, type TaskSceneBox, type TaskSceneLayer, type TaskSvgChild } from '@/content/taskScenes';
import { fonts } from '@/lib/theme';

/**
 * A day's task illustration, drawn from the layer list transcribed off the
 * canvas. The scenes are composed against a 340 × 200 box; the whole thing
 * scales to whatever width it is given rather than reflowing, because the
 * canvas draws them at one size and scales them itself (0.85 on the intro
 * board, 0.682 into the card's banner).
 */

type TaskSceneBorders = NonNullable<TaskSceneBox['borders']>;

/** One corner's two radii: CSS gives every corner an x and a y of its own. */
type Corner = { x: number; y: number };
type Radii = { tl: Corner; tr: Corner; br: Corner; bl: Corner };

const NO_RADII: Radii = { tl: { x: 0, y: 0 }, tr: { x: 0, y: 0 }, br: { x: 0, y: 0 }, bl: { x: 0, y: 0 } };

/**
 * `50% 50% 0 0 / 26px 26px 0 0` and friends, resolved against a `w × h` box.
 *
 * Two things this used to get wrong. The elliptical form's vertical list was
 * read as one radius for all four corners, so `50% 50% 46% 46% / 66% 66% 34%
 * 34%` gave the bottom pair the top pair's height. And CSS's **overlapping
 * radius scale-down** was never applied: where two radii on one side add up to
 * more than that side, the spec scales all eight by the smallest f that makes
 * them fit. 202 layers overshoot without it — `3px 3px 19px 19px` on a 38 × 11
 * pot wants f = 0.5, and drawn literally the arcs run past the box and the path
 * doubles back on itself, which is the gold spike at each corner of Task D35's
 * plant pot and Task D14's lamp canopy.
 */
function radii(radius: string | undefined, w: number, h: number): Radii {
  if (!radius) return NO_RADII;
  const [horizontal, vertical] = radius.split('/').map((part) => part.trim());
  const read = (list: string, span: number) => list.split(/\s+/).map((v) => (v.endsWith('%') ? (parseFloat(v) / 100) * span : parseFloat(v)));
  const hs = read(horizontal, w);
  const vs = vertical ? read(vertical, h) : read(horizontal, h);
  // CSS fills a short list the shorthand way: 1 → all, 2 → tl/br + tr/bl, 3 → tl, tr/bl, br.
  const pick = (list: number[], i: number) => list[i] ?? list[i - 2] ?? list[i - 1] ?? list[0] ?? 0;
  const r: Radii = {
    tl: { x: pick(hs, 0), y: pick(vs, 0) },
    tr: { x: pick(hs, 1), y: pick(vs, 1) },
    br: { x: pick(hs, 2), y: pick(vs, 2) },
    bl: { x: pick(hs, 3), y: pick(vs, 3) },
  };
  const ratio = (span: number, a: number, b: number) => (a + b > 0 ? span / (a + b) : Infinity);
  const f = Math.min(
    1,
    ratio(w, r.tl.x, r.tr.x),
    ratio(h, r.tr.y, r.br.y),
    ratio(w, r.bl.x, r.br.x),
    ratio(h, r.tl.y, r.bl.y),
  );
  if (f >= 1) return r;
  const scale = (c: Corner) => ({ x: c.x * f, y: c.y * f });
  return { tl: scale(r.tl), tr: scale(r.tr), br: scale(r.br), bl: scale(r.bl) };
}

/**
 * The radii of a box inset by `d` on every side — the hole an inset shadow
 * leaves, or with a negative `d` the ring a spread throws outside it. CSS
 * leaves a square corner square however far a shadow spreads, so a zero radius
 * stays zero.
 */
function shrink(r: Radii, d: number): Radii {
  const at = (c: Corner) => ({ x: c.x ? Math.max(0, c.x - d) : 0, y: c.y ? Math.max(0, c.y - d) : 0 });
  return { tl: at(r.tl), tr: at(r.tr), br: at(r.br), bl: at(r.bl) };
}

/** `rgba(…)`/`#hex` → colour plus alpha, since RN SVG wants them apart. */
function splitColor(raw: string): { color: string; opacity: number } {
  const rgba = raw.trim().match(/rgba?\(([^)]+)\)/);
  if (!rgba) return { color: raw.trim(), opacity: 1 };
  const [r, g, b, a = 1] = rgba[1].split(',').map((p) => Number(p.trim()));
  return { color: `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`, opacity: a };
}

type Stops = { offset: number; color: string; opacity: number }[];

/** A CSS linear or radial gradient's stops, in order. */
function gradientStops(background: string): Stops | null {
  if (!/gradient\(/.test(background)) return null;
  const inner = background.slice(background.indexOf('(') + 1, background.lastIndexOf(')'));
  const chunks: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of inner) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      chunks.push(current);
      current = '';
    } else current += ch;
  }
  chunks.push(current);
  const stops: Stops = [];
  for (const chunk of chunks) {
    const text = chunk.trim();
    if (/^(closest-side|farthest-side|closest-corner|farthest-corner|circle|ellipse|from|at |to |[0-9.]+deg)/.test(text)) continue;
    // A stop states its position in per cent; without one it takes the end of
    // the ramp it sits at. Conic gradients never reach here — they are wedges,
    // not ramps, and `conicSectors` reads them instead.
    const pct = text.match(/\s([0-9.]+)%$/);
    const colorText = pct ? text.slice(0, pct.index).trim() : text;
    const { color, opacity } = splitColor(colorText);
    stops.push({ offset: pct ? Number(pct[1]) / 100 : stops.length === 0 ? 0 : 1, color, opacity });
  }
  // CSS interpolates a gradient premultiplied and SVG does not, so a zero-alpha
  // stop that names a different RGB tints the whole ramp toward that colour in
  // SVG and is a null in CSS. The rule (D048, FINDINGS F23) is that the fade
  // stop takes the opaque stop's RGB whatever the canvas writes at it — one
  // gradient in the art corpus writes `rgba(244,243,240,0)` against a `#F7F6F2`
  // end, which is 1.5/255 here but the wrong reading in general.
  for (let i = 0; i < stops.length; i++) {
    if (stops[i].opacity > 0) continue;
    const near = stops.find((s, j) => s.opacity > 0 && j > i) ?? [...stops].reverse().find((s) => s.opacity > 0);
    if (near) stops[i].color = near.color;
  }
  return stops.length ? stops : null;
}

/**
 * Where a radial gradient is centred and how far it reaches.
 *
 * 191 of the transcribed layers say `closest-side` and are centred, which is
 * the box's own middle and half its size — the value this always used. Two say
 * `circle at 34% 30%`, putting the highlight off-centre so the disc reads as a
 * lit sphere rather than a flat ring, and with no size keyword CSS resolves
 * that to `farthest-corner`. Ignoring the offset drew both suns flat.
 */
function radialGeometry(background: string, x: number, y: number, w: number, h: number) {
  const at = background.match(/\bat\s+([\d.]+)%\s+([\d.]+)%/);
  if (!at) return radialProps(x + w / 2, y + h / 2, w / 2, h / 2);
  const cx = x + (Number(at[1]) / 100) * w;
  const cy = y + (Number(at[2]) / 100) * h;
  // No size keyword means farthest-corner; `circle` makes the two radii equal.
  const dx = Math.max(cx - x, x + w - cx);
  const dy = Math.max(cy - y, y + h - cy);
  const r = Math.hypot(dx, dy);
  return /\bcircle\b/.test(background) ? radialProps(cx, cy, r, r) : radialProps(cx, cy, dx, dy);
}

/**
 * An elliptical radial gradient, stated so that both platforms draw the same
 * ellipse.
 *
 * `react-native-svg`'s web build renders `<RadialGradient>` as a raw
 * `<radialGradient>` and forwards `rx`/`ry`, which are not attributes of that
 * element — so a browser ignores them and falls back to `r = 50%`, spreading
 * every one of these gradients across half the whole scene box. That is why a
 * 64 × 10 ground shadow drew as a flat grey ellipse and the cover's 18pt sun
 * drew as a pale 85pt blob (D064). Stating `r` fixes the size; the ellipse is
 * then a `gradientTransform` scale about the centre, which both platforms read.
 */
function radialProps(cx: number, cy: number, rx: number, ry: number) {
  const r = rx || ry;
  return {
    cx,
    cy,
    rx: r,
    ry: r,
    r,
    gradientTransform: ry === rx || !r ? undefined : `translate(${cx} ${cy}) scale(1 ${ry / r}) translate(${-cx} ${-cy})`,
  };
}

/**
 * A CSS conic gradient's opaque wedges, in degrees clockwise from twelve.
 *
 * Eight scenes draw a clock or timer face this way — `conic-gradient(#E9D2A4
 * 0deg 126deg, rgba(0,0,0,0) 126deg 360deg)` is a 126° pie slice on a
 * transparent dial, not a colour ramp. Reading it as a radial ramp (which is
 * what happened) filled the whole face amber and lost the elapsed-time read.
 */
function conicSectors(background: string): { color: string; opacity: number; from: number; to: number }[] {
  const inner = background.slice(background.indexOf('(') + 1, background.lastIndexOf(')'));
  const out: { color: string; opacity: number; from: number; to: number }[] = [];
  let depth = 0;
  let current = '';
  const chunks: string[] = [];
  for (const ch of inner) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      chunks.push(current);
      current = '';
    } else current += ch;
  }
  chunks.push(current);
  let cursor = 0;
  for (const chunk of chunks) {
    const text = chunk.trim();
    if (!text || /^(from|at)\b/.test(text)) continue;
    const angles = [...text.matchAll(/(-?[\d.]+)deg/g)].map((m) => Number(m[1]));
    const colorText = text.replace(/\s*-?[\d.]+deg/g, '').trim();
    const { color, opacity } = splitColor(colorText);
    const from = angles.length ? angles[0] : cursor;
    const to = angles.length > 1 ? angles[1] : from;
    cursor = to;
    if (opacity > 0 && to > from) out.push({ color, opacity, from, to });
  }
  return out;
}

/**
 * A layer's CSS transform, rewritten as one SVG transform about the pivot the
 * canvas states.
 *
 * CSS transforms about `transform-origin`, whose default is the box's centre;
 * SVG transforms about the user-space origin. So the ops are wrapped in a
 * translate to the pivot and back. The canvas states nine different pivots
 * across the art corpus and leaves 109 rotations on the default centre — this
 * used to pivot every one of them at bottom-centre — and it skews and scales
 * as well as rotating, which nothing drew at all.
 */
function cssTransform(layer: { transform?: string; origin?: string; rotate?: number }, x: number, y: number, w: number, h: number) {
  const raw = layer.transform ?? (layer.rotate ? `rotate(${layer.rotate}deg)` : undefined);
  if (!raw) return undefined;
  // A layer that states no origin takes CSS's own default, the box's centre.
  // The bare `rotate` branch is the reading an older generator emitted; nothing
  // in the corpus states one now, and it keeps the pivot that generator assumed.
  const fallback: [number, number] = layer.transform ? [x + w / 2, y + h / 2] : [x + w / 2, y + h];
  const [ox, oy] = layer.origin ? pivot(layer.origin, x, y, w, h) : fallback;
  const ops: string[] = [];
  for (const [, name, args] of raw.matchAll(/([a-zA-Z]+)\(([^)]*)\)/g)) {
    const nums = args.split(',').map((v) => parseFloat(v));
    switch (name) {
      case 'rotate':
        ops.push(`rotate(${nums[0]})`);
        break;
      case 'skewX':
      case 'skewY':
        ops.push(`${name}(${nums[0]})`);
        break;
      case 'scale':
        ops.push(`scale(${nums[0]} ${nums[1] ?? nums[0]})`);
        break;
      case 'scaleX':
        ops.push(`scale(${nums[0]} 1)`);
        break;
      case 'scaleY':
        ops.push(`scale(1 ${nums[0]})`);
        break;
      case 'translate':
        ops.push(`translate(${nums[0]} ${nums[1] ?? 0})`);
        break;
      case 'translateX':
        ops.push(`translate(${nums[0]} 0)`);
        break;
      case 'translateY':
        ops.push(`translate(0 ${nums[0]})`);
        break;
      default:
        break;
    }
  }
  if (!ops.length) return undefined;
  return `translate(${ox} ${oy}) ${ops.join(' ')} translate(${-ox} ${-oy})`;
}

/** `bottom right`, `50% 100%`, `center 26px` … resolved against the layer's box. */
function pivot(origin: string, x: number, y: number, w: number, h: number): [number, number] {
  const words = origin.trim().split(/\s+/);
  const NAMED: Record<string, number> = { left: 0, top: 0, center: 0.5, right: 1, bottom: 1 };
  let cx: number | null = null;
  let cy: number | null = null;
  for (const word of words) {
    const axis = word === 'left' || word === 'right' ? 'x' : word === 'top' || word === 'bottom' ? 'y' : null;
    const value =
      word in NAMED
        ? NAMED[word]
        : word.endsWith('%')
          ? parseFloat(word) / 100
          : null;
    const px = value == null && word.endsWith('px') ? parseFloat(word) : null;
    if (axis === 'x') cx = x + NAMED[word] * w;
    else if (axis === 'y') cy = y + NAMED[word] * h;
    // An unnamed component fills the horizontal slot first, then the vertical.
    else if (px != null) {
      if (cx == null) cx = x + px;
      else cy = y + px;
    } else if (value != null) {
      if (cx == null) cx = x + value * w;
      else cy = y + value * h;
    }
  }
  return [cx ?? x + w / 2, cy ?? y + h / 2];
}

/**
 * A CSS linear gradient's line, in user space.
 *
 * `0deg` points to the top and the angle runs clockwise, so `90deg` is a
 * left-to-right ramp — which the fixed top-to-bottom line this used to draw
 * turned into a vertical one. Nine of the transcribed layers state an angle
 * other than 180: the bedside lamp's spill (90deg) and the light pooling on
 * the floor (100deg) were both pointing the wrong way.
 */
function linearGeometry(background: string, x: number, y: number, w: number, h: number) {
  const deg = Number((background.match(/\(\s*(-?[\d.]+)deg/) || [])[1] ?? 180);
  const rad = (deg * Math.PI) / 180;
  const cx = x + w / 2;
  const cy = y + h / 2;
  // The gradient line is long enough that the box's corners map onto its ends.
  const length = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
  const dx = (Math.sin(rad) * length) / 2;
  const dy = (-Math.cos(rad) * length) / 2;
  return { x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy };
}

/**
 * The bite a CSS mask takes out of a box, as a subpath.
 *
 * Eight scenes make their moon by masking a filled disc with
 * `radial-gradient(circle at Xpx Ypx, transparent Rpx, #000 R2px)` — a hole,
 * not a fade; the two radii are a third of a point apart. Dropping the mask
 * drew a full moon on every one of them.
 *
 * It has to be an SVG `<Mask>` rather than a second subpath: the hole is
 * centred outside the disc it bites, so both `evenodd` and `nonzero` would
 * paint the part of it that hangs over the edge.
 */
function maskHole(mask: string | undefined, x: number, y: number): string {
  const cut = mask?.match(/circle at ([\d.]+)px ([\d.]+)px,\s*transparent ([\d.]+)px,[^,]*?([\d.]+)px/);
  if (!cut) return '';
  const cx = x + Number(cut[1]);
  const cy = y + Number(cut[2]);
  const r = (Number(cut[3]) + Number(cut[4])) / 2;
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;
}

/** A pie slice of `r` about `(cx, cy)`, clockwise from twelve as CSS measures it. */
function sectorPath(cx: number, cy: number, r: number, from: number, to: number): string {
  const point = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return `${cx + r * Math.cos(rad)} ${cy + r * Math.sin(rad)}`;
  };
  if (to - from >= 360) return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;
  return `M${cx} ${cy}L${point(from)}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${point(to)}Z`;
}

/**
 * A box's outer `box-shadow` parts, split. The inset ones are drawn separately.
 *
 * 324 of these across the art corpus were being dropped, which is why the
 * canvas's cards and props sit on the ground and the app's floated flat on it.
 */
function outerShadows(shadow: string | undefined) {
  if (!shadow) return [];
  const out: { dx: number; dy: number; blur: number; spread: number; color: string; opacity: number }[] = [];
  for (const part of shadow.split(/,(?![^(]*\))/)) {
    const text = part.trim();
    if (!text || text.startsWith('inset')) continue;
    const ink = text.match(/rgba?\([^)]*\)|#[0-9A-Fa-f]{3,8}/);
    if (!ink) continue;
    // A zero offset is written bare, not `0px`, so read the lengths off the
    // part with the colour taken out rather than looking for the unit.
    const lengths = [...text.replace(ink[0], '').matchAll(/-?[\d.]+/g)].map((m) => Number(m[0]));
    if (lengths.length < 3) continue;
    const { color, opacity } = splitColor(ink[0]);
    out.push({ dx: lengths[0], dy: lengths[1], blur: lengths[2], spread: lengths[3] ?? 0, color, opacity });
  }
  return out;
}

/**
 * A box's `inset` box-shadow parts, split the same way.
 *
 * This used to read one shape only — `inset 0 0 0 Npx <colour>`, a spread with
 * no offset — and silently dropped every inset that moves. 121 of the 232 in
 * the corpus do: `inset 0 -3px 0 #D6D5D0` is the 3pt lip along the foot of a
 * book page, `inset 0 -2px 0 rgba(196,152,86,0.5)` the darker rim under a lamp
 * canopy, `inset -2px -2px 0 rgba(0,0,0,0.05)` the two-sided one on a pillow.
 */
function insetShadows(shadow: string | undefined) {
  if (!shadow) return [];
  const out: { dx: number; dy: number; blur: number; spread: number; color: string; opacity: number }[] = [];
  for (const part of shadow.split(/,(?![^(]*\))/)) {
    const text = part.trim();
    if (!text.startsWith('inset')) continue;
    const ink = text.match(/rgba?\([^)]*\)|#[0-9A-Fa-f]{3,8}/);
    if (!ink) continue;
    const lengths = [...text.replace(ink[0], '').matchAll(/-?[\d.]+/g)].map((m) => Number(m[0]));
    if (lengths.length < 3) continue;
    const { color, opacity } = splitColor(ink[0]);
    out.push({ dx: lengths[0], dy: lengths[1], blur: lengths[2], spread: lengths[3] ?? 0, color, opacity });
  }
  return out;
}

/**
 * The four border faces of a CSS box, as filled polygons.
 *
 * Eight layers are the border-triangle idiom — a `width:0; height:0` box whose
 * one solid border draws the shape and whose transparent ones cut its slope.
 * With `width` and `height` both zero the padding box is a single point and
 * each face's miters collapse onto it, so the face is a triangle: that is both
 * sails on the boats of plates 47, 83 and 84, the tail of plate 66's speech
 * bubble and the arrow on plate 18. Reading only `border-radius` left all eight
 * as an empty box.
 */
function borderFaces(borders: TaskSceneBorders | undefined, x: number, y: number, w: number, h: number) {
  if (!borders) return [];
  const width = (side: keyof TaskSceneBorders) => borders[side]?.width ?? 0;
  const [bt, br, bb, bl] = (['top', 'right', 'bottom', 'left'] as const).map(width);
  // `left`/`top` place the border box's outer edge; `width`/`height` are the content box.
  const [L, T, R, B] = [x, y, x + bl + w + br, y + bt + h + bb];
  const faces: Record<string, [number, number][]> = {
    top: [[L, T], [R, T], [R - br, T + bt], [L + bl, T + bt]],
    right: [[R, T], [R, B], [R - br, B - bb], [R - br, T + bt]],
    bottom: [[R, B], [L, B], [L + bl, B - bb], [R - br, B - bb]],
    left: [[L, B], [L, T], [L + bl, T + bt], [L + bl, B - bb]],
  };
  const out: { d: string; color: string; opacity: number }[] = [];
  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    const face = borders[side];
    if (!face?.width || face.color === 'transparent') continue;
    const { color, opacity } = splitColor(face.color);
    out.push({ d: `M${faces[side].map((p) => p.join(' ')).join('L')}Z`, color, opacity });
  }
  return out;
}

/**
 * SVG filters interpolate in linear RGB by default and CSS box-shadows do not,
 * which washes a stained blur out. Not in the typings, hence the cast.
 */
const SRGB = { colorInterpolationFilters: 'sRGB' } as unknown as Record<string, never>;

/** The `feColorMatrix` that stains a blurred alpha channel one flat colour. */
function stain(color: string, opacity: number) {
  const hex = color.replace('#', '');
  const at = (i: number) => parseInt(hex.length === 3 ? hex[i] + hex[i] : hex.slice(i * 2, i * 2 + 2), 16) / 255;
  return `0 0 0 0 ${at(0)} 0 0 0 0 ${at(1)} 0 0 0 0 ${at(2)} 0 0 0 ${opacity} 0`;
}

/**
 * A CSS `clip-path: polygon(...)` as a path, resolved against the layer's box.
 *
 * 53 layers cut their silhouette this way rather than with a radius — the
 * pencil's sharpened tip, the paper aeroplane, the wedge of lamplight on the
 * floor. Ignoring the clip drew each of them as the rectangle it is cut from.
 */
function clipPath(clip: string | undefined, x: number, y: number, w: number, h: number): string | null {
  const inner = clip?.match(/polygon\(([^)]*)\)/);
  if (!inner) return null;
  const points = inner[1].split(',').map((pair) => {
    const [px, py] = pair.trim().split(/\s+/);
    const at = (v: string, span: number, origin: number) => origin + (v.endsWith('%') ? (parseFloat(v) / 100) * span : parseFloat(v));
    return `${at(px, w, x)} ${at(py, h, y)}`;
  });
  return points.length < 3 ? null : `M${points.join('L')}Z`;
}

/** A rounded rect with four independently-cut corners, each one elliptical. */
function boxPath(x: number, y: number, w: number, h: number, r: Radii): string {
  return [
    `M${x + r.tl.x} ${y}`,
    `H${x + w - r.tr.x}`,
    `A${r.tr.x} ${r.tr.y} 0 0 1 ${x + w} ${y + r.tr.y}`,
    `V${y + h - r.br.y}`,
    `A${r.br.x} ${r.br.y} 0 0 1 ${x + w - r.br.x} ${y + h}`,
    `H${x + r.bl.x}`,
    `A${r.bl.x} ${r.bl.y} 0 0 1 ${x} ${y + h - r.bl.y}`,
    `V${y + r.tl.y}`,
    `A${r.tl.x} ${r.tl.y} 0 0 1 ${x + r.tl.x} ${y}`,
    'Z',
  ].join('');
}

const NUM = new Set(['x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2', 'stroke-width', 'offset', 'stroke-opacity', 'fill-opacity']);

/** Rename an SVG attribute to its react-native-svg prop. */
function svgProps(attrs: Record<string, string>) {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(attrs)) {
    const prop = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[prop] = NUM.has(key) && value !== '' && !Number.isNaN(Number(value)) ? Number(value) : value;
  }
  return out;
}

function SvgChild({ child, index }: { child: TaskSvgChild; index: number }) {
  const props = svgProps(child.attrs);
  switch (child.tag) {
    case 'path':
      return <Path key={index} {...props} />;
    case 'rect':
      return <Rect key={index} {...props} />;
    case 'circle':
      return <Circle key={index} {...props} />;
    case 'ellipse':
      return <Ellipse key={index} {...props} />;
    case 'line':
      return <Line key={index} {...props} />;
    case 'polygon':
      return <Polygon key={index} {...props} />;
    case 'polyline':
      return <Polyline key={index} {...props} />;
    case 'g':
      return <G key={index} {...props} />;
    default:
      return null;
  }
}

function Layer({ layer, index, id, box }: { layer: TaskSceneLayer; index: number; id: string; box: { w: number; h: number } }) {
  if (layer.kind === 'svg') {
    const { attrs, children } = layer.svg;
    return (
      <Svg
        width={layer.width ?? box.w}
        height={layer.height ?? box.h}
        viewBox={layer.viewBox ?? attrs.viewBox}
        style={{ position: 'absolute', left: layer.left ?? 0, top: layer.top ?? 0 }}>
        {children.map((child, i) => (
          <SvgChild key={i} child={child} index={i} />
        ))}
      </Svg>
    );
  }

  const w = layer.width ?? 0;
  const h = layer.height ?? 0;
  const x = layer.left ?? (layer.right != null ? box.w - layer.right - w : 0);
  const y = layer.top ?? 0;

  // Six layers in the corpus are groups rather than shapes — days 74 and 76
  // wrap their whole scene in a `scale(0.93)` box, and three lesson plates do
  // the same. Nothing drew their children at all, so both of those two task
  // scenes rendered as an empty frame.
  if (layer.children?.length) {
    return (
      <View
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          transform: layer.transform,
          transformOrigin: layer.origin,
          opacity: layer.opacity,
        }}>
        {layer.children.map((child, i) => (
          <Layer key={i} layer={child} index={index * 100 + i + 1} id={id} box={{ w, h }} />
        ))}
      </View>
    );
  }

  const r = radii(layer.radius, w, h);
  // Where a layer states a clip, that polygon *is* its shape.
  const shape = clipPath(layer.clip, x, y, w, h) ?? boxPath(x, y, w, h, r);
  const conic = layer.background && /conic-gradient/.test(layer.background) ? conicSectors(layer.background) : null;
  const stops = !conic && layer.background ? gradientStops(layer.background) : null;
  const solid = !conic && !stops && layer.background ? splitColor(layer.background) : null;
  const gid = `tl${id}${index}`;
  const isRadial = Boolean(layer.background && /radial/.test(layer.background));
  const tf = cssTransform(layer, x, y, w, h);
  const hole = maskHole(layer.mask, x, y);
  // `clip-path` clips an element's whole rendering, box-shadow included, and an
  // outer shadow lies outside the border box while the polygon lies inside it —
  // so a clipped layer draws no outer shadow at all. Two layers state both:
  // Task D39's trapezoid (`0 0 0 1px`) and Lesson 13's signpost
  // (`0 2px 5px rgba(40,38,32,0.14)`), and the frame draws neither.
  const outer = layer.clip ? [] : outerShadows(layer.shadow);
  // A spread with no blur is a ring outside the edge, not a cast — drawn as a
  // stroke under the fill rather than through the blur filter.
  const rings = outer.filter((sh) => !sh.blur && sh.spread);
  const casts = outer.filter((sh) => sh.blur);
  const insets = insetShadows(layer.shadow);
  const faces = borderFaces(layer.borders, x, y, w, h);
  // `filter: blur(N)` states σ directly, where a box-shadow's blur radius is
  // 2σ. D082 sampled the Gaussian into a radial ramp because RN SVG had no
  // blur; 15.15.4 carries `FeGaussianBlur` on both builds (D063) and this file
  // already blurs cast shadows with it, so the solids are blurred for real —
  // which is the only way the peak alpha and the 2σ spill past the box are
  // both right. The region has to be stated: the default clips a 5pt blur
  // inside its own bloom on a 10pt-tall shadow.
  const blur = layer.blur ?? 0;
  const bleed = blur * 3 + 2;

  return (
    <Svg width={box.w} height={box.h} style={{ position: 'absolute', left: 0, top: 0 }} opacity={layer.opacity}>
      {stops || conic || hole || casts.length || blur || insets.length ? (
        <Defs>
          {blur ? (
            <Filter
              id={`${gid}f`}
              filterUnits="userSpaceOnUse"
              x={x - bleed}
              y={y - bleed}
              width={w + bleed * 2}
              height={h + bleed * 2}
              {...SRGB}>
              <FeGaussianBlur stdDeviation={blur} />
            </Filter>
          ) : null}
          {casts.map((sh, i) => {
            // RN SVG has no `box-shadow`, but it does carry the filter
            // primitives on both platforms: blur the silhouette, offset it,
            // take the box back out of it and stain it the shadow's colour.
            // The `out` is what CSS means by "the shadow is drawn outside the
            // border edge only" — without it the shadow shows through any
            // translucent background, which is what greyed the glass on plate
            // 18's window and darkened the 6pt frame the canvas draws around it.
            const m = sh.blur * 1.5 + Math.abs(sh.dx) + Math.abs(sh.dy) + 2;
            return (
              <Filter
                key={i}
                id={`${gid}c${i}`}
                filterUnits="userSpaceOnUse"
                x={x - m}
                y={y - m}
                width={w + m * 2}
                height={h + m * 2}
                {...SRGB}>
                <FeGaussianBlur in="SourceAlpha" stdDeviation={sh.blur / 2} result="b" />
                <FeOffset in="b" dx={sh.dx} dy={sh.dy} result="o" />
                <FeComposite in="o" in2="SourceAlpha" operator="out" result="k" />
                <FeColorMatrix in="k" type="matrix" values={stain(sh.color, sh.opacity)} />
              </Filter>
            );
          })}
          {insets.length ? (
            // An inset shadow paints the padding box less the same box moved by
            // the offset and pulled in by the spread, so it is one even-odd
            // path clipped to the layer's own shape.
            <ClipPath id={`${gid}i`}>
              <Path d={shape} />
            </ClipPath>
          ) : null}
          {insets
            .map((sh, i) =>
              sh.blur ? (
                <Filter
                  key={i}
                  id={`${gid}i${i}b`}
                  filterUnits="userSpaceOnUse"
                  x={x - sh.blur * 2}
                  y={y - sh.blur * 2}
                  width={w + sh.blur * 4}
                  height={h + sh.blur * 4}
                  {...SRGB}>
                  <FeGaussianBlur stdDeviation={sh.blur / 2} />
                </Filter>
              ) : null,
            )
            .filter(Boolean)}
          {hole ? (
            <Mask id={`${gid}m`} maskUnits="userSpaceOnUse" x={0} y={0} width={box.w} height={box.h}>
              <Rect x={0} y={0} width={box.w} height={box.h} fill="#FFFFFF" />
              <Path d={hole} fill="#000000" />
            </Mask>
          ) : null}
          {conic ? (
            <ClipPath id={gid}>
              <Path d={shape} />
            </ClipPath>
          ) : !stops ? null : isRadial ? (
            <RadialGradient id={gid} {...radialGeometry(layer.background ?? '', x, y, w, h)} gradientUnits="userSpaceOnUse">
              {stops.map((s, i) => (
                <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
              ))}
            </RadialGradient>
          ) : (
            <SvgLinearGradient id={gid} {...linearGeometry(layer.background ?? '', x, y, w, h)} gradientUnits="userSpaceOnUse">
              {(stops ?? []).map((s, i) => (
                <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
              ))}
            </SvgLinearGradient>
          )}
        </Defs>
      ) : null}
      {/* CSS paints a box's shadow list in the order it is written, first on
          top, and the whole list behind the background. A cast under a ring is
          therefore the ring's ground, not its cover — 83 layers pair the two. */}
      {casts.map((sh, i) => (
        <Path key={`cast${i}`} d={shape} fill="#000000" filter={`url(#${gid}c${i})`} transform={tf} />
      ))}
      {rings.map((sh, i) => {
        // A spread lies wholly OUTSIDE the border box, so the stroke's
        // centreline is half a spread out and the stroke is one spread wide —
        // not two, centred on the edge, which is what this drew and which ate
        // 6pt of the window's own glass on plate 18 and 2.5pt of the phone's.
        const half = sh.spread / 2;

        return (
          <Path
            key={`ring${i}`}
            d={boxPath(x + sh.dx - half, y + sh.dy - half, w + sh.spread, h + sh.spread, shrink(r, -half))}
            fill="none"
            stroke={sh.color}
            strokeOpacity={sh.opacity}
            strokeWidth={sh.spread}
            transform={tf}
          />
        );
      })}
      {conic ? (
        // The dial's elapsed wedge, clipped by the face it is drawn on. Every
        // one of these is a circle, so the sector's radius is the box's own
        // half-diagonal — enough to reach the rim at any angle.
        conic.map((sector, i) => (
          <Path
            key={i}
            d={sectorPath(x + w / 2, y + h / 2, Math.hypot(w, h) / 2, sector.from, sector.to)}
            fill={sector.color}
            fillOpacity={sector.opacity}
            clipPath={`url(#${gid})`}
            transform={tf}
          />
        ))
      ) : (
        <Path
          d={shape}
          mask={hole ? `url(#${gid}m)` : undefined}
          filter={blur ? `url(#${gid}f)` : undefined}
          // SVG's initial `fill` is BLACK, so a layer that states no background
          // used to paint a black disc: 37 hollow rings across the corpus — Task
          // D56's clock face, Lesson 22's two orbit rings, Task D44's chain
          // links, Lesson 74's wheels — every one of them solid black.
          fill={stops ? `url(#${gid})` : (solid?.color ?? 'none')}
          fillOpacity={stops ? 1 : solid?.opacity}
          transform={tf}
        />
      )}
      {insets.map((sh, i) => (
        <Path
          key={`inset${i}`}
          // Everything outside the offset, spread-shrunk box, cut back to the
          // layer's own shape: even-odd against a rect wide enough to hold both.
          d={
            `M${x - bleed - 40} ${y - bleed - 40}H${x + w + bleed + 40}V${y + h + bleed + 40}H${x - bleed - 40}Z` +
            boxPath(x + sh.dx + sh.spread, y + sh.dy + sh.spread, Math.max(0, w - sh.spread * 2), Math.max(0, h - sh.spread * 2), shrink(r, sh.spread))
          }
          fillRule="evenodd"
          fill={sh.color}
          fillOpacity={sh.opacity}
          clipPath={`url(#${gid}i)`}
          filter={sh.blur ? `url(#${gid}i${i}b)` : undefined}
          transform={tf}
        />
      ))}
      {faces.map((face, i) => (
        <Path key={`border${i}`} d={face.d} fill={face.color} fillOpacity={face.opacity} transform={tf} />
      ))}
      {/* One layer in the whole corpus holds a run of type: the gold `?` on
          `Lesson 21`'s plate, centred in its own card. RN SVG inherits no font
          family, so the face is stated. */}
      {layer.text ? (
        <SvgText
          x={x + w / 2}
          y={y + h / 2}
          fill={layer.text.color}
          fontSize={layer.text.size}
          fontWeight={layer.text.weight}
          fontFamily={fonts.sans}
          textAnchor="middle"
          alignmentBaseline="central">
          {layer.text.s}
        </SvgText>
      ) : null}
    </Svg>
  );
}

/**
 * Any transcribed scene, drawn into the box the canvas composed it against and
 * scaled to whatever width it is given. The lesson-card plates are the same
 * construction in a 240 × 200 box, so they share this renderer.
 */
export function Scene({
  layers,
  boxW,
  boxH,
  width,
  height,
}: {
  layers: TaskSceneLayer[] | undefined;
  boxW: number;
  boxH: number;
  width: number;
  /**
   * The slot the frame states, where that is not the composition box scaled.
   * Days 74 and 76 state 340 x 186 and 340 x 164 for a 340 x 200 scene, wrap
   * their whole art in a `scale(0.93)` group and clip the rest; deriving the
   * height from the width put the clip 14pt below the one the canvas draws.
   */
  height?: number;
}) {
  const id = useId().replace(/:/g, '');
  if (!layers) return null;
  const scale = width / boxW;
  return (
    <View style={{ width, height: (height ?? boxH) * scale, overflow: 'hidden' }} pointerEvents="none">
      <View style={{ width: boxW, height: boxH, transform: [{ scale }], transformOrigin: 'top left' }}>
        {layers.map((layer, index) => (
          <Layer key={index} layer={layer} index={index} id={id} box={{ w: boxW, h: boxH }} />
        ))}
      </View>
    </View>
  );
}

export function TaskScene({ day, width, height }: { day: number; width: number; height?: number }) {
  return <Scene layers={TASK_SCENES[day]} boxW={TASK_SCENE_W} boxH={TASK_SCENE_H} width={width} height={height} />;
}
