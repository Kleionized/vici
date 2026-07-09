import { View } from 'react-native';

import { colors, radius, spacing } from '@/lib/theme';
import { AppText } from './AppText';
import { useOnInk } from './surface';

export interface BarChartProps {
  /** Bar values; `null` renders an empty tick. */
  values: (number | null)[];
  max: number;
  height?: number;
  color?: string;
  trackColor?: string;
  labels?: string[];
  /** Highlights one bar (e.g. today) at full strength; others dim slightly. */
  highlightIndex?: number;
}

export function BarChart({ values, max, height = 96, color, trackColor, labels, highlightIndex }: BarChartProps) {
  const onInk = useOnInk();
  const bar = color ?? colors.chart.sleep;
  const track = trackColor ?? (onInk ? 'rgba(243,240,231,0.10)' : colors.surfaceAlt);

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, height }}>
        {values.map((v, i) => {
          const ratio = v == null ? 0 : Math.max(0, Math.min(1, v / max));
          const dim = highlightIndex != null && highlightIndex !== i ? 0.55 : 1;
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center', height: '100%' }}>
              <View
                style={{
                  width: '64%',
                  maxWidth: 22,
                  height: '100%',
                  backgroundColor: track,
                  borderRadius: radius.pill,
                  justifyContent: 'flex-end',
                  overflow: 'hidden',
                }}>
                {v == null ? (
                  <View style={{ height: 4, backgroundColor: onInk ? colors.inkBorder : colors.border }} />
                ) : (
                  <View style={{ height: `${ratio * 100}%`, backgroundColor: bar, opacity: dim, borderRadius: radius.pill }} />
                )}
              </View>
            </View>
          );
        })}
      </View>
      {labels ? (
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {labels.map((l, i) => (
            <AppText key={i} variant="soft" center style={{ flex: 1, fontSize: 11 }}>
              {l}
            </AppText>
          ))}
        </View>
      ) : null}
    </View>
  );
}
