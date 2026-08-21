import { View, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/**
 * The canvas's hill: a box whose top edge is an elliptical arc.
 *
 * The bundle draws these with an elliptical border radius —
 * `border-radius: 50% 50% 0 0 / 46px 46px 0 0` — which is a top-left and a
 * top-right corner each `50%` of the width across and `46px` tall. The two
 * horizontal radii sum to the full width, so the corners meet at the centre and
 * the top edge is one arc peaking at the top-middle.
 *
 * React Native has no elliptical radius: `borderTopLeftRadius` is a single
 * number, so a hill written that way comes out either a stadium or a clipped
 * circle, and the silhouette is wrong. This draws the arc instead.
 *
 * The viewBox is 100 wide with `preserveAspectRatio="none"`, so the horizontal
 * scale follows the box and the vertical stays 1:1 — which is exactly what a
 * percentage horizontal radius and an absolute vertical one describe.
 */
export function Hill({
  height,
  /** The vertical radius the canvas states, in points. */
  rise,
  color,
  style,
}: {
  height: number;
  rise: number;
  color: string;
  style?: ViewStyle;
}) {
  const ry = (rise / height) * 100;
  return (
    <View pointerEvents="none" style={[{ height, overflow: 'hidden' }, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 100 100`} preserveAspectRatio="none">
        <Path d={`M0,${ry} A50,${ry} 0 0 1 100,${ry} L100,100 L0,100 Z`} fill={color} />
      </Svg>
    </View>
  );
}
