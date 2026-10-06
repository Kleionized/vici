import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
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

/** The ground of the frame a piece sits on — a scroll region's fade must melt into it. */
const GroundContext = createContext<string>(mono.ground);

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
      <GroundContext.Provider value={v.ground}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: canvasTop, bottom: 0 }}>{children}</View>
      </GroundContext.Provider>
    </View>
  );
}

/**
 * A ScrollView that says when it has more. No frame draws a scroll indicator,
 * and at 852 nothing the frames lay out overflows; on a shorter phone a board
 * can open with its last rows below the fold and nothing saying so. There, on
 * native only, the platform indicator shows and flashes once after the push
 * (D347). Web — the verification build — stays indicator-free.
 */
export function CueScrollView({
  ref,
  onLayout,
  onContentSizeChange,
  onMore,
  onScroll,
  ...rest
}: ScrollViewProps & {
  ref?: Ref<ScrollView>;
  /** called with whether content lies below the visible band (false once scrolled to the end) */
  onMore?: (more: boolean) => void;
}) {
  const native = Platform.OS !== 'web';
  const own = useRef<ScrollView | null>(null);
  const box = useRef(0);
  const content = useRef(0);
  const [overflows, setOverflows] = useState(false);
  const offset = useRef(0);
  const report = () => onMore?.(content.current - box.current - offset.current > 2);
  const measure = () => {
    setOverflows(content.current > box.current + 1);
    report();
  };
  useEffect(() => {
    if (!native || !overflows) return;
    const t = setTimeout(() => own.current?.flashScrollIndicators(), 500);
    return () => clearTimeout(t);
  }, [native, overflows]);
  const setRef = useCallback(
    (node: ScrollView | null) => {
      own.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref && typeof ref === 'object') (ref as { current: ScrollView | null }).current = node;
    },
    [ref],
  );
  return (
    <ScrollView
      ref={setRef}
      showsVerticalScrollIndicator={native && overflows}
      {...rest}
      onLayout={(e) => {
        box.current = e.nativeEvent.layout.height;
        measure();
        onLayout?.(e);
      }}
      onContentSizeChange={(w, h) => {
        content.current = h;
        measure();
        onContentSizeChange?.(w, h);
      }}
      scrollEventThrottle={onMore ? 32 : rest.scrollEventThrottle}
      onScroll={(e) => {
        offset.current = e.nativeEvent.contentOffset.y;
        report();
        onScroll?.(e);
      }}
    />
  );
}

/** What a band's gaps give up: the fraction of its slack, and how a `Slack` reports its own. */
type Squeeze = { ratio: number; add: (slack: number) => () => void };
const SqueezeContext = createContext<Squeeze | null>(null);

/**
 * A frame's vertical space that a short phone may tighten (D406). It is `h`
 * wherever the band holds everything — every 393 × 852 frame — and where the
 * content would overflow its `ScrollRegion`, the band's gaps close together,
 * each in proportion to what it can spare (down to `min`), by just the
 * overflow; only what is still left over scrolls. Type, cards and controls
 * never shrink (D320). Outside a `ScrollRegion` it is a plain `h` spacer.
 */
export function Slack({ h, min = 24 }: { h: number; min?: number }) {
  const sq = useContext(SqueezeContext);
  const slack = Math.max(0, h - min);
  const add = sq?.add;
  useEffect(() => add?.(slack), [add, slack]);
  return <View style={{ height: h - slack * (sq?.ratio ?? 0) }} />;
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
  ref,
  ...rest
}: Omit<ScrollViewProps, 'style' | 'contentContainerStyle'> & {
  /** the ScrollView (React 19 passes `ref` as a prop) — to scroll something into view */
  ref?: Ref<ScrollView>;
  top: number;
  bottom?: number;
  children?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}) {
  /* When the band holds more than it shows (a short phone), its foot fades into
     the ground instead of cutting a row or a disc in half against the pill —
     the canvas's own treatment for content that runs past the controls (the
     lesson reader's L7 F11 fade), shorter here. Gone once scrolled to the end,
     and never drawn where the content fits: every 393 × 852 frame (D405). */
  const ground = useContext(GroundContext);
  const [more, setMore] = useState(false);

  /* The gaps (`Slack`) inside: their total slack, and how much of it is taken.
     The content is measured as laid out, so what it would be untightened is
     that plus the slack taken when it was measured; the ratio is the overflow
     over the slack, clamped — 0 wherever the content fits. While the band has
     gaps its content box keeps its own height (no `flexGrow`), so a fit is
     measurable. Everything `fit` reads is a ref: the layout events can arrive
     before the gaps have registered, or after, and either order settles. */
  const slacks = useRef(new Set<{ v: number }>());
  const slackRef = useRef(0);
  const [slack, setSlack] = useState(0);
  const [ratio, setRatio] = useState(0);
  const ratioRef = useRef(0);
  const box = useRef(0);
  const content = useRef({ h: 0, at: 0 });
  const fit = useCallback(() => {
    const total = slackRef.current;
    const { h, at } = content.current;
    if (total <= 0 || box.current <= 0 || h <= 0) return setRatio(0);
    const next = Math.min(1, Math.max(0, (h + total * at - box.current) / total));
    setRatio((r) => (Math.abs(next - r) * total < 0.5 ? r : next));
  }, []);
  const add = useCallback(
    (v: number) => {
      const entry = { v };
      const sum = () => {
        slackRef.current = [...slacks.current].reduce((a, e) => a + e.v, 0);
        setSlack(slackRef.current);
        fit();
      };
      slacks.current.add(entry);
      sum();
      return () => {
        slacks.current.delete(entry);
        sum();
      };
    },
    [fit],
  );
  // the ratio the next measurement is laid out at — set before the browser or the native layout reports it
  useLayoutEffect(() => {
    ratioRef.current = ratio;
  }, [ratio]);
  const squeeze = useMemo(() => ({ ratio, add }), [ratio, add]);

  return (
    <View style={[{ position: 'absolute', left: 0, right: 0, top, bottom }, style]}>
      <CueScrollView
        onMore={setMore}
        ref={ref}
        keyboardShouldPersistTaps="handled"
        {...rest}
        onLayout={(e) => {
          box.current = e.nativeEvent.layout.height;
          fit();
          rest.onLayout?.(e);
        }}
        onContentSizeChange={(w, h) => {
          content.current = { h, at: ratioRef.current };
          fit();
          rest.onContentSizeChange?.(w, h);
        }}
        // Native keeps rings at the content edge visible; on web `overflow` is what
        // makes the box scroll at all (RN-web's overflowY:auto), so it stays.
        style={Platform.OS === 'web' ? { flex: 1 } : { flex: 1, overflow: 'visible' }}
        contentContainerStyle={[{ flexGrow: slack > 0 ? 0 : 1 }, contentStyle]}>
        <SqueezeContext.Provider value={squeeze}>{children}</SqueezeContext.Provider>
      </CueScrollView>
      {more ? (
        <LinearGradient
          pointerEvents="none"
          colors={[`${ground}00`, ground]}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 36 }}
        />
      ) : null}
    </View>
  );
}
