import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { mono, monoDark, ring } from '@/lib/theme';

import { ChevronR, FabChevron } from './icons';
import { Tap } from './Tap';
import { MonoText } from './Text';

/**
 * No frame draws a disabled primary. The kit dims the same pill rather than
 * inventing a colour — the opacity the auth boards already used (D321).
 */
export const DISABLED_OPACITY = 0.38;

/**
 * The primary pill (design-system §7.5): `left 24 right 24 bottom 48 h58 r29`,
 * ink fill, 16/700 ls 0.1 `#111111`. `bottom` 96 when a ghost link sits under
 * it, 82 on the paywall. `tone: 'dark'` is the `#FFFFFF` fill of the ten dark
 * frames. `sheet` is the sheet's own pill: z 42, and no tracking (the canvas
 * drops `letter-spacing` there). `inline` puts it in flow instead of anchoring
 * it to the frame bottom.
 */
export function PrimaryButton({
  label,
  onPress,
  bottom = 48,
  inset = 24,
  tone = 'light',
  disabled,
  sheet,
  inline,
  icon,
  style,
}: {
  label: string;
  onPress?: () => void;
  bottom?: number;
  inset?: number;
  tone?: 'light' | 'dark';
  disabled?: boolean;
  sheet?: boolean;
  inline?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const box: ViewStyle = inline
    ? { height: 58 }
    : { position: 'absolute', left: inset, right: inset, bottom, height: 58, zIndex: sheet ? 42 : 6 };
  return (
    <Tap
      onPress={onPress}
      disabled={disabled}
      style={[
        box,
        {
          borderRadius: 29,
          backgroundColor: tone === 'dark' ? monoDark.primaryFill : mono.ink,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: icon ? 10 : 0,
          opacity: disabled ? DISABLED_OPACITY : 1,
        },
        style,
      ]}>
      {icon}
      <MonoText v="primaryLabel" style={sheet ? { letterSpacing: 0 } : null}>
        {label}
      </MonoText>
    </Tap>
  );
}

/**
 * The ghost link under a primary (design-system §7.6): full width, centred,
 * 15/400 mute, `bottom 60` (48 when alone, 56 on Subscription and the photo
 * sheet). The canvas's box is the full row, so the whole row is the target.
 */
export function GhostLink({
  label,
  onPress,
  bottom = 60,
  tone = 'light',
  bold,
  zIndex = 6,
}: {
  label: string;
  onPress?: () => void;
  bottom?: number;
  tone?: 'light' | 'dark';
  bold?: boolean;
  zIndex?: number;
}) {
  return (
    <Tap onPress={onPress} hitSlop={{ top: 12, bottom: 12 }} style={{ position: 'absolute', left: 0, right: 0, bottom, zIndex }}>
      <MonoText v="ghost" center color={tone === 'dark' ? monoDark.ghost : mono.mute} style={bold ? { fontFamily: 'Lato_700Bold' } : null}>
        {label}
      </MonoText>
    </Tap>
  );
}

/** The round next button (`right 24 bottom 52`, 60 ink disc, `#111111` chevron). */
export function NextFab({ onPress, bottom = 52, disabled }: { onPress?: () => void; bottom?: number; disabled?: boolean }) {
  return (
    <Tap
      label="Next"
      onPress={onPress}
      disabled={disabled}
      style={{
        position: 'absolute',
        right: 24,
        bottom,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: mono.ink,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 6,
        opacity: disabled ? DISABLED_OPACITY : 1,
      }}>
      <FabChevron />
    </Tap>
  );
}

/** A transparent disc with the 1.5px line ring — the lesson's next (44) and the icon holders (34/44). */
export function IconCircle({
  size = 44,
  children,
  ringColor = ring.outline,
  style,
}: {
  size?: number;
  children?: ReactNode;
  ringColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2, boxShadow: ringColor, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}>
      {children}
    </View>
  );
}

/** The lesson's advance: a centred 44 ring at `bottom 52` with an ink chevron. */
export function RingNext({ onPress, bottom = 52 }: { onPress?: () => void; bottom?: number }) {
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom, flexDirection: 'row', justifyContent: 'center', zIndex: 6 }}>
      <Tap label="Next" onPress={onPress} hitSlop={10}>
        <IconCircle>
          <ChevronR color={mono.ink} />
        </IconCircle>
      </Tap>
    </View>
  );
}
