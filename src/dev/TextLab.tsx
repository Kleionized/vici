import { Text, View } from 'react-native';

import { WrapText } from '@/components/mono';
import { sans } from '@/lib/theme';

/** Strings the Vici UI 2 run measures in WebKit and here, to find where text widths part (dev harness only). */
export const TEXT_LAB = [
  'don’t',
  "don't",
  'finish',
  'fi',
  'f i',
  'You don’t have to keep going over it until',
  'you feel worse. You can finish here and',
];

/** Size / line-height pairs the frames set tighter than (or near) Lato's natural 1.2 — for where the glyphs sit vertically. */
export const V_LAB: readonly [number, number][] = [
  [48, 50],
  [56, 56],
  [44, 52],
  [40, 46],
  [60, 70],
  [34, 40],
  [26, 33],
  [32, 38],
];

/** Each pair in a box at x 24, y 80 + 90·i, white Lato 700 "×23 Hg" — screenshot it against `textlab.mjs --v`. */
export function VLab() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {V_LAB.map(([size, lh], i) => (
        <View key={i} style={{ position: 'absolute', left: 24, top: 80 + 90 * i }}>
          <Text style={{ ...sans('700'), fontSize: size, lineHeight: lh, color: '#FFF' }}>×23 Hg</Text>
        </View>
      ))}
    </View>
  );
}

export function TextLab() {
  return (
    <View style={{ flex: 1, paddingTop: 100, backgroundColor: '#0D0D0D' }}>
      {TEXT_LAB.map((s) => (
        <View key={s} style={{ flexDirection: 'row' }}>
          <Text
            onTextLayout={(e) => console.log(`[textlab] ${JSON.stringify(s)} ${e.nativeEvent.lines.map((l) => l.width.toFixed(3)).join(',')}`)}
            style={{ ...sans('400'), fontSize: 16, lineHeight: 25, color: '#F2F0EC' }}>
            {s}
          </Text>
        </View>
      ))}
      {(
        [
          ['none', {}],
          ['zero', { letterSpacing: 0 }],
          ['undef-after-0.4', [{ letterSpacing: 0.4 }, { letterSpacing: undefined }]],
          ['0.4', { letterSpacing: 0.4 }],
        ] as const
      ).map(([k, st]) => (
        <View key={k} style={{ flexDirection: 'row' }}>
          <Text
            onTextLayout={(e) => console.log(`[textlab] ls-${k} ${e.nativeEvent.lines.map((l) => l.width.toFixed(3)).join(',')}`)}
            style={[{ ...sans('400'), fontSize: 16, lineHeight: 25, color: '#F2F0EC' }, st]}>
            You don’t have to keep going over it until
          </Text>
        </View>
      ))}
      <View style={{ width: 345, marginLeft: 24 }}>
        <WrapText
          w={345}
          onTextLayout={(e) => console.log(`[textlab] wrap ${e.nativeEvent.lines.map((l) => `${l.width.toFixed(3)}:${JSON.stringify(l.text)}`).join(' | ')}`)}
          style={{ ...sans('400'), fontSize: 16, lineHeight: 25, color: '#B5B0A8' }}>
          You don’t have to keep going over it until you feel worse. You can finish here and get back to whatever you need to do.
        </WrapText>
      </View>
    </View>
  );
}
