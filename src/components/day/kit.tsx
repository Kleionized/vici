import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useId, useState, type ReactNode } from 'react';
import { Platform, TextInput, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, Mask, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, BackGlyph, Grain, Hill, PressScale } from '@/components/ui';
import { fonts, sans } from '@/lib/theme';

/**
 * The morning and night check-ins (frames 126–135, 158–159).
 *
 * Both flows run the same skeleton — a dotted rail, a back affordance, a
 * left-aligned question and one ink pill at the foot — so everything shared
 * lives here and the two screens only describe their middles. Every child is
 * absolutely placed at the canvas's own `top` minus the 54pt status bar, so the
 * numbers below are the canvas numbers.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');
const laurelMark = require('../../../assets/images/laurel-mark.webp');

/* ------------------------------------------------------------------- softeners */

/**
 * A CSS `radial-gradient(closest-side, …)` disc. Where the canvas also blurs
 * one, the gradient's own falloff stands in — RN SVG has no blur filter.
 */
function Glow({ size, color, opacity, stop, style }: { size: number; color: string; opacity: number; stop: number; style: StyleProp<ViewStyle> }) {
  const id = `dg${useId().replace(/:/g, '')}`;
  return (
    <View pointerEvents="none" style={style}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset={stop} stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

/**
 * A blurred solid ellipse (the shadow an object casts), redrawn as a gradient.
 * `color` is the canvas's own ink: the ledger casts a warm rgba(40,38,32,·)
 * shadow, the cup and the notebook a neutral rgba(0,0,0,·).
 */
function SoftShadow({ width, height, opacity, color, style }: { width: number; height: number; opacity: number; color: string; style: StyleProp<ViewStyle> }) {
  const id = `ds${useId().replace(/:/g, '')}`;
  return (
    <View pointerEvents="none" style={style}>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset="0.55" stopColor={color} stopOpacity={opacity} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

/**
 * A hill: the canvas gives these an elliptical top (`50% 50% 0 0 / 68px …`),
 * which RN's single-value radii cannot express, so the dome is an SVG arc.
 * `left`/`right` are the canvas insets, so both are negative when it overhangs.
 */

/* ------------------------------------------------------------------- the shell */

/** The rail: the step you are on is a stadium, the rest are dots. */
export function DayDots({ step, count, light = false }: { step: number; count: number; light?: boolean }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 18, flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            width: i === step ? 18 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i === step ? (light ? '#F4F3F0' : '#131313') : light ? 'rgba(244,243,240,0.35)' : 'rgba(19,19,19,0.18)',
          }}
        />
      ))}
    </View>
  );
}

/**
 * Where the ink pill sits. The canvas states a `top` (756, so 702 under the
 * status bar), which is the number to hit whenever the screen is tall enough to
 * hold it. `CTA_FLOOR` is the air the canvas leaves below the pill once the
 * home indicator has taken its 34, so on a screen too short for 702 the pill
 * settles on that floor instead of walking off the bottom edge.
 */
const CTA_TOP = 702;
const CTA_HEIGHT = 52;
const CTA_FLOOR = 10;

/** `Checkin Emotions` / `Checkin Reasons`: canvas 744, 58 tall, 24 gutters. */
const WIDE_CTA_TOP = 690;
const WIDE_CTA_HEIGHT = 58;
const WIDE_CTA_FLOOR = 16;

/**
 * The band an action card is centred in: from just under the board's title down
 * to just above whatever control the step puts at its foot.
 *
 * The card used to be pinned by a `top` copied straight off a frame. Those tops
 * were drawn when an honesty line still sat under the discs; with the line gone
 * the card stands high and leaves a void beneath it — 42 above and 176 below on
 * an 852 board — and the void grows on a taller phone, because the title is
 * pinned to the top and the control to the foot while nothing holds the middle.
 * Centring the card in what is left holds at any height (DECISIONS D-117).
 *
 * `bottom` is the control's own clearance off the foot — the band runs to the
 * top of it exactly, so the air above the card and the air below it are equal.
 */
export const BAND_TOP = 90;

export function ActionBand({ top = BAND_TOP, bottom, children }: { top?: number; bottom: number; children: ReactNode }) {
  return <View style={{ position: 'absolute', left: 0, right: 0, top, bottom, justifyContent: 'center' }}>{children}</View>;
}

/**
 * The way back out, which the canvas now draws on every step of both flows —
 * chevron plus the word, in the same warm grey whatever it sits on.
 */
