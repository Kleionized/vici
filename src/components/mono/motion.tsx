/**
 * Motion — the few moving parts every screen shares, tuned once.
 *
 * - `StepFade`  the hand-over between the steps of an in-screen flow
 *   (onboarding, the SOS interrupt, the check-ins, the slip flow). The new step
 *   comes in with a short fade and a 16pt drift from the side it is coming
 *   from; the old one fades out over it. Both stand on the same ground, so the
 *   cross-fade never shows a seam or a flash of a lighter frame.
 * - `TypeOut`   a line that is *said* rather than printed: it types itself out
 *   at a speaking pace, lingering on commas and full stops the way a voice
 *   would, with the unrevealed rest of the line already laid out (transparent)
 *   so nothing around it moves while it types. A tap anywhere on it finishes
 *   it at once. Screen readers get the whole line immediately.
 * - `Reveal`    what follows a typed line (the helper text, the answers, the
 *   button): it holds its space from the first frame and fades up into it when
 *   told, so the layout never jumps.
 *
 * Everything respects Reduce Motion: with it on, steps cut, lines appear whole
 * and reveals are immediate.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Text, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { haptic } from '@/lib/haptics';

import { MonoText, type MonoTextProps } from './Text';

/** The house curve: quick out of the gate, a long soft landing. */
export const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);
export const DUR = { quick: 160, step: 280, reveal: 360 } as const;

// ── StepFade ─────────────────────────────────────────────────────────

export type StepDirection = 'forward' | 'back' | 'none';

/**
 * Wraps the current step of a flow. Change `stepKey` to hand over to the next
 * step; pass `direction` so a Back reads as going back. The child should fill
 * the frame (every kit `Screen` does).
 */
