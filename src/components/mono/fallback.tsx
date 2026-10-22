import type { ReactNode } from 'react';
import { Text, type TextStyle } from 'react-native';

/**
 * Characters Lato does not have (checked against the bundled Lato 400 cmap):
 * the arrows and the dingbats. The frames set every run in
 * `'Lato', -apple-system, system-ui`, so WebKit draws these in the system
 * face; iOS, given only a Lato family, falls back to a face of its own choosing
 * (a thin arrow from another font, a different width). Each such character is
 * drawn in the system face here, at the run's weight (Vici UI 2, D26).
 */
const NOT_IN_LATO = /[←-⇿☀-➿]/;
const SPLIT = /([←-⇿☀-➿]+)/;

/** The run's weight as the system face takes it: Lato's families name it (`Lato_700Bold`). */
function weightOf(style: TextStyle | undefined): TextStyle['fontWeight'] {
  const f = String(style?.fontFamily ?? '');
  return /900/.test(f) ? '900' : /700/.test(f) ? '700' : '400';
}

export function latoRuns(text: string, style?: TextStyle): ReactNode {
  if (!NOT_IN_LATO.test(text)) return text;
  const weight = weightOf(style);
  return text.split(SPLIT).map((part, i) =>
    i % 2 === 1 ? (
      <Text key={i} style={{ fontFamily: 'System', fontWeight: weight }}>
        {part}
      </Text>
    ) : (
      part
    ),
  );
}
