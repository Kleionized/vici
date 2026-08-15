import { useId, type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

/**
 * The drawn scenes the lesson screens are built on (canvases: Journey Campaign,
 * Story Tracks, Lesson Self Check ×5, Lesson Feelings Grid, Lesson Pair). The
 * handoff draws these rather than photographing them — a pale sky wash, domed
 * hills, a boat, a few birds — so the campaign reads as one continuous coast
 * rather than a stack of stock pictures.
 *
 * Each scene keeps the canvas's own coordinate space in its viewBox and is
 * sliced to fill, so the drawing stays in proportion on any width. Where the
 * canvas blurs a shape, it is redrawn here as a radial gradient with the same
 * falloff — RN SVG has no blur filter.
 */

const C = {
  paper: '#F4F3F0',
  cardTop: '#E9EFF4',
  cardBottom: '#F0EDE5',
  sun: '#F3E3C4',
  hill1: '#DFE8F0',
  hill2: '#D0DDE9',
  hill3: '#C2D2E1',
  sand1: '#EADFC9',
  sand2: '#E0D2B4',
  bird: '#9AA9B8',
  sail: '#3A3934',
  hull: '#131313',
  foam: 'rgba(255,255,255,0.5)',
  cloud: '#FFFFFF',
} as const;

/** A dome — the canvas draws its hills as a wide box with an elliptical top. */
function Dome({ cx, top, rx, ry, fill, opacity }: { cx: number; top: number; rx: number; ry: number; fill: string; opacity?: number }) {
  return <Ellipse cx={cx} cy={top + ry} rx={rx} ry={ry} fill={fill} opacity={opacity} />;
}

function Boat({ x, y, scale = 1, sail = C.sail, hull = C.hull }: { x: number; y: number; scale?: number; sail?: string; hull?: string }) {
  return (
    <Path
      d={`M${x} ${y} l0 ${-20 * scale} l${13 * scale} ${20 * scale} z M${x - 6 * scale} ${y + 1} l${28 * scale} 0 l${-4 * scale} ${7 * scale} l${-20 * scale} 0 z`}
      fill={hull}
      stroke={sail}
      strokeWidth={0}
    />
  );
}

function Birds({ x, y, scale = 1, color = C.bird }: { x: number; y: number; scale?: number; color?: string }) {
  return (
    <Path
      d={`M${x} ${y + 7 * scale}c${3 * scale} ${-5 * scale} ${6 * scale} ${-5 * scale} ${9 * scale} ${-1 * scale}M${x + 15 * scale} ${y + 5 * scale}c${3 * scale} ${-5 * scale} ${6 * scale} ${-5 * scale} ${9 * scale} ${-1 * scale}`}
      fill="none"
      stroke={color}
      strokeWidth={1.7 * scale}
      strokeLinecap="round"
    />
  );
}

function Cloud({ x, y, w, h, opacity = 0.7 }: { x: number; y: number; w: number; h: number; opacity?: number }) {
  return <Rect x={x} y={y} width={w} height={h} rx={h / 2} fill={C.cloud} opacity={opacity} />;
}

// ── the campaign card scene ──────────────────────────────────────────

export type GroundVariant = 'shore' | 'crossing' | 'deep' | 'camp';

const VARIANTS: GroundVariant[] = ['shore', 'crossing', 'deep', 'camp'];

/** A stable scene per ground, cycled so no two neighbours draw the same coast. */
export function groundVariant(index: number): GroundVariant {
  return VARIANTS[Math.abs(index) % VARIANTS.length];
}

/**
 * The 116pt card face. Locked grounds draw the same scene at the canvas's
 * 0.55 opacity so the card reads as weather you have not walked into yet.
 */
export function GroundScene({ width, height = 116, variant, muted = false }: { width: number; height?: number; variant: GroundVariant; muted?: boolean }) {
  const dim = muted ? 0.55 : 1;
  // Ten of these share a screen. SVG ids are document-global, so without a
  // per-instance suffix every card would paint the first card's gradients.
  const uid = useId().replace(/:/g, '');
  return (
    <Svg width={width} height={height} viewBox="0 0 345 116" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id={`gcard-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={C.cardTop} />
          <Stop offset="1" stopColor={C.cardBottom} />
        </LinearGradient>
        <RadialGradient id={`gsun-${uid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={C.sun} stopOpacity={0.95} />
          <Stop offset="0.78" stopColor={C.sun} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={345} height={116} fill={`url(#gcard-${uid})`} />

      {variant === 'shore' && (
        <>
          <Circle cx={216} cy={29} r={25} fill={`url(#gsun-${uid})`} opacity={dim} />
          <Cloud x={170} y={14} w={36} h={11} opacity={0.65 * dim} />
          <Dome cx={300} top={64} rx={130} ry={46} fill={C.sand1} opacity={dim} />
          <Dome cx={370} top={84} rx={120} ry={38} fill={C.sand2} opacity={dim} />
          <Path d="M289 42v28" stroke={C.sail} strokeWidth={2.5} strokeLinecap="round" opacity={dim} />
          <Path d="M291 44l13 5-13 5z" fill={C.sail} opacity={dim} />
          <Birds x={246} y={78} scale={0.6} color="#CDBD92" />
        </>
      )}

      {variant === 'crossing' && (
        <>
          <Circle cx={247} cy={30} r={28} fill={`url(#gsun-${uid})`} opacity={dim} />
          <Dome cx={290} top={60} rx={140} ry={44} fill={C.hill1} opacity={dim} />
          <Dome cx={350} top={78} rx={120} ry={38} fill={C.hill2} opacity={dim} />
          <Dome cx={320} top={96} rx={140} ry={32} fill={C.hill3} opacity={dim} />
          <Boat x={228} y={51} scale={1} />
          <Path d="M169 44v9h6z" fill="#8DA0B2" opacity={dim} />
          <Rect x={173} y={68} width={22} height={3} rx={1.5} fill={C.foam} opacity={dim} />
          <Rect x={269} y={86} width={18} height={3} rx={1.5} fill="rgba(255,255,255,0.45)" opacity={dim} />
          <Birds x={279} y={16} scale={0.85} color="#8DA0B2" />
        </>
      )}

      {variant === 'deep' && (
        <>
          <Dome cx={280} top={56} rx={140} ry={46} fill="#C4D3E1" opacity={dim} />
          <Dome cx={330} top={76} rx={120} ry={38} fill="#B0C4D6" opacity={dim} />
          <Dome cx={300} top={94} rx={140} ry={32} fill="#9FB7CC" opacity={dim} />
          <Rect x={201} y={66} width={24} height={3} rx={1.5} fill="rgba(255,255,255,0.5)" opacity={dim} />
          <Rect x={263} y={84} width={16} height={3} rx={1.5} fill="rgba(255,255,255,0.4)" opacity={dim} />
          <Cloud x={259} y={28} w={34} h={10} opacity={0.5 * dim} />
        </>
      )}

      {variant === 'camp' && (
        <>
          <Circle cx={216} cy={29} r={23} fill={`url(#gsun-${uid})`} opacity={dim} />
          <Dome cx={290} top={66} rx={135} ry={44} fill="#E6DCC6" opacity={dim} />
          <Path d="M272 66l17 -26 17 26z" fill="#55534E" opacity={dim} />
          <Rect x={270} y={56} width={4} height={10} rx={2} fill="#2A2924" opacity={dim} />
          <Ellipse cx={235} cy={61} rx={4} ry={3} fill="#D9A05B" opacity={dim} />
          <Rect x={227} y={63} width={12} height={3} rx={1.5} fill="#8B8882" opacity={dim} />
          <Circle cx={241} cy={51} r={1.5} fill="#B4B1AB" opacity={dim} />
          <Circle cx={246} cy={45} r={1.2} fill="#C6C5C0" opacity={dim} />
        </>
      )}
    </Svg>
  );
}

// ── the story screens' tint ──────────────────────────────────────────

/**
 * The story screens carry a tint per lesson. The bundle draws the same Story
 * Tracks frame twice — neutral in the main file, water in the export — and
 * every tone shifts with the sky: the three headlands, the birds, the trail
 * pips and the disc on the part you are up to.
 *
 * Both palettes below are the canvas's own numbers rather than one derived from
 * the other. They are not a hue rotation of a single ramp: the water headlands
 * are also five points lighter, and the water birds carry four times the
 * saturation of the neutral ones, so no single mix reproduces the pair.
 */
export type LessonTint = 'paper' | 'water';

interface Tint {
  /** Top stop of the header wash; the bottom stop is #EFEDE8 in both. */
  sky: string;
  hill1: string;
  hill2: string;
  hill3: string;
  bird: string;
  /** The outer and inner trail pips. */
  pip1: string;
  pip2: string;
  /** The disc behind the part you are up to. */
  disc: string;
  /** Story Detail's horizon band, which steps one shade lighter than the header's. */
  far1: string;
  far2: string;
  far3: string;
  /** The distant boat on that band. */
  farSail: string;
  farHull: string;
}

const TINTS: Record<LessonTint, Tint> = {
  paper: {
    sky: '#EFEEE8',
    hill1: '#DEDDD6',
    hill2: '#D8D7D0',
    hill3: '#CBCAC3',
    bird: '#ACABA4',
    pip1: '#C7C6BF',
    pip2: '#BAB9B2',
    disc: '#EFEEE8',
    far1: '#DEDDD6',
    far2: '#D8D7D0',
    far3: '#CBCAC3',
    farSail: '#B4B1AB',
    farHull: '#8B8882',
  },
  water: {
    sky: '#E7EEF4',
    hill1: '#DFE8F0',
    hill2: '#D0DDE9',
    hill3: '#C2D2E1',
    bird: '#9AA9B8',
    pip1: '#C3CEDA',
    pip2: '#B2C1D0',
    disc: '#E7EEF4',
    far1: '#E6EDF3',
    far2: '#DAE4EE',
    far3: '#CCDBE8',
    farSail: '#AEB9C6',
    farHull: '#8E9AA8',
  },
};

/** The tones of one tint, for a screen drawing something the scenes do not. */
export function tintTones(tint: LessonTint = 'paper'): Tint {
  return TINTS[tint];
}

/**
 * Which tint a lesson takes. The canvas's water frame is the lesson about
 * riding an urge out, so the lessons about the urge itself get the water and
 * everything else keeps the main file's paper.
 */
const WATER = /\burges?\b|\bwaves?\b|craving|crest|surf|riding|ride it out|tide/i;

export function tintForLesson(text: string): LessonTint {
  return WATER.test(text) ? 'water' : 'paper';
}

// ── the lesson header scene ──────────────────────────────────────────

/**
 * The wash behind a lesson's title (canvas: Story Tracks, the 232pt band) — a
 * warm sky, one sun, three headlands stepping forward, a boat on the middle
 * one, and a fade to paper over the last 70pt so the title sits on nothing.
 *
 * The canvas builds each headland as a box with elliptical top corners, so each
 * is drawn here as the upper half of an ellipse with a rectangle under it.
 *
 * The band is drawn in the device's own width rather than in the 393 frame's,
 * because the sun, the birds, the boat and the foam are all set from the frame's
 * right edge — sliced into a fixed 393 viewBox they would drift inward and the
 * 232pt band would crop itself top and bottom on anything wider.
 *
 * `children` is painted between the sky and the art: the canvas lays its grain
 * down first (Story Tracks line 4) and everything else over it.
 */
export function LessonScene({
  width,
  height = 232,
  tint = 'paper',
  children,
}: {
  width: number;
  height?: number;
  tint?: LessonTint;
  children?: ReactNode;
}) {
  const T = TINTS[tint];
  /** left/right are the canvas's insets past the frame; ry is the corner radius. */
  const headland = (x0: number, x1: number, top: number, boxHeight: number, ry: number) =>
    `M${x0} ${top + ry} A${(x1 - x0) / 2} ${ry} 0 0 1 ${x1} ${top + ry} L${x1} ${top + boxHeight} L${x0} ${top + boxHeight} Z`;
  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} 232`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <LinearGradient id={`lsky-${tint}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={T.sky} />
            <Stop offset="1" stopColor="#EFEDE8" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={232} fill={`url(#lsky-${tint})`} />
      </Svg>

      {children}

      <Svg width={width} height={height} viewBox={`0 0 ${width} 232`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <RadialGradient id="lsun" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#F3E3C4" stopOpacity={1} />
            <Stop offset="0.5" stopColor="#F3E3C4" stopOpacity={1} />
            <Stop offset="1" stopColor="#F3E3C4" stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="lfade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={C.paper} stopOpacity={0} />
            <Stop offset="1" stopColor={C.paper} stopOpacity={1} />
          </LinearGradient>
        </Defs>

        {/* the canvas hangs the 110pt sun off the centre line by -30, so its own
            centre sits 25 to the right of it */}
        <Circle cx={width / 2 + 25} cy={81} r={55} fill="url(#lsun)" />
        <Cloud x={36} y={52} w={44} h={13} opacity={0.75} />
        <Cloud x={58} y={44} w={30} h={11} opacity={0.6} />
        {/* the birds' 26 × 10 box is set from the right edge at 74 */}
        <Path
          d={`M${width - 99} 66C${width - 96} 61 ${width - 93} 61 ${width - 90} 65M${width - 85} 64c3-5 6-5 9-1`}
          fill="none"
          stroke={T.bird}
          strokeWidth={1.8}
          strokeLinecap="round"
        />

        <Path d={headland(-90, width + 90, 118, 180, 90)} fill={T.hill1} />
        <Path d={headland(150, width + 130, 140, 180, 76)} fill={T.hill2} />

        {/* the sail is the canvas's 22 × 14 border triangle, raked off its mast */}
        <Path d={`M${width - 132} 112L${width - 132} 134L${width - 118} 134Z`} fill="#3A3934" />
        {/* the hull's `border-radius: 3px 8px 10px 10px` on a 30 × 8 box: the
            right edge needs 18pt of radius and has 8, so CSS scales all four by
            8/18 before drawing them */}
        <Path d={roundedRect(width - 139, 135, 30, 8, 3 * (8 / 18), 8 * (8 / 18), 10 * (8 / 18), 10 * (8 / 18))} fill="#131313" />

        <Path d={headland(-60, width + 60, 168, 160, 62)} fill={T.hill3} />
        {/* the 2pt radius clamps to the strip's 1.5pt half-height */}
        <Rect x={width - 170} y={186} width={20} height={3} rx={1.5} fill="rgba(255,255,255,0.5)" />

        <Rect x={0} y={162} width={width} height={70} fill="url(#lfade)" />
      </Svg>
    </View>
  );
}

/** A rect with four different corner radii — SVG's own `rx` is uniform. */
function roundedRect(x: number, y: number, w: number, h: number, tl: number, tr: number, br: number, bl: number): string {
  return [
    `M${x + tl} ${y}`,
    `L${x + w - tr} ${y}`,
    `A${tr} ${tr} 0 0 1 ${x + w} ${y + tr}`,
    `L${x + w} ${y + h - br}`,
    `A${br} ${br} 0 0 1 ${x + w - br} ${y + h}`,
    `L${x + bl} ${y + h}`,
    `A${bl} ${bl} 0 0 1 ${x} ${y + h - bl}`,
    `L${x} ${y + tl}`,
    `A${tl} ${tl} 0 0 1 ${x + tl} ${y}`,
    'Z',
  ].join(' ');
}

/**
 * The 330pt head of Story Detail — a moon over a boat on flat water, the sky
 * washing from the lesson's tint down through #EFEDE8 at 62% to paper.
 *
 * The canvas sets the 240 × 170 drawing at left 76 in its 393 frame, which
 * leaves 77 on the other side; it is centred here so it stays put on a wider
 * screen rather than drifting left. The two haloes are blurred on the canvas
 * and RN SVG has no blur, so each is redrawn as the radial it already is.
 */
export function LessonCoverScene({
  width,
  height = 330,
  tint = 'paper',
  children,
}: {
  width: number;
  height?: number;
  tint?: LessonTint;
  children?: ReactNode;
}) {
  const T = TINTS[tint];
  /** left edge of the canvas's 240 × 170 drawing */
  // the canvas pins the 240 x 170 drawing at a literal left:76, not at the
  // centre — `width / 2 - 120` lands on 76.5 at 393 and drags every child with it
  const g = 76;
  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} 330`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <LinearGradient id={`dsky-${tint}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={T.sky} />
            <Stop offset="0.62" stopColor="#EFEDE8" />
            <Stop offset="1" stopColor={C.paper} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={330} fill={`url(#dsky-${tint})`} />
      </Svg>

      {children}

      <Svg width={width} height={height} viewBox={`0 0 ${width} 330`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <RadialGradient id="dmoonglow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFF4D6" stopOpacity={0.55} />
            <Stop offset="0.72" stopColor="#FFF4D6" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="dwarm" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.4} />
            <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="dfade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={C.paper} stopOpacity={0} />
            <Stop offset="1" stopColor={C.paper} stopOpacity={1} />
          </LinearGradient>
        </Defs>

        {/* the 150pt glow the canvas hangs at left 18, top 60 */}
        <Circle cx={93} cy={135} r={75} fill="url(#dmoonglow)" />
        <Circle cx={g + 120} cy={171} r={65} fill="url(#dwarm)" />

        {/* the moon: a disc of sky over a disc of stone, offset up and left */}
        <Circle cx={g + 37} cy={131} r={17} fill="#DCDED8" />
        <Circle cx={g + 29} cy={125} r={17} fill="#FBFAF7" />

        <Rect x={g} y={204} width={240} height={3} rx={1.5} fill="#C9D6E4" />
        <Rect x={g + 14} y={218} width={212} height={3} rx={1.5} fill="#D8E2EC" />
        <Rect x={g + 44} y={232} width={152} height={3} rx={1.5} fill="#E4E9F1" />

        {/* hull `border-radius: 4px 10px 12px 12px` on a 48 × 22 box — the right
            edge needs exactly its 22, so CSS draws all four unscaled */}
        <Path d={roundedRect(g + 96, 174, 48, 22, 4, 10, 12, 12)} fill="#3A3934" />
        <Rect x={g + 117} y={144} width={3} height={32} fill="#55534E" />
        {/* the sail is the canvas's 20-wide left-border triangle */}
        <Path d={`M${g + 120} 146L${g + 120} 168L${g + 140} 157Z`} fill="#C6C5C0" />
        {/* and the far one its 7 × 10 bottom-border triangle. The cover states
            its own #B9C4CE here rather than reusing the horizon band's far
            sail, so it is written out instead of taken from the tint. */}
        <Path d={`M${g + 196} 196L${g + 203} 196L${g + 196} 186Z`} fill="#B9C4CE" />

        <Rect x={g + 56} y={136} width={14} height={5} rx={2.5} fill="#C6C5C0" transform={`rotate(-8 ${g + 63} 138.5)`} />
        <Rect x={g + 74} y={128} width={11} height={4} rx={2} fill="#D6D5D0" transform={`rotate(6 ${g + 79.5} 130)`} />

        <Rect x={0} y={256} width={width} height={74} fill="url(#dfade)" />
      </Svg>
    </View>
  );
}

