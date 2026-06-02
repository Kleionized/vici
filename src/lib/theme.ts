/**
 * Tideline design tokens — THE single source of truth for all visual styling.
 *
 * Derived from the reference screenshots the human provided (see DESIGN_NOTES.md).
 * Primary direction = the "Imprint"-style onboarding reference: a calm, premium,
 * DARK slate-navy field, serif display headlines, and a sage-green accent. The
 * reference's white note-cards are adapted to dark elevated surfaces here so the
 * whole UI shares one light-on-dark text colour (documented in DESIGN_NOTES.md).
 *
 * Every screen/primitive reads from this file, so the look is tuned here, in one
 * place. Hex values are sampled-by-eye from the references and marked approximate;
 * TODO(jerry): refine against the actual image files + load the exact serif face.
 */

import { Platform } from 'react-native';
import type { TextStyle } from 'react-native';

type FontWeight = TextStyle['fontWeight'];

/**
 * Colour palette. NOTE: a few semantic colours carry product invariants:
 *  - `event.lapse` MUST NOT be red / alarming (invariant #2 — a lapse is data,
 *    not failure). It is treated with the same calm tone as any other event.
 */
export const colors = {
  // Surfaces — dark slate navy field with subtly elevated cards.
  bg: '#222E36',
  surface: '#2B3942',
  surfaceAlt: '#31404A',
  overlay: 'rgba(0,0,0,0.5)',

  // Text — warm off-white on dark.
  text: '#F2F0EA',
  textMuted: '#C3CBCF',
  textSoft: '#939DA3',
  textSofter: '#6E787E',
  textInverse: '#1B2228',

  // Lines — faint light hairlines on dark.
  border: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.22)',

  // Accent — sage green from the reference's emphasis type.
  accent: '#7CB093',
  accentText: '#15201A',
  accentSoft: 'rgba(124,176,147,0.16)',

  // Status (calm, desaturated; never red for a lapse)
  positive: '#7CB093',
  caution: '#D9B36A',
  info: '#7FA8C9',
  neutral: '#9AA4AA',

  // Per-event-type tints used by the Log (all calm, none alarming)
  event: {
    urge_rode_out: '#7FA8C9', // calm blue
    urge_acted_on: '#9AA4AA', // neutral slate
    lapse: '#A99BC0', // soft lavender — deliberately NOT red (invariant #2)
    win: '#7CB093', // sage
    check_in: '#9AA4AA',
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

export const radius = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

/**
 * Font families. Display = a serif (matching the reference's serif headlines),
 * body = the platform sans. TODO(jerry): load the exact reference serif (looks
 * like a Tiempos/Lora-style face) via expo-font and only change `display`.
 */
export const fonts = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  body: undefined as string | undefined, // platform system sans
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
} as const;

export const weight: Record<'regular' | 'medium' | 'semibold' | 'bold', FontWeight> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.45,
  relaxed: 1.6,
} as const;

/** Card styling reused across primitives. */
export const card = {
  backgroundColor: colors.surface,
  borderColor: colors.border,
  borderWidth: 1,
  borderRadius: radius.lg,
} as const;

export const shadow = {
  // Soft lift; barely visible on dark but helps on lighter surfaces.
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
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
