import { View, type ColorValue } from 'react-native';

/** Neutral placeholder tab glyph. TODO(jerry): swap for real icons in the design pass. */
export function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
  return (
    <View
      style={{
        width: 18,
        height: 18,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: color,
        backgroundColor: focused ? color : 'transparent',
      }}
    />
  );
}
