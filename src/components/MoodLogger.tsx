import { useId, useRef, useState } from 'react';
import { type LayoutChangeEvent, Modal, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, LinearGradient as SvgLinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { ActionBand, ActionButton, ActionCard, DidYouRow, NightActionArt } from '@/components/day/kit';
import { AppText, BackGlyph, Grain, PressScale } from '@/components/ui';
import { checkinPartNow } from '@/lib/routines';
import { colors, sans } from '@/lib/theme';

/**
 * The daily check-in — three questions, drawn from the 393 × 852 canvas frames
 * 156 (the weather orb), 157 (the feeling wheel) and 160 (what fed it).
 *
 * The flow lives here rather than in the route because it is shown two ways:
 * pushed as `/checkin`, and lifted as a sheet from anywhere that wants a mood
 * logged on the spot. Both get the same pixels.
 *
 * Canvas y values include the 54px status bar; every `top` below has had it
 * subtracted, so the numbers are measured from under the safe-area inset.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

/**
 * The five rungs of the rail. `tone` is the orb's high light — the canvas draws
 * the 'Mostly clear' state at #706C63 and the rest step around it, so the sky
 * warms as the rail moves right.
 */
const MOODS = [
  { label: 'Heavy', tone: '#3B3934' },
  { label: 'Overcast', tone: '#4B4842' },
  { label: 'Mixed', tone: '#5D5A52' },
  { label: 'Mostly clear', tone: '#706C63' },
  { label: 'Clear', tone: '#847F74' },
] as const;

/**
 * The feeling vocabulary, grouped by the weather it usually belongs to. The
 * wheel shows eight at a time, chosen to match the mood just logged — asking a
 * man who has rated the day Heavy whether he feels Proud is a question he has
 * to translate before he can answer. Every word stays reachable through
 * "Something else", because moods are mixed and the wheel is only a shortcut.
 */
const FEELINGS: readonly (readonly string[])[] = [
  ['Hopeless', 'Ashamed', 'Exhausted', 'Anxious', 'Lonely', 'Numb', 'Angry', 'Overwhelmed', 'Empty', 'Afraid', 'Defeated'],
  ['Low', 'Worried', 'Tired', 'Irritable', 'Guilty', 'Restless', 'Flat', 'Discouraged', 'Sad', 'Tense', 'Bored'],
  ['Uneasy', 'Distracted', 'Impatient', 'Unsettled', 'Wired', 'Indifferent', 'Quiet', 'Fine'],
  ['Calm', 'Steady', 'Hopeful', 'Focused', 'Content', 'Rested', 'Relieved', 'Settled', 'Proud'],
  ['Clear', 'Proud', 'Energised', 'Grateful', 'Confident', 'Connected', 'Light', 'Motivated'],
];

/** Eight per mood — the wheel has eight sectors, so these are exact. */
const WHEELS: readonly (readonly string[])[] = [
  ['Hopeless', 'Ashamed', 'Exhausted', 'Anxious', 'Lonely', 'Numb', 'Angry', 'Overwhelmed'],
  ['Low', 'Worried', 'Tired', 'Irritable', 'Lonely', 'Guilty', 'Restless', 'Flat'],
  ['Flat', 'Restless', 'Tired', 'Uneasy', 'Distracted', 'Calm', 'Impatient', 'Hopeful'],
  // the canvas's own eight, in its own order — this is the default rung
  ['Calm', 'Tense', 'Tired', 'Hopeful', 'Flat', 'Proud', 'Lonely', 'Restless'],
  ['Clear', 'Proud', 'Energised', 'Grateful', 'Confident', 'Connected', 'Focused', 'Light'],
];

/** Every word, in band order, deduplicated — the "Something else" list. */
const ALL_FEELINGS: string[] = [...new Set(FEELINGS.flat())];

/** The canvas's six read first; the rest of the vocabulary follows underneath. */
const REASONS = [
  ['Poor sleep', 'sleep'],
  ['Work stress', 'work'],
  ['Scrolling late', 'phone'],
  ['Loneliness', 'person'],
  ['Conflict', 'bolt'],
  ['Real connection', 'people'],
  ['Money', 'coin'],
  ['Health', 'pulse'],
  ['Family', 'home'],
  ['Trained or moved', 'run'],
  ['Drink', 'glass'],
  ['Nothing on', 'clock'],
  ['Something went well', 'star'],
] as const;

type ReasonIconName = (typeof REASONS)[number][1] | 'other';

/**
 * The same three steps run morning and evening; only the framing moves. A
 * morning check-in asks what you're walking into, an evening one asks what the
 * day actually was — and the second question is worded in that tense too.
 */
const PART_COPY = {
  morning: {
    head: "Where's your head at today?",
    feel: 'What does today feel like so far?',
  },
  evening: {
    head: 'How did today land?',
    feel: 'What did today feel like?',
  },
} as const;

/**
 * The prompt opens in the morning register unless told otherwise — the same
 * clock test `(app)/_layout` uses to choose morning over night, so a check-in
 * reached from the tab bar and one reached from a card agree.
 */
export function isMorningCheckin(part?: string) {
  if (part === 'morning' || part === 'evening') return part === 'morning';
  return checkinPartNow() === 'morning';
}

export function checkinCopy(part?: string) {
  return isMorningCheckin(part) ? PART_COPY.morning : PART_COPY.evening;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const moodIndex = (value: number) => Math.round(value * (MOODS.length - 1));
const moodRung = (n: number) => Math.max(0, Math.min(MOODS.length - 1, n - 1));

export const moodLabel = (n: number | null | undefined) => (n ? MOODS[moodRung(n)].label : null);
export const moodTint = (n: number | null | undefined) => (n ? colors.moodTones[moodRung(n)] : colors.textSofter);

// ── the eight sectors, copied from the canvas: 45° each, r 148 about (196, 402) ──
const WHEEL_SECTORS = [
  'M196 402 L196.0 254.0 A148 148 0 0 1 300.7 297.3 Z',
  'M196 402 L300.7 297.3 A148 148 0 0 1 344.0 402.0 Z',
  'M196 402 L344.0 402.0 A148 148 0 0 1 300.7 506.7 Z',
  'M196 402 L300.7 506.7 A148 148 0 0 1 196.0 550.0 Z',
  'M196 402 L196.0 550.0 A148 148 0 0 1 91.3 506.7 Z',
  'M196 402 L91.3 506.7 A148 148 0 0 1 48.0 402.0 Z',
  'M196 402 L48.0 402.0 A148 148 0 0 1 91.3 297.3 Z',
  'M196 402 L91.3 297.3 A148 148 0 0 1 196.0 254.0 Z',
] as const;

/** Each word's 88-wide box, the canvas's frame coords less the disc's (38, 244). */
const WHEEL_LABELS = [
  { left: 152, top: 58 },
  { left: 205, top: 111 },
  { left: 205, top: 187 },
  { left: 152, top: 240 },
  { left: 76, top: 240 },
  { left: 23, top: 187 },
  { left: 23, top: 111 },
  { left: 76, top: 58 },
] as const;

function StepDots({ step, count, dim }: { step: number; count: number; dim: string }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 16, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          style={{
            width: index === step ? 22 : 7,
            height: 7,
            // the canvas pills the active dot at r4 and rounds the others
            // to 50% of a 7px box — 3.5, not the pill's radius.
            borderRadius: index === step ? 4 : 3.5,
            backgroundColor: index === step ? '#131313' : dim,
          }}
        />
      ))}
    </View>
  );
}

