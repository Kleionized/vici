import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';

import { AppText, BackGlyph, bandToSeverity, CheckGlyph, CloseGlyph, Grain, INTENSITY_BANDS, OutcomeDistracted, OutcomeReachedOut, OutcomeRodeOut, OutcomeSlipped, OutcomeTimer, PressScale, TriggerMark, type TriggerMarkName } from '@/components/ui';
import { useCreateEvent } from '@/lib/backend';
import { setJSON } from '@/lib/storage';
import { colors, sans } from '@/lib/theme';
import type { EventType } from '@/lib/types';

/**
 * 044–048 · Urge log — strength, trigger, outcome, when, logged.
 *
 * Laid out in the canvas's 393 × 852 frame. The status bar ends at 54, so every
 * canvas `top` below is written as `top − 54` and measured from the top of the
 * safe area; the primary pill sits at canvas 744, which is 16pt of breathing
 * room under a 58pt button above the home indicator.
 *
 * The lapse flow (030–032) is the same sheet with one bar fewer, so the chrome,
 * the trigger grid, the time wheel and the logged card are exported from here
 * rather than drawn twice — see `src/app/lapse.tsx`.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

export const TRIGGERS: { label: string; mark: TriggerMarkName }[] = [
  { label: 'Stress', mark: 'stress' },
  { label: 'Boredom', mark: 'boredom' },
  { label: 'Lonely', mark: 'lonely' },
  { label: 'Tired', mark: 'tired' },
  { label: 'Social', mark: 'social' },
  { label: 'Phone', mark: 'phone' },
  { label: 'Late night', mark: 'lateNight' },
  { label: 'Argument', mark: 'argument' },
  { label: 'Craving', mark: 'craving' },
];

type OutcomeMark = (props: { color: string }) => React.ReactElement;

const OUTCOMES: { label: string; mark: OutcomeMark; slip?: boolean; type: EventType }[] = [
  { label: 'Rode it out', mark: OutcomeRodeOut, type: 'urge_rode_out' },
  { label: 'Surfed with the timer', mark: OutcomeTimer, type: 'urge_rode_out' },
  { label: 'Distracted myself', mark: OutcomeDistracted, type: 'urge_rode_out' },
  { label: 'Reached out', mark: OutcomeReachedOut, type: 'urge_rode_out' },
  { label: 'I slipped', mark: OutcomeSlipped, slip: true, type: 'urge_acted_on' },
];

export const WHEN_CHIPS = [
  { label: 'Just now', offsetMs: 0 },
  { label: 'Earlier today', offsetMs: 4 * 3600_000 },
  { label: 'Yesterday', offsetMs: 24 * 3600_000 },
] as const;

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Back · the step bars · close. Absolute so each lands on its canvas y. */
export function FlowTop({ index, steps, onBack, onClose }: { index: number; steps: number; onBack: () => void; onClose: () => void }) {
  return (
    <>
      <PressScale
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
        style={{ position: 'absolute', left: 16, top: 12, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
        <BackGlyph color="#55534E" />
        <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
      </PressScale>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 20, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        {Array.from({ length: steps }, (_, bar) => (
          <View key={bar} style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: bar <= index ? '#131313' : 'rgba(0,0,0,0.14)' }} />
        ))}
      </View>
      <PressScale
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        style={{ position: 'absolute', right: 22, top: 16, minHeight: 0 }}>
        <CloseGlyph color="#55534E" size={20} />
      </PressScale>
    </>
  );
}

/** The one question each step asks, on its own balanced two-line box. */
export function Heading({ children }: { children: string }) {
  return (
    <AppText
      center
      style={[sans('500'), { position: 'absolute', left: 44, right: 44, top: 84, fontSize: 22, lineHeight: 30, letterSpacing: 0.1, color: '#1D1C1A' }]}>
      {children}
    </AppText>
  );
}

