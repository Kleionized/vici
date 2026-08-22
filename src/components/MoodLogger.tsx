import { useId, useRef, useState } from 'react';
import { type LayoutChangeEvent, Modal, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';

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
 * `21E2 · Night — Emotions` draws eight words on eight rows, and the same eight
 * whatever the dial said. The previous bundle turned a wheel whose vocabulary
 * changed with the mood; this one is a fixed list.
 */
const EMOTION_ROWS = ['Calm', 'Tense', 'Tired', 'Hopeful', 'Flat', 'Proud', 'Lonely', 'Restless'] as const;

/**
 * `21E3 · Night — What caused it` draws eight reasons, in this order, and no
 * others. The previous bundle's list — poor sleep, work stress, scrolling late,
 * conflict, real connection — is withdrawn; only loneliness survives it, with a
 * new glyph.
 */
const REASONS = [
  ['Relationship', 'relationship'],
  ['Family', 'family'],
  ['School / work', 'school'],
  ['Money', 'money'],
  ['Self-image', 'selfImage'],
  ['Loneliness', 'lonely'],
  ['Health / wellbeing', 'health'],
  ['None / unknown', 'unknown'],
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
 * The eight glyphs `21E3 · Night — What caused it` draws, transcribed path by
 * path. All eight are `viewBox="0 0 24 24"` at 21 × 21 with `stroke-width: 2`,
 * round caps and joins, no fill — except the question mark's dot, which the
 * canvas fills.
 */
function ReasonIcon({ name, size = 21, color = '#1D1C1A' }: { name: ReasonIconName; size?: number; color?: string }) {
  const line = { stroke: color, strokeWidth: 2, fill: 'none' as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === 'relationship' ? (
        <>
          <Path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...line} />
          <Path d="M15.5 11.5a2.5 2.5 0 1 0-1.8-4.3" {...line} />
          <Path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" {...line} />
          <Path d="M15.8 15c1.9.4 3.3 1.6 3.7 3.6" {...line} />
        </>
      ) : null}
      {name === 'family' ? (
        <>
          <Path d="M9 10a2.8 2.8 0 1 0 0-5.6A2.8 2.8 0 0 0 9 10Z" {...line} />
          <Path d="M16.5 12.2a2.2 2.2 0 1 0 0-4.4" {...line} />
          <Path d="M3.5 19c.5-3 2.6-4.6 5.5-4.6 2 0 3.6.7 4.6 2" {...line} />
          <Path d="M14.2 19c.3-1.8 1.4-2.9 3-2.9 1.5 0 2.6 1 3 2.9" {...line} />
        </>
      ) : null}
      {name === 'school' ? (
        <>
          <Path d="M4.5 9.5h15v9h-15Z" {...line} />
          <Path d="M9.5 9.5V8a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 8v1.5" {...line} />
          <Path d="M4.5 13h15" {...line} />
        </>
      ) : null}
      {name === 'money' ? (
        <>
          <Path d="M12 19.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" {...line} />
          <Path d="M14.4 9.8c-.4-.8-1.3-1.3-2.4-1.3-1.5 0-2.6.8-2.6 1.9s1 1.5 2.6 1.8c1.6.3 2.6.8 2.6 1.9s-1.2 1.9-2.6 1.9c-1.2 0-2.1-.5-2.5-1.3" {...line} />
          <Path d="M12 7v10" {...line} />
        </>
      ) : null}
      {name === 'selfImage' ? (
        <>
          <Path d="M5.5 4.5h13v15h-13Z" {...line} />
          <Path d="M12 11.2a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z" {...line} />
          <Path d="M8.5 17c.5-1.8 1.8-2.7 3.5-2.7s3 .9 3.5 2.7" {...line} />
        </>
      ) : null}
      {name === 'lonely' ? (
        <>
          <Path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...line} />
          <Path d="M5.5 19c.7-3.4 3.2-5 6.5-5s5.8 1.6 6.5 5" {...line} />
        </>
      ) : null}
      {name === 'health' ? <Path d="M12 19.5s-7-4.4-7-9.7a4 4 0 0 1 7-2.6 4 4 0 0 1 7 2.6c0 5.3-7 9.7-7 9.7Z" {...line} /> : null}
      {name === 'unknown' ? (
        <>
          <Path d="M9.3 9a2.7 2.7 0 1 1 3.7 2.5c-.9.35-1.5 1-1.5 2v.3" {...line} />
          {/* the canvas fills this dot rather than stroking it */}
          <Circle cx={11.7} cy={17.2} r={1.3} fill={color} />
        </>
      ) : null}
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
 * the row is on, and the selected ring drawn at 1.6 rather than 2. `UI Final 1`
 * tightens the pitch from 72 to 66 — a 6 gap on a 60 row — and places the rows
 * at the canvas's own tops rather than flowing them.
 */
function ReasonRow({ label, icon, top, selected, onPress }: { label: string; icon: ReasonIconName; top: number; selected: boolean; onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top,
        height: 60,
        minHeight: 0,
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
        {selected ? <BoardTick /> : null}
      </View>
    </PressScale>
  );
}

/** The tick inside a selected row's disc — 12 x 10 in a 12 x 10 box. */
function BoardTick() {
  return (
    <Svg width={12} height={10} viewBox="0 0 12 10" fill="none">
      <Path d="M1.5 5L4.5 8L10.5 1.5" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
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
 * `21E2 · Night — Emotions`.
 *
 * The eight-sector wheel is withdrawn in `UI Final 1` and the board is eight
 * pill rows instead — a fixed vocabulary, not one that turns with the dial, and
 * no chip grid or composer under it: the rows run 218 → 720 and the pill is at
 * 744, so there is no band left to open one into.
 *
 * Exported whole because the bundle draws this board both as the night flow's
 * second step and as the standalone check-in's.
 */
export function EmotionsBoard({
  feel,
  emotions,
  onChange,
}: {
  feel: string;
  emotions: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (word: string) => onChange(emotions.includes(word) ? emotions.filter((item) => item !== word) : [...emotions, word]);
  return (
    <>
      <BoardTitle>{feel}</BoardTitle>
      <BoardSub>Pick any that ring true.</BoardSub>
      {EMOTION_ROWS.map((word, i) => (
        <EmotionRow key={word} label={word} top={218 - 54 + i * 64} selected={emotions.includes(word)} onPress={() => toggle(word)} />
      ))}
    </>
  );
}

/**
 * One feeling. 54 tall on a 16 radius, no glyph plate — the row carries the
 * word and the disc and nothing else.
 */
function EmotionRow({ label, top, selected, onPress }: { label: string; top: number; selected: boolean; onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top,
        height: 54,
        minHeight: 0,
        borderRadius: 16,
        borderCurve: 'continuous',
        backgroundColor: '#FFFFFF',
        boxShadow: selected ? '0 0 0 1.6px #131313' : '0 0 0 1px rgba(0,0,0,0.10)',
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      }}>
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
        {selected ? <BoardTick /> : null}
      </View>
    </PressScale>
  );
}

/**
 * `21E3 · Night — What caused it`.
 *
 * Eight rows, no sub-title, and no "something else" composer: the rows run
 * 188 → 710 on a 66 pitch and the pill is at 744, which leaves no band for one.
 */
export function ReasonsBoard({ reasons, onChange }: { reasons: string[]; onChange: (next: string[]) => void }) {
  const toggle = (label: string) => onChange(reasons.includes(label) ? reasons.filter((item) => item !== label) : [...reasons, label]);
  return (
    <>
      <BoardTitle>What caused the feeling?</BoardTitle>
      {REASONS.map(([label, icon], i) => (
        <ReasonRow key={label} label={label} icon={icon} top={188 - 54 + i * 66} selected={reasons.includes(label)} onPress={() => toggle(label)} />
      ))}
    </>
  );
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

          {step === 1 ? <EmotionsBoard feel={feel} emotions={emotions} onChange={setEmotions} /> : null}

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

          {!morning && step === 2 ? <ReasonsBoard reasons={reasons} onChange={setReasons} /> : null}

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
