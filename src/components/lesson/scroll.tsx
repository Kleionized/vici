import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, Grain, PressScale } from '@/components/ui';
import { sans } from '@/lib/theme';

/**
 * `Lesson Scroll 1…26` — the reader `UI Final` replaced the old page kinds with.
 *
 * Every frame is the same recipe: a `Close`, a 2pt progress hairline, and a
 * column centred in the **whole** 852 with `gap:48` and `padding:0 38px`. There
 * is no absolute top for any body content anywhere in the set — vertical
 * position is a function of how tall the stack is — and there is no CTA pill on
 * 24 of the 26 frames. The set is named "Scroll" and the cover's chevron says
 * why: the page advances by tapping through, not by a pinned button.
 *
 * The eight slots below are the whole vocabulary. Nothing in frames 1–26 uses a
 * text style that is not one of them.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

/** The gap between every child of the stack. The cover alone uses 36. */
const STACK_GAP = 48;
const COVER_GAP = 36;

/* ------------------------------------------------------------------- slots */

/** Cover only — authored in caps; the canvas sets no `text-transform`. */
export function Eyebrow({ children }: { children: string }) {
  return <AppText center style={[sans('600'), { fontSize: 12, letterSpacing: 1.8, color: '#B0AEA8' }]}>{children}</AppText>;
}

/** Cover only. */
export function Title({ children }: { children: string }) {
  return <AppText center style={[sans('500'), { maxWidth: 280, fontSize: 28, lineHeight: 40, color: '#1D1C1A' }]}>{children}</AppText>;
}

/** Cover only — the reading time. */
export function Meta({ children }: { children: string }) {
  return <AppText center style={[sans('500'), { fontSize: 15, color: '#8B8882' }]}>{children}</AppText>;
}

/**
 * The canvas gets three different gaps out of one `gap` value by dropping
 * zero-width spacers into the column, so a 14 spacer means 36 + 14 + 36 = 86 of
 * separation. Kept as spacers rather than margins so the arithmetic stays the
 * canvas's own.
 */
export function Spacer({ height }: { height: number }) {
  return <View style={{ height }} />;
}

/** Frame 2 and 25 — the epigraph, set in the serif the canvas names. */
export function Epigraph({ children }: { children: string }) {
  return (
    <AppText
      center
      style={{
        maxWidth: 300,
        fontFamily: "Iowan Old Style, Palatino, Georgia, serif",
        fontWeight: '500',
        fontSize: 28,
        lineHeight: 44,
        color: '#1D1C1A',
      }}>
      {children}
    </AppText>
  );
}

/** A 22 × 1.5 rule either side of a caps name. */
export function Attribution({ children }: { children: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <View style={{ width: 22, height: 1.5, backgroundColor: '#C9C7C0' }} />
      <AppText style={[sans('600'), { fontSize: 12, letterSpacing: 1.8, color: '#B0AEA8' }]}>{children}</AppText>
      <View style={{ width: 22, height: 1.5, backgroundColor: '#C9C7C0' }} />
    </View>
  );
}

/**
 * The line the page exists to land. Frame 3 declares `max-width:280` where the
 * other six declare 300; six against one, and frame 3's own copy breaks to two
 * lines at either width, so 300 is the slot's value.
 */
export function Statement({ children }: { children: string }) {
  return <AppText center style={[sans('500'), { maxWidth: 300, fontSize: 26, lineHeight: 38, color: '#1D1C1A' }]}>{children}</AppText>;
}

/**
 * The paragraph. The two colours are a rhetorical pair rather than a theme
 * switch: soft sets the situation, ink is the sentence the page is for.
 */
export function Prose({ tone = 'soft', children }: { tone?: 'soft' | 'ink'; children: string }) {
  return (
    <AppText center style={[sans('400'), { maxWidth: 310, fontSize: 21, lineHeight: 36, color: tone === 'ink' ? '#1D1C1A' : '#55534E' }]}>
      {children}
    </AppText>
  );
}

/** Three graded lines: fading for what the lesson dismisses, solid for what it keeps. */
const CASCADE_FADE = ['#8B8882', '#A5A29B', '#BBB8B1'];

