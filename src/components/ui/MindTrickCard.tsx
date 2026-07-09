import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { colors, fonts, fontSize, spacing } from '@/lib/theme';
import { AppText } from './AppText';
import { Card } from './Card';
import { Icon } from './Icon';

/** Tap to flip from the rationalisation ("the trick") to its grounded counter. */
export function MindTrickCard({ lie, truth }: { lie: string; truth: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable onPress={() => setOpen((o) => !o)} accessibilityRole="button" accessibilityState={{ expanded: open }}>
      <Card>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
            <AppText variant="label">The trick</AppText>
            <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
              <Icon name="arrow" size={16} color={colors.textSofter} />
            </View>
          </View>
          <AppText
            weightOverride="500"
            style={{ fontStyle: 'italic', fontSize: fontSize.lg, lineHeight: fontSize.lg * 1.35, color: colors.text }}>
            “{lie}”
          </AppText>
          {open ? (
            <View style={{ gap: spacing.xs, marginTop: spacing.xs }}>
              <AppText variant="label" color={colors.positive}>
                The truth
              </AppText>
              <AppText variant="muted">{truth}</AppText>
            </View>
          ) : (
            <AppText variant="soft">Tap to see the catch</AppText>
          )}
        </View>
      </Card>
    </Pressable>
  );
}
