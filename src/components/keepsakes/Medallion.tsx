import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, LinearGradient as SvgLinearGradient, Mask, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

/**
 * 002–022 · The medallions.
 *
 * Every face is the same struck disc: a metal (or, unearned, plain stock), two
 * dunes rolling across its bottom third, a raked highlight, and one small dark
 * device on top. The tier is not written on the coin — it is the coin. Paper is
 * what the whole album looks like before anything has been earned, so the plan
 * is visible from day one without a single lock icon.
 */

export type KeepsakeSceneKey =
  | 'veni'
  | 'backondeck'
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

/**
 * The five treatments a medallion passes through as its tier climbs. Paper is
 * the unearned state — no metal, just the device on stock. After that the coin
 * is struck in a real material, and the material is the reward: you can read
 * how far someone is across a room, without a number.
 */
export const KK_METALS = ['paper', 'bronze', 'silver', 'gold', 'platinum'] as const;
export type KKMetal = (typeof KK_METALS)[number];

// ── the disc: what the coin is struck from ───────────────────────────
type Face =
  | { kind: 'stock'; from: string; to: string }
  | { kind: 'struck'; cx: number; cy: number; r: number; c0: string; c1: string; mid: number; c2: string };

/**
 * `r` is the farthest-corner distance CSS gives a `radial-gradient(circle at
 * x% y%, …)` in a square box — the canvas's default sizing, computed once here
 * so the falloff lands in the same place.
 */
const DISC: Record<KKMetal, { face: Face; dunes: [string, string]; sheen: boolean }> = {
  paper: {
    face: { kind: 'stock', from: '#F1F0EB', to: '#ECEAE3' },
    dunes: ['#DEDDD6', '#CFCEC7'],
    sheen: false,
  },
  bronze: {
    face: { kind: 'struck', cx: 36, cy: 28, r: 96.33, c0: '#E0A96F', c1: '#B87F4C', mid: 0.58, c2: '#7E5527' },
    dunes: ['rgba(70,40,10,0.20)', 'rgba(70,40,10,0.32)'],
    sheen: false,
  },
  silver: {
    face: { kind: 'struck', cx: 36, cy: 28, r: 96.33, c0: '#F2F3F5', c1: '#C6CBD1', mid: 0.6, c2: '#969DA6' },
    dunes: ['rgba(55,65,78,0.15)', 'rgba(55,65,78,0.24)'],
    sheen: false,
  },
  gold: {
    face: { kind: 'struck', cx: 36, cy: 28, r: 96.33, c0: '#F8E3AC', c1: '#E7BE72', mid: 0.58, c2: '#BC8536' },
    dunes: ['rgba(140,90,20,0.22)', 'rgba(140,90,20,0.34)'],
    sheen: false,
  },
  platinum: {
    face: { kind: 'struck', cx: 35, cy: 26, r: 98.49, c0: '#FFFFFF', c1: '#EDF0F4', mid: 0.55, c2: '#C7CDD8' },
    dunes: ['rgba(90,100,118,0.14)', 'rgba(90,100,118,0.22)'],
    sheen: true,
  },
};

// ── the accents each device borrows from its metal ───────────────────
type Accent = {
  /** horizons, quill nibs — the structural grey */
  struct: string;
  /** the standards and masts the devices are raised on */
  pole: string;
  /** seals, suns, sparks — the warm mark */
  warm: string;
  /** paper, flaps, ticks — the light mark */
  light: string;
  /** first light's rays */
  ray: string;
  /** the ruled lines on Steady study's cards, upper and lower */
  rule: string;
  rule2: string;
  /** Ground taken's shortest bar, then its middle one */
  stack: string;
  stack2: string;
  /** Vidi's four stars, near to far */
  starA: string;
  starB: string;
  starC: string;
  starD: string;
};