export function Cascade({ lines, ramp = 'fading' }: { lines: readonly string[]; ramp?: 'fading' | 'solid' }) {
  return (
    <View style={{ alignItems: 'center', gap: 26 }}>
      {lines.map((line, index) => (
        <AppText
          key={line}
          center
          style={[sans('500'), { maxWidth: 300, fontSize: 22, lineHeight: 32, color: ramp === 'solid' ? '#1D1C1A' : CASCADE_FADE[index] ?? CASCADE_FADE[2] }]}>
          {line}
        </AppText>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------- marks */

/** Frames 2 and 5 — a plain warm dot, 12 or 14 across. */
export function SunDot({ size }: { size: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#E9D2A4' }} />;
}

/** Frame 3 — the crescent, cut out of a 34 × 30 box. */
export function CrescentMark() {
  return (
    <Svg width={34} height={30} viewBox="0 0 34 30">
      <Path d="M23 2 A14 14 0 1 0 30 15 A11.2 11.2 0 0 1 23 2Z" fill="#C6C3BC" />
    </Svg>
  );
}

/** Frame 9 — first light over the horizon. */
export function SunriseMark() {
  return (
    <View style={{ width: 240, height: 96, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', left: 96, top: 24, width: 48, height: 48, borderRadius: 24, backgroundColor: '#E9D2A4' }} />
      <View style={{ position: 'absolute', left: 0, top: 68, width: 240, height: 2, borderRadius: 1, backgroundColor: '#D6D5D0' }} />
      <View style={{ position: 'absolute', left: 40, top: 80, width: 44, height: 2, borderRadius: 1, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 156, top: 80, width: 44, height: 2, borderRadius: 1, backgroundColor: '#E0DFDA' }} />
    </View>
  );
}

/** Frame 13 — the clock, hands at the hour the night turns. */
export function ClockMark() {
  return (
    <View style={{ width: 96, height: 96 }}>
      <View style={{ position: 'absolute', left: 0, top: 0, width: 96, height: 96, borderRadius: 48, boxShadow: 'inset 0 0 0 2.5px #D6D5D0' }} />
      <View style={{ position: 'absolute', left: 46, top: 26, width: 3, height: 24, borderRadius: 1.5, backgroundColor: '#8A857C' }} />
      <View style={{ position: 'absolute', left: 46, top: 46, width: 20, height: 3, borderRadius: 1.5, backgroundColor: '#8A857C' }} />
    </View>
  );
}

/** Frame 14 — the bed, with the phone still in it. */
export function BedPhoneMark() {
  return (
    <View style={{ width: 240, height: 100, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', left: 40, top: 20, width: 10, height: 62, borderRadius: 4, backgroundColor: '#D6D5D0' }} />
      <View style={{ position: 'absolute', left: 48, top: 52, width: 120, height: 26, borderRadius: 7, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 58, top: 42, width: 40, height: 14, borderRadius: 6, backgroundColor: '#C9C8C1' }} />
      <View style={{ position: 'absolute', left: 160, top: 76, width: 8, height: 12, borderRadius: 3, backgroundColor: '#C6C5C0' }} />
      <View style={{ position: 'absolute', left: 108, top: 44, width: 18, height: 30, borderRadius: 4, backgroundColor: '#F9F8F4', boxShadow: '0 0 0 1.5px #D6D5D0' }} />
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
  children,
}: {
  index: number;
  count: number;
  gap?: number;
  /** The cover alone carries the scroll chevron. */
  chevron?: boolean;
  onClose: () => void;
  onNext: () => void;
  /** The two frames that do carry a pill draw it here. */
  footer?: ReactNode;
  children: ReactNode;
}) {
  const [height, setHeight] = useState(0);
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <Grain source={noiseDark} opacity={0.07} />

      {/* the whole board advances the page — there is no button to press */}
      <PressScale
        onPress={onNext}
        accessibilityRole="button"
        accessibilityLabel="Next"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, minHeight: 0 }}>
        <View />
      </PressScale>

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']} pointerEvents="box-none">
        <View style={{ flex: 1 }} onLayout={(e) => setHeight(e.nativeEvent.layout.height)} pointerEvents="box-none">
          <PressScale
            onPress={onClose}
            accessibilityRole="button"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
            style={{ position: 'absolute', left: 16, top: 12, minHeight: 0, zIndex: 5 }}>
            <AppText style={[sans('400'), { fontSize: 17, color: '#3A3934' }]}>Close</AppText>
          </PressScale>

          {/* canvas 108 — a 2pt hairline, never a dot row */}
          <View style={{ position: 'absolute', left: 16, right: 16, top: 54, height: 2, borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.05)', zIndex: 5 }}>
            <View style={{ width: `${Math.round(((index + 1) / count) * 100)}%`, height: 2, borderRadius: 1, backgroundColor: '#B4B1AB' }} />
          </View>

          {/* the stack is centred in the canvas's whole 852, status bar and all,
              so in app space it is centred on 372 rather than on the flow */}
          <View
            pointerEvents="box-none"
            style={{ position: 'absolute', left: 0, right: 0, top: -54, height: height + 54, alignItems: 'center', justifyContent: 'center', gap, paddingHorizontal: 38 }}>
            {children}
          </View>

          {chevron ? (
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 42, alignItems: 'center', zIndex: 5 }}>
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

export { COVER_GAP };
