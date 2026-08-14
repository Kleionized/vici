import type { ReactNode } from 'react';
import { View } from 'react-native';

import { colors, spacing } from '@/lib/theme';
import { AppText } from './AppText';
import { PressScale } from './press-scale';

export interface HeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  /** Optional right-aligned action (rendered as tappable text). */
  actionLabel?: string;
  onAction?: () => void;
  /** Optional custom right-aligned element (overrides actionLabel). */
  right?: ReactNode;
}

export function Header({ title, eyebrow, subtitle, actionLabel, onAction, right }: HeaderProps) {
  return (
    <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md }}>
        <View style={{ gap: spacing.xs, flexShrink: 1 }}>
          {eyebrow ? <AppText variant="label">{eyebrow}</AppText> : null}
          <AppText variant="display" style={{ flexShrink: 1 }}>
            {title}
          </AppText>
        </View>
        {right ? (
          <View style={{ paddingTop: spacing.xs }}>{right}</View>
        ) : actionLabel ? (
          <PressScale onPress={onAction} accessibilityRole="button" style={{ minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' }}>
            <AppText variant="soft" color={colors.textMuted}>{actionLabel}</AppText>
          </PressScale>
        ) : null}
      </View>
      {subtitle ? <AppText variant="muted">{subtitle}</AppText> : null}
    </View>
  );
}
