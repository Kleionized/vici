/**
 * Tideline design tokens — THE single source of truth for all visual styling.
 *
 * Direction: the **latest UI paper system** — a warm field (#F4F3F0), flat
 * white cards, compact continuous corners, and the native system typeface at
 * every level. A single solid #131313 surface anchors hero cards, urge actions,
 * and primary pills. The reference canvas is 393 × 852 with 16px screen gutters.
 *
 * The surface context (`components/ui/surface.tsx`) is retained — `Card
 * tone="ink"` is the solid #131313 dark card and flips text light automatically.
 *
 * Every screen/primitive reads from this file, so the look is tuned here, in one
 * place. See DESIGN_NOTES.md for the rationale and token inventory.
 */

import { Platform } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

type FontWeight = TextStyle['fontWeight'];

/**
 * Paper/ink palette. NOTE a few semantic colours carry invariants:
 *  - `event.lapse` is a warm clay, deliberately NOT red/alarming (invariant #2 —
 *    a lapse is data, not failure).
 *  - No hue accents anywhere: the "accent" IS the ink fill (#131313).
 */
export const colors = {
  // Surfaces — warm paper field with clean paper cards and a quiet inset tone.
  bg: '#F4F3F0',
  bgDeep: '#EBE9E5',
  surface: '#FFFFFF',
  surfaceAlt: '#EFEEEA', // inset/soft chip tone on paper
  overlay: 'rgba(24,23,21,0.5)',

  // Card "gradients" — flat now; kept as pairs so `Card` stays one component.
  gradient: {
    card: ['#FFFFFF', '#FFFFFF'] as const,
    hero: ['#131313', '#131313'] as const,
    surface: ['#FFFFFF', '#FFFFFF'] as const,
  },

  // Ink — `ink` is the ONE dark surface (#131313): hero cards, the urge circle,
  // primary pills. The `inkText*` family is the light text used on it.
  ink: '#131313',
  inkAlt: '#26251F',
  inkText: '#F5F4F1',
  inkTextMuted: 'rgba(245,244,241,0.62)',
  inkTextSoft: 'rgba(245,244,241,0.45)',
  inkBorder: 'rgba(245,244,241,0.14)',

  // Text — near-black ink on paper, with calibrated warm-gray tiers.
  text: '#1D1C1A',
  /** Screen titles and inline actions — a touch warmer than body ink. */
  textTitle: '#2A2924',
  textMuted: '#55534E',
  textSoft: '#8B8882',
  textSofter: '#B4B1AB',
  textInverse: '#F5F4F1',

  // Lines — faint black hairlines on paper; `ring` is the empty-state circle.
  border: 'rgba(0,0,0,0.09)',
  borderStrong: 'rgba(0,0,0,0.14)',
  hairline: 'rgba(0,0,0,0.06)',
  ring: '#B8B8B7',
  /** Unfilled progress: step bars, meters, inactive tab glyphs. */
  track: '#C6C5C0',

  // Accent — the ink fill. Primary actions are dark pills with paper text.
  accent: '#131313',
  accentText: '#F5F4F1',
  accentSoft: 'rgba(0,0,0,0.045)',

  // Danger — muted terracotta, only for destructive actions (delete account).
  danger: '#B5624F',

  // Status — the neutral ink scale; never red for a lapse.
  positive: '#33312D',
  caution: '#9C8463', // warm clay
  info: '#55534E',
  neutral: '#8B8882',

  // The mood ramp — single source of truth for any mood-mapped tone
  // (week rings, check-in, analytics). Pure neutral greys, white → black.
  moodTones: ['#DCDCDC', '#B4B4B4', '#8A8A8A', '#575757', '#1B1B1B'] as const,

  // Per-lesson-category identity — neutralised to the ink scale (the canvas
  // removed hue identities app-wide; identity now comes from the glyph).
  category: {
    motivation: '#33312D',
    physiological: '#55534E',
    environmental: '#6B6960',
    psychological: '#5E5B55',
    existential: '#44423E',
    social: '#7A776F',
    psychiatric: '#4E4B45',
    meta: '#8B8882',
  },

  // Per-event-type tints used by the Log (all neutral; clay for lapse only).
  event: {
    urge_rode_out: '#6B6960',
    urge_acted_on: '#8B8882',
    lapse: '#9C8463', // warm clay — deliberately NOT red (invariant #2)
    win: '#33312D',
    check_in: '#918E85',
  },

  // Data-viz — drawn in ink on paper.
  chart: {
    mood: '#33312D',
    sleep: '#55534E',
    grid: 'rgba(0,0,0,0.07)',
    axis: 'rgba(0,0,0,0.35)',
    projection: '#131313',
  },

  // Onboarding v3 "night register" — monochrome dark (no hue accents): the
  // funnel opens on night water and daylight arrives at the reading.
  night: {
    top: '#09090A',
    mid: '#0B0B0C',
    bottom: '#070708',
    surface: 'rgba(255,255,255,0.055)',
    surfaceStrong: 'rgba(255,255,255,0.14)',
    border: 'rgba(255,255,255,0.10)',
    star: 'rgba(237,237,232,0.5)',
    text: '#EDEDE8',
    textMuted: '#A6A7A0',
    textSoft: '#6C6D66',
    accentA: '#EDEDE8', // selection + progress stay paper-white
    accentB: '#EDEDE8',
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
 * The latest UI uses SF/system type throughout. The legacy serif aliases stay
 * mapped to the same native face so older screens inherit the overhaul without
 * loading or waiting for bundled display fonts.
 */
const SANS_WEB_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export const sansFamily: Record<string, string> = Platform.select({
  ios: {
    '300': 'System',
    '400': 'System',
    '500': 'System',
    '600': 'System',
    '700': 'System',
    '800': 'System',
    '900': 'System',
  },
  web: {
    '300': SANS_WEB_STACK,
    '400': SANS_WEB_STACK,
    '500': SANS_WEB_STACK,
    '600': SANS_WEB_STACK,
    '700': SANS_WEB_STACK,
    '800': SANS_WEB_STACK,
    '900': SANS_WEB_STACK,
  },
  default: {
    '300': 'sans-serif',
    '400': 'sans-serif',
    '500': 'sans-serif-medium',
    '600': 'sans-serif-medium',
    '700': 'sans-serif',
    '800': 'sans-serif',
    '900': 'sans-serif',
  },
})!;

export function sans(w: FontWeight = '400'): TextStyle {
  const key = String(w === 'normal' ? '400' : w === 'bold' ? '700' : w);
  // The canvas reaches 700 in exactly six places (the current row on the
  // journey map, and the campaign headings); everything else stops at 600.
  // There is no ceiling here, or those six silently render semibold.
  return { fontFamily: sansFamily[key] ?? sansFamily['400'], fontWeight: key as FontWeight };
}

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
   * The two faces the canvas names literally rather than inheriting: Georgia
   * for a written line (the pledge, the vow), and a signing hand for the name
   * under it. Everything else stays on the system sans.
   */
  quote: Platform.select({ ios: 'Georgia', android: 'serif', default: "Georgia, 'Times New Roman', serif" }) as string,
  script: Platform.select({
    ios: 'Snell Roundhand',
    android: 'casual',
    default: "'Snell Roundhand', 'Savoye LET', 'Segoe Script', cursive",
  }) as string,

  // Semantic aliases used by primitives.
  display: sansFamily['600'],
  heading: sansFamily['600'],
  body: sansFamily['400'],
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
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
  medium: '500',
  semibold: '600',
  bold: '600', // capped — nothing renders heavier than semibold
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
export const shadow: Record<'card' | 'cardRaised' | 'ink' | 'control', ViewStyle> = {
  card: {
    boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
  },
  cardRaised: {
    boxShadow: '0 0 0 1px rgba(0,0,0,0.10), 0 12px 30px rgba(40,38,32,0.13)',
  },
  ink: {
    boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
  },
  control: {
    boxShadow: '0 0 0 1px rgba(0,0,0,0.10)',
  },
} as const;

export const theme = {
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
