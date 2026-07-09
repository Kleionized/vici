import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/lib/theme';
import { useOnInk } from './surface';

export interface WaveProps {
  height?: number;
  color?: string;
  /** Number of stacked tide lines. */
  lines?: number;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}

const W = 400;

function sine(baseY: number, amp: number, cycles: number, phase: number): string {
  let d = `M 0 ${(baseY + amp * Math.sin(phase)).toFixed(2)}`;
  for (let x = 0; x <= W; x += 8) {
    const y = baseY + amp * Math.sin((x / W) * Math.PI * 2 * cycles + phase);
    d += ` L ${x} ${y.toFixed(2)}`;
  }
  return d;
}

/**
 * The Tideline tide motif — calm stacked sine "tide lines". Decorative; stretches
 * to fill its container width. Reads as a faint texture on paper or ink.
 */
export function Wave({ height = 80, color, lines = 3, opacity = 1, style }: WaveProps) {
  const onInk = useOnInk();
  const c = color ?? (onInk ? colors.inkText : colors.borderStrong);
  const rows = Array.from({ length: lines }, (_, i) => {
    const t = lines === 1 ? 0.5 : i / (lines - 1);
    const baseY = height * (0.42 + t * 0.46);
    const amp = height * 0.1;
    return { d: sine(baseY, amp, 1.6, i * 0.9), o: (0.5 - t * 0.28) * opacity };
  });
  return (
    <View style={[{ height }, style]} pointerEvents="none">
      <Svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
        {rows.map((r, i) => (
          <Path key={i} d={r.d} stroke={c} strokeWidth={1.5} fill="none" opacity={r.o} />
        ))}
      </Svg>
    </View>
  );
}
