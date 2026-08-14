import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useId, useState, type ReactNode } from 'react';
import { View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, BackGlyph, PressScale } from '@/components/ui';
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
function Hill({ left, right, top, height, ry, color }: { left: number; right: number; top: number; height: number; ry: number; color: string }) {
  const w = useWindowDimensions().width - left - right;
  return (
    <Svg width={w} height={height} style={{ position: 'absolute', left, top }} pointerEvents="none">
      <Path d={`M0 ${ry} A ${w / 2} ${ry} 0 0 1 ${w} ${ry} L ${w} ${height} L 0 ${height} Z`} fill={color} />
    </Svg>
  );
}

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
  /** Drawn instead of the ink pill on the steps the canvas gives their own controls. */
  footer?: ReactNode;
}) {
  const [height, setHeight] = useState(0);
  const ctaTop = height ? Math.min(CTA_TOP, height - CTA_HEIGHT - CTA_FLOOR) : CTA_TOP;
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />
      {backdrop}
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1 }} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
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
                  left: 16,
                  right: 16,
                  top: ctaTop,
                  height: 52,
                  minHeight: 52,
                  borderRadius: 26,
                  backgroundColor: '#131313',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AppText style={[sans('600'), { fontSize: 17, color: '#FFFFFF' }]}>{ctaLabel}</AppText>
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
        bottom: 50,
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
export function MoodDial({ value, onChange, top }: { value: number; onChange: (v: number) => void; top: number }) {
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
            accessibilityLabel={`Level ${i + 1} of 5`}
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

/** The two words that bound a scale, sat under its ends. */
export function ScaleEnds({ top, low, high }: { top: number; low: string; high: string }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top, flexDirection: 'row', justifyContent: 'space-between' }}>
      <AppText style={[sans('500'), { fontSize: 12.5, color: '#8B8882' }]}>{low}</AppText>
      <AppText style={[sans('500'), { fontSize: 12.5, color: '#8B8882' }]}>{high}</AppText>
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

const TANK = [20, 31, 42, 53, 64];

/** Five rising bars: how much is left in the tank. */
export function EnergyBars({ value, onChange, top }: { value: number; onChange: (v: number) => void; top: number }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top, height: 72, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      {TANK.map((height, i) => {
        const on = i === value;
        return (
          <PressScale
            key={height}
            onPress={() => onChange(i)}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`Level ${i + 1} of 5`}
            style={{ width: 48, height: 72, minHeight: 72, alignItems: 'center', justifyContent: 'flex-end' }}>
            <View
              style={{
                width: 30,
                height,
                borderRadius: 8,
                backgroundColor: on ? '#131313' : '#FFFFFF',
                boxShadow: on ? '0 0 0 2px #F4F3F0, 0 0 0 4px #131313' : 'inset 0 0 0 1.5px rgba(0,0,0,0.12)',
              }}
            />
          </PressScale>
        );
      })}
    </View>
  );
}

/**
 * Frame 129 · the signature pad. It is a pad, not a field: the whole surface
 * takes the mark, the rule and the cross tell you where, and the footer names
 * who signed and on which day — the two things a signature is evidence of.
 */
