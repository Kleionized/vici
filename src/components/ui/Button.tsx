import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing, weight } from '@/lib/theme';
import { AppText } from './AppText';
import { useOnInk } from './surface';

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
  const onInk = useOnInk();
  const inactive = disabled || loading;

  // Resolve background / border / label colour for the (variant × surface) pair.
  // On ink, the primary action inverts to a light pill with dark text — the
  // Stoic "white pill on black" treatment.
  let bg: string = 'transparent';
  let labelColor: string = onInk ? colors.inkText : colors.text;
  let borderColor: string = 'transparent';
  let borderWidth = 0;

  if (variant === 'primary') {
    bg = onInk ? colors.inkText : colors.accent;
    labelColor = onInk ? colors.ink : colors.accentText;
  } else if (variant === 'secondary') {
    borderWidth = 1;
    borderColor = onInk ? colors.inkBorder : colors.borderStrong;
    labelColor = onInk ? colors.inkText : colors.text;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
          borderWidth,
          borderColor,
          opacity: inactive ? 0.4 : pressed ? 0.85 : 1,
        },
        fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <View>
          {/* iOS-spec primary action: 17pt semibold with tight optical tracking. */}
          <AppText color={labelColor} weightOverride={weight.medium} style={{ fontSize: 17, letterSpacing: -0.24 }}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}
