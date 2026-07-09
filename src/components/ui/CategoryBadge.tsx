import { View } from 'react-native';

import { colors } from '@/lib/theme';
import type { LessonCategory } from '@/lib/types';
import { Icon, type IconName } from './Icon';
import { useOnInk } from './surface';

/** Per-category icon + tint — identity now comes from the glyph; the tints are
 * the neutral ink scale (the canvas removed hue identities app-wide). */
export const LESSON_VISUAL: Record<LessonCategory, { icon: IconName; tint: string }> = {
  motivation: { icon: 'sparkle', tint: colors.category.motivation },
  physiological: { icon: 'pulse', tint: colors.category.physiological },
  environmental: { icon: 'leaf', tint: colors.category.environmental },
  psychological: { icon: 'mood', tint: colors.category.psychological },
  existential: { icon: 'compass', tint: colors.category.existential },
  social: { icon: 'people', tint: colors.category.social },
  psychiatric: { icon: 'heart', tint: colors.category.psychiatric },
  meta: { icon: 'book', tint: colors.category.meta },
};

/**
 * The canvas IconChip — a soft neutral square-ish chip holding a monotone ink
 * glyph. `filled` inverts it to the ink fill with a paper glyph.
 */
export function CategoryBadge({
  category,
  size = 40,
  filled = false,
}: {
  category: LessonCategory;
  size?: number;
  filled?: boolean;
}) {
  const { icon } = LESSON_VISUAL[category];
  const onInk = useOnInk();
  const bg = filled ? colors.ink : onInk ? 'rgba(245,244,241,0.1)' : colors.accentSoft;
  const glyph = filled ? colors.inkText : onInk ? colors.inkText : colors.text;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
      }}>
      <Icon name={icon} size={Math.round(size * 0.5)} color={glyph} strokeWidth={1.8} />
    </View>
  );
}