export function SignaturePad({ top, name, stamp, signed, onSign, onClear }: { top: number; name: string; stamp: string; signed: boolean; onSign: () => void; onClear: () => void }) {
  return (
    <View style={{ position: 'absolute', left: 12, right: 12, top, height: 200, borderRadius: 14, backgroundColor: '#FAF9F6', boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.08)' }}>
      {/* The ruling is inert and lifted out of the pressables: the whole pad
          takes the mark, and a button inside a button is invalid on the web. */}
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
        <AppText style={[sans('600'), { position: 'absolute', left: 18, top: 14, fontSize: 10.5, letterSpacing: 1.6, color: '#C6C3BC' }]}>SIGNATURE</AppText>

        {signed ? (
          <AppText center style={{ position: 'absolute', left: 0, right: 0, top: 64, fontFamily: fonts.script, fontSize: 34, color: '#1D1C1A' }}>
            {name}
          </AppText>
        ) : (
          <View style={{ position: 'absolute', left: 0, right: 0, top: 64, alignItems: 'center', gap: 8 }}>
            <Svg width={19} height={19} viewBox="0 0 20 20" fill="none">
              <Path d="M3.5 16.5l2-6.2L13.8 2 18 6.2 9.7 14.5l-6.2 2z" fill="none" stroke="#B0AEA8" strokeWidth={1.7} strokeLinejoin="round" />
              <Path d="M12 3.8l4.2 4.2" stroke="#B0AEA8" strokeWidth={1.7} />
            </Svg>
            <AppText style={{ fontFamily: fonts.quote, fontStyle: 'italic', fontSize: 15, color: '#B0AEA8' }}>Sign with your finger</AppText>
          </View>
        )}

        <AppText style={[sans('400'), { position: 'absolute', left: 30, bottom: 40, fontSize: 14, color: '#B0AEA8' }]}>×</AppText>
        <View style={{ position: 'absolute', left: 28, right: 28, bottom: 36, height: 1.5, backgroundColor: 'rgba(0,0,0,0.22)' }} />
        <AppText style={[sans('500'), { position: 'absolute', left: 30, bottom: 14, fontSize: 11.5, color: '#B0AEA8' }]}>{name}</AppText>
        <AppText style={[sans('500'), { position: 'absolute', right: 28, bottom: 14, fontSize: 11.5, color: '#B0AEA8' }]}>{stamp}</AppText>
      </View>

      <PressScale
        onPress={signed ? undefined : onSign}
        accessibilityRole="button"
        accessibilityLabel={signed ? 'Signed' : 'Sign here'}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, minHeight: 0 }}>
        {null}
      </PressScale>
      {/* last, so it takes its own corner of the pad back off the sign surface */}
      <PressScale
        onPress={onClear}
        accessibilityRole="button"
        accessibilityLabel="Clear the signature"
        hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        style={{ position: 'absolute', right: 18, top: 12, minHeight: 0 }}>
        <AppText style={[sans('500'), { fontSize: 12.5, color: '#B0AEA8' }]}>Clear</AppText>
      </PressScale>
    </View>
  );
}

/* ---------------------------------------------------------------- the drawings */

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

/** Frames 117 / 120: first light over a low bank of cloud. */
export function SunMark({ top }: { top: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top, height: 150 }}>
      <Glow size={140} color="#E2BA78" opacity={0.4} stop={0.74} style={{ position: 'absolute', left: '50%', marginLeft: -70, top: 0 }} />
      <View style={{ position: 'absolute', left: '50%', marginLeft: -19, top: 46, width: 38, height: 38, borderRadius: 19, backgroundColor: '#E9D2A4' }} />
      <View style={{ position: 'absolute', left: '50%', marginLeft: -94, top: 32, width: 44, height: 12, borderRadius: 7, backgroundColor: '#FFFFFF' }} />
      <View style={{ position: 'absolute', left: '50%', marginLeft: -60, top: 100, width: 120, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: '50%', marginLeft: 14, top: 110, width: 56, height: 4, borderRadius: 2, backgroundColor: '#E8E7E1' }} />
    </View>
  );
}

/** Frame 118: the cup, steaming — what is left in the tank. */
export function CupMark({ top }: { top: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top, height: 150 }}>
      <Glow size={130} color="#E2BA78" opacity={0.35} stop={0.74} style={{ position: 'absolute', left: '50%', marginLeft: -65, top: 0 }} />
      <SoftShadow width={88} height={11} opacity={0.1} color="#000000" style={{ position: 'absolute', left: '50%', marginLeft: -44, top: 122 }} />

      <View style={{ position: 'absolute', left: '50%', marginLeft: -14, top: 28 }}>
        <Svg width={30} height={29} viewBox="0 0 24 26" fill="none">
          <Path d="M6 2c-3 4 3 6 0 10M17 2c-3 4 3 6 0 10" stroke="#ACABA4" strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      </View>

      <View
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: 22,
          top: 66,
          width: 18,
          height: 22,
          borderTopWidth: 5,
          borderRightWidth: 5,
          borderBottomWidth: 5,
          borderColor: '#E0DFDA',
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: -28,
          top: 60,
          width: 52,
          height: 46,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          backgroundColor: '#F7F6F2',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
        }}
      />
      <View style={{ position: 'absolute', left: '50%', marginLeft: -28, top: 60, width: 52, height: 7, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: '50%', marginLeft: -34, top: 112, width: 68, height: 8, borderRadius: 5, backgroundColor: '#E4E3DE' }} />
    </View>
  );
}

