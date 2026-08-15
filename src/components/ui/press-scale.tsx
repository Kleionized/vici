import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressScaleProps extends Omit<PressableProps, 'children' | 'style'> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Keep the hit target but disable tactile motion when movement distracts. */
  static?: boolean;
}

/** Interruptible tactile press motion shared by primary controls. */
export function PressScale({ children, disabled, static: isStatic = false, onPressIn, onPressOut, style, ...rest }: PressScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={(event) => {
        // `UI Final` declares `transform:scale(0.99)` on every pressed state it
        // draws — 62 of them, and never any other value.
        // eslint-disable-next-line react-hooks/immutability -- Reanimated shared values are intentionally mutable.
        if (!isStatic && !disabled) scale.value = withTiming(0.99, { duration: 110 });
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        // eslint-disable-next-line react-hooks/immutability -- Reanimated shared values are intentionally mutable.
        if (!isStatic) scale.value = withTiming(1, { duration: 160 });
        onPressOut?.(event);
      }}
      style={[{ minHeight: 44 }, style, animatedStyle]}>
      {children}
    </AnimatedPressable>
  );
}
