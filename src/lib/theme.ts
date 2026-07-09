/**
 * Tideline design tokens — THE single source of truth for all visual styling.
 *
 * Direction: the **VICI paper system** (from the claude.ai/design canvas) — a warm
 * parchment field (#F4F3F0), flat solid-white cards (no borders, no shadows, no
 * gradients), an EB Garamond display-serif voice with Newsreader for editorial
 * quotes, Gill Sans caps/labels for the sans voice (Hanken Grotesk on Android),
 * and ONE dark surface: solid #131313 ("the ink fill") used for hero cards, the
 * urge button, and primary pills. Strictly monochrome — reward and state are
 * expressed in the neutral ink scale, never in hue.
 *
 * The surface context (`components/ui/surface.tsx`) is retained — `Card
 * tone="ink"` is the solid #131313 dark card and flips text light automatically.
 *
 * Every screen/primitive reads from this file, so the look is tuned here, in one
 * place. See DESIGN_NOTES.md for the rationale and token inventory.
 */

import { Platform } from 'react-native';
import type { TextStyle } from 'react-native';

type FontWeight = TextStyle['fontWeight'];

/**
 * Paper/ink palette. NOTE a few semantic colours carry invariants:
 *  - `event.lapse` is a warm clay, deliberately NOT red/alarming (invariant #2 —
 *    a lapse is data, not failure).
 *  - No hue accents anywhere: the "accent" IS the ink fill (#131313).
 */
export const colors = {
  // Surfaces — warm paper field with flat, solid white cards.
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
  textMuted: '#55534E',
  textSoft: '#8B8882',
  textSofter: '#B4B1AB',
  textInverse: '#F5F4F1',

  // Lines — faint black hairlines on paper; `ring` is the empty-state circle.
  border: 'rgba(0,0,0,0.09)',
  borderStrong: 'rgba(0,0,0,0.14)',
  hairline: 'rgba(0,0,0,0.06)',
  ring: '#B9B6AF',

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
  // (week rings, check-in, analytics). Light → deep ink, no hue.
  moodTones: ['#C9C6BE', '#AFACA3', '#918E85', '#6B6960', '#33312D'] as const,

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

// The canvas card recipe: radius 18 for list/plain cards, 20 for feature/dark.
export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 20,
  pill: 999,
} as const;

/**
 * Fonts — three voices:
 *  - **serif** (display identity): EB Garamond — "Day XXIV", screen titles, dark
 *    card headlines. Static weights loaded via @expo-google-fonts/eb-garamond.
 *  - **serifSharp** (editorial quotes/maxims): Newsreader — the home quote.
 *  - **sans** (body/caps/labels): Gill Sans on iOS (a real family, so
 *    `fontWeight` works), Hanken Grotesk static weights on Android (closest
 *    loaded voice), a CSS stack on web.
 *
 * Use `sans(weight)` to get a correct {fontFamily, fontWeight} pair per
 * platform; the `fonts.*` aliases remain for existing call-sites.
 */
const SANS_WEB_STACK = "'Gill Sans', 'Gill Sans MT', 'Gill Sans Nova', 'Trebuchet MS', Calibri, sans-serif";

export const sansFamily: Record<string, string> = Platform.select({
  ios: {
    '300': 'Gill Sans',
    '400': 'Gill Sans',
    '500': 'Gill Sans',
    '600': 'Gill Sans',
    '700': 'Gill Sans',
    '800': 'Gill Sans',
    '900': 'Gill Sans',
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
    '300': 'HankenGrotesk_300Light',
    '400': 'HankenGrotesk_400Regular',
    '500': 'HankenGrotesk_500Medium',
    '600': 'HankenGrotesk_600SemiBold',
    '700': 'HankenGrotesk_700Bold',
    '800': 'HankenGrotesk_800ExtraBold',
    '900': 'HankenGrotesk_800ExtraBold',
  },
})!;

/** Android static fonts must NOT also set fontWeight (fake-bolding). */
const SANS_USES_REAL_WEIGHT = Platform.OS === 'ios' || Platform.OS === 'web';

export function sans(w: FontWeight = '400'): TextStyle {
  const key = String(w === 'normal' ? '400' : w === 'bold' ? '700' : w);
  return SANS_USES_REAL_WEIGHT
    ? { fontFamily: sansFamily[key] ?? sansFamily['400'], fontWeight: key as FontWeight }
    : { fontFamily: sansFamily[key] ?? sansFamily['400'] };
}

export const fonts = {
  sans: sansFamily['400'],
  sansMedium: sansFamily['500'],
  sansSemibold: sansFamily['600'],
  sansBold: sansFamily['700'],
  sansExtrabold: sansFamily['800'],

  // EB Garamond — the display identity serif.
  serif: 'EBGaramond_500Medium',
  serifRegular: 'EBGaramond_400Regular',
  serifMedium: 'EBGaramond_500Medium',
  serifSemibold: 'EBGaramond_600SemiBold',
  serifBold: 'EBGaramond_600SemiBold',
  serifItalic: 'EBGaramond_400Regular_Italic',

  // Newsreader — the sharper editorial serif for quotes/maxims.
  serifSharp: 'Newsreader_500Medium',
  serifSharpItalic: 'Newsreader_400Regular_Italic',

  // Semantic aliases used by primitives.
  display: 'EBGaramond_500Medium',
  heading: 'EBGaramond_500Medium',
  body: sansFamily['400'],
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
} as const;

// The canvas type scale — serif display sizes run larger than the old sans scale.
export const fontSize = {
  xs: 12,
  sm: 13.5,
  md: 16,
  lg: 18,
  xl: 21,
  xxl: 24,
  display: 28,
  hero: 37,
} as const;

export const weight: Record<'regular' | 'medium' | 'semibold' | 'bold', FontWeight> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const lineHeight = {
  tight: 1.12,
  snug: 1.3,
  normal: 1.45,
  relaxed: 1.6,
} as const;

/** Card styling reused across primitives (paper tone) — flat, borderless. */
export const card = {
  backgroundColor: colors.surface,
  borderColor: 'transparent',
  borderWidth: 0,
  borderRadius: radius.lg,
} as const;

export const shadow = {
  // Fully flat — the canvas removed all elevation. Kept as no-op tokens so
  // call-sites don't break; separation comes from solid surface tones.
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  ink: {
    shadowColor: '#000000',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
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
