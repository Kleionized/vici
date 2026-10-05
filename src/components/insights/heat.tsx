import { View } from 'react-native';

import { MonoText } from '@/components/mono';
import { mono, ring, toneRamp } from '@/lib/theme';

/**
 * Insights' mood heat (no frame draws it — routes §4.3): one disc per day on
 * the check-in tone ramp (`#34322F` → `#F2F0EC`, Morning Feeling's discs), the
 * day letters over them, the legend under them, and the range switch's three
 * spans. Styled after Weekly Report — Days: discs on a 7-column row, a day
 * with no check-in the hollow `#2E2E2E` ring, today ringed in line grey.
 */

export const MOOD_NAME = ['Low', 'Down', 'Fine', 'Good', 'Radiant'];
export const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** The range switch's spans and the disc each draws a day at. */
export const AN_RANGES = [
  { label: '2W', days: 14, d: 40 },
  { label: '4W', days: 28, d: 40 },
  { label: '12W', days: 84, d: 20 },
];

/**
 * The day letters over the discs: 11/700 `#5A574F`, centred on each 40 column.
 * The rows run back from today, so the first column is whatever weekday the
 * range opens on (`first`, 0 = Monday) — not always Monday.
 */
export function HeatHeader({ first = 0 }: { first?: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {DOW.map((_, i) => DOW[(first + i) % 7]).map((d, i) => (
        <View key={i} style={{ width: 40, alignItems: 'center' }}>
          <MonoText v="pill" style={{ fontSize: 11, lineHeight: 13 }} color={mono.art}>
            {d}
          </MonoText>
        </View>
      ))}
    </View>
  );
}

/** One week: seven discs of `d`, centred in 40 columns, space-between; `v` 0–4 or null (no check-in). */
export function HeatRow({ week, d, todayIdx = -1 }: { week: (number | null)[]; d: number; todayIdx?: number }) {
  const cells = [...week];
  while (cells.length < 7) cells.push(null);
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {cells.map((v, i) => (
        <View key={i} style={{ width: 40, height: d, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: d,
              height: d,
              borderRadius: d / 2,
              backgroundColor: v == null ? 'transparent' : toneRamp[v],
              boxShadow: i === todayIdx ? ring.outline : v == null ? ring.insetLine : undefined,
            }}
          />
        </View>
      ))}
    </View>
  );
}

/** The ramp's five discs, "Low → Radiant", and the hollow "No check-in" — 12/700 mute. */
export function HeatLegend() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {toneRamp.map((c) => (
            <View key={c} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c }} />
          ))}
        </View>
        <MonoText v="pill" style={{ fontSize: 12, lineHeight: 15 }} color={mono.mute}>
          Low → Radiant
        </MonoText>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, boxShadow: ring.insetLine }} />
        <MonoText v="pill" style={{ fontSize: 12, lineHeight: 15 }} color={mono.mute}>
          No check-in
        </MonoText>
      </View>
    </View>
  );
}
