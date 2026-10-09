/**
 * The contract both purchase adapters implement — RevenueCat and the local mock
 * — so screens import from `@/lib/purchases` and never learn which is running.
 * Mirrors the shape of `@/lib/backend` and `@/lib/auth`.
 */

import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

import type { PlanKey } from './catalogue';
import type { OfferingCopy } from './metadata';
import type { PackageView } from './plans';

/** One buyable plan, already reduced to the strings a screen needs. */
export interface Plan {
  key: PlanKey;
  /** The RevenueCat package to purchase. Null in mock mode. */
  pkg: PurchasesPackage | null;
  /** Localised price, from the store — "$39.99", "£34.99", "¥6,000". */
  priceString: string;
  /** Localised price per month, where the store computes one. */
  pricePerMonthString: string | null;
  /** "/year" · "/month" · "" for lifetime. */
  cycle: string;
  /**
   * An introductory offer attached to this plan — only where the customer is
   * eligible for it. On iOS that is checked with the store
   * (`checkTrialOrIntroductoryPriceEligibility`) and is null until the answer
   * is ELIGIBLE; Google Play only offers what the customer can take (D455).
   * `periodLabel` is the offer's length, always counted ("1 week", "3 days"),
   * or '' where the store gave none.
   */
  intro: { priceString: string; periodLabel: string; isFree: boolean; days: number | null } | null;
}

/** The product the active entitlement came from, priced by the store. */
export interface ActiveProduct {
  /** One of our three plans, where the identifier is one of ours. */
  key: PlanKey | null;
  /** The store's current price for this product — "$39.99". */
  priceString: string;
  /** ISO-8601 subscription period ("P1Y"), or null for a one-time purchase. */
  period: string | null;
}

/** What the customer currently has. Derived from CustomerInfo, never stored. */
export interface Membership {
  /** `vici_unlimited` is active. */
  isActive: boolean;
  /** Which plan unlocked it, where the product identifier is one of ours. */
  plan: PlanKey | null;
  /** The store product identifier that unlocked it (Play: `id:basePlan`). */
  productId: string | null;
  /** Renews at the end of the period. False for lifetime and for cancellations. */
  willRenew: boolean;
  /** Null for a lifetime purchase, and while nothing is active. */
  expiresAt: Date | null;
  /** NORMAL · TRIAL · INTRO · PREPAID. */
  periodType: string | null;
  /** APP_STORE · PLAY_STORE · TEST_STORE · PROMOTIONAL · … */
  store: string | null;
  /** True while the store reports an unresolved billing problem. */
  billingIssue: boolean;
  /** The store's own management URL for this subscription, when it gives one. */
  managementURL: string | null;
}

export type PurchaseOutcome =
  /** `customerInfo` is null only in mock mode, where there is no store. */
  | { status: 'purchased'; customerInfo: CustomerInfo | null }
  | { status: 'restored'; customerInfo: CustomerInfo | null; entitled: boolean }
  /** The customer backed out of the store sheet. Never an error. */
  | { status: 'cancelled' }
  /** No such package, or purchases are unavailable on this build. */
  | { status: 'unavailable'; message: string }
  | { status: 'error'; message: string; code?: string };

export interface PurchasesApi {
  /** False until the SDK has been configured and the first fetch has settled. */
  ready: boolean;
  mode: 'revenuecat' | 'mock';
  /** Set when the last offerings/customer-info fetch failed; screens may ignore it. */
  error: string | null;

  /** The current entitlement state. */
  membership: Membership;
  /**
   * True once the store has said what this customer holds: the SDK is on the
   * signed-in person and their CustomerInfo has been read. While false,
   * `membership` reads "nothing active" only because nothing is known yet, so
   * a screen that states a plan shows a wait or a neutral line, never "Free".
   */
  membershipKnown: boolean;
  /** Convenience: `membership.isActive`. */
  isPremium: boolean;
  /** Every entitlement identifier currently active for this customer. */
  entitlements: string[];

  /** The offering being shown, once loaded. */
  offering: PurchasesOffering | null;
  /** The offering's packages, reduced to plans, in catalogue order. */
  plans: Plan[];
  planFor(key: PlanKey): Plan | null;
  /**
   * Every package in the offering, in the dashboard's own order and without
   * matching it against the three products this app names — what a paywall
   * driven by the offering should render.
   */
  packages: PackageView[];
  /** The offering's metadata, read as paywall copy. All fields optional. */
  copy: OfferingCopy;
  /**
   * A plan from a named offering (`drop`), or null when that offering or plan
   * does not exist. Never falls back to the current offering.
   */
  planIn(offeringId: string, key: PlanKey): Plan | null;
  /** Any offering's packages reduced for display, intro offers only where eligible. */
  packagesIn(offering: PurchasesOffering | null): PackageView[];
  /**
   * The product behind the active entitlement and its store price, once
   * known — what Manage Subscription states. Null while nothing is active or
   * the store has not said.
   */
  activeProduct: ActiveProduct | null;
  /**
   * The offering a RevenueCat placement resolves to, for a paywall shown at a
   * named point in the app. Null when the placement has no offering — which
   * RevenueCat treats as "show nothing here".
   */
  offeringForPlacement(placementId: string): Promise<PurchasesOffering | null>;

  /** Re-fetch offerings and customer info. */
  refresh(): Promise<void>;
  /**
   * Buy a plan from the current offering, or from `offeringId` when given —
   * `unavailable` if that offering does not exist (it never falls back).
   */
  purchase(key: PlanKey, offeringId?: string): Promise<PurchaseOutcome>;
  /** Buy a specific package — used by the RevenueCat paywall's own callbacks. */
  purchasePackage(pkg: PurchasesPackage): Promise<PurchaseOutcome>;
  restore(): Promise<PurchaseOutcome>;

  /** RevenueCat's Customer Center. False when this build cannot present it. */
  presentCustomerCenter(): Promise<boolean>;
  /** The App Store's offer-code sheet (iOS only). False elsewhere. */
  presentCodeRedemption(): Promise<boolean>;
  /** The store's own subscription settings — the fallback for everything above. */
  manageSubscriptions(): Promise<void>;
}