/**
 * Canvas top 744 on every step, so the pill is pinned there — 690 under the
 * status bar — rather than to the foot. `CTA_FLOOR` is the air the canvas keeps
 * below it once the home indicator has taken its 34, so on a screen too short
 * for 690 the pill settles on that floor instead of walking off the edge.
 */
const CTA_TOP = 690;
const CTA_HEIGHT = 58;
const CTA_FLOOR = 16;

/** Where the tall pill lands for a given board height — the night flow reuses it. */
export function checkinCtaTop(height: number) {
  return height ? Math.min(CTA_TOP, height - CTA_HEIGHT - CTA_FLOOR) : CTA_TOP;
}

export function PrimaryButton({ label, top, enabled = true, onPress }: { label: string; top: number; enabled?: boolean; onPress: () => void }) {
  return (
    <PressScale
      onPress={enabled ? onPress : undefined}
      disabled={!enabled}
      accessibilityRole="button"
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top,
        height: CTA_HEIGHT,
        minHeight: CTA_HEIGHT,
        borderRadius: 29,
        backgroundColor: '#131313',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: enabled ? 1 : 0.32,
      }}>
      <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

/**
 * The weather orb and the lamp behind it. The canvas blurs the 280 glow by 2px;
 * RN SVG has no blur filter, so it is redrawn as the same radial falloff, whose
 * own softness swallows two pixels at this radius. The orb's gradient is CSS
 * `farthest-corner` from (50%, 30%) — 129 in a 150 box — kept literally so the
 * bottom of the sphere lands on the same grey.
 */
