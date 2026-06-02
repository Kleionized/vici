import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { spacing } from '@/lib/theme';
import { AppText } from './AppText';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  /** Optional right-aligned action (rendered as tappable text). */
  actionLabel?: string;
  onAction?: () => void;
}

export function Header({ title, subtitle, actionLabel, onAction }: HeaderProps) {
  return (
    <View style={{ gap: spacing.xs, marginBottom: spacing.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
        <AppText variant="display" style={{ flexShrink: 1 }}>
          {title}
        </AppText>
        {actionLabel ? (
          <Pressable onPress={onAction} hitSlop={8}>
            <AppText variant="soft">{actionLabel}</AppText>
          </Pressable>
        ) : null}
      </View>
      {subtitle ? <AppText variant="muted">{subtitle}</AppText> : null}
    </View>
  );
}
