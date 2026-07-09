/**
 * WorldArt — the journey's 12 per-world scenes, a 1:1 port of the design
 * bundle's current `screens-worlds-art.jsx`: drawn in the SAME faceted-planar
 * language as the home screen's "next lesson" illustration — warm paper sky,
 * layered ridges that fade with distance, two-tone lit/shade faces on every
 * form, and a winding near-white path as the recurring signature. Ink is used
 * only for tiny narrative marks (gulls, flags, figures); the cave ember and
 * lighthouse lamp stay literally warm because they depict light, not UI.
 *
 * `hue` is accepted for call-site compatibility but ignored — the palette is
 * warm paper greys, no hue (matches the monochrome VICI system).
 */

import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

// Palette lifted from the "next lesson" art: warm paper greys, no hue.
const P = {
  skyTop: '#F8F6EF',
  skyLo: '#EFECE1',
  far: '#E9E6D9',
  farShade: '#E1DECF',
  midLit: '#E1DDCD',
  midShade: '#D2CDBA',
  nearLit: '#D8D3C0',
  nearShade: '#C5C0AA',
  fgLit: '#C9C4AE',
  fgShade: '#B4AF98',
  fgDeep: '#A8A38C',
  path: '#F7F5ED',
  snow: '#F4F2E9',
  waterHi: '#E7E4D5',
  water: '#D9D5C2',
  waterLo: '#C8C3AD',
  waterDeep: '#B3AE97',
  foam: '#F5F3EA',
  ink: '#4A4A42',
  sun: '#F2EFE2',
};

// two-stroke gull, home-icon ink
function Gull({ x, y, s = 1, o = 0.75 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <Path
      d={`M${x - 7 * s} ${y} Q ${x - 2.4 * s} ${y - 4.6 * s} ${x} ${y} Q ${x + 2.4 * s} ${y - 4.6 * s} ${x + 7 * s} ${y}`}
      stroke={P.ink}
      strokeWidth={1.6 * s}
      strokeLinecap="round"
      fill="none"
      opacity={o}
    />
  );
}

// a faceted pine: lit + shade halves
function Pine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G>
      <Path d={`M${x} ${y - 30 * s} L${x - 10 * s} ${y} L${x} ${y} Z`} fill={P.nearShade} />
      <Path d={`M${x} ${y - 30 * s} L${x + 9 * s} ${y} L${x} ${y} Z`} fill={P.fgShade} />
    </G>
  );
}

