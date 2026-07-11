import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { WorldArt } from '@/components/journey/WorldArt';
import { AppText, Screen, ScreenHeader, SettingsGroup, SettingsRow } from '@/components/ui';
import { useCurrentUser } from '@/lib/backend';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * Manage subscription (canvas: money · ManageSubScreen) — the unboxed
 * membership monument up top (plan · price · renewal · ACTIVE), then
 * Plan and Billing groups, the quiet cancel, and the shore seeing you
 * out: "the long road, together."
 */
export default function Subscription() {
  const router = useRouter();
  const user = useCurrentUser();
  const premium = !!user?.settings.premium;
  const renews = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  })();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  return (
    <Screen contentStyle={{ paddingTop: 8, flexGrow: 1 }}>
      <StatusBar style="dark" />
      <ScreenHeader eyebrow="Account" title="Subscription" pad={0} onBack={back} />

      {/* membership — unboxed monument */}
      <View style={{ paddingTop: 4, marginBottom: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <View>
            <AppText style={{ fontFamily: fonts.serif, fontSize: 25, letterSpacing: 0.25, color: colors.text }}>
              {premium ? 'Yearly' : 'Free tools'}
            </AppText>
            <AppText style={[sans('400'), { fontSize: 14, color: colors.textMuted, marginTop: 5 }]}>
              {premium ? `$39.99 / year · renews ${renews}` : 'The urge tool, free forever'}
            </AppText>
          </View>
          <View style={{ backgroundColor: colors.ink, borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 6, marginTop: 3 }}>
            <AppText style={[sans('500'), { fontSize: 11, letterSpacing: 0.88, textTransform: 'uppercase', color: colors.inkText }]}>
              {premium ? 'Active' : 'Free'}
            </AppText>
          </View>
        </View>
        {premium ? (
          <>
            <View style={{ height: 1, backgroundColor: colors.border, marginTop: 18, marginBottom: 14 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText style={[sans('400'), { fontSize: 14, color: colors.textMuted }]}>Next charge</AppText>
              <AppText style={[sans('500'), { fontSize: 14, color: colors.text, fontVariant: ['tabular-nums'] }]}>$39.99 on {renews}</AppText>
            </View>
          </>
        ) : null}
      </View>

      <SettingsGroup header="Plan">
        <SettingsRow glyph="compass" title="Change plan" detail={premium ? 'Yearly · $39.99' : 'Free'} onPress={() => router.push('/paywall')} />
        <SettingsRow glyph="gift" title="Redeem a code" />
        <SettingsRow glyph="restore" title="Restore purchases" last />
      </SettingsGroup>

      <SettingsGroup header="Billing">
        <SettingsRow glyph="card" title="Payment method" detail="Apple ID" />
        <SettingsRow glyph="doc" title="Receipts & invoices" last />
      </SettingsGroup>

      {premium ? (
        <AppText center style={[sans('500'), { fontSize: 15, color: colors.textSoft, paddingVertical: 12 }]}>
          Cancel subscription
        </AppText>
      ) : null}

      {/* the shore, seeing you out */}
      <View style={{ flex: 1 }} />
      <View style={{ alignItems: 'center', paddingBottom: 24, opacity: 0.8 }}>
        <View style={{ width: 176, height: 111, overflow: 'hidden', borderRadius: 12 }}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: -10, aspectRatio: 402 / 300 }}>
            <WorldArt scene="shore" fit="xMidYMid meet" />
          </View>
        </View>
        <AppText style={[sans('500'), { fontSize: 12.5, color: colors.textSoft, marginTop: 2 }]}>the long road, together.</AppText>
      </View>
    </Screen>
  );
}