export function StepFade({ stepKey, direction = 'forward', children, style }: { stepKey: string; direction?: StepDirection; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  const [firstKey] = useState(stepKey);
  const [moved, setMoved] = useState(false);
  if (!moved && stepKey !== firstKey) setMoved(true);
  const initial = !moved && stepKey === firstKey;

  // the first step of a flow is not a hand-over: it arrives with its route's own transition
  const entering = initial || reduced || direction === 'none'
    ? undefined
    : (direction === 'back' ? FadeInLeft : FadeInRight).duration(DUR.step).easing(EASE_OUT).withInitialValues({ transform: [{ translateX: direction === 'back' ? -16 : 16 }] });
  const exiting = reduced ? undefined : FadeOut.duration(DUR.quick);

  return (
    <View style={[{ flex: 1 }, style]}>
      <Animated.View key={stepKey} entering={entering} exiting={exiting} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
        {children}
      </Animated.View>
    </View>
  );
}

/**
 * Remembers which way a flow last moved, from successive step indices, so a
 * screen can hand `StepFade` its direction without threading it through every
 * `next`/`back`.
 */
export function useStepDirection(index: number): StepDirection {
  const [seen, setSeen] = useState<{ index: number; dir: StepDirection }>({ index, dir: 'forward' });
  if (index !== seen.index) {
    const dir: StepDirection = index > seen.index ? 'forward' : 'back';
    setSeen({ index, dir });
    return dir;
  }
  return seen.dir;
}

// ── Reduce Motion, outside Reanimated ────────────────────────────────

/** Whether the system asks for reduced motion (false until known). */
export function useReduceMotion(): boolean {
  const reduced = useReducedMotion();
  return reduced;
}

// ── TypeOut ──────────────────────────────────────────────────────────

/** Lines already typed once this session — going Back to a step shows it whole. */
const typed = new Set<string>();

/** Whether a line (by its `onceKey`, which defaults to the text) has already been typed whole this session. */
export function wasTyped(key: string): boolean {
  return typed.has(key);
}

/** ms per character, and the extra pause after each kind of mark. */
const PACE = { char: 24, comma: 150, stop: 300, dash: 180, line: 160 } as const;

/**
 * The `speed` that types `text` in about `ms` (never slower than speaking pace,
 * never more than 3× it) — so a long question takes the same beat as a short one.
 */
export function paceFor(text: string, ms = 600): number {
  return Math.max(1, Math.min(3, (text.length * PACE.char) / ms));
}

function pauseAfter(ch: string, following?: string): number {
  // a mark inside a word or a figure ("6,100", "1.5", "e.g.") is not a pause
  if (following != null && following !== '' && !/\s/.test(following) && ch !== '—' && ch !== '–') return 0;
  if (ch === ',' || ch === ';' || ch === ':') return PACE.comma;
  if (ch === '.' || ch === '?' || ch === '!' || ch === '…') return PACE.stop;
  if (ch === '—' || ch === '–') return PACE.dash;
  if (ch === '\n') return PACE.line;
  return 0;
}

export type TypeOutProps = Omit<MonoTextProps, 'children'> & {
  text: string;
  /** wait this long before the first character (lets the step's own entrance land) */
  delay?: number;
  /** characters per tick multiplier — 1 is speaking pace, 2 twice as fast */
  speed?: number;
  /** show it whole, at once */
  instant?: boolean;
  /**
   * A key that makes the line "already said": once typed under this key it is
   * shown whole on every later visit this session (defaults to the text).
   */
  onceKey?: string | false;
  /** called once the whole line is showing (immediately when it starts whole) */
  onDone?: () => void;
};

/**
 * A line typed out at a speaking pace. Layout is fixed from the first frame:
 * the unrevealed rest of the line is rendered transparent in the same `Text`,
 * so wrapping, height and everything below it are exactly what they will be
 * when it finishes.
 */
export function TypeOut({ text, delay = 220, speed = 1, instant, onceKey, onDone, style, ...rest }: TypeOutProps) {
  const reduced = useReducedMotion();
  const key = onceKey === false ? null : (onceKey ?? text);
  const whole = !!instant || reduced || (key != null && typed.has(key));
  const [typedN, setN] = useState(whole ? text.length : 0);
  const n = whole ? text.length : typedN;
  const done = n >= text.length;
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  // a new line (the copy changed under it) starts again
  const [shownFor, setShownFor] = useState(text);
  if (shownFor !== text) {
    setShownFor(text);
    setN(whole ? text.length : 0);
  }

  useEffect(() => {
    if (whole) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      // two characters a tick at speed 2, and so on; never split a surrogate pair
      const step = Math.max(1, Math.round(speed));
      let next = Math.min(text.length, i + step);
      if (next < text.length && /[\uD800-\uDBFF]/.test(text[next - 1])) next += 1;
      const ch = text[next - 1];
      const took = next - i;
      i = next;
      // never below what a tap has already shown
      setN((p) => Math.max(p, next));
      if (next >= text.length) return;
      // `took` characters at `speed` × speaking pace (the step is already part of the speed)
      timer = setTimeout(tick, (PACE.char * took) / Math.max(0.25, speed) + pauseAfter(ch, text[next]) / Math.max(1, speed / 1.5));
    };
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [text, whole, delay, speed]);

  useEffect(() => {
    if (!done) return;
    if (key != null) typed.add(key);
    doneRef.current?.();
  }, [done, key]);

  const finish = useCallback(() => setN(text.length), [text.length]);

  return (
    <MonoText
      {...rest}
      style={style}
      accessibilityLabel={text}
      onPress={done ? rest.onPress : finish}
      suppressHighlighting>
      {text.slice(0, n)}
      {done ? null : <Text style={{ color: 'transparent' }}>{text.slice(n)}</Text>}
    </MonoText>
  );
}

// ── a flow's typed beat, shared ──────────────────────────────────────

type BeatValue = { ready: boolean; markReady: () => void; skip: () => void; skipped: number };
const BeatCtx = createContext<BeatValue>({ ready: true, markReady: () => {}, skip: () => {}, skipped: 0 });

/**
 * The beat of one step: its typed line runs, then everything under it is
 * revealed. `TypeBeat` provides it; `BeatLine` is the typed line that ends the
 * beat; `BeatReveal` waits for it. A tap anywhere in the beat finishes the line.
 *
 *   <TypeBeat id={step.id}>
 *     <BeatLine v="h1" text={title} />
 *     <BeatReveal><Answers /></BeatReveal>
 *   </TypeBeat>
 */
export function TypeBeat({
  id,
  children,
  instant,
  tapToFinish,
}: {
  id: string;
  children: ReactNode;
  instant?: boolean;
  /**
   * Wrap the beat in a full-size view where a touch anywhere (the ground, a
   * not-yet-revealed answer, the line itself) finishes the line — it only
   * watches the touch, so a Back or a scroll still does what it does.
   */
  tapToFinish?: boolean;
}) {
  const [readyFor, setReadyFor] = useState<string | null>(instant ? id : null);
  const [skipped, setSkipped] = useState(0);
  const ready = !!instant || readyFor === id;
  const value = useMemo<BeatValue>(
    () => ({ ready, markReady: () => setReadyFor(id), skip: () => setSkipped((s) => s + 1), skipped }),
    [id, ready, skipped],
  );
  const provided = <BeatCtx.Provider value={value}>{children}</BeatCtx.Provider>;
  if (!tapToFinish) return provided;
  const watch = (_e: GestureResponderEvent) => {
    if (!ready) setSkipped((s) => s + 1);
    return false;
  };
  return (
    <View style={{ flex: 1 }} onStartShouldSetResponderCapture={watch}>
      {provided}
    </View>
  );
}

export function useBeat(): BeatValue {
  return useContext(BeatCtx);
}

/** The typed line of a beat: when it finishes, the beat's reveals run. */
export function BeatLine(props: Omit<TypeOutProps, 'onDone'> & { onDone?: () => void }) {
  const beat = useBeat();
  const { onDone, ...rest } = props;
  return (
    <TypeOut
      key={beat.skipped ? `skip-${beat.skipped}` : 'line'}
      {...rest}
      instant={rest.instant || beat.skipped > 0}
      onDone={() => {
        beat.markReady();
        onDone?.();
      }}
    />
  );
}

// ── Reveal ───────────────────────────────────────────────────────────

/**
 * Holds its children's space and fades them up into it when `show` turns true
 * (or, inside a `TypeBeat`, when the beat's line has finished). Until then the
 * children cannot be pressed.
 */
export function Reveal({
  show,
  delay = 0,
  lift = 8,
  duration = DUR.reveal,
  children,
  style,
}: {
  show?: boolean;
  delay?: number;
  lift?: number;
  duration?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const beat = useBeat();
  const visible = show ?? beat.ready;
  const reduced = useReducedMotion();
  const p = useSharedValue(visible ? 1 : 0);
  useEffect(() => {
    if (reduced) p.value = visible ? 1 : 0;
    else p.value = visible ? withDelay(delay, withTiming(1, { duration, easing: EASE_OUT })) : 0;
  }, [visible, delay, duration, reduced, p]);
  const anim = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: (1 - p.value) * lift }] }));
  return (
    // `box-none` once shown: a reveal laid over the frame (the bottom controls' layer) never eats a touch meant for what is under it
    <Animated.View style={[style, { pointerEvents: visible ? 'box-none' : 'none' }, anim]}>
      {children}
    </Animated.View>
  );
}