export function PrimaryButton({ label, onPress, enabled = true }: { label: string; onPress: () => void; enabled?: boolean }) {
  return (
    <PressScale
      onPress={enabled ? onPress : undefined}
      disabled={!enabled}
      accessibilityRole="button"
      style={{ height: 58, borderRadius: 29, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center', opacity: enabled ? 1 : 0.34 }}>
      <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

// ── 034 · how strong ─────────────────────────────────────────────────

/** Five 48px discs; the chosen one floods ink and wears a paper-gapped ring. */
function IntensityScale({ value, onSelect }: { value: number; onSelect: (index: number) => void }) {
  return (
    <>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 276, flexDirection: 'row', justifyContent: 'space-between' }}>
        {INTENSITY_BANDS.map((band, index) => {
          const on = value === index;
          return (
            <PressScale
              key={band.label}
              onPress={() => onSelect(index)}
              accessibilityRole="radio"
              accessibilityLabel={band.label}
              accessibilityState={{ checked: on }}
              hitSlop={{ top: 16, bottom: 16, left: 8, right: 8 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: on ? '#131313' : '#FFFFFF',
                boxShadow: on ? '0 0 0 2px #F4F3F0, 0 0 0 4px #131313' : 'inset 0 0 0 1.5px rgba(0,0,0,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {on ? <View style={{ width: 11, height: 11, borderRadius: 5.5, backgroundColor: '#F4F3F0' }} /> : null}
            </PressScale>
          );
        })}
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 340, flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={[sans('500'), { fontSize: 12.5, color: '#8B8882' }]}>Faint</AppText>
        <AppText style={[sans('500'), { fontSize: 12.5, color: '#8B8882' }]}>Overwhelming</AppText>
      </View>
      <AppText center style={[sans('600'), { position: 'absolute', left: 0, right: 0, top: 406, fontSize: 19, color: '#1D1C1A' }]}>
        {INTENSITY_BANDS[value].label}
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: 436, fontSize: 13.5, color: '#8B8882' }]}>
        {INTENSITY_BANDS[value].note}
      </AppText>
    </>
  );
}

// ── 035 · what set it off ────────────────────────────────────────────

export const GRID_GUTTER = 24;
export const GRID_GAP = 12;

/** Three trigger tiles a row on any width — the canvas grid is `1fr 1fr 1fr`. */
export function triggerTileWidth(screenWidth: number): number {
  return Math.floor((screenWidth - GRID_GUTTER * 2 - GRID_GAP * 2) / 3);
}

export function TriggerCard({ label, mark, selected, onPress, width }: { label: string; mark: TriggerMarkName; selected: boolean; onPress: () => void; width: number }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={{
        width,
        height: 112,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        boxShadow: selected ? '0 0 0 1.8px #131313' : '0 0 0 1px rgba(0,0,0,0.10)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}>
      <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: selected ? '#131313' : '#F1EFE9', alignItems: 'center', justifyContent: 'center' }}>
        <TriggerMark name={mark} color={selected ? '#F4F3F0' : '#1D1C1A'} />
      </View>
      <AppText style={[sans(selected ? '600' : '500'), { fontSize: 14, color: '#1D1C1A' }]}>{label}</AppText>
    </PressScale>
  );
}

// ── 036 · what did you do ────────────────────────────────────────────

function OutcomeRow({ item, selected, top, onPress }: { item: (typeof OUTCOMES)[number]; selected: boolean; top: number; onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top,
        height: 64,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        boxShadow: selected ? '0 0 0 1.8px #131313' : '0 0 0 1px rgba(0,0,0,0.10)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 18,
      }}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          backgroundColor: selected ? '#131313' : '#F1EFE9',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <item.mark color={selected ? '#F4F3F0' : '#55534E'} />
      </View>
      <AppText style={[sans(selected ? '600' : '500'), { flex: 1, fontSize: 15, color: '#1D1C1A' }]}>{item.label}</AppText>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? '#131313' : 'transparent',
          boxShadow: selected ? undefined : 'inset 0 0 0 2px rgba(0,0,0,0.18)',
        }}>
        {selected ? <CheckGlyph color="#FFFFFF" size={13} /> : null}
      </View>
    </PressScale>
  );
}

// ── 037 · when was it ────────────────────────────────────────────────

/** Rows fade by how far they sit from the picked one: 1 · 0.42 · 0.16 and out. */
const WHEEL_FADE = [1, 0.42, 0.16];