export function WorldArt({
  scene,
  w = '100%',
  h = '100%',
  sky = true,
  fit = 'xMidYMid slice',
}: {
  scene: string;
  hue?: number;
  w?: number | string;
  h?: number | string;
  sky?: boolean;
  fit?: string;
}) {
  const gid = `${scene}-${useId().replace(/:/g, '')}`;

  const PaleSun = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
    <G>
      <Circle cx={cx} cy={cy} r={r * 2.6} fill={`url(#sung-${gid})`} />
      <Circle cx={cx} cy={cy} r={r} fill={P.sun} />
    </G>
  );

  const wrap = (children: React.ReactNode, extraDefs: React.ReactNode = null) => (
    <Svg width={w} height={h} viewBox="0 0 402 300" preserveAspectRatio={fit}>
      <Defs>
        <LinearGradient id={`sky-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={P.skyTop} />
          <Stop offset="100%" stopColor={P.skyLo} />
        </LinearGradient>
        <RadialGradient id={`sung-${gid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#EDE7D2" stopOpacity={0.85} />
          <Stop offset="55%" stopColor="#EDE7D2" stopOpacity={0.35} />
          <Stop offset="100%" stopColor="#EDE7D2" stopOpacity={0} />
        </RadialGradient>
        {extraDefs}
      </Defs>
      {sky ? <Rect width={402} height={300} fill={`url(#sky-${gid})`} /> : null}
      {children}
    </Svg>
  );

  switch (scene) {
    // 1 · SHORE
    case 'shore':
      return wrap(
        <>
          <PaleSun cx={306} cy={66} r={24} />
          <Path d="M0 150 L58 126 L104 140 L156 128 L206 148 L206 162 L0 162 Z" fill={P.far} />
          <Path d="M58 126 L104 140 L104 162 L58 162 Z" fill={P.farShade} />
          <Path d="M0 148 H402 V236 H0 Z" fill={P.waterHi} />
          <Path d="M0 162 C 80 156 170 166 260 160 C 320 156 368 162 402 158 V178 C 330 184 250 174 170 180 C 104 184 48 178 0 182 Z" fill={P.water} opacity={0.7} />
          <Path d="M0 196 C 96 188 200 198 300 192 C 340 189 378 194 402 190 V212 C 320 220 230 210 140 218 C 88 222 40 216 0 220 Z" fill={P.waterLo} opacity={0.55} />
          <Path d="M0 162 C 80 156 170 166 260 160" stroke={P.foam} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.6} />
          <Path d="M-6 236 C 70 218 128 238 196 226 C 262 215 318 232 402 214 L402 232 C 330 248 258 230 196 242 C 132 253 72 236 -6 252 Z" fill={P.foam} />
          <Path d="M-6 252 C 72 236 132 253 196 242 C 258 230 330 248 402 232 L402 300 L-6 300 Z" fill={P.fgLit} />
          <Path d="M-6 282 C 90 268 180 280 268 272 C 322 267 366 274 402 268 L402 300 L-6 300 Z" fill={P.fgShade} />
          <Path d="M258 300 L306 250 L402 268 L402 300 Z" fill={P.nearShade} />
          <Path d="M306 250 L402 240 L402 268 Z" fill={P.nearLit} />
          <G transform="translate(340 246)">
            <Ellipse cx={0} cy={4} rx={9} ry={3.4} fill={P.fgShade} />
            <Ellipse cx={0} cy={0} rx={6.4} ry={2.8} fill={P.fgDeep} />
            <Ellipse cx={0} cy={-4} rx={4.2} ry={2.2} fill={P.fgShade} />
            <Circle cx={0} cy={-8} r={2} fill={P.fgDeep} />
          </G>
          {([[76, 278], [94, 270], [114, 264], [136, 258], [158, 253], [180, 249]] as [number, number][]).map(([x, y], i) => (
            <Ellipse key={i} cx={x} cy={y} rx={3} ry={1.7} fill={P.fgDeep} opacity={0.55 - i * 0.05} transform={`rotate(${-18 + i * 3} ${x} ${y})`} />
          ))}
          <Path d="M60 246 q 30 -7 62 -2" stroke={P.foam} strokeWidth={2.4} strokeLinecap="round" opacity={0.9} fill="none" />
          <Path d="M148 238 q 26 -6 54 -1" stroke={P.foam} strokeWidth={2} strokeLinecap="round" opacity={0.6} fill="none" />
          <Gull x={120} y={100} />
          <Gull x={146} y={90} s={0.8} o={0.55} />
        </>,
      );

    // 2 · SAILING
    case 'sailing':
      return wrap(
        <>
          <PaleSun cx={92} cy={62} r={21} />
          <Path d="M282 132 L330 112 L402 128 L402 142 L282 142 Z" fill={P.far} />
          <Path d="M330 112 L360 120 L360 142 L330 142 Z" fill={P.farShade} />
          <Rect x={0} y={132} width={402} height={168} fill={P.waterHi} />
          <Path d="M0 148 C 90 142 180 152 282 146 C 330 143 370 148 402 144 V162 C 330 166 250 158 170 164 C 100 168 50 162 0 166 Z" fill={P.water} />
          <Path d="M0 190 C 80 182 170 194 260 188 C 320 184 366 190 402 186 V212 C 330 218 240 208 160 216 C 96 221 44 214 0 220 Z" fill={P.waterLo} />
          <Path d="M0 252 C 96 242 200 256 300 248 C 340 245 378 250 402 246 V300 H0 Z" fill={P.waterDeep} />
          <Path d="M0 148 C 90 142 180 152 282 146" stroke={P.foam} strokeWidth={1.6} strokeLinecap="round" fill="none" opacity={0.55} />
          <Path d="M214 208 C 190 224 160 238 118 250" stroke={P.foam} strokeWidth={3} strokeLinecap="round" opacity={0.8} fill="none" />
          <Path d="M222 210 C 206 228 188 240 162 252" stroke={P.foam} strokeWidth={2} strokeLinecap="round" opacity={0.5} fill="none" />
          <G transform="translate(218 128)">
            <Path d="M0 78 L0 -46" stroke={P.ink} strokeWidth={2} strokeLinecap="round" opacity={0.85} />
            <Path d="M4 -42 C 30 -26 36 6 36 66 L4 66 Z" fill={P.snow} />
            <Path d="M4 -42 C 12 -32 18 -10 20 66 L4 66 Z" fill={P.midShade} opacity={0.55} />
            <Path d="M-4 -34 C -24 -18 -28 22 -28 66 L-4 66 Z" fill={P.midLit} />
            <Path d="M-38 70 C -24 86 26 86 44 70 L40 78 C 24 90 -20 90 -32 78 Z" fill={P.fgShade} />
            <Path d="M-38 70 L44 70 L40 78 L-32 78 Z" fill={P.fgDeep} />
            <Path d="M-38 70 L44 70" stroke={P.foam} strokeWidth={2.2} strokeLinecap="round" />
          </G>
          <Gull x={286} y={84} />
          <Gull x={312} y={72} s={0.8} o={0.55} />
        </>,
      );

    // 3 · DEEP WATERS
    case 'deep':
      return wrap(
        <>
          <Rect x={0} y={88} width={402} height={62} fill={P.waterHi} />
          <Path d="M0 102 H402 V110 H0 Z" fill={P.water} opacity={0.4} />
          <G transform="translate(316 100)" opacity={0.75}>
            <Path d="M0 12 L0 -12" stroke={P.ink} strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
            <Path d="M2 -10 C 9 -5 11 4 11 12 L2 12 Z" fill={P.snow} />
            <Path d="M-8 14 C -4 18 8 18 12 14 Z" fill={P.fgShade} />
          </G>
          <Path d="M0 144 C 40 126 86 124 130 135 C 176 146 224 148 268 139 C 312 131 360 132 402 139 V176 H0 Z" fill={P.water} />
          <Path d="M0 144 C 40 126 86 124 130 135 C 176 146 224 148 268 139" stroke={P.foam} strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0.85} />
          <Path d="M30 135 C 60 128 96 128 124 134 C 96 137 58 139 30 135 Z" fill={P.waterHi} opacity={0.7} />
          <Path d="M0 196 C 50 172 108 168 162 181 C 214 193 266 195 314 185 C 350 178 380 180 402 185 V226 H0 Z" fill="#BEB9A2" />
          <Path d="M0 196 C 50 172 108 168 162 181 C 214 193 266 195 314 185" stroke={P.foam} strokeWidth={2.6} strokeLinecap="round" fill="none" />
          <Path d="M52 181 C 86 173 126 173 156 180 C 124 184 82 186 52 181 Z" fill={P.water} opacity={0.7} />
          <Path d="M0 254 C 60 224 130 220 196 235 C 258 248 316 250 366 239 C 380 236 392 237 402 239 V300 H0 Z" fill="#A29D85" />
          <Path d="M0 254 C 60 224 130 220 196 235 C 258 248 316 250 366 239" stroke={P.foam} strokeWidth={3.4} strokeLinecap="round" fill="none" />
          <Path d="M76 235 C 112 226 158 226 192 234 C 156 239 108 241 76 235 Z" fill={P.waterLo} opacity={0.9} />
          {([[200, 229, 2.6], [214, 222, 2], [226, 228, 1.5], [238, 221, 1.2]] as [number, number, number][]).map(([x, y, r], i) => (
            <Circle key={i} cx={x} cy={y} r={r} fill={P.foam} opacity={0.9} />
          ))}
          <Gull x={72} y={108} o={0.5} />
        </>,
      );

    // 4 · NEW ISLAND
    case 'island':
      return wrap(
        <>
          <PaleSun cx={318} cy={62} r={22} />
          <Rect x={0} y={140} width={402} height={160} fill={P.waterHi} />
          <Path d="M0 158 C 90 152 190 162 290 156 C 332 154 372 158 402 154 V174 C 320 180 230 170 140 176 C 88 180 40 174 0 178 Z" fill={P.water} opacity={0.6} />
          <Path d="M-6 300 C 60 268 96 244 148 226 C 176 216 190 210 198 204 L230 204 C 220 216 202 224 182 234 C 130 260 90 278 30 300 Z" fill={P.foam} opacity={0.8} />
          <Path d="M116 208 C 128 202 160 198 212 198 C 264 198 294 202 306 208 C 294 214 262 218 212 218 C 160 218 128 214 116 208 Z" fill={P.snow} />
          <Path d="M142 200 C 154 172 180 156 214 156 C 248 156 272 174 284 200 Z" fill={P.midLit} />
          <Path d="M214 156 C 248 156 272 174 284 200 L214 200 Z" fill={P.midShade} />
          <G transform="translate(240 160)">
            <Path d="M-2 40 C 0 26 4 12 12 0" stroke={P.fgDeep} strokeWidth={3.4} strokeLinecap="round" fill="none" />
            <Path d="M12 0 C 26 -8 40 -6 50 2 C 38 2 26 4 16 4 Z" fill={P.nearShade} />
            <Path d="M12 0 C 22 -14 36 -18 48 -14 C 36 -10 24 -4 15 2 Z" fill={P.fgShade} />
            <Path d="M12 0 C 4 -14 -8 -20 -20 -16 C -10 -10 0 -4 9 2 Z" fill={P.nearShade} />
            <Path d="M12 0 C 0 -6 -14 -4 -24 4 C -12 4 0 4 10 4 Z" fill={P.fgShade} />
            <Path d="M12 0 C 14 -12 12 -22 6 -30 C 4 -20 6 -10 9 -2 Z" fill={P.nearShade} />
          </G>
          <Path d="M84 226 L102 216 L118 226 L100 232 Z" fill={P.nearShade} />
          <Path d="M102 216 L118 226 L100 232 Z" fill={P.fgShade} />
          <Path d="M0 246 C 90 238 190 250 290 244 C 336 241 374 246 402 242 V300 H0 Z" fill={P.waterLo} />
          <Path d="M0 246 C 90 238 190 250 290 244" stroke={P.foam} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.5} />
          <Gull x={148} y={110} />
          <Gull x={172} y={100} s={0.8} o={0.5} />
        </>,
      );

    // 5 · MOUNTAIN BASE
    case 'base':
      return wrap(
        <>
          <PaleSun cx={96} cy={56} r={19} />
          <Path d="M118 176 L238 44 L336 176 Z" fill={P.midLit} />
          <Path d="M238 44 L336 176 L280 176 Z" fill={P.midShade} />
          <Path d="M238 44 L292 116 L336 176 L280 176 Z" fill={P.midShade} />
          <Path d="M238 44 L214 78 C 226 70 234 70 240 76 L252 62 Z" fill={P.snow} />
          <Path d="M252 62 L240 76 C 246 74 252 76 256 82 L262 74 Z" fill={P.farShade} />
          <Path d="M0 176 L70 130 L150 176 Z" fill={P.far} />
          <Path d="M70 130 L150 176 L104 176 Z" fill={P.farShade} />
          <Path d="M300 176 L356 140 L402 168 L402 176 Z" fill={P.far} />
          <Path d="M0 176 H402 V300 H0 Z" fill={P.nearLit} />
          <Path d="M0 214 C 80 202 170 212 260 206 C 320 202 368 208 402 204 V300 H0 Z" fill={P.fgLit} />
          <Path d="M0 262 C 96 250 210 262 310 254 C 348 251 380 256 402 252 V300 H0 Z" fill={P.fgShade} />
          <Path d="M60 300 C 96 276 142 262 186 252 C 212 246 230 240 240 232 L254 232 C 246 244 228 252 202 258 C 156 268 116 282 88 300 Z" fill={P.path} />
          <G transform="translate(258 210)">
            <Path d="M0 22 L18 -14 L36 22 Z" fill={P.snow} />
            <Path d="M18 -14 L36 22 L26 22 Z" fill={P.midShade} />
            <Path d="M14 22 L18 8 L22 22 Z" fill={P.fgDeep} />
          </G>
          <Pine x={330} y={232} s={1.1} />
          <Pine x={352} y={238} s={0.85} />
          <Pine x={44} y={236} s={1.05} />
          <Pine x={70} y={244} s={0.8} />
          <Path d="M276 192 C 280 184 274 178 278 170" stroke={P.farShade} strokeWidth={2.4} strokeLinecap="round" fill="none" opacity={0.8} />
          <Gull x={186} y={96} o={0.5} />
        </>,
      );

    // 6 · CLIMBING
    case 'climb':
      return wrap(
        <>
          <Path d="M0 168 L84 84 L170 168 Z" fill={P.far} />
          <Path d="M84 84 L170 168 L120 168 Z" fill={P.farShade} />
          <Path d="M84 84 L72 100 C 80 94 88 94 94 98 Z" fill={P.snow} opacity={0.9} />
          <Path d="M402 34 L402 300 L128 300 Z" fill={P.nearLit} />
          <Path d="M402 34 L402 300 L286 300 Z" fill={P.nearShade} />
          <Path d="M402 34 L336 118 L402 160 Z" fill={P.midLit} opacity={0.7} />
          <Path d="M402 34 L286 300 L238 300 Z" fill={P.midLit} opacity={0.35} />
          <Path d="M0 268 C 70 258 140 264 210 258 C 280 252 340 258 402 250 V300 H0 Z" fill={P.skyLo} opacity={0.85} />
          <Path
            d="M180 300 C 214 288 252 280 288 276 C 312 273 330 268 340 260 C 348 254 344 246 328 242 C 300 236 272 236 252 228 C 240 223 242 214 258 208 C 282 199 312 196 332 186 C 344 180 346 170 336 162 L348 156 C 362 166 358 182 342 190 C 320 201 290 204 268 212 C 258 216 258 220 268 224 C 290 232 322 232 348 240 C 368 246 372 260 356 270 C 340 280 316 284 292 288 C 258 292 222 298 196 300 Z"
            fill={P.path}
          />
          <Circle cx={342} cy={150} r={4.6} fill={P.ink} />
          <Path d="M342 155 L342 162" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
          <Gull x={96} y={196} s={0.8} o={0.5} />
          <Gull x={64} y={206} s={0.7} o={0.4} />
        </>,
      );

    // 7 · CHECKPOINT / cave
    case 'cave':
      return wrap(
        <>
          <Path d="M0 88 L120 64 L212 92 L316 70 L402 92 V300 H0 Z" fill={P.midLit} />
          <Path d="M120 64 L212 92 L196 300 L108 300 Z" fill={P.midShade} opacity={0.4} />
          <Path d="M316 70 L402 92 L402 300 L330 300 Z" fill={P.midShade} opacity={0.45} />
          <Path d="M212 92 L316 70 L302 300 L226 300 Z" fill={P.nearLit} opacity={0.5} />
          <Path d="M0 154 L96 136 L200 156 L306 138 L402 156 V300 H0 Z" fill={P.nearLit} />
          <Path d="M96 136 L200 156 L192 300 L104 300 Z" fill={P.nearShade} opacity={0.35} />
          <Path d="M306 138 L402 156 L402 300 L322 300 Z" fill={P.nearShade} opacity={0.3} />
          <Path d="M168 182 L180 206 L192 182 Z" fill={P.fgShade} opacity={0.6} />
          <Path d="M232 182 L244 210 L256 182 Z" fill={P.fgShade} opacity={0.6} />
          <Path d="M138 300 C 138 216 168 182 212 182 C 256 182 284 216 284 300 Z" fill={P.fgShade} />
          <Path d="M148 300 C 148 224 176 192 212 192 C 248 192 274 224 274 300 Z" fill="#2A251C" />
          <Circle cx={212} cy={262} r={30} fill="rgba(224,150,72,0.28)" />
          <Circle cx={212} cy={262} r={13} fill="rgba(224,140,60,0.5)" />
          <Circle cx={212} cy={264} r={6} fill="#F2A94E" />
          <Path d="M204 272 L220 272 L216 278 L208 278 Z" fill="#6B4A28" />
          <Path d="M96 300 C 130 288 168 282 200 282 L216 282 C 196 290 164 294 136 300 Z" fill={P.path} />
          <G transform="translate(112 268)">
            <Ellipse cx={0} cy={4} rx={9} ry={3.4} fill={P.nearShade} />
            <Ellipse cx={0} cy={-1} rx={6.2} ry={2.8} fill={P.fgShade} />
            <Circle cx={0} cy={-6} r={2.4} fill={P.nearShade} />
          </G>
          <Path d="M0 88 L120 64 L212 92" stroke={P.snow} strokeWidth={2.4} strokeLinecap="round" fill="none" opacity={0.8} />
          <Path d="M0 154 L96 136 L200 156" stroke={P.snow} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.5} />
        </>,
      );

    // 8 · CLIMBING HIGHER
    case 'higher':
      return wrap(
        <>
          <PaleSun cx={330} cy={52} r={19} />
          <Path d="M0 300 L0 128 L92 52 L146 132 L110 300 Z" fill={P.midLit} />
          <Path d="M92 52 L146 132 L110 300 L64 300 Z" fill={P.midShade} />
          <Path d="M92 52 L118 96 L110 300 L88 300 Z" fill={P.nearShade} opacity={0.35} />
          <Path d="M0 128 L92 52 L60 300 L24 300 Z" fill={P.far} opacity={0.3} />
          <Path d="M92 52 L80 70 C 88 64 96 66 100 72 Z" fill={P.snow} />
          <Path d="M402 300 L402 112 L318 66 L282 160 L330 300 Z" fill={P.nearLit} />
          <Path d="M318 66 L282 160 L330 300 L296 300 Z" fill={P.nearShade} />
          <Path d="M318 66 L352 130 L360 300 L330 300 Z" fill={P.midShade} opacity={0.4} />
          <Path d="M318 66 L308 82 C 316 78 324 80 328 86 Z" fill={P.snow} opacity={0.9} />
          <Path d="M112 246 C 150 226 186 214 224 206 C 250 200 270 192 284 180 L296 186 C 280 200 256 210 228 216 C 192 224 156 238 124 256 Z" fill={P.path} />
          <Circle cx={290} cy={183} r={4.2} fill={P.ink} />
          <Path d="M0 258 C 40 246 76 252 116 248 C 122 238 140 236 150 244 C 190 238 232 244 268 240 C 276 230 296 230 304 238 C 340 236 374 240 402 234 V300 H0 Z" fill={P.skyTop} />
          <Path d="M0 284 C 70 274 150 280 230 274 C 300 270 356 276 402 270 V300 H0 Z" fill="#FFFFFF" opacity={0.7} />
          <Gull x={196} y={264} s={0.8} o={0.5} />
          <Gull x={224} y={272} s={0.7} o={0.4} />
        </>,
      );

    // 9 · FINAL STRETCH / clouds
    case 'clouds':
      return wrap(
        <>
          <PaleSun cx={206} cy={54} r={21} />
          <Path d="M96 148 L128 104 L158 148 Z" fill={P.far} />
          <Path d="M128 104 L158 148 L138 148 Z" fill={P.farShade} />
          <Path d="M262 132 L296 84 L330 132 Z" fill={P.midLit} />
          <Path d="M296 84 L330 132 L308 132 Z" fill={P.midShade} />
          <Path d="M296 84 L288 96 C 294 92 300 92 304 96 Z" fill={P.snow} />
          <Path d="M0 178 C 18 164 48 160 70 168 C 78 152 110 148 126 160 C 140 144 176 142 192 156 C 204 146 230 146 242 158 C 258 146 292 146 308 160 C 322 152 350 152 366 162 C 380 158 394 160 402 166 V206 H0 Z" fill="#FBFAF4" />
          <Path d="M0 192 C 80 186 170 190 250 186 C 310 183 366 187 402 184 V206 H0 Z" fill={P.skyLo} opacity={0.7} />
          <Path d="M0 234 C 26 220 62 218 86 228 C 98 212 134 208 152 222 C 170 210 202 210 218 222 C 234 210 268 212 282 224 C 300 214 336 216 356 228 C 374 222 392 226 402 232 V270 H0 Z" fill={P.skyTop} />
          <Path d="M0 254 C 90 246 190 252 280 246 C 330 243 372 247 402 244 V270 H0 Z" fill={P.farShade} opacity={0.55} />
          <Path d="M0 284 C 36 270 80 268 108 278 C 126 264 164 262 184 276 C 208 264 246 266 264 278 C 288 268 328 270 352 280 C 372 274 390 278 402 282 V300 H0 Z" fill={P.farShade} opacity={0.8} />
          <Gull x={70} y={90} o={0.5} />
        </>,
      );

    // 10 · MOUNTAINTOP / summit
    case 'summit':
      return wrap(
        <>
          <Circle cx={206} cy={118} r={104} fill={`url(#sung-${gid})`} />
          <Path d="M62 300 L206 86 L350 300 Z" fill={P.midLit} />
          <Path d="M206 86 L350 300 L262 300 Z" fill={P.midShade} />
          <Path d="M206 86 L246 146 L206 300 L188 300 Z" fill={P.nearLit} opacity={0.65} />
          <Path d="M206 86 L178 128 C 188 120 196 122 200 128 C 206 118 214 118 218 126 C 226 118 234 120 238 128 Z" fill={P.snow} />
          <Path d="M218 126 L238 128 L232 148 C 226 138 220 134 218 126 Z" fill={P.farShade} />
          <Path d="M206 86 L206 52" stroke={P.ink} strokeWidth={2.6} strokeLinecap="round" />
          <Path d="M206 53 L234 61 L206 70 Z" fill={P.ink} />
          <Path d="M0 232 L60 196 L128 232 Z" fill={P.far} opacity={0.9} />
          <Path d="M60 196 L128 232 L94 232 Z" fill={P.farShade} opacity={0.9} />
          <Path d="M280 244 L340 204 L402 244 Z" fill={P.far} opacity={0.85} />
          <Path d="M340 204 L402 244 L364 244 Z" fill={P.farShade} opacity={0.8} />
          <Path d="M0 258 C 50 244 100 250 150 246 C 160 236 180 234 192 242 C 240 236 290 242 330 238 C 360 236 386 240 402 236 V300 H0 Z" fill={P.skyTop} opacity={0.95} />
          <Path d="M0 286 C 80 276 170 282 250 277 C 310 273 366 279 402 274 V300 H0 Z" fill="#FFFFFF" opacity={0.75} />
          <Gull x={92} y={168} s={0.8} o={0.5} />
          <Gull x={118} y={178} s={0.7} o={0.4} />
        </>,
      );

    // side · CURIOSITIES
    case 'curio':
      return wrap(
        <>
          <PaleSun cx={84} cy={56} r={19} />
          <Rect x={0} y={124} width={402} height={66} fill={P.waterHi} />
          <Path d="M0 140 C 90 134 190 144 290 138 C 332 136 372 140 402 136 V156 C 320 162 230 152 140 158 C 88 162 40 156 0 160 Z" fill={P.water} opacity={0.55} />
          <Path d="M-6 186 C 70 176 150 184 230 178 C 296 174 350 180 402 174 L402 188 C 330 194 260 188 190 192 C 120 196 56 192 -6 200 Z" fill={P.foam} />
          <Path d="M-6 200 C 56 192 120 196 190 192 C 260 188 330 194 402 188 V300 H-6 Z" fill={P.fgLit} />
          <Path d="M0 262 C 96 252 210 262 310 254 C 348 251 380 256 402 252 V300 H0 Z" fill={P.fgShade} />
          <Ellipse cx={120} cy={226} rx={44} ry={13} fill={P.foam} />
          <Ellipse cx={120} cy={225} rx={39} ry={10.5} fill={P.skyTop} />
          <Ellipse cx={296} cy={216} rx={30} ry={10} fill={P.foam} />
          <Ellipse cx={296} cy={215} rx={26} ry={8} fill={P.skyTop} />
          <Ellipse cx={212} cy={266} rx={50} ry={14} fill={P.foam} />
          <Ellipse cx={212} cy={265} rx={45} ry={11.5} fill={P.skyTop} />
          <Path d="M262 252 l3.6 4.8 6 .4 -3.6 4.7 1.5 5.7 -5.6-2.1 -5 2.7 .8-6 -4-4.2 5.7-1 Z" fill={P.fgDeep} transform="rotate(-14 264 258)" />
          <G transform="rotate(-8 84 262)">
            <Rect x={52} y={256} width={64} height={7} rx={3.5} fill={P.fgDeep} />
            <Rect x={52} y={256} width={64} height={3} rx={1.5} fill={P.fgShade} />
            <Path d="M112 258 L126 252" stroke={P.fgDeep} strokeWidth={3} strokeLinecap="round" />
          </G>
          <G transform="translate(330 236)">
            <Path d="M-12 10 L0 2 L14 10 L2 16 Z" fill={P.nearShade} />
            <Path d="M0 2 L14 10 L2 16 Z" fill={P.fgShade} />
            <Path d="M0 0 C 0 -8 6 -12 12 -10 C 8 -6 8 -2 10 2 C 4 4 0 4 0 0 Z" fill={P.snow} />
            <Circle cx={10} cy={-9} r={3.2} fill={P.snow} />
            <Path d="M13 -9 L18 -8 L13 -6.5 Z" fill={P.ink} />
            <Path d="M4 4 L4 9 M8 4 L8 9" stroke={P.ink} strokeWidth={1.2} strokeLinecap="round" />
          </G>
          <Gull x={210} y={100} o={0.55} />
        </>,
      );

    // side · GET HELP NOW / lighthouse
    case 'help':
      return wrap(
        <>
          <Path d="M198 92 L30 40 L22 74 Z" fill="#FFFFFF" opacity={0.75} />
          <Path d="M214 92 L382 40 L390 74 Z" fill="#FFFFFF" opacity={0.75} />
          <Circle cx={206} cy={94} r={34} fill={`url(#lamp-${gid})`} />
          <G transform="translate(206 0)">
            <Path d="M-13 198 L-8 106 L0 106 L0 198 Z" fill="#FFFFFF" />
            <Path d="M0 106 L8 106 L13 198 L0 198 Z" fill={P.midShade} />
            <Path d="M-10 132 L10 132 L10 141 L-10 141 Z" fill={P.fgShade} />
            <Path d="M-11 166 L11 166 L11 175 L-11 175 Z" fill={P.fgShade} />
            <Path d="M-11 106 L11 106 L9 94 L-9 94 Z" fill={P.fgDeep} />
            <Circle cx={0} cy={94} r={7} fill="#F2DCA4" />
            <Path d="M-10 88 L10 88 L0 74 Z" fill={P.ink} />
          </G>
          <Path d="M118 226 L170 192 L246 196 L300 226 Z" fill={P.nearLit} />
          <Path d="M246 196 L300 226 L262 226 Z" fill={P.nearShade} />
          <Path d="M84 300 L118 226 L300 226 L338 300 Z" fill={P.fgLit} />
          <Path d="M262 226 L300 226 L338 300 L294 300 Z" fill={P.fgShade} />
          <Path d="M150 300 C 168 274 186 254 206 240 L220 240 C 202 258 188 276 176 300 Z" fill={P.path} />
          <Path d="M0 254 C 40 248 76 252 118 248 L84 300 H0 Z" fill={P.waterHi} />
          <Path d="M338 300 L300 246 C 340 250 374 248 402 244 V300 Z" fill={P.waterHi} />
          <Path d="M0 276 q 30 -5 60 0" stroke={P.foam} strokeWidth={2} strokeLinecap="round" opacity={0.7} fill="none" />
          <Path d="M342 276 q 26 -5 54 0" stroke={P.foam} strokeWidth={2} strokeLinecap="round" opacity={0.7} fill="none" />
          <Gull x={96} y={116} o={0.6} />
          <Gull x={122} y={106} s={0.8} o={0.45} />
        </>,
        <RadialGradient key="lamp" id={`lamp-${gid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#EBCD8C" stopOpacity={0.5} />
          <Stop offset="60%" stopColor="#EBCD8C" stopOpacity={0.18} />
          <Stop offset="100%" stopColor="#EBCD8C" stopOpacity={0} />
        </RadialGradient>,
      );

    default:
      return wrap(<Rect width={402} height={300} fill="none" />);
  }
}
