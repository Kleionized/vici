import { useId, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { Easing, FadeIn, LinearTransition, useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, ClipPath, Defs, Ellipse, LinearGradient as SvgLinearGradient, Mask, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, Grain, PressScale } from '@/components/ui';
import { sans } from '@/lib/theme';

/**
 * The reader's shell and its marks.
 *
 * Every frame is the same recipe: a `Close`, a 2pt progress hairline, and a
 * column centred in the **whole** 852 — status bar and home indicator included
 * — so the stack's centre is the screen's centre. Body content has no absolute
 * top anywhere in the 1,398 frames; vertical position is a function of how tall
 * the stack is. Most pages carry no pill at all: the set is named "Scroll" and
 * the cover's chevron says why, the page advances by tapping through.
 *
 * The type itself is no longer a fixed set of slots here. The bundle draws 84
 * lessons in ten ramps, so a run of copy carries the ramp its own frame states
 * and `components/lesson/reader.tsx` draws it — see `content/lessonReader.ts`.
 * What stays here is the shell and the marks, which are shared by every lesson.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

/** The gap a page uses when it states none: the reading pages' own value. */
const STACK_GAP = 48;

/**
 * What a page keeps clear of the chrome, top and bottom. The Close row and the
 * rail occupy the first ~56, the chevron the last ~54; 72 clears both, and
 * using one value for both ends leaves the page centred where the frame
 * centres it.
 */
const PAGE_INSET = 72;

/* ------------------------------------------------------------------- slots */












/* ------------------------------------------------------------------- marks */

/**
 * Every mark below is transcribed from its own frame. `filter: blur(Npx)` has
 * no RN equivalent: on the gradient discs it is absorbed into their falloff,
 * and on a solid it is redrawn as the ramp the blur actually makes.
 */

/** A full-bleed SVG over a mark's own box. */
function MarkSvg({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <Svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      {children}
    </Svg>
  );
}

/**
 * Frames 2 and 5 — a warm dot with a halo four times its size hanging off every
 * edge. `radial-gradient(circle at 34% 30%, …)` names no size, so CSS resolves
 * farthest-corner: on a 12 box from (4.08, 3.6) that is √(7.92² + 8.4²) = 11.55.
 */
export function SunDot({ size, halo: haloSize }: { size: number; halo?: number }) {
  const id = useId().replace(/:/g, '');
  const halo = haloSize ?? (size === 12 ? 38 : 45);
  const off = (halo - size) / 2;
  const r = Math.hypot(size * 0.66, size * 0.7);
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={halo} height={halo} style={{ position: 'absolute', left: -off, top: -off }} pointerEvents="none">
        <Defs>
          <RadialGradient id={`sdh${id}`} cx={halo / 2} cy={halo / 2} rx={halo / 2} ry={halo / 2} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.4} />
            <Stop offset="0.76" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={halo / 2} cy={halo / 2} r={halo / 2} fill={`url(#sdh${id})`} />
      </Svg>
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', boxShadow: '0 2px 6px rgba(160,120,50,0.3)' }}>
        <MarkSvg w={size} h={size}>
          <Defs>
            <RadialGradient id={`sd${id}`} cx={size * 0.34} cy={size * 0.3} rx={r} ry={r} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#F3E3C4" />
              <Stop offset="0.58" stopColor="#E2BA78" />
              <Stop offset="1" stopColor="#C49856" />
            </RadialGradient>
          </Defs>
          <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#sd${id})`} />
        </MarkSvg>
      </View>
    </View>
  );
}

/**
 * Frame 3 — a 28pt `#C5C4BD` disc at (0, 2) with a circle of r 11 cut out of it
 * at (23, 9), plus a 3pt speck at the box's top right.
 */