export function DayBack({ onPress }: { onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      style={{ position: 'absolute', left: 16, top: 12, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <BackGlyph color="#55534E" />
      <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
    </PressScale>
  );
}

export function DayShell({
  rail,
  onBack,
  cta,
  ctaLabel,
  /**
   * The two boards `UI Final` moved in from the standalone check-in draw a
   * wider, taller pill than the rest of the flow: 24 either side at canvas 744,
   * 58 tall on a 29 radius, against the flow's 16 / 756 / 52 / 26.
   */
  ctaWide = false,
  /** The flow's usable height, for callers that place their own pill. */
  onMeasure,
  children,
  /** Art that bleeds to the top edge, drawn under the status bar. */
  backdrop,
  footer,
}: {
  /** Whatever this step puts on the rail line — flow dots, action dots, nothing. */
  rail?: ReactNode;
  onBack?: () => void;
  cta?: () => void;
  ctaLabel?: string;
  children: ReactNode;
  backdrop?: ReactNode;
  ctaWide?: boolean;
  onMeasure?: (height: number) => void;
  /** Drawn instead of the ink pill on the steps the canvas gives their own controls. */
  footer?: ReactNode;
}) {
  const [height, setHeight] = useState(0);
  const top = ctaWide ? WIDE_CTA_TOP : CTA_TOP;
  const pill = ctaWide ? WIDE_CTA_HEIGHT : CTA_HEIGHT;
  const floor = ctaWide ? WIDE_CTA_FLOOR : CTA_FLOOR;
  const ctaTop = height ? Math.min(top, height - pill - floor) : top;
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <Grain source={noiseDark} opacity={0.07} />
      {backdrop}
      {/* Only the top inset is spent. The canvas's 852 already contains the
          home-indicator zone, so a canvas `bottom: 84` is 84 off the screen's
          own edge — taking the bottom inset here would lift every
          bottom-anchored element another 34 above where the frame draws it, and
          would move with the device rather than with the design. */}
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View
          style={{ flex: 1 }}
          onLayout={(e) => {
            setHeight(e.nativeEvent.layout.height);
            onMeasure?.(e.nativeEvent.layout.height);
          }}>
          {rail}
          {onBack ? <DayBack onPress={onBack} /> : null}

          {children}

          {footer ??
            (cta ? (
              <PressScale
                onPress={cta}
                accessibilityRole="button"
                style={{
                  position: 'absolute',
                  left: ctaWide ? 24 : 16,
                  right: ctaWide ? 24 : 16,
                  top: ctaTop,
                  height: pill,
                  minHeight: pill,
                  borderRadius: pill / 2,
                  backgroundColor: '#131313',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AppText style={[sans('600'), { fontSize: 17, letterSpacing: ctaWide ? 0.2 : 0, color: '#FFFFFF' }]}>{ctaLabel}</AppText>
              </PressScale>
            ) : null)}
        </View>
      </SafeAreaView>
    </View>
  );
}

/** The pill the two action screens end on — taller than the flow's, and lifted. */
export function ActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        // the canvas's own offset off the frame's bottom edge
        bottom: 84,
        height: 54,
        minHeight: 54,
        borderRadius: 27,
        backgroundColor: '#131313',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText style={[sans('600'), { fontSize: 16.5, letterSpacing: 0.2, color: '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

/** The centred question the action screens open with — shorter and centred. */
export function ActionTitle({ children }: { children: ReactNode }) {
  return (
    <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 64, fontSize: 22, letterSpacing: 0.1, color: '#1D1C1A' }]}>
      {children}
    </AppText>
  );
}

/**
 * The left-aligned question every step opens with. The canvas gives it a `left`
 * and no right bound, so the line box runs to the frame edge — not to a margin.
 */
export function DayTitle({ top, children }: { top: number; children: ReactNode }) {
  return (
    <AppText style={[sans('500'), { position: 'absolute', left: 24, top, fontSize: 27, letterSpacing: -0.1, color: '#1D1C1A' }]}>
      {children}
    </AppText>
  );
}

/* ------------------------------------------------------------------- the scales */

/** Five circles: how the day feels. */
export function MoodDial({ value, onChange, top, label = 'Level' }: { value: number; onChange: (v: number) => void; top: number; label?: string }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top, flexDirection: 'row', justifyContent: 'space-between' }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const on = i === value;
        return (
          <PressScale
            key={i}
            onPress={() => onChange(i)}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${label} ${i + 1} of 5`}
            style={{
              width: 48,
              height: 48,
              minHeight: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: on ? '#131313' : '#FFFFFF',
              boxShadow: on ? '0 0 0 2px #F4F3F0, 0 0 0 4px #131313' : 'inset 0 0 0 1.5px rgba(0,0,0,0.12)',
            }}>
            {on ? <View style={{ width: 11, height: 11, borderRadius: 5.5, backgroundColor: '#F4F3F0' }} /> : null}
          </PressScale>
        );
      })}
    </View>
  );
}


/** What the scale currently reads, said back in words rather than a number. */
export function ScaleReading({ top, label, note }: { top: number; label: string; note: string }) {
  return (
    <>
      <AppText center style={[sans('600'), { position: 'absolute', left: 0, right: 0, top, fontSize: 19, color: '#1D1C1A' }]}>
        {label}
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: top + 30, fontSize: 13.5, color: '#8B8882' }]}>
        {note}
      </AppText>
    </>
  );
}

/**
 * `21D5B · Change the pledge` — the sheet behind the re-sign page's link.
 *
 * Its shell is not the app's existing sheet shell: the scrim, the radius, the
 * grabber, the shadow and the ground all differ from `ProfileSheet` and
 * `SignOutSheet`, and no other frame in the bundle shares these values, so this
 * is a second sheet rather than a new caller of the first.
 *
 * The sheet is 532 tall off the screen's own bottom edge (canvas `top: 320` in
 * an 852 frame), and every number inside it is sheet-relative — the −54 rule
 * does not apply below its own top (`DECISIONS.md` D009). The empty band under
 * the last link is the keyboard's; the frame is drawn keyboard-down.
 *
 * The canvas paints the screen underneath as three flat grey blocks at 45%.
 * They match nothing the re-sign page actually draws, so they are the frame's
 * stand-in for a screenshot and are not built — the live screen is behind the
 * scrim instead.
 */
export function ChangePledgeSheet({
  pledge,
  onKeep,
  onSign,
}: {
  /** The standing pledge, which the field opens on. */
  pledge: string;
  onKeep: () => void;
  onSign: (next: string) => void;
}) {
  const [text, setText] = useState(pledge);
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <PressScale
        onPress={onKeep}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, minHeight: 0, backgroundColor: 'rgba(38,37,30,0.42)' }}>
        {null}
      </PressScale>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 532,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          backgroundColor: '#F4F3F0',
          boxShadow: '0 -12px 36px rgba(20,19,16,0.22)',
        }}>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -18, top: 10, width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.15)' }} />
        {/* the canvas's gutters here are asymmetric — 24 left, 40 right */}
        <AppText style={[sans('500'), { position: 'absolute', left: 24, right: 40, top: 44, fontSize: 22, lineHeight: 29, letterSpacing: -0.2, color: '#1D1C1A' }]}>
          Change the pledge
        </AppText>
        <AppText style={[sans('400'), { position: 'absolute', left: 24, right: 24, top: 80, fontSize: 13, color: '#8B8882' }]}>
          One promise you can keep every day.
        </AppText>
        <View style={{ position: 'absolute', left: 16, right: 16, top: 116, height: 126, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
          {/* the canvas's 2 × 19 bar after the words is its stand-in for a text
              cursor; the platform draws its own (`DECISIONS.md` D025) */}
          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            style={[
              { position: 'absolute', left: 18, right: 18, top: 16, height: 94, fontFamily: fonts.sans, fontWeight: '500', fontSize: 17, lineHeight: 26, color: '#1D1C1A', padding: 0 },
              Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
            ]}
          />
        </View>
        <PressScale
          onPress={() => onSign(text)}
          accessibilityRole="button"
          style={{ position: 'absolute', left: 16, right: 16, top: 274, height: 52, minHeight: 0, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: '#131313' }}>
          <AppText style={[sans('600'), { fontSize: 17, color: '#FFFFFF' }]}>Sign the new pledge</AppText>
        </PressScale>
        <PressScale
          onPress={onKeep}
          accessibilityRole="button"
          hitSlop={{ top: 14, bottom: 14, left: 24, right: 24 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 346, minHeight: 0 }}>
          <AppText center style={[sans('500'), { fontSize: 13.5, color: '#8B8882' }]}>Keep current pledge</AppText>
        </PressScale>
      </View>
    </View>
  );
}

/* ---------------------------------------------------------------- the drawings */

/**
 * The morning sky the five new morning frames open on.
 *
 * `21D0 · Cover`, `21D3 · Feeling`, `21D4 · Energy`, `21D5 · Re-sign` and
 * `21D6 · Done` all draw one composition — a blurred warm radial, a flat
 * `#E9D2A4` disc, nought or two white cloud bars, and two hills fading into the
 * paper — and no two of them draw it at the same numbers. Every value that
 * varies is a prop, and none of them is normalised: the four glows are three
 * different warms (`rgba(226,186,120,·)`, `rgba(226,162,90,·)`,
 * `rgba(226,176,104,·)`) and Energy's hills are warmer than the rest.
 *
 * This is passed as `DayShell`'s `backdrop`, never as a child: Energy's glow
 * starts at canvas `top: -8` and Re-sign's at `-13`, so both have to bleed under
 * the status bar. A backdrop is rendered outside the safe-area inset, so the
 * tops below are the canvas's own, unadjusted (`DECISIONS.md` D009).
 *
 * The canvas blurs every glow 4px. `Glow` has no blur term and does not need one
 * — a closest-side radial already dies at its own edge (D010).
 */
export function MorningSky({
  glow,
  disc,
  clouds = [],
  hills,
}: {
  glow: { top: number; size: number; color: string; opacity: number };
  disc: { top: number; size: number };
  /** `[left, top, width, height, alpha]`, in the canvas's own order. */
  clouds?: [number, number, number, number, number][];
  hills: [
    { top: number; height: number; rise: number; color: string; fade: [number, number] },
    { top: number; height: number; rise: number; color: string; fade: [number, number] },
  ];
}) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      <Glow
        size={glow.size}
        color={glow.color}
        opacity={glow.opacity}
        stop={0.72}
        style={{ position: 'absolute', left: '50%', marginLeft: -glow.size / 2, top: glow.top }}
      />
      <View
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: -disc.size / 2,
          top: disc.top,
          width: disc.size,
          height: disc.size,
          borderRadius: disc.size / 2,
          backgroundColor: '#E9D2A4',
        }}
      />
      {clouds.map(([left, top, width, height, alpha]) => (
        <View
          key={`${left}-${top}`}
          style={{ position: 'absolute', left, top, width, height, borderRadius: 5, backgroundColor: `rgba(255,255,255,${alpha})` }}
        />
      ))}
      {/* hill A is inset −80 either side, hill B −150 / −50, on every frame */}
      <Hill height={hills[0].height} rise={hills[0].rise} color={hills[0].color} fade={hills[0].fade} style={{ position: 'absolute', left: -80, right: -80, top: hills[0].top }} />
      <Hill height={hills[1].height} rise={hills[1].rise} color={hills[1].color} fade={hills[1].fade} style={{ position: 'absolute', left: -150, right: -50, top: hills[1].top }} />
    </View>
  );
}

