import { Pressable, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppText } from '@/components/ui/AppText';
import { colors, sans } from '@/lib/theme';

/**
 * The canonical urge-intensity input: a vertical list of five bands, each row
 * an ink ring that fills with the level plus a short factual descriptor. Used
 * identically by the Urge tab and the urge log — never a slider, never a
 * morphing scene. `dark` renders the same rows on a near-black ground.
 */

export const INTENSITY_BANDS: { label: string; note: string }[] = [
  { label: 'Faint', note: 'Barely noticeable' },
  { label: 'Mild', note: 'There, but manageable' },
  { label: 'Strong', note: 'Hard to ignore' },
  { label: 'Intense', note: 'Pulling hard' },
  { label: 'Overwhelming', note: 'Almost gave in' },
];

/** Band index (0–4) → stored severity (1–10). */
export const bandToSeverity = (i: number) => i * 2 + 2; // 2 · 4 · 6 · 8 · 10
/** Stored severity (1–10) → band index (0–4). */
export const severityToBand = (s: number) => Math.min(4, Math.max(0, Math.ceil(s / 2) - 1));

function FillRing({ fraction, on, dark }: { fraction: number; on: boolean; dark: boolean }) {
  const R = 10.5;
  const C = 2 * Math.PI * R;
  const ink = dark ? '#EDEDE8' : colors.text;
  const faint = dark ? 'rgba(237,237,232,0.22)' : 'rgba(0,0,0,0.14)';
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Circle cx={15} cy={15} r={R} stroke={on ? ink : faint} strokeWidth={2} fill="none" opacity={on ? 0.35 : 1} />
      <Circle
        cx={15}
        cy={15}
        r={R}
        stroke={ink}
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${C * fraction} ${C}`}
        transform="rotate(-90 15 15)"
        opacity={on ? 1 : 0.55}
      />
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
  const ink = dark ? '#EDEDE8' : colors.text;
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
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderWidth: 1.8,
              borderColor: on ? ink : 'transparent',
              transform: [{ scale: pressed ? 0.99 : 1 }],
            })}>
            <FillRing fraction={(i + 1) / 5} on={on} dark={dark} />
            <View style={{ flex: 1 }}>
              <AppText style={[sans(on ? '600' : '500'), { fontSize: 15.5, color: ink }]}>{b.label}</AppText>
              <AppText style={[sans('400'), { fontSize: 12.5, color: mut, marginTop: 1 }]}>{b.note}</AppText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
