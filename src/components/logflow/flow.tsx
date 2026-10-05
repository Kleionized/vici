import { useState, type ReactNode } from 'react';
import { View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';

import {
  CheckDisc,
  Chips,
  DateRow,
  MonoText,
  NavBar,
  OptionList,
  PrimaryButton,
  Screen,
  ScrollRegion,
  Sheet,
  SummaryCard,
  TimeWheel,
  useCanvasTop,
  WhenChips,
  wheelFromMinutes,
  wheelToMinutes,
  type WheelTime,
} from '@/components/mono';
import { dayPartDate } from '@/lib/format';
import { mono } from '@/lib/theme';

/**
 * The log flows' shared steps — Lapse (90B–90D), Urge Log (91D–91H) — on the
 * mono kit. `Slip-When` is byte-identical to `Lapse-When` and `Slip-Fed` is the
 * same chips question, so the slip group can take these too (`WhenStep`,
 * `ChipsStep`, `DoneBoard`, `useWhen`).
 *
 * Every step is a board in canvas coordinates: the nav row at 60, the stack at
 * 136, the primary at bottom 48 (the screen draws the nav and the primary; a
 * step draws its stack). On a phone too short for the stack, the band between
 * the nav row and the primary scrolls (D320).
 */

/** The nine things that feed an urge, in the frames' chip order. */
export const TRIGGER_LABELS = ['Stress', 'Boredom', 'Lonely', 'Tired', 'Social', 'Phone', 'Late night', 'Argument', 'Craving'] as const;

/** The quick picks of every When step: the moment is now, less the offset. */
export const WHEN_CHIPS = [
  { label: 'Just now', offsetMs: 0 },
  { label: 'Earlier today', offsetMs: 4 * 3600_000 },
  { label: 'Yesterday', offsetMs: 24 * 3600_000 },
] as const;

/** The space the primary (58 at bottom 48) takes off the screen's bottom edge. */
export const CONTROLS = 106;
/** The nav row's bottom — a scrolling band starts under it. */
const NAV_BOTTOM = 100;
/** The days the When step's "Change" offers: today and the six before it. */
const DAYS_BACK = 7;

export type When = {
  /** the clock, read once per flow — the chips and the day list are read against it */
  now: number;
  /** the moment the log will carry */
  at: number;
  /** the chip that is on, or null once the wheel or the day list set a moment of its own */
  chip: number | null;
  pickChip: (index: number) => void;
  /** any moment; a later one than `now` is held at `now` (nothing is logged in the future) */
  setAt: (ms: number) => void;
};

/**
 * The When state of a flow. The clock is read once on mount, so the wheel
 * cannot slide under a re-render; a chip sets `now − offset`; the wheel or the
 * day list set a moment of their own and every chip goes off — tapping a chip
 * puts the chips back in charge.
 */
export function useWhen(): When {
  const [now] = useState(() => Date.now());
  const [chip, setChip] = useState(0);
  const [customAt, setCustomAt] = useState<number | null>(null);
  return {
    now,
    at: customAt ?? now - WHEN_CHIPS[chip].offsetMs,
    chip: customAt == null ? chip : null,
    pickChip: (index) => {
      setChip(index);
      setCustomAt(null);
    },
    setAt: (ms) => setCustomAt(Math.min(ms, now)),
  };
}

/** The same calendar day as `at`, at the wheel's time. */
function onDay(at: number, t: WheelTime): number {
  const d = new Date(at);
  const minutes = wheelToMinutes(t);
  d.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return d.getTime();
}

/** `at`'s time of day on the day `back` days before `now`. */
function daysBefore(now: number, back: number, at: number): number {
  const d = new Date(now);
  const t = new Date(at);
  d.setDate(d.getDate() - back);
  d.setHours(t.getHours(), t.getMinutes(), 0, 0);
  return d.getTime();
}

function sameDay(a: number, b: number) {
  const x = new Date(a);
  const y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
}

/** The flow's nav row: back, the eight dashes for `step` of `total`, close. */
export function FlowNav({ step, total, onBack, onClose }: { step: number; total: number; onBack: () => void; onClose: () => void }) {
  return <NavBar left="back" centre={{ step, total }} right="close" onBack={onBack} onClose={onClose} />;
}

/**
 * How far a stack hung at canvas `top` must rise so its foot clears the primary
 * by 16 on this phone — never past `floor` (8 under the nav row). At 852 every
 * frame clears and the lift is 0; on a short phone the stack rises into the
 * room under the nav, and what is still too tall scrolls (D320).
 */
function useLift(top: number, floor = 108) {
  const { height } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const [h, setH] = useState(0);
  const controlsTop = height - canvasTop - CONTROLS;
  const lift = h ? Math.max(0, Math.min(Math.ceil(top + h + 16 - controlsTop), top - floor)) : 0;
  return { lift, onLayout: (e: LayoutChangeEvent) => setH(e.nativeEvent.layout.height) };
}

/** The band a step's stack lives in: the canvas's own y at 852, lifted and then scrolling under the nav row when a phone is too short. */
function StepBand({ top = 136, gap, children }: { top?: number; gap: number; children: ReactNode }) {
  const { lift, onLayout } = useLift(top);
  return (
    <ScrollRegion top={NAV_BOTTOM} bottom={CONTROLS} contentStyle={{ paddingTop: top - lift - NAV_BOTTOM, paddingHorizontal: 24, paddingBottom: 16 }}>
      <View onLayout={onLayout} style={{ gap }}>
        {children}
      </View>
    </ScrollRegion>
  );
}

/**
 * 90B / 91G · When — `stack(136, gap 14)`: the question, the three chips, "Or
 * choose a time", the wheel (always open — the frames draw it inline) and the
 * date row. The wheel sets the time on the moment's own day; "Change" opens the
 * last seven days, which is where the old wheel's day column went.
 */
export function WhenStep({ title, when }: { title: string; when: When }) {
  const [days, setDays] = useState(false);
  const options = Array.from({ length: DAYS_BACK }, (_, back) => {
    const at = Math.min(daysBefore(when.now, back, when.at), when.now);
    return { key: String(back), at, label: dayPartDate(at, when.now) };
  });
  const picked = options.find((o) => sameDay(o.at, when.at))?.key ?? null;
  return (
    <>
      <StepBand gap={14}>
        <MonoText v="h1">{title}</MonoText>
        <View style={{ height: 2 }} />
        <WhenChips
          options={WHEN_CHIPS.map((c) => c.label)}
          value={when.chip == null ? null : WHEN_CHIPS[when.chip].label}
          onChange={(label) => when.pickChip(WHEN_CHIPS.findIndex((c) => c.label === label))}
        />
        <View style={{ height: 6 }} />
        <MonoText v="caps">Or choose a time</MonoText>
        <TimeWheel
          value={wheelFromMinutes(new Date(when.at).getHours() * 60 + new Date(when.at).getMinutes())}
          onChange={(next) => when.setAt(onDay(when.at, next))}
        />
        <DateRow label={dayPartDate(when.at, when.now)} onPress={() => setDays(true)} />
      </StepBand>
      <Sheet open={days} top={852 - 44 - DAYS_BACK * 58 - (DAYS_BACK - 1) * 12 - 48} onClose={() => setDays(false)}>
        <OptionList
          options={options.map((o) => ({ key: o.key, label: o.label }))}
          value={picked}
          onChange={(key) => {
            const o = options.find((x) => x.key === key);
            if (o) when.setAt(o.at);
            setDays(false);
          }}
        />
      </Sheet>
    </>
  );
}

/**
 * 90C / 91E · What fed it — `stack(136, gap 8)`: the question, "Tap all that
 * apply." (15/400/22 mute), a 6 spacer and the nine chips. The hero under it
 * (`match`, T 506) is the screen's, painted first.
 */
export function ChipsStep({
  title,
  sub = 'Tap all that apply.',
  options = TRIGGER_LABELS,
  value,
  onChange,
}: {
  title: string;
  sub?: string;
  options?: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <StepBand gap={8}>
      <MonoText v="h1">{title}</MonoText>
      <MonoText v="pTight" color={mono.mute}>
        {sub}
      </MonoText>
      <View style={{ height: 6 }} />
      <Chips multi options={options} value={value} onChange={onChange} />
    </StepBand>
  );
}

/**
 * 91F · What did you do — `stack(136, gap 8)`: the question, a 6 spacer and the
 * kit's option rows (single choice).
 */
export function OptionsStep<K extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: readonly K[];
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <StepBand gap={8}>
      <MonoText v="h1">{title}</MonoText>
      <View style={{ height: 6 }} />
      <OptionList options={options} value={value} onChange={onChange} />
    </StepBand>
  );
}

