import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, sans, spacing } from '@/lib/theme';
import { AppText } from './AppText';

/**
 * The canvas screen header: a tiny neutral uppercase eyebrow, a native
 * semibold title, and an optional muted subtitle. No colour washes, no
 * tinted pills — every screen stays on the one calm ink-toned system (`hue`
 * is still accepted for call-site compatibility but ignored).
 */
/**
 * The back affordance is a labelled chevron everywhere in the latest UI —
 * a bare arrow only appears over artwork, where the label would be unreadable.
 */
export function BackChevron({ onPress, color = colors.textMuted, label = 'Back' }: { onPress: () => void; color?: string; label?: string | null }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityLabel={label ?? 'Back'}
      accessibilityRole="button"
      style={{ minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 4 }}>
      <Svg width={11} height={19} viewBox="0 0 11 19">
        <Path d="M9.5 1.5L2 9.5l7.5 8" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      {label ? <AppText style={[sans('400'), { fontSize: 17, color }]}>{label}</AppText> : null}
    </Pressable>
  );
}

export function ScreenHeader({
  title,
  eyebrow,
  sub,
  hue: _hue,
  onBack,
  trailing,
  pad = spacing.lg,
}: {
  title: string;
  eyebrow?: string;
  sub?: string;
  hue?: number;
  onBack?: () => void;
  trailing?: ReactNode;
  pad?: number;
}) {
  return (
    <View style={{ position: 'relative', paddingHorizontal: pad, marginBottom: 20 }}>
      {onBack || trailing ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 30, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 }}>
            {onBack ? <BackChevron onPress={onBack} /> : null}
          </View>
          {trailing ?? null}
        </View>
      ) : null}

      {eyebrow ? <AppText variant="label" style={{ marginBottom: 6 }}>{eyebrow}</AppText> : null}
      <AppText color={colors.text} style={[sans('600'), { fontSize: 27, letterSpacing: -0.4, lineHeight: 33 }]}>
        {title}
      </AppText>
      {sub ? (
        <AppText variant="muted" style={{ fontSize: 13.5, lineHeight: 20, letterSpacing: 0.14, marginTop: 10 }}>
          {sub}
        </AppText>
      ) : null}
    </View>
  );
}
