import { useId } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient as SvgLinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { TASK_SCENE_H, TASK_SCENE_W, TASK_SCENES, type TaskSceneLayer, type TaskSvgChild } from '@/content/taskScenes';

/**
 * A day's task illustration, drawn from the layer list transcribed off the
 * canvas. The scenes are composed against a 340 × 200 box; the whole thing
 * scales to whatever width it is given rather than reflowing, because the
 * canvas draws them at one size and scales them itself (0.85 on the intro
 * board, 0.682 into the card's banner).
 */

/** `50% 50% 0 0 / 26px 26px 0 0` and friends, resolved against a `w × h` box. */
function radii(radius: string | undefined, w: number, h: number) {
  if (!radius) return { tl: 0, tr: 0, br: 0, bl: 0, ry: 0 };
  if (radius === '50%') return { tl: w / 2, tr: w / 2, br: w / 2, bl: w / 2, ry: h / 2 };
  const [horizontal, vertical] = radius.split('/').map((part) => part.trim());
  const hs = horizontal.split(/\s+/).map((v) => (v.endsWith('%') ? (parseFloat(v) / 100) * w : parseFloat(v)));
  const vs = vertical ? vertical.split(/\s+/).map((v) => (v.endsWith('%') ? (parseFloat(v) / 100) * h : parseFloat(v))) : null;
  const pick = (list: number[], i: number) => list[i] ?? list[i - 2] ?? list[i - 1] ?? list[0] ?? 0;
  return {
    tl: pick(hs, 0),
    tr: pick(hs, 1),
    br: pick(hs, 2),
    bl: pick(hs, 3),
    ry: vs ? pick(vs, 0) : 0,
  };
}

/** `rgba(…)`/`#hex` → colour plus alpha, since RN SVG wants them apart. */
function splitColor(raw: string): { color: string; opacity: number } {
  const rgba = raw.trim().match(/rgba?\(([^)]+)\)/);
  if (!rgba) return { color: raw.trim(), opacity: 1 };
  const [r, g, b, a = 1] = rgba[1].split(',').map((p) => Number(p.trim()));
  return { color: `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`, opacity: a };
}

type Stops = { offset: number; color: string; opacity: number }[];

/** A CSS gradient's stops, in order. `conic` is approximated by its first pair. */
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
    // A conic stop states its extent in degrees (`#E9D2A4 0deg 126deg`) and a
    // linear/radial one in per cent. Strip either before reading the colour, or
    // the whole chunk goes through as the stop's `stopColor`.
    const pct = text.match(/\s([0-9.]+)%$/);
    const deg = text.match(/^(.*?)((?:\s+-?[0-9.]+deg)+)$/);
    const colorText = pct ? text.slice(0, pct.index).trim() : deg ? deg[1].trim() : text;
    const { color, opacity } = splitColor(colorText);
    const degStop = deg ? Number(deg[2].trim().split(/\s+/).pop()!.replace('deg', '')) / 360 : null;
    stops.push({ offset: pct ? Number(pct[1]) / 100 : (degStop ?? (stops.length === 0 ? 0 : 1)), color, opacity });
  }
  return stops.length ? stops : null;
}

/**
 * A blurred solid is a cast shadow: redrawn as a radial whose alpha is halved
 * at the box's own edge and gone one blur out, which is what a Gaussian of
 * σ = blur/2 actually does. RN SVG has no blur filter.
 */
const softStops = (color: string, opacity: number): Stops => [
  { offset: 0, color, opacity },
  { offset: 0.5, color, opacity: opacity * 0.72 },
  { offset: 0.78, color, opacity: opacity * 0.3 },
  { offset: 1, color, opacity: 0 },
];

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
  if (!at) return { cx: x + w / 2, cy: y + h / 2, rx: w / 2, ry: h / 2 };
  const cx = x + (Number(at[1]) / 100) * w;
  const cy = y + (Number(at[2]) / 100) * h;
  // No size keyword means farthest-corner; `circle` makes the two radii equal.
  const dx = Math.max(cx - x, x + w - cx);
  const dy = Math.max(cy - y, y + h - cy);
  const r = Math.hypot(dx, dy);
  return /\bcircle\b/.test(background) ? { cx, cy, rx: r, ry: r } : { cx, cy, rx: dx, ry: dy };
}

