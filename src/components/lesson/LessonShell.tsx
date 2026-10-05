import { useEffect, useState, type ReactNode } from 'react';
import { Keyboard, Platform, ScrollView, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, FadeIn, LinearTransition, useReducedMotion } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { CloseX, MonoText, PrimaryButton, RingNext, Screen, Tap, useCanvasTop } from '@/components/mono';
import { PressScale } from '@/components/ui/press-scale';
import { mono } from '@/lib/theme';

/**
 * The reader's chrome — byte-identical on all 1,273 Week frames
 * (lessons.md §2): the lesson ground with its 0.06 noise, the ✕ at (22, 60),
 * `Lesson n` centred in the same 40 row (not on the cover), the 345 × 3 rail
 * at 108, the content band, and one bottom control — the 58 ink pill or the
 * 44 ring, never both.
 *
 * **The band** is `left 32 right 32 top 140 bottom 128`, its stack centred in
 * the box above a 24 lift (140–700 at 852). The canvas has three band modes
 * and the generator's own thresholds pick between them; the app measures the
 * stack and applies the same thresholds to the real band, so the three frames
 * that use the other two (L16 F11 and L58 F12 `tall`, L7 F11 `scroll`) come out
 * as drawn and a page too tall for a short phone takes the canvas's own answer:
 *
 * | mode | when | band |
 * | --- | --- | --- |
 * | centre | stack ≤ band − 24 | centred above the 24 lift |
 * | tall | stack ≤ band | the lift dropped, still centred |
 * | scroll | taller | top-aligned at 140 and scrolling to the screen's foot, under a 150 fade |
 *
 * A reading page also turns on a tap anywhere in the band (the old reader's
 * behaviour, kept); a drag scrolls instead. Pages with controls in the stack
 * (the question's rows, the note field) leave the band to them.
 */

export type LessonBottom = { kind: 'pill'; label: string; onPress: () => void } | { kind: 'ring'; onPress: () => void };

type Mode = 'centre' | 'tall' | 'scroll';

const BAND_TOP = 140;
const BAND_BOTTOM = 128;
const LIFT = 24;
const FADE_H = 150;

const SLOP = { top: 16, bottom: 16, left: 16, right: 24 };

/** `linear-gradient(rgba(13,13,13,0), #0D0D0D 40%)` over the band's foot (L7 F11), under the pill. */
function Fade() {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: FADE_H,
        zIndex: 5,
      }}>
      <Svg width="100%" height={FADE_H} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <LinearGradient id="lessonFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={mono.ground} stopOpacity={0} />
            <Stop offset="0.4" stopColor={mono.ground} stopOpacity={1} />
            <Stop offset="1" stopColor={mono.ground} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height={FADE_H} fill="url(#lessonFade)" />
      </Svg>
    </View>
  );
}