/** Frame 120: the daylight band the finished morning lands on. */
export function DawnBand({ top }: { top: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top, height: 300, overflow: 'hidden' }}>
      <LinearGradient colors={['#EFEEE8', '#F3EEE1']} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 300 }} />
      <Glow size={140} color="#E2BA78" opacity={0.4} stop={0.74} style={{ position: 'absolute', left: '50%', marginLeft: -70, top: 20 }} />
      <View style={{ position: 'absolute', left: '50%', marginLeft: -19, top: 71, width: 38, height: 38, borderRadius: 19, backgroundColor: '#E9D2A4' }} />
      <Hill left={-70} right={-70} top={192} height={150} ry={68} color="#DEDDD6" />
      <Hill left={-130} right={-40} top={218} height={150} ry={58} color="#CFCEC7" />
      <Hill left={-40} right={-140} top={244} height={150} ry={50} color="#C5C4BD" />
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
 * Frames 121 / 124: the night band the evening check-in opens under — a cold
 * gradient, a gibbous moon, a few stars and two hills closing the horizon.
 */
export function NightSky({ height, hillTop }: { height: number; hillTop: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height, overflow: 'hidden' }}>
      <LinearGradient colors={['#14171B', '#1A2027', '#232B34']} locations={[0, 0.55, 1]} style={{ position: 'absolute', left: 0, right: 0, top: 0, height }} />
      <Glow size={110} color="#E2E8F0" opacity={0.22} stop={0.78} style={{ position: 'absolute', right: 74, top: 30 }} />
      <View style={{ position: 'absolute', right: 104, top: 60, width: 34, height: 34, borderRadius: 17, backgroundColor: '#DDE4EC', boxShadow: '0 0 18px rgba(221,228,236,0.5)' }} />
      <View style={{ position: 'absolute', right: 112, top: 64, width: 22, height: 22, borderRadius: 11, backgroundColor: '#1A2027', opacity: 0.55 }} />
      {STARS.map(([left, starTop, size, opacity]) => (
        <View
          key={`${left}-${starTop}`}
          style={{ position: 'absolute', left, top: starTop, width: size, height: size, borderRadius: size / 2, backgroundColor: `rgba(244,243,240,${opacity})` }}
        />
      ))}
      <Hill left={-60} right={-60} top={hillTop} height={110} ry={50} color="#1C232B" />
      <Hill left={-120} right={-30} top={hillTop + 20} height={110} ry={44} color="#242C36" />
      <View style={{ position: 'absolute', left: 70, top: hillTop + 30, width: 18, height: 2.5, borderRadius: 2, backgroundColor: 'rgba(244,243,240,0.14)' }} />
    </View>
  );
}

/** Frame 122: the day's notebook, open, pen across the gutter. */
export function JournalMark({ top }: { top: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: '50%', marginLeft: -110, top, width: 220, height: 160 }}>
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

