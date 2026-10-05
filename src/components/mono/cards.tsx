import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { lhNormal, mono, ring, sans } from '@/lib/theme';

import { Tap } from './Tap';
import { MonoText } from './Text';

/** CSS `padding` shorthand: one value, `[vertical, horizontal]`, `[top, horizontal, bottom]` or `[top, right, bottom, left]`. */
export type CardPadding = number | [number, number] | [number, number, number] | [number, number, number, number];

function padding(p: CardPadding): ViewStyle {
  const [t, r, b, l] =
    typeof p === 'number' ? [p, p, p, p] : p.length === 2 ? [p[0], p[1], p[0], p[1]] : p.length === 3 ? [p[0], p[1], p[2], p[1]] : p;
  return { paddingTop: t, paddingRight: r, paddingBottom: b, paddingLeft: l };
}

/**
 * The card shapes the frames draw (design-system §7.13):
 *
 * | variant | box | where |
 * | --- | --- | --- |
 * | `filled` | r24 `#1E1E1E`, padding 22 22 | pledge cards, Manage Subscription plan, Morning Task Check, Your Vow Page (26 26 24), SOS Challenge, Score Detail … |
 * | `outline` | r22 `#1E1E1E` + line ring, padding 20 18 18 | Paywall's unselected plan |
 * | `selected` | r22 ink, padding 20 18 18 | Paywall's selected plan (contents switch to `#111111`) |
 * | `tile` | height 150, r24 `#1E1E1E`, padding 18, column, space-between | Today Home II / Task tiles |
 *
 * The frames' filled cards use several paddings (`22 22 24`, `22 22 20`, `24 24
 * 20`, `26 28 30`, `26 26 24`, `20 22`, `18 20`, `16 20 18`): pass the frame's
 * own as `padding`, in CSS order. `overflow` is left visible — only the row
 * groups and the letter clip, and they say so.
 */
export type CardVariant = 'filled' | 'outline' | 'selected' | 'tile';

const CARD: Record<CardVariant, { radius: number; padding: CardPadding; bg: string; ring?: string; extra?: ViewStyle }> = {
  filled: { radius: 24, padding: [22, 22], bg: mono.card },
  outline: { radius: 22, padding: [20, 18, 18], bg: mono.card, ring: ring.outline },
  selected: { radius: 22, padding: [20, 18, 18], bg: mono.ink },
  tile: { radius: 24, padding: 18, bg: mono.card, extra: { height: 150, justifyContent: 'space-between' } },
};

export function Card({
  variant = 'filled',
  padding: pad,
  radius,
  children,
  onPress,
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
  style,
}: {
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: number;
  children?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'radio' | 'checkbox';
  accessibilityState?: { checked?: boolean; selected?: boolean; disabled?: boolean };
  style?: StyleProp<ViewStyle>;
}) {
  const c = CARD[variant];
  const box: StyleProp<ViewStyle> = [
    { borderRadius: radius ?? c.radius, backgroundColor: c.bg, boxShadow: c.ring },
    padding(pad ?? c.padding),
    c.extra,
    style,
  ];
  if (onPress) {
    return (
      <Tap
        onPress={onPress}
        label={accessibilityLabel}
        // `Tap` spreads its props over its own `button` default, so an explicit
        // `undefined` would erase the role (no button on web or to VoiceOver)
        accessibilityRole={accessibilityRole ?? 'button'}
        aria-checked={accessibilityState?.checked}
        aria-selected={accessibilityState?.selected}
        aria-disabled={accessibilityState?.disabled}
        style={box}>
        {children}
      </Tap>
    );
  }
  return (
    <View accessibilityLabel={accessibilityLabel} style={box}>
      {children}
    </View>
  );
}

/**
 * The icon list card (Your Plan): `r18 #1E1E1E, padding 16 18, gap 16`, a 42
 * ink disc holding a 20 glyph (drawn in `#111111`), then a column `gap 2` of the
 * title 16/700 ink nowrap and the line under it 13/400 mute.
 */
export function IconCard({
  icon,
  title,
  sub,
  onPress,
  style,
}: {
  icon: ReactNode;
  title: string;
  sub?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const box: StyleProp<ViewStyle> = [
    { borderRadius: 18, backgroundColor: mono.card, paddingVertical: 16, paddingHorizontal: 18, gap: 16, flexDirection: 'row', alignItems: 'center' },
    style,
  ];
  const body = (
    <>
      <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <MonoText v="gridLabel">{title}</MonoText>
        {sub ? (
          <MonoText v="caps" wrap="wrap" style={{ ...sans('400'), fontSize: 13, lineHeight: lhNormal(13) }}>
            {sub}
          </MonoText>
        ) : null}
      </View>
    </>
  );
  return onPress ? (
    <Tap onPress={onPress} style={box}>
      {body}
    </Tap>
  ) : (
    <View style={box}>{body}</View>
  );
}
