/**
 * The offline catalogue — the default when no RevenueCat key is configured, and
 * what `EXPO_PUBLIC_FORCE_MOCK=1` pins the design preview to.
 *
 * The two prices here are the two the paywall is drawn with (canvas 103), so
 * the offline app renders the frame exactly. There is deliberately no lifetime
 * plan: the drawn paywall has two rows, and the third product only appears on
 * the RevenueCat paywall, which is not reachable without a key.
 *
 * Buying writes `settings.premium`, which is what this build has always done.
 */

import { Linking, Platform } from 'react-native';
import { useCallback, useMemo, type ReactNode } from 'react';

import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import { PurchasesContext } from './context';
import { offeringCopy } from './metadata';
import { ENTITLEMENT_ID, type PlanKey } from './catalogue';
import type { Membership, Plan, PurchaseOutcome, PurchasesApi } from './types';

const MOCK_PLANS: Plan[] = [
  { key: 'yearly', pkg: null, priceString: '$39.99', pricePerMonthString: '$3.33', cycle: '/year', intro: null },
  { key: 'monthly', pkg: null, priceString: '$12.99', pricePerMonthString: '$12.99', cycle: '/month', intro: null },
];

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const updateSettings = useUpdateSettings();
  const premium = !!user?.settings.premium;

  const membership = useMemo<Membership>(
    () => ({
      isActive: premium,
      plan: premium ? 'yearly' : null,
      willRenew: premium,
      expiresAt: null,
      periodType: premium ? 'NORMAL' : null,
      store: null,
      billingIssue: false,
      managementURL: null,
    }),
    [premium],
  );

  const grant = useCallback(
    async (on: boolean): Promise<PurchaseOutcome> => {
      await updateSettings({ premium: on }).catch(() => {});
      return on ? { status: 'purchased', customerInfo: null } : { status: 'restored', customerInfo: null, entitled: false };
    },
    [updateSettings],
  );

  const manageSubscriptions = useCallback(async () => {
    const url = Platform.OS === 'android' ? 'https://play.google.com/store/account/subscriptions' : 'https://apps.apple.com/account/subscriptions';
    await Linking.openURL(url).catch(() => {});
  }, []);

  const value = useMemo<PurchasesApi>(
    () => ({
      // Nothing to fetch: the catalogue is two constants.
      ready: true,
      mode: 'mock',
      error: null,
      membership,
      isPremium: premium,
      entitlements: premium ? [ENTITLEMENT_ID] : [],
      offering: null,
      plans: MOCK_PLANS,
      planFor: (key: PlanKey) => MOCK_PLANS.find((p) => p.key === key) ?? null,
      // There are no store packages offline, so a paywall driven by the
      // offering has nothing to draw and hands back to the drawn one.
      packages: [],
      copy: offeringCopy(null),
      offeringForPlacement: async () => null,
      refresh: async () => {},
      purchase: () => grant(true),
      purchasePackage: () => grant(true),
      restore: async () => ({ status: 'restored', customerInfo: null, entitled: premium }),
      presentCustomerCenter: async () => false,
      presentCodeRedemption: async () => false,
      manageSubscriptions,
    }),
    [membership, premium, grant, manageSubscriptions],
  );

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}
