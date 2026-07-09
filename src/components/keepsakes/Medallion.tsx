/**
 * Keepsake medallions — a react-native-svg port of the design canvas's
 * `screens-keepsakes.jsx` album: each keepsake is a faceted-paper scene inside
 * a postmark ring — earned ones in full ink, in-progress ones wearing a
 * progress arc, still-ahead ones as blind-embossed blanks with a lock. Tier
 * pips fill along the bottom arc as a repeatable keepsake levels up.
 */
import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, Rect } from 'react-native-svg';

// the worlds' faceted paper tones
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
  | 'firstlight'
  | 'toe'
  | 'threedays'
  | 'lettersent'
  | 'lesson10'
  | 'told'
  | 'week'
  | 'honest'
  | 'bounce'
  | 'rider'
  | 'shore'
  | 'storm'
  | 'longroad'
  | 'month'
  | 'summit';

// ── the faceted mini-scenes, one per keepsake (drawn in a 100×100 circle) ──
export const KK_SCENES: Record<KeepsakeSceneKey, React.ReactNode> = {
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
  toe: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M10 72 C 26 40, 52 30, 66 40 C 78 49, 72 60, 62 58 C 55 57, 53 50, 58 47" fill="none" stroke={KP.ink} strokeWidth={3.4} strokeLinecap="round" />
      <Path d="M10 72 C 26 40, 52 30, 66 40 L 66 72 Z" fill={KP.mid} opacity={0.55} />
      <Circle cx={70} cy={34} r={2.4} fill={KP.ink} opacity={0.5} />
      <Rect x={0} y={72} width={100} height={28} fill={KP.lit} />
      <Path d="M12 72h76" stroke={KP.foam} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M26 82q10 -4 20 0t20 0" stroke={KP.shade} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.7} />
    </G>
  ),
  threedays: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M20 78 L80 26" stroke={KP.mid} strokeWidth={1.6} strokeDasharray="1 6" strokeLinecap="round" />
      <Circle cx={27} cy={70} r={9} fill={KP.sun} stroke={KP.sunEdge} strokeWidth={1.3} />
      <Path d="M27 61 a9 9 0 0 1 0 18 a11.5 11.5 0 0 0 0 -18 Z" fill={KP.shade} />
      <Circle cx={50} cy={48} r={10} fill={KP.sun} stroke={KP.sunEdge} strokeWidth={1.3} />
      <Path d="M50 38 a10 10 0 0 1 0 20 Z" fill={KP.mid} />
      <Circle cx={74} cy={28} r={11} fill={KP.sun} stroke={KP.sunEdge} strokeWidth={1.4} />
      <Circle cx={70} cy={26} r={2.2} fill={KP.lit} />
      <Rect x={0} y={84} width={100} height={16} fill={KP.lit} />
      <Path d="M14 84h72" stroke={KP.foam} strokeWidth={1.8} strokeLinecap="round" opacity={0.8} />
    </G>
  ),
  lettersent: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <G transform="rotate(-14 54 48)">
        <Rect x={30} y={36} width={48} height={33} rx={5} fill={KP.lit} stroke={KP.shade} strokeWidth={1.2} />
        <Path d="M30 40 L54 56 L78 40" fill="none" stroke={KP.shade} strokeWidth={1.6} strokeLinejoin="round" />
        <Path d="M30 38 L54 23 L78 38 L54 54 Z" fill={KP.mid} stroke={KP.shade} strokeWidth={1.2} strokeLinejoin="round" />
        <Circle cx={54} cy={45} r={7} fill={KP.ink} />
        <Path d="M49.8 46c1.4-2 2.8-2 4.2 0s2.8 2 4.2 0" stroke={KP.paper} strokeWidth={1.5} strokeLinecap="round" fill="none" />
      </G>
      <G stroke={KP.deep} strokeWidth={2.4} strokeLinecap="round" opacity={0.8}>
        <Path d="M10 66 h13 M6 56 h10 M14 76 h9" />
      </G>
      <Path d="M84 22 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 Z" fill={KP.shade} />
    </G>
  ),
  lesson10: (
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
    </G>
  ),
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
      <Ellipse cx={35} cy={48} rx={11} ry={2.8} fill={KP.deep} />
      <Path d="M46 51 h3.5 a4.5 4.5 0 0 1 0 9 h-4" stroke={KP.shade} strokeWidth={2.2} fill="none" />
      <Path d="M54 50 L74 50 L72.3 63 A4.5 4.5 0 0 1 67.8 67 L60.2 67 A4.5 4.5 0 0 1 55.7 63 Z" fill={KP.lit} />
      <Ellipse cx={64} cy={50} rx={10} ry={2.6} fill={KP.deep} opacity={0.85} />
    </G>
  ),
  week: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      {(
        [
          [16, 60, 0],
          [26, 44, 1],
          [39, 33, 1],
          [54, 29, 1],
          [68, 33, 1],
          [79, 43, 1],
          [87, 57, 1],
        ] as [number, number, number][]
      ).map(([x, y], i) => (
        <G key={i}>
          <Circle cx={x} cy={y} r={6.5} fill={KP.sun} stroke={KP.sunEdge} strokeWidth={1.2} />
        </G>
      ))}
      <Rect x={0} y={76} width={100} height={24} fill={KP.lit} />
      <Path d="M12 76h76" stroke={KP.foam} strokeWidth={2} strokeLinecap="round" opacity={0.85} />
    </G>
  ),
  honest: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M50 18 L64 44 C 60 56, 54 60, 50 62 C 46 60, 40 56, 36 44 Z" fill={KP.lit} stroke={KP.shade} strokeWidth={1.4} strokeLinejoin="round" />
      <Path d="M50 18 L64 44 C 60 56, 54 60, 50 62 Z" fill={KP.mid} opacity={0.6} />
      <Path d="M50 34 v18" stroke={KP.ink} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={50} cy={34} r={2.6} fill={KP.ink} />
      <Path d="M22 76 q 12 -6 24 -1 t 26 -2" stroke={KP.ink} strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0.7} />
    </G>
  ),
  bounce: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M14 46 C 26 40, 34 40, 42 48 L 52 64 C 58 54, 68 38, 84 28" fill="none" stroke={KP.ink} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 46 C 26 40, 34 40, 42 48 L 52 64 C 58 54, 68 38, 84 28 L 84 80 L 14 80 Z" fill={KP.mid} opacity={0.35} />
      <Circle cx={52} cy={64} r={3.2} fill={KP.paper} stroke={KP.ink} strokeWidth={2.2} />
      <Circle cx={84} cy={28} r={4.2} fill={KP.paper} stroke={KP.ink} strokeWidth={2.6} />
      <Path d="M14 80 h 72" stroke={KP.shade} strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
    </G>
  ),
  rider: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      {[30, 44, 58, 72, 86].map((y, i) => (
        <Path
          key={y}
          d={`M${14 + (i % 2) * 8} ${y} q 11 -10 22 0 t 22 0 t 22 0`}
          fill="none"
          stroke={i === 4 ? KP.shade : KP.ink}
          strokeWidth={2.6 - i * 0.15}
          strokeLinecap="round"
          opacity={1 - i * 0.16}
        />
      ))}
    </G>
  ),
  shore: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M0 52 C 24 46, 48 52, 100 44 L100 100 L0 100 Z" fill={KP.mid} opacity={0.7} />
      <Path d="M0 66 C 30 58, 60 66, 100 58 L100 100 L0 100 Z" fill={KP.lit} />
      <Path d="M0 66 C 30 58, 60 66, 100 58" stroke={KP.foam} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Path d="M58 70 V 26" stroke={KP.ink} strokeWidth={2.6} strokeLinecap="round" />
      <Path d="M58 27 L 80 33 L 58 40 Z" fill={KP.ink} opacity={0.85} />
      <Ellipse cx={58} cy={71} rx={9} ry={2.6} fill={KP.shade} opacity={0.7} />
    </G>
  ),
  storm: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M62 30 L 20 18 L 20 42 Z" fill={KP.sun} opacity={0.55} />
      <G stroke={KP.shade} strokeWidth={1.8} strokeLinecap="round" opacity={0.8}>
        <Path d="M24 52l-4 8M36 48l-4 8M78 46l-4 8M88 58l-4 8M30 68l-4 8" />
      </G>
      <Path d="M56 28 L 68 28 L 66 72 L 58 72 Z" fill={KP.lit} stroke={KP.shade} strokeWidth={1.2} />
      <Path d="M62 28 L 68 28 L 66 72 L 62 72 Z" fill={KP.mid} />
      <Rect x={54} y={22} width={16} height={7} rx={2} fill={KP.ink} />
      <Rect x={0} y={72} width={100} height={28} fill={KP.deep} opacity={0.75} />
      <Path d="M8 72 q 12 -7 24 0 t 24 0 t 24 0 t 24 0" fill="none" stroke={KP.foam} strokeWidth={2.4} strokeLinecap="round" />
    </G>
  ),
  longroad: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Circle cx={72} cy={26} r={9} fill={KP.sun} stroke={KP.sunEdge} strokeWidth={1.4} />
      <Path d="M0 52 C 30 46 66 50 100 44 L100 100 L0 100 Z" fill={KP.lit} />
      <Path d="M0 72 C 34 66 70 70 100 64 L100 100 L0 100 Z" fill={KP.mid} opacity={0.75} />
      <Path d="M0 88 C 40 83 72 86 100 81 L100 100 L0 100 Z" fill={KP.shade} opacity={0.6} />
      <Path d="M50 96 C 24 90 22 82 44 78 C 70 73 74 66 52 62 C 34 58 38 52 56 48 C 66 45 70 40 68 35" fill="none" stroke={KP.foam} strokeWidth={4.5} strokeLinecap="round" />
      <Path d="M50 96 C 24 90 22 82 44 78 C 70 73 74 66 52 62 C 34 58 38 52 56 48 C 66 45 70 40 68 35" fill="none" stroke={KP.deep} strokeWidth={1.6} strokeLinecap="round" strokeDasharray="1 7" />
    </G>
  ),
  month: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Circle cx={50} cy={42} r={26} fill="none" stroke={KP.mid} strokeWidth={1.4} strokeDasharray="2 6" />
      <Circle cx={50} cy={42} r={19} fill="none" stroke={KP.shade} strokeWidth={1.2} opacity={0.8} />
      <Circle cx={50} cy={42} r={12} fill={KP.sun} stroke={KP.sunEdge} strokeWidth={1.6} />
      <Rect x={0} y={76} width={100} height={24} fill={KP.lit} />
      <Path d="M12 76h76" stroke={KP.foam} strokeWidth={2} strokeLinecap="round" opacity={0.9} />
    </G>
  ),
  summit: (
    <G>
      <Rect x={0} y={0} width={100} height={100} fill={KP.paper} />
      <Path d="M14 78 L50 26 L86 78 Z" fill={KP.lit} />
      <Path d="M50 26 L86 78 L64 78 Z" fill={KP.mid} />
      <Path d="M50 26 L43 37 C 46 34.5, 48.5 35.5, 50 38 C 52.5 34.5, 55 34.8, 57 37 Z" fill={KP.foam} />
      <Path d="M50 26 V 14" stroke={KP.ink} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M50 15 L 64 19 L 50 24 Z" fill={KP.ink} />
      <Path d="M0 84 C 20 78, 42 82, 62 79 C 78 77, 92 80, 100 78 V100 H0 Z" fill={KP.foam} opacity={0.95} />
    </G>
  ),
};

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
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        backgroundColor: earned ? '#F5F2E9' : 'rgba(0,0,0,0.045)',
      }}>
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
              stroke={KP.ink}
              strokeWidth={2.8}
              strokeLinecap="round"
              strokeDasharray={`${(Math.max(4, p * 100) / 100) * (2 * Math.PI * 44.5)} ${2 * Math.PI * 44.5}`}
              transform="rotate(-90 50 50)"
            />
          </G>
        )}
        {tier != null && tierMax > 1
          ? Array.from({ length: tierMax }).map((_, i) => {
              const ang = ((90 + (i - (tierMax - 1) / 2) * 13) * Math.PI) / 180;
              const x = 50 + 40.9 * Math.cos(ang);
              const y = 50 + 40.9 * Math.sin(ang);
              const onPip = i < (tier ?? 0);
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
        {!earned && p == null ? (
          <G opacity={1}>
            <Rect x={41} y={49} width={18} height={12} rx={2.6} stroke="rgba(74,74,66,0.45)" strokeWidth={2} />
            <Path d="M45 49v-4a5 5 0 0110 0v4" stroke="rgba(74,74,66,0.45)" strokeWidth={2} />
          </G>
        ) : null}
      </Svg>
    </View>
  );
}