/** Frame 116: yesterday's two pages, the pen laid across them, and the mark. */
export function LedgerMark({ top }: { top: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top, height: 190 }}>
      <Glow size={140} color="#E2BA78" opacity={0.38} stop={0.75} style={{ position: 'absolute', left: '50%', marginLeft: -34, top: 6 }} />
      <SoftShadow width={180} height={20} opacity={0.1} color="#282620" style={{ position: 'absolute', left: '50%', marginLeft: -90, top: 134 }} />

      <View
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: -86,
          top: 34,
          width: 80,
          height: 98,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 3,
          borderBottomRightRadius: 3,
          borderBottomLeftRadius: 8,
          backgroundColor: '#F7F6F2',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
          transform: [{ rotate: '-5deg' }],
        }}>
        <View style={{ position: 'absolute', left: 12, top: 16, width: 44, height: 5, borderRadius: 3, backgroundColor: '#DBDAD3' }} />
        <View style={{ position: 'absolute', left: 12, top: 29, width: 52, height: 5, borderRadius: 3, backgroundColor: '#E1E0D9' }} />
        <View style={{ position: 'absolute', left: 12, top: 42, width: 38, height: 5, borderRadius: 3, backgroundColor: '#E1E0D9' }} />
      </View>

      <View
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: -4,
          top: 30,
          width: 80,
          height: 98,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          borderBottomLeftRadius: 3,
          backgroundColor: '#F7F6F2',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
          transform: [{ rotate: '3deg' }],
        }}>
        <View style={{ position: 'absolute', left: 14, top: 16, width: 40, height: 5, borderRadius: 3, backgroundColor: '#DBDAD3' }} />
        <View style={{ position: 'absolute', left: 14, top: 29, width: 48, height: 5, borderRadius: 3, backgroundColor: '#E1E0D9' }} />
      </View>

      <View style={{ position: 'absolute', left: '50%', marginLeft: -6, top: 66, width: 92, height: 7, borderRadius: 4, backgroundColor: '#55534E', transform: [{ rotate: '-33deg' }] }} />

      <View style={{ position: 'absolute', left: '50%', marginLeft: 56, top: 12, width: 30, height: 30, borderRadius: 15, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={13} height={11} viewBox="0 0 16 13" fill="none">
          <Path d="M1.5 7l4.4 4.5L14.5 1.5" stroke="#F4F3F0" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
    </View>
  );
}

