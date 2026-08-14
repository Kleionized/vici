import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '@/lib/theme';

/**
 * Quiet line marks for the lesson pages, in the reference's own idiom — the
 * Lesson Reader's thin wave with one ink dot on it (canvas: Lesson Reader).
 *
 * They are deliberately abstract. A page of authored prose needs somewhere for
 * the eye to rest before it starts reading, not a picture that argues with the
 * words. One stroke colour, one solid dot, nothing else.
 *
 * `crest` is transcribed from the canvas at its own 260 × 84 box; the rest keep
 * the 132 × 64 box they were drawn in. All of them render to the same 84pt band
 * so the page's geometry does not move when the mark changes.
 */

export type LessonMarkName = 'crest' | 'scales' | 'rings' | 'fork' | 'rise' | 'horizon' | 'links' | 'gate';

const NAMES: LessonMarkName[] = ['crest', 'scales', 'rings', 'fork', 'rise', 'horizon', 'links', 'gate'];

/** The natural box each mark was drawn in, so it can be scaled without distortion. */
const BOX: Record<LessonMarkName, { w: number; h: number }> = {
  crest: { w: 260, h: 84 },
  scales: { w: 132, h: 64 },
  rings: { w: 132, h: 64 },
  fork: { w: 132, h: 64 },
  rise: { w: 132, h: 64 },
  horizon: { w: 132, h: 64 },
  links: { w: 132, h: 64 },
  gate: { w: 132, h: 64 },
};

/** The canvas's own line under the wave. It reads the drawing, so only the
 * drawing it describes carries it. */
export const CREST_CAPTION = 'You are here — near the crest.';

export function markCaption(name: LessonMarkName): string | null {
  return name === 'crest' ? CREST_CAPTION : null;
}

/** A stable mark for a page, varied so consecutive pages never repeat. */
export function markFor(seed: number): LessonMarkName {
  return NAMES[Math.abs(Math.round(seed)) % NAMES.length];
}

/** The wave's own curve, shared by the stroke and the wash under it. */
const CREST_D = 'M0 64 Q 32 22 65 50 T 130 42 T 195 30 T 260 20';

export function LessonMark({ name, height = 84 }: { name: LessonMarkName; height?: number }) {
  const line = 'rgba(29,28,26,0.28)';
  const ink = colors.ink;
  const stroke = { stroke: line, strokeWidth: 2.4, fill: 'none' as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const box = BOX[name];
  const width = (box.w / box.h) * height;

  return (
    <View style={{ width, height }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${box.w} ${box.h}`} fill="none">
        {name === 'crest' && (
          <>
            <Path d={`${CREST_D} L260 84 L0 84 Z`} fill="rgba(19,19,19,0.06)" />
            <Path d={CREST_D} fill="none" stroke="#B4B1AB" strokeWidth={3} strokeLinecap="round" />
            <Circle cx={130} cy={42} r={6} fill="#131313" />
            <Circle cx={130} cy={42} r={11} fill="none" stroke="rgba(19,19,19,0.2)" strokeWidth={1.5} />
          </>
        )}
        {name === 'scales' && (
          <>
            <Path d="M66 12v40M42 52h48" {...stroke} />
            <Path d="M26 18h80M26 18v10M106 18v10" {...stroke} />
            <Path d="M12 28a14 14 0 0 0 28 0M92 28a14 14 0 0 0 28 0" {...stroke} />
            <Circle cx={66} cy={18} r={5.5} fill={ink} />
          </>
        )}
        {name === 'rings' && (
          <>
            <Circle cx={66} cy={32} r={26} {...stroke} />
            <Circle cx={66} cy={32} r={15} {...stroke} />
            <Circle cx={66} cy={32} r={5.5} fill={ink} />
          </>
        )}
        {name === 'fork' && (
          <>
            <Path d="M8 52h32c18 0 14-38 32-38h52" {...stroke} />
            <Path d="M40 52h84" {...stroke} />
            <Circle cx={40} cy={52} r={5.5} fill={ink} />
          </>
        )}
        {name === 'rise' && (
          <>
            <Path d="M8 54c26 0 34-6 46-20S86 12 124 10" {...stroke} />
            <Path d="M8 58V26" {...stroke} />
            <Circle cx={124} cy={10} r={5.5} fill={ink} />
          </>
        )}
        {name === 'horizon' && (
          <>
            <Path d="M6 44h120" {...stroke} />
            <Path d="M44 44a22 22 0 0 1 44 0" {...stroke} />
            <Circle cx={66} cy={22} r={5.5} fill={ink} />
          </>
        )}
        {name === 'links' && (
          <>
            <Circle cx={50} cy={32} r={21} {...stroke} />
            <Circle cx={82} cy={32} r={21} {...stroke} />
            <Circle cx={66} cy={32} r={5.5} fill={ink} />
          </>
        )}
        {name === 'gate' && (
          <>
            <Path d="M38 56V38a28 28 0 0 1 56 0v18" {...stroke} />
            <Path d="M14 56h104" {...stroke} />
            <Circle cx={66} cy={40} r={5.5} fill={ink} />
          </>
        )}
      </Svg>
    </View>
  );
}
