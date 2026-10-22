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
