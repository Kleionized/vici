import { Switch, View } from 'react-native';

import { colors, spacing } from '@/lib/theme';
import { AppText } from './AppText';

export interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export function ToggleRow({ label, description, value, onValueChange }: ToggleRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.lg,
        paddingVertical: spacing.sm,
      }}>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText>{label}</AppText>
        {description ? <AppText variant="soft">{description}</AppText> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.accent, false: colors.borderStrong }}
        thumbColor={colors.surface}
      />
    </View>
  );
}
