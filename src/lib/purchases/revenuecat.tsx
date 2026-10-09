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
 * calls that genuinely only exist on one (code redemption, intro-offer
 * eligibility, and the native manage-subscriptions screen).
 *
 * Identity (D453): nothing touches the SDK until auth has loaded. It is then
 * configured with the Clerk user id, so a signed-in launch never passes
 * through an anonymous customer. Signed out, it is configured without an id,
 * and because the SDK then resumes whatever customer it cached last, the
 * adapter asks the SDK whether it is anonymous and logs out if it is not. A
 * later sign-in or sign-out switches with `logIn` / `logOut`; a switch that
 * fails (offline at launch) is retried with backoff and on every return to
 * the foreground, and until it lands the membership reads "nothing active"
 * rather than another customer's (`membershipKnown` stays false), and a
 * purchase first tries the switch again rather than buying on the wrong id.
 * Nothing is written back to the account: RevenueCat is the entitlement's
 * only source (D454).
 *
 * The catalogue and the customer are read side by side and land separately
 * (`fetchAll`), so offerings that fail offline never cost the customer's own
 * cached state.
 */

import Purchases, { type CustomerInfo, type PurchasesOffering, type PurchasesOfferings, type PurchasesPackage, type PurchasesStoreProduct } from 'react-native-purchases';
import { AppState, Linking, Platform } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

import { withSystemPrompt } from '@/components/AppLockGate';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { REVENUECAT_KEY } from '@/lib/config';
import { cancelTrialReminder, scheduleTrialReminder } from '@/lib/reminders';
import { PurchasesContext } from './context';
import { DEFAULT_OFFERING_ID, ENTITLEMENT_ID, planForProductId, type PlanKey } from './catalogue';
import { offeringCopy } from './metadata';
import { plansFromOffering, viewsFromOffering } from './plans';
import type { ActiveProduct, Membership, PurchaseOutcome, PurchasesApi } from './types';

const NO_MEMBERSHIP: Membership = {
  isActive: false,
  plan: null,
  productId: null,
  willRenew: false,
  expiresAt: null,
  periodType: null,
  store: null,
  billingIssue: false,
  managementURL: null,
};

/** `configure` is a one-shot: React 19 mounts effects twice in development. */
let configured = false;
/** The app user id the SDK is on: undefined before configure, null while anonymous. */
let sdkUser: string | null | undefined;
/** The identity switch in flight, so two renders never call `logIn` twice. */
let switching: Promise<boolean> | null = null;

// The SDK's identity is state outside React; screens read it as a store.
const identityListeners = new Set<() => void>();
function setSdkUser(next: string | null) {
  sdkUser = next;
  for (const l of identityListeners) l();
}
function subscribeIdentity(listener: () => void) {
  identityListeners.add(listener);
  return () => void identityListeners.delete(listener);
}
const readIdentity = () => sdkUser;

function configureOnce(appUserID: string | null) {
  if (configured) return;
  configured = true;
  Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.ERROR);
  // A test key never reaches here in a release build: `RELEASE_CONFIG_PROBLEMS`
  // stops the app before this provider mounts (D450).
  Purchases.configure({ apiKey: REVENUECAT_KEY, appUserID });
  // With an id, the SDK is on that person. Without one it resumes whichever
  // customer it cached last, which can be the previous account (a sign-out
  // whose logOut never landed before the app was killed, or a session that
  // ended while it was closed). So the anonymous case stays unknown here, and
  // the identity effect checks the SDK and logs out if it has to (D453).
  if (appUserID) setSdkUser(appUserID);
}

/**
 * Which of these products' intro offers this Apple ID may take — iOS only,
 * where the SDK reports an intro price regardless. Anything but ELIGIBLE
 * (unknown included, as RevenueCat advises) counts as no: the full price
 * shows. Null when there was nothing to ask or no answer.
 */
async function eligibilityFor(products: PurchasesStoreProduct[]): Promise<Record<string, boolean> | null> {
  if (Platform.OS !== 'ios' || !configured) return null;
  const ids = [...new Set(products.filter((p) => p.introPrice).map((p) => p.identifier))];
  if (!ids.length) return null;
  try {
    const result = await Purchases.checkTrialOrIntroductoryPriceEligibility(ids);
    const next: Record<string, boolean> = {};
    for (const id of ids) next[id] = result[id]?.status === Purchases.INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE;
    return next;
  } catch {
    return null;
  }
}

