import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, sans, spacing } from '@/lib/theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { useOnInk } from './surface';

/**
 * The canvas section label — caps OUTSIDE the card, semibold, wide tracking,
 * full-ink (the home screen's "TODAY'S STEPS" pattern), with an optional muted
 * right-side meta ("2 of 4", "Analytics ›").
 */
export function SectionLabel({
  children,
  icon,
  size,
  color,
  right,
  style,
}: {
  children: ReactNode;
  icon?: IconName;
  size?: number;
  color?: string;
  /** Muted right-aligned meta, baseline-aligned with the caps. */
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const onInk = useOnInk();
  const capsColor = color ?? (onInk ? colors.inkText : colors.text);
  const caps = (
    <AppText
      color={capsColor}
      style={[sans('600'), { fontSize: size ?? 13, lineHeight: 20, letterSpacing: 2.3, textTransform: 'uppercase' }]}>
      {children}
    </AppText>
  );

  return (
    <View
      style={[
        {
          marginBottom: spacing.md,
          paddingHorizontal: 4,
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: right != null ? 'space-between' : 'flex-start',
          gap: spacing.sm,
        },
        style,
      ]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        {icon ? <Icon name={icon} size={15} color={capsColor} strokeWidth={1.8} /> : null}
        {caps}
      </View>
      {right != null ? (
        typeof right === 'string' || typeof right === 'number' ? (
          <AppText
            color={onInk ? colors.inkTextMuted : colors.textSoft}
            style={[sans('500'), { fontSize: 13.5, lineHeight: 20, letterSpacing: 0.14, fontVariant: ['tabular-nums'] }]}>
            {right}
          </AppText>
        ) : (
          right
        )
      ) : null}
    </View>
  );
}
