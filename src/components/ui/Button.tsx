import { ActivityIndicator, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadow, weight } from '@/lib/theme';
import { AppText } from './AppText';
import { PressScale } from './press-scale';
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
  /** Disable tactile scaling for controls where motion would distract. */
  static?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  static: isStatic = false,
}: ButtonProps) {
  const onInk = useOnInk();
  const inactive = disabled || loading;

  // Resolve background / border / label colour for the (variant × surface) pair.
  // On ink, the primary action inverts to a light pill with dark text — the
  // Stoic "white pill on black" treatment.
  let bg: string = 'transparent';
  let labelColor: string = onInk ? colors.inkText : colors.text;
  let depth: ViewStyle = {};

  if (variant === 'primary') {
    bg = onInk ? colors.inkText : colors.accent;
    labelColor = onInk ? colors.ink : colors.accentText;
    depth = onInk ? shadow.control : shadow.ink;
  } else if (variant === 'secondary') {
    labelColor = onInk ? colors.inkText : colors.text;
    depth = onInk ? { boxShadow: '0 0 0 1px rgba(255,255,255,0.13)' } : shadow.control;
  }

  return (
    <PressScale
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      static={isStatic}
      style={[
        {
          minHeight: 52,
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: radius.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
          opacity: inactive ? 0.4 : 1,
          ...depth,
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
    </PressScale>
  );
}
