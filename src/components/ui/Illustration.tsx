import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { colors } from '@/lib/theme';
import { useOnInk } from './surface';

export type IllustrationName =
  | 'horizon'
  | 'breathe'
  | 'path'
  | 'tide'
  | 'orbit'
  | 'balance'
  | 'growth'
  | 'mountain'
  | 'spark'
  | 'steps'
  | 'figure'
  | 'bird'
  | 'book';

export interface IllustrationProps {
  name: IllustrationName;
  width?: number;
  color?: string;
  accent?: string;
}

/** Solid-silhouette spot illustrations (filled, Stoic "explore" style). */
export function Illustration({ name, width = 200, color, accent }: IllustrationProps) {
  const onInk = useOnInk();
  const c = color ?? (onInk ? colors.inkText : colors.text);
  const a = accent ?? colors.category.environmental;
  const height = width * 0.8;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 160">
      {name === 'horizon' && (
        <>
          <Circle cx={100} cy={62} r={28} fill={a} />
          <Path d="M0 104c20-14 34-14 50 0s34 14 50 0 34-14 50 0 24 12 50 2v54H0z" fill={c} />
          <Path d="M0 124c20-12 34-12 50 0s34 12 50 0 34-12 50 0 30 11 50 2v34H0z" fill={c} opacity={0.5} />
        </>
      )}

      {name === 'tide' && (
        <>
          <Path d="M0 70c22-16 36-16 52 0s36 16 52 0 36-16 52 0 24 13 44 3v94H0z" fill={c} opacity={0.95} />
          <Path d="M0 98c22-16 36-16 52 0s36 16 52 0 36-16 52 0 28 13 44 3v62H0z" fill={c} opacity={0.55} />
          <Path d="M0 126c22-14 36-14 52 0s36 14 52 0 36-14 52 0 30 12 44 3v36H0z" fill={c} opacity={0.3} />
        </>
      )}

      {name === 'mountain' && (
        <>
          <Circle cx={140} cy={56} r={18} fill={a} />
          <Path d="M6 138 70 44l64 94z" fill={c} />
          <Path d="M96 138 138 70l60 68z" fill={c} opacity={0.6} />
        </>
      )}

      {name === 'spark' && (
        <>
          <Path d="M100 18c5 52 12 60 64 66-52 6-59 14-64 66-5-52-12-60-64-66 52-6 59-14 64-66z" fill={c} />
          <Circle cx={158} cy={36} r={6} fill={a} />
        </>
      )}

      {name === 'growth' && (
        <>
          <Path d="M96 142h8V70h-8z" fill={c} />
          <Path d="M100 96C74 94 64 80 60 58c24 1 36 12 40 38z" fill={c} />
          <Path d="M100 82c20-2 30-10 32-30-19 1-29 9-32 30z" fill={c} opacity={0.7} />
          <Circle cx={100} cy={54} r={9} fill={a} />
        </>
      )}

      {name === 'breathe' && (
        <>
          <Circle cx={100} cy={80} r={46} stroke={c} strokeWidth={2} fill="none" opacity={0.3} />
          <Circle cx={100} cy={80} r={34} fill={c} opacity={0.95} />
          <Circle cx={100} cy={80} r={10} fill={a} />
        </>
      )}

      {name === 'orbit' && (
        <>
          <Circle cx={100} cy={82} r={48} stroke={c} strokeWidth={2} fill="none" opacity={0.25} />
          <Circle cx={100} cy={82} r={28} fill={c} />
          <Circle cx={142} cy={48} r={9} fill={a} />
        </>
      )}

      {name === 'balance' && (
        <>
          <Rect x={48} y={54} width={104} height={7} rx={3.5} fill={c} />
          <Rect x={96} y={54} width={8} height={40} rx={3} fill={c} />
          <Path d="M100 94l-12 18h24z" fill={c} />
          <Circle cx={50} cy={44} r={12} fill={c} />
          <Circle cx={150} cy={44} r={12} fill={a} />
        </>
      )}

      {name === 'steps' && (
        <>
          <Rect x={26} y={108} width={42} height={30} rx={4} fill={c} opacity={0.5} />
          <Rect x={70} y={88} width={42} height={50} rx={4} fill={c} opacity={0.75} />
          <Rect x={114} y={64} width={42} height={74} rx={4} fill={c} />
          <Rect x={150} y={30} width={4} height={36} rx={2} fill={c} />
          <Path d="M154 32h22l-7 8 7 8h-22z" fill={a} />
        </>
      )}

      {name === 'path' && (
        <>
          <Path d="M0 138c40 0 40-40 70-40s30 28 60 28 30-44 70-44v96H0z" fill={c} opacity={0.85} />
          <Circle cx={150} cy={64} r={8} fill={a} />
        </>
      )}

      {name === 'figure' && (
        <>
          <Circle cx={100} cy={44} r={16} fill={c} />
          <Path d="M100 66c-22 0-40 20-44 46-1 8 10 10 44 10s45-2 44-10c-4-26-22-46-44-46z" fill={c} />
          <Circle cx={62} cy={104} r={9} fill={c} opacity={0.85} />
          <Circle cx={138} cy={104} r={9} fill={c} opacity={0.85} />
        </>
      )}

      {name === 'bird' && (
        <Path
          d="M24 86c30-22 50-22 60-2 4-10 14-16 26-16-8 6-10 14-10 24 18-8 40-6 76 6-34 2-54 10-66 26-4-14-14-22-30-24-16 2-30 8-56 16 8-18 8-32 0-50z"
          fill={c}
        />
      )}

      {name === 'book' && (
        <>
          <Path d="M100 56C80 46 56 46 34 50v66c22-4 46-4 66 6z" fill={c} />
          <Path d="M100 56c20-10 44-10 66-6v66c-22-4-46-4-66 6z" fill={c} opacity={0.78} />
          <Rect x={98} y={56} width={4} height={66} rx={2} fill={c} opacity={0.5} />
        </>
      )}
    </Svg>
  );
}
