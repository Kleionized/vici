import { View } from 'react-native';

import { colors, radius, spacing } from '@/lib/theme';
import type { IndicatorPoint } from '@/lib/types';
import { AppText } from './AppText';

export interface MiniBarsProps {
  points: IndicatorPoint[];
  /** Value mapped to a full-height bar. */
  max: number;
  height?: number;
}

export function MiniBars({ points, max, height = 64 }: MiniBarsProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, height }}>
      {points.map((p, i) => {
        const hasValue = p.value != null;
        const ratio = hasValue ? Math.max(0.06, Math.min(1, (p.value as number) / max)) : 0;
        const label = p.date.slice(8); // DD
        return (
          <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
              {hasValue ? (
                <View
                  style={{
                    height: `${ratio * 100}%`,
                    backgroundColor: colors.accent,
                    borderRadius: radius.sm,
                  }}
                />
              ) : (
                <View style={{ height: 4, backgroundColor: colors.border, borderRadius: radius.pill }} />
              )}
            </View>
            <AppText variant="soft" style={{ fontSize: 10 }}>
              {label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}
