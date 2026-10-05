import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  BackHandler,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { layout, mono } from '@/lib/theme';

import { useCanvasTop } from './Screen';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** The four panel tops the canvas draws (design-system §7.24). */
export const SHEET_TOP = { pledge: 120, name: 420, photo: 512, signOut: 556 } as const;

/** Never let a sheet — or the keyboard lifting one — climb past the nav row's line. */
const MIN_TOP = 60;
const OPEN_MS = 300;
const CLOSE_MS = 220;
/** Past this drag (or this downward speed, pt/ms) a released panel closes. */
const DISMISS_DY = 96;
const DISMISS_VY = 0.9;
/**
 * Over the keyboard the buttons give back all but 16 of the 48 their frames
 * keep off the screen edge (the margin that clears the home indicator, which
 * the keyboard covers anyway). Lifting by the whole keyboard put Change
 * Pledge's pill 18 pt into its own field on a 667 phone; this leaves 14 clear.
 */
const KEYBOARD_GIVE = 32;

const webOnly = (style: Record<string, unknown>) => (Platform.OS === 'web' ? (style as ViewStyle) : null);

// `box-none` as a style must be registered: RN-web turns a registered
// `pointerEvents` into its box-none classes, but writes an inline one as CSS,
// where `box-none` is not a value — the full-window layers then eat every tap.
const S = StyleSheet.create({ boxNone: { pointerEvents: 'box-none' } });

/**
 * The bottom sheet (design-system §7.24): a `rgba(0,0,0,0.68)` scrim over the
 * whole window — the status-bar band included, as the canvas draws it over
 * its z-20 status bar — and a `#171717` panel, `28 28 0 0`, with the 40×4
 * grabber at 10 and its content column at `left 24 right 24 top 44`.
 *
 * The frames keep the sheet's buttons **frame-level** (z 42, `bottom 96`/`60`
 * off the screen edge, not the panel's): pass them as `footer`, laid out in
 * canvas coordinates exactly as the frame writes them (`<PrimaryButton sheet
 * bottom={96} />`, `<GhostLink zIndex={42} />`). They slide in with the panel
 * and ride the keyboard.
 *
 * `top` is the canvas's panel top at 852 (120 / 420 / 512 / 556). The panel
 * keeps the **height** that gives it — it is a bottom-anchored thing, like the
 * buttons it carries — so a taller phone shows the same sheet and a shorter one
 * does not run the panel's content under its own pill. It never climbs past
 * canvas 60.
 *
 * Render it as the **last child of `Screen`** (an in-tree overlay over the
 * screen the frame draws beneath it) — or with `modal` when it must also cover
 * navigator chrome such as the tab bar. Dismissal (scrim tap, Android back,
 * Escape on web, a downward drag on the panel) calls `onClose`; leave it out
 * for a sheet that only its own buttons can close.
 */