/** A rounded rect with four independently-cut corners, optionally elliptical. */
function boxPath(x: number, y: number, w: number, h: number, r: ReturnType<typeof radii>): string {
  const ry = r.ry || 0;
  const vy = (v: number) => (ry ? ry : v);
  return [
    `M${x + r.tl} ${y}`,
    `H${x + w - r.tr}`,
    `A${r.tr} ${vy(r.tr)} 0 0 1 ${x + w} ${y + vy(r.tr)}`,
    `V${y + h - vy(r.br)}`,
    `A${r.br} ${vy(r.br)} 0 0 1 ${x + w - r.br} ${y + h}`,
    `H${x + r.bl}`,
    `A${r.bl} ${vy(r.bl)} 0 0 1 ${x} ${y + h - vy(r.bl)}`,
    `V${y + vy(r.tl)}`,
    `A${r.tl} ${vy(r.tl)} 0 0 1 ${x + r.tl} ${y}`,
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
  const r = radii(layer.radius, w, h);
  const stops = layer.background ? gradientStops(layer.background) : null;
  const solid = !stops && layer.background ? splitColor(layer.background) : null;
  const soft = solid && layer.blur ? softStops(solid.color, solid.opacity) : null;
  const gid = `tl${id}${index}`;
  const isRadial = Boolean(layer.background && /radial|conic/.test(layer.background));
  // A zero-blur inset shadow is a ring drawn wholly inside the edge, so its
  // stroke centreline sits half a width in. Blurred ones stay a named gap.
  const inset = layer.shadow?.match(/inset 0 0 0 ([0-9.]+)px (rgba?\([^)]+\)|#[0-9A-Fa-f]{3,8})/);
  const insetInk = inset ? splitColor(inset[2]) : null;
  const insetW = inset ? Number(inset[1]) : 0;

  return (
    <Svg width={box.w} height={box.h} style={{ position: 'absolute', left: 0, top: 0 }} opacity={layer.opacity}>
      {stops || soft ? (
        <Defs>
          {isRadial || soft ? (
            <RadialGradient id={gid} {...radialGeometry(layer.background ?? '', x, y, w, h)} gradientUnits="userSpaceOnUse">
              {(soft ?? stops ?? []).map((s, i) => (
                <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
              ))}
            </RadialGradient>
          ) : (
            <SvgLinearGradient id={gid} x1={x} y1={y} x2={x} y2={y + h} gradientUnits="userSpaceOnUse">
              {(stops ?? []).map((s, i) => (
                <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
              ))}
            </SvgLinearGradient>
          )}
        </Defs>
      ) : null}
      <Path
        d={boxPath(x, y, w, h, r)}
        fill={stops || soft ? `url(#${gid})` : solid?.color}
        fillOpacity={stops || soft ? 1 : solid?.opacity}
        // the canvas sets `transform-origin: bottom center` on these, so a
        // clock hand pivots at the dial, not at its own middle
        transform={layer.rotate ? `rotate(${layer.rotate} ${x + w / 2} ${y + h})` : undefined}
      />
      {inset ? (
        <Path
          d={boxPath(x + insetW / 2, y + insetW / 2, Math.max(0, w - insetW), Math.max(0, h - insetW), radii(layer.radius, Math.max(0, w - insetW), Math.max(0, h - insetW)))}
          fill="none"
          stroke={insetInk!.color}
          strokeOpacity={insetInk!.opacity}
          strokeWidth={insetW}
          transform={layer.rotate ? `rotate(${layer.rotate} ${x + w / 2} ${y + h})` : undefined}
        />
      ) : null}
    </Svg>
  );
}

/**
 * Any transcribed scene, drawn into the box the canvas composed it against and
 * scaled to whatever width it is given. The lesson-card plates are the same
 * construction in a 240 × 200 box, so they share this renderer.
 */
export function Scene({ layers, boxW, boxH, width }: { layers: TaskSceneLayer[] | undefined; boxW: number; boxH: number; width: number }) {
  const id = useId().replace(/:/g, '');
  if (!layers) return null;
  const scale = width / boxW;
  return (
    <View style={{ width, height: boxH * scale, overflow: 'hidden' }} pointerEvents="none">
      <View style={{ width: boxW, height: boxH, transform: [{ scale }], transformOrigin: 'top left' }}>
        {layers.map((layer, index) => (
          <Layer key={index} layer={layer} index={index} id={id} box={{ w: boxW, h: boxH }} />
        ))}
      </View>
    </View>
  );
}

export function TaskScene({ day, width }: { day: number; width: number }) {
  return <Scene layers={TASK_SCENES[day]} boxW={TASK_SCENE_W} boxH={TASK_SCENE_H} width={width} />;
}
