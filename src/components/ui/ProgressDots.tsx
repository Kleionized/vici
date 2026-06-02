import { View } from 'react-native';

import { colors, radius } from '@/lib/theme';

export function ProgressDots({ total, index }: { total: number; index: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            height: 6,
            borderRadius: radius.pill,
            width: i === index ? 22 : 6,
            backgroundColor: i <= index ? colors.accent : colors.border,
          }}
        />
      ))}
    </View>
  );
}
