import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Illo, ScreenHeader, SettingsGroup, SettingsRow } from '@/components/ui';
import { colors, fonts, radius, sans, spacing } from '@/lib/theme';

/** Manage subscription — reachable from Settings. */
export default function Subscription() {
  const router = useRouter();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ paddingTop: spacing.sm }}>
          <ScreenHeader hue={230} eyebrow="Account" title="Subscription" onBack={back} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false}>
          {/* membership — unboxed monument */}
          <View style={{ paddingHorizontal: spacing.xl, marginBottom: 30 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <AppText style={{ fontFamily: fonts.serif, fontSize: 25, letterSpacing: 0.25, color: colors.text }}>
                  Yearly + Coach
                </AppText>
                <AppText variant="muted" style={{ marginTop: 5, fontSize: 14 }}>
                  $99.99 / year · renews 14 Mar 2027
                </AppText>
              </View>
              <View style={{ backgroundColor: colors.ink, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6, marginTop: 3 }}>
                <AppText style={[sans('500'), { fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.inkText }]}>
                  Active
                </AppText>
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: colors.border, marginTop: 18, marginBottom: 14 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText variant="muted" style={{ fontSize: 14 }}>
                Next charge
              </AppText>
              <AppText style={[sans('500'), { fontSize: 14, color: colors.text }]}>
                $99.99 on 14 Mar 2027
              </AppText>
            </View>
          </View>

          <SettingsGroup header="Plan">
            <SettingsRow glyph="compass" title="Change plan" detail="Yearly · $39.99" />
            <SettingsRow glyph="gift" title="Redeem a code" />
            <SettingsRow glyph="restore" title="Restore purchases" last />
          </SettingsGroup>

          <SettingsGroup header="Billing">
            <SettingsRow glyph="card" title="Payment method" detail="Apple ID" />
            <SettingsRow glyph="doc" title="Receipts & invoices" last />
          </SettingsGroup>

          <View style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
            <Pressable hitSlop={8} style={{ paddingVertical: 14 }}>
              <AppText weightOverride="600" style={{ color: colors.textSoft, fontSize: 15 }}>
                Cancel subscription
              </AppText>
            </Pressable>
          </View>

          <View style={{ alignItems: 'center', paddingTop: spacing.xl, opacity: 0.5 }}>
            {Illo.tide(colors.text, { w: 150, h: 88 })}
            <AppText weightOverride="700" style={{ color: colors.textMuted, marginTop: 6, fontSize: 13 }}>
              the long road, together.
            </AppText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
