import { useRef, useState } from 'react';
import { Platform, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';

import { haptic } from '@/lib/haptics';
import type { Signature } from '@/lib/signature';
import { mono } from '@/lib/theme';

import { Tap } from './Tap';
import { MonoText } from './Text';

const f = (n: number) => +n.toFixed(1);

/** A stroke's points as a smooth path: a curve through the midpoints, so a quick hand does not draw corners. */
function pathOf(pts: [number, number][]): string {
  if (pts.length === 1) {
    const [x, y] = pts[0];
    return `M${f(x)} ${f(y)}l0.1 0`;
  }
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += `Q${f(x)} ${f(y)} ${f((x + nx) / 2)} ${f((y + ny) / 2)}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return d + `L${f(lx)} ${f(ly)}`;
}

const INK = { stroke: mono.ink, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const;

/**
 * Where he signs with a finger (D68): a box over a dashed rule, "Sign here"
 * on it until the first stroke, ink as he draws, and "Clear" once there is
 * something to clear. `onChange` has the signature after every stroke (null
 * once cleared). The rule turns solid when it is signed.
 */
export function SignaturePad({
  height = 88,
  placeholder = 'Sign here',
  onChange,
  style,
}: {
  height?: number;
  placeholder?: string;
  onChange: (sig: Signature | null) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const [width, setWidth] = useState(0);
  const [strokes, setStrokes] = useState<string[]>([]);
  const [live, setLive] = useState<string | null>(null);
  const pts = useRef<[number, number][]>([]);

  // The pad takes the touch from its first point and keeps it: React Native's
  // responder, not a gesture recogniser, so a scroll view around it cannot
  // hold the start of a stroke back while it decides whether it is a scroll.
  const at = (e: GestureResponderEvent): [number, number] => [
    Math.max(2, Math.min(width - 2, e.nativeEvent.locationX)),
    Math.max(2, Math.min(height - 2, e.nativeEvent.locationY)),
  ];
  const begin = (e: GestureResponderEvent) => {
    if (!strokes.length) haptic.choice();
    pts.current = [at(e)];
    setLive(pathOf(pts.current));
  };
  const move = (e: GestureResponderEvent) => {
    pts.current.push(at(e));
    setLive(pathOf(pts.current));
  };
  const end = () => {
    if (!pts.current.length) return;
    const next = [...strokes, pathOf(pts.current)];
    pts.current = [];
    setLive(null);
    setStrokes(next);
    onChange({ strokes: next, w: width, h: height });
  };

  const clear = () => {
    setStrokes([]);
    onChange(null);
  };
  const signed = strokes.length > 0;

  return (
    <View style={style}>
      <View
        accessibilityLabel={signed ? 'Signed' : placeholder}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        // claimed in the capture phase too, so a sheet's own drag-to-close is never
        // asked about a stroke drawn on its pad
        onStartShouldSetResponderCapture={() => true}
        onMoveShouldSetResponderCapture={() => true}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={begin}
        onResponderMove={move}
        onResponderRelease={end}
        onResponderTerminate={end}
        style={{ height, justifyContent: 'flex-end' }}>
        {/* nothing inside takes the touch, so every point is in the pad's own frame */}
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'flex-end' }}>
          {!signed && !live ? (
            <MonoText v="p" color={mono.mute} style={{ position: 'absolute', left: 0, bottom: 10 }}>
              {placeholder}
            </MonoText>
          ) : null}
          <Svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }}>
            {strokes.map((d, i) => (
              <Path key={i} d={d} {...INK} />
            ))}
            {live ? <Path d={live} {...INK} /> : null}
          </Svg>
          {/* the rule: dashed until signed, then solid ink */}
          {signed ? (
            <View style={{ height: 1.5, backgroundColor: mono.ink }} />
          ) : (
            <Svg width="100%" height={1.5}>
              <Line x1={0} y1={0.75} x2="100%" y2={0.75} stroke={mono.art} strokeWidth={1.5} strokeDasharray={Platform.OS === 'web' ? undefined : '3 2'} />
            </Svg>
          )}
        </View>
      </View>
      {signed ? (
        <Tap onPress={clear} label="Clear the signature" hitSlop={10} style={{ position: 'absolute', right: 0, top: 0 }}>
          <MonoText v="rowValue">Clear</MonoText>
        </Tap>
      ) : null}
    </View>
  );
}

/** A kept signature, drawn to fit `height`, left-aligned; nothing when there is none. */
export function SignatureMark({ sig, height = 44, color = mono.ink }: { sig: Signature; height?: number; color?: string }) {
  const width = (sig.w / sig.h) * height;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${sig.w} ${sig.h}`} accessibilityLabel="Your signature">
      {sig.strokes.map((d, i) => (
        <Path key={i} d={d} {...INK} stroke={color} strokeWidth={(3 * sig.h) / height} />
      ))}
    </Svg>
  );
}
