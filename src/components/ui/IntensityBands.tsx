import { Pressable, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppText } from '@/components/ui/AppText';
import { colors, sans } from '@/lib/theme';

/**
 * The canonical urge-intensity input (canvas: UrgeLogIntensity / the urge-surf
 * strength ask): a vertical list of five bands, each led by a 46px circular
 * chip holding the strength mark — a quiet ring with an ink disc that grows
 * with the band. Selected rows take the inset ink border; the chip floods ink.
 */

export const INTENSITY_BANDS: { label: string; note: string }[] = [
  { label: 'Faint', note: 'Barely noticeable' },
  { label: 'Mild', note: 'Easy to set aside' },
  { label: 'Strong', note: 'Hard to ignore' },
  { label: 'Intense', note: 'Hard to resist' },
  { label: 'Overwhelming', note: 'Almost gave in' },
];

/** Band index (0–4) → stored severity (1–10). */
export const bandToSeverity = (i: number) => i * 2 + 2; // 2 · 4 · 6 · 8 · 10
/** Stored severity (1–10) → band index (0–4). */
export const severityToBand = (s: number) => Math.min(4, Math.max(0, Math.ceil(s / 2) - 1));

/** The strength mark — ring + a disc that grows with the pull. */
function StrengthMark({ t, c }: { t: number; c: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      <Circle cx={13} cy={13} r={11} stroke={c} strokeWidth={1.5} opacity={0.5} />
      <Circle cx={13} cy={13} r={3.2 + t * 7.3} fill={c} />
    </Svg>
  );
}

export function IntensityBands({
  value,
  onSelect,
  dark = false,
}: {
  value: number | null;
  onSelect: (index: number) => void;
  dark?: boolean;
}) {
  const cardBg = dark ? 'rgba(255,255,255,0.06)' : colors.surface;
  const chipBg = dark ? 'rgba(255,255,255,0.08)' : colors.accentSoft;
  const ink = dark ? '#EDEDE8' : colors.text;
  const fill = dark ? '#EDEDE8' : colors.ink;
  const onFill = dark ? '#131313' : colors.inkText;
  const mut = dark ? 'rgba(237,237,232,0.55)' : colors.textMuted;
  return (
    <View style={{ gap: 10 }}>
      {INTENSITY_BANDS.map((b, i) => {
        const on = value === i;
        return (
          <Pressable
            key={b.label}
            onPress={() => onSelect(i)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              backgroundColor: cardBg,
              borderRadius: 18,
              paddingVertical: 15,
              paddingHorizontal: 16,
              borderWidth: 1.8,
              borderColor: on ? ink : 'transparent',
              transform: [{ scale: pressed ? 0.99 : 1 }],
            })}>
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 9999,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: on ? fill : chipBg,
              }}>
              <StrengthMark t={i / (INTENSITY_BANDS.length - 1)} c={on ? onFill : ink} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={[sans(on ? '600' : '500'), { fontSize: 15, color: ink }]}>{b.label}</AppText>
              <AppText style={[sans('400'), { fontSize: 13, color: mut, marginTop: 2 }]}>{b.note}</AppText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