/**
 * Story Detail's second band: 112pt of horizon under the blurb, three headlands
 * one shade lighter than the header's, a boat far out on the first of them.
 */
export function LessonHorizon({ width, height = 112, tint = 'paper' }: { width: number; height?: number; tint?: LessonTint }) {
  const T = TINTS[tint];
  const headland = (x0: number, x1: number, top: number, boxHeight: number, ry: number) =>
    `M${x0} ${top + ry} A${(x1 - x0) / 2} ${ry} 0 0 1 ${x1} ${top + ry} L${x1} ${top + boxHeight} L${x0} ${top + boxHeight} Z`;
  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} 112`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <RadialGradient id="hsun" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={C.sun} stopOpacity={0.9} />
            <Stop offset="0.78" stopColor={C.sun} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        {/* the 66pt sun is set from the right edge at 58 */}
        <Circle cx={width - 91} cy={39} r={33} fill="url(#hsun)" />
        <Cloud x={52} y={16} w={40} h={12} opacity={0.7} />
        <Cloud x={72} y={9} w={26} h={10} opacity={0.55} />
        <Path
          d={`M${width - 155} 29C${width - 152.5} 25 ${width - 150} 25 ${width - 147.5} 28M${width - 142} 27c2.5-4 5-4 8-1`}
          fill="none"
          stroke={T.bird}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
        <Rect x={width - 118} y={76} width={22} height={3} rx={1.5} fill="rgba(255,255,255,0.55)" />
        <Path d="M120 43L131 43L120 26Z" fill={T.farSail} />
        <Rect x={116} y={44} width={18} height={3} rx={1.5} fill={T.farHull} />

        <Path d={headland(-60, width + 60, 52, 170, 96)} fill={T.far1} />
        <Path d={headland(-140, width + 40, 74, 170, 84)} fill={T.far2} />
        <Path d={headland(-40, width + 160, 94, 170, 72)} fill={T.far3} />
      </Svg>
    </View>
  );
}

export type VistaVariant = 'coast' | 'march' | 'heights';

const VISTAS: VistaVariant[] = ['coast', 'march', 'heights'];

/**
 * Which landscape a given break gets. The campaign sets one every three
 * grounds, and they run coast → march → heights, so the scroll carries you
 * inland and upward rather than showing the same picture three times.
 */
export function vistaVariant(index: number): VistaVariant {
  return VISTAS[Math.abs(index) % VISTAS.length];
}

/** A walker: head and body, the same figure the coast vista puts on its ridge. */
function Walker({ x, y, scale = 1, color = '#7A8794' }: { x: number; y: number; scale?: number; color?: string }) {
  return (
    <>
      <Circle cx={x} cy={y} r={3.5 * scale} fill={color} />
      <Rect x={x - 6 * scale} y={y + 5 * scale} width={13 * scale} height={17 * scale} rx={4 * scale} fill={color} />
    </>
  );
}

/**
 * The big landscape the campaign sets between every third ground — the walk
 * seen from a distance (canvas: Journey Campaign, the 236pt full-bleed band).
 */
export function CampaignVista({ width, height = 236, variant = 'coast' }: { width: number; height?: number; variant?: VistaVariant }) {
  // Several of these share the campaign screen and their gradients differ, so
  // the ids have to be per-instance or the first one would paint them all.
  const uid = useId().replace(/:/g, '');
  const sun = `vsun-${uid}`;
  const fade = `vfade-${uid}`;
  const warm = variant === 'march';
  return (
    <Svg width={width} height={height} viewBox="0 0 393 236" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <RadialGradient id={sun} cx="50%" cy="50%" r="50%">
          <Stop offset="0.52" stopColor={warm ? '#F0DCB4' : C.sun} stopOpacity={1} />
          <Stop offset="1" stopColor={warm ? '#F0DCB4' : C.sun} stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={C.paper} stopOpacity={0} />
          <Stop offset="1" stopColor={C.paper} stopOpacity={1} />
        </LinearGradient>
      </Defs>

      {variant === 'coast' && (
        <>
          <Circle cx={220} cy={91} r={75} fill={`url(#${sun})`} />
          <Cloud x={44} y={36} w={52} h={14} opacity={0.7} />
          <Cloud x={66} y={27} w={34} h={12} opacity={0.55} />
          <Cloud x={293} y={52} w={40} h={12} opacity={0.6} />
          <Birds x={245} y={78} scale={1} />

          <Dome cx={196} top={98} rx={276} ry={120} fill="#E9EFF3" />
          <Dome cx={336} top={122} rx={266} ry={100} fill="#DBE4ED" />

          {/* the far town on the headland */}
          <Rect x={317} y={146} width={11} height={22} rx={5.5} fill="#EAF0F5" />
          <Rect x={304} y={153} width={9} height={15} rx={4.5} fill="#E4ECF3" />
          <Rect x={334} y={155} width={9} height={13} rx={4.5} fill="#E4ECF3" />
          <Rect x={293} y={158} width={7} height={10} rx={3.5} fill="#DFE9F1" />

          <Dome cx={66} top={112} rx={256} ry={110} fill="#D3DEE9" />
          <Walker x={66} y={90} />

          {/* the boat, still out on the water — flat keel, sail raked back */}
          <Path d="M285 166v-18l11 18z" fill="#5C6B7A" />
          <Rect x={281} y={166} width={20} height={5} rx={2.5} fill="#3A3934" />

          <Dome cx={196} top={178} rx={256} ry={70} fill="#C6D5E3" />
        </>
      )}

      {variant === 'march' && (
        <>
          <Circle cx={286} cy={84} r={68} fill={`url(#${sun})`} />
          <Cloud x={54} y={40} w={46} h={13} opacity={0.6} />
          <Cloud x={80} y={31} w={30} h={11} opacity={0.45} />
          <Birds x={112} y={62} scale={0.9} color="#C2B592" />

          {/* dry ridges stepping back into the haze */}
          <Dome cx={120} top={104} rx={250} ry={92} fill="#EFE7D5" />
          <Dome cx={310} top={120} rx={240} ry={82} fill="#E6DAC0" />

          {/* the track, wide at your feet and narrowing to nothing */}
          <Path d="M150 210 L188 146 L202 146 L240 210 Z" fill="#DDCDA9" />

          {/* two walking it, one well ahead — spaced so they read as figures
              rather than as marks on the road */}
          <Walker x={176} y={176} scale={0.8} color="#867C64" />
          <Walker x={200} y={150} scale={0.5} color="#9A9078" />

          {/* scrub, kept clear of the track */}
          <Ellipse cx={86} cy={192} rx={10} ry={5.5} fill="#D9CDAF" />
          <Ellipse cx={306} cy={182} rx={11} ry={6} fill="#D9CDAF" />
          <Ellipse cx={340} cy={198} rx={8} ry={4.5} fill="#E0D5B9" />

          <Dome cx={196} top={186} rx={256} ry={64} fill="#D3C6A5" />
        </>
      )}

      {variant === 'heights' && (
        <>
          <Circle cx={140} cy={70} r={60} fill={`url(#${sun})`} />
          <Cloud x={244} y={44} w={44} h={12} opacity={0.55} />
          <Birds x={72} y={54} scale={0.8} color="#9AA9B8" />

          {/* far range, then the near peaks — angular, not domed */}
          <Path d="M-20 190 L70 96 L150 190 Z" fill="#E4EBF2" />
          <Path d="M96 190 L188 82 L280 190 Z" fill="#D5E0EA" />
          <Path d="M232 190 L318 108 L410 190 Z" fill="#E1E9F1" />

          {/* snow on the tallest */}
          <Path d="M188 82 L166 108 L180 104 L192 114 L204 102 Z" fill="#F3F7FA" />

          {/* the ridge you are standing on, and the watchfire on it */}
          <Dome cx={196} top={168} rx={266} ry={78} fill="#C8D5E2" />
          <Walker x={128} y={158} scale={0.9} color="#5C6B7A" />
          <Ellipse cx={258} cy={172} rx={5} ry={3.5} fill="#D9A05B" />
          <Rect x={249} y={175} width={14} height={3} rx={1.5} fill="#8B8882" />
          <Circle cx={262} cy={162} r={1.6} fill="#B4B1AB" />
          <Circle cx={267} cy={155} r={1.2} fill="#C6C5C0" />
        </>
      )}

      <Rect x={0} y={200} width={393} height={36} fill={`url(#${fade})`} />
    </Svg>
  );
}

