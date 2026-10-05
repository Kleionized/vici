/**
 * The RevenueCat adapter. Active whenever a public SDK key is configured and
 * the offline mock has not been forced (see `@/lib/config`).
 *
 * One SDK, three environments:
 *  - a development build or a store build → the native SDK and the real store;
 *  - Expo Go → RevenueCat's Browser Mode, which requires a `test_…` or `rcb_…`
 *    key and simulates the purchase sheet;
 *  - web → the same Browser Mode.
 * The SDK decides that itself, so nothing here branches on platform except the
 * two calls that genuinely only exist on one (code redemption, and the native
 * manage-subscriptions screen).
 *
 * Identity: the app configures anonymously and then `logIn`s the Clerk user id
 * as soon as auth resolves, which is RevenueCat's documented flow — purchases
 * made before sign-in are aliased onto the account rather than stranded.
 */

import Purchases, { type CustomerInfo, type PurchasesOffering, type PurchasesPackage } from 'react-native-purchases';
import { AppState, Linking, Platform } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { useAuth } from '@/lib/auth';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import { REVENUECAT_IS_TEST_KEY, REVENUECAT_KEY } from '@/lib/config';
import { PurchasesContext } from './context';
import { DEFAULT_OFFERING_ID, ENTITLEMENT_ID, planForProductId, type PlanKey } from './catalogue';
import { offeringCopy } from './metadata';
import { plansFromOffering, viewsFromOffering } from './plans';
import type { Membership, PurchaseOutcome, PurchasesApi } from './types';

const NO_MEMBERSHIP: Membership = {
  isActive: false,
  plan: null,
  willRenew: false,
  expiresAt: null,
  periodType: null,
  store: null,
  billingIssue: false,
  managementURL: null,
};

/** `configure` is a one-shot: React 19 mounts effects twice in development. */
let configured = false;

function configureOnce(appUserID: string | null) {
  if (configured) return;
  configured = true;
  Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.ERROR);
  if (REVENUECAT_IS_TEST_KEY && !__DEV__) {
    console.warn('[purchases] A RevenueCat Test Store key is configured in a non-development build. Test keys must never ship to the App Store or Google Play.');
  }
  Purchases.configure({ apiKey: REVENUECAT_KEY, appUserID });
}

/** CustomerInfo → the membership the screens read. */
export function membershipFrom(info: CustomerInfo | null): Membership {
  const entitlement = info?.entitlements.active[ENTITLEMENT_ID];
  if (!info || !entitlement) return { ...NO_MEMBERSHIP, managementURL: info?.managementURL ?? null };
  return {
    isActive: true,
    plan: planForProductId(entitlement.productIdentifier),
    willRenew: entitlement.willRenew,
    expiresAt: entitlement.expirationDateMillis ? new Date(entitlement.expirationDateMillis) : null,
    periodType: entitlement.periodType ?? null,
    store: entitlement.store ?? null,
    billingIssue: !!entitlement.billingIssueDetectedAt,
    managementURL: info.managementURL ?? null,
  };
}

