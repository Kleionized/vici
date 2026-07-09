import { View } from 'react-native';

import { toDateKey } from '@/lib/date';
import { colors, radius, spacing } from '@/lib/theme';
import { AppText } from './AppText';
import { useOnInk } from './surface';

export interface HeatmapProps {
  /** dateKey (YYYY-MM-DD) → raw value. Intensity is value / max. */
  data: Record<string, number>;
  max?: number;
  /** Number of week columns. */
  weeks?: number;
  color?: string;
  cell?: number;
  gap?: number;
}

/** Monday-of-week for a date. */
function monday(d: Date): Date {
  const out = new Date(d);
  const dow = (out.getDay() + 6) % 7;
  out.setDate(out.getDate() - dow);
  out.setHours(0, 0, 0, 0);
  return out;
}

/**
 * GitHub-style consistency grid — `weeks` columns × 7 day-rows, opacity scaled
 * by value. Reads calm on paper and on ink.
 */
export function Heatmap({ data, max, weeks = 9, color, cell = 14, gap = 4 }: HeatmapProps) {
  const onInk = useOnInk();
  const fill = color ?? colors.positive;
  const empty = onInk ? 'rgba(243,240,231,0.08)' : colors.surfaceAlt;
  const todayKey = toDateKey(new Date());

  const peak = max ?? Math.max(1, ...Object.values(data));
  const startMonday = monday(new Date());
  startMonday.setDate(startMonday.getDate() - (weeks - 1) * 7);

  const columns = Array.from({ length: weeks }, (_, wk) =>
    Array.from({ length: 7 }, (_, day) => {
      const d = new Date(startMonday);
      d.setDate(startMonday.getDate() + wk * 7 + day);
      return d;
    }),
  );

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', gap }}>
        {columns.map((col, wk) => (
          <View key={wk} style={{ gap }}>
            {col.map((d, day) => {
              const key = toDateKey(d);
              const v = data[key] ?? 0;
              const future = d.getTime() > Date.now();
              const intensity = v > 0 ? 0.25 + 0.75 * Math.min(1, v / peak) : 0;
              const isToday = key === todayKey;
              return (
                <View
                  key={day}
                  style={{
                    width: cell,
                    height: cell,
                    borderRadius: 4,
                    backgroundColor: future ? 'transparent' : intensity > 0 ? fill : empty,
                    opacity: future ? 0.3 : intensity > 0 ? intensity : 1,
                    borderWidth: isToday ? 1.5 : 0,
                    borderColor: onInk ? colors.inkText : colors.text,
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'flex-end' }}>
        <AppText variant="soft" style={{ fontSize: 10 }}>
          less
        </AppText>
        {[0.12, 0.4, 0.7, 1].map((o) => (
          <View key={o} style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: fill, opacity: o }} />
        ))}
        <AppText variant="soft" style={{ fontSize: 10 }}>
          more
        </AppText>
      </View>
    </View>
  );
}
