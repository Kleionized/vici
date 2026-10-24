import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

import { haptic, holdHaptic } from '@/lib/haptics';
import { mono } from '@/lib/theme';

import { MonoText } from './Text';

/**
 * A pill you press and hold (D64): the vow's "Hold to commit" and the urge
 * board's wave. Ink fills it from the left while the finger stays down, and
 * the touches grow with it (`holdHaptic.step`, quicker and heavier as it
 * fills). Let go early and it drains back with a soft tap; fill it and it
 * lands with the success touch and `onComplete`.
 *
 * Holding is not open to everyone: under VoiceOver a double-tap (the
 * `activate` action) completes it at once.
 */
export function HoldButton({
  label,
  holdingLabel,
  doneLabel,
  duration = 3000,
  done = false,
  onComplete,
  onHold,
  progress,
  bottom = 48,
  inline,
  style,
  children,
}: {
  label: string;
  /** shown while the finger is down */
  holdingLabel?: string;
  /** shown once it has filled */
  doneLabel?: string;
  duration?: number;
  /** filled already (a board returned to after the hold) */
  done?: boolean;
  onComplete: () => void;
  /** the finger going down (true) and coming up (false) */
  onHold?: (down: boolean) => void;
  /** the fill, 0 to 1, for a board that draws with it (the urge board's wave) */
  progress?: SharedValue<number>;
  bottom?: number;
  inline?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const own = useSharedValue(done ? 1 : 0);
  const fill = progress ?? own;
  const [holding, setHolding] = useState(false);
  const [filled, setFilled] = useState(done);
  const [width, setWidth] = useState(0);
  const ticker = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** how far the fill had got when the finger went down, and the time held since, by the ticks' own delays */
  const from = useRef(0);
  const elapsed = useRef(0);

  const stopTicks = () => {
    if (ticker.current) clearTimeout(ticker.current);
    ticker.current = null;
  };
  useEffect(() => stopTicks, []);

  const complete = () => {
    stopTicks();
    setHolding(false);
    setFilled(true);
    haptic.success();
    onComplete();
  };

  // the touches: one every 260 ms at the start, every 70 ms near the end
  const tick = () => {
    const p = Math.min(1, from.current + elapsed.current / duration);
    holdHaptic.step(p);
    const wait = 260 - 190 * p;
    elapsed.current += wait;
    ticker.current = setTimeout(tick, wait);
  };

  const pressIn = () => {
    if (filled) return;
    setHolding(true);
    onHold?.(true);
    from.current = fill.get();
    elapsed.current = 0;
    tick();
    fill.set(
      withTiming(1, { duration: (1 - fill.get()) * duration, easing: Easing.linear }, (finished) => {
        if (finished) runOnJS(complete)();
      }),
    );
  };
  const pressOut = () => {
    if (filled) return;
    stopTicks();
    setHolding(false);
    onHold?.(false);
    if (fill.get() < 1) {
      holdHaptic.release();
      fill.set(withTiming(0, { duration: 320, easing: Easing.out(Easing.quad) }));
    }
  };

  const bar = useAnimatedStyle(() => ({ width: fill.value * width }));
  const text = filled ? (doneLabel ?? label) : holding ? (holdingLabel ?? label) : label;
  const box: ViewStyle = inline ? { height: 58 } : { position: 'absolute', left: 24, right: 24, bottom, height: 58, zIndex: 6 };

  return (
    <Pressable
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Press and hold"
      accessibilityState={{ checked: filled }}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'activate' && !filled) {
          fill.set(1);
          complete();
        }
      }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[box, { borderRadius: 29, backgroundColor: mono.card, borderWidth: 1.5, borderColor: mono.ink, overflow: 'hidden' }, style]}>
      {/* the label in ink on the card, and again in dark on the fill, clipped to it */}
      <View style={{ ...ABS, alignItems: 'center', justifyContent: 'center' }}>
        <MonoText v="primaryLabel" color={mono.ink}>
          {text}
        </MonoText>
      </View>
      <Animated.View style={[{ position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: mono.ink, overflow: 'hidden' }, bar]}>
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width, alignItems: 'center', justifyContent: 'center' }}>
          <MonoText v="primaryLabel">{text}</MonoText>
        </View>
      </Animated.View>
      {children}
    </Pressable>
  );
}

const ABS = { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 } as const;
