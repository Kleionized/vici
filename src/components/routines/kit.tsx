import type { ReactNode } from 'react';
import { useSyncExternalStore } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { TimeWheel } from '@/components/routines/wheel';
import { AppText, PressScale } from '@/components/ui';
import type { TimeOfDay } from '@/lib/routines';
import { getJSON, setJSON } from '@/lib/storage';
import { sans } from '@/lib/theme';

/**
 * The two check-in boards (108/109 on the canvas) are the same board twice: a
 * plain Back, a centred question, the time wheel, a row of day chips, one line
 * of reassurance and a dark pill. Only the question, the note and which time it
 * writes differ, so the skeleton lives here once.
 *
 * Every offset below is the canvas y less the 54px status bar, and they add up
 * to the 764pt a 393 × 852 phone leaves between the two insets.
 */

export function RoutineBack({ onPress }: { onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 9, alignSelf: 'flex-start', minHeight: 0, paddingLeft: 16 }}>
      <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
        <Path d="M9.5 1.5L2 9.5l7.5 8" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
    </PressScale>
  );
}

/** The 361 × 48 ink pill both boards end on. */
export function RoutineCTA({ label, onPress, enabled = true }: { label: string; onPress: () => void; enabled?: boolean }) {
  return (
    <PressScale
      onPress={enabled ? onPress : undefined}
      disabled={!enabled}
      accessibilityRole="button"
      style={{
        marginHorizontal: 16,
        height: 48,
        borderRadius: 25,
        backgroundColor: '#131313',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: enabled ? 1 : 0.32,
      }}>
      <AppText style={[sans('600'), { fontSize: 17.5, letterSpacing: 0.2, color: '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

export function RoutineShell({
  onBack,
  title,
  note,
  cta,
  children,
}: {
  onBack: () => void;
  title: string;
  note: string;
  cta: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* canvas 64 */}
        <View style={{ marginTop: 10, height: 20, justifyContent: 'center' }}>
          <RoutineBack onPress={onBack} />
        </View>

        {/* canvas 132. The block is held at the full 76 to 'Select time' so a two-line question never shifts the wheel. */}
        <View style={{ marginTop: 48, height: 76 }}>
          <AppText center style={[sans('500'), { fontSize: 22, color: '#1D1C1A' }]}>
            {title}
          </AppText>
        </View>

        {children}

        {/* canvas leaves 90 here; on a taller phone the slack belongs between the chips and the reassurance */}
        <View style={{ flex: 1, minHeight: 90 }} />
        <AppText center style={[sans('400'), { paddingHorizontal: 36, fontSize: 15, lineHeight: 22, color: '#55534E' }]}>
          {note}
        </AppText>
        <View style={{ height: 24 }} />
        {cta}
        <View style={{ height: 26 }} />
      </SafeAreaView>
    </View>
  );
}

const DAY_LABELS = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** The middle of both boards: the wheel under 'Select time', the chips under 'Select days'. */
export function CheckinPicker({
  time,
  onTime,
  days,
  onToggleDay,
}: {
  time: TimeOfDay;
  onTime: (next: TimeOfDay) => void;
  days: number[];
  onToggleDay: (day: number) => void;
}) {
  return (
    <>
      {/* canvas 208, running to the wheel's first row at 250 */}
      <View style={{ height: 42 }}>
        <AppText center style={[sans('600'), { fontSize: 14.5, color: '#2A2924' }]}>
          Select time
        </AppText>
      </View>

      <TimeWheel value={time} onChange={onTime} />

      {/* canvas 508, running to the chips at 548 */}
      <View style={{ marginTop: 40, height: 40 }}>
        <AppText center style={[sans('600'), { fontSize: 14.5, color: '#2A2924' }]}>
          Select days
        </AppText>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 34 }}>
        {DAY_LABELS.map((label, day) => {
          const on = days.includes(day);
          return (
            <PressScale
              key={label}
              onPress={() => onToggleDay(day)}
              accessibilityRole="checkbox"
              accessibilityLabel={DAY_NAMES[day]}
              accessibilityState={{ checked: on }}
              hitSlop={{ top: 12, bottom: 12, left: 4, right: 4 }}
              style={{
                width: 38,
                height: 38,
                minHeight: 0,
                borderRadius: 19,
                backgroundColor: on ? '#131313' : '#EFEEEA',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AppText style={[sans('600'), { fontSize: 14, color: '#1D1C1A' }]}>{label}</AppText>
            </PressScale>
          );
        })}
      </View>
    </>
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