/** One read of the catalogue and the customer. Either half can fail on its own. */
type Fetched = { offerings: PurchasesOfferings | null; info: CustomerInfo | null; error: string | null };

/**
 * The catalogue and the customer, read side by side. Each half lands on its
 * own, so offerings that fail offline don't throw away the CustomerInfo the SDK
 * did return (often from its cache), and a member is still known as one.
 */
async function fetchAll(): Promise<Fetched> {
  const [offerings, info] = await Promise.allSettled([Purchases.getOfferings(), Purchases.getCustomerInfo()]);
  const failed = [offerings, info].find((r): r is PromiseRejectedResult => r.status === 'rejected');
  return {
    offerings: offerings.status === 'fulfilled' ? offerings.value : null,
    info: info.status === 'fulfilled' ? info.value : null,
    error: failed ? messageOf(failed.reason).message : null,
  };
}

/** The product id an entitlement came from, with Play's base plan where it has one (`yearly:vici-yearly`). */
function entitlementProductId(entitlement: { productIdentifier: string; productPlanIdentifier?: string | null }): string {
  const plan = entitlement.productPlanIdentifier;
  return plan && !entitlement.productIdentifier.includes(':') ? `${entitlement.productIdentifier}:${plan}` : entitlement.productIdentifier;
}

/** CustomerInfo → the membership the screens read. */
export function membershipFrom(info: CustomerInfo | null): Membership {
  const entitlement = info?.entitlements.active[ENTITLEMENT_ID];
  if (!info || !entitlement) return { ...NO_MEMBERSHIP, managementURL: info?.managementURL ?? null };
  const productId = entitlementProductId(entitlement);
  return {
    isActive: true,
    plan: planForProductId(productId),
    productId,
    willRenew: entitlement.willRenew,
    expiresAt: entitlement.expirationDateMillis ? new Date(entitlement.expirationDateMillis) : null,
    periodType: entitlement.periodType ?? null,
    store: entitlement.store ?? null,
    billingIssue: !!entitlement.billingIssueDetectedAt,
    managementURL: info.managementURL ?? null,
  };
}

/** Whether a store product is the one an entitlement names. */
function sameProduct(product: PurchasesStoreProduct, productId: string): boolean {
  if (product.identifier === productId) return true;
  // iOS ids carry no base plan; a Play id without one matches any of its plans
  return !productId.includes(':') && product.identifier.split(':')[0] === productId;
}

function activeFrom(product: PurchasesStoreProduct, productId: string): ActiveProduct {
  return { key: planForProductId(productId), priceString: product.priceString, period: product.subscriptionPeriod ?? null };
}

function messageOf(err: unknown): { message: string; code?: string; cancelled: boolean } {
  const e = err as { code?: string; message?: string; userCancelled?: boolean | null; userInfo?: { readableErrorCode?: string } };
  const cancelled = e?.code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR || e?.userCancelled === true;
  return { message: e?.message ?? 'Something went wrong with the store. Please try again.', code: e?.code ?? e?.userInfo?.readableErrorCode, cancelled };
}

