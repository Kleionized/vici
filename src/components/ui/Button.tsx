import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing, weight } from '@/lib/theme';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const inactive = disabled || loading;

  const bg = isPrimary ? colors.accent : 'transparent';
  const labelColor = isPrimary ? colors.accentText : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: spacing.md + 2,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
          borderWidth: isSecondary ? 1 : 0,
          borderColor: colors.borderStrong,
          opacity: inactive ? 0.45 : pressed ? 0.85 : 1,
        },
        fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <View>
          <AppText color={labelColor} weightOverride={weight.semibold}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}
