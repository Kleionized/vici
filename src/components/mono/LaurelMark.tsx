import { Image, type ImageStyle, type StyleProp } from 'react-native';

const laurel = require('../../../assets/images/laurel-mark.webp');

/**
 * The laurel (design-system §6): `<img src="laurel-mark.webp">` with
 * `filter: brightness(0) invert(1)` — every pixel the artwork paints becomes
 * pure `#FFFFFF`, alpha kept. `tintColor="#FFFFFF"` is the same arithmetic on
 * both platforms.
 *
 * The source is 280 × 252, but every placement states a square `width` and
 * `height` with no `object-fit`, so the browser stretches it to the square;
 * `resizeMode="stretch"` keeps that (contain would letterbox it 10 % short).
 * Sizes the frames draw: 120 (Splash), 104 (Login, Welcome Back), 40 r10 (the
 * Reminders Setup notification icon), 28 (Paywall).
 */
export function LaurelMark({ size, radius, style }: { size: number; radius?: number; style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      source={laurel}
      tintColor="#FFFFFF"
      resizeMode="stretch"
      accessible={false}
      style={[{ width: size, height: size, flexShrink: 0 }, radius ? { borderRadius: radius } : null, style]}
    />
  );
}
