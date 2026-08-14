import { View } from 'react-native';

import { colors, radius, shadow, spacing, weight } from '@/lib/theme';
import { AppText } from './AppText';
import { PressScale } from './press-scale';

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
          <PressScale
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
              borderCurve: 'continuous',
              backgroundColor: selected ? colors.surface : colors.surfaceAlt,
              ...(selected ? { boxShadow: '0 0 0 2px #131313, 0 5px 14px rgba(34,30,24,0.07)' } : shadow.control),
            }}>
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: radius.pill,
                borderWidth: selected ? 0 : 2,
                borderColor: colors.borderStrong,
                backgroundColor: selected ? colors.accent : 'transparent',
              }}
            />
            <AppText weightOverride={selected ? weight.semibold : weight.regular}>{opt}</AppText>
          </PressScale>
        );
      })}
    </View>
  );
}
