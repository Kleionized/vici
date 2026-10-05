import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { roman } from '@/lib/format';
import { illus, mono, sans } from '@/lib/theme';

/**
 * 088–089 · The medallions.
 *
 * `Vici Overhaul` struck every face on one coin: an ink disc, a ring of forty
 * dots inside its rim, a hairline ring, and the face's device in ground ink.
 * The metal is no longer painted — a tiered face reads its rung from the Roman
 * numeral under the device, and the device is lifted 2.6 to make room for it.
 * The rule that explains all 27 frames: **the glyph lifts iff a numeral is
 * drawn**. The album draws the coin at 64, the one-offs page at 84, the boards
 * and ladders at 168 and the medallion letter's enclosure at 44 — always the
 * same `0 0 64 64` drawing.
 *
 * The ladder is still five rungs on every tiered face — Paper I, Bronze II,
 * Silver III, Gold IV, Platinum V — and the four faces that mint once mint
 * once (`Tiers One-offs`: "One tier. Kept for good.").
 */

export type KeepsakeSceneKey =
  | 'veni'
  | 'firstlight'
  | 'vidi'
  | 'vici'
  | 'breakwater'
  | 'rebound'
  | 'logbook'
  | 'pulse'
  | 'blackbox'
  | 'lessons'
  | 'archive'
  | 'return';

/**
 * The five rungs, by name. The detail route still carries one as `?tier=` — a
 * face that mints once is filed under `platinum` — so the names stay the
 * route's contract even though the coin no longer changes with them.
 */
export const KK_METALS = ['paper', 'bronze', 'silver', 'gold', 'platinum'] as const;
export type KKMetal = (typeof KK_METALS)[number];

// ── the coin ───────────────────────────────────────────────────────────

/** Ground ink: the device and the rim marks on an ink coin. */
const DEVICE = illus.ground;
/** The unearned tiered coin's field, dashed rim and inner ring — drawn only by this group's frames. */
const BLANK = { field: '#141414', rim: '#3A3833', ring: '#2A2926' };
/** An unearned one-off is the earned coin, faded (`Medallions Still To Earn`, `Tiers One-offs`). */
const FADED = 0.32;

/**
 * The forty rim dots: radius 28.1 about the centre from angle 0, 9° apart,
 * rounded to two places as the designer's generator writes them — every one of
 * the 40 × 27 printed values comes out of this.
 */
const DOTS = Array.from({ length: 40 }, (_, i) => {
  const a = (i * 9 * Math.PI) / 180;
  return [+(32 + 28.1 * Math.cos(a)).toFixed(2), +(32 + 28.1 * Math.sin(a)).toFixed(2)] as const;
});

