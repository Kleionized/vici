import { Image } from 'expo-image';
import { View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, PressScale } from '@/components/ui';
import type { RDArt } from '@/content/roughDays';
import { sans } from '@/lib/theme';

const noiseDark = require('../../../assets/images/noise-dark.png');

/**
 * Rough Days (canvas frames 001–021). One sheet lifted off the paper ground,
 * and on it the same six things every time: a grabber, a close cross, three
 * dots, a headline, a line under it, one drawing — and on the third page, the
 * move itself. Everything below is quoted off the sheet's own box, which the
 * canvas puts at y 52, two points above where the status bar ends.
 */

// ═══ the drawings ═════════════════════════════════════════════════════
// Each one is a 240 × 220 slot of absolutely positioned boxes over two blurred
// shapes — a warm glow behind the subject and a soft ellipse under it. RN SVG
// has no blur filter, so both are redrawn as radial gradients whose falloff
// stands in for the blur.

const abs = (l: number, t: number, w: number, h: number, s?: ViewStyle): ViewStyle => ({ position: 'absolute', left: l, top: t, width: w, height: h, ...s });

/** `radial-gradient(closest-side, C, transparent 74%)` in a round box. */
function Glow({ id, l, t, size, alpha, color = '#E2BA78' }: { id: string; l: number; t: number; size: number; alpha: number; color?: string }) {
  return (
    <Svg width={size} height={size} style={{ position: 'absolute', left: l, top: t }}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={color} stopOpacity={alpha} />
          <Stop offset="0.74" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={size / 2} cy={size / 2} rx={size / 2} ry={size / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

/** The canvas blurs a solid ellipse for the ground shadow — drawn here as a
 * radial falloff instead, so the edge stays as soft as the blur made it. */
function Shade({ id, l, t, w, h, alpha = 0.1 }: { id: string; l: number; t: number; w: number; h: number; alpha?: number }) {
  return (
    <Svg width={w} height={h} style={{ position: 'absolute', left: l, top: t }}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#000000" stopOpacity={alpha} />
          <Stop offset="0.45" stopColor="#000000" stopOpacity={alpha} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

/** `border-radius:50%` on a box that is not square is an ellipse — RN's numeric
 * radii can only round a rectangle, so those shapes are drawn as ellipses. */
function Oval({ l, t, w, h, fill }: { l: number; t: number; w: number; h: number; fill: string }) {
  return (
    <Svg width={w} height={h} style={{ position: 'absolute', left: l, top: t }}>
      <Ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill={fill} />
    </Svg>
  );
}

/** `linear-gradient(180deg, A, B)` on a rounded box — no CSS gradients in RN,
 * so the box becomes an SVG rect carrying the same two stops top to bottom. */
function VGrad({ id, l, t, w, h, r, from, to }: { id: string; l: number; t: number; w: number; h: number; r: number; from: string; to: string }) {
  return (
    <Svg width={w} height={h} style={{ position: 'absolute', left: l, top: t }}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={from} />
          <Stop offset="1" stopColor={to} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={w} height={h} rx={r} ry={r} fill={`url(#${id})`} />
    </Svg>
  );
}

/**
 * The twelve tiles of the argument board, board-local. The x values are the
 * canvas's own — six columns of 22.67 across a 136 box, so the last overhangs
 * by 0.02 and is clipped — and the two rows alternate their pair.
 */
const TOPPLED_TILES: readonly (readonly [number, number, string])[] = [0, 22.67, 45.34, 68.01, 90.68, 113.35000000000001].flatMap((x, col) => [
  [x, 0, col % 2 ? '#D9D8D2' : '#EBEAE4'] as const,
  [x, 22, col % 2 ? '#EBEAE4' : '#D9D8D2'] as const,
]);

/**
 * The two faint sparks the canvas sets behind every one of these drawings. Two
 * of the twenty move them a few points, so the positions are overridable and
 * the defaults are what the other eighteen draw.
 */
function Specks({ a = [216, 20], b = [8, 48] }: { a?: readonly [number, number]; b?: readonly [number, number] }) {
  return (
    <>
      <View style={abs(a[0], a[1], 2, 2, { borderRadius: 1, backgroundColor: 'rgba(200,225,235,0.4)' })} />
      <View style={abs(b[0], b[1], 2, 2, { borderRadius: 1, backgroundColor: 'rgba(200,225,235,0.3)' })} />
    </>
  );
}

/** The moon: a pale disc with a duller one slid down and right behind it. */
function Moon({ l, t, size }: { l: number; t: number; size: number }) {
  return (
    <>
      <View style={abs(l + 8, t + 6, size, size, { borderRadius: size / 2, backgroundColor: '#DCDED8' })} />
      <View style={abs(l, t, size, size, { borderRadius: size / 2, backgroundColor: '#F4F3F0' })} />
    </>
  );
}

export function RDArtwork({ name }: { name: RDArt }) {
  return (
    <View style={{ width: 240, height: 220, overflow: 'hidden' }}>
      {name === 'emptyroom' ? (
        <>
          <Glow id="rd-emptyroom-glow" l={120} t={36} size={120} alpha={0.38} />
          <Moon l={22} t={8} size={30} />
          <Specks />
          <View style={abs(138, 30, 86, 122, { borderRadius: 8, backgroundColor: '#E4E3DE' })} />
          <VGrad id="rd-emptyroom-pane" l={146} t={38} w={70} h={106} r={4} from="#F7F6F2" to="#EDECE7" />
          <View style={abs(180, 38, 2, 106, { backgroundColor: '#D6D5D0' })} />
          <View style={abs(146, 90, 70, 2, { backgroundColor: '#D6D5D0' })} />
          <View style={abs(132, 26, 14, 130, { borderRadius: 7, backgroundColor: '#D6D5D0' })} />
          <View style={abs(26, 104, 14, 58, { borderRadius: 7, backgroundColor: '#C6C5C0' })} />
          <View style={abs(26, 148, 68, 18, { borderRadius: 6, backgroundColor: '#D6D5D0' })} />
          <View style={abs(86, 126, 11, 40, { borderRadius: 5, backgroundColor: '#C6C5C0' })} />
          <View style={abs(32, 166, 5, 14, { backgroundColor: '#B4B1AB' })} />
          <View style={abs(84, 166, 5, 14, { backgroundColor: '#B4B1AB' })} />
          <View style={abs(108, 148, 28, 5, { borderRadius: 2, backgroundColor: '#D6D5D0' })} />
          <View style={abs(119, 153, 4, 24, { backgroundColor: '#C6C5C0' })} />
          <Shade id="rd-emptyroom-shade1" l={20} t={182} w={90} h={13} />
          <Shade id="rd-emptyroom-shade2" l={136} t={158} w={90} h={13} />
        </>
      ) : null}

      {name === 'mugphone' ? (
        <>
          <Glow id="rd-mugphone-glow" l={126} t={58} size={110} alpha={0.32} />
          <Specks />
          <View style={abs(30, 158, 180, 4, { borderRadius: 2, backgroundColor: '#D6D5D0' })} />
          <View style={abs(52, 132, 66, 24, { borderRadius: 7, backgroundColor: '#C6C5C0' })} />
          <View style={abs(60, 139, 7, 7, { borderRadius: 3.5, backgroundColor: '#B4B1AB' })} />
          <View style={abs(146, 112, 40, 44, { borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomRightRadius: 8, borderBottomLeftRadius: 8, backgroundColor: '#E4E3DE' })} />
          <Svg width={16} height={26} viewBox="0 0 16 26" style={{ position: 'absolute', left: 182, top: 120 }}>
            <Path d="M2 4 C13 4 13 22 2 22" stroke="#D6D5D0" strokeWidth={4} fill="none" />
          </Svg>
          <Svg width={34} height={34} viewBox="0 0 34 34" style={{ position: 'absolute', left: 150, top: 74 }}>
            <Path d="M8 30 C4 22 12 20 8 12 M20 32 C16 24 24 22 20 14" stroke="#D6D5D0" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </Svg>
          <View style={abs(140, 156, 52, 6, { borderRadius: 3, backgroundColor: '#D6D5D0' })} />
          <Shade id="rd-mugphone-shade1" l={46} t={166} w={80} h={13} />
          <Shade id="rd-mugphone-shade2" l={138} t={168} w={64} h={13} />
        </>
      ) : null}

      {name === 'sendtext' ? (
        <>
          <Glow id="rd-sendtext-glow" l={56} t={44} size={120} alpha={0.34} />
          <Specks />
          <View style={abs(82, 76, 56, 100, { borderRadius: 11, backgroundColor: '#E0DFDA' })} />
          <VGrad id="rd-sendtext-screen" l={88} t={83} w={44} h={80} r={6} from="#F7F6F2" to="#EDECE7" />
          <View style={abs(102, 167, 16, 3, { borderRadius: 2, backgroundColor: '#B4B1AB' })} />
          <View style={abs(144, 52, 72, 42, { borderRadius: 12, backgroundColor: '#C6C5C0' })} />
          <Svg width={20} height={16} viewBox="0 0 20 16" style={{ position: 'absolute', left: 150, top: 88 }}>
            <Path d="M4 0 L4 12 L16 0 Z" fill="#C6C5C0" />
          </Svg>
          <View style={abs(156, 64, 46, 5, { borderRadius: 3, backgroundColor: '#F7F6F2' })} />
          <View style={abs(156, 76, 30, 5, { borderRadius: 3, backgroundColor: '#F7F6F2' })} />
          <Svg width={30} height={26} viewBox="0 0 30 26" style={{ position: 'absolute', left: 36, top: 110 }}>
            <Path d="M2 12 L28 2 L18 24 L13 15 Z" fill="#B4B1AB" />
          </Svg>
          <Svg width={44} height={20} viewBox="0 0 44 20" style={{ position: 'absolute', left: 58, top: 96 }}>
            <Path d="M2 18 C 14 8 30 4 42 2" stroke="#D6D5D0" strokeWidth={2} strokeDasharray="2 5" fill="none" strokeLinecap="round" />
          </Svg>
          <Shade id="rd-sendtext-shade" l={78} t={182} w={72} h={13} />
        </>
      ) : null}

      {name === 'tangle' ? (
        <>
          <Glow id="rd-tangle-glow" l={44} t={60} size={72} alpha={0.32} />
          <Specks a={[216, 22]} b={[10, 50]} />
          {/* the scribbled knot became three linked rings and a tail */}
          <Svg width={200} height={80} viewBox="0 0 200 80" style={{ position: 'absolute', left: 20, top: 58 }}>
            <Circle cx={42} cy={42} r={19} fill="none" stroke="#B4B1AB" strokeWidth={2.6} />
            <Circle cx={60} cy={42} r={19} fill="none" stroke="#B4B1AB" strokeWidth={2.6} />
            <Circle cx={78} cy={42} r={19} fill="none" stroke="#B4B1AB" strokeWidth={2.6} />
            <Path d="M95 50 C124 58 156 52 186 42" fill="none" stroke="#B4B1AB" strokeWidth={2.6} strokeLinecap="round" />
          </Svg>
          <View style={abs(206, 94, 9, 9, { borderRadius: 4.5, backgroundColor: '#E2BA78' })} />
          {/* after the dot, so it paints over it */}
          <Glow id="rd-tangle-dotglow" l={194} t={82} size={32} alpha={0.4} />
          <Shade id="rd-tangle-shade" l={42} t={166} w={110} h={13} />
        </>
      ) : null}

      {name === 'kettle' ? (
        <>
          <Glow id="rd-kettle-glow" l={70} t={60} size={110} alpha={0.3} />
          <Specks />
          <View style={abs(82, 96, 78, 58, { borderTopLeftRadius: 26, borderTopRightRadius: 26, borderBottomRightRadius: 12, borderBottomLeftRadius: 12, backgroundColor: '#D6D5D0' })} />
          <View style={abs(104, 88, 34, 10, { borderRadius: 5, backgroundColor: '#C6C5C0' })} />
          <View style={abs(117, 81, 9, 9, { borderRadius: 4.5, backgroundColor: '#B4B1AB' })} />
          <Svg width={26} height={20} viewBox="0 0 26 20" style={{ position: 'absolute', left: 154, top: 104 }}>
            <Path d="M2 16 L18 16 L24 4 L16 4 Z" fill="#C6C5C0" />
          </Svg>
          <Svg width={60} height={30} viewBox="0 0 60 30" style={{ position: 'absolute', left: 92, top: 62 }}>
            <Path d="M6 28 C6 6 54 6 54 28" stroke="#B4B1AB" strokeWidth={4} fill="none" strokeLinecap="round" />
          </Svg>
          <Svg width={30} height={44} viewBox="0 0 30 44" style={{ position: 'absolute', left: 166, top: 58 }}>
            <Path d="M8 40 C4 30 14 28 10 18 M20 42 C16 32 26 30 22 20 M14 22 C12 14 20 12 16 4" stroke="#D6D5D0" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </Svg>
          <View style={abs(72, 158, 98, 4, { borderRadius: 2, backgroundColor: '#B4B1AB' })} />
          <Glow id="rd-kettle-burner" l={96} t={140} size={52} alpha={0.4} />
          <Shade id="rd-kettle-shade" l={70} t={168} w={104} h={13} />
        </>
      ) : null}

      {name === 'candle' ? (
        <>
          <Glow id="rd-candle-glow" l={74} t={34} size={110} alpha={0.5} />
          <Specks />
          {/* `box-shadow: inset 0 0 0 1.5px C` and a 1.5pt border paint the same
              band inside the same box, so the ring is an RN border */}
          <View style={abs(106, 96, 30, 64, { borderRadius: 5, backgroundColor: '#F7F6F2', borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.07)' })} />
          <View style={abs(102, 108, 7, 16, { borderRadius: 4, backgroundColor: '#E4E3DE' })} />
          <View style={abs(119.5, 88, 3, 9, { backgroundColor: '#55534E' })} />
          <Svg width={18} height={26} viewBox="0 0 18 26" style={{ position: 'absolute', left: 112, top: 66 }}>
            <Path d="M9 0 C15 8 18 14 18 18 A9 8 0 1 1 0 18 C0 14 3 8 9 0 Z" fill="#E2BA78" />
            <Path d="M9 8 C12 12 14 15 14 18 A5 4.5 0 1 1 4 18 C4 15 6 12 9 8 Z" fill="#F0DBB4" />
          </Svg>
          <Svg width={24} height={34} viewBox="0 0 24 34" style={{ position: 'absolute', left: 118, top: 30 }}>
            <Path d="M12 32 C6 24 18 18 12 8 C10 5 10 3 12 0" stroke="#D6D5D0" strokeWidth={2} fill="none" strokeLinecap="round" />
          </Svg>
          <View style={abs(88, 160, 66, 9, { borderRadius: 5, backgroundColor: '#C6C5C0' })} />
          <Shade id="rd-candle-shade" l={84} t={172} w={78} h={13} />
        </>
      ) : null}

      {name === 'loadbag' ? (
        <>
          <Glow id="rd-loadbag-glow" l={60} t={40} size={120} alpha={0.32} />
          <Specks />
          <View style={abs(56, 76, 92, 96, { borderRadius: 18, backgroundColor: '#C6C5C0' })} />
          <View style={abs(74, 124, 56, 40, { borderRadius: 10, backgroundColor: '#D6D5D0' })} />
          <View style={abs(99, 124, 6, 40, { backgroundColor: '#C6C5C0' })} />
          <View style={abs(68, 70, 13, 20, { borderRadius: 6, backgroundColor: '#B4B1AB' })} />
          <View style={abs(122, 70, 13, 20, { borderRadius: 6, backgroundColor: '#B4B1AB' })} />
          <Svg width={36} height={20} viewBox="0 0 36 20" style={{ position: 'absolute', left: 84, top: 56 }}>
            <Path d="M4 18 C4 2 32 2 32 18" stroke="#B4B1AB" strokeWidth={4.5} fill="none" strokeLinecap="round" />
          </Svg>
          <View style={abs(162, 150, 48, 11, { borderRadius: 3, backgroundColor: '#E4E3DE', transform: [{ rotate: '-2deg' }] })} />
          <View style={abs(166, 138, 42, 11, { borderRadius: 3, backgroundColor: '#D6D5D0', transform: [{ rotate: '2deg' }] })} />
          <View style={abs(162, 126, 46, 11, { borderRadius: 3, backgroundColor: '#C6C5C0', transform: [{ rotate: '-1deg' }] })} />
          <Shade id="rd-loadbag-shade1" l={52} t={176} w={104} h={13} />
          <Shade id="rd-loadbag-shade2" l={158} t={166} w={58} h={13} />
        </>
      ) : null}

      {name === 'pileclock' ? (
        <>
          <Glow id="rd-pileclock-glow" l={118} t={46} size={104} alpha={0.3} />
          <Specks />
          <Svg width={38} height={38} viewBox="0 0 38 38" style={{ position: 'absolute', left: 38, top: 36 }}>
            <Circle cx={19} cy={19} r={17.5} fill="#F7F6F2" stroke="#D6D5D0" strokeWidth={2.5} />
            <Path d="M19 8.55 L19 19 L26.98 22.8" stroke="#8B8880" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          </Svg>
          <View style={abs(28, 158, 184, 4, { borderRadius: 2, backgroundColor: '#D6D5D0' })} />
          <View style={abs(96, 146, 76, 9, { borderRadius: 2, backgroundColor: '#E4E3DE', transform: [{ rotate: '-1.5deg' }] })} />
          <View style={abs(98, 136, 72, 9, { borderRadius: 2, backgroundColor: '#D6D5D0', transform: [{ rotate: '1.5deg' }] })} />
          <View style={abs(95, 126, 78, 9, { borderRadius: 2, backgroundColor: '#E4E3DE', transform: [{ rotate: '-1deg' }] })} />
          <View style={abs(99, 116, 70, 9, { borderRadius: 2, backgroundColor: '#C6C5C0', transform: [{ rotate: '2deg' }] })} />
          <Svg width={44} height={34} viewBox="0 0 44 34" style={{ position: 'absolute', left: 182, top: 76 }}>
            <G transform="rotate(14 22 17)">
              <Rect x={4} y={4} width={36} height={26} rx={2} fill="#F7F6F2" stroke="#D6D5D0" strokeWidth={1.5} />
              <Path d="M10 11 h24 M10 17 h24 M10 23 h14" stroke="#D6D5D0" strokeWidth={2} strokeLinecap="round" />
            </G>
          </Svg>
          <Shade id="rd-pileclock-shade" l={88} t={166} w={92} h={13} />
        </>
      ) : null}

      {name === 'stepout' ? (
        <>
          <Glow id="rd-stepout-glow" l={96} t={52} size={112} alpha={0.36} />
          <Specks />
          <View style={abs(26, 160, 190, 4, { borderRadius: 2, backgroundColor: '#D6D5D0' })} />
          <View style={abs(80, 52, 84, 112, { borderRadius: 6, backgroundColor: '#D6D5D0' })} />
          <View style={abs(86, 58, 58, 100, { borderRadius: 4, backgroundColor: '#E4E3DE', transform: [{ rotate: '-9deg' }], transformOrigin: 'left bottom' })} />
          <View style={abs(124, 106, 6, 6, { borderRadius: 3, backgroundColor: '#8B8880', transform: [{ rotate: '-9deg' }] })} />
          <Svg width={52} height={102} viewBox="0 0 52 102" style={{ position: 'absolute', left: 140, top: 58 }}>
            <Path d="M2 0 L50 30 L50 102 L2 100 Z" fill="rgba(226,186,120,0.30)" />
          </Svg>
          <View style={abs(180, 156, 20, 9, { borderTopLeftRadius: 5, borderTopRightRadius: 7, borderBottomRightRadius: 2, borderBottomLeftRadius: 2, backgroundColor: '#B4B1AB' })} />
          <View style={abs(203, 154, 20, 9, { borderTopLeftRadius: 5, borderTopRightRadius: 7, borderBottomRightRadius: 2, borderBottomLeftRadius: 2, backgroundColor: '#C6C5C0' })} />
          <View style={abs(44, 64, 3, 30, { borderRadius: 2, backgroundColor: '#C6C5C0' })} />
          <Svg width={22} height={30} viewBox="0 0 22 30" style={{ position: 'absolute', left: 38, top: 88 }}>
            <Path d="M11 0 C2 6 2 26 11 28 C18 26 20 8 11 0 Z" fill="#C6C5C0" />
          </Svg>
          <Shade id="rd-stepout-shade" l={76} t={172} w={100} h={13} />
        </>
      ) : null}

      {name === 'sofa' ? (
        <>
          <Glow id="rd-sofa-glow" l={120} t={30} size={104} alpha={0.3} />
          <Svg width={34} height={34} viewBox="0 0 34 34" style={{ position: 'absolute', left: 34, top: 34 }}>
            <Circle cx={17} cy={17} r={15.5} fill="#F7F6F2" stroke="#D6D5D0" strokeWidth={2.5} />
            <Path d="M17 7.65 L17 17 L24.14 20.4" stroke="#8B8880" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          </Svg>
          <Specks />
          <View style={abs(48, 110, 140, 32, { borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 4, borderBottomLeftRadius: 4, backgroundColor: '#C6C5C0' })} />
          <View style={abs(54, 134, 62, 22, { borderRadius: 6, backgroundColor: '#D6D5D0' })} />
          <View style={abs(120, 134, 62, 22, { borderRadius: 6, backgroundColor: '#D6D5D0' })} />
          <View style={abs(38, 120, 14, 40, { borderRadius: 7, backgroundColor: '#C6C5C0' })} />
          <View style={abs(184, 120, 14, 40, { borderRadius: 7, backgroundColor: '#C6C5C0' })} />
          <View style={abs(52, 160, 6, 12, { backgroundColor: '#B4B1AB' })} />
          <View style={abs(178, 160, 6, 12, { backgroundColor: '#B4B1AB' })} />
          <View style={abs(88, 126, 22, 8, { borderRadius: 3, backgroundColor: '#8B8880' })} />
          <View style={abs(204, 52, 26, 52, { borderRadius: 5, backgroundColor: '#E4E3DE' })} />
          <Shade id="rd-sofa-shade" l={40} t={178} w={160} h={13} />
        </>
      ) : null}

      {name === 'shelf' ? (
        <>
          <Glow id="rd-shelf-glow" l={64} t={44} size={116} alpha={0.3} />
          <Specks />
          <View style={abs(56, 88, 128, 5, { borderRadius: 2, backgroundColor: '#C6C5C0' })} />
          <View style={abs(56, 148, 128, 5, { borderRadius: 2, backgroundColor: '#C6C5C0' })} />
          <View style={abs(64, 54, 11, 34, { borderRadius: 2, backgroundColor: '#D6D5D0' })} />
          <View style={abs(78, 48, 13, 40, { borderRadius: 2, backgroundColor: '#B4B1AB' })} />
          <View style={abs(94, 58, 10, 30, { borderRadius: 2, backgroundColor: '#E4E3DE' })} />
          <View style={abs(107, 50, 12, 38, { borderRadius: 2, backgroundColor: '#C6C5C0' })} />
          <View style={abs(126, 52, 11, 40, { borderRadius: 2, backgroundColor: '#D6D5D0', transform: [{ rotate: '-16deg' }], transformOrigin: 'left bottom' })} />
          <View style={abs(150, 112, 20, 16, { borderTopLeftRadius: 3, borderTopRightRadius: 3, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, backgroundColor: '#B4B1AB' })} />
          <Svg width={28} height={20} viewBox="0 0 28 20" style={{ position: 'absolute', left: 146, top: 94 }}>
            <Path d="M14 18 C6 14 4 4 10 2 C14 8 14 12 14 18 C14 12 14 8 18 2 C24 4 22 14 14 18 Z" fill="#C6C5C0" />
          </Svg>
          <View style={abs(66, 112, 34, 36, { borderRadius: 3, backgroundColor: '#E4E3DE' })} />
          <View style={abs(104, 118, 30, 30, { borderRadius: 3, backgroundColor: '#D6D5D0' })} />
          <Shade id="rd-shelf-shade" l={58} t={162} w={130} h={13} />
        </>
      ) : null}

      {name === 'threethings' ? (
        <>
          <Glow id="rd-threethings-glow" l={112} t={36} size={108} alpha={0.34} />
          <Specks />
          <View style={abs(112, 40, 100, 96, { borderRadius: 7, backgroundColor: '#E4E3DE' })} />
          <VGrad id="rd-threethings-pane" l={120} t={48} w={84} h={38} r={3} from="#F7F6F2" to="#EDECE7" />
          <View style={abs(120, 92, 84, 36, { borderRadius: 3, backgroundColor: '#F7F6F2' })} />
          <View style={abs(40, 124, 24, 40, { borderTopLeftRadius: 3, borderTopRightRadius: 3, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, backgroundColor: '#F7F6F2', borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)' })} />
          <View style={abs(43, 140, 18, 21, { borderBottomRightRadius: 4, borderBottomLeftRadius: 4, backgroundColor: '#D9E2E8' })} />
          <View style={abs(84, 152, 40, 6, { borderRadius: 3, backgroundColor: '#B4B1AB' })} />
          <View style={abs(80, 146, 9, 18, { borderRadius: 3, backgroundColor: '#8B8880' })} />
          <View style={abs(119, 146, 9, 18, { borderRadius: 3, backgroundColor: '#8B8880' })} />
          <Shade id="rd-threethings-shade1" l={36} t={170} w={96} h={13} />
          <Shade id="rd-threethings-shade2" l={140} t={142} w={72} h={13} />
        </>
      ) : null}

      {name === 'bedphone' ? (
        <>
          <Glow id="rd-bedphone-glow" l={44} t={36} size={110} alpha={0.38} />
          <Moon l={18} t={6} size={32} />
          <Specks />
          <View style={abs(36, 104, 11, 60, { borderRadius: 5, backgroundColor: '#C6C5C0' })} />
          <View style={abs(44, 126, 112, 28, { borderRadius: 8, backgroundColor: '#E0DFDA' })} />
          <View style={abs(50, 117, 36, 14, { borderRadius: 7, backgroundColor: '#C6C5C0' })} />
          <View style={abs(52, 134, 98, 8, { borderRadius: 4, backgroundColor: '#D6D5D0' })} />
          <View style={abs(44, 154, 6, 18, { backgroundColor: '#B4B1AB' })} />
          <View style={abs(146, 154, 6, 18, { backgroundColor: '#B4B1AB' })} />
          <View style={abs(170, 132, 38, 28, { borderRadius: 4, backgroundColor: '#D6D5D0' })} />
          <View style={abs(176, 118, 26, 13, { borderRadius: 3, backgroundColor: '#55534E' })} />
          <View style={abs(181, 122, 3, 3, { borderRadius: 1.5, backgroundColor: '#E2BA78' })} />
          <View style={abs(187, 122, 3, 3, { borderRadius: 1.5, backgroundColor: '#E2BA78' })} />
          <View style={abs(193, 122, 3, 3, { borderRadius: 1.5, backgroundColor: '#E2BA78' })} />
          <Shade id="rd-bedphone-shade1" l={40} t={176} w={120} h={13} />
          <Shade id="rd-bedphone-shade2" l={166} t={166} w={48} h={13} />
        </>
      ) : null}

      {name === 'latescreen' ? (
        <>
          <Glow id="rd-latescreen-glow" l={84} t={58} size={120} alpha={0.42} />
          <Moon l={192} t={8} size={24} />
          <Specks />
          <View style={abs(48, 150, 150, 4, { borderRadius: 2, backgroundColor: '#D6D5D0' })} />
          <View style={abs(104, 82, 42, 68, { borderRadius: 8, backgroundColor: '#C6C5C0' })} />
          <VGrad id="rd-latescreen-screen" l={109} t={88} w={32} h={56} r={5} from="#FCFBF7" to="#EDE9DC" />
          <Svg width={30} height={30} viewBox="0 0 30 30" style={{ position: 'absolute', left: 58, top: 96 }}>
            <Circle cx={15} cy={17} r={11} fill="#F7F6F2" stroke="#D6D5D0" strokeWidth={2.5} />
            <Path d="M15 11 L15 17 L20 20" stroke="#8B8880" strokeWidth={2} fill="none" strokeLinecap="round" />
            <Path d="M6 8 L10 4 M24 8 L20 4" stroke="#B4B1AB" strokeWidth={2.5} strokeLinecap="round" />
          </Svg>
          <View style={abs(160, 122, 18, 28, { borderTopLeftRadius: 3, borderTopRightRadius: 3, borderBottomRightRadius: 4, borderBottomLeftRadius: 4, backgroundColor: '#F7F6F2', borderWidth: 1.2, borderColor: 'rgba(0,0,0,0.08)' })} />
          <View style={abs(162, 134, 14, 14, { borderBottomRightRadius: 3, borderBottomLeftRadius: 3, backgroundColor: '#D9E2E8' })} />
          <Shade id="rd-latescreen-shade" l={96} t={160} w={64} h={13} />
        </>
      ) : null}

      {name === 'charging' ? (
        <>
          <Glow id="rd-charging-glow" l={140} t={34} size={96} alpha={0.3} />
          <Moon l={188} t={58} size={20} />
          <Specks />
          <View style={abs(36, 36, 8, 150, { borderRadius: 4, backgroundColor: '#D6D5D0' })} />
          <View style={abs(60, 150, 150, 4, { borderRadius: 2, backgroundColor: '#D6D5D0' })} />
          <View style={abs(150, 64, 30, 44, { borderRadius: 6, backgroundColor: '#E4E3DE' })} />
          <View style={abs(158, 74, 5, 12, { borderRadius: 2, backgroundColor: '#B4B1AB' })} />
          <View style={abs(168, 74, 5, 12, { borderRadius: 2, backgroundColor: '#B4B1AB' })} />
          <View style={abs(160, 96, 12, 9, { borderRadius: 2, backgroundColor: '#C6C5C0' })} />
          <Svg width={56} height={48} viewBox="0 0 56 48" style={{ position: 'absolute', left: 112, top: 104 }}>
            <Path d="M52 2 C52 26 30 22 16 30 C8 34 6 40 6 46" stroke="#B4B1AB" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </Svg>
          <View style={abs(86, 132, 56, 20, { borderRadius: 5, backgroundColor: '#C6C5C0' })} />
          <View style={abs(104, 138, 20, 8, { borderRadius: 2, backgroundColor: '#E4E3DE' })} />
          <View style={abs(132, 139, 4, 6, { borderRadius: 1, backgroundColor: '#E2BA78' })} />
          <Shade id="rd-charging-shade" l={80} t={160} w={80} h={13} />
        </>
      ) : null}

      {name === 'house' ? (
        <>
          <Glow id="rd-house-glow" l={64} t={36} size={120} alpha={0.38} />
          <Moon l={194} t={10} size={24} />
          <Specks />
          <Svg width={160} height={136} viewBox="0 0 160 136" style={{ position: 'absolute', left: 40, top: 44 }}>
            <Path d="M14 124 L146 124" stroke="rgba(19,19,19,0.18)" strokeWidth={3} strokeLinecap="round" />
            <Path d="M24 58 L80 20 L136 58" fill="none" stroke="#C6C5C0" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            <Rect x={32} y={58} width={96} height={66} rx={5} fill="#E4E3DE" />
            <Rect x={96} y={26} width={12} height={20} rx={2} fill="#C6C5C0" />
            <Rect x={90} y={86} width={22} height={38} rx={3} fill="#D6D5D0" />
            <Circle cx={108} cy={106} r={2.5} fill="#B4B1AB" />
            <Rect x={46} y={72} width={26} height={22} rx={2.5} fill="#E2BA78" opacity={0.85} />
            <Rect x={58} y={72} width={2} height={22} fill="#E4E3DE" />
            <Rect x={46} y={82} width={26} height={2} fill="#E4E3DE" />
            <Ellipse cx={26} cy={120} rx={12} ry={8} fill="#C6C5C0" />
            <Ellipse cx={144} cy={122} rx={9} ry={6} fill="#D6D5D0" />
          </Svg>
          <Glow id="rd-house-window" l={76} t={102} size={56} alpha={0.32} />
          <Oval l={64} t={182} w={18} h={6} fill="#D6D5D0" />
          <Oval l={94} t={188} w={16} h={6} fill="#E4E3DE" />
          <Oval l={122} t={184} w={18} h={6} fill="#D6D5D0" />
          <Shade id="rd-house-shade" l={48} t={178} w={150} h={13} />
        </>
      ) : null}

      {name === 'frontdoor' ? (
        <>
          <Glow id="rd-frontdoor-glow" l={110} t={44} size={104} alpha={0.3} />
          <Specks />
          <View style={abs(56, 48, 78, 130, { borderRadius: 7, backgroundColor: '#D6D5D0' })} />
          <View style={abs(64, 58, 62, 52, { borderRadius: 4, backgroundColor: '#E4E3DE' })} />
          <View style={abs(64, 118, 62, 52, { borderRadius: 4, backgroundColor: '#E4E3DE' })} />
          <View style={abs(120, 106, 8, 8, { borderRadius: 4, backgroundColor: '#8B8880' })} />
          <View style={abs(152, 70, 56, 6, { borderRadius: 3, backgroundColor: '#C6C5C0' })} />
          <Svg width={14} height={18} viewBox="0 0 14 18" style={{ position: 'absolute', left: 158, top: 78 }}>
            <Path d="M7 0 L7 8 C7 14 12 14 12 10" stroke="#B4B1AB" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </Svg>
          <Svg width={20} height={34} viewBox="0 0 20 34" style={{ position: 'absolute', left: 184, top: 78 }}>
            <Circle cx={10} cy={7} r={5.5} fill="none" stroke="#B4B1AB" strokeWidth={2.5} />
            <Path d="M10 12 L10 30 M10 24 L16 24 M10 18 L15 18" stroke="#B4B1AB" strokeWidth={2.5} strokeLinecap="round" />
          </Svg>
          <View style={abs(30, 170, 186, 4, { borderRadius: 2, backgroundColor: '#D6D5D0' })} />
          <Shade id="rd-frontdoor-shade" l={60} t={178} w={80} h={13} />
        </>
      ) : null}

      {name === 'curtains' ? (
        <>
          <Glow id="rd-curtains-glow" l={96} t={40} size={116} alpha={0.4} />
          <Specks />
          <View style={abs(64, 44, 116, 112, { borderRadius: 8, backgroundColor: '#E4E3DE' })} />
          <VGrad id="rd-curtains-pane" l={72} t={52} w={100} h={96} r={4} from="#FCFBF7" to="#F0EDE2" />
          <View style={abs(121, 52, 2, 96, { backgroundColor: '#D6D5D0' })} />
          <View style={abs(52, 40, 20, 120, { borderRadius: 8, backgroundColor: '#C6C5C0' })} />
          <View style={abs(172, 40, 20, 120, { borderRadius: 8, backgroundColor: '#C6C5C0' })} />
          <View style={abs(50, 96, 24, 8, { borderRadius: 4, backgroundColor: '#E2BA78' })} />
          <View style={abs(170, 96, 24, 8, { borderRadius: 4, backgroundColor: '#E2BA78' })} />
          <View style={abs(58, 156, 128, 7, { borderRadius: 3, backgroundColor: '#D6D5D0' })} />
          <Svg width={26} height={40} viewBox="0 0 26 40" style={{ position: 'absolute', left: 196, top: 120 }}>
            <Path d="M13 38 L13 20 M13 24 C6 22 4 14 6 8 C12 10 14 16 13 24 M13 28 C20 26 22 18 20 12 C14 14 12 20 13 28" stroke="#B4B1AB" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          </Svg>
          <View style={abs(190, 156, 20, 14, { borderTopLeftRadius: 2, borderTopRightRadius: 2, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, backgroundColor: '#B4B1AB' })} />
          <Svg width={90} height={30} viewBox="0 0 90 30" style={{ position: 'absolute', left: 80, top: 162 }}>
            <Path d="M2 2 L88 2 L74 28 L16 28 Z" fill="rgba(226,186,120,0.22)" />
          </Svg>
          <Shade id="rd-curtains-shade" l={58} t={164} w={132} h={13} />
        </>
      ) : null}

      {name === 'clash' ? (
        <>
          <Glow id="rd-clash-glow" l={64} t={46} size={116} alpha={0.38} />
          <Specks />
          <View style={abs(14, 40, 108, 56, { borderRadius: 14, backgroundColor: '#E0DFDA', transform: [{ rotate: '-4deg' }] })} />
          <Svg width={24} height={20} viewBox="0 0 24 20" style={{ position: 'absolute', left: 38, top: 92 }}>
            <G transform="rotate(-4 12 8)">
              <Path d="M4 0 L4 16 L20 0 Z" fill="#E0DFDA" />
            </G>
          </Svg>
          <View style={abs(30, 56, 64, 5, { borderRadius: 3, backgroundColor: '#C6C5C0', transform: [{ rotate: '-4deg' }] })} />
          <View style={abs(30, 70, 44, 5, { borderRadius: 3, backgroundColor: '#C6C5C0', transform: [{ rotate: '-4deg' }] })} />
          <View style={abs(120, 92, 108, 56, { borderRadius: 14, backgroundColor: '#F7F6F2', borderWidth: 2, borderColor: '#D6D5D0', transform: [{ rotate: '3deg' }] })} />
          <Svg width={24} height={20} viewBox="0 0 24 20" style={{ position: 'absolute', left: 176, top: 144 }}>
            <G transform="rotate(3 12 8)">
              <Path d="M20 0 L20 16 L4 0 Z" fill="#F7F6F2" stroke="#D6D5D0" strokeWidth={2} />
            </G>
          </Svg>
          <View style={abs(136, 108, 64, 5, { borderRadius: 3, backgroundColor: '#D6D5D0', transform: [{ rotate: '3deg' }] })} />
          <View style={abs(136, 122, 40, 5, { borderRadius: 3, backgroundColor: '#D6D5D0', transform: [{ rotate: '3deg' }] })} />
          <Svg width={30} height={30} viewBox="0 0 30 30" style={{ position: 'absolute', left: 100, top: 74 }}>
            <Path d="M6 24 L24 6 M6 6 L24 24" stroke="#E2BA78" strokeWidth={3.5} strokeLinecap="round" opacity={0.85} />
          </Svg>
          <View style={abs(36, 170, 170, 4, { borderRadius: 2, backgroundColor: '#D6D5D0' })} />
          <Shade id="rd-clash-shade1" l={24} t={178} w={90} h={13} />
          <Shade id="rd-clash-shade2" l={130} t={178} w={90} h={13} />
        </>
      ) : null}

      {name === 'toppled' ? (
        <>
          <Specks a={[214, 26]} b={[16, 44]} />
          <Shade id="rd-toppled-shade" l={45} t={180} w={150} h={11} />
          {/* the board, clipped: the last column overhangs it by 0.02 */}
          <View style={abs(52, 134, 136, 44, { borderRadius: 6, overflow: 'hidden', boxShadow: '0 3px 8px rgba(40,38,32,0.1)' })}>
            {TOPPLED_TILES.map(([x, y, fill]) => (
              <View key={`${x}-${y}`} style={abs(x, y, 22.67, 22, { backgroundColor: fill })} />
            ))}
          </View>
          <Glow id="rd-toppled-glow" l={62} t={48} size={52} alpha={0.45} />
          <Shade id="rd-toppled-piece" l={71} t={130} w={34} h={11} alpha={0.08} />
          {/* the one still standing */}
          <View style={abs(79, 69, 18, 18, { borderRadius: 9, backgroundColor: '#6B6862' })} />
          <View style={abs(76, 89, 24, 5, { borderRadius: 2.5, backgroundColor: '#6B6862' })} />
          <View
            style={abs(81, 94, 14, 26, {
              borderTopLeftRadius: 7,
              borderTopRightRadius: 7,
              borderBottomRightRadius: 3,
              borderBottomLeftRadius: 3,
              backgroundColor: '#6B6862',
            })}
          />
          <View
            style={abs(74, 120, 28, 8, {
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 2,
              borderBottomLeftRadius: 2,
              backgroundColor: '#6B6862',
            })}
          />
          {/* the one that went over — 84° about the group's own centre, which
              reads as six degrees off upright rather than flat. The canvas is
              unambiguous and internally consistent, so it is transcribed. */}
          <View style={abs(132, 96, 52, 30, { transform: [{ rotate: '84deg' }], transformOrigin: 'center', opacity: 0.85 })}>
            <View style={abs(0, 11, 15, 15, { borderRadius: 7.5, backgroundColor: '#B4B1AB' })} />
            <View style={abs(14, 13, 5, 11, { borderRadius: 2, backgroundColor: '#B4B1AB' })} />
            <View
              style={abs(18, 11, 22, 14, {
                borderTopLeftRadius: 3,
                borderTopRightRadius: 7,
                borderBottomRightRadius: 7,
                borderBottomLeftRadius: 3,
                backgroundColor: '#B4B1AB',
              })}
            />
            <View
              style={abs(39, 8, 8, 21, {
                borderTopLeftRadius: 2,
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                borderBottomLeftRadius: 2,
                backgroundColor: '#B4B1AB',
              })}
            />
          </View>
          <View style={abs(88, 60, 5, 5, { borderRadius: 2.5, backgroundColor: 'rgba(226,186,120,0.9)' })} />
        </>
      ) : null}

      {name === 'writeit' ? (
        <>
          <Glow id="rd-writeit-glow" l={70} t={42} size={120} alpha={0.34} />
          <Specks />
          <View style={abs(52, 70, 112, 84, { borderRadius: 8, backgroundColor: '#F7F6F2', borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.06)', transform: [{ rotate: '-2deg' }] })} />
          <View style={abs(106, 72, 2, 80, { backgroundColor: '#E0DFDA', transform: [{ rotate: '-2deg' }] })} />
          <View style={abs(64, 88, 32, 4, { borderRadius: 2, backgroundColor: '#E0DFDA' })} />
          <View style={abs(64, 100, 32, 4, { borderRadius: 2, backgroundColor: '#E0DFDA' })} />
          <View style={abs(118, 86, 32, 4, { borderRadius: 2, backgroundColor: '#E0DFDA' })} />
          {/* the pen: barrel, nib and grip, all on the same -24° */}
          <View
            style={abs(142, 120, 44, 6, {
              borderRadius: 3,
              backgroundColor: '#E9D2A4',
              boxShadow: 'inset 0 -1.5px 0 rgba(0,0,0,0.08)',
              transform: [{ rotate: '-24deg' }],
              transformOrigin: 'left center',
            })}
          />
          <Svg width={8} height={6} viewBox="0 0 8 6" style={{ position: 'absolute', left: 181, top: 101.5, transform: [{ rotate: '-24deg' }] }}>
            <Path d="M0 0 L8 3 L0 6 Z" fill="#55534E" />
          </Svg>
          <View style={abs(139, 119, 7, 6.5, { borderRadius: 3, backgroundColor: '#C6C5C0', transform: [{ rotate: '-24deg' }] })} />
          <Svg width={30} height={28} viewBox="0 0 30 28" style={{ position: 'absolute', left: 34, top: 150 }}>
            <Path d="M15 2 C22 2 28 8 26 15 C29 20 24 26 18 25 C12 28 5 25 5 19 C1 15 4 8 9 7 C10 3 12 2 15 2 Z" fill="#EBEAE4" stroke="#D6D5D0" strokeWidth={1.8} />
          </Svg>
          <Svg width={26} height={24} viewBox="0 0 26 24" style={{ position: 'absolute', left: 66, top: 160 }}>
            <Path d="M13 2 C19 2 24 7 22 13 C25 17 20 22 15 21 C10 24 4 21 4 16 C1 12 4 7 8 6 Z" fill="#EBEAE4" stroke="#D6D5D0" strokeWidth={1.6} />
          </Svg>
          <Svg width={40} height={60} viewBox="0 0 40 60" style={{ position: 'absolute', left: 178, top: 120 }}>
            <Path d="M6 8 L34 8 L30 56 L10 56 Z" fill="#D6D5D0" />
            <Path d="M4 8 L36 8" stroke="#B4B1AB" strokeWidth={3} strokeLinecap="round" />
          </Svg>
          <Shade id="rd-writeit-shade" l={48} t={180} w={120} h={13} />
        </>
      ) : null}
    </View>
  );
}

// ═══ the page chrome ══════════════════════════════════════════════════

function RDGrabber() {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 12, alignItems: 'center' }}>
      <View style={{ width: 38, height: 5, borderRadius: 3, backgroundColor: 'rgba(19,19,19,0.16)' }} />
    </View>
  );
}

function RDClose({ onPress }: { onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityLabel="Close"
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      style={{ position: 'absolute', right: 22, top: 26, width: 20, height: 20, minHeight: 0 }}>
      <Svg width={20} height={20} viewBox="0 0 20 20">
        <Path d="M3 3l14 14M17 3L3 17" stroke="#55534E" strokeWidth={2} strokeLinecap="round" />
      </Svg>
    </PressScale>
  );
}

function RDDots({ total, index }: { total: number; index: number }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 66, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={{ width: i === index ? 20 : 6.5, height: 6.5, borderRadius: 4, backgroundColor: i === index ? '#131313' : 'rgba(19,19,19,0.18)' }} />
      ))}
    </View>
  );
}

/** The canvas asks a different pair of questions on each of the three pages:
 * page one offers the whole run, the other two just move through it. */
const RD_CTA = ['Walk through it', 'Next', 'Done'];
const RD_GHOST = ['Not tonight', 'Back', 'Back'];

/**
 * One page of a protocol (canvas 001–021). Everything is quoted off the sheet,
 * which the canvas puts at frame y 52 — two points above where the status bar
 * ends, so on device it starts two points above the safe-area inset.
 */
export function RDMovePage({
  art,
  total,
  index,
  headline,
  sub,
  act,
  onNext,
  onGhost,
  onClose,
}: {
  art: RDArt;
  total: number;
  index: number;
  headline: string;
  sub: string;
  act?: string;
  onNext: () => void;
  onGhost: () => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const step = Math.min(index, RD_CTA.length - 1);

  return (
    <View style={{ flex: 1, backgroundColor: '#EDECE7' }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: Math.max(0, insets.top - 2),
          bottom: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: '#F4F3F0',
          overflow: 'hidden',
        }}>
        <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />
        <RDGrabber />
        <RDClose onPress={onClose} />
        <RDDots total={total} index={index} />
        <AppText center style={[sans('500'), { position: 'absolute', left: 36, right: 36, top: 104, fontSize: 26, lineHeight: 33, letterSpacing: -0.2, color: '#1D1C1A' }]}>
          {headline}
        </AppText>
        <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: 152, fontSize: 14.5, lineHeight: 21, color: '#8B8882' }]}>
          {sub}
        </AppText>
        <View style={{ position: 'absolute', left: 76, top: 216, width: 240, height: 220 }}>
          <RDArtwork name={art} />
        </View>
        {act ? (
          <AppText center style={[sans('500'), { position: 'absolute', left: 48, right: 48, top: 452, fontSize: 16, lineHeight: 24, color: '#1D1C1A' }]}>
            {act}
          </AppText>
        ) : null}
        <PressScale
          onPress={onNext}
          accessibilityRole="button"
          style={{ position: 'absolute', left: 24, right: 24, bottom: 88, height: 54, minHeight: 54, borderRadius: 27, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 16.5, letterSpacing: 0.2, color: '#FFFFFF' }]}>{RD_CTA[step]}</AppText>
        </PressScale>
        <PressScale
          onPress={onGhost}
          accessibilityRole="button"
          hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 44, minHeight: 0, alignItems: 'center' }}>
          <AppText style={[sans('500'), { fontSize: 14.5, color: '#8B8882' }]}>{RD_GHOST[step]}</AppText>
        </PressScale>
      </View>
    </View>
  );
}