function WheelColumn({ width, values, pick = 2, onStep }: { width: number; values: string[]; pick?: number; onStep: (delta: number) => void }) {
  return (
    <View style={{ width }}>
      {values.map((value, row) => (
        <PressScale
          key={row}
          onPress={() => onStep(row - pick)}
          disabled={value === '' || row === pick}
          accessibilityRole="button"
          accessibilityLabel={value}
          style={{ height: 34, minHeight: 0, alignItems: 'center', justifyContent: 'center' }}>
          <AppText
            style={[
              sans(row === pick ? '500' : '400'),
              { fontSize: row === pick ? 21 : 18, color: '#1D1C1A', opacity: WHEEL_FADE[Math.min(Math.abs(row - pick), 2)] },
            ]}>
            {value}
          </AppText>
        </PressScale>
      ))}
    </View>
  );
}

export function TimeWheel({ at, today, onShift, onCancel, onSave }: { at: number; today: number; onShift: (ms: number) => void; onCancel: () => void; onSave: () => void }) {
  const picked = new Date(at);
  const hour12 = picked.getHours() % 12 || 12;
  const pm = picked.getHours() >= 12;
  const nowDay = new Date(today);
  const dates = [-2, -1, 0, 1, 2].map((step) => {
    const day = new Date(at);
    day.setDate(day.getDate() + step);
    const isToday = day.getFullYear() === nowDay.getFullYear() && day.getMonth() === nowDay.getMonth() && day.getDate() === nowDay.getDate();
    return isToday ? 'Today' : `${WEEKDAY[day.getDay()]} ${MONTH[day.getMonth()]} ${day.getDate()}`;
  });
  const hours = [-2, -1, 0, 1, 2].map((step) => String(((hour12 - 1 + step + 12) % 12) + 1));
  const minutes = [-2, -1, 0, 1, 2].map((step) => String((picked.getMinutes() + step + 60) % 60).padStart(2, '0'));
  // 037 fills the meridiem column from the top — AM in row 0, PM in row 1, the
  // rest blank — so the pair sits one row above the highlight band, not on it.
  const meridiem = ['AM', 'PM', '', '', ''];

  return (
    <View
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top: 276,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.10)',
        overflow: 'hidden',
      }}>
      <View style={{ paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'center' }}>
        {/* five 34pt rows inside 8pt padding is a 186pt box, so the canvas's
            centred 36pt band lands at 93 − 18 */}
        <View style={{ position: 'absolute', left: 12, right: 12, top: 75, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.045)' }} />
        <WheelColumn width={132} values={dates} onStep={(delta) => onShift(delta * 86_400_000)} />
        <WheelColumn width={42} values={hours} onStep={(delta) => onShift(delta * 3_600_000)} />
        <WheelColumn width={48} values={minutes} onStep={(delta) => onShift(delta * 60_000)} />
        <WheelColumn width={42} values={meridiem} pick={pm ? 1 : 0} onStep={(delta) => onShift(delta * 12 * 3_600_000)} />
      </View>
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.09)' }}>
        <PressScale onPress={onCancel} accessibilityRole="button" style={{ flex: 1, minHeight: 0, paddingVertical: 15, alignItems: 'center' }}>
          <AppText style={[sans('400'), { fontSize: 16, color: '#55534E' }]}>Cancel</AppText>
        </PressScale>
        <View style={{ width: 1, backgroundColor: 'rgba(0,0,0,0.09)' }} />
        <PressScale onPress={onSave} accessibilityRole="button" style={{ flex: 1, minHeight: 0, paddingVertical: 15, alignItems: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 15.5, color: '#131313' }]}>Save</AppText>
        </PressScale>
      </View>
    </View>
  );
}

// ── 038 · logged ─────────────────────────────────────────────────────