/** Only paper is drawn by 022–023; the four metals carry the same roles over. */
const ACCENT: Record<KKMetal, Accent> = {
  paper: {
    struct: '#8A857C', pole: '#C4C3BC', warm: '#E2BA78', light: '#F1F0EB', ray: '#C99F5F',
    rule: '#DBDAD3', rule2: '#E1E0D9', stack: '#9C9992', stack2: '#8B8880',
    starA: '#CFCEC7', starB: '#C7C6BF', starC: '#D2D1CA', starD: '#D6D5CE',
  },
  bronze: {
    struct: '#53381C', pole: '#53381C', warm: '#FFE9C4', light: '#F8EEDC', ray: '#FFE9C4',
    rule: '#C09058', rule2: '#C09058', stack: '#F8EEDC', stack2: '#53381C',
    starA: 'rgba(255,255,255,0.28)', starB: '#FFE9C4', starC: '#F8EEDC', starD: '#F8EEDC',
  },
  silver: {
    struct: '#5F6B78', pole: '#5F6B78', warm: '#C9930F', light: '#FFFFFF', ray: '#B98A2E',
    rule: '#93A0AE', rule2: '#93A0AE', stack: '#8C93A1', stack2: '#5F6B78',
    starA: 'rgba(255,255,255,0.28)', starB: '#C9930F', starC: '#FFFFFF', starD: '#FFFFFF',
  },
  gold: {
    struct: '#6B4E1E', pole: '#6B4E1E', warm: '#FFFFFF', light: '#FCF4DF', ray: '#FFFFFF',
    rule: '#C09058', rule2: '#C09058', stack: '#FCF4DF', stack2: '#6B4E1E',
    starA: 'rgba(255,255,255,0.28)', starB: '#FFFFFF', starC: '#FCF4DF', starD: '#FCF4DF',
  },
  platinum: {
    struct: '#5F6B78', pole: '#5F6B78', warm: '#C9930F', light: '#FFFFFF', ray: '#B98A2E',
    rule: '#93A0AE', rule2: '#93A0AE', stack: '#68727F', stack2: '#5F6B78',
    starA: 'rgba(255,255,255,0.28)', starB: '#C9930F', starC: '#FFFFFF', starD: '#FFFFFF',
  },
};

/** The grounding smudge every device but the two horizon scenes sits on. */
const GROUND = 'rgba(40,38,32,0.14)';

type SceneCtx = {
  a: Accent;
  /** the dark two-stop wash every device is cut from */
  ink: string;
  /** Vidi's moon — pale stock on paper, the same dark ink once struck */
  moon: string;
  /** takes the bite out of the moon */
  crescent: string;
  /** Steady study's two cards — ruled stock on paper, the metal's light mark once struck */
  sheet: string;
  /**
   * The standard Vici is planted on, and the mast Storm weathered hangs its
   * lamp from. On the 68pt album face it is struck in the metal's own pole
   * accent (022–023); blown up to the 150pt detail disc the canvas holds it at
   * the paper grey on all five metals (024–028), so the standard reads as wood
   * against the coin rather than more of the same metal.
   */
  staff: string;
};

