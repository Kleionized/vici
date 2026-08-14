import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { colors, radius, shadow, spacing } from '@/lib/theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { PressScale } from './press-scale';

/** A small tappable tile — icon in a tinted disc over a label, on a gradient card. */
export function ActionTile({
  icon,
  label,
  tint,
  onPress,
}: {
  icon: IconName;
  label: string;
  tint?: string;
  onPress?: () => void;
}) {
  const t = tint ?? colors.text;
  return (
    <PressScale onPress={onPress} style={{ flex: 1 }} accessibilityRole="button" accessibilityLabel={label}>
        <View style={[shadow.card, { borderRadius: radius.lg, borderCurve: 'continuous', overflow: 'hidden' }]}>
          <LinearGradient
            colors={colors.gradient.surface}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ paddingVertical: spacing.lg, paddingHorizontal: spacing.sm, alignItems: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.pill,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: t + '26',
              }}>
              <Icon name={icon} size={19} color={t} strokeWidth={1.8} />
            </View>
            <AppText center color={colors.text} weightOverride="500" style={{ fontSize: 12.5 }}>
              {label}
            </AppText>
          </LinearGradient>
        </View>
    </PressScale>
  );
}