// ── the trail that links one card to the next ────────────────────────

/** The four-dot trail the campaign meanders between cards. */
export function TrailDots({ height = 64 }: { height?: number }) {
  const dots = [
    { top: 9, dx: -9, size: 7, fill: '#C3CEDA' },
    { top: 23, dx: 2, size: 8, fill: '#B2C1D0' },
    { top: 38, dx: -10, size: 8, fill: '#B2C1D0' },
    { top: 52, dx: 1, size: 7, fill: '#C3CEDA' },
  ];
  return (
    <View style={{ height }}>
      {dots.map((dot) => (
        <View
          key={dot.top}
          style={{
            position: 'absolute',
            left: '50%',
            top: dot.top,
            marginLeft: dot.dx,
            width: dot.size,
            height: dot.size,
            borderRadius: dot.size / 2,
            backgroundColor: dot.fill,
          }}
        />
      ))}
    </View>
  );
}

/** The scattered trail the lesson screens set under the title (canvas: Story Tracks). */
export function LessonTrail({ tint = 'paper' }: { tint?: LessonTint }) {
  const T = TINTS[tint];
  const dots = [
    { size: 7, offset: 6, fill: T.pip1 },
    { size: 8, offset: -4, fill: T.pip2 },
    { size: 8, offset: 5, fill: T.pip2 },
    { size: 7, offset: -3, fill: T.pip1 },
  ];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 11 }}>
      {dots.map((dot, index) => (
        <View
          key={index}
          style={{ width: dot.size, height: dot.size, borderRadius: dot.size / 2, backgroundColor: dot.fill, marginTop: dot.offset }}
        />
      ))}
    </View>
  );
}

