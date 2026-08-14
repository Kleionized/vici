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

/** A rounded rect with four independently-cut corners. */
function cornersPath(x: number, y: number, w: number, h: number, c: number[]): string {
  const [tl, tr, br, bl] = c.length === 4 ? c : [c[0], c[1] ?? c[0], c[2] ?? c[0], c[3] ?? c[1] ?? c[0]];
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

/**
 * A CSS blur has no RN SVG equivalent. For a gradient it is already a soft
 * falloff, so the blur only widens it slightly and is absorbed. For a solid
 * shape — the shadow ellipses — the blur *is* the shape, so it is redrawn as a
 * radial whose alpha is halved at the box's own edge and gone one blur out,
 * which is what a Gaussian of σ = blur/2 actually does.
 */
function blurredSolidStops(color: string, opacity: number) {
  return [
    { offset: 0, color, opacity },
    { offset: 0.5, color, opacity: opacity * 0.72 },
    { offset: 0.78, color, opacity: opacity * 0.3 },
    { offset: 1, color, opacity: 0 },
  ];
}

function Layer({ layer, index, id, width }: { layer: WeekSceneLayer; index: number; id: string; width: number }) {
  // Layers composed against the canvas's own 393 keep their absolute lefts; the
  // ones that overhang are re-measured so they still run past both edges.
  const overhang = (layer.width ?? 0) > CANVAS_W;
  const w = overhang ? width + ((layer.width as number) - CANVAS_W) : (layer.width ?? width);
  const x = layer.left ?? (layer.right != null ? width - layer.right - w : 0);
  const h = layer.height ?? 0;
  const y = layer.top ?? (layer.bottom != null ? WEEK_SCENE_HEIGHT - layer.bottom - h : 0);

  const gradient = layer.background ? parseGradient(layer.background) : null;
  const solid = !gradient && layer.background ? splitColor(layer.background) : null;
  const gid = `wl${id}${index}`;
  const cid = `wc${id}${index}`;

  // A solid box with a blur is a cast shadow, so it becomes a soft radial.
  const softSolid = solid && layer.blur ? blurredSolidStops(solid.color, solid.opacity) : null;

  const fill = gradient || softSolid ? `url(#${gid})` : solid?.color;
  const fillOpacity = gradient || softSolid ? 1 : solid?.opacity;
  const rotate = layer.rotate ? `rotate(${layer.rotate} ${x + w / 2} ${y + h / 2})` : undefined;

  const defs = (
    <Defs>
      {softSolid ? (
        <RadialGradient id={gid} cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} gradientUnits="userSpaceOnUse">
          {softSolid.map((s, i) => (
            <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
          ))}
        </RadialGradient>
      ) : null}
      {gradient?.kind === 'radial' ? (
        <RadialGradient id={gid} cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} gradientUnits="userSpaceOnUse">
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

  let shape = null;
  if (layer.radius.kind === 'ellipse') {
    shape = <Ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} {...common} />;
  } else if (layer.radius.kind === 'dome') {
    shape = <Path d={domePath(x, y, w, h, layer.radius.ry)} {...common} />;
  } else if (layer.radius.kind === 'corners') {
    shape = <Path d={cornersPath(x, y, w, h, layer.radius.corners)} {...common} />;
  } else {
    const r = layer.radius.kind === 'round' ? layer.radius.r : 0;
    shape = <Rect x={x} y={y} width={w} height={h} rx={r} ry={r} {...common} />;
  }

  return (
    <>
      {defs}
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
