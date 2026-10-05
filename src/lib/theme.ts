/**
 * VICI design tokens — THE single source of truth for all visual styling.
 *
 * Direction: `Vici Overhaul` (Oct 2026) — a flat dark monochrome system. Every
 * frame is a #0D0D0D ground under a 96px noise tile, #1E1E1E cards, warm ink
 * (#F2F0EC) for text and for the one filled control (the primary pill, the
 * selected option), and Lato at every level. No gradients, no washes, no hue.
 *
 * `mono` is the canvas's own palette, named the way the designer's kit names
 * it (`Vici Overhaul/project/gen/mono-kit.js`). `colors` keeps the app's older
 * semantic names, remapped onto `mono`, so a screen that has not been rebuilt
 * yet still lands on the dark system rather than half in the old paper one.
 */

import type { TextStyle, ViewStyle } from 'react-native';
import { Platform } from 'react-native';

type FontWeight = TextStyle['fontWeight'];

export const mono = {
  /** frame ground */
  ground: '#0D0D0D',
  /** filled card, unselected option, chip */
  card: '#1E1E1E',
  /** hairlines, outline rings (`0 0 0 1.5px`), unfilled tracks, inactive dashes */
  line: '#2E2E2E',
  /** quote marks, future days, illustration mid-tones */
  art: '#5A574F',
  /** text, icons, and the fill of the primary pill / selected option */
  ink: '#F2F0EC',
  /** secondary paragraph text */
  sub: '#B5B0A8',
  /** captions, labels, inactive tabs, ghost links */
  mute: '#9B968E',
  /** text and glyphs drawn ON an ink fill */
  onInk: '#111111',
  /** secondary label on an ink fill (lesson-row number, `/year`, `Best value`) */
  onInkMuted: 'rgba(17,17,17,0.6)',
  /** outline ring drawn on an ink fill (Log Chooser, Cue Hue Picker) */
  onInkRing: 'rgba(17,17,17,0.3)',
  /** the dark variant's ground (ten frames: Urge Hub ×6, Night Cover/Closed, Slip Third, Cost By Age 80) */
  groundDark: '#111111',
  /** the letter's ground (Letter Read, Medallion Letter) */
  groundLetter: '#121212',
  /** bottom-sheet panel */
  sheet: '#171717',
  /** sheet scrim — drawn over the status bar too */
  scrim: 'rgba(0,0,0,0.68)',
} as const;

/** Only on the ten `#111111` frames; `#FFFFFF` appears on no other frame. */
export const monoDark = {
  text: '#FFFFFF',
  primaryFill: '#FFFFFF',
  caps: 'rgba(255,255,255,0.55)',
  body: 'rgba(255,255,255,0.62)',
  ghost: 'rgba(255,255,255,0.6)',
  dotOff: 'rgba(255,255,255,0.28)',
  dotOn: '#FFFFFF',
  chipRing: 'rgba(255,255,255,0.15)',
  faint: 'rgba(255,255,255,0.3)',
} as const;

/** Mood / feeling discs, low → high (Morning Feeling, Night 1 Mood). */
export const toneRamp = ['#34322F', '#5A5751', '#8A857D', '#BAB5AD', '#F2F0EC'] as const;

/** Illustration palette — SVG fills and strokes inside heroes and spot art only. */
export const illus = {
  ink: '#F2F0EC',
  ground: '#0D0D0D',
  mid: '#A8A39A',
  dim: '#55524D',
  dim2: '#3A3835',
  tile: '#232220',
  art: '#5A574F',
} as const;

/**
 * Spread-only rings. They paint outside the box and never change layout, so
 * they are `boxShadow` strings (RN-web and the new architecture both honour
 * spread and `inset`) — never a `border`, which would eat into the box.
 */
export const ring = {
  outline: `0 0 0 1.5px #2E2E2E`,
  outlineInk: `0 0 0 1.5px #F2F0EC`,
  outlineArt: `0 0 0 1.5px #5A574F`,
  outlineOnInk: `0 0 0 1.5px rgba(17,17,17,0.3)`,
  outlineDark: `0 0 0 1.5px rgba(255,255,255,0.62)`,
  chipDark: `0 0 0 1px rgba(255,255,255,0.15)`,
  insetMute: `inset 0 0 0 1.5px #9B968E`,
  insetLine: `inset 0 0 0 1.5px #2E2E2E`,
  insetInk: `inset 0 0 0 1.5px #F2F0EC`,
  insetTone: `inset 0 0 0 1.5px #45423E`,
  selectedTone: `0 0 0 4px #0D0D0D, 0 0 0 6px #F2F0EC`,
} as const;

