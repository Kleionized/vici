import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, Rect } from 'react-native-svg';

import { colors } from '@/lib/theme';

/**
 * Medallions (canvas: screens-keepsakes) — a campaign album of phalerae:
 * every medallion is faceted paper inside a postmark ring — earned ones in
 * full ink, in-progress ones wearing a progress arc, the ones still ahead
 * as blind-embossed blanks. Tier pips sit along the bottom arc.
 */

// ── palette: the worlds' faceted paper tones ─────────────────────────
const KP = {
  paper: '#F7F5EC',
  lit: '#EBE8DA',
  mid: '#DCD8C6',
  shade: '#C8C3AD',
  deep: '#B0AB93',
  ink: '#4A4A42',
  foam: '#FCFBF6',
  sun: '#F4F2E9',
  sunEdge: '#D8D3C1',
};

export type KeepsakeSceneKey =
  | 'veni'
  | 'vidi'
  | 'vici'
  | 'firstlight'
  | 'lettersent'
  | 'study'
  | 'told'
  | 'honest'
  | 'bounce'
  | 'groundtaken'
  | 'storm';

// ── the mini-scenes, one per medallion (drawn in a 100×100 circle) ────
export const KK_SCENES: Record<KeepsakeSceneKey, React.ReactNode> = {
  // veni — stepping off the old shore: a sail pushing out at first light
  veni: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Circle cx={76} cy={28} r={9.5} fill={KP.sun} stroke={KP.sunEdge} strokeWidth={1.4} />
      <Path d="M0 58 C 12 54, 24 56, 33 62 L 33 100 L 0 100 Z" fill={KP.mid} />
      <Path d="M0 58 C 12 54, 24 56, 33 62" fill="none" stroke={KP.shade} strokeWidth={1.3} />
      <Path d="M8 68 q 6 -2.5 12 0" stroke={KP.shade} strokeWidth={1.6} strokeLinecap="round" fill="none" opacity={0.55} />
      <Rect x={0} y={64} width={100} height={36} fill={KP.lit} />
      <Path d="M33 64 h55" stroke={KP.foam} strokeWidth={2} strokeLinecap="round" opacity={0.9} />
      <Path d="M22 79 q 12 -3.5 24 0 t 24 0" stroke={KP.shade} strokeWidth={1.7} strokeLinecap="round" fill="none" opacity={0.5} />
      <Path d="M33 70 C 42 72, 50 70, 57 66" stroke={KP.foam} strokeWidth={1.8} strokeLinecap="round" strokeDasharray="1 6" fill="none" />
      <G transform="translate(62 42)">
        <Path d="M0 16 L0 -14" stroke={KP.ink} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M2 -12 C 11 -6 14 4 14 13 L2 13 Z" fill={KP.foam} stroke={KP.shade} strokeWidth={1} />
        <Path d="M-2 -9 C -9 -3 -11 6 -11 13 L-2 13 Z" fill={KP.mid} />
        <Path d="M-14 16 C -8 20.5 10 20.5 17 16 L15 19.5 C 6 23 -7 23 -12 19.5 Z" fill={KP.ink} opacity={0.85} />
      </G>
    </G>
  ),
  // dawn: half sun on the horizon, rays, banded sea
  firstlight: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <G stroke={KP.ink} strokeWidth={2.4} strokeLinecap="round" opacity={0.75}>
        <Path d="M50 26v-8M28 34l5 5M72 34l-5 5" />
      </G>
      <Circle cx={50} cy={58} r={14} fill={KP.sun} stroke={KP.sunEdge} strokeWidth={1.6} />
      <Rect x={0} y={58} width={100} height={14} fill={KP.lit} />
      <Rect x={0} y={72} width={100} height={13} fill={KP.mid} />
      <Rect x={0} y={85} width={100} height={15} fill={KP.shade} />
      <Path d="M8 58h84" stroke={KP.foam} strokeWidth={2} strokeLinecap="round" opacity={0.9} />
      <Path d="M18 72h64" stroke={KP.foam} strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
    </G>
  ),
  // the letter, sent onward
  lettersent: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M26 73 C 34 70, 43 65, 50 55" fill="none" stroke={KP.deep} strokeWidth={1.6} strokeLinecap="round" strokeDasharray="1 6" opacity={0.6} />
      <Path d="M10 85 q 13 -4 26 0 t 26 0 t 26 0" fill="none" stroke={KP.foam} strokeWidth={2} strokeLinecap="round" opacity={0.85} />
      <G transform="rotate(-9 50 50)">
        <Rect x={29} y={36} width={42} height={30} rx={4.5} fill={KP.lit} stroke={KP.shade} strokeWidth={1.2} />
        <Path d="M30 64 L50 50 L70 64" fill="none" stroke={KP.shade} strokeWidth={1.2} strokeLinejoin="round" opacity={0.7} />
        <Path d="M29 38 L50 51 L71 38" fill={KP.mid} stroke={KP.shade} strokeWidth={1.2} strokeLinejoin="round" />
        <Path d="M50 38 L71 38 L50 51 Z" fill={KP.shade} opacity={0.4} />
        <Circle cx={50} cy={49} r={6.2} fill={KP.ink} />
        <Path d="M46 50c1.3-1.9 2.7-1.9 4 0s2.7 1.9 4 0" stroke={KP.paper} strokeWidth={1.4} strokeLinecap="round" fill="none" />
      </G>
      <Path d="M74 28 l1.3 3.2 3.2 1.3 -3.2 1.3 -1.3 3.2 -1.3 -3.2 -3.2 -1.3 3.2 -1.3 Z" fill={KP.shade} />
    </G>
  ),
  // the open book — lessons stacking up
  study: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M50 34 C 40 28 28 27 18 30 L18 66 C 28 63 40 64 50 70 Z" fill={KP.foam} stroke={KP.shade} strokeWidth={1.3} strokeLinejoin="round" />
      <Path d="M50 34 C 60 28 72 27 82 30 L82 66 C 72 63 60 64 50 70 Z" fill={KP.lit} stroke={KP.shade} strokeWidth={1.3} strokeLinejoin="round" />
      <Path d="M50 34 V70" stroke={KP.shade} strokeWidth={1.4} />
      <G stroke={KP.deep} strokeWidth={1.8} strokeLinecap="round" opacity={0.75}>
        <Path d="M25 38 h18 M25 45 h18 M25 52 h13" />
        <Path d="M57 38 h18 M57 45 h18 M57 52 h13" opacity={0.7} />
      </G>
      <Path d="M62 30 v-12 l4 3.5 4-3.5 v14" fill={KP.mid} stroke={KP.shade} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M22 82 q 14 -4.5 28 0 t 28 0" stroke={KP.mid} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.8} />
    </G>
  ),
  // two mugs, one sill — the moment you let someone in
  told: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M8 64 L92 64 L92 72 L8 72 Z" fill={KP.mid} />
      <Path d="M8 72 L92 72 L88 84 L12 84 Z" fill={KP.shade} />
      <G stroke={KP.deep} strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0.75}>
        <Path d="M34 42 c 4 -3.5 4 -7.5 0 -11" />
        <Path d="M62 44 c 4 -3.5 4 -7.5 0 -11" />
      </G>
      <Path d="M24 48 L46 48 L44 63 A5 5 0 0 1 39 67 L31 67 A5 5 0 0 1 26 63 Z" fill={KP.foam} />
      <Path d="M38 48 L46 48 L44 63 A5 5 0 0 1 39 67 L36 67 C 38 61 38.6 54 38 48 Z" fill={KP.shade} opacity={0.55} />
      <Ellipse cx={35} cy={48} rx={11} ry={2.8} fill={KP.deep} />
      <Path d="M46 51 h3.5 a4.5 4.5 0 0 1 0 9 h-4" stroke={KP.shade} strokeWidth={2.2} fill="none" />
      <Path d="M54 50 L74 50 L72.3 63 A4.5 4.5 0 0 1 67.8 67 L60.2 67 A4.5 4.5 0 0 1 55.7 63 Z" fill={KP.lit} />
      <Ellipse cx={64} cy={50} rx={10} ry={2.6} fill={KP.deep} opacity={0.85} />
      <Path d="M74 53 h3 a4 4 0 0 1 0 8 h-3.5" stroke={KP.shade} strokeWidth={2} fill="none" />
    </G>
  ),
  // days witnessed, phase over phase, climbing
  vidi: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      {(
        [
          [16, 60, 0],
          [26, 44, 0.2],
          [39, 33, 0.4],
          [54, 29, 0.6],
          [68, 33, 0.8],
          [79, 43, 1],
          [87, 57, 1],
        ] as [number, number, number][]
      ).map(([x, y, f], i) => (
        <G key={i}>
          <Circle cx={x} cy={y} r={6.5} fill={KP.sun} stroke={KP.sunEdge} strokeWidth={1.2} />
          {f < 1 ? (
            <Path
              d={`M${x} ${y - 6.5} a6.5 6.5 0 0 ${f >= 0.5 ? 1 : 0} 0 13 ${f === 0 ? 'a8 8 0 0 0 0 -13' : ''} Z`}
              fill={f >= 0.5 ? KP.mid : KP.shade}
              opacity={f === 0.8 ? 0.5 : 1}
            />
          ) : null}
        </G>
      ))}
      <Rect x={0} y={76} width={100} height={24} fill={KP.lit} />
      <Path d="M12 76h76" stroke={KP.foam} strokeWidth={2} strokeLinecap="round" opacity={0.85} />
      <Path d="M28 86q9 -3.5 18 0t18 0" stroke={KP.shade} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.6} />
    </G>
  ),
  // pen nib + a written line
  honest: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M50 18 L64 44 C 60 56, 54 60, 50 62 C 46 60, 40 56, 36 44 Z" fill={KP.lit} stroke={KP.shade} strokeWidth={1.4} strokeLinejoin="round" />
      <Path d="M50 18 L64 44 C 60 56, 54 60, 50 62 Z" fill={KP.mid} opacity={0.6} />
      <Path d="M50 34 v18" stroke={KP.ink} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={50} cy={34} r={2.6} fill={KP.ink} />
      <Path d="M22 76 q 12 -6 24 -1 t 26 -2" stroke={KP.ink} strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0.7} />
      <Circle cx={76} cy={70} r={2} fill={KP.ink} opacity={0.45} />
    </G>
  ),
  // the mended sail — slipped, stitched, sailing again by morning
  bounce: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Circle cx={23} cy={25} r={8} fill={KP.sun} stroke={KP.sunEdge} strokeWidth={1.3} />
      <Rect x={0} y={66} width={100} height={34} fill={KP.lit} />
      <Path d="M0 66 h100" stroke={KP.foam} strokeWidth={2} strokeLinecap="round" opacity={0.9} />
      <Path d="M14 80 q 11 -3 22 0 t 22 0 t 22 0" stroke={KP.shade} strokeWidth={1.6} strokeLinecap="round" fill="none" opacity={0.5} />
      <G transform="translate(55 45)">
        <Path d="M0 20 L0 -22" stroke={KP.ink} strokeWidth={2} strokeLinecap="round" />
        <Path d="M3 -19 C 15 -11 19 3 19 16 L3 16 Z" fill={KP.foam} stroke={KP.shade} strokeWidth={1.1} />
        <Path d="M-3 -14 C -12 -7 -15 5 -15 16 L-3 16 Z" fill={KP.mid} />
        <Path d="M5.5 -6.5 L16 1.5" stroke={KP.deep} strokeWidth={1.3} strokeLinecap="round" />
        <G stroke={KP.deep} strokeWidth={1.1} strokeLinecap="round">
          <Path d="M9.2 -6.2 L6.8 -3.2" />
          <Path d="M12 -4 L9.6 -1" />
          <Path d="M14.8 -1.8 L12.4 1.2" />
        </G>
        <Path d="M-17 20 C -10 24.5 12 24.5 20 20 L18 23.5 C 8 27 -9 27 -15 23.5 Z" fill={KP.ink} opacity={0.85} />
      </G>
    </G>
  ),
  // the standing rock — the sea moves; you don't
  vici: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Rect x={0} y={60} width={100} height={40} fill={KP.lit} />
      <Path d="M0 60 h100" stroke={KP.foam} strokeWidth={1.8} strokeLinecap="round" opacity={0.9} />
      <Path d="M0 74 C 26 70, 52 76, 100 71 L100 100 L0 100 Z" fill={KP.mid} opacity={0.8} />
      <Path d="M35 66 L44 26 L57 21 L68 66 Z" fill={KP.mid} stroke={KP.shade} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M57 21 L68 66 L51 66 L48 30 Z" fill={KP.shade} opacity={0.8} />
      <Path d="M44 26 L57 21 L48 30 Z" fill={KP.foam} opacity={0.5} />
      <Ellipse cx={51} cy={66} rx={21} ry={3.6} fill={KP.foam} opacity={0.95} />
      <Path d="M13 62 q 9 -8 19 -1" stroke={KP.ink} strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0.8} />
      <Path d="M70 63 q 8 -4.5 15 -1.5" stroke={KP.shade} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.8} />
      <Circle cx={31} cy={55} r={1.7} fill={KP.foam} stroke={KP.shade} strokeWidth={0.7} />
      <Circle cx={73} cy={56} r={1.4} fill={KP.foam} stroke={KP.shade} strokeWidth={0.7} />
    </G>
  ),
  // the flag planted — ground taken
  groundtaken: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M0 52 C 24 46, 48 52, 100 44 L100 100 L0 100 Z" fill={KP.mid} opacity={0.7} />
      <Path d="M0 66 C 30 58, 60 66, 100 58 L100 100 L0 100 Z" fill={KP.lit} />
      <Path d="M0 66 C 30 58, 60 66, 100 58" stroke={KP.foam} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Path d="M58 70 V 26" stroke={KP.ink} strokeWidth={2.6} strokeLinecap="round" />
      <Path d="M58 27 L 80 33 L 58 40 Z" fill={KP.ink} opacity={0.85} />
      <Ellipse cx={58} cy={71} rx={9} ry={2.6} fill={KP.shade} opacity={0.7} />
      <Path d="M20 82 q 9 -3 18 0" stroke={KP.foam} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.8} />
    </G>
  ),
  // lighthouse in the squall
  storm: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M62 30 L 20 18 L 20 42 Z" fill={KP.sun} opacity={0.55} />
      <G stroke={KP.shade} strokeWidth={1.8} strokeLinecap="round" opacity={0.8}>
        <Path d="M24 52l-4 8M36 48l-4 8M78 46l-4 8M88 58l-4 8M30 68l-4 8" />
      </G>
      <Path d="M56 28 L 68 28 L 66 72 L 58 72 Z" fill={KP.lit} stroke={KP.shade} strokeWidth={1.2} />
      <Path d="M62 28 L 68 28 L 66 72 L 62 72 Z" fill={KP.mid} />
      <Rect x={57.5} y={36} width={9} height={6} fill={KP.ink} opacity={0.75} />
      <Rect x={58} y={50} width={8} height={5.5} fill={KP.ink} opacity={0.55} />
      <Rect x={54} y={22} width={16} height={7} rx={2} fill={KP.ink} />
      <Rect x={0} y={72} width={100} height={28} fill={KP.deep} opacity={0.75} />
      <Path d="M8 72 q 12 -7 24 0 t 24 0 t 24 0 t 24 0" fill="none" stroke={KP.foam} strokeWidth={2.4} strokeLinecap="round" />
    </G>
  ),
};