/**
 * 90D / 91H · Logged — close-only nav; the 84 ink disc with its 36 check at
 * 200; `stack(308, centred, gap 12)` of the title, the line under it, a 6
 * spacer and the shrink-to-fit summary card (CRITIC C10); the primary closes.
 * On a short phone the disc and the stack rise into the room under the nav
 * (never past 108), and scroll between the nav and the pill past that.
 */
export function DoneBoard({
  title,
  body,
  rows,
  cta,
  onClose,
}: {
  title: string;
  body?: string;
  rows: { label: string; value: string }[];
  cta: string;
  onClose: () => void;
}) {
  const { lift, onLayout } = useLift(200);
  return (
    <Screen>
      <NavBar left="empty" right="close" onClose={onClose} />
      <ScrollRegion top={NAV_BOTTOM} bottom={CONTROLS} contentStyle={{ paddingTop: 200 - lift - NAV_BOTTOM, paddingHorizontal: 24, paddingBottom: 16 }}>
        <View onLayout={onLayout}>
          <View style={{ alignItems: 'center' }}>
            <CheckDisc size={84} />
          </View>
          <View style={{ height: 308 - 284 }} />
          <View style={{ gap: 12, alignItems: 'center' }}>
            <MonoText v="h1" center style={{ alignSelf: 'stretch' }}>
              {title}
            </MonoText>
            {body ? (
              <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
                {body}
              </MonoText>
            ) : null}
            <View style={{ height: 6 }} />
            <SummaryCard rows={rows} />
          </View>
        </View>
      </ScrollRegion>
      <PrimaryButton label={cta} onPress={onClose} />
    </Screen>
  );
}
