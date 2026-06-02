import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, fonts, fontSize, lineHeight, weight } from '@/lib/theme';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'muted' | 'soft' | 'label' | 'mono';

export interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
  weightOverride?: TextStyle['fontWeight'];
}

const VARIANTS: Record<Variant, TextStyle> = {
  display: {
    fontFamily: fonts.display,
    fontSize: fontSize.display,
    fontWeight: weight.bold,
    lineHeight: fontSize.display * lineHeight.tight,
    color: colors.text,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
    fontWeight: weight.bold,
    lineHeight: fontSize.xxl * lineHeight.tight,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.xl,
    fontWeight: weight.semibold,
    lineHeight: fontSize.xl * lineHeight.normal,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    fontWeight: weight.regular,
    lineHeight: fontSize.md * lineHeight.relaxed,
    color: colors.text,
  },
  muted: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    fontWeight: weight.regular,
    lineHeight: fontSize.md * lineHeight.relaxed,
    color: colors.textMuted,
  },
  soft: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    fontWeight: weight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
    color: colors.textSoft,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
    fontWeight: weight.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textSoft,
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
};

export function AppText({ variant = 'body', color, center, weightOverride, style, ...rest }: AppTextProps) {
  return (
    <Text
      style={[
        VARIANTS[variant],
        center && { textAlign: 'center' },
        color ? { color } : null,
        weightOverride ? { fontWeight: weightOverride } : null,
        style,
      ]}
      {...rest}
    />
  );
}