const STARS: [number, number, number, number][] = [
  [60, 52, 2.5, 0.6],
  [110, 92, 2, 0.4],
  [158, 44, 2, 0.5],
  [210, 84, 2.5, 0.35],
  [84, 128, 2, 0.3],
];

/**
 * The crescent. `Night 1 Mood` now cuts it out of the 34pt disc with
 *
 *   mask-image: radial-gradient(circle 15px at 67% 30%, transparent 0 13.5px, #000 14.5px)
 *
 * rather than covering it with a second, 0.55-opacity disc. 67% and 30% of the
 * 34 box put the hole's centre at (22.78, 10.2); the cut is clean to 13.5 and
 * feathers over the last pixel, so the mask is a hard-stopped radial.
 *
 * The disc's own `box-shadow: 0 0 18px rgba(221,228,236,0.5)` cannot ride on a
 * masked shape, so it is redrawn as the falloff it actually is: a blur is a
 * Gaussian of σ = blur/2, which reaches half the stated alpha at the shape's
 * edge and is gone by 2σ past it. On a 17 + 18 = 35 radius that puts the edge
 * at 0.486 and the stops on erfc.
 */
function NightMoon() {
  const id = useId().replace(/:/g, '');
  return (
    <View pointerEvents="none" style={{ position: 'absolute', right: 104, top: 60, width: 34, height: 34 }}>
      <Svg width={70} height={70} style={{ position: 'absolute', left: -18, top: -18 }}>
        <Defs>
          <RadialGradient id={`ms${id}`} cx="35" cy="35" rx="35" ry="35" gradientUnits="userSpaceOnUse">
            <Stop offset="0.486" stopColor="#DDE4EC" stopOpacity={0.25} />
            <Stop offset="0.614" stopColor="#DDE4EC" stopOpacity={0.154} />
            <Stop offset="0.743" stopColor="#DDE4EC" stopOpacity={0.079} />
            <Stop offset="0.871" stopColor="#DDE4EC" stopOpacity={0.034} />
            <Stop offset="1" stopColor="#DDE4EC" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={35} cy={35} r={35} fill={`url(#ms${id})`} />
      </Svg>
      <Svg width={34} height={34} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <RadialGradient id={`mc${id}`} cx="22.78" cy="10.2" rx="14.5" ry="14.5" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#000000" />
            <Stop offset="0.931" stopColor="#000000" />
            <Stop offset="1" stopColor="#FFFFFF" />
          </RadialGradient>
          <Mask id={`mm${id}`}>
            <Rect x={0} y={0} width={34} height={34} fill="#FFFFFF" />
            <Circle cx={22.78} cy={10.2} r={14.5} fill={`url(#mc${id})`} />
          </Mask>
        </Defs>
        <Circle cx={17} cy={17} r={17} fill="#DDE4EC" mask={`url(#mm${id})`} />
      </Svg>
    </View>
  );
}

