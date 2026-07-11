import { Image, View } from 'react-native';

import { colors } from '@/lib/theme';

/**
 * Laurel — the wreath brand mark, from the supplied artwork (assets/laurel-mark.webp,
 * dark-on-transparent). Tinted per surface: ink on paper, paper on ink; muted
 * callers pass a softer color + the design's 0.68 opacity via `muted`.
 * The art sits small in its frame, so it scales up 1.32× like the canvas.
 */
export function Laurel({ size = 20, color = colors.text, muted = false }: { size?: number; color?: string; muted?: boolean }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../../../assets/images/laurel-mark.webp')}
        style={{
          width: size,
          height: size,
          resizeMode: 'contain',
          tintColor: color,
          opacity: muted ? 0.68 : 1,
          transform: [{ scale: 1.32 }],
        }}
      />
    </View>
  );
}
