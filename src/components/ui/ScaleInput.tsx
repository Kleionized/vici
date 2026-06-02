import { Pressable, View } from 'react-native';

import { colors, radius, spacing, weight } from '@/lib/theme';
import { AppText } from './AppText';

export interface ScaleInputProps {
  min?: number;
  max?: number;
  value: number | null;
  onChange: (v: number) => void;
  leftLabel?: string;
  rightLabel?: string;
}

export function ScaleInput({ min = 1, max = 5, value, onChange, leftLabel, rightLabel }: ScaleInputProps) {
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {items.map((n) => {
          const selected = value === n;
          return (
            <Pressable
              key={n}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(n)}
              style={{
                minWidth: 44,
                height: 44,
                paddingHorizontal: spacing.sm,
                borderRadius: radius.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selected ? colors.accent : colors.surfaceAlt,
                borderWidth: 1,
                borderColor: selected ? colors.accent : colors.border,
              }}>
              <AppText color={selected ? colors.accentText : colors.text} weightOverride={weight.semibold}>
                {String(n)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {leftLabel || rightLabel ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="soft">{leftLabel ?? ''}</AppText>
          <AppText variant="soft">{rightLabel ?? ''}</AppText>
        </View>
      ) : null}
    </View>
  );
}