export function CrescentMark() {
  const id = useId().replace(/:/g, '');
  return (
    <View style={{ width: 34, height: 30 }}>
      <MarkSvg w={34} h={30}>
        <Defs>
          <RadialGradient id={`cmc${id}`} cx="23" cy="11" rx="11.5" ry="11.5" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#000000" />
            <Stop offset="0.9565" stopColor="#000000" />
            <Stop offset="1" stopColor="#FFFFFF" />
          </RadialGradient>
          <Mask id={`cmm${id}`}>
            <Rect x={0} y={2} width={28} height={28} fill="#FFFFFF" />
            <Circle cx={23} cy={11} r={11.5} fill={`url(#cmc${id})`} />
          </Mask>
        </Defs>
        <Circle cx={14} cy={16} r={14} fill="#C5C4BD" mask={`url(#cmm${id})`} />
        <Circle cx={32.5} cy={1.5} r={1.5} fill="#C6C5C0" />
      </MarkSvg>
    </View>
  );
}

/**
 * Frame 9 — the sun half-risen: a 48pt disc clipped to its top 24, on a horizon
 * rule with a dash either side.
 */
export function SunriseMark() {
  const id = useId().replace(/:/g, '');
  return (
    <View style={{ width: 240, height: 96 }}>
      <MarkSvg w={240} h={96}>
        <Defs>
          <RadialGradient id={`srh${id}`} cx="120" cy="58" rx="50" ry="50" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.42} />
            <Stop offset="0.76" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
          {/* `circle at 40% 30%` on a 48 box → farthest-corner √(28.8² + 33.6²) */}
          <RadialGradient id={`srs${id}`} cx="115.2" cy="70.4" rx="44.25" ry="44.25" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#F3E3C4" />
            <Stop offset="0.58" stopColor="#E2BA78" />
            <Stop offset="1" stopColor="#C49856" />
          </RadialGradient>
          <ClipPath id={`src${id}`}>
            <Rect x={96} y={56} width={48} height={24} />
          </ClipPath>
        </Defs>
        <Circle cx={120} cy={58} r={50} fill={`url(#srh${id})`} />
        <Circle cx={120} cy={80} r={24} fill={`url(#srs${id})`} clipPath={`url(#src${id})`} />
        <Rect x={0} y={79} width={240} height={1.5} rx={0.75} fill="#D6D5D0" />
        <Rect x={24} y={78} width={26} height={3.5} rx={1.75} fill="#E4E3DE" />
        <Rect x={192} y={78} width={20} height={3.5} rx={1.75} fill="#E4E3DE" />
      </MarkSvg>
    </View>
  );
}

/** Frame 13 — the clock: four ticks, two hands and a hub, on a ringed face. */
export function ClockMark() {
  return (
    <View style={{ width: 96, height: 96 }}>
      <View style={{ position: 'absolute', left: 0, top: 0, width: 96, height: 96, borderRadius: 48, backgroundColor: '#FFFFFF', boxShadow: 'inset 0 0 0 2.5px #E4E2DB, 0 8px 20px rgba(40,38,32,0.1)' }} />
      <View style={{ position: 'absolute', left: 46.75, top: 8, width: 2.5, height: 7, borderRadius: 1, backgroundColor: '#C9C7C0' }} />
      <View style={{ position: 'absolute', left: 46.75, top: 81, width: 2.5, height: 7, borderRadius: 1, backgroundColor: '#C9C7C0' }} />
      <View style={{ position: 'absolute', left: 8, top: 46.75, width: 7, height: 2.5, borderRadius: 1, backgroundColor: '#C9C7C0' }} />
      <View style={{ position: 'absolute', left: 81, top: 46.75, width: 7, height: 2.5, borderRadius: 1, backgroundColor: '#C9C7C0' }} />
      <View style={{ position: 'absolute', left: 46.5, top: 20, width: 3, height: 28, borderRadius: 1.5, backgroundColor: '#1D1C1A' }} />
      {/* the hour hand turns about its own foot, not its centre */}
      <View
        style={{ position: 'absolute', left: 46.5, top: 28, width: 3, height: 20, borderRadius: 1.5, backgroundColor: '#1D1C1A', transform: [{ rotate: '-52deg' }], transformOrigin: '50% 100%' }}
      />
      <View style={{ position: 'absolute', left: 44, top: 44, width: 8, height: 8, borderRadius: 4, backgroundColor: '#1D1C1A' }} />
    </View>
  );
}