const IDENTITY_UNSETTLED = 'The store could not confirm your account just now. Check your connection and try again.';

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId, email, displayName } = useAuth();
  const user = useCurrentUser();

  /** Who the SDK should be: undefined until auth has loaded. */
  const want: string | null | undefined = !isLoaded ? undefined : isSignedIn && userId ? userId : null;

  const identity = useSyncExternalStore(subscribeIdentity, readIdentity, readIdentity);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  /** product id → may take its intro offer (iOS only; the store's own answer). */
  const [eligibility, setEligibility] = useState<Record<string, boolean>>({});
  const [eligibilityRound, setEligibilityRound] = useState(0);
  /** Products priced by `getProducts`, for an entitlement no offering lists. */
  const [fetched, setFetched] = useState<Record<string, ActiveProduct | null>>({});

  const failures = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wantRef = useRef(want);
  useEffect(() => {
    wantRef.current = want;
  }, [want]);

  const settled = want !== undefined && identity === want;

  const apply = useCallback((result: Fetched) => {
    // a half that failed keeps what the last good read brought
    if (result.offerings) setOfferings(result.offerings);
    if (result.info) setCustomerInfo(result.info);
    setError(result.error);
    setReady(true);
  }, []);
  const load = useCallback(async () => {
    if (!configured) return;
    apply(await fetchAll());
  }, [apply]);

  /** One attempt to put the SDK on `target`. Resolves whether it is there now. */
  const switchTo = useCallback(async (target: string | null): Promise<boolean> => {
    // one switch at a time: wait out the one in flight, then see where it left the SDK
    while (switching) await switching.catch(() => false);
    if (sdkUser === target) return true;
    switching = (async () => {
      try {
        if (target) {
          const { customerInfo: info } = await Purchases.logIn(target);
          setCustomerInfo(info);
        } else if (await Purchases.isAnonymous()) {
          // Already nobody's, so there is nothing to undo. Whatever was held
          // may be another customer's, so drop it; the read that follows the
          // switch fetches this one.
          setCustomerInfo(null);
        } else {
          setCustomerInfo(await Purchases.logOut());
        }
        failures.current = 0;
        setError(null);
        setSdkUser(target);
        return true;
      } catch (err) {
        setError(messageOf(err).message);
        return false;
      } finally {
        switching = null;
      }
    })();
    return switching;
  }, []);

  // The customer-info listener lives for the session: renewals, refunds and
  // Family Sharing arrive without a call. It is plain JS, so it can be added
  // before `configure`.
  useEffect(() => {
    const listener = (info: CustomerInfo) => setCustomerInfo(info);
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => void Purchases.removeCustomerInfoUpdateListener(listener);
  }, []);

  // Identity: configure once auth is known, then follow sign-in and sign-out.
  useEffect(() => {
    if (want === undefined) return;
    // Signed in, configure puts the SDK on the person and the check below is
    // done. Signed out, it may have resumed the previous account, so the
    // switch checks (`configureOnce`).
    if (!configured) configureOnce(want);
    if (sdkUser === want) return;
    let live = true;
    void switchTo(want).then((ok) => {
      if (!live) return;
      if (ok) {
        // the person may have changed again while that switch was in flight
        if (wantRef.current !== want) setAttempt((a) => a + 1);
        return;
      }
      failures.current += 1;
      if (retryTimer.current) clearTimeout(retryTimer.current);
      retryTimer.current = setTimeout(() => setAttempt((a) => a + 1), Math.min(60_000, 2_000 * 2 ** (failures.current - 1)));
    });
    return () => {
      live = false;
    };
  }, [want, attempt, switchTo]);

  useEffect(
    () => () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    },
    [],
  );

  // The catalogue and the customer, once the SDK is on the right person — and
  // again whenever that person changes.
  useEffect(() => {
    if (identity === undefined) return;
    let live = true;
    void fetchAll().then((result) => {
      if (live) apply(result);
    });
    return () => {
      live = false;
    };
  }, [identity, apply]);

  // Intro-offer eligibility (P6): iOS hands back an intro price whether or not
  // this Apple ID can take it, so ask (`eligibilityFor`).
  const mergeEligibility = useCallback((next: Record<string, boolean> | null) => {
    if (next) setEligibility((prev) => ({ ...prev, ...next }));
  }, []);
  useEffect(() => {
    if (!offerings) return;
    let live = true;
    void eligibilityFor(Object.values(offerings.all).flatMap((o) => o.availablePackages.map((p) => p.product))).then((next) => {
      if (live) mergeEligibility(next);
    });
    return () => {
      live = false;
    };
  }, [offerings, eligibilityRound, mergeEligibility]);

  const introEligible = useCallback((productId: string) => Platform.OS !== 'ios' || eligibility[productId] === true, [eligibility]);

  // Subscriber attributes, so a RevenueCat customer is recognisable in the
  // dashboard and in webhooks — only once the SDK is on this person, and only
  // while the account's "Share email with billing" is on.
  const paused = !!user?.settings.pauseAnalytics;
  useEffect(() => {
    if (!settled || !isSignedIn || paused) return;
    void Purchases.setEmail(email ?? null).catch(() => {});
    void Purchases.setDisplayName(displayName ?? null).catch(() => {});
  }, [settled, isSignedIn, paused, email, displayName]);

  // The store can change entitlement outside the app — a renewal, a refund, a
  // cancellation in Settings. Re-read on the way back to the foreground, and
  // retry an identity switch that has not landed.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' || !configured) return;
      void Purchases.getCustomerInfo().then(setCustomerInfo).catch(() => {});
      if (wantRef.current !== undefined && sdkUser !== wantRef.current) setAttempt((a) => a + 1);
    });
    return () => sub.remove();
  }, []);

  // Until the SDK is on the signed-in person, nothing reads as theirs, and
  // until their CustomerInfo has been read, "nothing active" is not yet an
  // answer (`membershipKnown`).
  const membership = useMemo(() => (settled ? membershipFrom(customerInfo) : NO_MEMBERSHIP), [settled, customerInfo]);
  const membershipKnown = settled && customerInfo !== null;
  const entitlements = useMemo(() => (settled ? Object.keys(customerInfo?.entitlements.active ?? {}) : []), [settled, customerInfo]);

  // The trial reminder follows the store (P6): scheduled a day before a
  // renewing trial ends — where notifications are already allowed; the paywall
  // asks when the trial starts — and withdrawn once there is no trial to end.
  const trialKey = membership.isActive && membership.periodType === 'TRIAL' && membership.willRenew && membership.expiresAt ? membership.expiresAt.getTime() : null;
  const lastTrial = useRef<number | null | undefined>(undefined);
  useEffect(() => {
    if (!settled || !customerInfo || lastTrial.current === trialKey) return;
    lastTrial.current = trialKey;
    if (trialKey) void scheduleTrialReminder(trialKey, { ask: false });
    else void cancelTrialReminder();
  }, [settled, customerInfo, trialKey]);

  const offering = useMemo<PurchasesOffering | null>(() => offerings?.all[DEFAULT_OFFERING_ID] ?? offerings?.current ?? null, [offerings]);
  const plans = useMemo(() => plansFromOffering(offering, introEligible), [offering, introEligible]);
  const packages = useMemo(() => viewsFromOffering(offering, introEligible), [offering, introEligible]);
  const copy = useMemo(() => offeringCopy(offering), [offering]);

  const planIn = useCallback(
    (offeringId: string, key: PlanKey) => plansFromOffering(offerings?.all[offeringId] ?? null, introEligible).find((p) => p.key === key) ?? null,
    [offerings, introEligible],
  );
  const packagesIn = useCallback((source: PurchasesOffering | null) => viewsFromOffering(source, introEligible), [introEligible]);

  // The product behind the entitlement, priced by the store: from any loaded
  // offering where one lists it, else asked for by id (a drop or a retired
  // product no offering carries).
  const productId = membership.productId;
  const listed = useMemo<ActiveProduct | null>(() => {
    if (!productId || !offerings) return null;
    for (const o of Object.values(offerings.all)) {
      const pkg = o.availablePackages.find((p) => sameProduct(p.product, productId));
      if (pkg) return activeFrom(pkg.product, productId);
    }
    return null;
  }, [productId, offerings]);
  const lifetime = membership.isActive && !membership.expiresAt;
  useEffect(() => {
    if (!productId || listed || !configured || productId in fetched) return;
    let live = true;
    const category = lifetime ? Purchases.PRODUCT_CATEGORY.NON_SUBSCRIPTION : Purchases.PRODUCT_CATEGORY.SUBSCRIPTION;
    void Purchases.getProducts([productId.split(':')[0]], category)
      .then((found) => found.find((p) => sameProduct(p, productId)) ?? null)
      .catch(() => null)
      .then((product) => {
        if (live) setFetched((prev) => ({ ...prev, [productId]: product ? activeFrom(product, productId) : null }));
      });
    return () => {
      live = false;
    };
  }, [productId, listed, lifetime, fetched]);
  const activeProduct = membership.isActive && productId ? (listed ?? fetched[productId] ?? null) : null;

  const offeringForPlacement = useCallback(
    async (placementId: string) => {
      if (!configured) return null;
      try {
        const placed = await Purchases.getCurrentOfferingForPlacement(placementId);
        if (placed) void eligibilityFor(placed.availablePackages.map((p) => p.product)).then(mergeEligibility);
        return placed;
      } catch {
        return null;
      }
    },
    [mergeEligibility],
  );

  /** Before money moves, the SDK has to be on the signed-in person. */
  const ensureIdentity = useCallback(async () => {
    const target = wantRef.current;
    if (target === undefined || !configured) return false;
    return switchTo(target);
  }, [switchTo]);

  const purchasePackage = useCallback(
    async (pkg: PurchasesPackage): Promise<PurchaseOutcome> => {
      if (!(await ensureIdentity())) return { status: 'error', message: IDENTITY_UNSETTLED };
      try {
        const { customerInfo: info } = await withSystemPrompt(() => Purchases.purchasePackage(pkg));
        setCustomerInfo(info);
        // a trial or intro just taken is not offered again
        setEligibility({});
        setEligibilityRound((r) => r + 1);
        return { status: 'purchased', customerInfo: info };
      } catch (err) {
        const { message, code, cancelled } = messageOf(err);
        return cancelled ? { status: 'cancelled' } : { status: 'error', message, code };
      }
    },
    [ensureIdentity],
  );

  const purchase = useCallback(
    async (key: PlanKey, offeringId?: string): Promise<PurchaseOutcome> => {
      try {
        // A named offering is read fresh and never stood in for: the drop
        // must not sell the full-price year under the drop's price (B7).
        const source = offeringId ? ((await Purchases.getOfferings()).all[offeringId] ?? null) : offering;
        if (!source) return { status: 'unavailable', message: 'This offer is not available right now.' };
        const plan = plansFromOffering(source).find((p) => p.key === key);
        if (!plan?.pkg) return { status: 'unavailable', message: 'This plan is not available right now.' };
        return await purchasePackage(plan.pkg);
      } catch (err) {
        const { message, code, cancelled } = messageOf(err);
        return cancelled ? { status: 'cancelled' } : { status: 'error', message, code };
      }
    },
    [offering, purchasePackage],
  );

  const restore = useCallback(async (): Promise<PurchaseOutcome> => {
    if (!(await ensureIdentity())) return { status: 'error', message: IDENTITY_UNSETTLED };
    try {
      const info = await withSystemPrompt(() => Purchases.restorePurchases());
      setCustomerInfo(info);
      return { status: 'restored', customerInfo: info, entitled: !!info.entitlements.active[ENTITLEMENT_ID] };
    } catch (err) {
      const { message, code, cancelled } = messageOf(err);
      return cancelled ? { status: 'cancelled' } : { status: 'error', message, code };
    }
  }, [ensureIdentity]);

  const manageSubscriptions = useCallback(async () => {
    try {
      await withSystemPrompt(() => Purchases.showManageSubscriptions());
    } catch {
      const url = membership.managementURL ?? (Platform.OS === 'android' ? 'https://play.google.com/store/account/subscriptions' : 'https://apps.apple.com/account/subscriptions');
      await Linking.openURL(url).catch(() => {});
    }
  }, [membership.managementURL]);

  const presentCustomerCenter = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- the UI module is loaded only when Customer Center opens
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
      await withSystemPrompt(() => Purchases.presentCodeRedemptionSheet());
      setCustomerInfo(await Purchases.getCustomerInfo());
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo<PurchasesApi>(
    () => ({
      // ready once the SDK is on the signed-in person and the first read has settled
      ready: ready && settled,
      mode: 'revenuecat',
      error,
      membership,
      membershipKnown,
      isPremium: membership.isActive,
      entitlements,
      offering,
      plans,
      planFor: (key) => plans.find((p) => p.key === key) ?? null,
      packages,
      copy,
      planIn,
      packagesIn,
      activeProduct,
      offeringForPlacement,
      refresh: async () => {
        if (wantRef.current !== undefined && sdkUser !== wantRef.current) setAttempt((a) => a + 1);
        await load();
      },
      purchase,
      purchasePackage,
      restore,
      presentCustomerCenter,
      presentCodeRedemption,
      manageSubscriptions,
    }),
    [ready, settled, error, membership, membershipKnown, entitlements, offering, plans, packages, copy, planIn, packagesIn, activeProduct, offeringForPlacement, load, purchase, purchasePackage, restore, presentCustomerCenter, presentCodeRedemption, manageSubscriptions],
  );

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}