/** The logged mark: a leaf of a notebook, a pen laid across it, a check badge. */
export function LoggedNote() {
  return (
    <View style={{ position: 'absolute', left: 86, top: 76, width: 220, height: 160 }}>
      {/* the canvas's warm glow is already a two-stop closest-side ramp, so it
          transfers literally; its 4px blur only rounds the kink at 74% by ~2px */}
      <Svg width={130} height={130} style={{ position: 'absolute', left: 44, top: 6 }}>
        <Defs>
          <RadialGradient id="urgelog-glow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.36} />
            <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={65} cy={65} rx={65} ry={65} fill="url(#urgelog-glow)" />
      </Svg>
      {/* the ground shadow is a flat rgba(0,0,0,0.10) ellipse the canvas blurs by
          4px — RN SVG has no blur filter, so it is redrawn as a radial falloff */}
      <Svg width={120} height={12} style={{ position: 'absolute', left: 50, top: 134 }}>
        <Defs>
          <RadialGradient id="urgelog-ground" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="0.6" stopColor="#000000" stopOpacity={0.055} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={60} cy={6} rx={60} ry={6} fill="url(#urgelog-ground)" />
      </Svg>
      <View style={{ position: 'absolute', left: 48, top: 38, width: 126, height: 94, borderRadius: 10, backgroundColor: '#E0DFDA', transform: [{ rotate: '-2deg' }] }} />
      <View
        style={{
          position: 'absolute',
          left: 54,
          top: 32,
          width: 114,
          height: 94,
          borderRadius: 8,
          backgroundColor: '#F7F6F2',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
          transform: [{ rotate: '-2deg' }],
        }}
      />
      <View style={{ position: 'absolute', left: 110, top: 34, width: 2, height: 88, backgroundColor: '#E0DFDA', transform: [{ rotate: '-2deg' }] }} />
      <View style={{ position: 'absolute', left: 66, top: 54, width: 34, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 66, top: 68, width: 34, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 122, top: 52, width: 34, height: 4, borderRadius: 2, backgroundColor: '#E0DFDA' }} />
      {/* the pen pivots on its left end, which RN has no origin token for — the
          rotation is bracketed by ±half-width translates instead */}
      <View
        style={{
          position: 'absolute',
          left: 140,
          top: 84,
          width: 64,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#55534E',
          transform: [{ translateX: -32 }, { rotate: '-28deg' }, { translateX: 32 }],
        }}
      />
      <View style={{ position: 'absolute', left: 170, top: 26, width: 30, height: 30, borderRadius: 15, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
          <Path d="M2.5 7.5l3 3 6-7" stroke="#F4F3F0" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
    </View>
  );
}

export function SummaryRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
      }}>
      <AppText style={[sans('600'), { fontSize: 12.5, color: '#8B8882' }]}>{label}</AppText>
      {/* the canvas value box hugs its text against the right padding edge, so
          it only shrinks — it never claims the row's spare width */}
      <AppText numberOfLines={2} style={[sans('500'), { flexShrink: 1, fontSize: 14.5, color: '#1D1C1A', textAlign: 'right' }]}>
        {value}
      </AppText>
    </View>
  );
}

