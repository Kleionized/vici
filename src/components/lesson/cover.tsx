import { View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, LinearGradient, Path, Rect, RadialGradient, Stop } from 'react-native-svg';

/**
 * The lesson cover medallion (canvas: Lesson Open · Lesson Question · Lesson
 * Complete) — a hairline, a paper gap, a second hairline, and inside them a
 * drawn coast rather than a photograph.
 *
 * The canvas builds the coast from three boxes with elliptical top corners
 * (`border-radius: 50% 50% 0 0 / 46% 46% 0 0`), each wider than the medallion
 * and clipped by it. Every offset below is the canvas's own percentage, so the
 * drawing holds at any diameter.
 */

export type LessonCoverVariant = 'dawn' | 'water';

type Dome = { left: number; right: number; top: number; ry: number; fill: string };

/** left/right are the canvas's negative insets; ry is the corner's vertical radius. */
const DOMES: Record<LessonCoverVariant, Dome[]> = {
  dawn: [
    { left: -0.25, right: -0.25, top: 0.56, ry: 0.46, fill: '#DEDDD6' },
    { left: -0.45, right: -0.15, top: 0.7, ry: 0.4, fill: '#CFCEC7' },
    { left: -0.15, right: -0.45, top: 0.84, ry: 0.36, fill: '#C0BFB8' },
  ],
  water: [
    { left: -0.25, right: -0.25, top: 0.46, ry: 0.48, fill: '#D8E3ED' },
    { left: -0.45, right: -0.15, top: 0.62, ry: 0.42, fill: '#CFCEC7' },
    { left: -0.15, right: -0.45, top: 0.78, ry: 0.38, fill: '#C0BFB8' },
  ],
};

/** Every dome is 80% of the medallion tall, whatever its corner radius. */
const DOME_HEIGHT = 0.8;

export function LessonCover({
  size = 128,
  lifted = true,
  variant = 'dawn',
}: {
  size?: number;
  lifted?: boolean;
  variant?: LessonCoverVariant;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        boxShadow: lifted
          ? '0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 6px #F4F3F0, 0 0 0 7.5px rgba(0,0,0,0.14), 0 16px 32px rgba(40,38,32,0.22)'
          : '0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 6px #F4F3F0, 0 0 0 7.5px rgba(0,0,0,0.14)',
      }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <ClipPath id={`cover-clip-${variant}-${size}`}>
            <Circle cx={size / 2} cy={size / 2} r={size / 2} />
          </ClipPath>
          <LinearGradient id={`cover-paper-${variant}-${size}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#EFEEE8" />
            <Stop offset="1" stopColor="#EFEDE6" />
          </LinearGradient>
          <RadialGradient id={`cover-sun-${variant}-${size}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#F3E3C4" stopOpacity={0.95} />
            <Stop offset="0.78" stopColor="#F3E3C4" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={size} height={size} fill={`url(#cover-paper-${variant}-${size})`} clipPath={`url(#cover-clip-${variant}-${size})`} />
        {variant === 'dawn' ? (
          <Circle
            cx={(0.14 + 0.31) * size}
            cy={(0.04 + 0.31) * size}
            r={0.31 * size}
            fill={`url(#cover-sun-${variant}-${size})`}
            clipPath={`url(#cover-clip-${variant}-${size})`}
          />
        ) : null}
        {DOMES[variant].map((dome) => {
          const x0 = dome.left * size;
          const x1 = size - dome.right * size;
          const top = dome.top * size;
          const ry = dome.ry * DOME_HEIGHT * size;
          const bottom = top + DOME_HEIGHT * size;
          return (
            <Path
              key={dome.fill + dome.top}
              d={`M${x0} ${top + ry} A${(x1 - x0) / 2} ${ry} 0 0 1 ${x1} ${top + ry} L${x1} ${bottom} L${x0} ${bottom} Z`}
              fill={dome.fill}
              clipPath={`url(#cover-clip-${variant}-${size})`}
            />
          );
        })}
      </Svg>
    </View>
  );
}