/** The keyboard's height while it is up (native; the web build has no keyboard events). */
function useKeyboardHeight() {
  const [h, setH] = useState(0);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const ios = Platform.OS === 'ios';
    const show = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', (e) => setH(e.endCoordinates.height));
    const hide = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () => setH(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return h;
}

export function LessonShell({
  n,
  index,
  count,
  bottom,
  tapAnywhere,
  onClose,
  children,
}: {
  /** the global lesson number, 1–84 */
  n: number;
  /** the page, 0-based */
  index: number;
  /** pages in the lesson; 0 draws no rail (an unknown lesson) */
  count: number;
  bottom: LessonBottom | null;
  /** the band itself turns the page (reading pages); false where the stack holds controls */
  tapAnywhere: boolean;
  onClose: () => void;
  children?: ReactNode;
}) {
  const reduced = useReducedMotion();
  const { height: winH } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const keyboard = useKeyboardHeight();
  // the stack's measured height, for this page only
  const [measured, setMeasured] = useState<{ index: number; h: number } | null>(null);
  const stackH = measured?.index === index ? measured.h : 0;

  // canvas y of the screen's foot is `winH − canvasTop` (Screen's children box)
  const band = winH - canvasTop - BAND_TOP - BAND_BOTTOM;
  const mode: Mode = stackH <= band - LIFT ? 'centre' : stackH <= band ? 'tall' : 'scroll';
  // With the keyboard up (the reflect page's note), the band rises until the
  // stack's foot clears the keyboard by 16 — never past the rail.
  const stackBottom = mode === 'scroll' ? BAND_TOP + stackH : BAND_TOP + (band - (mode === 'centre' ? LIFT : 0) + stackH) / 2;
  const stackTop = stackBottom - stackH;
  const kbLift = keyboard > 0 ? Math.max(0, Math.min(stackBottom + 16 - (winH - canvasTop - keyboard), stackTop - BAND_TOP)) : 0;
  const pct = count > 0 ? Math.round(((index + 1) / count) * 100) : 0;

  const stack = (
    <Animated.View
      key={index}
      entering={reduced ? undefined : FadeIn.duration(220).easing(Easing.bezier(0.2, 0, 0, 1))}
      onLayout={(e) => setMeasured({ index, h: e.nativeEvent.layout.height })}
      // a reading page's copy never takes the touch: the band behind it does
      pointerEvents={tapAnywhere ? 'none' : 'box-none'}
      style={{ alignSelf: 'stretch' }}>
      {children}
    </Animated.View>
  );

  const contentStyle =
    mode === 'scroll'
      ? {
          flexGrow: 1,
          paddingHorizontal: 32,
          paddingBottom: BAND_BOTTOM + LIFT,
          justifyContent: 'flex-start' as const,
        }
      : {
          flexGrow: 1,
          paddingHorizontal: 32,
          paddingBottom: mode === 'centre' ? LIFT : 0,
          justifyContent: 'center' as const,
        };

  return (
    <Screen variant="lesson">
      <ScrollView
        key={index}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: BAND_TOP,
          bottom: mode === 'scroll' ? 0 : BAND_BOTTOM,
          transform: kbLift ? [{ translateY: -kbLift }] : undefined,
        }}
        contentContainerStyle={contentStyle}
        scrollEnabled={mode === 'scroll'}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {tapAnywhere && bottom ? (
          <PressScale
            onPress={bottom.onPress}
            accessibilityRole="button"
            accessibilityLabel="Next"
            static
            // the press target fills the band, so a tap on the empty part of a short page turns it too
            style={{
              flexGrow: 1,
              alignSelf: 'stretch',
              minHeight: 0,
              justifyContent: mode === 'scroll' ? 'flex-start' : 'center',
            }}>
            {stack}
          </PressScale>
        ) : (
          stack
        )}
      </ScrollView>

      {mode === 'scroll' ? <Fade /> : null}

      {/* `Lesson n`: 13/700 `#9B968E` at normal leading, no tracking — not the cover's 13/16 +0.2 label */}
      {index > 0 ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 60,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 4,
          }}>
          <MonoText v="navTitle" wrap="nowrap" center style={{ width: '100%' }}>{`Lesson ${n}`}</MonoText>
        </View>
      ) : null}

      <Tap
        label="Close"
        onPress={onClose}
        hitSlop={SLOP}
        style={{
          position: 'absolute',
          left: 22,
          top: 60,
          height: 40,
          justifyContent: 'center',
          zIndex: 5,
        }}>
        <CloseX />
      </Tap>

      {/* the fill grows into its new width rather than jumping (320 ms; none under reduced motion) */}
      {count > 0 ? (
        <View
          accessibilityRole="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            top: 108,
            height: 3,
            borderRadius: 2,
            backgroundColor: mono.line,
          }}>
          <Animated.View
            layout={reduced ? undefined : LinearTransition.duration(320).easing(Easing.bezier(0.2, 0, 0, 1))}
            style={{
              width: `${pct}%`,
              height: 3,
              borderRadius: 2,
              backgroundColor: mono.ink,
            }}
          />
        </View>
      ) : null}

      {bottom?.kind === 'pill' ? <PrimaryButton label={bottom.label} onPress={bottom.onPress} /> : null}
      {bottom?.kind === 'ring' ? <RingNext onPress={bottom.onPress} /> : null}
    </Screen>
  );
}