export default function UrgeLog() {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const [step, setStep] = useState(0);
  // The scale has no empty state on the canvas; 034 inks the 4th disc, Intense.
  const [intensity, setIntensity] = useState(3);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [outcome, setOutcome] = useState(0);
  const [when, setWhen] = useState(0);
  const [showWheel, setShowWheel] = useState(false);
  // A time nudged on the wheel outranks the chips until Cancel puts it back.
  const [customAt, setCustomAt] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  // Read once: the wheel must not slide under a re-render while it is open.
  const [now] = useState(() => Date.now());
  const { width: screenWidth } = useWindowDimensions();
  const triggerTile = triggerTileWidth(screenWidth);
  const at = customAt ?? now - WHEN_CHIPS[when].offsetMs;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/log'));
  const back = () => (step === 0 ? close() : setStep((current) => current - 1));
  const toggleTrigger = (label: string) => setTriggers((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]));

  async function save() {
    setSaving(true);
    const item = OUTCOMES[outcome];
    await createEvent({
      type: item.type,
      severity: bandToSeverity(intensity),
      trigger: triggers.length ? triggers.join(' · ') : undefined,
      whatHelped: item.slip ? undefined : item.label,
      createdAt: at,
    });
    if (item.slip) await setJSON('tideline.letter.pending', Date.now());
    else await setJSON('tideline.post.backondeck.pending', Date.now());
    setSaving(false);
    setStep(4);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Grain source={noiseDark} opacity={0.07} />

      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {step < 4 ? <FlowTop index={step} steps={4} onBack={back} onClose={close} /> : null}

          {step === 0 ? (
            <>
              <Heading>How strong was the urge?</Heading>
              <IntensityScale value={intensity} onSelect={setIntensity} />
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Heading>What set it off?</Heading>
              <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: 132, fontSize: 14.5, color: '#55534E' }]}>
                Tap all that apply.
              </AppText>
              <View style={{ position: 'absolute', left: GRID_GUTTER, right: GRID_GUTTER, top: 180, flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP }}>
                {TRIGGERS.map((item) => (
                  <TriggerCard key={item.label} {...item} width={triggerTile} selected={triggers.includes(item.label)} onPress={() => toggleTrigger(item.label)} />
                ))}
              </View>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Heading>What did you do?</Heading>
              {OUTCOMES.map((item, index) => (
                <OutcomeRow key={item.label} item={item} selected={outcome === index} top={156 + index * 76} onPress={() => setOutcome(index)} />
              ))}
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Heading>When was it?</Heading>
              <View style={{ position: 'absolute', left: 0, right: 0, top: 152, flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                {WHEN_CHIPS.map((chip, index) => {
                  const on = customAt == null && when === index;
                  return (
                    <PressScale
                      key={chip.label}
                      onPress={() => {
                        setWhen(index);
                        setCustomAt(null);
                      }}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: on }}
                      hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                      style={{
                        minHeight: 0,
                        paddingVertical: 13,
                        paddingHorizontal: 20,
                        borderRadius: 24,
                        backgroundColor: on ? '#131313' : '#FFFFFF',
                        boxShadow: on ? undefined : '0 0 0 1px rgba(0,0,0,0.10)',
                      }}>
                      <AppText style={[sans('500'), { fontSize: 14, color: on ? '#FFFFFF' : '#1D1C1A' }]}>{chip.label}</AppText>
                    </PressScale>
                  );
                })}
              </View>
              <PressScale
                onPress={() => setShowWheel((open) => !open)}
                accessibilityRole="button"
                hitSlop={{ top: 16, bottom: 16, left: 40, right: 40 }}
                style={{ position: 'absolute', left: 0, right: 0, top: 222, minHeight: 0, alignItems: 'center' }}>
                <AppText style={[sans('500'), { fontSize: 14, color: '#55534E' }]}>Specify time</AppText>
              </PressScale>
              {showWheel ? (
                <TimeWheel
                  at={at}
                  today={now}
                  onShift={(ms) => setCustomAt((current) => (current ?? at) + ms)}
                  onCancel={() => {
                    setCustomAt(null);
                    setShowWheel(false);
                  }}
                  onSave={() => setShowWheel(false)}
                />
              ) : null}
            </>
          ) : null}

          {step === 4 ? (
            <>
              <LoggedNote />
              <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 262, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>
                Urge logged.
              </AppText>
              <View
                style={{
                  position: 'absolute',
                  left: 24,
                  right: 24,
                  top: 322,
                  borderRadius: 18,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
                  paddingVertical: 4,
                  paddingHorizontal: 20,
                }}>
                <SummaryRow label="Intensity" value={INTENSITY_BANDS[intensity].label} />
                <SummaryRow label="Set off by" value={triggers.length ? triggers.join(' · ') : '—'} />
                <SummaryRow label="What I did" value={OUTCOMES[outcome].label} last />
              </View>
            </>
          ) : null}
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
          {step === 0 ? <PrimaryButton label="Continue" onPress={() => setStep(1)} /> : null}
          {step === 1 ? (
            <PrimaryButton label={triggers.length ? `Continue · ${triggers.length}` : 'Continue'} enabled={triggers.length > 0} onPress={() => setStep(2)} />
          ) : null}
          {step === 2 ? <PrimaryButton label="Continue" onPress={() => setStep(3)} /> : null}
          {step === 3 ? <PrimaryButton label={saving ? 'Logging…' : 'Log the urge'} enabled={!saving} onPress={() => void save()} /> : null}
          {step === 4 ? <PrimaryButton label="Done" onPress={close} /> : null}
        </View>
      </SafeAreaView>
    </View>
  );
}
