import { useId } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient as SvgLinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, PressScale } from '@/components/ui';
import { colors, sans } from '@/lib/theme';

/**
 * 21 · Today — the pieces page two is made of.
 *
 * Everything here is a literal translation of the canvas: the readings strip,
 * the day's one task card, and the small object each step draws into that
 * card's night. Soft shapes the canvas blurs are drawn as radial gradients,
 * since RN SVG has no blur filter.
 */

/* ------------------------------------------------------------------ readings */

/** The five-dot mood reading, filled up to the selected step. */
export function MoodDots({ value }: { value: number | null }) {
  return (
    <View style={{ position: 'absolute', left: 13, top: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const on = value != null && i <= value;
        return (
          <View
            key={i}
            style={{
              width: 9,
              height: 9,
              borderRadius: 4.5,
              backgroundColor: on ? colors.ink : 'rgba(19,19,19,0.13)',
              ...(i === value ? { boxShadow: '0 0 0 1.5px #FFFFFF, 0 0 0 2.5px #131313' } : null),
            }}
          />
        );
      })}
    </View>
  );
}

/** The five-bar energy reading — a rising staircase, filled to the step. */
export function EnergyBars({ value }: { value: number | null }) {
  return (
    <View style={{ position: 'absolute', left: 13, bottom: 9, flexDirection: 'row', alignItems: 'flex-end', gap: 3.5 }}>
      {[9, 13, 17, 21, 25].map((h, i) => {
        const on = value != null && i <= value;
        return (
          <View
            key={h}
            style={{
              width: 6.5,
              height: h,
              borderRadius: 3,
              backgroundColor: on ? colors.ink : 'rgba(19,19,19,0.13)',
              ...(i === value ? { boxShadow: '0 0 0 1.5px #FFFFFF, 0 0 0 2.5px #131313' } : null),
            }}
          />
        );
      })}
    </View>
  );
}

