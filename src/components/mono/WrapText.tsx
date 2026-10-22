import { Platform, Text, type TextProps, type TextStyle } from 'react-native';

import { halfLeading } from '@/lib/theme';
import { wrapAs } from '@/lib/wrap';

import { latoRuns } from './fallback';

/**
 * A text run laid out in a box `w` wide, broken where the frame's engine broke
 * it (`wrapAs`, D13).
 *
 * When the breaks are applied, every line is one the frame drew inside `w`, but
 * a line that fills the box to the last hundredth can measure a hair wider on
 * iOS and push its last word onto a line of its own ("ask them / to"). With
 * the breaks fixed, the box gets one point of slack on the side the text does
 * not align to — left-aligned text grows to the right, centred text by half a
 * point each side — so no line moves and none can wrap again (D23).
 */
const SLACK = 1;

export function WrapText({ style, w, children, align = 'left', ...rest }: Omit<TextProps, 'style' | 'children'> & { style: TextStyle; w: number | null; children: string; align?: 'left' | 'center' | 'right' }) {
  const text = wrapAs(children, style.fontSize as number, w);
  const broken = text !== children;
  const slack: TextStyle | null = !broken ? null : align === 'center' ? { marginHorizontal: -SLACK / 2 } : align === 'right' ? { marginLeft: -SLACK } : { marginRight: -SLACK };
  return (
    <Text maxFontSizeMultiplier={1.3} {...rest} style={[style, align !== 'left' ? { textAlign: align } : null, slack, Platform.OS === 'ios' ? halfLeading(style.fontSize, style.lineHeight as number | undefined) : null]}>
      {latoRuns(text, style)}
    </Text>
  );
}
