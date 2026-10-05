import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { Platform, ScrollView, View, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Grain } from '@/components/ui/Grain';
import { layout, mono } from '@/lib/theme';

const noise = require('../../../assets/images/noise.png');
const noiseDark = require('../../../assets/images/noise-dark.png');

/**
 * The four frame shells the bundle draws (design-system §1). `app` is every
 * Email-Login frame not listed elsewhere; `lesson` is every lesson reader;
 * `dark` the ten `#111111` frames; `letter` the two letter reads.
 */
export const SCREEN_VARIANTS = {
  app: { ground: mono.ground, noise, opacity: 0.05 },
  lesson: { ground: mono.ground, noise: noiseDark, opacity: 0.06 },
  dark: { ground: mono.groundDark, noise: noiseDark, opacity: 0.09 },
  letter: { ground: mono.groundLetter, noise, opacity: 0.05 },
} as const;

export type ScreenVariant = keyof typeof SCREEN_VARIANTS;

/**
 * Converts a canvas y into the app's: the canvas's first 54 are the status bar
 * the app never draws (D009), so its y is measured from the safe-area top.
 */
export function useCanvasTop() {
  const insets = useSafeAreaInsets();
  return insets.top - layout.statusBar;
}

/**
 * A frame. The ground and the noise fill the window — the noise tiles from the
 * window's (0,0), as the canvas's does from the frame's, and stays put while
 * anything scrolls. Children are laid out in **canvas coordinates**: they sit in
 * a box whose top is the canvas's y 0 (the safe-area top minus 54), so a frame's
 * `top: 136` is written `top: 136`, and its `bottom: 48` is off the screen's own
 * bottom edge (D026).
 */
export function Screen({
  variant = 'app',
  children,
  style,
  status = true,
}: {
  variant?: ScreenVariant;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** render the light StatusBar (every frame draws light glyphs) */
  status?: boolean;
}) {
  const v = SCREEN_VARIANTS[variant];
  const canvasTop = useCanvasTop();
  return (
    <View style={[{ flex: 1, backgroundColor: v.ground }, style]}>
      {status ? <StatusBar style="light" /> : null}
      <Grain source={v.noise} opacity={v.opacity} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: canvasTop, bottom: 0 }}>{children}</View>
    </View>
  );
}

/**
 * The small-screen policy (D320): the band between a fixed top (the nav row, a
 * title) and the bottom controls scrolls when — and only when — what the canvas
 * draws there does not fit. At 393 × 852 the content fits and nothing moves;
 * on a 667-tall phone the same layout scrolls instead of running under the
 * pill. `top`/`bottom` are canvas offsets; `bottom` is the space the controls
 * take off the bottom edge (a 58 pill at bottom 48 → 106).
 */
export function ScrollRegion({
  top,
  bottom = 0,
  children,
  contentStyle,
  style,
  ...rest
}: Omit<ScrollViewProps, 'style' | 'contentContainerStyle'> & {
  top: number;
  bottom?: number;
  children?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ position: 'absolute', left: 0, right: 0, top, bottom }, style]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...rest}
        // Native keeps rings at the content edge visible; on web `overflow` is what
        // makes the box scroll at all (RN-web's overflowY:auto), so it stays.
        style={Platform.OS === 'web' ? { flex: 1 } : { flex: 1, overflow: 'visible' }}
        contentContainerStyle={[{ flexGrow: 1 }, contentStyle]}>
        {children}
      </ScrollView>
    </View>
  );
}