// ── the devices, one per medallion, drawn in a 100 × 100 disc ─────────
const KK_SCENES: Record<KeepsakeSceneKey, (c: SceneCtx) => React.ReactNode> = {
  // veni — the sail and the hull: stepped off the old shore
  veni: ({ ink }) => (
    <G>
      <Ellipse cx={50} cy={68} rx={21} ry={3.5} fill={GROUND} />
      <Path d="M52 24 L52 50 L35 50 Z" fill="#3A3934" />
      <Path d="M29 54 L73 54 Q69 64 51 64 Q33 64 29 54 Z" fill={ink} />
      <Path d="M34 56.5 L68 56.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} strokeLinecap="round" />
    </G>
  ),
  // vidi — the moon over four stars: days witnessed, one after another
  vidi: ({ a, moon, crescent }) => (
    <G>
      <Circle cx={40} cy={32} r={15} fill={moon} mask={crescent} />
      <Circle cx={34} cy={38} r={2.2} fill={a.starA} />
      <Circle cx={41} cy={29} r={1.5} fill={a.starD} />
      <Circle cx={66} cy={20} r={1.8} fill={a.starB} />
      <Circle cx={24} cy={46} r={1.5} fill={a.starC} />
    </G>
  ),
  // vici — the standard planted: urges met and outlasted
  vici: ({ ink, staff }) => (
    <G>
      <Ellipse cx={48} cy={72} rx={16} ry={3} fill={GROUND} />
      <Rect x={44} y={22} width={4.5} height={48} rx={2.2} fill={staff} />
      <Path d="M50 24 C57 21.5 61 25.5 69 24 L69 37 C61 38.5 57 34.5 50 40 Z" fill={ink} />
    </G>
  ),
  // the sealed letter, sent onward
  lettersent: ({ a, ink }) => (
    <G>
      <Ellipse cx={50} cy={71} rx={18} ry={3} fill={GROUND} />
      <Rect x={30} y={34} width={40} height={29} rx={4} fill={ink} />
      <Path d="M33 38 L50 52 L67 38" fill="none" stroke={a.light} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={50} cy={52} r={4} fill={a.warm} />
    </G>
  ),
  // never failed twice — the mark you make the morning after
  bounce: ({ a, ink }) => (
    <G>
      <Ellipse cx={50} cy={71} rx={18} ry={3} fill={GROUND} />
      <Path d="M30 44 L46 60 L70 30" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={71} cy={26} r={3} fill={a.warm} />
    </G>
  ),
  // first light — half a sun on the horizon, three rays
  firstlight: ({ a }) => (
    <G>
      <Path d="M28 58 L72 58" fill="none" stroke={a.struct} strokeWidth={3} strokeLinecap="round" />
      <Path d="M38 58 a12 12 0 0 1 24 0 Z" fill={a.warm} />
      <Path d="M50 34 v-6 M35 41 l-4 -4 M65 41 l4 -4" fill="none" stroke={a.ray} strokeWidth={3} strokeLinecap="round" />
    </G>
  ),
  // honest ink — the quill, laid down mid-sentence
  honest: ({ a, ink }) => (
    <G>
      <Ellipse cx={50} cy={71} rx={18} ry={3} fill={GROUND} />
      <Path d="M34 70 Q50 66 66 70" fill="none" stroke={a.struct} strokeWidth={2.5} strokeLinecap="round" />
      <G transform="rotate(-38 50 48)">
        <Rect x={46} y={26} width={9} height={34} rx={2} fill={ink} />
        <Path d="M46 60 L55 60 L50.5 70 Z" fill={a.struct} />
        <Rect x={46} y={26} width={9} height={5} rx={2} fill={a.warm} />
      </G>
    </G>
  ),
  // steady study — two lesson cards and the pen across them
  study: ({ a, ink, sheet }) => (
    <G>
      <Ellipse cx={50} cy={77} rx={26} ry={4.5} fill="rgba(40,38,32,0.10)" />
      <G transform="rotate(-5 37 52)">
        <Rect x={21} y={33} width={30} height={40} rx={3.5} fill={sheet} />
        <Rect x={27} y={42} width={16} height={3} rx={1.5} fill={a.rule} />
        <Rect x={27} y={49} width={18} height={3} rx={1.5} fill={a.rule2} />
      </G>
      <G transform="rotate(3 64 52)">
        <Rect x={49} y={31} width={30} height={40} rx={3.5} fill={sheet} />
        <Rect x={55} y={40} width={15} height={3} rx={1.5} fill={a.rule} />
        <Rect x={55} y={47} width={17} height={3} rx={1.5} fill={a.rule2} />
      </G>
      <Rect x={44} y={44} width={36} height={4.5} rx={2.2} fill={ink} transform="rotate(-33 62 46)" />
    </G>
  ),
  // ground taken — three bars climbing, a spark over the tallest
  groundtaken: ({ a, ink }) => (
    <G>
      <Ellipse cx={50} cy={71} rx={18} ry={3} fill={GROUND} />
      <Rect x={29} y={52} width={12} height={14} rx={2} fill={a.stack} />
      <Rect x={44} y={44} width={12} height={22} rx={2} fill={a.stack2} />
      <Rect x={59} y={34} width={12} height={32} rx={2} fill={ink} />
      <Circle cx={65} cy={27} r={2.5} fill={a.warm} />
    </G>
  ),
  // let someone in — the said thing, out loud
  told: ({ a, ink }) => (
    <G>
      <Ellipse cx={50} cy={71} rx={18} ry={3} fill={GROUND} />
      <Rect x={28} y={30} width={44} height={26} rx={8} fill={ink} />
      <Path d="M40 56 L40 66 L50 56 Z" fill={ink} />
      <Path d="M38 43 l6 6 L62 37" fill="none" stroke={a.light} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </G>
  ),
  // storm weathered — the lamp that stayed lit on its mast
  storm: ({ a, ink, staff }) => (
    <G>
      <Ellipse cx={50} cy={70} rx={14} ry={3} fill={GROUND} />
      <Rect x={47} y={38} width={6} height={30} rx={3} fill={staff} />
      <Rect x={40} y={24} width={20} height={14} rx={6} fill={ink} />
      <Rect x={42} y={27} width={16} height={2.5} rx={1.2} fill="rgba(255,255,255,0.16)" />
      <Circle cx={50} cy={31} r={2.2} fill={a.warm} />
    </G>
  ),
  // back on deck — the anchor, dropped again where you left off. The canvas
  // album is eleven faces and has none for this one, so it is drawn to the
  // same rules rather than copied.
  backondeck: ({ a, ink }) => (
    <G>
      <Ellipse cx={50} cy={71} rx={18} ry={3} fill={GROUND} />
      <Rect x={47.5} y={30} width={5} height={34} rx={2.5} fill={ink} />
      <Rect x={38} y={36} width={24} height={4.5} rx={2.2} fill={a.struct} />
      <Path d="M30 52 C30 63 39 68 50 68 C61 68 70 63 70 52" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />
      <Circle cx={50} cy={26} r={4} fill={a.warm} />
    </G>
  ),
};