/** Frame 14 — the bed with the phone still lit in it. */
export function BedPhoneMark() {
  const id = useId().replace(/:/g, '');
  return (
    <View style={{ width: 240, height: 100 }}>
      <MarkSvg w={240} h={100}>
        <Defs>
          <RadialGradient id={`bps${id}`} cx="121" cy="86.5" rx="65" ry="5.5" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.08} />
            <Stop offset="0.5" stopColor="#000000" stopOpacity={0.058} />
            <Stop offset="0.78" stopColor="#000000" stopOpacity={0.024} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id={`bpg${id}`} cx="140" cy="36" rx="22" ry="22" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#CBDAE8" stopOpacity={0.5} />
            <Stop offset="0.74" stopColor="#CBDAE8" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={121} cy={86.5} rx={65} ry={5.5} fill={`url(#bps${id})`} />
      </MarkSvg>
      <View style={{ position: 'absolute', left: 52, top: 20, width: 10, height: 64, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomRightRadius: 3, borderBottomLeftRadius: 3, backgroundColor: '#D6D5D0' }} />
      <View style={{ position: 'absolute', left: 60, top: 52, width: 110, height: 24, borderTopLeftRadius: 6, borderTopRightRadius: 10, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 96, top: 50, width: 74, height: 26, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomRightRadius: 5, borderBottomLeftRadius: 4, backgroundColor: '#C9C8C1' }} />
      <View style={{ position: 'absolute', left: 102, top: 56, width: 58, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.55)' }} />
      <View
        style={{ position: 'absolute', left: 64, top: 43, width: 28, height: 14, borderTopLeftRadius: 7, borderTopRightRadius: 7, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, backgroundColor: '#FFFFFF', boxShadow: 'inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)' }}
      />
      <View style={{ position: 'absolute', left: 62, top: 76, width: 6, height: 8, borderBottomRightRadius: 2, borderBottomLeftRadius: 2, backgroundColor: '#C6C5C0' }} />
      <View style={{ position: 'absolute', left: 162, top: 76, width: 6, height: 8, borderBottomRightRadius: 2, borderBottomLeftRadius: 2, backgroundColor: '#C6C5C0' }} />
      <MarkSvg w={240} h={100}>
        <Circle cx={140} cy={36} r={22} fill={`url(#bpg${id})`} />
      </MarkSvg>
      <View style={{ position: 'absolute', left: 132, top: 26, width: 14, height: 22, borderRadius: 3, overflow: 'hidden', boxShadow: '0 0 8px rgba(190,210,230,0.35)', transform: [{ rotate: '8deg' }] }}>
        <MarkSvg w={14} h={22}>
          <Defs>
            <SvgLinearGradient id={`bpp${id}`} x1="0" y1="0" x2="0" y2="22" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#12151B" />
              <Stop offset="1" stopColor="#1A2027" />
            </SvgLinearGradient>
          </Defs>
          <Rect x={0} y={0} width={14} height={22} fill={`url(#bpp${id})`} />
        </MarkSvg>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------- shell */

/**
 * The chrome and the centred stack. `index` and `count` drive the hairline —
 * `round((index + 1) / count × 100)` is exactly what every frame states.
 */
export function LessonScroll({
  index,
  count,
  gap = STACK_GAP,
  chevron = false,
  onClose,
  onNext,
  footer,
  overlay,
  interactive = false,
  children,
}: {
  index: number;
  count: number;
  gap?: number;
  /** The cover alone carries the scroll chevron. */
  chevron?: boolean;
  /**
   * Whether anything in the stack takes a touch. On the canvas the whole board
   * is the control, and on a reading page nothing else is — so the stack stays
   * transparent and a tap anywhere turns the page, including a tap that lands
   * on a paragraph. Only the boards that ask a question opt in.
   */
  interactive?: boolean;
  onClose: () => void;
  onNext: () => void;
  /** The two frames that do carry a pill draw it here. */
  footer?: ReactNode;
  /**
   * The pick and task-options boards, which state their own top and foot rather
   * than being centred. They sit over the scroller, not inside it, or their
   * absolute tops would resolve against the scrolling content instead of the
   * screen.
   */
  overlay?: ReactNode;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <Grain source={noiseDark} opacity={0.07} />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']} pointerEvents="box-none">
        <View style={{ flex: 1 }} pointerEvents="box-none">
          <PressScale
            onPress={onClose}
            accessibilityRole="button"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
            style={{ position: 'absolute', left: 16, top: 12, minHeight: 0, zIndex: 5 }}>
            <AppText style={[sans('400'), { fontSize: 17, color: '#3A3934' }]}>Close</AppText>
          </PressScale>

          {/* canvas 108 — a 2pt hairline, never a dot row. The fill grows into
              its new width rather than jumping: it is the one part of the
              reader that shows progress, and a step it animates through reads
              as progress where a jump reads as a redraw. */}
          <View style={{ position: 'absolute', left: 16, right: 16, top: 54, height: 2, borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.05)', zIndex: 5 }}>
            <Animated.View
              layout={reduced ? undefined : LinearTransition.duration(320).easing(Easing.bezier(0.2, 0, 0, 1))}
              style={{ width: `${Math.round(((index + 1) / count) * 100)}%`, height: 2, borderRadius: 1, backgroundColor: '#B4B1AB' }}
            />
          </View>

          {/* The stack is `inset:0` on the canvas's whole 852 — status bar and
              home indicator included — so its centre is the screen's centre, not
              the safe box's. Pinning it to the real insets keeps that true on
              every device; pinning it to the literal 54 is only right when the
              top inset is 54 and the bottom is 0.

              It scrolls. The canvas draws every page at 852 and centres it, but
              a task page with a 190pt scene and a rule card under it is taller
              than that on a small phone, and a centred box with no scroll just
              puts the ends off-screen. `flexGrow` with a centred main axis
              keeps a page that fits exactly where the frame centres it, and
              lets a taller one move.

              The padding is symmetric on purpose: the chrome above (the Close
              row and the rail) and below (the chevron) each need about 72, and
              matching them keeps the midpoint the frame's own. */}
          <ScrollView
            // Pinned to all four edges rather than given a measured height:
            // the height came from an `onLayout` that is 0 on the first paint,
            // so the scroller opened one status bar tall and the page was
            // already scrolled out of it. Insets are negative here because this
            // sits inside the safe box and the frame centres on the whole 852.
            style={{ position: 'absolute', left: 0, right: 0, top: -insets.top, bottom: -insets.bottom }}
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 38, paddingVertical: PAGE_INSET }}
            showsVerticalScrollIndicator={false}
            // A tap anywhere still turns the page; a drag scrolls it instead.
            // A pressable inside a scroller already tells the two apart.
            keyboardShouldPersistTaps="handled">
            {/* The press target grows to fill whatever the scroller gives it,
                so a tap on the empty half of a short page turns it too. `static`
                because scaling a whole page of type on touch reads as a glitch,
                not as feedback. */}
            <PressScale
              onPress={onNext}
              accessibilityRole="button"
              accessibilityLabel="Next"
              static
              style={{ flexGrow: 1, alignSelf: 'stretch', minHeight: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View
                // Keyed on the page, so each arrives rather than the words
                // swapping under the reader mid-sentence.
                key={index}
                entering={reduced ? undefined : FadeIn.duration(220).easing(Easing.bezier(0.2, 0, 0, 1))}
                pointerEvents={interactive ? 'box-none' : 'none'}
                style={{ alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', gap }}>
                {children}
              </Animated.View>
            </PressScale>
          </ScrollView>

          {overlay}

          {/* 42 from the 852 board's own foot, which draws no home indicator */}
          {chevron ? (
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 42 - insets.bottom, alignItems: 'center', zIndex: 5 }}>
              <Svg width={22} height={12} viewBox="0 0 22 12" fill="none">
                <Path d="M2 2l9 8 9-8" stroke="#B0AEA8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          ) : null}

          {footer}
        </View>
      </SafeAreaView>
    </View>
  );
}