// ── the self-check deck's five drawings ──────────────────────────────

/**
 * One warning sign, drawn (canvases: Lesson Self Check · Sleep · Fine · Alone ·
 * Meals). The canvas builds each of these from absolutely-positioned boxes in a
 * 190 × 152 frame, so they are transcribed here box for box.
 */
export type SignName = 'scrolling' | 'sleep' | 'fine' | 'alone' | 'meals';

const SIGN_MATCH: [SignName, RegExp][] = [
  ['scrolling', /scroll|the phone|apps/i],
  ['sleep', /sleep|going to bed|late|midnight|still up/i],
  ['fine', /\bfine\b|all good|pretend|nothing.s wrong/i],
  ['alone', /alone|on my own|by myself|nobody/i],
  ['meals', /meal|eating|lunch|food|skipping/i],
];

/** Which drawing a check gets, or nothing when none of them is about it. */
export function signFor(text: string): SignName | null {
  return SIGN_MATCH.find(([, pattern]) => pattern.test(text))?.[0] ?? null;
}

const SIGN_W = 190;
const SIGN_H = 152;

type Wash = { glow?: { left: number; top: number; size: number; opacity: number }; shadows: { left: number; top: number; w: number; h: number; opacity: number }[] };

/**
 * The parts of a drawing the canvas blurs: the amber halo behind it and the
 * ellipse it stands on. Redrawn as radial gradients with the same falloff.
 */