/**
 * `21D0 · Morning — Check-in` and `21E0 · Night — Check-in`.
 *
 * New in `UI Final 1`: a cover the check-in opens on. One drawing in two
 * registers — the morning is paper under a rising sun, the night the same
 * composition after dark with three stars in it — so both are built here and
 * differ only in the numbers the frames state.
 *
 * The hills fade out rather than fill flat, which is why `Hill` takes a `fade`.
 */
export function CheckinCover({
  part,
  day,
  onBegin,
}: {
  part: 'morning' | 'night';
  day: number;
  onBegin: () => void;
}) {
  const night = part === 'night';
  return (
    <View style={{ flex: 1, backgroundColor: night ? '#21262F' : '#F4F3F0' }}>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        {night ? <LinearGradient colors={['#21262F', '#2B2E36', '#47403A']} locations={[0, 0.55, 1]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} /> : null}
        <Grain source={noiseDark} opacity={0.07} />
        {night ? (
          <>
            <View style={{ position: 'absolute', left: 118, top: 148, width: 2.5, height: 2.5, borderRadius: 1.25, backgroundColor: 'rgba(226,232,240,0.7)' }} />
            <View style={{ position: 'absolute', left: 284, top: 172, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(226,232,240,0.5)' }} />
            <View style={{ position: 'absolute', left: 206, top: 120, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(226,232,240,0.45)' }} />
          </>
        ) : null}
        <Glow
          size={night ? 300 : 320}
          color={night ? '#D68C64' : '#E2BA78'}
          opacity={night ? 0.5 : 0.3}
          stop={0.72}
          style={{ position: 'absolute', left: '50%', marginLeft: night ? -150 : -160, top: night ? 76 : 120 }}
        />
        <View
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: night ? -26 : -27,
            top: night ? 200 : 242,
            width: night ? 52 : 54,
            height: night ? 52 : 54,
            borderRadius: night ? 26 : 27,
            backgroundColor: night ? '#E4B48E' : '#E9D2A4',
          }}
        />
        {night ? null : (
          <>
            <View style={{ position: 'absolute', left: 84, top: 176, width: 54, height: 9, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.7)' }} />
            <View style={{ position: 'absolute', left: 252, top: 200, width: 40, height: 8, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.55)' }} />
          </>
        )}
        {night ? (
          <>
            <Hill height={150} rise={88} color="#272D37" fade={[0.3, 0.9]} style={{ position: 'absolute', left: -80, right: -80, top: 280 }} />
            <Hill height={150} rise={70} color="#20252E" fade={[0.3, 0.9]} style={{ position: 'absolute', left: -150, right: -50, top: 312 }} />
          </>
        ) : (
          <>
            <Hill height={200} rise={88} color="#E7E5DB" fade={[0.3, 0.9]} style={{ position: 'absolute', left: -80, right: -80, top: 268 }} />
            <Hill height={190} rise={70} color="#DFDDD2" fade={[0, 0.78]} style={{ position: 'absolute', left: -150, right: -50, top: 306 }} />
          </>
        )}
      </View>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 508 - 54, fontSize: 27, letterSpacing: -0.1, color: night ? '#F4F3F0' : '#1D1C1A' }]}>
            {night ? 'Night check-in.' : 'Morning check-in.'}
          </AppText>
          <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: 550 - 54, fontSize: 14.5, color: night ? 'rgba(244,243,240,0.55)' : '#8B8882' }]}>
            {`Day ${day} · two minutes`}
          </AppText>
          <PressScale
            onPress={onBegin}
            accessibilityRole="button"
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              top: 756 - 54,
              height: 52,
              minHeight: 0,
              borderRadius: 26,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: night ? '#F4F3F0' : '#131313',
            }}>
            <AppText style={[sans('600'), { fontSize: 17, color: night ? '#131313' : '#FFFFFF' }]}>{night ? 'Close the day' : `Begin day ${day}`}</AppText>
          </PressScale>
        </View>
      </SafeAreaView>
    </View>
  );
}

/**
 * `21E1 · Night — How was today` opens on a warm sky rather than the cold one
 * the closing frame keeps: the horizon browns off, the moon is a plain disc
 * rather than a crescent, there are three stars instead of five, and both hills
 * fade out instead of filling flat.
 */