function MoodOrb({ value }: { value: number }) {
  const id = useId().replace(/:/g, '');
  const tone = MOODS[moodIndex(value)].tone;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 167, alignItems: 'center' }}>
      <View style={{ width: 280, height: 280 }}>
        <Svg width={280} height={280} viewBox="0 0 280 280" style={{ position: 'absolute' }}>
          <Defs>
            <RadialGradient id={`glow-${id}`} cx="140" cy="140" rx="140" ry="140" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.45} />
              <Stop offset="0.55" stopColor="#E2BA78" stopOpacity={0.16} />
              <Stop offset="0.75" stopColor="#E2BA78" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={140} cy={140} rx={140} ry={140} fill={`url(#glow-${id})`} />
        </Svg>
        <View
          style={{
            position: 'absolute',
            left: 65,
            top: 65,
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: '#23221F',
            boxShadow: '0 24px 48px rgba(40,38,32,0.3)',
          }}>
          <View style={{ width: 150, height: 150, borderRadius: 75, overflow: 'hidden' }}>
            <Svg width={150} height={150} viewBox="0 0 150 150" style={{ position: 'absolute' }}>
              <Defs>
                <RadialGradient id={`orb-${id}`} cx="75" cy="45" rx="129" ry="129" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor={tone} />
                  <Stop offset="0.55" stopColor="#45423C" />
                  <Stop offset="1" stopColor="#23221F" />
                </RadialGradient>
              </Defs>
              <Circle cx={75} cy={75} r={75} fill={`url(#orb-${id})`} />
            </Svg>
            <Grain source={noiseDark} opacity={0.28} />
          </View>
        </View>
      </View>
    </View>
  );
}

/**
 * The rail. The 6px track sits at canvas 532 but a 6px target is unusable, so
 * the responder is the 44 band centred on it and the track is drawn 19 in.
 */
function MoodSlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const trackWidth = useRef(0);
  const changeAt = (x: number) => {
    if (trackWidth.current > 0) onChange(clamp(x / trackWidth.current));
  };
  return (
    <>
      <View
        onLayout={(event: LayoutChangeEvent) => {
          trackWidth.current = event.nativeEvent.layout.width;
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(event) => changeAt(event.nativeEvent.locationX)}
        onResponderMove={(event) => changeAt(event.nativeEvent.locationX)}
        accessibilityRole="adjustable"
        accessibilityLabel="Mood"
        accessibilityValue={{ min: 1, max: 5, now: moodIndex(value) + 1, text: MOODS[moodIndex(value)].label }}
        style={{ position: 'absolute', left: 32, right: 32, top: 459, height: 44, justifyContent: 'center' }}>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.12)' }}>
          <View style={{ width: `${value * 100}%`, height: 6, borderRadius: 3, backgroundColor: '#131313' }} />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: `${value * 100}%`,
            top: 8,
            marginLeft: -14,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 0 1.5px rgba(0,0,0,0.25), 0 3px 8px rgba(40,38,32,0.25)',
          }}
        />
      </View>
    </>
  );
}

/**
 * The hub's weather scene. The canvas stacks four CSS boxes; the numbers below
 * are those percentages resolved against the 64px circle, so the two hills are
 * the same half-ellipses their border-radii described.
 */
function HubScene() {
  const id = useId().replace(/:/g, '');
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64">
      <Defs>
        <SvgLinearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#EFEEE8" />
          <Stop offset="1" stopColor="#EFEDE6" />
        </SvgLinearGradient>
        <RadialGradient id={`sun-${id}`} cx="33.92" cy="30.08" rx="21.12" ry="21.12" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#F3E3C4" stopOpacity={0.9} />
          <Stop offset="0.78" stopColor="#F3E3C4" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={64} height={64} fill={`url(#sky-${id})`} />
      <Ellipse cx={33.92} cy={30.08} rx={21.12} ry={21.12} fill={`url(#sun-${id})`} />
      <Path d="M-16 93.44 L-16 63.744 A48 21.504 0 0 1 80 63.744 L80 93.44 Z" fill="#DEDDD6" />
      <Path d="M-25.6 103.68 L-25.6 70.912 A51.2 18.432 0 0 1 76.8 70.912 L76.8 103.68 Z" fill="#CFCEC7" />
    </Svg>
  );
}

