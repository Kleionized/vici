import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Platform, View } from 'react-native';

import { Card, GhostLink, ListRow, ListRows, LoadingView, MonoText, NavBar, Pill, Screen, ScrollRegion } from '@/components/mono';
import { dayMonthYear } from '@/lib/format';
import { TIER_NAME, usePurchases } from '@/lib/purchases';
import { periodLabel } from '@/lib/purchases/plans';
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
 *
 * Every figure is the customer's own (B7, D458): the plan and the price are
 * those of the product the entitlement came from (`activeProduct`, priced by
 * the store — a drop buyer sees the drop's price, not the default offering's),
 * and the date is the store's expiry. Where the store has not said, the
 * sentence leaves the figure out rather than inventing one. A trial says when
 * the first charge lands; a granted (promotional) membership charges nothing;
 * lifetime, granted and already-cancelled memberships have no cancel line.
 *
 * "Free" is an answer the store has to give (`membershipKnown`). Until it has,
 * whether the read is in flight, the account switch has not landed or the
 * store could not be reached, a paying member must not be told they are on
 * the free tier. So the screen waits while the store is being asked, and if
 * it cannot be reached it shows a neutral card with no pill and no plan value,
 * asks again once, and keeps Restore within reach (B7, D458).
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

/** This platform's store, for a row that has no entitlement to name one. */
const PLATFORM_STORE = Platform.OS === 'android' ? 'Google Play' : 'Apple ID';

/** "a year" · "a month" · "every 6 months", from an ISO period or the plan. */
function perPeriod(period: string | null | undefined, plan: string | null): string | null {
  const label = periodLabel(period) ?? (plan === 'yearly' ? 'year' : plan === 'monthly' ? 'month' : null);
  if (!label) return null;
  return /^\d/.test(label) ? `every ${label}` : `a ${label}`;
}

/** The ghost link (15 tall text at bottom 56) takes 74 off the screen's bottom edge. */
const CONTROLS = 56 + 18;

