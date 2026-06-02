/**
 * Tideline design tokens — THE single source of truth for all visual styling.
 *
 * ============================================================================
 *  TODO(jerry): replace every value below with tokens sampled from the
 *  reference screenshots in /design-references/. See DESIGN_NOTES.md for the
 *  token inventory extracted from the references the human provided.
 *
 *  Until that pass happens this file is deliberately NEUTRAL and UNSTYLED:
 *  system font, near-black on white, hairline borders, no brand colour. That
 *  makes it visually obvious what has not been designed yet (per build spec
 *  §0.4). Every screen/primitive reads from here, so restyling is one file.
 * ============================================================================
 */

import type { TextStyle } from 'react-native';

type FontWeight = TextStyle['fontWeight'];

/**
 * Colour palette. NOTE: a few semantic colours carry product invariants:
 *  - `event.lapse` MUST NOT be red / alarming (invariant #2 — a lapse is data,
 *    not failure). It is treated with the same calm tone as any other event.
 *  - status colours are intentionally desaturated greys in placeholder mode.
 */
export const colors = {
  // Surfaces
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F6F6F4',
  overlay: 'rgba(0,0,0,0.35)',

  // Text
  text: '#141414',
  textMuted: '#555555',
  textSoft: '#8A8A8A',
  textSofter: '#B5B5B5',
  textInverse: '#FFFFFF',

  // Lines
  border: '#E4E4E1',
  borderStrong: '#CFCFCB',

  // Accent — neutral near-black placeholder (NO brand colour yet).
  accent: '#141414',
  accentText: '#FFFFFF',
  accentSoft: '#EFEFED',

  // Status (neutral/desaturated until design pass; never use red for lapse)
  positive: '#4A5D4E',
  caution: '#6B5D3E',
  info: '#3E4F6B',
  neutral: '#6E6E6A',

  // Per-event-type tints used by the Log (all calm, none alarming)
  event: {
    urge_rode_out: '#3E4F6B',
    urge_acted_on: '#6E6E6A',
    lapse: '#5A5560', // calm slate — deliberately NOT red (invariant #2)
    win: '#4A5D4E',
    check_in: '#6E6E6A',
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
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

/**
 * Font families. Placeholder = platform system fonts. The references suggest a
 * serif display + sans body pairing (see DESIGN_NOTES.md) — wire real fonts via
 * expo-font in the design pass and only change these four values.
 */
export const fonts = {
  // TODO(jerry): load the display serif from the references via expo-font.
  display: undefined as string | undefined, // undefined => RN default system font
  body: undefined as string | undefined,
  mono: undefined as string | undefined,
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

/** Hairline card styling reused across primitives. */
export const card = {
  backgroundColor: colors.surface,
  borderColor: colors.border,
  borderWidth: 1,
  borderRadius: radius.lg,
} as const;

export const shadow = {
  // Deliberately flat in placeholder mode. TODO(jerry): elevation per references.
  card: {
    shadowColor: '#000',
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
