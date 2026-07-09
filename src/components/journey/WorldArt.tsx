/**
 * WorldArt — the journey's 12 custom per-world scenes, a 1:1 port of the design
 * bundle's `screens-worlds-art.jsx`. Each scene is a self-contained atmospheric
 * SVG, a monochrome silhouette lifted by a soft accent tint that shifts per
 * world (sea-blue → island-green → summit-violet). Atmospheric/dark by design.
 */

import { useId } from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { seaFill, seaPath } from '@/lib/worlds';
import { wa } from '@/lib/oklch';

export function WorldArt({ scene, hue, w = 402, h = 300, sky = true }: { scene: string; hue: number; w?: number; h?: number; sky?: boolean }) {
  const gid = `${scene}-${useId().replace(/:/g, '')}`;
  const TOP = wa(hue, 0.52, 0.11),
    MID = wa(hue, 0.26, 0.085),
    BOT = '#06080B';
  const sun = wa(hue, 0.9, 0.07);
  const sunGlow = wa(hue, 0.82, 0.1, 0.32);
  const dk1 = wa(hue, 0.2, 0.05),
    dk2 = wa(hue, 0.14, 0.045),
    dk3 = wa(hue, 0.1, 0.04);
  const lite = wa(hue, 0.86, 0.06);

  const Sun = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
    <G>
      <Circle cx={cx} cy={cy} r={r * 2.1} fill={sunGlow} />
      <Circle cx={cx} cy={cy} r={r} fill={sun} />
    </G>
  );

  let body: React.ReactNode = null;
  switch (scene) {
    // 1 · Shore — low sun, calm tide lines over a pale beach
    case 'shore':
      body = (
        <>
          <Sun cx={300} cy={84} r={40} />
          <Path d="M0 150C60 132 110 140 150 150 200 162 250 132 300 142 340 150 384 156 402 150V300H0Z" fill={dk3} />
          <Path d={seaFill(206, 9, h)} fill={dk1} />
          <Path d={seaPath(206, 9)} stroke={wa(hue, 0.75, 0.08, 0.55)} strokeWidth={2} fill="none" />
          <Path d={seaPath(228, 7)} stroke={wa(hue, 0.7, 0.08, 0.3)} strokeWidth={1.8} fill="none" />
          <Path d="M0 262C90 244 150 256 230 252 300 249 350 260 402 250V300H0Z" fill={wa(hue, 0.8, 0.05, 0.16)} />
        </>
      );
      break;

    // 2 · Sailing — open sea horizon, a small boat under one sail
    case 'sailing':
      body = (
        <>
          <Sun cx={86} cy={92} r={30} />
          <Path d={seaFill(184, 6, h)} fill={dk2} />
          <Path d={seaPath(184, 6)} stroke={wa(hue, 0.72, 0.08, 0.5)} strokeWidth={1.6} fill="none" />
          <G transform="translate(214 150)">
            <Path d="M2 6L2 -54" stroke={lite} strokeWidth={2.4} strokeLinecap="round" />
            <Path d="M5 -52C26 -40 30 -16 30 -2L5 -2Z" fill={wa(hue, 0.85, 0.06, 0.95)} />
            <Path d="M-1 -50C-16 -38 -19 -16 -19 -2L-1 -2Z" fill={wa(hue, 0.7, 0.07, 0.6)} />
            <Path d="M-30 0C-22 16 22 16 32 0Z" fill={lite} />
          </G>
          <Path d={seaPath(214, 8)} stroke={wa(hue, 0.7, 0.08, 0.32)} strokeWidth={1.8} fill="none" />
          <Path d={seaFill(236, 9, h)} fill={wa(hue, 0.16, 0.05, 0.7)} />
        </>
      );
      break;

    // 3 · Deep Waters — submerged, light shafts from the surface, bubbles
    case 'deep':
      body = (
        <>
          <Path d={seaPath(46, 7)} stroke={wa(hue, 0.78, 0.08, 0.5)} strokeWidth={2} fill="none" />
          <Path d={seaPath(54, 6)} stroke={wa(hue, 0.72, 0.08, 0.25)} strokeWidth={1.6} fill="none" />
          <Path d="M150 46L96 300 168 300 196 46Z" fill={wa(hue, 0.8, 0.06, 0.1)} />
          <Path d="M250 46L300 300 232 300 214 46Z" fill={wa(hue, 0.8, 0.06, 0.08)} />
          {([[120, 250, 4], [134, 210, 3], [128, 170, 2.4], [280, 230, 5], [292, 188, 3], [286, 150, 2.2], [200, 140, 3]] as const).map(([x, y, r], i) => (
            <Circle key={i} cx={x} cy={y} r={r} fill="none" stroke={wa(hue, 0.85, 0.05, 0.4)} strokeWidth={1.3} />
          ))}
          <Path d="M0 276C80 262 150 270 226 266 300 262 360 272 402 264V300H0Z" fill={wa(hue, 0.12, 0.05, 0.9)} />
        </>
      );
      break;

    // 4 · New Island — landfall: an island with a single tree rising from the sea
    case 'island':
      body = (
        <>
          <Sun cx={312} cy={78} r={34} />
          <Path d={seaFill(200, 5, h)} fill={dk2} />
          <Path d="M104 202C120 168 150 150 190 150 232 150 266 172 286 202Z" fill={dk1} />
          <Path d="M150 202C160 180 176 170 196 170 214 170 230 180 240 202Z" fill={wa(hue, 0.3, 0.06)} />
          <Path d="M196 168L196 138" stroke={lite} strokeWidth={2.2} strokeLinecap="round" />
          <Circle cx={196} cy={130} r={13} fill={wa(hue, 0.8, 0.08, 0.9)} />
          <Path d={seaPath(214, 6)} stroke={wa(hue, 0.72, 0.08, 0.4)} strokeWidth={1.8} fill="none" />
          <Path d={seaFill(236, 7, h)} fill={wa(hue, 0.16, 0.05, 0.75)} />
        </>
      );
      break;

    // 5 · Mountain Base — foothills with pines, the mountain ahead
    case 'base':
      body = (
        <>
          <Sun cx={300} cy={74} r={30} />
          <Path d="M150 188L236 70 322 188Z" fill={dk2} />
          <Path d="M236 70L214 100C224 92 248 92 258 100Z" fill={wa(hue, 0.82, 0.05, 0.8)} />
          <Path d="M0 196C70 168 120 184 180 186 250 188 320 174 402 192V300H0Z" fill={dk1} />
          {([[60, 196], [92, 204], [330, 198], [360, 206]] as const).map(([x, y], i) => (
            <Path key={i} d={`M${x} ${y}L${x - 11} ${y + 26}L${x + 11} ${y + 26}Z`} fill={wa(hue, 0.34, 0.06)} />
          ))}
          <Path d="M0 250C90 234 150 244 230 240 300 237 360 248 402 240V300H0Z" fill={wa(hue, 0.18, 0.05)} />
          {([[150, 268], [180, 262], [210, 256]] as const).map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={3.2} fill={wa(hue, 0.85, 0.05, 0.5)} />
          ))}
        </>
      );
      break;

    // 6 · Climbing the Mountain — a slope with a switchback trail
    case 'climb':
      body = (
        <>
          <Path d="M402 300L402 96 150 300Z" fill={dk2} />
          <Path d="M150 300L368 92 402 92 402 70 150 300Z" fill={dk1} />
          <Path d="M120 296L250 248 150 214 268 176 196 150" fill="none" stroke={wa(hue, 0.85, 0.06, 0.55)} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 9" />
          <Circle cx={196} cy={150} r={5.5} fill={lite} />
          <Path d="M0 280C60 270 90 276 140 272 120 286 40 290 0 300Z" fill={wa(hue, 0.7, 0.04, 0.14)} />
        </>
      );
      break;

    // 7 · Checkpoint — a sheltered cave on the mountain with a warm ember
    case 'cave':
      body = (
        <>
          <Path d="M0 300L0 120C120 96 150 150 220 150 300 150 340 120 402 132L402 300Z" fill={wa(hue, 0.3, 0.07)} />
          <Path d="M0 300L0 168C110 150 156 188 220 188 300 188 348 162 402 172L402 300Z" fill={wa(hue, 0.2, 0.055)} />
          <Path d="M148 300C148 220 175 190 210 190 245 190 272 220 272 300Z" fill={wa(40, 0.6, 0.1, 0.22)} />
          <Path d="M154 300C154 224 179 196 210 196 241 196 266 224 266 300Z" fill="#04060A" />
          <Circle cx={210} cy={266} r={30} fill={wa(40, 0.8, 0.14, 0.3)} />
          <Circle cx={210} cy={266} r={13} fill={wa(38, 0.7, 0.13, 0.5)} />
          <Circle cx={210} cy={268} r={6} fill={wa(52, 0.9, 0.13, 0.98)} />
          <Path d="M0 300C44 264 92 280 126 300Z" fill={wa(hue, 0.15, 0.05)} />
          <Path d="M296 300C330 270 374 282 402 300Z" fill={wa(hue, 0.15, 0.05)} />
        </>
      );
      break;

    // 8 · Climbing Higher — steep cliffs above a sea of cloud, first stars
    case 'higher':
      body = (
        <>
          {([[70, 60], [120, 92], [320, 70], [350, 110], [200, 50], [280, 120]] as const).map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={i % 2 ? 1.1 : 1.6} fill={wa(hue, 0.92, 0.04, 0.7)} />
          ))}
          <Path d="M0 300L0 150 96 60 150 150 96 300Z" fill={dk1} />
          <Path d="M402 300L402 130 300 56 250 160 330 300Z" fill={dk2} />
          <Path d="M120 300L150 200 220 150" fill="none" stroke={wa(hue, 0.85, 0.06, 0.5)} strokeWidth={2} strokeLinecap="round" strokeDasharray="2 9" />
          <Path d="M0 256C70 240 120 250 190 246 270 242 340 252 402 244V300H0Z" fill={wa(hue, 0.74, 0.04, 0.18)} />
          <Path d="M0 280C90 268 160 276 240 272 310 269 360 278 402 272V300H0Z" fill={wa(hue, 0.7, 0.04, 0.26)} />
        </>
      );
      break;

    // 9 · Final Stretch — above the clouds, summit tip, violet night
    case 'clouds':
      body = (
        <>
          {([[60, 56], [110, 90], [300, 60], [340, 100], [180, 44], [240, 78], [80, 130]] as const).map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={i % 2 ? 1 : 1.6} fill={wa(hue, 0.93, 0.04, 0.75)} />
          ))}
          <Sun cx={210} cy={66} r={20} />
          <Path d="M168 150L210 78 252 150Z" fill={dk1} />
          <Path d="M210 78L196 102C202 96 218 96 224 102Z" fill={wa(hue, 0.84, 0.05, 0.85)} />
          <Path d="M0 188C60 172 110 182 180 178 260 174 330 184 402 176V300H0Z" fill={wa(hue, 0.72, 0.05, 0.2)} />
          <Path d="M0 224C80 210 150 220 230 216 300 213 360 222 402 216V300H0Z" fill={wa(hue, 0.66, 0.05, 0.3)} />
          <Path d="M0 264C90 252 160 260 240 256 310 253 360 262 402 256V300H0Z" fill={wa(hue, 0.6, 0.05, 0.45)} />
        </>
      );
      break;

    // 10 · Mountaintop — the summit with a flag, dawn behind, panorama below
    case 'summit':
      body = (
        <>
          <Sun cx={206} cy={92} r={48} />
          {([[60, 60], [330, 70], [120, 40], [300, 44]] as const).map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={1.3} fill={wa(hue, 0.95, 0.03, 0.6)} />
          ))}
          <Path d="M70 300L206 96 342 300Z" fill={dk1} />
          <Path d="M206 96L182 134C194 124 220 124 232 134Z" fill={wa(hue, 0.88, 0.05, 0.9)} />
          <Path d="M206 96L206 64" stroke={lite} strokeWidth={2.6} strokeLinecap="round" />
          <Path d="M206 65L232 72 206 80Z" fill={wa(hue, 0.85, 0.1, 0.95)} />
          <Path d="M0 268C70 250 120 260 180 256 260 252 330 262 402 254V300H0Z" fill={wa(hue, 0.62, 0.05, 0.4)} />
          <Path d="M0 290C90 280 160 286 240 283 310 281 360 288 402 284V300H0Z" fill={wa(hue, 0.7, 0.05, 0.55)} />
        </>
      );
      break;

    // side · Curiosities — a compass star with scattered experiment tokens
    case 'curio':
      body = (
        <>
          {([[96, 96, 7], [300, 110, 6], [120, 200, 5], [320, 210, 7], [210, 240, 5]] as const).map(([x, y, r], i) => (
            <G key={i} transform={`rotate(45 ${x} ${y})`}>
              <Rect x={x - r} y={y - r} width={r * 2} height={r * 2} rx={2} fill="none" stroke={wa(hue, 0.85, 0.08, 0.5)} strokeWidth={1.4} />
            </G>
          ))}
          <G transform="translate(206 150)">
            <Circle r={46} fill="none" stroke={wa(hue, 0.8, 0.08, 0.35)} strokeWidth={1.4} strokeDasharray="3 7" />
            <Path d="M0 -38L11 0 0 38 -11 0Z" fill={wa(hue, 0.86, 0.1, 0.92)} />
            <Path d="M-38 0L0 -11 38 0 0 11Z" fill={wa(hue, 0.7, 0.08, 0.7)} />
          </G>
        </>
      );
      break;

    // side · Get Help Now — a steady lighthouse beacon over a calm sea
    case 'help':
      body = (
        <>
          <Path d="M206 110L70 40 56 70Z" fill={wa(hue, 0.85, 0.09, 0.14)} />
          <Path d="M206 110L336 40 350 70Z" fill={wa(hue, 0.85, 0.09, 0.14)} />
          <Path d="M206 110L120 250 150 250Z" fill={wa(hue, 0.85, 0.09, 0.1)} />
          <Path d="M206 110L286 250 256 250Z" fill={wa(hue, 0.85, 0.09, 0.1)} />
          <G transform="translate(206 0)">
            <Path d="M-13 210L-9 120 9 120 13 210Z" fill={dk1} />
            <Path d="M-10 120L10 120 8 102 -8 102Z" fill={wa(hue, 0.3, 0.06)} />
            <Circle cx={0} cy={110} r={9} fill={wa(hue, 0.88, 0.12, 0.95)} />
            <Circle cx={0} cy={110} r={20} fill={wa(hue, 0.85, 0.12, 0.25)} />
          </G>
          <Path d="M0 210C70 200 130 206 206 204 280 202 340 208 402 202V300H0Z" fill={dk2} />
          <Path d={seaPath(232, 5)} stroke={wa(hue, 0.7, 0.07, 0.3)} strokeWidth={1.6} fill="none" />
        </>
      );
      break;

    default:
      body = <Rect width={402} height={h} fill="none" />;
  }

  return (
    <Svg width={w} height={h} viewBox={`0 0 402 ${h}`} preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id={`sky-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={TOP} />
          <Stop offset="52%" stopColor={MID} />
          <Stop offset="100%" stopColor={BOT} />
        </LinearGradient>
      </Defs>
      {sky ? <Rect width={402} height={h} fill={`url(#sky-${gid})`} /> : null}
      {body}
    </Svg>
  );
}