export default function Subscription() {
  const router = useRouter();
  const { membership, membershipKnown, error, refresh, activeProduct, restore, presentCustomerCenter, presentCodeRedemption, manageSubscriptions } = usePurchases();
  const premium = membership.isActive;
  // The store could not say what this customer holds: ask once more on the way in.
  const unreachable = !membershipKnown && !!error;
  const askedAgain = useRef(false);
  useEffect(() => {
    if (!unreachable || askedAgain.current) return;
    askedAgain.current = true;
    void refresh();
  }, [unreachable, refresh]);
  const plan = membership.plan ?? activeProduct?.key ?? null;

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
        Alert.alert(outcome.entitled ? 'Restored' : 'Nothing to restore', outcome.entitled ? `Your ${TIER_NAME} purchase is back on this device.` : `This store account has no ${TIER_NAME} purchase on it.`);
      } else if (outcome.status === 'error' || outcome.status === 'unavailable') {
        Alert.alert('Could not restore', outcome.message);
      }
    })();
  };

  // An entitlement with no end is a one-time purchase (or a lifetime grant).
  const lifetime = premium && (plan === 'lifetime' || !membership.expiresAt);
  const granted = premium && membership.store === 'PROMOTIONAL';
  const trial = premium && membership.periodType === 'TRIAL';
  const planName = lifetime
    ? 'Lifetime'
    : plan === 'monthly'
      ? 'Monthly'
      : plan === 'yearly'
        ? 'Yearly'
        : activeProduct?.period === 'P1Y'
          ? 'Yearly'
          : activeProduct?.period === 'P1M'
            ? 'Monthly'
            : TIER_NAME;
  // the store's price for the product this customer holds — never a default
  // offering's, never a drawn one; a paid intro period's next charge is not
  // known from here, so it is left out
  const price = activeProduct?.priceString ?? null;
  const per = perPeriod(activeProduct?.period, plan);
  const priced = price && per && membership.periodType !== 'INTRO' ? `${price} ${per}` : null;
  // `10 Jul 2027`, the canvas's own day-first form, assembled by hand (en-GB's
  // short September is `Sept`). Only the store's own date — none is invented.
  const renews = membership.expiresAt ? dayMonthYear(membership.expiresAt) : null;
  // A lifetime purchase never renews, a grant charges nothing and a cancelled
  // subscription has no next charge — the canvas only draws the renewing case,
  // so the charge block is shown for that and withheld where it would state a
  // charge that is not coming, or one the store has not priced.
  const charges = premium && membership.willRenew && !lifetime && !granted && !!renews && !!priced;
  const line = unreachable
    ? 'Couldn’t reach the store just now. Your plan will show here once it answers.'
    : !premium
      ? 'Core tools included'
      : granted
        ? renews
          ? `Granted access. Runs until ${renews}`
          : 'Granted access'
        : lifetime
          ? price
            ? `${price} · billed once`
            : 'Billed once'
          : trial
            ? membership.willRenew
              ? `Free trial${priced ? `, then ${priced}` : ''}. First charge ${renews}`
              : `Free trial. Ends ${renews}`
            : [priced ? `${priced}.` : null, renews ? `${membership.willRenew ? 'Renews' : 'Runs until'} ${renews}` : null].filter(Boolean).join(' ') || 'Active';
  // Cancelling is for a subscription that will renew: not lifetime, not a grant.
  const cancellable = premium && membership.willRenew && !lifetime && !granted;
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  // still asking the store: a wait, not a "Free" that may be wrong
  if (!membershipKnown && !error) return <LoadingView onBack={back} />;

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Subscription' }} right="empty" onBack={back} />
      {/* D320: the stack scrolls under the nav row only where it would meet the cancel line;
          a free account (or lifetime, a grant, a cancelled plan) has no cancel line, so its band runs to the bottom edge instead of
          stopping 74 short over empty ground */}
      <ScrollRegion top={100} bottom={cancellable ? CONTROLS : 0} contentStyle={{ paddingTop: 36, paddingHorizontal: 24, paddingBottom: 24, gap: 18 }}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <View style={{ flexShrink: 1 }}>
              <MonoText v="p" style={{ ...sans('700'), fontSize: 24, lineHeight: lhNormal(24), letterSpacing: -0.5, color: mono.ink }}>
                {premium ? planName : unreachable ? 'Membership' : 'Free tools'}
              </MonoText>
              <MonoText v="p" wrap="wrap" style={{ marginTop: 4, fontSize: 14, lineHeight: lhNormal(14) }}>
                {line}
              </MonoText>
            </View>
            {unreachable ? null : <Pill kind="badge" label={premium ? 'Active' : 'Free'} />}
          </View>
          {charges ? (
            <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: mono.line, flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <MonoText v="p" color={mono.mute} style={{ lineHeight: lhNormal(15) }}>
                Next charge
              </MonoText>
              <MonoText v="rowLabel">
                {`${price ?? ''} on ${renews ?? ''}`}
              </MonoText>
            </View>
          ) : null}
        </Card>
        <View style={{ height: 10 }} />
        <MonoText v="caps">Plan</MonoText>
        <ListRows>
          <ListRow label="Change plan" value={premium ? planName : unreachable ? undefined : 'Free'} onPress={() => router.push('/paywall')} />
          <ListRow label="Redeem a code" onPress={redeem} />
          <ListRow label="Restore purchases" onPress={restorePurchases} />
        </ListRows>
        <View style={{ height: 10 }} />
        <MonoText v="caps">Billing</MonoText>
        <ListRows>
          <ListRow label="Payment method" value={(premium && STORE_NAME[membership.store ?? '']) || PLATFORM_STORE} onPress={support} />
          <ListRow label="Receipts & invoices" onPress={support} />
        </ListRows>
      </ScrollRegion>
      {cancellable ? <GhostLink label="Cancel subscription" bottom={56} onPress={support} /> : null}
    </Screen>
  );
}
