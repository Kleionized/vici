import { Pressable, View } from 'react-native';

import { colors, radius, spacing, weight } from '@/lib/theme';
import { AppText } from './AppText';

export interface ChoiceInputProps {
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}

export function ChoiceInput({ options, value, onChange }: ChoiceInputProps) {
  return (
    <View style={{ gap: spacing.sm }}>
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <Pressable
            key={opt}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(opt)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              borderRadius: radius.md,
              backgroundColor: selected ? colors.accentSoft : colors.surfaceAlt,
              borderWidth: 1,
              borderColor: selected ? colors.borderStrong : colors.border,
            }}>
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: radius.pill,
                borderWidth: 2,
                borderColor: selected ? colors.accent : colors.borderStrong,
                backgroundColor: selected ? colors.accent : 'transparent',
              }}
            />
            <AppText weightOverride={selected ? weight.semibold : weight.regular}>{opt}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
