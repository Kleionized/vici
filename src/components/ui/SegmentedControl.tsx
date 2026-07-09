import { Pressable, View } from 'react-native';

import { colors, radius, spacing, weight } from '@/lib/theme';
import { AppText } from './AppText';

export interface SegmentOption<T extends string> {
  key: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (key: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.pill,
        padding: 4,
        gap: 4,
      }}>
      {options.map((opt) => {
        const selected = value === opt.key;
        return (
          <Pressable
            key={opt.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(opt.key)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: spacing.sm,
              borderRadius: radius.pill,
              backgroundColor: selected ? colors.surfaceAlt : 'transparent',
              borderWidth: selected ? 1 : 0,
              borderColor: colors.borderStrong,
            }}>
            <AppText
              variant="soft"
              color={selected ? colors.text : colors.textSoft}
              weightOverride={selected ? weight.semibold : weight.regular}>
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
