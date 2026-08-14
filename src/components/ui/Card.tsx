import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadow, spacing } from '@/lib/theme';
import { InkSurface } from './surface';

export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Left accent bar colour (e.g. per-event-type tint). */
  accent?: string;
  padded?: boolean;
  /**
   * Surface tone. `'paper'` (default) is a softly lifted solid-white card;
   * `'ink'` is THE dark surface (solid #131313) used for
   * hero/feature cards. Text inside ink flips light automatically.
   */
  tone?: 'paper' | 'ink';
  /** Full-bleed decorative layer rendered behind the content, clipped to the card. */
  art?: ReactNode;
}

export function Card({ children, style, accent, padded = true, tone = 'paper', art }: CardProps) {
  const ink = tone === 'ink';
  const radiusV = ink ? radius.xl : radius.lg;
  const content = ink ? <InkSurface>{children}</InkSurface> : children;

  return (
    <View
      style={[
        {
          borderRadius: radiusV,
          borderCurve: 'continuous',
          overflow: 'hidden',
          backgroundColor: ink ? colors.ink : colors.surface,
          ...(ink ? shadow.ink : shadow.card),
        },
        padded ? { padding: ink ? 18 : spacing.lg } : null,
        accent ? { borderLeftWidth: 3, borderLeftColor: accent } : null,
        style,
      ]}>
      {art ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
          {ink ? <InkSurface>{art}</InkSurface> : art}
        </View>
      ) : null}
      {content}
    </View>
  );
}
