import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { cubicBezier, Easing, useAnimatedProps, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Path } from 'react-native-svg';

import { HARNESS } from '@/dev/harnessRegistry';

import { MonoText } from './Text';

/**
 * The app's motion (D58), one language everywhere: things arrive by fading in
 * as they rise a few points, in order — the board, its drawing, its rows one
 * after another, its pill last — and leave by fading. Three speeds: quick
 * (taps, a chosen state), standard (things arriving), slow (drawings, a page).
 * Reduce Motion turns it off; so does the capture harness, which shoots the
 * settled board.
 */
export const MS = { quick: 160, standard: 260, slow: 380 } as const;

/**
 * How much slower than `MS` everything arrives (D67): the owner found D58's
 * motion too quick. Every arrival, fade, pop, count and drawn line runs at
 * this pace, its delays with it, so the order holds and only the tempo
 * changes. Taps, drags, toggles and sheets are not paced: what answers a
 * finger stays quick.
 */
export const PACE = 1.7;
/** A duration or delay at the app's pace. */
export const paced = (ms: number) => Math.round(ms * PACE);

/** ease-out for arriving (`cubic-bezier(0.2, 0.8, 0.2, 1)`, the pager's curve) */
export const EASE_OUT = cubicBezier(0.2, 0.8, 0.2, 1);
/** a small overshoot for a check landing */
export const EASE_POP = cubicBezier(0.34, 1.4, 0.64, 1);

/** how far apart, in time, the items of a list arrive */
export const STAGGER = 45;

/**
 * Motion runs: not under Reduce Motion, and not in the capture harness unless
 * a harness target asks for it (`globals: { __MOTION: true }`, to film it).
 */
export function useMotion(): boolean {
  const reduced = useReducedMotion();
  return !reduced && (!HARNESS || (globalThis as { __MOTION?: boolean }).__MOTION === true);
}

const riseFrom = (distance: number, scale?: number) => ({
  from: { opacity: 0, transform: [{ translateY: distance }, { scale: scale ?? 1 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
});
const FADE = { from: { opacity: 0 }, to: { opacity: 1 } };
const POP = { from: { opacity: 0, transform: [{ scale: 0.6 }] }, to: { opacity: 1, transform: [{ scale: 1 }] } };

type Arrive = { delay?: number; duration?: number };

/** A fade-and-rise as style, for an `Animated` view (`Animated.View`, or `Tap` without a transform of its own). */
export function riseStyle(on: boolean, { delay = 0, duration = MS.standard, distance = 10, scale }: Arrive & { distance?: number; scale?: number } = {}): ViewStyle {
  if (!on) return {};
  return {
    animationName: riseFrom(distance, scale),
    animationDuration: paced(duration),
    animationDelay: paced(delay),
    animationTimingFunction: EASE_OUT,
    animationFillMode: 'backwards',
  } as ViewStyle;
}

/** A plain fade — for pressables, whose press scale owns `transform`. */
export function fadeStyle(on: boolean, { delay = 0, duration = MS.standard }: Arrive = {}): ViewStyle {
  if (!on) return {};
  return { animationName: FADE, animationDuration: paced(duration), animationDelay: paced(delay), animationTimingFunction: EASE_OUT, animationFillMode: 'backwards' } as ViewStyle;
}

/** A check or a disc landing: from 60 % with a small overshoot. */
export function popStyle(on: boolean, { delay = 0, duration = MS.slow }: Arrive = {}): ViewStyle {
  if (!on) return {};
  return { animationName: POP, animationDuration: paced(duration), animationDelay: paced(delay), animationTimingFunction: EASE_POP, animationFillMode: 'backwards' } as ViewStyle;
}

/** A colour (or opacity) that eases to its new value instead of switching — a chosen chip, a filled option. */
export function settleStyle(on: boolean, properties: string[] = ['backgroundColor']): ViewStyle {
  if (!on) return {};
  return { transitionProperty: properties, transitionDuration: MS.quick, transitionTimingFunction: 'ease-out' } as unknown as ViewStyle;
}

/**
 * One thing arriving: a view that fades in while it rises `distance` points
 * (and grows from `scale`), after `delay`. In flow by default; `layer` makes it
 * fill its parent without taking part in its layout, for absolutely placed
 * children.
 */
export function Appear({
  delay = 0,
  duration,
  distance,
  scale,
  layer,
  style,
  children,
}: Arrive & { distance?: number; scale?: number; layer?: boolean; style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const on = useMotion();
  return (
    <Animated.View
      pointerEvents={layer ? 'box-none' : undefined}
      style={[layer ? { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 } : null, riseStyle(on, { delay, duration, distance, scale }), style]}>
      {children}
    </Animated.View>
  );
}

/**
 * A number that counts up from 0 to `target` when it first shows (and again
 * when the target changes), easing out over `duration` — a rating, a count of
 * days. Without motion it is simply the target.
 */
export function useCountUp(target: number, { delay = 150, duration = 900 }: Arrive = {}): number {
  const on = useMotion();
  const [shown, setShown] = useState(on ? 0 : target);
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    let start = 0;
    const from = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const k = Math.min(1, Math.max(0, (t - start - paced(delay)) / paced(duration)));
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(from + (target - from) * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, target, delay, duration]);
  return on ? shown : target;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * An SVG path that draws itself from its start, over `duration` after `delay`
 * — a chart's line. `length` is at least the path's length (a dash that long is
 * slid along it). Without motion it is the plain path.
 */
export function DrawPath({ length, delay = 0, duration = 900, ...props }: ComponentProps<typeof Path> & { length: number } & Arrive) {
  const on = useMotion();
  const left = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    if (on) left.value = withDelay(paced(delay), withTiming(0, { duration: paced(duration), easing: Easing.bezier(0.2, 0.8, 0.2, 1) }));
  }, [on, left, delay, duration]);
  const animated = useAnimatedProps(() => ({ strokeDashoffset: left.value * length }));
  if (!on) return <Path {...props} />;
  return <AnimatedPath {...props} strokeDasharray={[length, length]} animatedProps={animated} />;
}

/**
 * A figure that counts up to `value` (`useCountUp`), as `MonoText` with the
 * same props. `format` turns the running number into the words shown — the
 * medallions' "×23", "Day 13".
 */
export function CountUpText({ value, format = String, delay, duration, ...text }: Omit<ComponentProps<typeof MonoText>, 'children'> & { value: number; format?: (n: number) => string } & Arrive) {
  const shown = useCountUp(value, { delay, duration });
  return <MonoText {...text}>{format(shown)}</MonoText>;
}
