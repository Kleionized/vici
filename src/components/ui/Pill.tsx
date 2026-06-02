import { View } from 'react-native';

import { colors, radius, spacing } from '@/lib/theme';
import { AppText } from './AppText';

export function Pill({ label, tint }: { label: string; tint?: string }) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: colors.surfaceAlt,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
      }}>
      <AppText variant="soft" color={tint ?? colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}