// ── the medallion: postmark ring + clipped scene + optional arc ──────
const OUTER_C = 2 * Math.PI * 44.5;

export function KKMedallion({
  scene,
  size = 84,
  earned = true,
  progress = null,
  tier = null,
  tierMax = 0,
}: {
  scene: KeepsakeSceneKey;
  size?: number;
  earned?: boolean;
  progress?: [number, number] | null;
  tier?: number | null;
  tierMax?: number;
}) {
  const uid = useId().replace(/:/g, '');
  const p = progress ? progress[0] / progress[1] : null;
  return (
    <View style={{ width: size, height: size, borderRadius: 9999, backgroundColor: earned ? '#F6F3EA' : colors.accentSoft }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          <ClipPath id={`kk-${uid}`}>
            <Circle cx={50} cy={50} r={37} />
          </ClipPath>
        </Defs>
        <G clipPath={`url(#kk-${uid})`} opacity={earned ? 1 : 0.16}>
          {KK_SCENES[scene]}
        </G>
        <Circle cx={50} cy={50} r={37} stroke={earned ? 'rgba(74,74,66,0.4)' : 'rgba(74,74,66,0.16)'} strokeWidth={1.4} />
        {tier != null && tier >= 2 ? <Circle cx={50} cy={50} r={33.8} stroke="rgba(74,74,66,0.28)" strokeWidth={1} /> : null}
        {p == null ? (
          <Circle cx={50} cy={50} r={44.5} stroke={earned ? 'rgba(74,74,66,0.5)' : 'rgba(74,74,66,0.16)'} strokeWidth={1.7} strokeDasharray="2.5 5.5" />
        ) : (
          <G>
            <Circle cx={50} cy={50} r={44.5} stroke="rgba(74,74,66,0.14)" strokeWidth={2.4} />
            <Circle
              cx={50}
              cy={50}
              r={44.5}
              stroke={colors.ink}
              strokeWidth={2.8}
              strokeLinecap="round"
              strokeDasharray={`${Math.max(0.04, p) * OUTER_C} ${OUTER_C}`}
              transform="rotate(-90 50 50)"
            />
          </G>
        )}
        {tier != null && tierMax > 1
          ? Array.from({ length: tierMax }).map((_, i) => {
              const ang = ((90 + (i - (tierMax - 1) / 2) * 13) * Math.PI) / 180;
              const x = 50 + 40.9 * Math.cos(ang);
              const y = 50 + 40.9 * Math.sin(ang);
              const onPip = i < tier;
              return (
                <Rect
                  key={i}
                  x={x - 2.1}
                  y={y - 2.1}
                  width={4.2}
                  height={4.2}
                  rx={0.8}
                  transform={`rotate(45 ${x} ${y})`}
                  fill={onPip ? 'rgba(74,74,66,0.78)' : '#F1EEE3'}
                  stroke={onPip ? 'none' : 'rgba(74,74,66,0.3)'}
                  strokeWidth={1.1}
                />
              );
            })
          : null}
        {/* lock for the still-ahead blanks */}
        {!earned && p == null ? (
          <G opacity={0.45}>
            <Rect x={43} y={47} width={14} height={9} rx={2} stroke={KP.ink} strokeWidth={2} />
            <Path d="M46 47v-3a4 4 0 018 0v3" stroke={KP.ink} strokeWidth={2} />
          </G>
        ) : null}
      </Svg>
    </View>
  );
}
