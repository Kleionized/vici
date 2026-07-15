import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, fonts, sans, spacing } from '@/lib/theme';
import { AppText } from './AppText';

/**
 * The canvas screen header: a tiny neutral uppercase eyebrow, an EB Garamond
 * serif title, and an optional muted sans subtitle. No colour washes, no
 * tinted pills — every screen stays on the one calm ink-toned system (`hue`
 * is still accepted for call-site compatibility but ignored).
 */
export function BackChevron({ onPress, color = colors.text }: { onPress: () => void; color?: string }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} accessibilityLabel="Back" style={{ padding: 4, marginLeft: -4 }}>
      <Svg width={12} height={20} viewBox="0 0 13 22">
        <Path d="M11 2L2 11l9 9" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

export function ScreenHeader({
  title,
  sub,
  hue: _hue,
  onBack,
  trailing,
  pad = spacing.xl,
}: {
  title: string;
  sub?: string;
  hue?: number;
  onBack?: () => void;
  trailing?: ReactNode;
  pad?: number;
}) {
  return (
    <View style={{ position: 'relative', paddingHorizontal: pad, marginBottom: spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 30, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 }}>
          {onBack ? <BackChevron onPress={onBack} /> : null}
        </View>
        {trailing ?? null}
      </View>

      <AppText color={colors.text} style={{ fontFamily: fonts.serif, fontSize: 28, letterSpacing: 0.22, lineHeight: 32 }}>
        {title}
      </AppText>
      {sub ? (
        <AppText variant="muted" style={{ fontSize: 13.5, lineHeight: 20, letterSpacing: 0.14, marginTop: 12 }}>
          {sub}
        </AppText>
      ) : null}
    </View>
  );
}