/** One of the two white reading pills, 48pt tall with its word on the right. */
function ReadingPill({ children, word }: { children: React.ReactNode; word: string }) {
  return (
    <View style={{ flex: 1, borderRadius: 12, borderCurve: 'continuous', backgroundColor: colors.surface, boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
      {children}
      <View style={{ position: 'absolute', right: 13, top: 0, bottom: 0, justifyContent: 'center' }}>
        <AppText style={[sans('600'), { fontSize: 12, color: colors.text }]}>{word}</AppText>
      </View>
    </View>
  );
}

/** "This morning" — mood and energy side by side, as they were logged. */
export function ReadingsStrip({ mood, energy, moodWord, energyWord }: { mood: number | null; energy: number | null; moodWord: string; energyWord: string }) {
  return (
    <View style={{ marginHorizontal: 12, height: 48, flexDirection: 'row', gap: 8 }}>
      <ReadingPill word={moodWord}>
        <MoodDots value={mood} />
      </ReadingPill>
      <ReadingPill word={energyWord}>
        <EnergyBars value={energy} />
      </ReadingPill>
    </View>
  );
}

/* --------------------------------------------------------------- the task card */

export type DayStep = {
  /** When in the day it belongs — the card's small label. */
  when: string;
  /** The ask, as one plain sentence. */
  caption: string;
  /** The thing itself, drawn into the card's night. */
  art: (props: { id: string }) => React.ReactElement;
};

/**
 * A `radial-gradient(closest-side, C α, C 0 N%)` disc. Where the canvas also
 * blurs one, the gradient's own falloff stands in.
 */
function Glow({
  id,
  size,
  color,
  opacity,
  stop,
  style,
}: {
  id: string;
  size: number;
  color: string;
  opacity: number;
  stop: number;
  style: StyleProp<ViewStyle>;
}) {
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

/** The moon, the way the canvas cuts it: a disc with a disc taken out of it. */
function Crescent({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z" fill={color} />
    </Svg>
  );
}

/**
 * The card's night: the sky, three stars, the moon over your left shoulder, the
 * ridge, and the warm glow the day's object stands in. 96 tall, and the same
 * for every step — only the object inside it changes.
 */
function TaskNight({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 124, overflow: 'hidden' }}>
      <Svg width="100%" height={124} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <SvgLinearGradient id={`tsky${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0B0C0F" />
            <Stop offset="0.6" stopColor="#12151B" />
            <Stop offset="1" stopColor="#1A2027" />
          </SvgLinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height={124} fill={`url(#tsky${id})`} />
      </Svg>
      <View style={{ position: 'absolute', left: 58, top: 18, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.45)' }} />
      <View style={{ position: 'absolute', left: 112, top: 40, width: 1.5, height: 1.5, borderRadius: 0.75, backgroundColor: 'rgba(244,243,240,0.3)' }} />
      <View style={{ position: 'absolute', right: 124, top: 22, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.35)' }} />
      <Glow id={`tmoon${id}`} size={44} color="#DFDCD3" opacity={0.16} stop={0.72} style={{ position: 'absolute', left: 26, top: 12 }} />
      <View style={{ position: 'absolute', left: 38, top: 22 }}>
        <Crescent size={20} color="#E8E6DC" />
      </View>
      <Svg width="100%" height={124} viewBox="0 0 361 96" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
        <Path d="M-4,96 L-4,72 Q80,58 170,68 Q260,80 365,66 L365,96 Z" fill="#171B22" />
      </Svg>
      <Glow id={`twarm${id}`} size={70} color="#E2BA78" opacity={0.2} stop={0.74} style={{ position: 'absolute', right: 40, top: 20 }} />
      {children}
    </View>
  );
}

/**
 * The day's one step: the night it belongs to, the hour it belongs to, the ask
 * in a sentence, and a ring you close by pressing the card.
 */
export function TaskCard({ step, done, onPress }: { step: DayStep; done: boolean; onPress: () => void }) {
  const id = useId().replace(/:/g, '');
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${step.when}. ${step.caption}`}
      style={{
        marginHorizontal: 12,
        height: 274,
        borderRadius: 20,
        borderCurve: 'continuous',
        overflow: 'hidden',
        backgroundColor: colors.surface,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)',
      }}>
      <TaskNight id={id}>{step.art({ id })}</TaskNight>

      <View style={{ position: 'absolute', left: 20, top: 142, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Crescent size={15} color="#F4F3F0" />
        </View>
        {/* `Today Home II` labels the card with the constant, not the time of
            day the step carries — `when` survives for the reading-out only. */}
        <AppText style={[sans('600'), { fontSize: 13, color: colors.text }]}>Today&rsquo;s task</AppText>
      </View>

      {/* the check affordance — an empty ring until the step is behind you */}
      <View
        style={{
          position: 'absolute',
          right: 20,
          top: 146,
          width: 26,
          height: 26,
          borderRadius: 13,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: done ? colors.ink : undefined,
          boxShadow: done ? undefined : 'inset 0 0 0 2px rgba(19,19,19,0.22)',
        }}>
        {done ? (
          <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
            <Path d="M5 12.5l4.5 4.5L19 7" stroke="#F4F3F0" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : null}
      </View>

      <AppText style={[sans('600'), { position: 'absolute', left: 20, right: 24, top: 194, fontSize: 18, lineHeight: 26, letterSpacing: -0.1, color: colors.text }]}>
        {step.caption}
      </AppText>
    </PressScale>
  );
}

/* ---------------------------------------------------------------- step drawings */

/**
 * The face the canvas gives the thing standing in the scene: a 180° #343A44 →
 * #262B33 fill. Every step's object is cut from it, so they read as one set.
 */
function Face({ id, width, height }: { id: string; width: number; height: number }) {
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      <Defs>
        <SvgLinearGradient id={`face${id}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#343A44" />
          <Stop offset="1" stopColor="#262B33" />
        </SvgLinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={`url(#face${id})`} />
    </Svg>
  );
}

/** Step: the door left open on the night, with the light still on behind it. */
export function DoorwayArt({ id }: { id: string }) {
  return (
    <View style={{ position: 'absolute', right: 58, top: 24, width: 42, height: 54 }}>
      <View style={{ position: 'absolute', left: 0, top: 0, width: 42, height: 54, borderTopLeftRadius: 8, borderTopRightRadius: 8, overflow: 'hidden' }}>
        <Face id={id} width={42} height={54} />
      </View>
      <View style={{ position: 'absolute', left: 8, top: 8, width: 26, height: 46, borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: 'rgba(233,199,138,0.22)' }} />
      <View style={{ position: 'absolute', left: 8, top: 8, width: 11, height: 46, borderTopLeftRadius: 6, backgroundColor: 'rgba(233,199,138,0.34)' }} />
      <View style={{ position: 'absolute', left: 27, top: 32, width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(244,243,240,0.45)' }} />
    </View>
  );
}

/** Step: the phone, shut in the drawer. The one the canvas draws. */
export function PhoneDownArt({ id }: { id: string }) {
  return (
    <View style={{ position: 'absolute', right: 60, top: 26, width: 38, height: 52, borderRadius: 5, overflow: 'hidden' }}>
      <Face id={id} width={38} height={52} />
      <View style={{ position: 'absolute', left: 4, right: 4, top: 7, height: 14, borderRadius: 3, backgroundColor: 'rgba(244,243,240,0.10)' }} />
      <View style={{ position: 'absolute', left: 4, right: 4, top: 24, height: 14, borderRadius: 3, backgroundColor: 'rgba(244,243,240,0.06)' }} />
      <View style={{ position: 'absolute', left: 14, top: 12, width: 10, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(244,243,240,0.35)' }} />
      <View
        style={{
          position: 'absolute',
          left: 8,
          top: 5,
          width: 9,
          height: 17,
          borderRadius: 2,
          backgroundColor: '#0E1116',
          boxShadow: 'inset 0 0 0 1px rgba(244,243,240,0.22)',
          transform: [{ rotate: '-14deg' }],
        }}
      />
    </View>
  );
}

/** Step: the glass, filled and left where you will see it. */
export function WaterArt({ id }: { id: string }) {
  return (
    <View style={{ position: 'absolute', right: 62, top: 28, width: 34, height: 50 }}>
      <View
        style={{
          position: 'absolute',
          left: 5,
          top: 6,
          width: 24,
          height: 44,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          borderBottomLeftRadius: 7,
          borderBottomRightRadius: 7,
          overflow: 'hidden',
        }}>
        <Face id={id} width={24} height={44} />
        <View style={{ position: 'absolute', left: 0, right: 0, top: 16, bottom: 0, backgroundColor: 'rgba(244,243,240,0.16)' }} />
        <View style={{ position: 'absolute', left: 0, right: 0, top: 16, height: 2, backgroundColor: 'rgba(244,243,240,0.35)' }} />
      </View>
      <View style={{ position: 'absolute', left: 5, top: 6, width: 24, height: 2.5, borderRadius: 1.5, backgroundColor: 'rgba(244,243,240,0.3)' }} />
    </View>
  );
}

/** Step: the bed made, the room set for tonight. */
export function BedArt({ id }: { id: string }) {
  return (
    <View style={{ position: 'absolute', right: 46, top: 34, width: 62, height: 42 }}>
      <View style={{ position: 'absolute', left: 0, top: 0, width: 6, height: 42, borderRadius: 2, backgroundColor: '#343A44' }} />
      <View style={{ position: 'absolute', left: 4, top: 10, width: 58, height: 32, borderRadius: 5, overflow: 'hidden' }}>
        <Face id={id} width={58} height={32} />
      </View>
      {/* the sheet turned down, and the pillow set against the headboard */}
      <View style={{ position: 'absolute', left: 4, top: 22, width: 58, height: 20, borderRadius: 5, backgroundColor: 'rgba(244,243,240,0.13)' }} />
      <View style={{ position: 'absolute', left: 8, top: 4, width: 22, height: 12, borderRadius: 4, backgroundColor: 'rgba(244,243,240,0.28)' }} />
    </View>
  );
}

/** Step: the name written down — the log, open, with the pen still on it. */
export function NoteArt({ id }: { id: string }) {
  return (
    <View style={{ position: 'absolute', right: 58, top: 30, width: 42, height: 46 }}>
      <View style={{ position: 'absolute', left: 2, top: 0, width: 36, height: 46, borderRadius: 4, overflow: 'hidden' }}>
        <Face id={id} width={36} height={46} />
      </View>
      {[10, 18, 26, 34].map((top, i) => (
        <View
          key={top}
          style={{
            position: 'absolute',
            left: 8,
            top,
            width: i === 3 ? 14 : 24,
            height: 2.5,
            borderRadius: 1.5,
            backgroundColor: i === 0 ? 'rgba(244,243,240,0.3)' : 'rgba(244,243,240,0.14)',
          }}
        />
      ))}
      {/* the pen, left across the page */}
      <View
        style={{ position: 'absolute', left: 18, top: 30, width: 24, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(244,243,240,0.4)', transform: [{ rotate: '-28deg' }] }}
      />
    </View>
  );
}

/* ------------------------------------------------------------- lesson card art */

/** The dome of first light on the lesson card, with the day's mark inside it. */
export function LessonDome({ id }: { id: string }) {
  return (
    <View style={{ position: 'absolute', right: 44, top: 16, width: 108, height: 80, borderTopLeftRadius: 999, borderTopRightRadius: 999, overflow: 'hidden' }}>
      <Svg width={108} height={80} viewBox="0 0 108 80">
        <Defs>
          <SvgLinearGradient id={`dome${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F1F0EA" />
            <Stop offset="1" stopColor="#E8E6DF" />
          </SvgLinearGradient>
          <RadialGradient id={`domeGlow${id}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.5} />
            <Stop offset="0.42" stopColor="#E2BA78" stopOpacity={0.22} />
            <Stop offset="0.75" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
          <SvgLinearGradient id={`tag${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4A4843" />
            <Stop offset="1" stopColor="#1D1C19" />
          </SvgLinearGradient>
        </Defs>
        <Rect x={0} y={0} width={108} height={80} fill={`url(#dome${id})`} />
        <Ellipse cx={54} cy={39} rx={35} ry={29} fill={`url(#domeGlow${id})`} />
        <Ellipse cx={55} cy={66} rx={21} ry={3.5} fill="rgba(40,38,32,0.12)" />
        <Rect x={37} y={30} width={36} height={23} rx={5} fill={`url(#tag${id})`} transform="rotate(-16 54 42)" />
        <Circle cx={44.5} cy={41.5} r={3} fill="#F1F0EA" transform="rotate(-16 54 42)" />
        <Path
          d="M52 37.5 L66 37.5 M52 45 L61 45"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={2.2}
          strokeLinecap="round"
          transform="rotate(-16 54 42)"
        />
        <Path d="M42 38 C 34 30, 32 20, 33 10" stroke="#C4C3BC" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      </Svg>
    </View>
  );
}
