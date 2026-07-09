import { View } from 'react-native';

import { colors, radius, spacing } from '@/lib/theme';
import { AppText } from './AppText';
import { useOnInk } from './surface';

export function Pill({ label, tint }: { label: string; tint?: string }) {
  const onInk = useOnInk();
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: onInk ? 'rgba(243,240,231,0.08)' : colors.surfaceAlt,
        borderColor: onInk ? colors.inkBorder : colors.border,
        borderWidth: 1,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.md,
        paddingVertical: 5,
      }}>
      <AppText variant="soft" color={tint ?? (onInk ? colors.inkTextMuted : colors.textMuted)}>
        {label}
      </AppText>
    </View>
  );
}