/**
 * Semantic palette. Invariants carried from earlier drops:
 *  - `event.lapse` is never red (invariant #2 — a lapse is data, not failure).
 *  - No hue accents anywhere: the accent IS the ink fill.
 */
export const colors = {
  bg: mono.ground,
  bgDeep: mono.ground,
  surface: mono.card,
  surfaceAlt: mono.line,
  overlay: 'rgba(0,0,0,0.6)',

  gradient: {
    card: [mono.card, mono.card] as const,
    hero: [mono.card, mono.card] as const,
    surface: [mono.card, mono.card] as const,
  },

  // `ink` is the filled control: the primary pill and the selected option.
  ink: mono.ink,
  inkAlt: mono.sub,
  inkText: mono.onInk,
  inkTextMuted: 'rgba(17,17,17,0.62)',
  inkTextSoft: 'rgba(17,17,17,0.45)',
  inkBorder: 'rgba(17,17,17,0.14)',

  text: mono.ink,
  textTitle: mono.ink,
  textMuted: mono.sub,
  textSoft: mono.mute,
  textSofter: mono.art,
  textInverse: mono.onInk,

  border: mono.line,
  borderStrong: mono.line,
  hairline: mono.line,
  ring: mono.line,
  track: mono.line,

  accent: mono.ink,
  accentText: mono.onInk,
  accentSoft: 'rgba(242,240,236,0.06)',

  // Destructive actions only (delete account).
  danger: '#B5624F',

  positive: mono.ink,
  caution: mono.sub,
  info: mono.sub,
  neutral: mono.mute,

  // The mood ramp (week rings, check-in, analytics): ground → ink.
  moodTones: ['#2E2E2E', '#5A574F', '#9B968E', '#B5B0A8', '#F2F0EC'] as const,

  category: {
    motivation: mono.ink,
    physiological: mono.sub,
    environmental: mono.mute,
    psychological: mono.sub,
    existential: mono.ink,
    social: mono.mute,
    psychiatric: mono.sub,
    meta: mono.mute,
  },

  event: {
    urge_rode_out: mono.sub,
    urge_acted_on: mono.mute,
    lapse: mono.art,
    win: mono.ink,
    check_in: mono.mute,
  },

  chart: {
    mood: mono.ink,
    sleep: mono.sub,
    grid: mono.line,
    axis: mono.mute,
    projection: mono.ink,
  },

  // The funnel's night register — already dark; kept for the screens that read it.
  night: {
    top: mono.ground,
    mid: mono.ground,
    bottom: mono.ground,
    surface: mono.card,
    surfaceStrong: mono.line,
    border: mono.line,
    star: 'rgba(242,240,236,0.5)',
    text: mono.ink,
    textMuted: mono.sub,
    textSoft: mono.mute,
    accentA: mono.ink,
    accentB: mono.ink,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// Compact radii from the 393px reference canvas.
export const radius = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/**
 * Lato everywhere — `Vici Overhaul` sets every frame in `'Lato',-apple-system`
 * and loads exactly 400, 700, 900 and (Email Login only) 700 italic.
 *
 * A weight is a **family** here, not a `fontWeight`. Native platforms do not
 * synthesise weights for a custom face, and on web expo-font registers each
 * file as its own family at the default `font-weight: normal` — so a family of
 * `Lato_700Bold` *plus* `fontWeight: '700'` makes Chrome synthesise a second
 * bold on top of the real one. `sans()` therefore states the family and resets
 * the weight to normal; nothing else in the app should set `fontWeight`.
 *
 * Weights the canvas never loads resolve the way the designer's browser
 * resolved them against the four it did: 300 and 500 fall to 400, 600 rises to
 * 700, 800 rises to 900 (CSS Fonts 4 §5.2).
 */
export const LATO = {
  regular: 'Lato_400Regular',
  bold: 'Lato_700Bold',
  black: 'Lato_900Black',
  boldItalic: 'Lato_700Bold_Italic',
} as const;

export const sansFamily: Record<string, string> = {
  '100': LATO.regular,
  '200': LATO.regular,
  '300': LATO.regular,
  '400': LATO.regular,
  '500': LATO.regular,
  '600': LATO.bold,
  '700': LATO.bold,
  '800': LATO.black,
  '900': LATO.black,
};

/**
 * On web the family carries the canvas's own fallback chain, so a glyph Lato v1
 * does not have (→ U+2192 in Morning 1's `+12 → 1,240`) falls back the way the
 * frame's `'Lato',-apple-system,system-ui,sans-serif` does. Native font names
 * cannot hold a list; there the platform's own fallback applies.
 */
const WEB_FALLBACK = ", -apple-system, system-ui, sans-serif";
const family = (f: string) => (Platform.OS === 'web' ? f + WEB_FALLBACK : f);

export function sans(w: FontWeight = '400'): TextStyle {
  const key = String(w === 'normal' ? '400' : w === 'bold' ? '700' : w);
  return { fontFamily: family(sansFamily[key] ?? LATO.regular), fontWeight: 'normal' };
}

/**
 * The canvas's italic. Its only italic face is 700, and CSS matches style
 * before weight, so a frame that asks for `font-style:italic; font-weight:400`
 * (the medallion quotes) was drawn in 700 italic — this is that face, whatever
 * weight the frame wrote. The family is already italic; `fontStyle` stays
 * normal so web does not slant it a second time.
 */
export function sansItalic(): TextStyle {
  return { fontFamily: family(LATO.boldItalic), fontWeight: 'normal', fontStyle: 'normal' };
}

/**
 * A canvas `line-height: <ratio>` as the number RN needs, matching what the
 * frame's own engine lays out.
 *
 * The obvious translation — `fontSize * ratio` — is a sixty-fourth of a point
 * too tall on web, and the error is per line. Chrome resolves a **unitless**
 * line-height by multiplying and then **flooring** to its 1/64pt LayoutUnit,
 * and resolves a **length** by rounding: `line-height: 1.8` on 15.5px lays out
 * at 27.890625, while `line-height: 27.9px` lays out at 27.90625. Measured in
 * isolation over eight lines at six font-size/ratio pairs — floor every time.
 *
 * One line-box apart is invisible; the week-XII letter is seventy-five lines of
 * it, and the paragraph run drifted 0.8pt below the frame by the sign-off. See
 * DECISIONS D136.
 */
export function cssLineHeight(fontSize: number, ratio: number): number {
  return Math.floor(fontSize * ratio * 64) / 64;
}

/**
 * What Chrome lays out for `line-height: normal` in Lato. Lato's hhea ascent
 * and descent (1974 / 426 of 2000) are rounded **separately**, so the box is
 * `round(0.987·size) + round(0.213·size)` — not `1.2·size` (17px is 21, not
 * 20.4). Measured against every text box in the design signatures, 11–76px.
 * Use it wherever a frame leaves `normal` and the text's box position matters:
 * RN-web leaves CSS `normal` (same value) but native does not.
 */
export function lhNormal(size: number): number {
  return Math.round(size * 0.987) + Math.round(size * 0.213);
}

type TypeSpec = { size: number; w: '400' | '700' | '900'; lh?: number; ls?: number; color: string };
const spec = ({ size, w, lh, ls = 0, color }: TypeSpec): TextStyle => ({
  ...sans(w),
  fontSize: size,
  lineHeight: lh ?? lhNormal(size),
  letterSpacing: ls,
  color,
});

/**
 * The canvas's named text styles (design-system §3.3), ready to spread. Colour
 * is the default the frames use most; screens override it where a frame does.
 */
export const type = {
  h1: spec({ size: 26, w: '700', lh: 33, ls: -0.6, color: '#F2F0EC' }),
  h1Sheet: spec({ size: 22, w: '700', lh: 28, ls: -0.6, color: '#F2F0EC' }),
  h1SheetLg: spec({ size: 24, w: '700', lh: 30, ls: -0.6, color: '#F2F0EC' }),
  title: spec({ size: 30, w: '700', lh: 36, ls: -0.6, color: '#F2F0EC' }),
  titlePage: spec({ size: 32, w: '700', lh: 38, ls: -0.6, color: '#F2F0EC' }),
  titleCover: spec({ size: 34, w: '700', lh: 40, ls: -0.6, color: '#F2F0EC' }),
  greeting: spec({ size: 26, w: '700', lh: 32, ls: -0.7, color: '#F2F0EC' }),
  lessonHeading: spec({ size: 24, w: '700', lh: 31, ls: -0.4, color: '#F2F0EC' }),
  lessonBody: spec({ size: 18, w: '400', lh: 28, color: '#B5B0A8' }),
  lessonCaps: spec({ size: 13, w: '700', lh: 16, ls: 0.2, color: '#9B968E' }),
  lessonOption: spec({ size: 16, w: '400', lh: 22, color: '#F2F0EC' }),
  lessonDoneWhen: spec({ size: 16, w: '700', lh: 22, color: '#F2F0EC' }),
  p: spec({ size: 15, w: '400', lh: 24, color: '#B5B0A8' }),
  pTight: spec({ size: 15, w: '400', lh: 22, color: '#B5B0A8' }),
  caps: spec({ size: 13, w: '700', color: '#9B968E' }),
  primaryLabel: spec({ size: 16, w: '700', ls: 0.1, color: '#111111' }),
  ghost: spec({ size: 15, w: '400', color: '#9B968E' }),
  optionLabel: spec({ size: 15, w: '400', color: '#F2F0EC' }),
  gridLabel: spec({ size: 16, w: '700', color: '#F2F0EC' }),
  rowLabel: spec({ size: 15, w: '700', color: '#F2F0EC' }),
  rowValue: spec({ size: 14, w: '700', color: '#9B968E' }),
  pill: spec({ size: 13, w: '700', color: '#F2F0EC' }),
  navTitle: spec({ size: 13, w: '700', color: '#9B968E' }),
  tabLabel: spec({ size: 11.5, w: '400', color: '#9B968E' }),
  authButton: spec({ size: 17, w: '700', color: '#111111' }),
  legal: spec({ size: 12, w: '700', ls: 0.4, color: '#9B968E' }),
  statValue: spec({ size: 64, w: '700', lh: 67, ls: -2.2, color: '#F2F0EC' }),
} as const;

/** Canvas layout constants (design-system §5). Canvas y; the app subtracts the 54 status bar via `Screen`. */
export const layout = {
  frameW: 393,
  frameH: 852,
  statusBar: 54,
  gutter: 24,
  gutterWide: 16,
  navTop: 60,
  navH: 40,
  primaryH: 58,
  primaryBottom: 48,
  primaryOverGhost: 96,
  ghostBottom: 60,
  tabBarH: 104,
} as const;

export const fonts = {
  sans: sansFamily['400'],
  sansMedium: sansFamily['500'],
  sansSemibold: sansFamily['600'],
  sansBold: sansFamily['700'],
  sansExtrabold: sansFamily['800'],

  serif: sansFamily['500'],
  serifRegular: sansFamily['400'],
  serifMedium: sansFamily['500'],
  serifSemibold: sansFamily['600'],
  serifBold: sansFamily['600'],
  serifItalic: sansFamily['400'],
  serifSharp: sansFamily['500'],
  serifSharpItalic: sansFamily['400'],

  /**
   * The previous drop set the pledge in Georgia and the signature in a signing
   * hand. `Vici Overhaul` draws both in Lato — the pledge line in 700 and the
   * signed name in 700 italic (`21D5B · Morning — Pledge signed`) — so the two
   * aliases survive only so older call sites land on the canvas's faces.
   */
  quote: LATO.bold,
  script: LATO.boldItalic,

  // Semantic aliases used by primitives.
  display: sansFamily['600'],
  heading: sansFamily['600'],
  body: sansFamily['400'],
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) as string,
} as const;

// Native type scale used by the 393px boards.
export const fontSize = {
  xs: 11,
  sm: 13.5,
  md: 16,
  lg: 17,
  xl: 19,
  xxl: 22,
  display: 27,
  hero: 34,
} as const;

export const weight: Record<'regular' | 'medium' | 'semibold' | 'bold', FontWeight> = {
  regular: '400',
  medium: '400',
  semibold: '700',
  bold: '700',
};

export const lineHeight = {
  tight: 1.12,
  snug: 1.3,
  normal: 1.45,
  relaxed: 1.6,
} as const;

/** Card styling reused across primitives (paper tone). */
export const card = {
  backgroundColor: colors.surface,
  borderColor: 'transparent',
  borderWidth: 0,
  borderRadius: radius.lg,
  borderCurve: 'continuous',
} as const;

/** Mostly-flat depth: hairline definition first, lift only for overlays. */
/** Flat system: depth is the card fill, and the only ring is the 1.5px line. */
export const shadow: Record<'card' | 'cardRaised' | 'ink' | 'control', ViewStyle> = {
  card: {},
  cardRaised: { boxShadow: `0 0 0 1.5px ${mono.line}` },
  ink: {},
  control: { boxShadow: `0 0 0 1.5px ${mono.line}` },
} as const;

export const theme = {
  mono,
  colors,
  spacing,
  radius,
  fonts,
  fontSize,
  weight,
  lineHeight,
  card,
  shadow,
} as const;

export type Theme = typeof theme;
export default theme;
