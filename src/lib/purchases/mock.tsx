/**
 * The offline catalogue — the default when no RevenueCat key is configured, and
 * what `EXPO_PUBLIC_FORCE_MOCK=1` pins the design preview to.
 *
 * The two prices here are the two the paywall is drawn with (canvas 103), so
 * the offline app renders the frame exactly. There is deliberately no lifetime
 * plan: the drawn paywall has two rows, and the third product only appears on
 * the RevenueCat paywall, which is not reachable without a key.
 *
 * Where the stand-in purchase keeps its entitlement depends on the backend
 * (D454). On the offline mock backend it writes `settings.premium`, as it
 * always has. On Convex the server no longer takes `premium` from the client
 * (B12), so a dev build that pairs Convex and Clerk with the drawn pay sheet
 * keeps the entitlement on this phone, per account, under
 * `tideline.mock.premium:<userId>`. Either way a drawn purchase sticks.
 *
 * The `drop` offering carries the enclosure's drawn year ($26.99, $2.25 a
 * month), so the Yearly Drop renders its frame offline; its saving is then
 * worked out against the $39.99 year, as it is against a real store. A release
 * build never reaches this file (D450), so its fixed numbers and the renewal
 * date it states a year out are the design preview's alone.
 */

import { Linking, Platform } from 'react-native';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '@/lib/auth';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import { BACKEND_MODE } from '@/lib/config';
import { getJSON, setJSON } from '@/lib/storage';
import { PurchasesContext } from './context';
import { offeringCopy } from './metadata';
import { DROP_OFFERING_ID, ENTITLEMENT_ID, type PlanKey } from './catalogue';
import type { ActiveProduct, Membership, Plan, PurchaseOutcome, PurchasesApi } from './types';

const MOCK_PLANS: Plan[] = [
  { key: 'yearly', pkg: null, priceString: '$39.99', pricePerMonthString: '$3.33', cycle: '/year', intro: null },
  { key: 'monthly', pkg: null, priceString: '$12.99', pricePerMonthString: '$12.99', cycle: '/month', intro: null },
];

const MOCK_DROP: Plan[] = [{ key: 'yearly', pkg: null, priceString: '$26.99', pricePerMonthString: '$2.25', cycle: '/year', intro: null }];

const MOCK_ACTIVE: ActiveProduct = { key: 'yearly', priceString: '$39.99', period: 'P1Y' };

function inAYear(): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

/** The stand-in entitlement: whether it is on, whether it has been read yet, and how to set it. */
type MockEntitlement = { premium: boolean; known: boolean; set(on: boolean): Promise<boolean> };

/** The offline backend: the account's own `settings.premium`. */
function useAccountEntitlement(): MockEntitlement {
  const user = useCurrentUser();
  const updateSettings = useUpdateSettings();
  const set = useCallback(
    (on: boolean) =>
      updateSettings({ premium: on }).then(
        () => true,
        () => false,
      ),
    [updateSettings],
  );
  return { premium: !!user?.settings.premium, known: user !== undefined, set };
}

const deviceKey = (userId: string) => `tideline.mock.premium:${userId}`;

/** Convex, which does not take `premium` from the client: this phone's record for the signed-in account. */
function useDeviceEntitlement(): MockEntitlement {
  const { isLoaded, userId } = useAuth();
  const [stored, setStored] = useState<{ userId: string; on: boolean } | null>(null);
  useEffect(() => {
    if (!userId) return;
    let live = true;
    void getJSON<boolean>(deviceKey(userId)).then((on) => {
      if (live) setStored({ userId, on: on === true });
    });
    return () => {
      live = false;
    };
  }, [userId]);
  const set = useCallback(
    async (on: boolean) => {
      if (!userId) return false;
      setStored({ userId, on });
      await setJSON(deviceKey(userId), on);
      return true;
    },
    [userId],
  );
  const mine = !!userId && stored?.userId === userId;
  return { premium: mine && !!stored?.on, known: isLoaded && (!userId || mine), set };
}

/** Chosen once, as BACKEND_MODE never changes at runtime, so the rules of hooks hold. */
const useMockEntitlement = BACKEND_MODE === 'convex' ? useDeviceEntitlement : useAccountEntitlement;

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const { premium, known, set } = useMockEntitlement();

  const membership = useMemo<Membership>(
    () => ({
      isActive: premium,
      plan: premium ? 'yearly' : null,
      productId: premium ? 'yearly' : null,
      willRenew: premium,
      expiresAt: premium ? inAYear() : null,
      periodType: premium ? 'NORMAL' : null,
      store: null,
      billingIssue: false,
      managementURL: null,
    }),
    [premium],
  );

  const grant = useCallback(async (): Promise<PurchaseOutcome> => {
    // a stand-in purchase that could not be kept is not reported as made
    if (!(await set(true))) return { status: 'error', message: 'This build could not record the purchase. Sign in and try again.' };
    return { status: 'purchased', customerInfo: null };
  }, [set]);

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
      membershipKnown: known,
      isPremium: premium,
      entitlements: premium ? [ENTITLEMENT_ID] : [],
      offering: null,
      plans: MOCK_PLANS,
      planFor: (key: PlanKey) => MOCK_PLANS.find((p) => p.key === key) ?? null,
      // There are no store packages offline, so a paywall driven by the
      // offering has nothing to draw and hands back to the drawn one.
      packages: [],
      copy: offeringCopy(null),
      planIn: (offeringId: string, key: PlanKey) => (offeringId === DROP_OFFERING_ID ? MOCK_DROP : MOCK_PLANS).find((p) => p.key === key) ?? null,
      packagesIn: () => [],
      activeProduct: premium ? MOCK_ACTIVE : null,
      offeringForPlacement: async () => null,
      refresh: async () => {},
      purchase: () => grant(),
      purchasePackage: () => grant(),
      restore: async () => ({ status: 'restored', customerInfo: null, entitled: premium }),
      presentCustomerCenter: async () => false,
      presentCodeRedemption: async () => false,
      manageSubscriptions,
    }),
    [membership, known, premium, grant, manageSubscriptions],
  );

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}