function EmotionWheel({ emotions, selected, onToggle }: { emotions: readonly string[]; selected: string[]; onToggle: (emotion: string) => void }) {
  // canvas `left:38px`, not a centring — on 393 the two differ by 0.5
  return (
    <View style={{ position: 'absolute', left: 38, top: 190 }}>
      <View style={{ width: 316, height: 316 }}>
        {/* The lift belongs to the disc, not its bounding box — the canvas
            drop-shadows the svg itself, so a square shadow behind a circle
            reads as a stray white card. */}
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: 10, top: 10, width: 296, height: 296, borderRadius: 148, boxShadow: '0 14px 28px rgba(40,38,32,0.18)' }}
        />
        {/* Positioned, not because it moves — it already fills this box at 0,0 —
            but because react-native-svg lays an <Svg> out static on web, and CSS
            paints every positioned sibling above every static one whatever the
            document order. Left static, the disc goes under its own shadow. */}
        <Svg width={316} height={316} viewBox="38 244 316 316" pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0 }}>
          {WHEEL_SECTORS.map((d, index) => {
            const on = selected.includes(emotions[index]);
            return <Path key={d} d={d} fill={on ? '#131313' : index % 2 ? '#F7F6F3' : '#FFFFFF'} stroke="rgba(0,0,0,0.14)" strokeWidth={1.2} />;
          })}
          <Circle cx={196} cy={402} r={44} fill="#F4F3F0" stroke="rgba(0,0,0,0.14)" strokeWidth={1.2} />
        </Svg>
        {emotions.map((emotion, index) => {
          const on = selected.includes(emotion);
          return (
            <PressScale
              key={emotion}
              static
              onPress={() => onToggle(emotion)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              hitSlop={{ top: 16, bottom: 16, left: 6, right: 6 }}
              style={{ position: 'absolute', left: WHEEL_LABELS[index].left, top: WHEEL_LABELS[index].top, width: 88, minHeight: 0 }}>
              <AppText center style={[sans(on ? '600' : '500'), { fontSize: 13, color: on ? '#FFFFFF' : '#2A2924' }]}>
                {emotion}
              </AppText>
            </PressScale>
          );
        })}
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: 126, top: 126, width: 64, height: 64, borderRadius: 32, overflow: 'hidden', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.18)' }}>
          <HubScene />
        </View>
      </View>
    </View>
  );
}

/** A feeling that has no sector — off-wheel picks and the wider vocabulary. */
function FeelingChip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: on }}
      style={{
        minHeight: 36,
        paddingHorizontal: 14,
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: on ? '#131313' : '#FFFFFF',
        boxShadow: on ? undefined : '0 0 0 1px rgba(0,0,0,0.10)',
      }}>
      <AppText style={[sans(on ? '600' : '500'), { fontSize: 14, color: on ? '#FFFFFF' : '#1D1C1A' }]}>{label}</AppText>
    </PressScale>
  );
}

/**
 * The reason glyphs. `Checkin Reasons` draws them at 21 in a 24 box on a 38pt
 * disc, `stroke-width:2` with round caps and joins throughout, inking to
 * `#1D1C1A` off the disc's `#F1EFE9` and to `#F4F3F0` once the disc is ink.
 */