export function WarmNightSky() {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 212, overflow: 'hidden' }}>
      <LinearGradient colors={['#171A20', '#202129', '#33302B']} locations={[0, 0.55, 1]} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 212 }} />
      {/* the canvas inverts the old sky's paint order: stars first, then the
          warm glow over them, then the disc — so the glow tints the stars */}
      <View style={{ position: 'absolute', left: 96, top: 44, width: 2.5, height: 2.5, borderRadius: 1.25, backgroundColor: 'rgba(226,232,240,0.6)' }} />
      <View style={{ position: 'absolute', left: 238, top: 30, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(226,232,240,0.45)' }} />
      <View style={{ position: 'absolute', left: 300, top: 70, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(226,232,240,0.35)' }} />
      <Glow size={200} color="#D68C64" opacity={0.42} stop={0.72} style={{ position: 'absolute', left: '50%', marginLeft: -100, top: 24 }} />
      <View style={{ position: 'absolute', left: '50%', marginLeft: -22, top: 118, width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8B488' }} />
      <Hill height={110} rise={46} color="#232830" fade={[0.45, 1]} style={{ position: 'absolute', left: -60, right: -60, top: 138 }} />
      <Hill height={110} rise={44} color="#1C2129" fade={[0.5, 1]} style={{ position: 'absolute', left: -120, right: -30, top: 158 }} />
      <View style={{ position: 'absolute', left: 70, top: 180, width: 18, height: 2.5, borderRadius: 2, backgroundColor: 'rgba(244,243,240,0.12)' }} />
    </View>
  );
}

/**
 * Frames 121 / 124: the night band the evening check-in opens under — a cold
 * gradient, a gibbous moon, a few stars and two hills closing the horizon.
 */
export function NightSky({ height, hillTop }: { height: number; hillTop: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height, overflow: 'hidden' }}>
      <LinearGradient colors={['#14171B', '#1A2027', '#232B34']} locations={[0, 0.55, 1]} style={{ position: 'absolute', left: 0, right: 0, top: 0, height }} />
      <Glow size={110} color="#E2E8F0" opacity={0.22} stop={0.78} style={{ position: 'absolute', right: 74, top: 30 }} />
      <NightMoon />
      {STARS.map(([left, starTop, size, opacity]) => (
        <View
          key={`${left}-${starTop}`}
          style={{ position: 'absolute', left, top: starTop, width: size, height: size, borderRadius: size / 2, backgroundColor: `rgba(244,243,240,${opacity})` }}
        />
      ))}
      <Hill height={110} rise={50} color="#1C232B" style={{ position: 'absolute', left: -60, right: -60, top: hillTop }} />
      <Hill height={110} rise={44} color="#242C36" style={{ position: 'absolute', left: -120, right: -30, top: hillTop + 20 }} />
      <View style={{ position: 'absolute', left: 70, top: hillTop + 30, width: 18, height: 2.5, borderRadius: 2, backgroundColor: 'rgba(244,243,240,0.14)' }} />
    </View>
  );
}

/** Frame 122: the day's notebook, open, pen across the gutter. */
export function JournalMark({ top }: { top: number }) {
  // the canvas states `left: 86px`, not a centring — on a 393 frame a centred
  // 220 box would land on 86.5
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 86, top, width: 220, height: 160 }}>
      <Glow size={130} color="#8E99A8" opacity={0.28} stop={0.74} style={{ position: 'absolute', left: 44, top: 6 }} />
      <SoftShadow width={120} height={12} opacity={0.1} color="#000000" style={{ position: 'absolute', left: 50, top: 134 }} />
      <View style={{ position: 'absolute', left: 48, top: 38, width: 126, height: 94, borderRadius: 10, backgroundColor: '#E0DFDA', transform: [{ rotate: '-2deg' }] }} />
      <View style={{ position: 'absolute', left: 54, top: 32, width: 114, height: 94, borderRadius: 8, backgroundColor: '#F7F6F2', boxShadow: '0 0 0 1px rgba(0,0,0,0.05)', transform: [{ rotate: '-2deg' }] }} />
      <View style={{ position: 'absolute', left: 110, top: 34, width: 2, height: 88, backgroundColor: '#E0DFDA', transform: [{ rotate: '-2deg' }] }} />
      <View style={{ position: 'absolute', left: 66, top: 54, width: 34, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 66, top: 68, width: 34, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 66, top: 82, width: 24, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 122, top: 52, width: 34, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 122, top: 66, width: 26, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 140, top: 84, width: 64, height: 8, borderRadius: 4, backgroundColor: '#55534E', transform: [{ rotate: '-28deg' }], transformOrigin: 'left center' }} />
      <View style={{ position: 'absolute', left: 196, top: 52, width: 8, height: 8, borderRadius: 2, backgroundColor: '#B4B1AB', transform: [{ rotate: '17deg' }] }} />
    </View>
  );
}

/** Frames 120 / 124: the white disc the closing screen puts its mark in. */
export function DayBadge({ top, mark }: { top: number; mark: 'laurel' | 'check' }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top, alignItems: 'center' }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 8px 18px rgba(40,38,32,0.12)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {mark === 'laurel' ? (
          <Image source={laurelMark} contentFit="contain" style={{ width: 34, height: 34 }} />
        ) : (
          <Svg width={22} height={18} viewBox="0 0 16 13" fill="none">
            <Path d="M1.5 7l4.4 4.5L14.5 1.5" stroke="#131313" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        )}
      </View>
    </View>
  );
}

/** The two centred lines under the badge on the closing screens. */
export function DayClosing({ top, headline, note }: { top: number; headline: string; note: string }) {
  return (
    <>
      <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top, fontSize: 27, letterSpacing: -0.1, color: '#1D1C1A' }]}>
        {headline}
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: top + 42, fontSize: 14.5, color: '#8B8882' }]}>
        {note}
      </AppText>
    </>
  );
}

/* ------------------------------------------------------------------- the record */

