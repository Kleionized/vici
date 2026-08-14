import { ActivityIndicator, View } from 'react-native';

import { colors, spacing } from '@/lib/theme';
import { AppText } from './AppText';
import { Illustration } from './Illustration';
/**
 * The wait, inside the app. The canvas gives the dark "Finding the waterline"
 * field to the cold open only — see `WaterlineScene` and `app/index.tsx` — so
 * navigating between two paper screens gets this quiet spinner instead of a
 * full-bleed night flash.
 */
export function LoadingView({ label }: { label?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl }}>
      <ActivityIndicator color={colors.textSoft} />
      {label ? <AppText variant="soft">{label}</AppText> : null}
    </View>
  );
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <View style={{ alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl }}>
      <View style={{ marginBottom: spacing.sm }}>
        <Illustration name="tide" width={150} color={colors.textSofter} accent={colors.borderStrong} />
      </View>
      <AppText variant="subtitle" center>
        {title}
      </AppText>
      {body ? (
        <AppText variant="soft" center>
          {body}
        </AppText>
      ) : null}
    </View>
  );
}