const ROUND = { strokeLinecap: 'round' } as const;
const ROUND_BOTH = { strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** The twelve devices, in the coin's 64 space, stroked/filled in `c` (`glyphs.txt`, verbatim). */
const DEVICES: Record<KeepsakeSceneKey, (c: string) => ReactNode> = {
  veni: (c) => (
    <>
      <Path d="M23 42V31a9 9 0 0 1 18 0v11" fill="none" stroke={c} strokeWidth={2.6} {...ROUND_BOTH} />
      <Path d="M19 42h26" stroke={c} strokeWidth={2.6} {...ROUND} />
    </>
  ),
  firstlight: (c) => (
    <>
      <Path d="M24.5 39a7.5 7.5 0 0 1 15 0z" fill={c} />
      {['M22.13 35.41L18.37 34.04', 'M25.98 30.4L23.68 27.12', 'M32 28.5L32 24.5', 'M38.02 30.4L40.32 27.12', 'M41.87 35.41L45.63 34.04'].map((d) => (
        <Path key={d} d={d} stroke={c} strokeWidth={2.4} {...ROUND} />
      ))}
      <Path d="M17 39h30" stroke={c} strokeWidth={2.4} {...ROUND} />
    </>
  ),
  vidi: (c) => (
    <>
      <Path d="M17 32c4-6.5 9-9.5 15-9.5s11 3 15 9.5c-4 6.5-9 9.5-15 9.5s-11-3-15-9.5z" fill="none" stroke={c} strokeWidth={2.4} strokeLinejoin="round" />
      <Circle cx={32} cy={32} r={4.6} fill={c} />
    </>
  ),
  vici: (c) => (
    <>
      <Path d="M20 40l-1.5-14 7.5 6 6-9 6 9 7.5-6L44 40z" fill={c} stroke={c} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M20 44h24" stroke={c} strokeWidth={2.4} {...ROUND} />
    </>
  ),
  breakwater: (c) => (
    <>
      <Rect x={39.5} y={22} width={6.5} height={21} rx={1} fill={c} />
      <Path d="M17 29c2.5-3 5.5-3 8 0s5.5 3 8 0" fill="none" stroke={c} strokeWidth={2.4} {...ROUND} />
      <Path d="M17 36.5c2.5-3 5.5-3 8 0s5.5 3 8 0" fill="none" stroke={c} strokeWidth={2.4} {...ROUND} />
      <Path d="M17 44h29" stroke={c} strokeWidth={2.4} {...ROUND} />
    </>
  ),
  rebound: (c) => (
    <>
      {/* a dotted arc of round caps: zero-length dashes 4.4 apart */}
      <Path d="M19.5 22Q27 56 37 30.5" fill="none" stroke={c} strokeWidth={2.4} strokeDasharray="0 4.4" {...ROUND} />
      <Circle cx={41} cy={25} r={4.2} fill={c} />
      <Path d="M17 43.5h30" stroke={c} strokeWidth={2.4} {...ROUND} />
    </>
  ),
  logbook: (c) => (
    <>
      <Rect x={21.5} y={20} width={21} height={25} rx={2.5} fill="none" stroke={c} strokeWidth={2.4} />
      <Path d="M26.5 27h11M26.5 32.5h11M26.5 38h7" stroke={c} strokeWidth={2.4} {...ROUND} />
    </>
  ),
  pulse: (c) => <Path d="M15.5 33h7.5l3-7.5 5 15 4.5-18 3 10.5h10" fill="none" stroke={c} strokeWidth={2.6} {...ROUND_BOTH} />,
  blackbox: (c) => (
    <>
      <Path d="M27.5 25v-3a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5v3" fill="none" stroke={c} strokeWidth={2.4} />
      <Rect x={19.5} y={25} width={25} height={18.5} rx={2.6} fill={c} />
      {/* the two slots are cut back to the coin's ink, not drawn in the device colour */}
      <Path d="M23.5 31.5h17M23.5 36.5h17" stroke={mono.ink} strokeWidth={1.8} {...ROUND} />
    </>
  ),
  lessons: (c) => (
    <>
      <Path d="M32 25.5c-3.5-2.6-8-3.4-14-3v18.5c6-.4 10.5.4 14 3 3.5-2.6 8-3.4 14-3V22.5c-6-.4-10.5.4-14 3z" fill="none" stroke={c} strokeWidth={2.4} strokeLinejoin="round" />
      <Path d="M32 25.5v18" stroke={c} strokeWidth={2.2} />
    </>
  ),
  archive: (c) => (
    <>
      <Rect x={18} y={21.5} width={28} height={6.5} rx={1.6} fill="none" stroke={c} strokeWidth={2.4} />
      <Path d="M20.5 28v13.5a1.5 1.5 0 0 0 1.5 1.5h20a1.5 1.5 0 0 0 1.5-1.5V28" fill="none" stroke={c} strokeWidth={2.4} strokeLinejoin="round" />
      <Path d="M28.5 34h7" stroke={c} strokeWidth={2.4} {...ROUND} />
    </>
  ),
  return: (c) => (
    <>
      <Path d="M40.6 25.98A10.5 10.5 0 1 1 27.56 22.48" fill="none" stroke={c} strokeWidth={2.6} {...ROUND} />
      <Path d="M31.37 20.71L25.14 19.19L28.53 26.44z" fill={c} stroke={c} strokeWidth={1.2} strokeLinejoin="round" />
      <Circle cx={32} cy={32} r={2.6} fill={c} />
    </>
  ),
};

/**
 * One face on the coin (medallions-letters §1.2). Three looks:
 *
 * - **earned** — the ink coin, forty dots at 0.3, the hairline ring, the device
 *   in ground ink. With `numeral` the rung is set under the device (Lato 900,
 *   6.4 in the 64 space, tracking 0.6) and the device lifts 2.6.
 * - **unearned, one-off** (Return) — the earned coin at opacity 0.32.
 * - **unearned, tiered** (Archive, Detail Paper's Vici) — a `#141414` field in a
 *   dashed `#3A3833` rim, a `#2A2926` ring, no dots, the device in `#5A574F`.
 *   The album gives it the numeral of the rung it is waiting on ("I"); the
 *   168 boards draw it bare.
 *
 * Purely decorative: the screens say what the coin shows in words.
 */
export function FaceCoin({
  scene,
  size = 64,
  earned = true,
  numeral,
  style,
}: {
  scene: KeepsakeSceneKey;
  size?: number;
  earned?: boolean;
  /** the Roman rung under the device; omit on one-offs and on the bare unearned boards */
  numeral?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const tiered = (kkFace(scene)?.steps.length ?? 0) > 0;
  const blank = !earned && tiered;
  const c = blank ? mono.art : DEVICE;
  const device = DEVICES[scene](c);
  return (
    <View
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[{ width: size, height: size, opacity: !earned && !tiered ? FADED : 1 }, style]}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        {blank ? (
          <>
            <Circle cx={32} cy={32} r={30} fill={BLANK.field} stroke={BLANK.rim} strokeWidth={1.6} strokeDasharray="2.6 3.4" />
            <Circle cx={32} cy={32} r={25.5} fill="none" stroke={BLANK.ring} strokeWidth={1} />
          </>
        ) : (
          <>
            <Circle cx={32} cy={32} r={30} fill={mono.ink} />
            <G fill={DEVICE} fillOpacity={0.3}>
              {DOTS.map(([cx, cy]) => (
                <Circle key={`${cx},${cy}`} cx={cx} cy={cy} r={0.7} />
              ))}
            </G>
            <Circle cx={32} cy={32} r={25.5} fill="none" stroke={DEVICE} strokeWidth={1.1} strokeOpacity={0.5} />
          </>
        )}
        {numeral ? <G transform="translate(0 -2.6)">{device}</G> : device}
        {numeral ? (
          // SVG text does not inherit the app font: the weight is the family (theme `sans()` rule)
          <SvgText
            x={32}
            y={53.2}
            textAnchor="middle"
            fontFamily={sans('900').fontFamily}
            fontWeight="normal"
            fontSize={6.4}
            letterSpacing={0.6}
            fill={c}>
            {numeral}
          </SvgText>
        ) : null}
      </Svg>
    </View>
  );
}

// ── the album: which faces there are, and what each one costs ─────────

export type KKFace = {
  key: KeepsakeSceneKey;
  name: string;
  /**
   * What earns it, in one line: the board's and the ladder's line under the
   * name. A one-off's blurb is the requirement `Tiers One-offs` lists under it,
   * which the canvas leaves without a full stop.
   */
  blurb: string;
  /** The longer telling the detail board prefers where the canvas draws one (Vici). */
  long?: string;
  /** The line an unearned one-off carries in the album. */
  ahead?: string;
  /** the rungs the medallion climbs; empty when it mints once */
  steps: number[];
  /** how a rung reads: days are set as `Day N`, everything else as a count */
  unit: 'day' | 'count' | null;
  /** what the rungs are counted in, for the unearned album cell's "9 of 10 entries" */
  noun?: string;
  /** the line the medallion carries at each rung it reaches */
  stories: string[];
};

/**
 * The twelve faces the canvas draws, in the album's own order — `Medallions`
 * and `Album Earned II` hold the first ten, `Medallions Still To Earn` the last
 * two. Everything the album, the boards and the ladders read about a face
 * comes from here; the live counts are laid over it by `src/lib/album.ts`.
 */
export const KK_ALBUM: KKFace[] = [
  {
    key: 'veni',
    name: 'Veni',
    blurb: 'Finished onboarding',
    steps: [],
    unit: null,
    stories: ['Nothing was asked of you yet. Just this: you stepped off the old shore. Everything since has been built on that alone.'],
  },
  {
    key: 'firstlight',
    name: 'First light',
    blurb: 'The first check-in',
    steps: [],
    unit: null,
    stories: ['Twenty seconds on an ordinary morning. Everything since has stacked on this.'],
  },
  {
    key: 'vidi',
    name: 'Vidi',
    blurb: 'Days Vici was opened and something recorded.',
    steps: [7, 30, 90, 180, 365],
    unit: 'day',
    noun: 'days',
    stories: [
      'Seven check-ins, two waves ridden, zero perfect days required.',
      'Around here, “trying something” turns into “how you live.”',
      'The long walk. By now the view is just… Tuesday.',
      'Six months witnessed, one day at a time. Vidi only asks that you stayed on it.',
      'A full year, witnessed. The campaign outlived the season it started in.',
    ],
  },
  {
    key: 'vici',
    name: 'Vici',
    blurb: 'Urge logs that did not end in a slip.',
    long: 'Urges met and outlasted — the conquering half of the campaign.',
    steps: [5, 25, 100, 250, 1000],
    unit: 'count',
    noun: 'logs',
    stories: [
      'Five ridden. Each one shortens the next.',
      'Twenty-five behind you now — the pattern is unmistakable.',
      'A hundred waves met and outlasted. This stopped being a fight you were unsure of a while ago.',
      // `Detail Gold` rewrote this rung's line; the other four are unchanged
      'Two hundred and fifty. The sea keeps coming. You keep standing.',
      'A thousand. The sea hasn’t changed. You’re just not the one it moves anymore.',
    ],
  },
  {
    key: 'breakwater',
    name: 'Breakwater',
    // every Breakwater frame and Tiers Breakwater now set "overwhelming" in lower case
    blurb: 'An overwhelming urge that ended without a slip.',
    steps: [1, 5, 10, 25, 50],
    unit: 'count',
    noun: 'waves',
    stories: [
      'The first wave broke against you, not over you.',
      'Five storms met at full height. The wall is real now.',
      'Ten overwhelming urges, none of them decisive.',
      'Twenty-five. What used to flood you now only gets loud.',
      'Fifty waves. The sea hasn’t changed. The wall did.',
    ],
  },
  {
    key: 'rebound',
    name: 'Rebound',
    blurb: 'A check-in on the day after a slip.',
    steps: [1, 10, 25, 50, 100],
    unit: 'count',
    noun: 'mornings',
    stories: [
      'You slipped. The next morning you were back before breakfast. No spiral, no vanishing week.',
      'Ten bounces now. Ten is past the point where luck explains it.',
      'Twenty-five times down, twenty-five mornings back. The second number is the one that keeps up.',
      'Fifty. Falling has stopped meaning anything except that you get up.',
      'A hundred mornings after. The bounce is the strongest predictor there is, and you’re the proof of it.',
    ],
  },
  {
    key: 'logbook',
    name: 'Logbook',
    blurb: 'Urge logs saved, whatever the outcome.',
    steps: [5, 25, 75, 200, 500],
    unit: 'count',
    noun: 'logs',
    stories: [
      'Five logged. The point was never the outcome — it was writing it down at all.',
      'Twenty-five entries. The log is long enough now to argue with a bad memory.',
      'Seventy-five. Every one of them is a night you looked at instead of away from.',
      'Two hundred logs. There is nothing mysterious left about how an urge behaves.',
      'Five hundred. The record is the reason you can see the weather coming.',
    ],
  },
  {
    key: 'pulse',
    name: 'Pulse',
    blurb: 'Check-ins completed.',
    steps: [5, 25, 75, 200, 500],
    unit: 'count',
    noun: 'check-ins',
    stories: [
      'Five check-ins. Twenty seconds each, and already a line on the chart.',
      'Twenty-five. Enough mornings to tell a mood from a pattern.',
      'Seventy-five. The app knows your ordinary now, so the unusual shows up.',
      'Two hundred. This is the record of a life, kept a day at a time.',
      'Five hundred check-ins. Turning up stopped being a decision a long way back.',
    ],
  },
  {
    key: 'blackbox',
    name: 'Black Box',
    blurb: 'First slip logged',
    steps: [],
    unit: null,
    stories: ['You wrote down the one you lost. That entry is what the next ten are built on.'],
  },
  {
    key: 'lessons',
    name: 'Lessons',
    blurb: 'Lessons completed.',
    steps: [5, 25, 50, 75, 110],
    unit: 'count',
    noun: 'lessons',
    stories: [
      'Five lessons in. Early enough this still feels like homework. That won’t last.',
      'A quarter of the curriculum, done. More scaffolding built than it feels like.',
      'Halfway. The back half moves faster because the front half already changed how you think.',
      'Three-quarters through. What’s left is mostly deepening, not learning from scratch.',
      'Every lesson, finished. The curriculum’s done its job. The rest is just living it.',
    ],
  },
  {
    key: 'archive',
    name: 'Archive',
    blurb: 'Journal entries saved.',
    steps: [10, 50, 100, 200, 365],
    unit: 'count',
    noun: 'entries',
    stories: [
      'Ten entries in. A dozen specific paragraphs beat a hundred vague ones.',
      'Fifty pages of accounting. The patterns page runs on this ink.',
      'A hundred entries. You know your own weather better than most people know their week.',
      'Two hundred. The record’s long enough now to argue with your own memory, and win.',
      'A year of entries, one for almost every day. This is a diary of a life, not a habit tracker.',
    ],
  },
  {
    key: 'return',
    name: 'Return',
    blurb: 'Back after 7+ days away',
    // The album writes the same requirement shorter — the one place the two
    // screens word it differently, so both strings are carried.
    ahead: 'After 7 days away',
    steps: [],
    unit: null,
    stories: ['A week gone, and you came back anyway. Nobody was watching. That is the whole of it.'],
  },
];

export function kkFace(key: string): KKFace | undefined {
  return KK_ALBUM.find((face) => face.key === key);
}

/** I … V, and digits for anything ≤ 0 (`src/lib/format.ts`). */
export function kkRoman(n: number): string {
  return roman(n);
}

/**
 * A rung as the frames write it: `Day 7` for time, `×1,000` for everything
 * else. Every screen now writes days in Arabic (`Tier I, Day 7` in the album,
 * `Day 30` under the ladder) — the album's old `Day VII` is gone; `roman` is
 * kept for a caller that still wants it.
 */
export function kkRung(face: KKFace, step: number, numerals: 'roman' | 'arabic' = 'arabic'): string {
  if (face.unit !== 'day') return `×${step.toLocaleString('en-US')}`;
  return `Day ${numerals === 'roman' ? roman(step) : step.toLocaleString('en-US')}`;
}

/** The state line of a tiered face standing on a rung: `Tier II, ×25`. */
export function kkTierLine(face: KKFace, standing: number): string {
  return `Tier ${roman(standing)}, ${kkRung(face, face.steps[Math.max(0, Math.min(face.steps.length, standing) - 1)])}`;
}

/** The caps line of a tiered face with nothing behind it: `Not yet. First at ×10`. */
export function kkFirstAt(face: KKFace): string {
  return `Not yet. First at ${kkRung(face, face.steps[0])}`;
}

/** How many rungs a count has cleared. A face that mints once clears its one rung or none. */
export function kkStanding(face: KKFace, count: number): number {
  if (!face.steps.length) return count >= 1 ? 1 : 0;
  return face.steps.filter((step) => count >= step).length;
}

/**
 * The rung name a face's detail route is filed under (`?tier=`), given how
 * many rungs are behind it; a face that mints once is filed under platinum.
 */
export function kkMetal(face: KKFace, standing: number): KKMetal {
  if (standing < 1) return 'paper';
  if (!face.steps.length) return 'platinum';
  return KK_METALS[Math.min(KK_METALS.length, standing) - 1];
}

/** The rung a `?tier=` stands on — the inverse of `kkMetal`. */
export function kkStandingFor(face: KKFace, metal: KKMetal): number {
  if (!face.steps.length) return 1;
  return KK_METALS.indexOf(metal) + 1;
}
