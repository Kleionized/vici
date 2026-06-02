import { View } from 'react-native';

import { spacing } from '@/lib/theme';
import { AppText } from './AppText';
import { Card } from './Card';

export interface StatProps {
  value: string;
  label: string;
  caption?: string;
}

export function Stat({ value, label, caption }: StatProps) {
  return (
    <Card style={{ flex: 1, minWidth: 130 }}>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="title">{value}</AppText>
        <AppText variant="label">{label}</AppText>
        {caption ? <AppText variant="soft">{caption}</AppText> : null}
      </View>
    </Card>
  );
}
