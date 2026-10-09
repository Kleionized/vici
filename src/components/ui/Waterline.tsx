import { Text, useWindowDimensions, View } from 'react-native';

import { LaurelMark } from '@/components/mono/LaurelMark';
import { Spinner } from '@/components/mono/Progress';
import { Screen, useCanvasTop } from '@/components/mono/Screen';
import { MonoText } from '@/components/mono/Text';
import { lhNormal, mono, sans } from '@/lib/theme';

/**
 * 01 · Splash, and the launch wait no frame draws.
 *
 * The overhaul's splash is the ground and its noise, a 120 white laurel at
 * (136, 330) and the `VICI` wordmark 148 under the laurel's top (14/700, ls 7).
 * The board paints under the status bar, so its place is a share of the whole
 * screen — the laurel's top at 330/852 of the window — rather than an offset
 * under the safe area; on 852 it is the frame's 330 exactly, and on a shorter
 * phone the pair keeps its place in the composition instead of sinking.
 */

/** The laurel's top as a share of the frame's height. */
const LAUREL_TOP = 330 / 852;
/** The wordmark sits 148 below the laurel's top (478 − 330). */
const MARK_GAP = 148;

function useMarkTop() {
  const { height } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  // canvas coordinates: the window's top is −canvasTop
  return height * LAUREL_TOP - canvasTop;
}

function Mark({ top }: { top: number }) {
  return (
    <>
      {/* the frame's 136 is half a point left of centre (196.5 − 60.5) */}
      <LaurelMark size={120} style={{ position: 'absolute', left: '50%', marginLeft: -60.5, top }} />
      {/* CSS adds the 7 of letter-spacing after the last "I" too, so the word
          sits 3.5 left of the axis — RN does the same */}
      <Text
        accessibilityRole="header"
        maxFontSizeMultiplier={1.3}
        style={{ position: 'absolute', left: 0, right: 0, top: top + MARK_GAP, textAlign: 'center', ...sans('700'), fontSize: 14, lineHeight: lhNormal(14), letterSpacing: 7, color: mono.ink }}>
        VICI
      </Text>
    </>
  );
}

/** `01 · Splash` — rendered by `/` while boot resolves and by `(auth)/splash`. */
export function SplashScene() {
  const top = useMarkTop();
  return (
    <Screen>
      <Mark top={top} />
    </Screen>
  );
}

/**
 * The boot that is still waiting after the mark has held for 900 ms (unreachable
 * on the mock build — D131). No frame draws it: it is the splash with the
 * bundle's one loading mark under it — the kit `Spinner` (Enlisting Aegis's
 * dotted ring and arc) at 44 in `#9B968E`, as `LoadingView` draws it (D386) —
 * and its label in the ghost line's 15/400 mute, low on the screen where the
 * old board put them. The label was Tideline's "Finding the waterline…"; it
 * says what boot is doing now (D493). The name stays, so the old imports hold.
 */
export function WaterlineScene({ label = 'Opening VICI…' }: { label?: string }) {
  const top = useMarkTop();
  return (
    <Screen>
      <Mark top={top} />
      <View style={{ position: 'absolute', left: 24, right: 24, bottom: 96, alignItems: 'center', gap: 14 }}>
        <Spinner size={44} color={mono.mute} />
        <MonoText v="ghost" center>
          {label}
        </MonoText>
      </View>
    </Screen>
  );
}