/** Children of a beat that should fade in with the reveal but are positioned absolutely by the caller. */
export const RevealAbsolute = Reveal;

// ── a one-shot fade for anything that mounts ─────────────────────────

/** A plain fade-in on mount — for content that arrives after a load, so it never pops. */
export function FadeInView({ children, style, duration = DUR.step, delay = 0 }: { children: ReactNode; style?: StyleProp<ViewStyle>; duration?: number; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <Animated.View entering={reduced ? undefined : FadeIn.duration(duration).delay(delay)} style={style}>
      {children}
    </Animated.View>
  );
}

/** Announce something to VoiceOver/TalkBack (a typed line's screen reader twin, a step change). */
export function announce(message: string): void {
  AccessibilityInfo.announceForAccessibility?.(message);
}

// ── a hero that arrives struck ───────────────────────────────────────

/**
 * Full-frame art (a hero) that lands like a medal being struck: it fades in
 * and grows from 0.88 on a soft spring about `originY` (canvas y of the art's
 * centre), with one success haptic as it settles. Reduce Motion shows it at
 * rest; the haptic still marks the moment.
 */
export function HeroStrike({ originY, delay = 160, children }: { originY: number; delay?: number; children: ReactNode }) {
  const reduced = useReducedMotion();
  const p = useSharedValue(reduced ? 1 : 0);
  const s = useSharedValue(reduced ? 1 : 0.88);
  useEffect(() => {
    if (!reduced) {
      p.value = withDelay(delay, withTiming(1, { duration: 260, easing: EASE_OUT }));
      s.value = withDelay(delay, withSpring(1, { dampingRatio: 0.8, duration: 700 }));
    }
    const t = setTimeout(() => haptic('success'), reduced ? 0 : delay + 300);
    return () => clearTimeout(t);
  }, [reduced, delay, p, s]);
  const anim = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ scale: s.value }] }));
  return <Animated.View style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, transformOrigin: ['50%', originY, 0] }, anim]}>{children}</Animated.View>;
}
