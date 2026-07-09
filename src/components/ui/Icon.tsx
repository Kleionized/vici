import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

import { colors } from '@/lib/theme';
import { useOnInk } from './surface';

export type IconName =
  | 'moon'
  | 'sun'
  | 'mood'
  | 'pulse'
  | 'people'
  | 'calendar'
  | 'wave'
  | 'book'
  | 'compass'
  | 'sparkle'
  | 'leaf'
  | 'heart'
  | 'anchor'
  | 'check'
  | 'arrow'
  | 'edit'
  | 'plus';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Minimal, monochrome line icons (24×24). Surface-aware default colour. */
export function Icon({ name, size = 20, color, strokeWidth = 1.7 }: IconProps) {
  const onInk = useOnInk();
  const c = color ?? (onInk ? colors.inkText : colors.text);
  const common = { stroke: c, strokeWidth, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'moon' && <Path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" {...common} />}
      {name === 'sun' && (
        <>
          <Circle cx={12} cy={12} r={4} {...common} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r1 = 7.5;
            const r2 = 10.5;
            const rad = (a * Math.PI) / 180;
            return (
              <Line
                key={a}
                x1={12 + r1 * Math.cos(rad)}
                y1={12 + r1 * Math.sin(rad)}
                x2={12 + r2 * Math.cos(rad)}
                y2={12 + r2 * Math.sin(rad)}
                {...common}
              />
            );
          })}
        </>
      )}
      {name === 'mood' && (
        <>
          <Circle cx={12} cy={12} r={9} {...common} />
          <Path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" {...common} />
          <Circle cx={9} cy={10} r={0.6} fill={c} stroke={c} />
          <Circle cx={15} cy={10} r={0.6} fill={c} stroke={c} />
        </>
      )}
      {name === 'pulse' && <Polyline points="2,13 7,13 9.5,6 13,18 15.5,11 18,11 22,11" {...common} />}
      {name === 'people' && (
        <>
          <Circle cx={9} cy={8.5} r={3} {...common} />
          <Circle cx={16.5} cy={9.5} r={2.4} {...common} />
          <Path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" {...common} />
          <Path d="M15.5 19c0-2.3 1.4-4 3.2-4 1 0 1.9.5 2.5 1.3" {...common} />
        </>
      )}
      {name === 'calendar' && (
        <>
          <Path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18z" {...common} />
          <Line x1={4} y1={9.5} x2={20} y2={9.5} {...common} />
          <Line x1={8} y1={3.5} x2={8} y2={6.5} {...common} />
          <Line x1={16} y1={3.5} x2={16} y2={6.5} {...common} />
          <Circle cx={12} cy={14} r={0.9} fill={c} stroke={c} />
        </>
      )}
      {name === 'wave' && (
        <>
          <Path d="M2 9c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6-1.5" {...common} />
          <Path d="M2 15c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6-1.5" {...common} />
        </>
      )}
      {name === 'book' && (
        <>
          <Path d="M12 6.5C10.5 5 8 4.5 4 5v13c4-.5 6.5 0 8 1.5" {...common} />
          <Path d="M12 6.5C13.5 5 16 4.5 20 5v13c-4-.5-6.5 0-8 1.5" {...common} />
        </>
      )}
      {name === 'compass' && (
        <>
          <Circle cx={12} cy={12} r={9} {...common} />
          <Path d="M15.5 8.5 13 13l-4.5 2.5L11 11z" {...common} />
        </>
      )}
      {name === 'sparkle' && <Path d="M12 3c.6 4.5 1.5 5.4 6 6-4.5.6-5.4 1.5-6 6-.6-4.5-1.5-5.4-6-6 4.5-.6 5.4-1.5 6-6z" {...common} />}
      {name === 'leaf' && (
        <>
          <Path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13z" {...common} />
          <Path d="M5 19c3-5 6-7 10-8.5" {...common} />
        </>
      )}
      {name === 'heart' && <Path d="M12 20s-7-4.3-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7-2.8C19 10.7 12 20 12 20z" {...common} />}
      {name === 'anchor' && (
        <>
          <Circle cx={12} cy={5} r={2} {...common} />
          <Line x1={12} y1={7} x2={12} y2={20} {...common} />
          <Line x1={8} y1={11} x2={16} y2={11} {...common} />
          <Path d="M5 13c0 4 3 6.5 7 6.5s7-2.5 7-6.5" {...common} />
        </>
      )}
      {name === 'check' && <Polyline points="5,13 10,18 19,7" {...common} />}
      {name === 'arrow' && (
        <>
          <Line x1={4} y1={12} x2={19} y2={12} {...common} />
          <Polyline points="13,6 19,12 13,18" {...common} />
        </>
      )}
      {name === 'edit' && (
        <>
          <Path d="M5 19l-1 1 1-4L15.5 5.5l3 3L8 19z" {...common} />
          <Line x1={13.5} y1={7.5} x2={16.5} y2={10.5} {...common} />
        </>
      )}
      {name === 'plus' && (
        <>
          <Line x1={12} y1={5} x2={12} y2={19} {...common} />
          <Line x1={5} y1={12} x2={19} y2={12} {...common} />
        </>
      )}
    </Svg>
  );
}
