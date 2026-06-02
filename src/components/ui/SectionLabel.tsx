import { View } from 'react-native';

import { spacing } from '@/lib/theme';
import { AppText } from './AppText';

export function SectionLabel({ children, style }: { children: string; style?: object }) {
  return (
    <View style={[{ marginBottom: spacing.sm }, style]}>
      <AppText variant="label">{children}</AppText>
    </View>
  );
}
