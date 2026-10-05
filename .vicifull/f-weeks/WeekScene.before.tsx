import { useId } from 'react';
import Svg, { ClipPath, Defs, Ellipse, LinearGradient as SvgLinearGradient, Path, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg';

import { WEEK_SCENES, type WeekSceneLayer } from '@/content/weekScenes';

/**
 * The picture at the top of a week overview — the 258pt band each `Week …`
 * frame opens with, drawn from the layer list transcribed out of the canvas.
 *
 * The canvas builds these from absolutely-positioned divs, so there is no
 * viewBox to copy: the band's own top-left is the origin and every offset is
 * band-local. Layers wider than the frame (the 473pt swells on a 393pt board)
 * overhang deliberately, so they are re-measured off the live width rather than
 * scaled — a narrower phone shows less of the same hill, not a smaller one.
 */

export const WEEK_SCENE_HEIGHT = 258;

/** The width the canvas composed against. */
const CANVAS_W = 393;

/**
 * `border-radius: 50% 50% 0 0 / Rpx Rpx 0 0` turns a box's whole top edge into
 * one elliptical arc of radii `w/2 × ry`. RN's single-value radii cannot say
 * that, so it is a path.
 */
function domePath(x: number, y: number, w: number, h: number, ry: number): string {
  return `M${x} ${y + ry}A${w / 2} ${ry} 0 0 1 ${x + w} ${y + ry}L${x + w} ${y + h}L${x} ${y + h}Z`;
}

/**
 * A rounded rect with four independently-cut corners.
 *
 * CSS scales all four by `f = min(1, side ÷ Σ radii)` on each edge before
 * drawing, so `5px 5px 16px 16px` on a 14.25-tall box is really
 * 3.39 / 3.39 / 10.86 / 10.86. Passing the declared values straight through
 * makes the path self-intersect.
 */
function cornersPath(x: number, y: number, w: number, h: number, c: number[]): string {
  const raw = c.length === 4 ? c : [c[0], c[1] ?? c[0], c[2] ?? c[0], c[3] ?? c[1] ?? c[0]];
  const f = Math.min(
    1,
    w / Math.max(1e-6, raw[0] + raw[1]),
    w / Math.max(1e-6, raw[3] + raw[2]),
    h / Math.max(1e-6, raw[0] + raw[3]),
    h / Math.max(1e-6, raw[1] + raw[2]),
  );
  const [tl, tr, br, bl] = raw.map((v) => v * f);
  return [
    `M${x + tl} ${y}`,
    `H${x + w - tr}`,
    `A${tr} ${tr} 0 0 1 ${x + w} ${y + tr}`,
    `V${y + h - br}`,
    `A${br} ${br} 0 0 1 ${x + w - br} ${y + h}`,
    `H${x + bl}`,
    `A${bl} ${bl} 0 0 1 ${x} ${y + h - bl}`,
    `V${y + tl}`,
    `A${tl} ${tl} 0 0 1 ${x + tl} ${y}`,
    'Z',
  ].join('');
}

/** `polygon(50% 0, 100% 100%, 0 100%)` against a `w × h` box. */
function polygonPoints(clip: string, x: number, y: number, w: number, h: number): string {
  const inner = clip.slice(clip.indexOf('(') + 1, clip.lastIndexOf(')'));
  return inner
    .split(',')
    .map((pair) => {
      const [px, py] = pair.trim().split(/\s+/);
      const cx = px.endsWith('%') ? (parseFloat(px) / 100) * w : parseFloat(px);
      const cy = py.endsWith('%') ? (parseFloat(py) / 100) * h : parseFloat(py);
      return `${x + cx},${y + cy}`;
    })
    .join(' ');
}

type Gradient =
  | { kind: 'radial'; stops: { offset: number; color: string; opacity: number }[] }
  | { kind: 'linear'; stops: { offset: number; color: string; opacity: number }[] }
  | null;

/** `rgba(226,186,120,0.42)` / `#E9D2A4` → colour plus its alpha. */
function splitColor(raw: string): { color: string; opacity: number } {
  const rgba = raw.match(/rgba?\(([^)]+)\)/);
  if (!rgba) return { color: raw.trim(), opacity: 1 };
  const parts = rgba[1].split(',').map((p) => Number(p.trim()));
  const [r, g, b, a = 1] = parts;
  const hex = `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
  return { color: hex, opacity: a };
}

/**
 * A CSS gradient, as its stops. `closest-side` on a square box is the box's own
 * half-width, which is what an SVG radial with `r = 50%` already is, so the
 * stop offsets carry straight over.
 */
function parseGradient(background: string): Gradient {
  if (!background.startsWith('radial-gradient') && !background.startsWith('linear-gradient')) return null;
  const kind = background.startsWith('radial-gradient') ? 'radial' : 'linear';
  const inner = background.slice(background.indexOf('(') + 1, background.lastIndexOf(')'));
  // Split on commas that are not inside a colour function.
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

  const stops: { offset: number; color: string; opacity: number }[] = [];
  for (const chunk of chunks) {
    const text = chunk.trim();
    // Skip the shape/direction keyword.
    if (/^(closest-side|farthest-side|closest-corner|farthest-corner|circle|ellipse|to |[0-9.]+deg)/.test(text)) continue;
    const stopAt = text.match(/\s([0-9.]+)%$/);
    const colorText = stopAt ? text.slice(0, stopAt.index).trim() : text;
    const { color, opacity } = splitColor(colorText);
    stops.push({ offset: stopAt ? Number(stopAt[1]) / 100 : stops.length === 0 ? 0 : 1, color, opacity });
  }
  return { kind, stops };
}

/** Abramowitz & Stegun 7.1.26 — good to 1.5e-7, which is far past 8-bit alpha. */
function erf(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return sign * y;
}

/**
 * A CSS blur has no RN SVG equivalent. For a gradient it is already a soft
 * falloff, so the blur only widens it slightly and is absorbed (D010). For a
 * solid shape — every blurred solid the twelve scenes carry is an ellipse, a
 * cast shadow or a glow — the blur *is* the shape, so it is redrawn as a soft
 * ellipse sampled off what the Gaussian actually does to it.
 *
 * The two CSS blurs are not the same Gaussian: `filter: blur(r)` states the
 * standard deviation itself, a `box-shadow`'s blur radius is 2σ. Both reach
 * this function already reduced to σ.
 *
 * The soft ellipse runs 2σ past the box the canvas states, which is where a
 * Gaussian has spent 95% of itself, and the profile is read along the longer
 * of the two axes: `across` is the blurred box profile along it and `erf(half)`
 * is what the ellipse still has left of its other extent there. That is the
 * pair of things a flat stop table gets wrong — a shape thinner than its own
 * blur never reaches its stated alpha (the canvas's flag shadow is a 56 × 10
 * ellipse of rgba(0,0,0,0.08) under blur(4) and peaks at 0.063, not 0.08), and
 * the falloff carries on outside the box (week X's 30 × 44 glow under blur(6)
 * reads about 54 × 68).
 *
 * A single radial cannot be right on both axes at once — the blur is isotropic
 * and the ellipse is not — so the cross-axis is read a little bright. Measured
 * against the canvas: within 1/255 on week I's flag shadow, about 6/255 at the
 * widest point of week X's glow.
 */
function blurredSolidStops(color: string, opacity: number, a: number, b: number, sigma: number) {
  const inv = 1 / (Math.max(sigma, 1e-6) * Math.SQRT2);
  const [along, cross] = a >= b ? [a, b] : [b, a];
  const drawn = along + 2 * sigma;
  const stops: { offset: number; color: string; opacity: number }[] = [];
  for (let i = 0; i <= 8; i++) {
    const u = i / 8;
    const t = u * drawn;
    // Held just short of the tip: at the tip itself the ellipse has no cross
    // extent left, and the profile would fall to nothing where the canvas
    // still has the blur carrying mass out from the body.
    const half = cross * Math.sqrt(Math.max(0, 1 - Math.min(t / Math.max(along, 1e-6), 0.98) ** 2));
    const across = 0.5 * (erf((along + t) * inv) + erf((along - t) * inv));
    stops.push({ offset: u, color, opacity: opacity * across * erf(half * inv) });
  }
  return { rx: a + 2 * sigma, ry: b + 2 * sigma, stops };
}

/** The canvas draws its birds as inline `<svg>`; those layers carry a tree. */
function SvgLayer({ layer }: { layer: WeekSceneLayer }) {
  const s = layer.svg;
  if (!s) return null;
  return (
    <Svg width={s.width} height={s.height} viewBox={s.viewBox} x={s.left} y={s.top}>
      {s.children.map((child, i) =>
        child.tag === 'path' ? (
          <Path
            key={i}
            d={child.attrs.d}
            fill={child.attrs.fill ?? 'none'}
            stroke={child.attrs.stroke}
            strokeWidth={Number(child.attrs['stroke-width']) || undefined}
            strokeLinecap={child.attrs['stroke-linecap'] as 'round' | undefined}
            strokeLinejoin={child.attrs['stroke-linejoin'] as 'round' | undefined}
          />
        ) : null,
      )}
    </Svg>
  );
}

function Layer({ layer, index, id, width }: { layer: WeekSceneLayer; index: number; id: string; width: number }) {
  if (layer.svg) return <SvgLayer layer={layer} />;
  // Layers composed against the canvas's own 393 keep their absolute lefts; the
  // ones that run past an edge are re-measured so they still run past it.
  //
  // The test is on the layer's *edges*, not on its width alone: week IX's two
  // hills are 270 and 290 wide and each ends 83pt beyond one edge of the 393
  // board, so a width-only test left both of them stopping short on any wider
  // screen and opened a valley between them that the canvas does not draw.
  const dw = layer.width ?? 0;
  const dl = layer.left ?? 0;
  const past = Math.max(0, -dl) + Math.max(0, dl + dw - CANVAS_W);
  const overhang = layer.width != null && past > 0;
  const w = overhang ? width - CANVAS_W + dw : (layer.width ?? width);
  const x = layer.left ?? (layer.right != null ? width - layer.right - w : 0);
  const h = layer.height ?? 0;
  const y = layer.top ?? (layer.bottom != null ? WEEK_SCENE_HEIGHT - layer.bottom - h : 0);

  const gradient = layer.background ? parseGradient(layer.background) : null;
  const solid = !gradient && layer.background ? splitColor(layer.background) : null;
  const gid = `wl${id}${index}`;
  const cid = `wc${id}${index}`;

  // A solid box with a blur is a cast shadow or a glow, so it becomes a soft
  // ellipse. `filter: blur(r)` states σ directly.
  const softSolid = solid && layer.blur ? blurredSolidStops(solid.color, solid.opacity, w / 2, h / 2, layer.blur) : null;

  const fill = gradient || softSolid ? `url(#${gid})` : solid?.color;
  const fillOpacity = gradient || softSolid ? 1 : solid?.opacity;
  const rotate = layer.rotate ? `rotate(${layer.rotate} ${x + w / 2} ${y + h / 2})` : undefined;

  // Every radial here is exactly its own shape's bounding ellipse — a CSS
  // `closest-side` on a box is half its width by half its height, which is what
  // an untouched `objectBoundingBox` radial already is. Said that way rather
  // than as `userSpaceOnUse` + `rx`/`ry` because `react-native-svg`'s web build
  // forwards `rx`/`ry` to the DOM verbatim and `<radialGradient>` has no such
  // attributes: the browser falls back to r = 50% of the *viewport*, which on
  // this 393 × 258 band is r ≈ 166 and spreads every falloff over the whole
  // scene. It is what turned week I's 46pt sun into a 106pt orange blob and its
  // flag shadow into a flat dark disc.
  const defs = (
    <Defs>
      {softSolid ? (
        <RadialGradient id={gid}>
          {softSolid.stops.map((s, i) => (
            <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
          ))}
        </RadialGradient>
      ) : null}
      {gradient?.kind === 'radial' ? (
        <RadialGradient id={gid}>
          {gradient.stops.map((s, i) => (
            <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
          ))}
        </RadialGradient>
      ) : null}
      {gradient?.kind === 'linear' ? (
        <SvgLinearGradient id={gid} x1={x} y1={y} x2={x} y2={y + h} gradientUnits="userSpaceOnUse">
          {gradient.stops.map((s, i) => (
            <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
          ))}
        </SvgLinearGradient>
      ) : null}
      {layer.clip ? (
        <ClipPath id={cid}>
          <Polygon points={polygonPoints(layer.clip, x, y, w, h)} />
        </ClipPath>
      ) : null}
    </Defs>
  );

  const common = {
    fill,
    fillOpacity,
    opacity: layer.opacity,
    transform: rotate,
    clipPath: layer.clip ? `url(#${cid})` : undefined,
  };

  // A zero-blur, zero-spread ring is directly expressible as a stroke.
  const ring = layer.shadow?.match(/^0 0 0 ([0-9.]+)px (rgba?\([^)]+\)|#[0-9A-Fa-f]{3,8})$/);
  const ringStroke = ring ? splitColor(ring[2]) : null;
  const strokeProps = ring ? { stroke: ringStroke!.color, strokeOpacity: ringStroke!.opacity, strokeWidth: Number(ring[1]) } : {};

  // An offset, blurred, zero-spread shadow is a soft shape under the layer.
  // Two layers carry one — the left page of week VII's and week XII's open book,
  // both `0 1px 2px rgba(0,0,0,0.06)` — and it is what lifts the page off the
  // base it sits on. A box-shadow's blur radius is 2σ, unlike `filter: blur()`,
  // and the soft shape is drawn one blur radius — two σ — past the box.
  const drop = layer.shadow?.match(/^(-?[0-9.]+)px? (-?[0-9.]+)px (-?[0-9.]+)px (rgba?\([^)]+\)|#[0-9A-Fa-f]{3,8})$/);
  const dropColor = drop ? splitColor(drop[4]) : null;
  const did = `wd${id}${index}`;
  const dx = drop ? Number(drop[1]) : 0;
  const dy = drop ? Number(drop[2]) : 0;
  const dblur = drop ? Number(drop[3]) : 0;
  const dropSoft = dropColor ? blurredSolidStops(dropColor.color, dropColor.opacity, w / 2, h / 2, dblur / 2) : null;

  let shape = null;
  if (softSolid) {
    // The blur is the shape: it is drawn at the size the Gaussian actually
    // covers, not at the box the canvas states, so this one layer's signature
    // row is wider and taller than the frame's own div by 2σ each way.
    shape = <Ellipse cx={x + w / 2} cy={y + h / 2} rx={softSolid.rx} ry={softSolid.ry} {...common} />;
  } else if (layer.radius.kind === 'ellipse') {
    shape = <Ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} {...common} {...strokeProps} />;
  } else if (layer.radius.kind === 'dome') {
    shape = <Path d={domePath(x, y, w, h, layer.radius.ry)} {...common} {...strokeProps} />;
  } else if (layer.radius.kind === 'corners') {
    shape = <Path d={cornersPath(x, y, w, h, layer.radius.corners)} {...common} {...strokeProps} />;
  } else {
    // CSS scales every radius by `min(1, side / Σ radii)` and then clamps each
    // to half the side; SVG clamps each axis independently, so a pill whose
    // 2r exceeds its height would draw an elliptical corner where the canvas
    // draws a circular one. Clamp before handing it over.
    const raw = layer.radius.kind === 'round' ? layer.radius.r : 0;
    const r = Math.min(raw, w / 2, h / 2);
    shape = <Rect x={x} y={y} width={w} height={h} rx={r} ry={r} {...common} {...strokeProps} />;
  }

  return (
    <>
      {defs}
      {dropSoft ? (
        <>
          <Defs>
            <RadialGradient id={did}>
              {dropSoft.stops.map((st, i) => (
                <Stop key={i} offset={st.offset} stopColor={st.color} stopOpacity={st.opacity} />
              ))}
            </RadialGradient>
          </Defs>
          <Ellipse cx={x + dx + w / 2} cy={y + dy + h / 2} rx={dropSoft.rx} ry={dropSoft.ry} fill={`url(#${did})`} />
        </>
      ) : null}
      {shape}
    </>
  );
}

export function WeekScene({ week, width }: { week: number; width: number }) {
  const id = useId().replace(/:/g, '');
  const layers = WEEK_SCENES[week] ?? [];
  return (
    <Svg width={width} height={WEEK_SCENE_HEIGHT} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      <Defs>
        <SvgLinearGradient id={`wsky${id}`} x1="0" y1="0" x2="0" y2={WEEK_SCENE_HEIGHT} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#F4F3F0" />
          <Stop offset="0.58" stopColor="#F3EEE1" />
          <Stop offset="1" stopColor="#F4F3F0" />
        </SvgLinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={WEEK_SCENE_HEIGHT} fill={`url(#wsky${id})`} />
      {layers.map((layer, index) => (
        <Layer key={index} layer={layer} index={index} id={id} width={width} />
      ))}
    </Svg>
  );
}
