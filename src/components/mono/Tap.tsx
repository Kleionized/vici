import type { ReactNode } from 'react';
import type { Insets, PressableProps, StyleProp, ViewStyle } from 'react-native';

import { PressScale } from '@/components/ui/press-scale';

/**
 * The kit's one pressable. `PressScale` forces `minHeight: 44` for the old
 * paper system's controls; the canvas draws tap targets of 24, 36, 40 and 48 and
 * a forced minimum distorts every one of them (the 36×40 nav slots, the 48
 * chips). The minimum goes; a small target gets `hitSlop` instead, which grows
 * the touch area without growing the box.
 */
export function Tap({
  children,
  style,
  hitSlop,
  label,
  accessibilityRole,
  ...rest
}: Omit<PressableProps, 'children' | 'style' | 'hitSlop'> & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  hitSlop?: number | Insets;
  /** accessibilityLabel — every icon-only control must say what it is */
  label?: string;
}) {
  return (
    <PressScale
      accessibilityLabel={label}
      hitSlop={hitSlop}
      {...rest}
      // A caller passing `accessibilityRole={undefined}` must not erase the role
      // (Card did): web loses the button and recipes cannot find the control.
      accessibilityRole={accessibilityRole ?? 'button'}
      // RN-web 0.21 renders no ARIA for `accessibilityState`; `aria-disabled` reaches
      // the DOM on web and is read natively on RN 0.85.
      aria-disabled={rest.disabled ? true : undefined}
      style={[{ minHeight: 0 }, style]}>
      {children}
    </PressScale>
  );
}
