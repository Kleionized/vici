import type { TextStyle } from 'react-native';

import { MonoText, type TextVariant, type Wrap } from '@/components/mono';
import type { MonoTextProps } from '@/components/mono/Text';
import { mono, sans } from '@/lib/theme';

/**
 * The reader's type ramps (lessons.md §3.2, `gen/lesson-v3.js ST`), each with
 * the `text-wrap` its frames state. All Lato, weight as family; no 900 and no
 * italic anywhere in the twelve Week bundles.
 */
export type Ramp =
  | 'display'
  | 'title'
  | 'body'
  | 'small'
  | 'label'
  | 'cardT'
  | 'optQ'
  | 'fbT'
  | 'chainT'
  | 'cmpL'
  | 'cmpT'
  | 'pairL'
  | 'pairR'
  | 'vcap';

const RAMPS: Record<Ramp, { v: TextVariant; wrap: Wrap; style?: TextStyle }> = {
  /** 30/36 700 −0.6 — cover title, `Lesson complete.` */
  display: { v: 'title', wrap: 'balance' },
  /** 24/31 700 −0.4 — Part title, quote, question prompt, reflect lead, task title */
  title: { v: 'lessonHeading', wrap: 'balance' },
  /** 18/28 400 `#B5B0A8` — every paragraph */
  body: { v: 'lessonBody', wrap: 'pretty' },
  /** 15/22 400 `#9B968E` — the question's instruction */
  small: { v: 'pTight', wrap: 'pretty', style: { color: mono.mute } },
  /** 13/16 700 +0.2 `#9B968E` — `Lesson n`, `Part n`, attributions, captions */
  label: { v: 'lessonCaps', wrap: 'balance' },
  /** 16/22 700 ink — the Done-when sentence */
  cardT: { v: 'lessonDoneWhen', wrap: 'pretty' },
  /** 16/22 400 ink — option label */
  optQ: { v: 'lessonOption', wrap: 'pretty' },
  /** 16/22 700 ink — best-answer card */
  fbT: { v: 'lessonDoneWhen', wrap: 'pretty' },
  /** 15/22 400 ink — chain step */
  chainT: { v: 'pTight', wrap: 'pretty', style: { color: mono.ink } },
  /** compare card label: the label ramp */
  cmpL: { v: 'lessonCaps', wrap: 'balance' },
  /** 15/22 400 ink — compare card text */
  cmpT: { v: 'pTight', wrap: 'pretty', style: { color: mono.ink } },
  /** 15/22 700 ink — pairs left cell */
  pairL: { v: 'pTight', wrap: 'pretty', style: { ...sans('700'), color: mono.ink } },
  /** 15/22 400 `#B5B0A8` — pairs right cell */
  pairR: { v: 'pTight', wrap: 'pretty' },
  /** 15/22 400 `#B5B0A8` — the wave's caption */
  vcap: { v: 'pTight', wrap: 'pretty' },
};

/**
 * One run of lesson copy in its frame's ramp.
 *
 * Web reproduces the frame's breaks with CSS `text-wrap`. On native the run
 * goes to `MonoText` whole, which lays it out on the lines WebKit drew it on
 * in `Vici UI 2` wherever the frame broke it (the shared table, D32, D45) —
 * at the width it was drawn at and font scale 1; anywhere else the copy wraps
 * as the platform wraps it.
 */
export function LT({ r, children, wrap, color, style, ...rest }: Omit<MonoTextProps, 'v' | 'children'> & { r: Ramp; children: string }) {
  const ramp = RAMPS[r];
  return (
    <MonoText v={ramp.v} wrap={wrap ?? ramp.wrap} style={[ramp.style, color ? { color } : null, style]} {...rest}>
      {children}
    </MonoText>
  );
}
