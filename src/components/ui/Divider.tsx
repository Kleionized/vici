import { View } from 'react-native';

import { colors, spacing } from '@/lib/theme';

export function Divider({ spacingY = spacing.lg }: { spacingY?: number }) {
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacingY }} />;
}