/** The circular-arrow "give me another" mark, at the two sizes the canvas uses. */
export function RerollGlyph({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M13.5 6.5A6 6 0 1 0 14 9" stroke="#8B8882" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M14 3v3.5h-3.5" stroke="#8B8882" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export type DayMark = 'gauge' | 'wave' | 'check' | 'play' | 'cross';

/**
 * The four glyphs the record uses. The canvas sizes them per row without
 * keeping the viewBox's ratio, so both dimensions come from the caller.
 */
export function DayGlyph({ mark, w, h }: { mark: DayMark; w: number; h: number }) {
  if (mark === 'gauge') {
    return (
      <Svg width={w} height={h} viewBox="0 0 22 13" fill="none">
        <Path d="M2,11 A9,9 0 0 1 20,11" stroke="rgba(19,19,19,0.15)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M2,11 A9,9 0 0 1 16.5,4" stroke="#131313" strokeWidth={3} strokeLinecap="round" />
      </Svg>
    );
  }
  if (mark === 'wave') {
    return (
      <Svg width={w} height={h} viewBox="0 0 26 20" fill="none">
        <Path d="M2 13c4-8 9 3 13-3s7 2 9-2" stroke="#131313" strokeWidth={2.4} strokeLinecap="round" />
      </Svg>
    );
  }
  if (mark === 'check') {
    return (
      <Svg width={w} height={h} viewBox="0 0 16 13" fill="none">
        <Path d="M1.5 7l4.4 4.5L14.5 1.5" stroke="#131313" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (mark === 'cross') {
    // `21E5 · Night — Record`'s relapse row: an amber saltire on a sand plate
    return (
      <Svg width={w} height={h} viewBox="0 0 17 17" fill="none">
        <Path d="M4.5 4.5L12.5 12.5M12.5 4.5L4.5 12.5" stroke="#A87B24" strokeWidth={2.2} strokeLinecap="round" />
      </Svg>
    );
  }
  return (
    <Svg width={w} height={h} viewBox="0 0 18 22" style={{ marginLeft: 2 }}>
      <Path d="M3 2v18L16.5 11z" fill="#131313" />
    </Svg>
  );
}

/**
 * Frame 116: one line of yesterday's ledger — a glyph chip, what happened, and
 * the number beside it. Rows are placed by the caller at the canvas's own tops.
 */
export function LedgerRow({ top, mark, glyph, title, detail, plate = '#F1EFE9', strong = false }: { top: number; mark: DayMark; glyph: [number, number]; title: string; detail?: string; plate?: string; strong?: boolean }) {
  return (
    <View style={{ position: 'absolute', left: 16, right: 16, top, height: 48, flexDirection: 'row', alignItems: 'center', gap: 13 }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: plate, alignItems: 'center', justifyContent: 'center' }}>
        <DayGlyph mark={mark} w={glyph[0]} h={glyph[1]} />
      </View>
      <AppText style={[sans('500'), { flex: 1, fontSize: 15, color: '#1D1C1A' }]}>{title}</AppText>
      {detail ? (
        <AppText style={[sans(strong ? '600' : '500'), { fontSize: 13.5, color: strong ? '#131313' : '#8B8882' }]}>{detail}</AppText>
      ) : null}
    </View>
  );
}

/** The hairline between two ledger rows. */
export function LedgerRule({ top }: { top: number }) {
  return <View style={{ position: 'absolute', left: 16, right: 16, top, height: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} />;
}

/* ------------------------------------------------------------------ the action */

/**
 * One concrete thing to do, and the frames it appears in. The first line of
 * each list is the one the canvas draws; the rest keep the ask from becoming
 * wallpaper. Both are picked by day number, so a day always asks the same thing
 * twice — once tonight, once when the morning asks whether it happened.
 */
export const NIGHT_ACTIONS = [
  'Put your phone somewhere difficult to access before you sleep.',
  'Set out tomorrow’s clothes before the lights go off.',
  'Leave the charger in another room tonight.',
  'Read a page of something on paper before bed.',
  'Decide now what time you are getting up.',
];

export const DAY_ACTIONS = [
  'Write down each trigger the moment you notice it.',
  'Take the first walk before you take the first scroll.',
  'Eat one proper meal sitting down.',
  'Tell one person one true thing about today.',
  'Put the phone in another room for an hour.',
];

/** Day one is the first line; after that the list simply turns over. */
export const nightAction = (day: number) => NIGHT_ACTIONS[Math.max(0, day - 1) % NIGHT_ACTIONS.length];
export const dayAction = (day: number) => DAY_ACTIONS[Math.max(0, day - 1) % DAY_ACTIONS.length];

/** The card art is inset 56 either side of the frame, so it is what is left. */
function useArtWidth() {
  return useWindowDimensions().width - 112;
}

const MOON_PATH = 'M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z';

/** The waxing moon the night screens are marked with. */
export function MoonGlyph({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={MOON_PATH} fill={color} />
    </Svg>
  );
}

/**
 * The bed the night's action is marked with — `Night Action Reminder` draws it
 * at 16 in a 20-unit box, so the strokes are heavier per unit than the sun's.
 */
export function BedGlyph({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M3 15.5V6" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={5.6} cy={8.9} r={1.5} fill={color} />
    </Svg>
  );
}

/** The sun the day's own action is marked with. */
export function SunGlyph({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4.5} fill={color} />
      <Path
        d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9L19 19M19 5l-2.1 2.1M7.1 16.9L5 19"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * The bed the action card is laid on: the room you walk into, with the phone
 * already shelved across it and the seal on tonight's promise.
 *
 * `Morning Task Check` and `Night Action Reminder` draw this scene identically
 * in `UI Final` — every number below is common to both frames — so the two-way
 * variant the old desk scene needed is gone.
 */
const NIGHT_SPECKS: (ViewStyle & { key: string })[] = [
  { key: 'a', left: 64, top: 40, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.45)' },
  { key: 'b', left: 104, top: 72, width: 1.5, height: 1.5, borderRadius: 0.75, backgroundColor: 'rgba(244,243,240,0.3)' },
  { key: 'c', right: 40, top: 34, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.35)' },
  { key: 'd', right: 96, top: 58, width: 1.5, height: 1.5, borderRadius: 0.75, backgroundColor: 'rgba(244,243,240,0.3)' },
];

export function NightActionArt() {
  const w = useArtWidth();
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 248, overflow: 'hidden' }}>
      <LinearGradient colors={['#0B0C0F', '#12151B', '#1A2027']} locations={[0, 0.6, 1]} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 248 }} />
      {NIGHT_SPECKS.map(({ key, ...speck }) => (
        <View key={key} style={[{ position: 'absolute' }, speck]} />
      ))}
      <Glow size={56} color="#DFDCD3" opacity={0.16} stop={0.72} style={{ position: 'absolute', left: 22, top: 26 }} />
      <View style={{ position: 'absolute', left: 37, top: 41 }}>
        <MoonGlyph size={26} color="#E8E6DC" />
      </View>

      {/* the ridge is drawn in the card's own 281 × 248 box and stretched, so a
          wider phone widens the hills rather than cropping them */}
      <Svg width={w} height={248} viewBox="0 0 281 248" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0 }}>
        <Path d="M-4,248 L-4,196 Q60,178 140,190 Q210,200 285,186 L285,248 Z" fill="#171B22" />
      </Svg>

      {/* the bed: headboard, mattress, pillow, and the foot showing past it */}
      <View style={{ position: 'absolute', left: 38, top: 152, width: 8, height: 58, borderRadius: 3, backgroundColor: '#2C3844' }} />
      <View style={{ position: 'absolute', left: 44, top: 178, width: 82, height: 21, borderRadius: 6, backgroundColor: '#394656' }} />
      <View style={{ position: 'absolute', left: 50, top: 169, width: 28, height: 11, borderRadius: 5, backgroundColor: '#55677C' }} />
      <View style={{ position: 'absolute', left: 118, top: 199, width: 6, height: 12, borderRadius: 2, backgroundColor: '#26303C' }} />

      {/* the shelf across the room, the phone face-up on it, and the seal */}
      <Glow size={92} color="#E2BA78" opacity={0.2} stop={0.74} style={{ position: 'absolute', right: 24, top: 118 }} />
      <View style={{ position: 'absolute', right: 56, top: 168, width: 52, height: 9, borderRadius: 3, backgroundColor: '#2C3844' }} />
      <View style={{ position: 'absolute', right: 76, top: 177, width: 8, height: 34, borderRadius: 2, backgroundColor: '#26303C' }} />
      <View style={{ position: 'absolute', right: 70, top: 140, width: 15, height: 26, borderRadius: 3, backgroundColor: '#DCE3EA' }} />
      <View style={{ position: 'absolute', right: 48, top: 128, width: 19, height: 19, borderRadius: 9.5, backgroundColor: '#E9D2A4', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={10} height={9} viewBox="0 0 9 8" fill="none">
          <Path d="M1.5 4l2 2 4-4.5" stroke="#131313" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
    </View>
  );
}