function ReasonIcon({ name, size = 21, color = '#1D1C1A' }: { name: ReasonIconName; size?: number; color?: string }) {
  const line = { stroke: color, strokeWidth: 2, fill: 'none' as const };
  const round = { ...line, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === 'sleep' ? <Path d="M14.5 3.5a8.5 8.5 0 1 0 6 12.5 8 8 0 0 1-6-12.5z" {...line} strokeLinejoin="round" /> : null}
      {name === 'work' ? (
        <>
          <Rect x={3} y={8} width={18} height={12} rx={2.5} {...round} />
          <Path d="M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" {...round} />
        </>
      ) : null}
      {name === 'phone' ? (
        <>
          <Rect x={7} y={2.5} width={10} height={19} rx={2.5} {...line} />
          <Path d="M10.5 18.5h3" {...line} strokeLinecap="round" />
        </>
      ) : null}
      {name === 'person' ? (
        <>
          <Circle cx={12} cy={8} r={3.6} {...line} />
          <Path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" {...line} strokeLinecap="round" />
        </>
      ) : null}
      {name === 'bolt' ? <Path d="M13 2L5 13.5h5.5L10 22l8-11.5h-5.5z" {...line} strokeLinejoin="round" /> : null}
      {name === 'people' ? (
        <>
          <Circle cx={8.5} cy={9} r={3.2} {...round} />
          <Circle cx={16.5} cy={9} r={3.2} {...round} />
          <Path d="M2.5 20c.8-3.4 3.2-5 6-5 1.4 0 2.7.4 3.5 1.2.8-.8 2.1-1.2 3.5-1.2 2.8 0 5.2 1.6 6 5" {...round} />
        </>
      ) : null}
      {name === 'coin' ? (
        <>
          <Circle cx={12} cy={12} r={8.5} {...round} />
          <Path d="M12 7.5v9M14.5 9.8a2.6 2.6 0 0 0-2.5-1.3c-1.5 0-2.5.8-2.5 2s1 1.8 2.5 2 2.5.7 2.5 2-1 2-2.5 2a2.6 2.6 0 0 1-2.5-1.3" {...round} />
        </>
      ) : null}
      {name === 'pulse' ? <Path d="M2.5 12.5h4l2-5 3.5 10 2.5-6 1.5 3h5.5" {...round} /> : null}
      {name === 'home' ? (
        <>
          <Path d="M3.5 10.5 12 3.5l8.5 7" {...round} />
          <Path d="M5.5 9.8V20.5h13V9.8" {...round} />
        </>
      ) : null}
      {name === 'run' ? (
        <>
          <Circle cx={14.5} cy={4.8} r={2.2} {...round} />
          <Path d="M6 21l3.5-5 3-2.5-1.5-4.5L8 11l-2.5 1M11 9l4 2 1.5 4M15 15l3 1" {...round} />
        </>
      ) : null}
      {name === 'glass' ? (
        <>
          <Path d="M6.5 3.5h11l-1.5 7a4 4 0 0 1-8 0z" {...round} />
          <Path d="M12 14.5v6M8.5 20.5h7" {...round} />
        </>
      ) : null}
      {name === 'clock' ? (
        <>
          <Circle cx={12} cy={12} r={8.5} {...round} />
          <Path d="M12 7v5.3l3.3 2" {...round} />
        </>
      ) : null}
      {name === 'star' ? <Path d="M12 3.2l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 17l-5.3 2.9 1.1-6.1L3.4 9.6l6-.8z" {...round} /> : null}
      {name === 'other' ? (
        <>
          <Circle cx={6} cy={12} r={1.4} fill={color} />
          <Circle cx={12} cy={12} r={1.4} fill={color} />
          <Circle cx={18} cy={12} r={1.4} fill={color} />
        </>
      ) : null}
    </Svg>
  );
}

/**
 * One reason. `UI Final` rebuilt the row: 60 tall on an 18 radius, the glyph
 * lifted onto its own 38pt disc, the label down to 15 and stepping to 600 once
 * the row is on, and the selected ring drawn at 1.6 rather than 2. Rows pitch
 * 72 apart (206 → 278 → 350 …), so the 12 gap the list is laid out with is what
 * 60 + 12 comes to.
 */
function ReasonRow({ label, icon, selected, onPress }: { label: string; icon: ReasonIconName; selected: boolean; onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={{
        height: 60,
        minHeight: 60,
        borderRadius: 18,
        borderCurve: 'continuous',
        backgroundColor: '#FFFFFF',
        boxShadow: selected ? '0 0 0 1.6px #131313' : '0 0 0 1px rgba(0,0,0,0.10)',
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      }}>
      <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: selected ? '#131313' : '#F1EFE9', alignItems: 'center', justifyContent: 'center' }}>
        <ReasonIcon name={icon} color={selected ? '#F4F3F0' : '#1D1C1A'} />
      </View>
      <AppText style={[sans(selected ? '600' : '500'), { flex: 1, fontSize: 15, color: '#1D1C1A' }]}>{label}</AppText>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: selected ? '#131313' : 'transparent',
          boxShadow: selected ? undefined : 'inset 0 0 0 1.5px rgba(0,0,0,0.22)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {selected ? (
          <Svg width={12} height={12} viewBox="0 0 14 14">
            <Path d="M2.5 7.5l3 3 6-7" stroke="#F4F3F0" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : null}
      </View>
    </PressScale>
  );
}

/** The centred question these boards open with — canvas top 118, i.e. 64 here. */
export function BoardTitle({ children }: { children: string }) {
  return (
    <AppText style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center', fontSize: 22, letterSpacing: 0.1, color: '#1D1C1A' }]}>
      {children}
    </AppText>
  );
}

