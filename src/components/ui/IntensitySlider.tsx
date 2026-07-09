import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';

import { colors, radius, shadow, spacing } from '@/lib/theme';
import { AppText } from './AppText';

export interface IntensitySliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
}

const word = (v: number) => (v <= 2 ? 'Faint' : v <= 4 ? 'Mild' : v <= 6 ? 'Building' : v <= 8 ? 'Strong' : 'Overwhelming');

/** A draggable / tappable 1–10 intensity slider with a big readout. */
export function IntensitySlider({
  value,
  onChange,
  min = 1,
  max = 10,
  leftLabel = 'Barely there',
  rightLabel = 'Overwhelming',
}: IntensitySliderProps) {
  const [w, setW] = useState(0);
  const thumb = 30;

  const update = (x: number) => {
    if (w <= 0) return;
    const ratio = Math.max(0, Math.min(1, x / w));
    const v = Math.round(min + ratio * (max - min));
    if (v !== value) onChange(v);
  };

  const ratio = (value - min) / (max - min);
  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);
  const onTouch = (e: GestureResponderEvent) => update(e.nativeEvent.locationX);

  return (
    <View style={{ gap: spacing.lg }}>
      <View style={{ alignItems: 'center', gap: 2 }}>
        <AppText variant="hero">{value}</AppText>
        <AppText variant="soft">{word(value)}</AppText>
      </View>

      <View
        onLayout={onLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={onTouch}
        onResponderMove={onTouch}
        style={{ height: 40, justifyContent: 'center' }}>
        <View style={{ height: 12, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, overflow: 'hidden' }}>
          <LinearGradient
            colors={[colors.info, colors.caution] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: `${Math.max(5, ratio * 100)}%`, height: '100%' }}
          />
        </View>
        <View
          pointerEvents="none"
          style={[
            shadow.card,
            {
              position: 'absolute',
              left: Math.max(0, Math.min(w - thumb, ratio * w - thumb / 2)),
              width: thumb,
              height: thumb,
              borderRadius: thumb / 2,
              backgroundColor: colors.text,
              borderWidth: 3,
              borderColor: colors.bg,
            },
          ]}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText variant="soft">{leftLabel}</AppText>
        <AppText variant="soft">{rightLabel}</AppText>
      </View>
    </View>
  );
}
