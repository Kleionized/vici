import { Platform, Text, type TextProps, type TextStyle } from 'react-native';

import { type as T } from '@/lib/theme';

export type TextVariant = keyof typeof T;
/** CSS `text-wrap` / `white-space` as the frame states it, per run. */
export type Wrap = 'balance' | 'pretty' | 'wrap' | 'nowrap';

/**
 * The frames' run-level wrapping. RN-web forwards the style key to CSS, so the
 * browser balances the same lines the canvas does; native has no equivalent
 * and wraps greedily — fixed copy that breaks differently there carries an
 * explicit `\n` at the call site (BRIEF §6). `nowrap` is `white-space` on web
 * and, on native, nothing: never `numberOfLines`, which truncates where the
 * canvas overflows.
 */
function wrapStyle(wrap: Wrap | undefined): TextStyle | null {
  if (!wrap || Platform.OS !== 'web') return null;
  if (wrap === 'nowrap') return { whiteSpace: 'nowrap' } as unknown as TextStyle;
  return { textWrap: wrap } as unknown as TextStyle;
}

/** The default wrap each named style carries in the frames. */
const DEFAULT_WRAP: Partial<Record<TextVariant, Wrap>> = {
  h1: 'balance',
  h1Sheet: 'balance',
  h1SheetLg: 'balance',
  title: 'balance',
  titlePage: 'balance',
  titleCover: 'balance',
  greeting: 'nowrap',
  lessonHeading: 'balance',
  lessonBody: 'pretty',
  lessonCaps: 'balance',
  lessonOption: 'pretty',
  lessonDoneWhen: 'pretty',
  p: 'pretty',
  pTight: 'pretty',
  caps: 'nowrap',
  primaryLabel: 'nowrap',
  optionLabel: 'nowrap',
  gridLabel: 'nowrap',
  rowLabel: 'nowrap',
  rowValue: 'nowrap',
  pill: 'nowrap',
  navTitle: 'nowrap',
  statValue: 'nowrap',
};

export interface MonoTextProps extends TextProps {
  v?: TextVariant;
  color?: string;
  center?: boolean;
  wrap?: Wrap;
}

/**
 * Text in one of the canvas's named styles (theme `type`). The style carries
 * the family (weight is a family — `sans()`), size, explicit line box, tracking
 * and default colour; `color`, `center` and `wrap` are the per-frame overrides.
 *
 * Font scaling is capped at 1.3× by default: every frame is laid out for 852
 * points and unbounded Dynamic Type runs text through pills and rows. Body copy
 * that sits in a scroll region may lift the cap.
 */
export function MonoText({ v = 'p', color, center, wrap, style, maxFontSizeMultiplier = 1.3, ...rest }: MonoTextProps) {
  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
      style={[T[v], wrapStyle(wrap ?? DEFAULT_WRAP[v]), center ? { textAlign: 'center' } : null, color ? { color } : null, style]}
    />
  );
}

export const H1 = (p: Omit<MonoTextProps, 'v'>) => <MonoText v="h1" {...p} />;
export const Title = (p: Omit<MonoTextProps, 'v'>) => <MonoText v="title" center {...p} />;
export const P = (p: Omit<MonoTextProps, 'v'>) => <MonoText v="p" {...p} />;
export const Caps = (p: Omit<MonoTextProps, 'v'>) => <MonoText v="caps" {...p} />;