/** The line under it — canvas top 158. */
export function BoardSub({ children }: { children: string }) {
  return <AppText style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: 104, textAlign: 'center', fontSize: 15, color: '#55534E' }]}>{children}</AppText>;
}

/**
 * `Checkin Emotions` — the feeling wheel, with the wider vocabulary opening
 * into the band the canvas leaves empty under it.
 *
 * Exported whole because `UI Final` moved this board out of the standalone
 * check-in and into the night flow as its second step, and both draw the same
 * pixels.
 */
export function EmotionsBoard({
  feel,
  wheel,
  emotions,
  onChange,
  ctaTop,
}: {
  feel: string;
  wheel: readonly string[];
  emotions: string[];
  onChange: (next: string[]) => void;
  ctaTop: number;
}) {
  const [moreFeelings, setMoreFeelings] = useState(false);
  const [ownFeeling, setOwnFeeling] = useState('');
  const toggle = (word: string) => onChange(emotions.includes(word) ? emotions.filter((item) => item !== word) : [...emotions, word]);
  // Words picked before the mood was changed, or added by hand, stay picked —
  // they just no longer have a sector, so they get their own row.
  const offWheel = emotions.filter((word) => !wheel.includes(word));
  const rest = ALL_FEELINGS.filter((word) => !wheel.includes(word));
  const addOwn = () => {
    const word = ownFeeling.trim();
    if (word && !emotions.some((v) => v.toLowerCase() === word.toLowerCase())) onChange([...emotions, word]);
    setOwnFeeling('');
  };

  return (
    <>
      <BoardTitle>{feel}</BoardTitle>
      {/* The canvas says the same thing twice: a sub over the wheel and a
          second line under it. One of them is the rule, so the rule stays and
          the other goes. */}
      <BoardSub>Pick as many as fit.</BoardSub>
      <EmotionWheel emotions={wheel} selected={emotions} onToggle={toggle} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ position: 'absolute', left: 0, right: 0, top: 552, height: Math.max(0, ctaTop - 552) }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 12 }}>
        {offWheel.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
            {offWheel.map((word) => (
              <FeelingChip key={word} label={word} on onPress={() => toggle(word)} />
            ))}
          </View>
        ) : null}

        <PressScale
          onPress={() => setMoreFeelings((open) => !open)}
          accessibilityRole="button"
          accessibilityState={{ expanded: moreFeelings }}
          style={{ minHeight: 40, alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={[sans('500'), { fontSize: 14.5, color: '#55534E' }]}>{moreFeelings ? 'Fewer words' : 'Something else…'}</AppText>
        </PressScale>

        {moreFeelings ? (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {rest.map((word) => (
                <FeelingChip key={word} label={word} on={emotions.includes(word)} onPress={() => toggle(word)} />
              ))}
            </View>
            <View
              style={{
                marginTop: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                paddingLeft: 16,
                paddingRight: 6,
                minHeight: 44,
                boxShadow: '0 0 0 1px rgba(0,0,0,0.10)',
              }}>
              <TextInput
                value={ownFeeling}
                onChangeText={setOwnFeeling}
                placeholder="In your own word"
                placeholderTextColor={colors.textSofter}
                returnKeyType="done"
                onSubmitEditing={addOwn}
                style={[sans('400'), { flex: 1, paddingVertical: 10, fontSize: 15.5, color: '#1D1C1A' }]}
              />
              <PressScale
                onPress={addOwn}
                disabled={!ownFeeling.trim()}
                accessibilityRole="button"
                accessibilityLabel="Add this word"
                style={{
                  height: 32,
                  minHeight: 0,
                  paddingHorizontal: 14,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#131313',
                  opacity: ownFeeling.trim() ? 1 : 0.3,
                }}>
                <AppText style={[sans('600'), { fontSize: 13.5, color: '#FFFFFF' }]}>Add</AppText>
              </PressScale>
            </View>
          </>
        ) : null}
      </ScrollView>
    </>
  );
}

/**
 * `Checkin Reasons` — what fed it. Rows start at canvas 206 (152 here) and
 * pitch 72, which is the 60 row plus the 12 the list is gapped with.
 */
