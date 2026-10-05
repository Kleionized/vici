import { useState, useSyncExternalStore } from 'react';
import { Platform, View, useWindowDimensions } from 'react-native';

import { DayToggles, MonoText, NavBar, PrimaryButton, Screen, ScrollRegion, TimeWheel, useCanvasTop, type WheelTime } from '@/components/mono';
import type { TimeOfDay } from '@/lib/routines';
import { getJSON, setJSON } from '@/lib/storage';

/**
 * `Morning Check-in Time` / `Nightly Check-in Time` (and `Settings Check-in
 * Time`, which the canvas draws byte-identical to the nightly one) are one
 * board: the back chevron, a left question at 136, "Select time" over the
 * kit wheel, "Select days" over the seven toggles, and "Save time" at the
 * frame's bottom 48. Only the question and which time it writes differ.
 *
 * The stack is the frame's own `stack(136, gap 18)` with its two 6-tall
 * spacers. On a phone where it would run under the pill it scrolls between
 * the nav row's foot and the pill (D320, D226); at 393 × 852 it fits and
 * nothing moves.
 */

/**
 * The questions balance after "the" on the canvas (`text-wrap: balance`).
 * Native has no balancing pass and greedy would keep "morning"/"nightly" on
 * the first line, so native carries the break the frame draws (D332); web
 * balances it itself.
 */
export function checkinQuestion(kind: CheckinKind): string {
  const word = kind === 'morning' ? 'morning' : 'nightly';
  return Platform.OS === 'web' ? `When should the ${word} check-in come?` : `When should the\n${word} check-in come?`;
}

const toWheel = (t: TimeOfDay): WheelTime => ({ hour12: t.hour, minute: t.minute, period: t.period });
const fromWheel = (t: WheelTime): TimeOfDay => ({ hour: t.hour12, minute: t.minute, period: t.period });

/** The 58 pill at bottom 48 takes 106 off the screen's bottom edge. */
const CONTROLS = 48 + 58;
/** The nav row (`top 60`, 40 tall) ends here; the frame's stack starts at 136. */
const NAV_FOOT = 100;
const STACK_TOP = 136;

export function CheckinTimeBoard({
  kind,
  onBack,
  time,
  onTime,
  days,
  onDays,
  onSave,
}: {
  kind: CheckinKind;
  onBack: () => void;
  time: TimeOfDay;
  onTime: (next: TimeOfDay) => void;
  days: number[];
  onDays: (next: number[]) => void;
  onSave: () => void;
}) {
  const { height: winH } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const [stackH, setStackH] = useState(0);
  // Where the stack fits (393 × 852 and up) the band starts at the question, as it
  // always has. Where it scrolls, it starts at the nav row's foot with the 36 as
  // padding — every row stays put, but the question scrolls up to the chevron's
  // line instead of being cut 36 below it, in open ground.
  const scrolls = stackH > 0 && STACK_TOP + stackH + 24 > winH - canvasTop - CONTROLS;
  const top = scrolls ? NAV_FOOT : STACK_TOP;
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={onBack} />
      <ScrollRegion top={top} bottom={CONTROLS} contentStyle={{ paddingTop: STACK_TOP - top, paddingHorizontal: 24, paddingBottom: 24 }}>
        <View onLayout={(e) => setStackH(e.nativeEvent.layout.height)} style={{ gap: 18 }}>
          <MonoText v="h1">{checkinQuestion(kind)}</MonoText>
          <View style={{ height: 6 }} />
          <MonoText v="caps">Select time</MonoText>
          {/* answered synchronously: the wheel rolls back to whatever `value` holds after a settle */}
          <TimeWheel value={toWheel(time)} onChange={(next) => onTime(fromWheel(next))} />
          <View style={{ height: 6 }} />
          <MonoText v="caps">Select days</MonoText>
          <DayToggles value={days} onChange={onDays} />
        </View>
      </ScrollRegion>
      <PrimaryButton label="Save time" onPress={onSave} />
    </Screen>
  );
}

/**
 * Which days each check-in fires on. Local-only, like the times themselves —
 * nothing about a notification schedule needs to survive a reinstall on the
 * server, so it rides the same tiny listener store the times do.
 */

export type CheckinKind = 'morning' | 'night';

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];
const DAYS_KEY = 'tideline.routines.days.v1';

let daysCache: Record<CheckinKind, number[]> = { morning: EVERY_DAY, night: EVERY_DAY };
let daysLoaded = false;
const dayListeners = new Set<() => void>();

function subscribeDays(listener: () => void) {
  dayListeners.add(listener);
  if (!daysLoaded) {
    daysLoaded = true;
    void getJSON<Record<CheckinKind, number[]>>(DAYS_KEY).then((stored) => {
      if (!stored) return;
      daysCache = { morning: stored.morning ?? EVERY_DAY, night: stored.night ?? EVERY_DAY };
      for (const l of dayListeners) l();
    });
  }
  return () => {
    dayListeners.delete(listener);
  };
}

/** Read the saved days for one check-in. Returns every day until the store loads. */
export function useCheckinDays(kind: CheckinKind): number[] {
  const read = () => daysCache[kind];
  return useSyncExternalStore(subscribeDays, read, read);
}

export async function saveCheckinDays(kind: CheckinKind, days: number[]): Promise<void> {
  daysCache = { ...daysCache, [kind]: days };
  for (const l of dayListeners) l();
  await setJSON(DAYS_KEY, daysCache);
}
