import { Platform, StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

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

const SANS_WEIGHT: Record<Variant, TextStyle['fontWeight']> = {
  hero: '600',
  display: '600',
  title: '600',
  subtitle: '500',
  body: '400',
  muted: '400',
  soft: '400',
  label: '600',
  mono: '400',
};

// Per-variant metrics from the latest native-system UI.
const VARIANTS: Record<Variant, TextStyle> = {
  hero: {
    fontSize: fontSize.hero,
    lineHeight: 40,
    letterSpacing: -0.65,
    color: colors.text,
  },
  display: {
    fontSize: fontSize.display,
    lineHeight: 33,
    letterSpacing: -0.4,
    color: colors.text,
  },
  title: {
    fontSize: fontSize.xxl,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.xl,
    lineHeight: 25,
    letterSpacing: -0.1,
    color: colors.text,
  },
  body: {
    fontSize: fontSize.md,
    lineHeight: Math.round(fontSize.md * 1.5),
    letterSpacing: -0.1,
    color: colors.text,
  },
  muted: {
    fontSize: fontSize.md,
    lineHeight: Math.round(fontSize.md * 1.5),
    letterSpacing: -0.05,
    color: colors.textMuted,
  },
  soft: {
    fontSize: fontSize.sm,
    lineHeight: Math.round(fontSize.sm * 1.48),
    letterSpacing: 0,
    color: colors.textSoft,
  },
  // The canvas caps pattern: semibold, wide tracking, uppercase, muted ink.
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

export function AppText({ variant = 'body', color, center, weightOverride, style, ...rest }: AppTextProps) {
  const onInk = useOnInk();
  const w: TextStyle['fontWeight'] | undefined =
    weightOverride != null
      ? (WEIGHT_ALIAS[String(weightOverride)] ?? (String(weightOverride) as TextStyle['fontWeight']))
      : undefined;

  const fontStyle: TextStyle = variant === 'mono' ? (w ? { fontWeight: w } : {}) : sans(w ?? SANS_WEIGHT[variant]);

  // A variant's leading and tracking are tuned to the variant's own fontSize.
  // The moment a caller names a different size, both inherited metrics belong
  // to a size that is no longer on screen: the line box shifts the glyphs
  // inside it, and the optical tracking silently narrows every run. The canvas
  // states leading and tracking only where it wants them, so a caller that
  // names its own size and stays silent about the rest gets the platform's
  // natural line box and no tracking — which is what the canvas measures.
  const own = StyleSheet.flatten(style) as TextStyle | undefined;
  const ownSize = own?.fontSize != null;
  const dropLeading = ownSize && own?.lineHeight == null;
  const dropTracking = ownSize && own?.letterSpacing == null;

  const merged = StyleSheet.flatten([
    VARIANTS[variant],
    fontStyle,
    Platform.OS === 'web'
      ? ({
          WebkitFontSmoothing: 'antialiased',
          textWrap: variant === 'hero' || variant === 'display' || variant === 'title' ? 'balance' : 'pretty',
        } as unknown as TextStyle)
      : null,
    onInk ? { color: INK_COLOR[variant] } : null,
    center && { textAlign: 'center' },
    color ? { color } : null,
    style,
  ]) as TextStyle;
  // The caps `label` treatment is an identity, not an optical correction, so
  // its wide tracking survives a size override.
  if (dropTracking && variant !== 'label') delete merged.letterSpacing;
  if (dropLeading) delete merged.lineHeight;
  // A caller that names its own leading means it — only repair the inherited
  // variant metric, never an explicit one.
  else if (own?.lineHeight == null && merged.fontSize && merged.lineHeight && merged.lineHeight < merged.fontSize * 1.18) {
    merged.lineHeight = Math.round(merged.fontSize * 1.22);
  }

  return <Text style={merged} {...rest} />;
}