export function ReasonsBoard({ reasons, onChange, ctaTop }: { reasons: string[]; onChange: (next: string[]) => void; ctaTop: number }) {
  const [otherReason, setOtherReason] = useState('');
  const toggle = (label: string) => onChange(reasons.includes(label) ? reasons.filter((item) => item !== label) : [...reasons, label]);
  const addOwn = () => {
    const word = otherReason.trim();
    if (word && !reasons.some((v) => v.toLowerCase() === word.toLowerCase())) onChange([...reasons, word]);
    setOtherReason('');
  };

  return (
    <>
      <BoardTitle>What fed it?</BoardTitle>
      <BoardSub>Nothing here counts against you.</BoardSub>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ position: 'absolute', left: 0, right: 0, top: 152, height: Math.max(0, ctaTop - 152) }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 22, gap: 12 }}>
        {REASONS.map(([label, icon]) => (
          <ReasonRow key={label} label={label} icon={icon} selected={reasons.includes(label)} onPress={() => toggle(label)} />
        ))}

        {/* Anything already typed in shows as its own row, so it can be taken
            off again the same way the listed ones can. */}
        {reasons
          .filter((reason) => !REASONS.some(([label]) => label === reason))
          .map((reason) => (
            <ReasonRow key={reason} label={reason} icon="other" selected onPress={() => toggle(reason)} />
          ))}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            borderCurve: 'continuous',
            paddingLeft: 18,
            paddingRight: 6,
            minHeight: 60,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.10)',
          }}>
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#F1EFE9', alignItems: 'center', justifyContent: 'center' }}>
            <ReasonIcon name="other" />
          </View>
          <TextInput
            value={otherReason}
            onChangeText={setOtherReason}
            placeholder="Something else"
            placeholderTextColor={colors.textSofter}
            returnKeyType="done"
            onSubmitEditing={addOwn}
            style={[sans('500'), { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1D1C1A' }]}
          />
          <PressScale
            onPress={addOwn}
            disabled={!otherReason.trim()}
            accessibilityRole="button"
            accessibilityLabel="Add this reason"
            style={{
              height: 34,
              minHeight: 0,
              paddingHorizontal: 14,
              borderRadius: 17,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#131313',
              opacity: otherReason.trim() ? 1 : 0.3,
            }}>
            <AppText style={[sans('600'), { fontSize: 13.5, color: '#FFFFFF' }]}>Add</AppText>
          </PressScale>
        </View>
      </ScrollView>
    </>
  );
}

/** The eight words the wheel offers for a given mood rung. */
export function wheelFor(mood: number) {
  return WHEELS[moodRung(mood)];
}

/** What the flow comes back with. The last two are the morning variant's. */
export interface CheckinResult {
  mood: number;
  emotions: string[];
  reasons: string[];
  /** Whether yesterday's action happened — undefined if it was never asked. */
  yesterdayDone?: boolean;
  /** The one action the day is being set on. */
  action?: string;
}

export interface CheckinFlowProps {
  /** Step one's question, in the register the time of day calls for. */
  head: string;
  /** Step two's question — same word, different tense, morning vs evening. */
  feel: string;
  /**
   * The morning variant (frames 158–159): after the feeling wheel it asks
   * whether yesterday's action happened and names today's, rather than asking
   * what fed the mood. Four dots on the rail instead of three.
   */
  morning?: boolean;
  initialMood?: number | null;
  initialEmotions?: string[];
  initialReasons?: string[];
  /** Yesterday's action, as it was set — the morning variant asks after it. */
  yesterdayAction?: string;
  /** Today's, either already named last night or freshly picked. */
  todayAction?: string;
  onDone: (result: CheckinResult) => void;
  onExit: () => void;
}

export function CheckinFlow({
  head,
  feel,
  morning = false,
  initialMood,
  initialEmotions,
  initialReasons,
  yesterdayAction = '',
  todayAction = '',
  onDone,
  onExit,
}: CheckinFlowProps) {
  const [step, setStep] = useState(0);
  // 0.64 is the canvas's own rail position — the fourth rung, 'Mostly clear'.
  const [mood, setMood] = useState(initialMood != null ? moodRung(initialMood) / (MOODS.length - 1) : 0.64);
  const [emotions, setEmotions] = useState<string[]>(initialEmotions ?? []);
  const [reasons, setReasons] = useState<string[]>(initialReasons ?? []);
  const [yesterdayDone, setYesterdayDone] = useState<boolean | undefined>(undefined);
  const [height, setHeight] = useState(0);

  const steps = morning ? 4 : 3;
  const ctaTop = height ? Math.min(CTA_TOP, height - CTA_HEIGHT - CTA_FLOOR) : CTA_TOP;
  const done = (over?: Partial<CheckinResult>) =>
    onDone({ mood: moodIndex(mood) + 1, emotions, reasons, yesterdayDone, action: morning ? todayAction : undefined, ...over });

  const goBack = () => (step === 0 ? onExit() : setStep((current) => current - 1));
  const wheel = WHEELS[moodIndex(mood)];

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      {/* Frames 157 and 160 lay the grain over the whole field; 156 has no such
          layer, and the orb's own glow is what that step is lit by. */}
      {step === 0 ? null : (
        <Grain source={noiseDark} opacity={0.07} />
      )}

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1 }} onLayout={(event: LayoutChangeEvent) => setHeight(event.nativeEvent.layout.height)}>
          {/* Canvas left 16, top 66 — the chevron and the word, on every step. */}
          <PressScale
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel={step === 0 ? 'Close' : 'Back'}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            style={{ position: 'absolute', left: 16, top: 12, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <BackGlyph color="#55534E" />
            <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
          </PressScale>
          <StepDots step={step} count={steps} dim={morning ? 'rgba(19,19,19,0.18)' : 'rgba(0,0,0,0.18)'} />

          {step === 0 ? (
            <>
              <BoardTitle>{head}</BoardTitle>
              <MoodOrb value={mood} />
              <AppText style={[sans('600'), { position: 'absolute', left: 0, right: 0, top: 430, textAlign: 'center', fontSize: 17, color: '#1D1C1A' }]}>
                {MOODS[moodIndex(mood)].label}
              </AppText>
              <MoodSlider value={mood} onChange={setMood} />
            </>
          ) : null}

          {step === 1 ? <EmotionsBoard feel={feel} wheel={wheel} emotions={emotions} onChange={setEmotions} ctaTop={ctaTop} /> : null}

          {morning && step === 2 ? (
            <>
              <BoardTitle>Did you complete this task?</BoardTitle>
              <ActionBand bottom={66 + 74}>
                <ActionCard art={<NightActionArt />} mark="moon" label="Last night" line={yesterdayAction} />
              </ActionBand>
            </>
          ) : null}

          {morning && step === 3 ? (
            <>
              <BoardTitle>One action for today</BoardTitle>
              <ActionBand bottom={50 + 54}>
                <ActionCard art={<NightActionArt />} mark="sun" label="Today" line={todayAction} />
              </ActionBand>
            </>
          ) : null}

          {!morning && step === 2 ? <ReasonsBoard reasons={reasons} onChange={setReasons} ctaTop={ctaTop} /> : null}

          {step === 0 ? <PrimaryButton label="Continue" top={ctaTop} onPress={() => setStep(1)} /> : null}
          {step === 1 ? <PrimaryButton label="Continue" top={ctaTop} enabled={emotions.length > 0} onPress={() => setStep(2)} /> : null}
          {!morning && step === 2 ? (
            <PrimaryButton label="Log it" top={ctaTop} enabled={reasons.length > 0} onPress={() => done()} />
          ) : null}

          {/* The action pair keep their own controls: two discs on 158, and a
              taller pill lifted off the foot on 159. */}
          {morning && step === 2 ? (
            <>
              <DidYouRow
                onNo={() => {
                  setYesterdayDone(false);
                  setStep(3);
                }}
                onYes={() => {
                  setYesterdayDone(true);
                  setStep(3);
                }}
              />
            </>
          ) : null}
          {morning && step === 3 ? <ActionButton label="Got it" onPress={() => done()} /> : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

export interface MoodLoggerProps {
  visible: boolean;
  initialMood?: number | null;
  initialEmotions?: string[];
  initialReasons?: string[];
  onSave: (result: CheckinResult) => void;
  onClose: () => void;
}

/**
 * The same steps, lifted as a sheet from wherever a mood is logged on the spot.
 * Always the three-step register: the day's action belongs to the morning
 * ritual, not to a mood logged in passing.
 */
export function MoodLogger({ visible, initialMood, initialEmotions, initialReasons, onSave, onClose }: MoodLoggerProps) {
  // No reset to run: Modal drops its children while hidden, so each open gets a
  // fresh flow rather than reopening on whichever step was abandoned.
  const copy = checkinCopy();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <CheckinFlow
        head={copy.head}
        feel={copy.feel}
        initialMood={initialMood}
        initialEmotions={initialEmotions}
        initialReasons={initialReasons}
        onDone={onSave}
        onExit={onClose}
      />
    </Modal>
  );
}
