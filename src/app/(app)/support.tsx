import { useRouter } from 'expo-router';
import { Linking, Pressable, View } from 'react-native';

import { AppText, Button, Card, Header, Screen } from '@/components/ui';
import { colors, spacing } from '@/lib/theme';

/**
 * Crisis / professional-help route (invariant #5). Tideline is NOT medical
 * advice. Real, localised resources are loaded by the human later — everything
 * here is a clearly-marked placeholder. TODO(jerry): replace with vetted,
 * region-aware crisis + professional-help resources.
 */
const PLACEHOLDER_RESOURCES = [
  {
    name: '[PLACEHOLDER] Crisis line',
    detail: 'Add a real, region-appropriate 24/7 crisis number or text line here.',
    url: undefined as string | undefined,
  },
  {
    name: '[PLACEHOLDER] Find a therapist',
    detail: 'Link to a vetted directory for professional support.',
    url: undefined as string | undefined,
  },
];

export default function Support() {
  const router = useRouter();

  return (
    <Screen contentStyle={{ paddingTop: spacing.xl, gap: spacing.lg }}>
      <Header
        title="You're not alone in this."
        subtitle="VICI is a self-help tool, not medical advice or a crisis service. If you're in danger or thinking about harming yourself, please reach out to a real person now."
      />

      {PLACEHOLDER_RESOURCES.map((r) => (
        <Card key={r.name} style={{ backgroundColor: colors.surfaceAlt }}>
          <View style={{ gap: spacing.xs }}>
            <AppText weightOverride="600">{r.name}</AppText>
            <AppText variant="soft">{r.detail}</AppText>
            {r.url ? (
              <Pressable onPress={() => Linking.openURL(r.url as string)} hitSlop={6}>
                <AppText variant="soft" color={colors.text}>
                  Open →
                </AppText>
              </Pressable>
            ) : null}
          </View>
        </Card>
      ))}

      <AppText variant="soft">
        Note for the build: these are placeholders. Real crisis and professional-help resources must be
        added before this ships to anyone.
      </AppText>

      <Button label="Back" variant="secondary" onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)/today'))} />
    </Screen>
  );
}
