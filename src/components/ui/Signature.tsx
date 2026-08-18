import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { AppText } from './AppText';
import { PressScale } from './press-scale';
import { sans } from '@/lib/theme';

/**
 * A signature the person actually writes.
 *
 * The vow card used to draw one fixed squiggle for everybody — its own comment
 * said it "reads the same whatever the name is", which is the problem: a vow is
 * the one thing in the app that is supposed to be theirs. This captures the
 * real strokes and hands back a path string that can be stored and drawn again.
 *
 * The format is a plain SVG `d` with one `M…` subpath per stroke, so reading it
 * back is a single `<Path>` and nothing has to be parsed.
 */

/** Points closer together than this add nothing but bytes. */
const MIN_STEP = 1.6;

/** The box the strokes are recorded against, so a stored signature scales. */
export const SIGNATURE_W = 260;
export const SIGNATURE_H = 84;

type Point = { x: number; y: number };

/** Quadratic smoothing through the midpoints — a polyline reads as shaky. */
function strokePath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const { x, y } = points[0];
    // A tap is a dot: a zero-length line with a round cap draws one.
    return `M${x.toFixed(1)} ${y.toFixed(1)}L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i].x + points[i + 1].x) / 2;
    const my = (points[i].y + points[i + 1].y) / 2;
    d += `Q${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  d += `L${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

/** Draw a stored signature. No gestures, no state — just the marks. */
export function SignatureMark({
  value,
  width = SIGNATURE_W,
  height = SIGNATURE_H,
  color = '#26261F',
  strokeWidth = 2.2,
  style,
}: {
  value: string;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}) {
  if (!value) return null;
  return (
    <View style={style} pointerEvents="none">
      <Svg width={width} height={height} viewBox={`0 0 ${SIGNATURE_W} ${SIGNATURE_H}`} fill="none">
        <Path d={value} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
    </View>
  );
}

/**
 * The signing pad. `onChange` fires with the full path each time a stroke ends,
 * which is the only moment the value is worth storing.
 */
export function SignaturePad({
  value,
  onChange,
  width = SIGNATURE_W,
  height = SIGNATURE_H,
  color = '#26261F',
  strokeWidth = 2.2,
  hint = 'Sign here',
}: {
  value?: string;
  onChange: (path: string) => void;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  hint?: string;
}) {
  /**
   * Finished strokes and the one in hand, together in one value.
   *
   * They move as a pair — ending a stroke empties the second and appends to the
   * first — and keeping them apart meant a ref for the live points, which is a
   * ref written during a gesture and read while rendering. One state, and every
   * updater below is pure.
   */
  const [{ done, points }, setPad] = useState<{ done: string[]; points: Point[] }>(() => ({
    done: value ? [value] : [],
    points: [],
  }));

  // The pad records against a fixed box so a signature drawn on one screen
  // reads the same on another; the gesture arrives in view coordinates.
  const sx = SIGNATURE_W / width;
  const sy = SIGNATURE_H / height;

  const begin = useCallback(
    (x: number, y: number) => setPad((s) => ({ ...s, points: [{ x: x * sx, y: y * sy }] })),
    [sx, sy],
  );

  const extend = useCallback(
    (x: number, y: number) =>
      setPad((s) => {
        const p = { x: x * sx, y: y * sy };
        const last = s.points[s.points.length - 1];
        if (last && Math.hypot(p.x - last.x, p.y - last.y) < MIN_STEP) return s;
        return { ...s, points: [...s.points, p] };
      }),
    [sx, sy],
  );

  const finish = useCallback(
    () => setPad((s) => (s.points.length === 0 ? s : { done: [...s.done, strokePath(s.points)], points: [] })),
    [],
  );

  const clear = useCallback(() => setPad({ done: [], points: [] }), []);

  // Telling the caller is an effect, not something an updater does: an updater
  // has to be pure, and React is free to run it twice.
  const reported = useRef<string | null>(null);
  useEffect(() => {
    const next = done.join(' ');
    if (reported.current === next) return;
    reported.current = next;
    onChange(next);
  }, [done, onChange]);

  // Built once per handler identity rather than on every stroke: `setLive`
  // re-renders for each point, and rebuilding the recogniser under a finger
  // mid-stroke drops it.
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        // A signature is drawn inside a scroller on some screens; claiming the
        // gesture immediately keeps a stroke from being read as a scroll.
        .shouldCancelWhenOutside(false)
        .onBegin((e) => runOnJS(begin)(e.x, e.y))
        .onUpdate((e) => runOnJS(extend)(e.x, e.y))
        .onEnd(() => runOnJS(finish)())
        .onFinalize(() => runOnJS(finish)()),
    [begin, extend, finish],
  );

  const live = points.length ? strokePath(points) : '';
  const marks = live ? [...done, live] : done;
  const empty = marks.length === 0;

  return (
    <View style={{ width, height }}>
      <GestureDetector gesture={pan}>
        <View style={{ width, height }} accessibilityRole="none" accessibilityLabel="Signature pad">
          <Svg width={width} height={height} viewBox={`0 0 ${SIGNATURE_W} ${SIGNATURE_H}`} fill="none">
            {marks.map((d, i) => (
              <Path key={i} d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            ))}
          </Svg>
          {empty ? (
            <AppText
              pointerEvents="none"
              style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: height / 2 - 9, textAlign: 'center', fontSize: 13, color: '#C6C3BC' }]}>
              {hint}
            </AppText>
          ) : null}
        </View>
      </GestureDetector>

      {empty ? null : (
        <PressScale
          onPress={clear}
          accessibilityRole="button"
          accessibilityLabel="Clear signature"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ position: 'absolute', right: 0, top: -6, minHeight: 0, paddingHorizontal: 4 }}>
          <AppText style={[sans('500'), { fontSize: 11.5, color: '#B0AEA8' }]}>Clear</AppText>
        </PressScale>
      )}
    </View>
  );
}
