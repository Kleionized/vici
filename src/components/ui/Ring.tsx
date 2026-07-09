import { useId, type ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';

import { colors } from '@/lib/theme';

export interface RingProps {
  /** 0..1 */
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  /** Two-stop gradient for the progress arc. Overrides `color`. */
  gradient?: [string, string];
  children?: ReactNode;
}

export function Ring({
  progress,
  size = 180,
  stroke = 14,
  color = colors.accent,
  trackColor = colors.border,
  gradient,
  children,
}: RingProps) {
  const gid = useId().replace(/[:]/g, '');
  const p = Math.max(0, Math.min(1, progress));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {gradient ? (
          <Defs>
            <SvgGrad id={`ring${gid}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={gradient[0]} />
              <Stop offset="1" stopColor={gradient[1]} />
            </SvgGrad>
          </Defs>
        ) : null}
        <Circle cx={center} cy={center} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <Circle
          cx={center}
          cy={center}
          r={r}
          stroke={gradient ? `url(#ring${gid})` : color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      {children}
    </View>
  );
}