function messageOf(err: unknown): { message: string; code?: string; cancelled: boolean } {
  const e = err as { code?: string; message?: string; userCancelled?: boolean | null; userInfo?: { readableErrorCode?: string } };
  const cancelled = e?.code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR || e?.userCancelled === true;
  return { message: e?.message ?? 'Something went wrong with the store. Please try again.', code: e?.code ?? e?.userInfo?.readableErrorCode, cancelled };
}

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId, email, displayName } = useAuth();
  const user = useCurrentUser();
  const updateSettings = useUpdateSettings();

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);


  const load = useCallback(async () => {
    try {
      const [offerings, info] = await Promise.all([Purchases.getOfferings(), Purchases.getCustomerInfo()]);
      setOffering(offerings.all[DEFAULT_OFFERING_ID] ?? offerings.current ?? null);
      setCustomerInfo(info);
      setError(null);
    } catch (err) {
      setError(messageOf(err).message);
    } finally {
      setReady(true);
    }
  }, []);

  // Configure before anything else touches the SDK, keep the listener for the
  // whole session — renewals and Family Sharing arrive without a call — and
  // take the first read of the catalogue and the customer.
  useEffect(() => {
    configureOnce(null);
    const listener = (info: CustomerInfo) => setCustomerInfo(info);
    Purchases.addCustomerInfoUpdateListener(listener);
    void (async () => {
      await load();
    })();
    return () => void Purchases.removeCustomerInfoUpdateListener(listener);
  }, [load]);

  // Identity. RevenueCat keeps its own app user id, so this only fires on a
  // genuine change of who is signed in.
  const identified = useRef<string | null>(null);
  useEffect(() => {
    if (!isLoaded) return;
    void (async () => {
      try {
        if (isSignedIn && userId) {
          if (identified.current === userId) return;
          identified.current = userId;
          const { customerInfo: info } = await Purchases.logIn(userId);
          setCustomerInfo(info);
          await load();
        } else if (identified.current) {
          identified.current = null;
          if (!(await Purchases.isAnonymous())) setCustomerInfo(await Purchases.logOut());
          await load();
        }
      } catch (err) {
        setError(messageOf(err).message);
      }
    })();
  }, [isLoaded, isSignedIn, userId, load]);

  // Subscriber attributes, so a RevenueCat customer is recognisable in the
  // dashboard and in webhooks. Honours the app's own analytics switch.
  const paused = !!user?.settings.pauseAnalytics;
  useEffect(() => {
    if (!isSignedIn || paused) return;
    void Purchases.setEmail(email ?? null).catch(() => {});
    void Purchases.setDisplayName(displayName ?? null).catch(() => {});
  }, [isSignedIn, paused, email, displayName]);

  // The store can change entitlement outside the app — a renewal, a refund, a
  // cancellation in Settings. Re-read on the way back to the foreground.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void Purchases.getCustomerInfo().then(setCustomerInfo).catch(() => {});
    });
    return () => sub.remove();
  }, []);

  const membership = useMemo(() => membershipFrom(customerInfo), [customerInfo]);
  const entitlements = useMemo(() => Object.keys(customerInfo?.entitlements.active ?? {}), [customerInfo]);

  // The rest of the app reads `settings.premium`; RevenueCat is the truth, so
  // mirror it down rather than asking every screen to know about entitlements.
  // Keyed to the customer, not just the value: signing out and back in has to
  // be able to mirror the same answer again.
  const mirrored = useRef<string | null>(null);
  useEffect(() => {
    if (!ready || !customerInfo || !user) return;
    const active = membership.isActive;
    const written = `${user.clerkUserId}:${active}`;
    if (!!user.settings.premium === active || mirrored.current === written) return;
    mirrored.current = written;
    void updateSettings({ premium: active }).catch(() => {});
  }, [ready, customerInfo, user, membership.isActive, updateSettings]);

  const plans = useMemo(() => plansFromOffering(offering), [offering]);
  const packages = useMemo(() => viewsFromOffering(offering), [offering]);
  const copy = useMemo(() => offeringCopy(offering), [offering]);

  const offeringForPlacement = useCallback(async (placementId: string) => {
    try {
      return await Purchases.getCurrentOfferingForPlacement(placementId);
    } catch {
      return null;
    }
  }, []);

  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<PurchaseOutcome> => {
    try {
      const { customerInfo: info } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(info);
      return { status: 'purchased', customerInfo: info };
    } catch (err) {
      const { message, code, cancelled } = messageOf(err);
      return cancelled ? { status: 'cancelled' } : { status: 'error', message, code };
    }
  }, []);

  const purchase = useCallback(
    async (key: PlanKey, offeringId?: string): Promise<PurchaseOutcome> => {
      try {
        let source = offering;
        if (offeringId) {
          const offerings = await Purchases.getOfferings();
          source = offerings.all[offeringId] ?? offering;
        }
        const plan = plansFromOffering(source).find((p) => p.key === key);
        if (!plan?.pkg) return { status: 'unavailable', message: `No ${key} package is available in this offering.` };
        return await purchasePackage(plan.pkg);
      } catch (err) {
        const { message, code, cancelled } = messageOf(err);
        return cancelled ? { status: 'cancelled' } : { status: 'error', message, code };
      }
    },
    [offering, purchasePackage],
  );

  const restore = useCallback(async (): Promise<PurchaseOutcome> => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      return { status: 'restored', customerInfo: info, entitled: !!info.entitlements.active[ENTITLEMENT_ID] };
    } catch (err) {
      const { message, code, cancelled } = messageOf(err);
      return cancelled ? { status: 'cancelled' } : { status: 'error', message, code };
    }
  }, []);

  const manageSubscriptions = useCallback(async () => {
    try {
      await Purchases.showManageSubscriptions();
    } catch {
      const url = membership.managementURL ?? (Platform.OS === 'android' ? 'https://play.google.com/store/account/subscriptions' : 'https://apps.apple.com/account/subscriptions');
      await Linking.openURL(url).catch(() => {});
    }
  }, [membership.managementURL]);

  const presentCustomerCenter = useCallback(async () => {
    try {
      const RevenueCatUI = (require('react-native-purchases-ui') as typeof import('react-native-purchases-ui')).default;
      await RevenueCatUI.presentCustomerCenter({
        callbacks: {
          onRestoreCompleted: ({ customerInfo: info }) => setCustomerInfo(info),
          // `CustomerCenterManagementOption` widens to `string`, so the union
          // does not narrow on `option`; the url itself is the discriminant.
          onManagementOptionSelected: (event) => {
            if (event.option === 'custom_url' && event.url) void Linking.openURL(event.url).catch(() => {});
          },
        },
      });
      setCustomerInfo(await Purchases.getCustomerInfo());
      return true;
    } catch {
      return false;
    }
  }, []);

  const presentCodeRedemption = useCallback(async () => {
    if (Platform.OS !== 'ios') return false;
    try {
      await Purchases.presentCodeRedemptionSheet();
      setCustomerInfo(await Purchases.getCustomerInfo());
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo<PurchasesApi>(
    () => ({
      ready,
      mode: 'revenuecat',
      error,
      membership,
      isPremium: membership.isActive,
      entitlements,
      offering,
      plans,
      planFor: (key) => plans.find((p) => p.key === key) ?? null,
      packages,
      copy,
      offeringForPlacement,
      refresh: load,
      purchase,
      purchasePackage,
      restore,
      presentCustomerCenter,
      presentCodeRedemption,
      manageSubscriptions,
    }),
    [ready, error, membership, entitlements, offering, plans, packages, copy, offeringForPlacement, load, purchase, purchasePackage, restore, presentCustomerCenter, presentCodeRedemption, manageSubscriptions],
  );

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}