function SignWash({ wash }: { wash: Wash }) {
  const uid = useId().replace(/:/g, '');
  return (
    <Svg width={SIGN_W} height={SIGN_H} viewBox={`0 0 ${SIGN_W} ${SIGN_H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <Defs>
        {wash.glow ? (
          <RadialGradient id={`sglow-${uid}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={wash.glow.opacity} />
            <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        ) : null}
        {wash.shadows.map((shadow, index) => (
          <RadialGradient key={index} id={`sdrop-${uid}-${index}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#000000" stopOpacity={shadow.opacity} />
            <Stop offset="0.55" stopColor="#000000" stopOpacity={shadow.opacity * 0.6} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        ))}
      </Defs>
      {wash.glow ? (
        <Circle
          cx={wash.glow.left + wash.glow.size / 2}
          cy={wash.glow.top + wash.glow.size / 2}
          r={wash.glow.size / 2}
          fill={`url(#sglow-${uid})`}
        />
      ) : null}
      {wash.shadows.map((shadow, index) => (
        <Ellipse
          key={index}
          cx={shadow.left + shadow.w / 2}
          cy={shadow.top + shadow.h / 2}
          rx={shadow.w / 2}
          ry={shadow.h / 2}
          fill={`url(#sdrop-${uid}-${index})`}
        />
      ))}
    </Svg>
  );
}

/** Every crisp shape in these drawings is an absolutely-placed box. */
function Piece({ style }: { style: ViewStyle }) {
  return <View style={[{ position: 'absolute' }, style]} />;
}

export function SignScene({ name }: { name: SignName }) {
  return (
    <View style={{ width: SIGN_W, height: SIGN_H }}>
      {name === 'scrolling' && (
        <>
          <SignWash wash={{ glow: { left: 25, top: 0, size: 140, opacity: 0.4 }, shadows: [{ left: 60, top: 138, w: 70, h: 10, opacity: 0.08 }] }} />
          <Piece style={{ left: 25, top: 0, width: 140, height: 140, borderRadius: 70, boxShadow: 'inset 0 0 0 2px #E8E6DF' }} />
          <Piece style={{ left: 75, top: 26, width: 40, height: 80, borderRadius: 9, backgroundColor: '#131313' }} />
          <Piece style={{ left: 81, top: 33, width: 28, height: 66, borderRadius: 5, backgroundColor: '#F7F6F2' }} />
          <Piece style={{ left: 87, top: 43, width: 16, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
          <Piece style={{ left: 87, top: 52, width: 12, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
          <Piece style={{ left: 87, top: 61, width: 16, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
          <Piece style={{ left: 87, top: 74, width: 16, height: 16, borderRadius: 4, backgroundColor: '#E9D2A4' }} />
          <Piece style={{ left: 36, top: 12, width: 18, height: 18, borderRadius: 5, backgroundColor: '#C6C5C0' }} />
          <Piece style={{ left: 152, top: 60, width: 18, height: 18, borderRadius: 5, backgroundColor: '#D6D5D0' }} />
          <Piece style={{ left: 46, top: 112, width: 18, height: 18, borderRadius: 5, backgroundColor: '#E0DFDA' }} />
        </>
      )}

      {name === 'sleep' && (
        <>
          <SignWash wash={{ glow: { left: 52, top: 14, size: 120, opacity: 0.38 }, shadows: [{ left: 56, top: 130, w: 86, h: 10, opacity: 0.08 }] }} />
          <Piece style={{ left: 34, top: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: '#DCDED8' }} />
          <Piece style={{ left: 27, top: 3, width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF' }} />
          <Piece
            style={{ left: 76, top: 26, width: 14, height: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: '#C6C5C0', transform: [{ rotate: '-24deg' }] }}
          />
          <Piece
            style={{ left: 106, top: 26, width: 14, height: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: '#C6C5C0', transform: [{ rotate: '24deg' }] }}
          />
          <Piece
            style={{ left: 66, top: 34, width: 64, height: 64, borderRadius: 32, backgroundColor: '#F7F6F2', boxShadow: 'inset 0 0 0 3px #C6C5C0, 0 0 0 1px rgba(0,0,0,0.04)' }}
          />
          <Piece style={{ left: 96.5, top: 46, width: 3, height: 20, borderRadius: 2, backgroundColor: '#55534E' }} />
          {/* the minute hand pivots on its left end, as the canvas sets it */}
          <Piece
            style={{ left: 98, top: 63, width: 13, height: 3, borderRadius: 2, backgroundColor: '#55534E', transform: [{ translateX: -6.5 }, { rotate: '35deg' }, { translateX: 6.5 }] }}
          />
          <Piece style={{ left: 74, top: 96, width: 10, height: 12, borderRadius: 2, backgroundColor: '#C6C5C0', transform: [{ rotate: '20deg' }] }} />
          <Piece style={{ left: 112, top: 96, width: 10, height: 12, borderRadius: 2, backgroundColor: '#C6C5C0', transform: [{ rotate: '-20deg' }] }} />
          <Piece style={{ left: 126, top: 100, width: 56, height: 26, borderRadius: 12, backgroundColor: '#F7F6F2', boxShadow: '0 0 0 1px rgba(0,0,0,0.05)' }} />
          <Piece style={{ left: 146, top: 106, width: 18, height: 3, borderRadius: 2, backgroundColor: '#E0DFDA', transform: [{ rotate: '-12deg' }] }} />
        </>
      )}

      {name === 'fine' && (
        <>
          <SignWash
            wash={{
              glow: { left: 40, top: 6, size: 120, opacity: 0.38 },
              shadows: [
                { left: 44, top: 96, w: 64, h: 9, opacity: 0.07 },
                { left: 116, top: 126, w: 52, h: 9, opacity: 0.08 },
              ],
            }}
          />
          <Piece style={{ left: 34, top: 26, width: 90, height: 58, borderRadius: 16, backgroundColor: '#F7F6F2', boxShadow: '0 0 0 1px rgba(0,0,0,0.05)' }} />
          <Piece style={{ left: 52, top: 79, width: 12, height: 12, backgroundColor: '#F7F6F2', transform: [{ rotate: '45deg' }] }} />
          <Piece style={{ left: 56, top: 52, width: 46, height: 5, borderRadius: 3, backgroundColor: '#C6C5C0' }} />
          <Piece style={{ left: 112, top: 76, width: 56, height: 40, borderRadius: 13, backgroundColor: '#131313' }} />
          <Piece style={{ left: 142, top: 110, width: 11, height: 11, backgroundColor: '#131313', transform: [{ rotate: '45deg' }] }} />
          <Piece style={{ left: 124, top: 92, width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(244,243,240,0.85)' }} />
          <Piece style={{ left: 136, top: 92, width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(244,243,240,0.85)' }} />
          <Piece style={{ left: 148, top: 92, width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(244,243,240,0.85)' }} />
        </>
      )}

      {name === 'alone' && (
        <>
          <SignWash wash={{ glow: { left: 30, top: 8, size: 126, opacity: 0.38 }, shadows: [{ left: 40, top: 132, w: 120, h: 10, opacity: 0.08 }] }} />
          <Piece style={{ left: 36, top: 28, width: 80, height: 96, borderRadius: 8, backgroundColor: '#F7F6F2', boxShadow: '0 0 0 1px rgba(0,0,0,0.05)' }} />
          <Piece style={{ left: 36, top: 28, width: 80, height: 20, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#E0DFDA' }} />
          <Piece style={{ left: 50, top: 22, width: 5, height: 12, borderRadius: 2, backgroundColor: '#B4B1AB' }} />
          <Piece style={{ left: 96, top: 22, width: 5, height: 12, borderRadius: 2, backgroundColor: '#B4B1AB' }} />
          <Piece style={{ left: 48, top: 60, width: 8, height: 8, borderRadius: 2, backgroundColor: '#D6D5D0' }} />
          <Piece style={{ left: 66, top: 60, width: 8, height: 8, borderRadius: 2, backgroundColor: '#D6D5D0' }} />
          <Piece style={{ left: 84, top: 60, width: 8, height: 8, borderRadius: 2, backgroundColor: '#D6D5D0' }} />
          <Piece style={{ left: 48, top: 78, width: 8, height: 8, borderRadius: 2, backgroundColor: '#D6D5D0' }} />
          <Piece style={{ left: 62, top: 74, width: 16, height: 16, borderRadius: 8, boxShadow: 'inset 0 0 0 2px #E9D2A4' }} />
          <Piece style={{ left: 84, top: 78, width: 8, height: 8, borderRadius: 2, backgroundColor: '#D6D5D0' }} />
          <Piece style={{ left: 132, top: 24, width: 34, height: 104, borderRadius: 6, backgroundColor: '#E0DFDA' }} />
          <Piece style={{ left: 138, top: 72, width: 6, height: 6, borderRadius: 3, backgroundColor: '#B4B1AB' }} />
        </>
      )}

      {name === 'meals' && (
        <>
          <SignWash
            wash={{
              glow: { left: 28, top: 2, size: 130, opacity: 0.38 },
              shadows: [
                { left: 52, top: 120, w: 82, h: 10, opacity: 0.08 },
                { left: 146, top: 110, w: 44, h: 8, opacity: 0.07 },
              ],
            }}
          />
          <Piece
            style={{ left: 44, top: 26, width: 88, height: 88, borderRadius: 44, backgroundColor: '#F7F6F2', boxShadow: 'inset 0 0 0 3px #E0DFDA, 0 0 0 1px rgba(0,0,0,0.04)' }}
          />
          <Piece style={{ left: 68, top: 50, width: 40, height: 40, borderRadius: 20, boxShadow: 'inset 0 0 0 2px #E8E6DF' }} />
          <Piece style={{ left: 148, top: 30, width: 5, height: 74, borderRadius: 3, backgroundColor: '#B4B1AB' }} />
          <Piece style={{ left: 142, top: 26, width: 4, height: 16, borderRadius: 2, backgroundColor: '#B4B1AB' }} />
          <Piece style={{ left: 149, top: 26, width: 4, height: 16, borderRadius: 2, backgroundColor: '#B4B1AB' }} />
          <Piece style={{ left: 156, top: 26, width: 4, height: 16, borderRadius: 2, backgroundColor: '#B4B1AB' }} />
        </>
      )}
    </View>
  );
}

/** The tiny ink mark a saved sign wears on its chip (canvas: Lesson Your Signs). */
export function SignChipMark({ name }: { name: SignName | null }) {
  if (name === 'sleep') {
    return (
      <View style={{ width: 14, height: 14, overflow: 'hidden' }}>
        <Piece style={{ left: 3, top: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: '#131313' }} />
        <Piece style={{ left: 0, top: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF' }} />
      </View>
    );
  }
  if (name === 'fine') return <View style={{ width: 15, height: 11, borderRadius: 5, backgroundColor: '#131313' }} />;
  if (name === 'alone') {
    return <View style={{ width: 11, height: 14, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: '#131313' }} />;
  }
  if (name === 'scrolling') return <View style={{ width: 9, height: 14, borderRadius: 2.5, backgroundColor: '#131313' }} />;
  return <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#131313' }} />;
}

// ── the feelings grid's tile glyphs ──────────────────────────────────

export type FeelingName = 'lonely' | 'wound' | 'bored' | 'low' | 'irritable' | 'numb' | 'tired' | 'place' | 'hungry';

const FEELINGS: Record<string, FeelingName> = {
  lonely: 'lonely',
  'wound up': 'wound',
  bored: 'bored',
  low: 'low',
  irritable: 'irritable',
  numb: 'numb',
  tired: 'tired',
  'out of place': 'place',
  hungry: 'hungry',
};

/**
 * The six glyphs that say nothing in particular. An option the canvas never
 * named gets one of these by a stable hash rather than, say, the moon — the
 * shapes are abstract, but a moon next to "restless" would not be.
 */
const NEUTRAL: FeelingName[] = ['bored', 'numb', 'low', 'irritable', 'place', 'lonely'];

export function feelingFor(option: string): FeelingName {
  const named = FEELINGS[option.trim().toLowerCase()];
  if (named) return named;
  let hash = 0;
  for (let i = 0; i < option.length; i += 1) hash = (hash * 31 + option.charCodeAt(i)) % 997;
  return NEUTRAL[hash % NEUTRAL.length];
}

export function FeelingGlyph({ name, on }: { name: FeelingName; on: boolean }) {
  const tone = on ? 'rgba(244,243,240,0.9)' : '#B8B5AD';
  const soft = on ? 'rgba(244,243,240,0.9)' : '#C6C5C0';
  // the crescent is cut with a disc in the tile's own colour, so it must know it
  const backdrop = on ? '#131313' : '#FFFFFF';
  switch (name) {
    case 'lonely':
      return <View style={{ width: 20, height: 14, borderRadius: 6, backgroundColor: tone }} />;
    case 'wound':
      return (
        <Svg width={20} height={14} viewBox="0 0 20 14">
          <Path d="M2 12L8 6l4 4 6-8" stroke={tone} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'bored':
      return <View style={{ width: 16, height: 16, borderRadius: 8, boxShadow: `inset 0 0 0 3px ${tone}` }} />;
    case 'low':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
          <View style={{ width: 5, height: 14, borderRadius: 2, backgroundColor: soft }} />
          <View style={{ width: 5, height: 10, borderRadius: 2, backgroundColor: soft }} />
          <View style={{ width: 5, height: 6, borderRadius: 2, backgroundColor: tone }} />
        </View>
      );
    case 'irritable':
      return (
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Path d="M9 2v4M9 12v4M2 9h4M12 9h4" stroke={tone} strokeWidth={2.4} strokeLinecap="round" />
        </Svg>
      );
    case 'numb':
      return <View style={{ width: 18, height: 4, borderRadius: 2, backgroundColor: tone }} />;
    case 'tired':
      return (
        <View style={{ width: 18, height: 18, overflow: 'hidden' }}>
          <Piece style={{ left: 4, top: 2, width: 13, height: 13, borderRadius: 6.5, backgroundColor: tone }} />
          <Piece style={{ left: 1, top: 0, width: 13, height: 13, borderRadius: 6.5, backgroundColor: backdrop }} />
        </View>
      );
    case 'place':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: soft }} />
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: soft }} />
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: tone, transform: [{ translateY: -5 }] }} />
        </View>
      );
    default:
      return (
        <View style={{ width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 2px ${soft}` }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tone }} />
        </View>
      );
  }
}

// ── the pairing page's habit icons ───────────────────────────────────

export type HabitName = 'coffee' | 'teeth' | 'commute' | 'bed' | 'own';

const HABIT_MATCH: [HabitName, RegExp][] = [
  ['coffee', /coffee/i],
  ['teeth', /teeth|brush/i],
  ['commute', /commute/i],
  ['bed', /in bed/i],
  ['own', /my own/i],
];

/** A habit's icon, or nothing when the option is not one of the canvas's five. */
export function habitFor(option: string): HabitName | null {
  return HABIT_MATCH.find(([, pattern]) => pattern.test(option))?.[0] ?? null;
}

export function HabitIcon({ name, on }: { name: HabitName; on: boolean }) {
  const stroke = on ? '#F4F3F0' : '#1D1C1A';
  const strokeWidth = on ? 1.8 : 2.5;
  const line = { stroke, strokeWidth, fill: 'none' as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      {name === 'coffee' && (
        <>
          <Path d="M5 8.5h11v6.5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 15z" {...line} />
          <Path d="M16 10.5h1.6a2.6 2.6 0 0 1 0 5.2H16M8 5.5c0-1 .8-1.2.8-2M11.5 5.5c0-1 .8-1.2.8-2" {...line} />
        </>
      )}
      {name === 'teeth' && (
        <>
          <Path d="M4.5 19.5 15.8 8.2" {...line} />
          <Path d="M14.6 5.4l4 4 1.6-1.6a1.4 1.4 0 0 0 0-2l-2-2a1.4 1.4 0 0 0-2 0z" {...line} />
          <Path d="M16.2 9.8l-1.2 1.2M14.2 7.8 13 9" {...line} />
        </>
      )}
      {name === 'commute' && (
        <>
          <Rect x={5} y={4} width={14} height={13} rx={2.6} {...line} />
          <Path d="M5 9.5h14M9 20.5l-1.2 1.5M15 20.5l1.2 1.5M8.8 13.8h.01M15.2 13.8h.01" {...line} />
        </>
      )}
      {name === 'bed' && (
        <>
          <Path d="M3.5 18.5v-8M3.5 14.5h17v4M3.5 14.5V9h6.6c2.4 0 3.7 1.3 3.7 3.3v2.2" {...line} />
          <Circle cx={7.1} cy={11.4} r={1.2} {...line} />
        </>
      )}
      {name === 'own' && <Path d="M12 5v14M5 12h14" {...line} />}
    </Svg>
  );
}
