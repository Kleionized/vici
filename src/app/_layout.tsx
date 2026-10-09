import {
  Lato_400Regular,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
  useFonts,
} from '@expo-google-fonts/lato';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context';

import { AppLockGate } from '@/components/AppLockGate';
import { ErrorScreen } from '@/components/ErrorScreen';
import { useDeviceAccount } from '@/lib/accountState';
import { FORCE_MOCK } from '@/lib/config';
import { AppProviders } from '@/lib/providers';
import { useReminderLifecycle } from '@/lib/reminders';
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
/**
 * The device-size sweep also previews a home-button phone (375 × 667), whose
 * status bar is 20 tall. A preview that kept the canvas's 54 there would test
 * a phone that does not exist, so a short window states the short inset.
 */
const SHORT_INSETS = { top: 20, bottom: 0, left: 0, right: 0 };

function CanvasInsets({ children }: { children: ReactNode }) {
  if (Platform.OS !== 'web' || !FORCE_MOCK) return <>{children}</>;
  const short = typeof window !== 'undefined' && window.innerHeight < 700;
  return <SafeAreaInsetsContext.Provider value={short ? SHORT_INSETS : CANVAS_INSETS}>{children}</SafeAreaInsetsContext.Provider>;
}

/**
 * A tapped reminder opens its check-in, and this phone's reminder schedule is
 * kept in step with the saved times (`src/lib/reminders.ts`). Inside the
 * providers: it waits for the account before it routes.
 */
function ReminderLifecycle() {
  useReminderLifecycle();
  return null;
}

/**
 * Points this phone's per-account keys (`src/lib/accountState.ts`, D490) at
 * the signed-in account, and clears an account's pending state when it signs
 * out. First inside the providers, so its effect runs before any screen's and
 * before the reminders read the check-in times.
 */
function DeviceAccount() {
  useDeviceAccount();
  return null;
}

/**
 * A screen that throws while drawing shows the kit's "Something went wrong"
 * board with Try again, rather than closing the app (B11, D495). This one
 * catches anything above the `(app)` group's own — the providers included —
 * so it uses nothing they provide.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErrorScreen error={error} retry={() => void retry()} />;
}

// Hold the native splash until Lato is in: a first frame in the platform face
// reflows every line when the real one lands.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  // Exactly the four faces the canvas loads (see `LATO` in src/lib/theme.ts).
  const [fontsLoaded, fontError] = useFonts({ Lato_400Regular, Lato_700Bold, Lato_700Bold_Italic, Lato_900Black });
  const ready = fontsLoaded || !!fontError;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  return (
    <GestureHandlerRootView
      style={[
        { flex: 1 },
        Platform.OS === 'web' ? ({ WebkitFontSmoothing: 'antialiased' } as never) : null,
      ]}>
      <SafeAreaProvider>
        <CanvasInsets>
          <AppProviders>
            <DeviceAccount />
            {/* Light glyphs on the #0D0D0D ground — every frame in the drop is dark. */}
            <StatusBar style="light" />
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
              <Stack.Screen name="first-steps" />
              {/* the lessons browser is somewhere you look a lesson up, then leave */}
              <Stack.Screen name="lessons-browser" />
            </Stack>
            <ReminderLifecycle />
            {/* after the navigator, so the lock and the privacy cover draw over every screen */}
            <AppLockGate />
          </AppProviders>
        </CanvasInsets>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