export type DayMark = 'gauge' | 'wave' | 'check' | 'play';

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
export function LedgerRow({ top, mark, glyph, title, detail, strong = false }: { top: number; mark: DayMark; glyph: [number, number]; title: string; detail?: string; strong?: boolean }) {
  return (
    <View style={{ position: 'absolute', left: 16, right: 16, top, height: 48, flexDirection: 'row', alignItems: 'center', gap: 13 }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1EFE9', alignItems: 'center', justifyContent: 'center' }}>
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
 * Frames 158 / 134 draw the same scene — the phone face-down on a night stand,
 * out of arm's reach — at very slightly different weights. The handful of
 * numbers that move between the two live here rather than being guessed at.
 */
const NIGHT_ART = {
  morning: { moon: 24, shelf: 15, shelfTop: 27, barLeft: 15, barWidth: 11, phoneLeft: 8, phoneWidth: 10, phoneHeight: 19 },
  night: { moon: 30, shelf: 16, shelfTop: 28, barLeft: 16, barWidth: 12, phoneLeft: 9, phoneWidth: 11, phoneHeight: 20 },
} as const;

/** The three specks of sky, two anchored left and the last anchored right. */
const NIGHT_SPECKS: (ViewStyle & { key: string })[] = [
  { key: 'a', left: 84, top: 48, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.45)' },
  { key: 'b', left: 118, top: 84, width: 1.5, height: 1.5, borderRadius: 0.75, backgroundColor: 'rgba(244,243,240,0.3)' },
  { key: 'c', right: 116, top: 76, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.35)' },
];

export function NightActionArt({ frame }: { frame: keyof typeof NIGHT_ART }) {
  const w = useArtWidth();
  const a = NIGHT_ART[frame];
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 248, overflow: 'hidden' }}>
      <LinearGradient colors={['#0B0C0F', '#12151B', '#1A2027']} locations={[0, 0.6, 1]} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 248 }} />
      {NIGHT_SPECKS.map(({ key, ...speck }) => (
        <View key={key} style={[{ position: 'absolute' }, speck]} />
      ))}
      <Glow size={58} color="#DFDCD3" opacity={0.16} stop={0.72} style={{ position: 'absolute', left: 26, top: 38 }} />
      {/* the canvas hangs a 30px moon out of a 24px box on one of the two
          frames, so the box takes its size from the glyph rather than clipping it */}
      <View style={{ position: 'absolute', left: 42, top: 54 }}>
        <MoonGlyph size={a.moon} color="#E8E6DC" />
      </View>

      <Svg width={w} height={248} viewBox="0 0 361 150" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0 }}>
        <Path d="M-4,150 L-4,116 Q80,96 170,112 Q260,128 365,110 L365,150 Z" fill="#171B22" />
      </Svg>

      <Glow size={94} color="#E2BA78" opacity={0.2} stop={0.74} style={{ position: 'absolute', right: 26, top: 104 }} />
      <View style={{ position: 'absolute', right: 46, top: 132, width: 42, height: 58, borderRadius: 6, overflow: 'hidden' }}>
        <LinearGradient colors={['#343A44', '#262B33']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
        <View style={{ position: 'absolute', left: 5, right: 5, top: 8, height: a.shelf, borderRadius: 3, backgroundColor: 'rgba(244,243,240,0.10)' }} />
        <View style={{ position: 'absolute', left: 5, right: 5, top: a.shelfTop, height: a.shelf, borderRadius: 3, backgroundColor: 'rgba(244,243,240,0.06)' }} />
        <View style={{ position: 'absolute', left: a.barLeft, top: 14, width: a.barWidth, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(244,243,240,0.35)' }} />
        <View
          style={{
            position: 'absolute',
            left: a.phoneLeft,
            top: 6,
            width: a.phoneWidth,
            height: a.phoneHeight,
            borderRadius: 2.5,
            backgroundColor: '#0E1116',
            boxShadow: 'inset 0 0 0 1px rgba(244,243,240,0.22)',
            transform: [{ rotate: '-14deg' }],
          }}
        />
      </View>
    </View>
  );
}

/** Frame 159: first light over the same two hills, the notebook waiting. */
export function DayActionArt() {
  const w = useArtWidth();
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 248, overflow: 'hidden' }}>
      <LinearGradient colors={['#F1F0EB', '#ECEAE3']} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 248 }} />
      <Glow size={180} color="#E2BA78" opacity={0.5} stop={0.75} style={{ position: 'absolute', left: '50%', marginLeft: -90, top: 8 }} />

      <Svg width={w} height={248} viewBox="0 0 361 150" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0 }}>
        <Path d="M-4,150 L-4,104 Q70,84 150,100 Q240,118 365,96 L365,150 Z" fill="#DEDDD6" />
        <Path d="M-4,150 L-4,128 Q120,112 230,126 Q300,134 365,126 L365,150 Z" fill="#CFCEC7" />
      </Svg>

      <Svg width={52} height={30} viewBox="0 0 52 30" fill="none" style={{ position: 'absolute', left: 64, top: 140 }}>
        <Path d="M2 28 L50 28" stroke="#B5B2A9" strokeWidth={2.5} strokeLinecap="round" />
        <Path d="M13 28 a13 13 0 0 1 26 0 Z" fill="#E2BA78" />
        <Path d="M26 6 v-5 M10 12 l-3.5 -3.5 M42 12 l3.5 -3.5" stroke="#C99F5F" strokeWidth={2.5} strokeLinecap="round" />
      </Svg>

      <View style={{ position: 'absolute', right: 40, top: 100 }}>
        <Svg width={74} height={62} viewBox="0 0 74 62" fill="none">
          <Ellipse cx={37} cy={54} rx={20} ry={3.5} fill="rgba(40,38,32,0.10)" />
          {/* the SVG transform string, not rotation/originX — the web build
              passes those through as a raw `transform-origin` DOM attribute */}
          <G transform="rotate(-14 37 32)">
            <Rect x={19} y={21} width={36} height={23} rx={5} fill="#1D1C19" />
            <Circle cx={26.5} cy={32.5} r={3} fill="#F1F0EA" />
            <Path d="M34 28.5 L48 28.5 M34 36 L43 36" stroke="rgba(255,255,255,0.28)" strokeWidth={2.2} strokeLinecap="round" />
          </G>
          <Path d="M24 29 C 16 21, 14 11, 15 2" stroke="#C4C3BC" strokeWidth={1.8} fill="none" strokeLinecap="round" />
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
export function ActionCard({ top, art, mark, label, line }: { top: number; art: ReactNode; mark: 'moon' | 'sun'; label: string; line: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: 56,
        right: 56,
        top,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)',
      }}>
      <View style={{ height: 248, overflow: 'hidden' }}>{art}</View>
      <View style={{ paddingTop: 16, paddingHorizontal: 18, paddingBottom: 18, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
            {mark === 'moon' ? <MoonGlyph size={15} color="#F4F3F0" /> : <SunGlyph size={16} color="#F4F3F0" />}
          </View>
          <AppText style={[sans('600'), { fontSize: 13, color: '#1D1C1A' }]}>{label}</AppText>
        </View>
        <AppText center style={[sans('500'), { fontSize: 15, lineHeight: 22, color: '#1D1C1A' }]}>
          {line}
        </AppText>
      </View>
    </View>
  );
}

/**
 * Frame 158's answer: two discs, no and yes, because the honest answer has to
 * be as easy to give as the flattering one.
 */
export function DidYouRow({ onNo, onYes }: { onNo: () => void; onYes: () => void }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 66, flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
      <PressScale
        onPress={onNo}
        accessibilityRole="button"
        accessibilityLabel="No"
        style={{ width: 74, height: 74, minHeight: 74, borderRadius: 37, backgroundColor: '#FFFFFF', boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.14)', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={22} height={22} viewBox="0 0 18 18" fill="none">
          <Path d="M3 3 L15 15 M15 3 L3 15" stroke="#55534E" strokeWidth={2.2} strokeLinecap="round" />
        </Svg>
      </PressScale>
      <PressScale
        onPress={onYes}
        accessibilityRole="button"
        accessibilityLabel="Yes"
        style={{ width: 74, height: 74, minHeight: 74, borderRadius: 37, backgroundColor: '#131313', boxShadow: '0 8px 20px rgba(19,19,19,0.24)', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={26} height={21} viewBox="0 0 20 16" fill="none">
          <Path d="M2 8.5 L7.5 14 L18 2.5" fill="none" stroke="#F4F3F0" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </PressScale>
    </View>
  );
}
