import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { card, colors, shadow, spacing } from '@/lib/theme';

export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Left accent bar colour (e.g. per-event-type tint). */
  accent?: string;
  padded?: boolean;
}

export function Card({ children, style, accent, padded = true }: CardProps) {
  return (
    <View
      style={[
        card,
        shadow.card,
        { backgroundColor: colors.surface },
        padded && { padding: spacing.lg },
        accent ? { borderLeftWidth: 3, borderLeftColor: accent } : null,
        style,
      ]}>
      {children}
    </View>
  );
}
