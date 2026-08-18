import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context';

import { FORCE_MOCK } from '@/lib/config';
import { AppProviders } from '@/lib/providers';
import { colors } from '@/lib/theme';

/**
 * The design canvas is a 393 × 852 iPhone frame whose top 54 is the status bar
 * and whose bottom 34 is the home indicator. A browser has neither, so
 * `useSafeAreaInsets` reports zeros and every screen's content rides 54 higher
 * than the canvas while its full-bleed art — which is measured from the frame's
 * own top edge — stays put. The two coordinate systems then disagree by exactly
 * the status bar, which reads as a screen whose spacing is subtly wrong
 * everywhere rather than as a missing status bar.
 *
 * So the preview build states the status bar outright. This is the mock build
 * only: on a device the real insets are reported and this never runs, and the
 * production web build is left alone.
 *
 * The bottom stays 0 on purpose. The canvas's home-indicator zone is *inside*
 * its 852, and a real 852pt screen includes it too, so a canvas `bottom: 44` is
 * 44 off the screen's own edge on both. Simulating a 34pt bottom inset would
 * lift every bottom-anchored element 34 above where the canvas draws it — and
 * would grow the tab bar past the 83 the canvas gives it.
 */
const CANVAS_INSETS = { top: 54, bottom: 0, left: 0, right: 0 };

function CanvasInsets({ children }: { children: ReactNode }) {
  if (Platform.OS !== 'web' || !FORCE_MOCK) return <>{children}</>;
  return <SafeAreaInsetsContext.Provider value={CANVAS_INSETS}>{children}</SafeAreaInsetsContext.Provider>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      style={[
        { flex: 1 },
        Platform.OS === 'web' ? ({ WebkitFontSmoothing: 'antialiased' } as never) : null,
      ]}>
      <SafeAreaProvider>
        <CanvasInsets>
          <AppProviders>
            {/* Dark ink glyphs on the paper field. */}
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.bg },
                // One push everywhere: the new screen comes in from the right
                // and the gesture takes it back. The default varies by platform
                // and by presentation, which made the app feel assembled rather
                // than designed.
                animation: 'slide_from_right',
                animationDuration: 260,
                gestureEnabled: true,
              }}>
              {/* the day-3 letter is delivered over Today — fade it in like an overlay */}
              <Stack.Screen name="letter" options={{ animation: 'fade', gestureEnabled: false }} />
              {/* the first-steps checklist is a look, not a destination */}
              <Stack.Screen name="first-steps" options={{ presentation: 'modal' }} />
              {/* the lessons browser is somewhere you look a lesson up, then leave */}
              <Stack.Screen name="lessons-browser" options={{ presentation: 'modal' }} />
            </Stack>
          </AppProviders>
        </CanvasInsets>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
