import { type ReactNode, useState } from 'react';
import { View } from 'react-native';

import { WorldArt } from '@/components/journey/WorldArt';

/**
 * WorldCardArt (canvas: screens-worlds) — a world's full 402×300 landscape
 * cropped into a card band, shifted up per world so the horizon/water line
 * frames the crop. Offsets are the design's px values in 402-wide space,
 * scaled to the measured card width. Locked cards ghost the art.
 */
export const ART_FOCUS: Record<string, number> = {
  shore: -58,
  sailing: -44,
  deep: -40,
  island: -46,
  base: -46,
  climb: -42,
  cave: -40,
  higher: -44,
  clouds: -38,
  summit: -52,
  curio: -42,
  help: -42,
};

export function WorldCardArt({
  sceneKey,
  height,
  ghost = false,
  children,
}: {
  sceneKey: string;
  height: number;
  ghost?: boolean;
  children?: ReactNode;
}) {
  const [w, setW] = useState(0);
  const focus = ART_FOCUS[sceneKey] ?? -46;
  const scale = w > 0 ? w / 402 : 1;
  return (
    <View
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={{ position: 'relative', height, overflow: 'hidden', backgroundColor: '#EFECE1' }}>
      {w > 0 ? (
        <View style={{ position: 'absolute', left: 0, width: w, top: focus * scale, height: 300 * scale, opacity: ghost ? 0.42 : 1 }}>
          <WorldArt scene={sceneKey} fit="xMidYMid meet" />
        </View>
      ) : null}
      {children}
    </View>
  );
}
