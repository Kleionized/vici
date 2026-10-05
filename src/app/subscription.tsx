import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { Card, GhostLink, ListRow, ListRows, MonoText, NavBar, Pill, Screen, ScrollRegion } from '@/components/mono';
import { dayMonthYear } from '@/lib/format';
import { usePurchases } from '@/lib/purchases';
import { lhNormal, mono, sans } from '@/lib/theme';

/**
 * `Manage Subscription` (15) — the membership card (plan, the sentence under
 * it, the "Active" pill, the next charge under a rule), then the Plan and
 * Billing row groups, and the quiet cancel the board ends on.
 *
 * The plan, the price and the renewal date are read from RevenueCat's
 * CustomerInfo rather than from a stored flag, so a renewal, a cancellation in
 * the store's own settings, a refund or a Family Sharing change is reflected
 * the next time this screen is opened. The five rows and the cancel line open
 * RevenueCat's Customer Center where the build can present it, and the store's
 * own subscription settings where it cannot (DECISIONS D-092).
 *
 * The frame draws only a renewing yearly membership. The other states keep
 * the app's own words in the frame's sentence (D222): monthly is the same
 * sentence with "a month"; cancelled-but-active says "Runs until"; lifetime
 * keeps "· billed once"; a free account keeps "Free tools" / "Core tools
 * included" and a "Free" pill, with no next charge and no cancel.
 */

/** The store an entitlement came from, in that store's own words. */
const STORE_NAME: Record<string, string> = {
  APP_STORE: 'Apple ID',
  MAC_APP_STORE: 'Apple ID',
  PLAY_STORE: 'Google Play',
  AMAZON: 'Amazon',
  STRIPE: 'Card',
  RC_BILLING: 'Card',
  PADDLE: 'Card',
  PROMOTIONAL: 'Granted',
  TEST_STORE: 'Test Store',
};

/** The ghost link (15 tall text at bottom 56) takes 74 off the screen's bottom edge. */
const CONTROLS = 56 + 18;

export default function Subscription() {
  const router = useRouter();
  const { membership, planFor, restore, presentCustomerCenter, presentCodeRedemption, manageSubscriptions } = usePurchases();
  const premium = membership.isActive;
  const plan = membership.plan ?? 'yearly';

  // The canvas draws all five rows and the cancel line as pressable. Managing,
  // cancelling, requesting a refund and changing plan all live outside the app,
  // and Customer Center is the surface RevenueCat gives for them; where a build
  // cannot present it — Expo Go, web, an SDK without it — each falls through to
  // the store's own subscription settings (DECISIONS D-092).
  const support = () => {
    void (async () => {
      if (!(await presentCustomerCenter())) await manageSubscriptions();
    })();
  };

  const redeem = () => {
    void (async () => {
      if (await presentCodeRedemption()) return;
      if (!(await presentCustomerCenter())) await manageSubscriptions();
    })();
  };

  const restorePurchases = () => {
    void (async () => {
      const outcome = await restore();
      if (outcome.status === 'restored') {
        Alert.alert(outcome.entitled ? 'Restored' : 'Nothing to restore', outcome.entitled ? 'Your VICI Plus purchase is back on this device.' : 'This store account has no VICI Plus purchase on it.');
      } else if (outcome.status === 'error' || outcome.status === 'unavailable') {
        Alert.alert('Could not restore', outcome.message);
      }
    })();
  };

  const planName = plan === 'lifetime' ? 'Lifetime' : plan === 'monthly' ? 'Monthly' : 'Yearly';
  const price = planFor(plan)?.priceString ?? '$39.99';
  // `10 Jul 2027`, the canvas's own day-first form, assembled by hand (en-GB's
  // short September is `Sept`).
  const renewsOn = membership.expiresAt ?? (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d;
  })();
  const renews = dayMonthYear(renewsOn);
  // A lifetime purchase never renews, and a cancelled subscription has no next
  // charge — the canvas only draws the renewing case, so the charge block is
  // shown for that and withheld where it would state a charge that is not coming.
  const charges = premium && membership.willRenew && plan !== 'lifetime';
  const line = !premium
    ? 'Core tools included'
    : plan === 'lifetime'
      ? `${price} · billed once`
      : `${price} a ${plan === 'monthly' ? 'month' : 'year'}. ${membership.willRenew ? 'Renews' : 'Runs until'} ${renews}`;
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Subscription' }} right="empty" onBack={back} />
      {/* D320: the stack scrolls under the nav row only where it would meet the cancel line */}
      <ScrollRegion top={100} bottom={CONTROLS} contentStyle={{ paddingTop: 36, paddingHorizontal: 24, paddingBottom: 24, gap: 18 }}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <View style={{ flexShrink: 1 }}>
              <MonoText v="p" style={{ ...sans('700'), fontSize: 24, lineHeight: lhNormal(24), letterSpacing: -0.5, color: mono.ink }}>
                {premium ? planName : 'Free tools'}
              </MonoText>
              <MonoText v="p" wrap="wrap" style={{ marginTop: 4, fontSize: 14, lineHeight: lhNormal(14) }}>
                {line}
              </MonoText>
            </View>
            <Pill kind="badge" label={premium ? 'Active' : 'Free'} />
          </View>
          {charges ? (
            <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: mono.line, flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <MonoText v="p" color={mono.mute} style={{ lineHeight: lhNormal(15) }}>
                Next charge
              </MonoText>
              <MonoText v="rowLabel">
                {`${price} on ${renews}`}
              </MonoText>
            </View>
          ) : null}
        </Card>
        <View style={{ height: 10 }} />
        <MonoText v="caps">Plan</MonoText>
        <ListRows>
          <ListRow label="Change plan" value={premium ? planName : 'Free'} onPress={() => router.push('/paywall')} />
          <ListRow label="Redeem a code" onPress={redeem} />
          <ListRow label="Restore purchases" onPress={restorePurchases} />
        </ListRows>
        <View style={{ height: 10 }} />
        <MonoText v="caps">Billing</MonoText>
        <ListRows>
          <ListRow label="Payment method" value={STORE_NAME[membership.store ?? ''] ?? 'Apple ID'} onPress={support} />
          <ListRow label="Receipts & invoices" onPress={support} />
        </ListRows>
      </ScrollRegion>
      {premium ? <GhostLink label="Cancel subscription" bottom={56} onPress={support} /> : null}
    </Screen>
  );
}
