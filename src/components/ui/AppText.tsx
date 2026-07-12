import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { colors, fonts, fontSize, sans } from '@/lib/theme';
import { useOnInk } from './surface';

type Variant = 'hero' | 'display' | 'title' | 'subtitle' | 'body' | 'muted' | 'soft' | 'label' | 'mono';

export interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
  weightOverride?: TextStyle['fontWeight'];
}

const WEIGHT_ALIAS: Record<string, TextStyle['fontWeight']> = { normal: '400', bold: '600' };

// The VICI voice: display sizes (hero/display/title/subtitle) speak in the
// EB Garamond serif at weight 500 — never bold; the serif's own colour does
// the work. Body/labels speak in the sans (Gill Sans / Hanken Grotesk).
// Serif variants are static font files, so they must NOT set fontWeight.
const SERIF_VARIANTS: ReadonlySet<Variant> = new Set(['hero', 'display', 'title', 'subtitle'] as Variant[]);

const SANS_WEIGHT: Record<Variant, TextStyle['fontWeight']> = {
  hero: '500',
  display: '500',
  title: '500',
  subtitle: '500',
  body: '400',
  muted: '400',
  soft: '400',
  label: '600',
  mono: '400',
};

// Per-variant metrics. Serif display runs larger and looser than the old sans
// scale — EB Garamond needs the positive letterspacing (canvas: 0.008em).
const VARIANTS: Record<Variant, TextStyle> = {
  hero: {
    fontFamily: fonts.serif,
    fontSize: fontSize.hero,
    lineHeight: Math.round(fontSize.hero * 1.08),
    letterSpacing: 0.3,
    color: colors.text,
  },
  display: {
    fontFamily: fonts.serif,
    fontSize: fontSize.display,
    lineHeight: Math.round(fontSize.display * 1.12),
    letterSpacing: 0.22,
    color: colors.text,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: fontSize.xxl,
    lineHeight: Math.round(fontSize.xxl * 1.14),
    letterSpacing: 0.12,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.serif,
    fontSize: fontSize.xl,
    lineHeight: Math.round(fontSize.xl * 1.3),
    letterSpacing: 0.1,
    color: colors.text,
  },
  body: {
    fontSize: fontSize.md,
    lineHeight: Math.round(fontSize.md * 1.5),
    letterSpacing: 0.16,
    color: colors.text,
  },
  muted: {
    fontSize: fontSize.md,
    lineHeight: Math.round(fontSize.md * 1.5),
    letterSpacing: 0.16,
    color: colors.textMuted,
  },
  soft: {
    fontSize: fontSize.sm,
    lineHeight: Math.round(fontSize.sm * 1.48),
    letterSpacing: 0.14,
    color: colors.textSoft,
  },
  // The canvas caps pattern: semibold, wide tracking, uppercase, ink.
  label: {
    fontSize: fontSize.xs,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textSoft,
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
};

// On the ink (#131313) surface, swap the default colour per variant (explicit
// `color` still wins) — the light-paper-on-ink treatment.
const INK_COLOR: Record<Variant, string> = {
  hero: colors.inkText,
  display: colors.inkText,
  title: colors.inkText,
  subtitle: colors.inkText,
  body: colors.inkText,
  muted: colors.inkTextMuted,
  soft: colors.inkTextSoft,
  label: colors.inkTextMuted,
  mono: colors.inkTextMuted,
};

// Map a requested weight onto the serif's loaded faces (400/500/600 only).
function serifFamily(w: TextStyle['fontWeight'] | undefined): string {
  const n = Number(w ?? '500');
  if (n >= 600) return fonts.serifSemibold;
  if (n >= 500) return fonts.serifMedium;
  return fonts.serifRegular;
}

export function AppText({ variant = 'body', color, center, weightOverride, style, ...rest }: AppTextProps) {
  const onInk = useOnInk();
  const w: TextStyle['fontWeight'] | undefined =
    weightOverride != null
      ? (WEIGHT_ALIAS[String(weightOverride)] ?? (String(weightOverride) as TextStyle['fontWeight']))
      : undefined;

  let fontStyle: TextStyle;
  if (variant === 'mono') {
    fontStyle = w ? { fontWeight: w } : {};
  } else if (SERIF_VARIANTS.has(variant)) {
    // Static serif files — pick the face, never set fontWeight.
    fontStyle = { fontFamily: serifFamily(w) };
  } else {
    fontStyle = sans(w ?? SANS_WEIGHT[variant]);
  }

  // Callers often override fontSize without overriding the variant's
  // lineHeight — the inherited small line box clips ascenders on iOS.
  // Flatten and repair: a line box always fits its own glyphs.
  const merged = StyleSheet.flatten([
    VARIANTS[variant],
    fontStyle,
    onInk ? { color: INK_COLOR[variant] } : null,
    center && { textAlign: 'center' },
    color ? { color } : null,
    style,
  ]) as TextStyle;
  if (merged.fontSize && merged.lineHeight && merged.lineHeight < merged.fontSize * 1.18) {
    merged.lineHeight = Math.round(merged.fontSize * 1.22);
  }

  return <Text style={merged} {...rest} />;
}
