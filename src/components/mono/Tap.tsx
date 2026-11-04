import type { ReactNode } from 'react';
import type { GestureResponderEvent, Insets, PressableProps, StyleProp, ViewStyle } from 'react-native';

import { PressScale } from '@/components/ui/press-scale';
import { haptic as play, type HapticKind } from '@/lib/haptics';

/** The haptic a control gets by what it is, unless it says otherwise. */
function hapticForRole(role: PressableProps['accessibilityRole']): HapticKind | null {
  switch (role) {
    case 'radio':
    case 'checkbox':
    case 'switch':
    case 'tab':
    case 'adjustable':
      return 'select';
    case 'button':
    case 'link':
    case 'menuitem':
    case undefined:
      return 'tap';
    default:
      return null;
  }
}

/**
 * The kit's one pressable. `PressScale` forces `minHeight: 44` for the old
 * paper system's controls; the canvas draws tap targets of 24, 36, 40 and 48 and
 * a forced minimum distorts every one of them (the 36×40 nav slots, the 48
 * chips). The minimum goes; a small target gets `hitSlop` instead, which grows
 * the touch area without growing the box.
 *
 * Every press carries a haptic that matches what the control is — a light tick
 * for a button, a selection tick for a chip, radio, checkbox or tab — played on
 * press (not press-in, so a scroll that starts on a row never buzzes). `haptic`
 * overrides it; `haptic={false}` silences it for a control that plays its own.
 */
export function Tap({
  children,
  style,
  hitSlop,
  label,
  accessibilityRole,
  haptic,
  onPress,
  ...rest
}: Omit<PressableProps, 'children' | 'style' | 'hitSlop'> & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  hitSlop?: number | Insets;
  /** accessibilityLabel — every icon-only control must say what it is */
  label?: string;
  /** the haptic this press plays; `false` for none (default: by role) */
  haptic?: HapticKind | false;
}) {
  const role = accessibilityRole ?? 'button';
  const kind = haptic === false ? null : (haptic ?? hapticForRole(role));
  return (
    <PressScale
      accessibilityLabel={label}
      hitSlop={hitSlop}
      {...rest}
      onPress={
        onPress
          ? (e: GestureResponderEvent) => {
              if (kind) play(kind);
              onPress(e);
            }
          : undefined
      }
      // A caller passing `accessibilityRole={undefined}` must not erase the role
      // (Card did): web loses the button and recipes cannot find the control.
      accessibilityRole={role}
      // RN-web 0.21 renders no ARIA for `accessibilityState`; `aria-disabled` reaches
      // the DOM on web and is read natively on RN 0.85.
      aria-disabled={rest.disabled ? true : undefined}
      style={[{ minHeight: 0 }, style]}>
      {children}
    </PressScale>
  );
}