export function Sheet({
  open,
  top,
  onClose,
  children,
  footer,
  gap = 12,
  modal = false,
  scrimLabel = 'Dismiss',
  contentStyle,
}: {
  open: boolean;
  /** the panel's canvas top at 852 */
  top: number;
  onClose?: () => void;
  children?: ReactNode;
  /** frame-level buttons, in canvas coordinates (z 42) */
  footer?: ReactNode;
  /** content column gap — 12 on three sheets, 10 on Sign Out */
  gap?: number;
  /** render in a transparent `Modal` (covers the tab bar too) instead of in-tree */
  modal?: boolean;
  scrimLabel?: string;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const canvasTop = useCanvasTop();
  const { height: windowH } = useWindowDimensions();
  const reduced = useReducedMotion();

  // The canvas box spans from `canvasTop` to the window's bottom edge.
  const boxH = windowH - canvasTop;
  const panelTop = Math.max(MIN_TOP, top + boxH - layout.frameH);
  const travel = boxH - panelTop;

  const [mounted, setMounted] = useState(open);
  const [keyboard, setKeyboard] = useState(0);
  const progress = useSharedValue(0);
  const drag = useSharedValue(0);
  const kb = useSharedValue(0);
  const travelSV = useSharedValue(travel);
  const maxPanelLift = useSharedValue(Math.max(0, panelTop - MIN_TOP));

  useEffect(() => {
    travelSV.value = travel;
    maxPanelLift.value = Math.max(0, panelTop - MIN_TOP);
  }, [travel, panelTop, travelSV, maxPanelLift]);

  // Mount on the render that opens it (React's "adjust state while rendering");
  // unmount only once the close animation has run.
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open) {
      drag.value = 0;
      progress.value = withTiming(1, { duration: reduced ? 0 : OPEN_MS, easing: Easing.out(Easing.cubic) });
    } else {
      // a closing sheet takes its keyboard with it
      if (Platform.OS !== 'web') Keyboard.dismiss();
      progress.value = withTiming(0, { duration: reduced ? 0 : CLOSE_MS, easing: Easing.in(Easing.cubic) }, (done) => {
        if (done) runOnJS(setMounted)(false);
      });
    }
  }, [open, reduced, progress, drag]);

  // Android's hardware back closes the sheet, not the screen under it.
  useEffect(() => {
    if (!open || Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose?.();
      return true;
    });
    return () => sub.remove();
  }, [open, onClose]);

  // Escape on the web build, the keyboard's own way out of a dialog.
  useEffect(() => {
    if (!open || Platform.OS !== 'web' || !onClose || typeof document === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // The keyboard lift. The buttons are anchored 48/96 off the screen edge and
  // the keyboard covers them; they ride its top (less KEYBOARD_GIVE), and the
  // panel rises with them as far as the nav line allows. At rest (and always on the web build, which
  // has no keyboard events) nothing moves, so the drawn geometry holds. Where
  // the platform resizes the window for the keyboard instead (an Android
  // configuration), the panel is already bottom-anchored to the smaller window,
  // so only what the resize did not absorb is lifted.
  const kbMs = useRef(250);
  const restH = useRef(windowH);
  useEffect(() => {
    if (!mounted || Platform.OS === 'web') return;
    const ios = Platform.OS === 'ios';
    const show = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', (e) => {
      kbMs.current = ios ? e.duration || 250 : 160;
      setKeyboard(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', (e) => {
      kbMs.current = ios ? e.duration || 250 : 160;
      setKeyboard(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [mounted]);
  useEffect(() => {
    if (keyboard === 0) restH.current = windowH;
  }, [keyboard, windowH]);
  useEffect(() => {
    const covered = Math.max(0, keyboard - Math.max(0, restH.current - windowH));
    const lift = Math.max(0, covered - KEYBOARD_GIVE);
    kb.value = withTiming(lift, { duration: kbMs.current, easing: Easing.out(Easing.cubic) });
  }, [keyboard, windowH, kb]);

  // A downward drag on the panel dismisses it; anything short of that springs
  // back. Plain responder props: the touch's start and its last sample.
  const g = useRef({ x0: 0, y0: 0, y: 0, t: 0, vy: 0 });
  const pullsDown = (e: GestureResponderEvent) => {
    const dy = e.nativeEvent.pageY - g.current.y0;
    return !!onClose && dy > 8 && Math.abs(dy) > Math.abs(e.nativeEvent.pageX - g.current.x0) * 1.2;
  };
  const pan = {
    onStartShouldSetResponderCapture: (e: GestureResponderEvent) => {
      const { pageX, pageY, timestamp } = e.nativeEvent;
      g.current = { x0: pageX, y0: pageY, y: pageY, t: timestamp, vy: 0 };
      return false;
    },
    onMoveShouldSetResponder: pullsDown,
    // `true` blocks the native responder: on Android a scroll view under the
    // finger may no longer intercept the touch once the panel has it
    onResponderGrant: () => true,
    onResponderMove: (e: GestureResponderEvent) => {
      const { pageY, timestamp } = e.nativeEvent;
      const dt = timestamp - g.current.t;
      if (dt > 0) g.current.vy = 0.8 * ((pageY - g.current.y) / dt) + 0.2 * g.current.vy;
      g.current.y = pageY;
      g.current.t = timestamp;
      // eslint-disable-next-line react-hooks/immutability -- Reanimated shared values are intentionally mutable.
      drag.value = Math.max(0, pageY - g.current.y0);
    },
    onResponderRelease: (e: GestureResponderEvent) => {
      const dy = e.nativeEvent.pageY - g.current.y0;
      const vy = e.nativeEvent.timestamp - g.current.t > 90 ? 0 : g.current.vy;
      if (dy > DISMISS_DY || vy > DISMISS_VY) onClose?.();
      // eslint-disable-next-line react-hooks/immutability -- Reanimated shared values are intentionally mutable.
      else drag.value = withTiming(0, { duration: 180, easing: Easing.out(Easing.cubic) });
    },
    onResponderTerminate: () => {
      // eslint-disable-next-line react-hooks/immutability -- Reanimated shared values are intentionally mutable.
      drag.value = withTiming(0, { duration: 180 });
    },
  };

  const scrimStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * travelSV.value + drag.value - Math.min(kb.value, maxPanelLift.value) }],
  }));
  const footerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * travelSV.value + drag.value - kb.value }],
  }));

  if (!mounted) return null;

  // The modal flag sits on the layer, not the panel: VoiceOver hides a modal
  // view's siblings, and the scrim and the frame-level buttons are the panel's
  // siblings — on the panel it would hide every sheet's own buttons. In `modal`
  // mode the RN `Modal` is already the dialog (its own window natively, a
  // `role="dialog"` on web), so the layer does not say it again.
  const layer = (
    <View
      accessibilityViewIsModal={!modal}
      aria-modal={!modal || undefined}
      role={modal ? undefined : 'dialog'}
      collapsable={false}
      style={[{ position: 'absolute', left: 0, right: 0, top: modal ? canvasTop : 0, bottom: 0, zIndex: 40 }, S.boxNone]}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={scrimLabel}
        disabled={!onClose}
        onPress={onClose}
        style={[
          { position: 'absolute', left: 0, right: 0, top: -canvasTop, bottom: 0, backgroundColor: mono.scrim, zIndex: 40 },
          webOnly({ outlineStyle: 'none', cursor: 'default' }),
          scrimStyle,
        ]}
      />
      <Animated.View
        {...pan}
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            top: panelTop,
            bottom: 0,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            backgroundColor: mono.sheet,
            zIndex: 41,
          },
          panelStyle,
        ]}>
        {/* the ground a lifted panel leaves below its own bottom edge (native only:
            on the web build nothing lifts, and this would overflow the page) */}
        {Platform.OS !== 'web' ? (
          <View style={{ position: 'absolute', left: 0, right: 0, top: '100%', height: 1000, backgroundColor: mono.sheet }} />
        ) : null}
        <View
          style={{ position: 'absolute', left: '50%', top: 10, width: 40, height: 4, marginLeft: -20, borderRadius: 2, backgroundColor: mono.line }}
        />
        <View style={[{ position: 'absolute', left: 24, right: 24, top: 44, bottom: 0, flexDirection: 'column', gap }, contentStyle]}>
          {children}
        </View>
      </Animated.View>
      {footer ? (
        // the prop, not the style: Reanimated's web view flattens its style inline,
        // which drops the registered box-none (one deprecation notice on web)
        <Animated.View pointerEvents="box-none" style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 42 }, footerStyle]}>
          {footer}
        </Animated.View>
      ) : null}
    </View>
  );

  if (!modal) return layer;
  return (
    <Modal transparent visible animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={() => onClose?.()}>
      <View style={{ flex: 1 }}>{layer}</View>
    </Modal>
  );
}
