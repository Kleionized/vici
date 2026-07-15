import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, Card, Glyph, IconChip } from '@/components/ui';
import { colors, radius, spacing } from '@/lib/theme';

const DEEP_LINK = 'tideline://urge';

const STEPS = [
  'Open the Shortcuts app and tap + to create a new shortcut.',
  'Add the “Open URLs” action and paste the link below.',
  'Name it something like “Ride it out” and save.',
  'Go to Settings → Accessibility → Touch → Back Tap → Double Tap, and pick your shortcut.',
];

export default function BackTap() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  async function copy() {
    await Clipboard.setStringAsync(DEEP_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  const openShortcuts = () => Linking.openURL('shortcuts://').catch(() => {});

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.lg }}>
          <Pressable onPress={back} hitSlop={10} accessibilityLabel="Back">
            <AppText style={{ fontSize: 24, color: colors.text }}>‹</AppText>
          </Pressable>
          <AppText variant="display" style={{ fontSize: 30 }}>
            back tap.
          </AppText>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.lg }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <IconChip name="wave" size={46} radius={14} tone="ink" />
            <AppText variant="muted" weightOverride="500" style={{ flex: 1, fontSize: 15, lineHeight: 21 }}>
              Open urge support in one move: double-tap the back of your iPhone, from anywhere. iOS runs a Shortcut that opens VICI straight to the urge tool.
            </AppText>
          </View>

          {/* the deep link */}
          <Card>
            <AppText variant="label" style={{ marginBottom: spacing.sm }}>
              Shortcut link
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <AppText selectable weightOverride="600" style={{ flex: 1, fontSize: 16, letterSpacing: 0.2 }}>
                {DEEP_LINK}
              </AppText>
              <Pressable onPress={copy} hitSlop={8} style={{ backgroundColor: colors.accent, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 9 }}>
                <AppText weightOverride="600" color={colors.accentText} style={{ fontSize: 14 }}>
                  {copied ? 'Copied' : 'Copy'}
                </AppText>
              </Pressable>
            </View>
          </Card>

          {/* steps */}
          <View style={{ gap: spacing.md }}>
            {STEPS.map((s, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
                <View style={{ width: 28, height: 28, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
                  <AppText weightOverride="600" style={{ fontSize: 13 }}>
                    {i + 1}
                  </AppText>
                </View>
                <AppText variant="muted" weightOverride="500" style={{ flex: 1, fontSize: 15, lineHeight: 22, paddingTop: 2 }}>
                  {s}
                </AppText>
              </View>
            ))}
          </View>

          <View style={{ gap: spacing.sm }}>
            <Button label="Open Shortcuts app" onPress={openShortcuts} />
            <Button label="Test it now" variant="secondary" onPress={() => router.push('/urge')} />
          </View>

          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg }}>
            <View style={{ marginTop: 1 }}>{Glyph.shield(colors.textMuted)}</View>
            <AppText variant="soft" weightOverride="500" style={{ flex: 1, fontSize: 13.5, lineHeight: 19 }}>
              Back Tap is an iOS accessibility setting, so it’s set up once on your phone. VICI only provides the link it opens.
            </AppText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
