import { useId, useState } from 'react';
import { Dimensions, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Line, Path, Stop } from 'react-native-svg';

import { colors } from '@/lib/theme';

export interface LineChartProps {
  /** Y values; `null` renders a gap. */
  values: (number | null)[];
  min?: number;
  max?: number;
  height?: number;
  color?: string;
  /** Soft area gradient under the line. */
  fill?: boolean;
  showDots?: boolean;
  /** Optional faint second line for comparison. */
  comparison?: (number | null)[];
  comparisonColor?: string;
  gridColor?: string;
  strokeWidth?: number;
}

interface Pt {
  x: number;
  y: number;
}

/** Catmull-Rom → cubic bezier for a smooth, calm curve. */
function smoothPath(pts: Pt[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

/** Contiguous runs of non-null points, mapped to pixel coords. */
function segments(values: (number | null)[], toX: (i: number) => number, toY: (v: number) => number): Pt[][] {
  const segs: Pt[][] = [];
  let cur: Pt[] = [];
  values.forEach((v, i) => {
    if (v == null) {
      if (cur.length) segs.push(cur);
      cur = [];
    } else {
      cur.push({ x: toX(i), y: toY(v) });
    }
  });
  if (cur.length) segs.push(cur);
  return segs;
}

export function LineChart({
  values,
  min,
  max,
  height = 150,
  color = colors.chart.mood,
  fill = true,
  showDots = true,
  comparison,
  comparisonColor = colors.chart.axis,
  gridColor = colors.chart.grid,
  strokeWidth = 2.5,
}: LineChartProps) {
  // Seed with a sensible width so the chart paints on first frame (and in the
  // static web export); onLayout corrects it to the exact container width.
  const [w, setW] = useState(() => {
    const dw = Dimensions.get('window').width;
    return dw > 0 ? Math.round(dw) - 80 : 320;
  });
  const gid = useId().replace(/[:]/g, '');

  const nums = values.filter((v): v is number => v != null);
  const cNums = (comparison ?? []).filter((v): v is number => v != null);
  const all = [...nums, ...cNums];
  const lo = min ?? (all.length ? Math.min(...all) : 0);
  const hiRaw = max ?? (all.length ? Math.max(...all) : 1);
  const hi = hiRaw === lo ? lo + 1 : hiRaw;

  const padX = 6;
  const padTop = 12;
  const padBottom = 12;
  const innerW = Math.max(0, w - padX * 2);
  const innerH = height - padTop - padBottom;
  const n = values.length;
  const toX = (i: number) => padX + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const toY = (v: number) => padTop + (1 - (v - lo) / (hi - lo)) * innerH;
  const baseY = padTop + innerH;

  const mainSegs = w > 0 ? segments(values, toX, toY) : [];
  const compSegs = w > 0 && comparison ? segments(comparison, toX, toY) : [];

  return (
    <View style={{ height }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 ? (
        <Svg width={w} height={height}>
          <Defs>
            <SvgGrad id={`grad${gid}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity={0.18} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </SvgGrad>
          </Defs>

          {/* gridlines: max, mid, min */}
          {[0, 0.5, 1].map((t) => (
            <Line
              key={t}
              x1={padX}
              x2={w - padX}
              y1={padTop + t * innerH}
              y2={padTop + t * innerH}
              stroke={gridColor}
              strokeWidth={1}
              strokeDasharray={t === 1 ? undefined : '2 5'}
            />
          ))}

          {/* comparison line (faint, behind) */}
          {compSegs.map((seg, i) => (
            <Path key={`c${i}`} d={smoothPath(seg)} stroke={comparisonColor} strokeWidth={2} fill="none" opacity={0.5} />
          ))}

          {/* area fill */}
          {fill &&
            mainSegs.map((seg, i) =>
              seg.length >= 2 ? (
                <Path
                  key={`a${i}`}
                  d={`${smoothPath(seg)} L ${seg[seg.length - 1].x} ${baseY} L ${seg[0].x} ${baseY} Z`}
                  fill={`url(#grad${gid})`}
                />
              ) : null,
            )}

          {/* main line */}
          {mainSegs.map((seg, i) => (
            <Path key={`l${i}`} d={smoothPath(seg)} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
          ))}

          {/* dots */}
          {showDots &&
            mainSegs.flat().map((p, i) => <Circle key={`d${i}`} cx={p.x} cy={p.y} r={3} fill={color} />)}
        </Svg>
      ) : null}
    </View>
  );
}