/**
 * The rim the canvas presses into the disc. The album face is 68px and the
 * detail face 150px, and the shadow is stated in device pixels either way, so
 * the numbers are carried literally and converted per size.
 */
const INNER: Record<'album' | 'detail', { inset: number; hair: number; lift: number; blur: number; alpha: number }> = {
  album: { inset: 2, hair: 1.5, lift: 6, blur: 10, alpha: 0.12 },
  detail: { inset: 3, hair: 1.5, lift: 7, blur: 12, alpha: 0.14 },
};

/**
 * The low sun 022 floats behind an earned face, hand-placed per device so it
 * never lands on the device itself. The canvas states it as a `%` box with
 * `border-radius:50%` and `radial-gradient(closest-side, …)`, which is the
 * box's own circle — carried here as centre and radius in the 100-unit disc.
 * Nothing on 023 carries one: the sun is what being struck looks like.
 */
const SUN: Record<KeepsakeSceneKey, { cx: number; cy: number; r: number }> = {
  veni: { cx: 44, cy: 34, r: 28 },
  vidi: { cx: 72, cy: 56, r: 22 },
  vici: { cx: 51, cy: 31, r: 27 },
  firstlight: { cx: 44, cy: 34, r: 28 },
  storm: { cx: 51, cy: 27, r: 25 },
  bounce: { cx: 44, cy: 34, r: 28 },
  lettersent: { cx: 44, cy: 34, r: 28 },
  honest: { cx: 44, cy: 34, r: 28 },
  study: { cx: 44, cy: 34, r: 28 },
  groundtaken: { cx: 44, cy: 34, r: 28 },
  told: { cx: 44, cy: 34, r: 28 },
  backondeck: { cx: 44, cy: 34, r: 28 },
};

