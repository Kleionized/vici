import { Image, View, type ImageStyle, type StyleProp } from 'react-native';

/**
 * The paper grain, laid over a field or a card.
 *
 * The canvas sets it as a `background-image` with no `background-size`, so it
 * **repeats at the file's own 96 × 96**. `expo-image` has no repeat mode — its
 * `contentFit="cover"` blows one tile up to fill the box, which at a full 393 ×
 * 852 screen is roughly a 9× magnification and turns the grain into a smear.
 * React Native's own `Image` does have `resizeMode="repeat"`, so this is the one
 * place in the app that reaches for it instead.
 */
export function Grain({ source, opacity = 0.07, style }: { source: number; opacity?: number; style?: StyleProp<ImageStyle> }) {
  // `pointerEvents` is not an Image prop, so the wrapper carries it.
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Image source={source} resizeMode="repeat" style={[{ width: '100%', height: '100%', opacity }, style]} />
    </View>
  );
}