/**
 * Frames 158 / 159 / 134: the action itself, on a card narrow enough that the
 * sentence is the whole of it — a picture of the moment, who it belongs to, and
 * one line you could do without thinking about it twice.
 */
export function ActionCard({ top, art, mark, label, line }: { top?: number; art: ReactNode; mark: 'moon' | 'sun' | 'bed'; label: string; line: string }) {
  return (
    <View
      style={{
        // Pinned when a frame states a top; otherwise laid out in flow, so an
        // `ActionBand` can centre it. Either way the canvas's 56 gutters hold.
        ...(top == null ? { marginHorizontal: 56 } : ({ position: 'absolute', left: 56, right: 56, top } as const)),
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)',
      }}>
      <View style={{ height: 248, overflow: 'hidden' }}>{art}</View>
      <View style={{ paddingTop: 16, paddingHorizontal: 18, paddingBottom: 18, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
            {mark === 'moon' ? <MoonGlyph size={15} color="#F4F3F0" /> : mark === 'bed' ? <BedGlyph size={16} color="#F4F3F0" /> : <SunGlyph size={16} color="#F4F3F0" />}
          </View>
          <AppText style={[sans('600'), { fontSize: 13, color: '#1D1C1A' }]}>{label}</AppText>
        </View>
        {/* the canvas sets this line `text-align:left` now, not centred */}
        <AppText style={[sans('500'), { fontSize: 15, lineHeight: 22, color: '#1D1C1A' }]}>{line}</AppText>
      </View>
    </View>
  );
}