/** Which metal a medallion is struck in, given how many tiers are behind it. */
export function kkMetal(tier: number | null, tierMax: number): KKMetal {
  if (!tier || tier < 1) return 'paper';
  if (tierMax <= 1) return 'bronze';
  // The four metals split the ladder evenly, so the last step is platinum.
  const step = Math.ceil((tier / tierMax) * 4);
  return KK_METALS[Math.max(1, Math.min(4, step))];
}

const ARC = 2 * Math.PI * 46;

export function KKMedallion({
  scene,
  size = 68,
  earned = true,
  progress = null,
  tier = null,
  tierMax = 0,
  metal,
  sun = false,
  variant = 'album',
}: {
  scene: KeepsakeSceneKey;
  size?: number;
  earned?: boolean;
  progress?: [number, number] | null;
  tier?: number | null;
  tierMax?: number;
  /** Override the treatment; by default it follows the tier. */
  metal?: KKMetal;
  /** Float the low sun behind the device — 022's mark of a struck face. */
  sun?: boolean;
  /** Which rim the canvas presses at this size. */
  variant?: 'album' | 'detail';
}) {
  const uid = useId().replace(/:/g, '');
  const struck = metal ?? (earned ? kkMetal(tier, tierMax) : 'paper');
  const disc = DISC[struck];
  const a = ACCENT[struck];
  const p = progress ? progress[0] / progress[1] : null;
  // The rim is quoted in device pixels; the drawing is a 100-unit viewBox.
  const u = 100 / size;
  const rim = INNER[variant];
  const ringR = 50 - rim.inset * u - (rim.hair * u) / 2;
  const shadeTop = 100 - (rim.lift + rim.blur) * u;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          <ClipPath id={`kkd-${uid}`}>
            <Circle cx={50} cy={50} r={50} />
          </ClipPath>
          <SvgLinearGradient id={`kkv-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4A4843" />
            <Stop offset="1" stopColor="#1D1C19" />
          </SvgLinearGradient>
          {disc.face.kind === 'stock' ? (
            <>
              <SvgLinearGradient id={`kkf-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={disc.face.from} />
                <Stop offset="1" stopColor={disc.face.to} />
              </SvgLinearGradient>
              <SvgLinearGradient id={`kkm-${uid}`} x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#E6E5DE" />
                <Stop offset="1" stopColor="#C3C2BB" />
              </SvgLinearGradient>
              <SvgLinearGradient id={`kkp-${uid}`} x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FFFFFF" />
                <Stop offset="1" stopColor="#EBEAE3" />
              </SvgLinearGradient>
            </>
          ) : (
            <RadialGradient id={`kkf-${uid}`} gradientUnits="userSpaceOnUse" cx={disc.face.cx} cy={disc.face.cy} r={disc.face.r}>
              <Stop offset="0" stopColor={disc.face.c0} />
              <Stop offset={disc.face.mid} stopColor={disc.face.c1} />
              <Stop offset="1" stopColor={disc.face.c2} />
            </RadialGradient>
          )}
          <SvgLinearGradient id={`kkg-${uid}`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={100} y2={100}>
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.5} />
            <Stop offset="0.4" stopColor="#FFFFFF" stopOpacity={0} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0.1} />
          </SvgLinearGradient>
          {disc.sheen ? (
            <SvgLinearGradient id={`kks-${uid}`} gradientUnits="userSpaceOnUse" x1={-10.21} y1={21.92} x2={110.21} y2={78.08}>
              <Stop offset="0.3" stopColor="#FFFFFF" stopOpacity={0} />
              <Stop offset="0.42" stopColor="#FFFFFF" stopOpacity={0.75} />
              <Stop offset="0.54" stopColor="#FFFFFF" stopOpacity={0} />
            </SvgLinearGradient>
          ) : null}
          {/* RN SVG has no inner-shadow blur, so the canvas's `inset 0 -Npx Mpx`
              seat is redrawn as a soft wash up from the bottom of the disc. */}
          <SvgLinearGradient id={`kkb-${uid}`} gradientUnits="userSpaceOnUse" x1={0} y1={shadeTop} x2={0} y2={100}>
            <Stop offset="0" stopColor="#000000" stopOpacity={0} />
            <Stop offset="1" stopColor="#000000" stopOpacity={rim.alpha} />
          </SvgLinearGradient>
          {sun ? (
            <RadialGradient id={`kku-${uid}`} gradientUnits="userSpaceOnUse" cx={SUN[scene].cx} cy={SUN[scene].cy} r={SUN[scene].r}>
              <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.42} />
              <Stop offset="0.75" stopColor="#E2BA78" stopOpacity={0} />
            </RadialGradient>
          ) : null}
          <Mask id={`kkc-${uid}`} maskUnits="userSpaceOnUse" x={0} y={0} width={100} height={100}>
            <Rect x={0} y={0} width={100} height={100} fill="#FFFFFF" />
            <Circle cx={48} cy={26} r={14} fill="#000000" />
          </Mask>
        </Defs>

        <G clipPath={`url(#kkd-${uid})`}>
          <Circle cx={50} cy={50} r={50} fill={`url(#kkf-${uid})`} />
          {/* the sun sits on the field and under the land, as 022 stacks it */}
          {sun ? <Circle cx={SUN[scene].cx} cy={SUN[scene].cy} r={SUN[scene].r} fill={`url(#kku-${uid})`} /> : null}
          {/* the two dunes: CSS boxes with half-ellipse tops, traced as arcs */}
          <Path d="M-25 100.8 A75 36.8 0 0 1 125 100.8 L125 144 L-25 144 Z" fill={disc.dunes[0]} />
          <Path d="M-45 110 A80 32 0 0 1 115 110 L115 158 L-45 158 Z" fill={disc.dunes[1]} />
          {disc.face.kind === 'struck' ? (
            <>
              <Rect x={0} y={0} width={100} height={100} fill={`url(#kkg-${uid})`} />
              {disc.sheen ? <Rect x={0} y={0} width={100} height={100} fill={`url(#kks-${uid})`} /> : null}
              <Rect x={0} y={0} width={100} height={100} fill={`url(#kkb-${uid})`} />
              <Circle cx={50} cy={50} r={ringR} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={rim.hair * u} />
            </>
          ) : null}
          {KK_SCENES[scene]({
            a,
            ink: `url(#kkv-${uid})`,
            moon: disc.face.kind === 'stock' ? `url(#kkm-${uid})` : `url(#kkv-${uid})`,
            crescent: `url(#kkc-${uid})`,
            sheet: disc.face.kind === 'stock' ? `url(#kkp-${uid})` : a.light,
            staff: variant === 'detail' ? '#8A857C' : a.pole,
          })}
          {/* the canvas has no in-progress face — paper is the unearned one —
              so the arc is app-only, laid just inside the rim */}
          {p != null ? (
            <G>
              <Circle cx={50} cy={50} r={46} fill="none" stroke="rgba(29,28,26,0.14)" strokeWidth={4} />
              <Circle
                cx={50}
                cy={50}
                r={46}
                fill="none"
                stroke="#131313"
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={`${Math.max(0.04, p) * ARC} ${ARC}`}
                transform="rotate(-90 50 50)"
              />
            </G>
          ) : null}
        </G>
      </Svg>
    </View>
  );
}

