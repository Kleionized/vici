import { useState } from 'react';
import { Platform, Text, type NativeSyntheticEvent, type TextLayoutEventData, type TextProps, type TextStyle } from 'react-native';

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

/**
 * The copy with its last two words tied (a no-break space), when the last
 * space sits on the last line of the copy — never across an explicit `\n`.
 */
function tieLast(s: string): string | null {
  const i = s.lastIndexOf(' ');
  if (i <= 0 || i === s.length - 1 || s.indexOf('\n', i) !== -1) return null;
  return `${s.slice(0, i)} ${s.slice(i + 1)}`;
}

/**
 * Whether a laid-out run ends on one word that can be pulled down as `pretty`
 * would: the last line holds a single word; the line before can give its last
 * word and still keep two words and half the run's width (else the tie only
 * moves the gap up — "positive, / on average" — and `pretty` leaves it too);
 * and the pair fits the widest line drawn, so tying can never force a word to
 * break inside itself in a narrow cell.
 */
function lonelyLast(lines: TextLayoutEventData['lines']): boolean {
  if (lines.length < 2) return false;
  const last = lines[lines.length - 1];
  const prev = lines[lines.length - 2];
  const lastText = last.text.trim();
  const prevText = prev.text.trim();
  if (!lastText || /\s/.test(lastText)) return false;
  const words = prevText.split(/\s+/);
  if (words.length < 3) return false;
  const word = words[words.length - 1];
  const perChar = prev.width / Math.max(1, prevText.length);
  const given = perChar * (word.length + 1);
  const widest = Math.max(...lines.map((l) => l.width));
  return last.width + given <= widest - 1 && prev.width - given >= widest / 2;
}

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
 *
 * Native has no `text-wrap`, and greedy wrapping leaves a lone last word where
 * the web's `pretty` / `balance` never does ("…change one awkward / detail.").
 * So on native a `pretty` or `balance` run that lays out ending on one word is
 * drawn again with its last two words tied — `pretty`'s own orphan rule, the
 * one part of it greedy wrapping can be told (D407). Web is untouched.
 */
export function MonoText({ v = 'p', color, center, wrap, style, maxFontSizeMultiplier = 1.3, children, onTextLayout, ...rest }: MonoTextProps) {
  const w = wrap ?? DEFAULT_WRAP[v];
  const settle = Platform.OS !== 'web' && (w === 'pretty' || w === 'balance') && typeof children === 'string';
  // the copy the tie was decided for: a new string lays out afresh
  const [tiedFor, setTiedFor] = useState<string | null>(null);
  const tied = settle && tiedFor === children ? tieLast(children as string) : null;
  const layout = settle
    ? (e: NativeSyntheticEvent<TextLayoutEventData>) => {
        if (tiedFor !== children && lonelyLast(e.nativeEvent.lines) && tieLast(children as string)) setTiedFor(children as string);
        onTextLayout?.(e);
      }
    : onTextLayout;
  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
      onTextLayout={layout}
      style={[T[v], wrapStyle(w), center ? { textAlign: 'center' } : null, color ? { color } : null, style]}>
      {tied ?? children}
    </Text>
  );
}

export const H1 = (p: Omit<MonoTextProps, 'v'>) => <MonoText v="h1" {...p} />;
export const Title = (p: Omit<MonoTextProps, 'v'>) => <MonoText v="title" center {...p} />;
export const P = (p: Omit<MonoTextProps, 'v'>) => <MonoText v="p" {...p} />;
export const Caps = (p: Omit<MonoTextProps, 'v'>) => <MonoText v="caps" {...p} />;