// ── the album: which faces there are, and what each one costs ─────────

export type KKFace = {
  key: KeepsakeSceneKey;
  name: string;
  /** what earns it, in one line — the album card's second line */
  blurb: string;
  /** the longer telling the detail screen leads with */
  long?: string;
  /** the rungs the medallion climbs; empty when it mints once */
  steps: number[];
  /** how a rung reads: days are set in Roman, everything else is a count */
  unit: 'day' | 'count' | null;
  /** the line the medallion carries at each rung it reaches */
  stories: string[];
};

/**
 * The eleven faces the canvas draws, in the album's own order. Everything the
 * two Medallions segments and the tier detail read about a face — its name,
 * what earns it, the rungs it climbs, and the line it carries at each — comes
 * from here; the live counts are laid over it by the screens.
 */
export const KK_ALBUM: KKFace[] = [
  {
    key: 'veni',
    name: 'Veni',
    blurb: 'Crossed the threshold — the campaign began.',
    steps: [],
    unit: null,
    stories: ['Nothing was asked of you yet. Just this: you stepped off the old shore. Everything since has been built on that alone.'],
  },
  {
    key: 'vidi',
    name: 'Vidi',
    blurb: 'Time in the practice, day over day.',
    steps: [3, 7, 30, 90, 180, 365],
    unit: 'day',
    stories: [
      'The first fog lifts right about here, on schedule.',
      'Seven check-ins, two waves ridden, zero perfect days required.',
      'This is where “trying something” quietly becomes “how you live.”',
      'The long walk. By now the view is just… Tuesday.',
      'Six months witnessed, one day at a time. Nobody walks it in a straight line. Vidi only asks that you stayed on it.',
      'A full year, witnessed. The campaign outlived the season it started in.',
    ],
  },
  {
    key: 'vici',
    name: 'Vici',
    blurb: 'Urges met and outlasted.',
    long: 'Urges met and outlasted — the conquering half of the campaign.',
    steps: [1, 5, 25, 100, 250, 500, 1000],
    unit: 'count',
    stories: [
      'Nine minutes, start to finish. You watched it rise, crest, and leave without you.',
      'Five ridden. Each one shortens the next.',
      'Twenty-five behind you now — the pattern is unmistakable.',
      'A hundred waves met and outlasted. This stopped being a fight you were unsure of a while ago.',
      'Two hundred and fifty. Vici isn’t a moment anymore. It’s just what you do.',
      'Five hundred. Most of them don’t even register as events now. This one still gets a mark.',
      'A thousand. The sea hasn’t changed. You’re just not the one it moves anymore.',
    ],
  },
  {
    key: 'lettersent',
    name: 'Letter sent',
    blurb: 'Wrote a letter to your future self.',
    steps: [1, 4, 12, 24, 52],
    unit: 'count',
    stories: [
      'Three honest paragraphs, sealed for the man ahead of you.',
      'It rides ahead of you now, and it knows when to arrive.',
      'A dozen letters out. You’re writing to someone you trust more than you did.',
      'Two dozen, sealed and sent. Writing to him is as old a habit as some of the ones it replaced.',
      'Fifty-two letters. A year of checking in with someone who kept believing you, on schedule, before you did.',
    ],
  },
  {
    key: 'bounce',
    name: 'Never failed twice',
    blurb: 'Slipped — and back the next morning.',
    steps: [1, 10, 25, 50, 100],
    unit: 'count',
    stories: [
      'You slipped. The next morning you were back before breakfast. No spiral, no vanishing week.',
      'Ten bounces now. That’s not luck holding, that’s practice.',
      'Twenty-five times down, twenty-five mornings back. The pattern is the point, not the count.',
      'Fifty. Falling has stopped meaning anything except that you get up.',
      'A hundred mornings after. The bounce is the strongest predictor there is, and you’re the proof of it.',
    ],
  },
  {
    key: 'firstlight',
    name: 'First light',
    blurb: 'Your first morning check-in.',
    steps: [],
    unit: null,
    stories: ['Twenty seconds of honesty on an ordinary morning. Everything since has stacked on this.'],
  },
  {
    // The canvas album is eleven faces and draws none for this one, but the app
    // awards it for real — the urge log arms it, and the post delivers it — so
    // it is written to the same rules rather than left with nowhere to land.
    key: 'backondeck',
    name: 'Back on deck',
    blurb: 'An urge passed and you came back the same day.',
    steps: [1, 5, 25, 100],
    unit: 'count',
    stories: [
      'It left, and you could have too. Instead you opened the app the same day and logged it.',
      'Five returns. An urge used to end the conversation; now it doesn’t even end the evening.',
      'Twenty-five times back on deck. Returning stopped being a decision. It’s just what you do.',
      'A hundred returns. There is no version of an urge that ends with you gone.',
    ],
  },
  {
    key: 'honest',
    name: 'Honest ink',
    blurb: 'Journal entries, written honestly, not for show.',
    steps: [10, 50, 100, 200, 365],
    unit: 'count',
    stories: [
      'Ten entries in. Twelve honest paragraphs beat a hundred vague ones.',
      'Fifty pages of real accounting. The patterns page runs on this ink.',
      'A hundred entries. You know your own weather better than most people know their week.',
      'Two hundred. The record’s long enough now to argue with your own memory, and win.',
      'A year of entries, one for almost every day. This is a diary of a life, not a habit tracker.',
    ],
  },
  {
    key: 'study',
    name: 'Steady study',
    blurb: 'Lessons finished, one at a time.',
    steps: [5, 10, 25, 50, 75, 96],
    unit: 'count',
    stories: [
      'Five lessons in. Early enough this still feels like homework. That won’t last.',
      'Ten down. The ideas start meeting you in the moment, not just on the page.',
      'A quarter of the curriculum, done. More scaffolding built than it feels like.',
      'Halfway. The back half moves faster because the front half already changed how you think.',
      'Three-quarters through. What’s left is mostly deepening, not learning from scratch.',
      'Every lesson, finished. The curriculum’s done its job. The rest is just living it.',
    ],
  },
  {
    key: 'groundtaken',
    name: 'Ground taken',
    blurb: 'A world finished — then another.',
    steps: [1, 3, 5, 7, 10],
    unit: 'count',
    stories: [
      'Your first world, finished. The map opens from here.',
      'Three worlds in. There’s a rhythm to this now.',
      'Five worlds down, five to go. You’ve crossed the water and started the climb.',
      'Seven worlds. The summit’s close enough to see clearly.',
      'All ten. Sea to summit, the whole campaign, met.',
    ],
  },
  {
    key: 'told',
    name: 'Let someone in',
    blurb: 'Told one person about the work.',
    steps: [],
    unit: null,
    stories: ['The habit lives in the dark. One honest conversation takes half its weight away.'],
  },
  {
    key: 'storm',
    name: 'Storm weathered',
    blurb: 'Rode out a force-nine urge.',
    steps: [],
    unit: null,
    stories: ['One will come. When it does, the lighthouse holds.'],
  },
];

export function kkFace(key: string): KKFace | undefined {
  return KK_ALBUM.find((face) => face.key === key);
}

const ROMAN: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export function kkRoman(n: number): string {
  let out = '';
  let left = n;
  for (const [value, glyph] of ROMAN) while (left >= value) { out += glyph; left -= value; }
  return out || '0';
}

/** A rung as the album writes it: `Day XXX` for time, `×25` for everything else. */
export function kkRung(face: KKFace, step: number): string {
  return face.unit === 'day' ? `Day ${kkRoman(step)}` : `×${step.toLocaleString('en-US')}`;
}

/**
 * How far up the ladder a treatment stands. The canvas details Vici at tiers
 * I, III, IV and VII of seven, which these fractions land on exactly.
 */
export function kkReached(face: KKFace, metal: KKMetal): number {
  const n = face.steps.length;
  if (!n) return 0;
  if (metal === 'paper') return 0;
  if (metal === 'bronze') return 1;
  if (metal === 'silver') return Math.max(1, Math.round(n * 0.4));
  if (metal === 'gold') return Math.max(2, Math.round(n * 0.6));
  return n;
}
