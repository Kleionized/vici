/**
 * Purchases facade. Screens import everything about money from here and stay
 * agnostic about whether RevenueCat or the offline catalogue is behind it —
 * the same shape `@/lib/backend` and `@/lib/auth` use.
 *
 * The implementation is chosen once at module load from PURCHASES_MODE (which
 * never changes at runtime), so the rules of hooks hold, and the RevenueCat
 * adapter is lazy-`require`d so its SDK never executes in mock mode.
 */

import { useContext } from 'react';

import { PURCHASES_MODE, RELEASE_MISCONFIGURED } from '@/lib/config';
import { PurchasesContext } from './context';
import { ENTITLEMENT_ID } from './catalogue';
import type { PurchasesApi } from './types';

/**
 * A release build without its production settings never reaches either
 * adapter: every route sits inside this provider, so mounting the
 * "misconfigured" screen in its place stops the whole app (D450).
 */
/* eslint-disable @typescript-eslint/no-require-imports -- one adapter is loaded, lazily, so the other's SDK never runs */
export const PurchasesProvider = RELEASE_MISCONFIGURED
  ? (require('./misconfigured') as typeof import('./misconfigured')).MisconfiguredBuild
  : PURCHASES_MODE === 'revenuecat'
    ? (require('./revenuecat') as typeof import('./revenuecat')).PurchasesProvider
    : (require('./mock') as typeof import('./mock')).PurchasesProvider;
/* eslint-enable @typescript-eslint/no-require-imports */

/** Everything about the catalogue and the current membership. */
export function usePurchases(): PurchasesApi {
  const value = useContext(PurchasesContext);
  if (!value) throw new Error('usePurchases must be used inside <PurchasesProvider> (mounted by AppProviders).');
  return value;
}

/**
 * `vici_unlimited` is active. This is the entitlement check — read it wherever
 * the paid app is gated rather than reading a stored flag, so a renewal, a
 * refund or a Family Sharing change takes effect without a round trip.
 *
 * Returns false while the first fetch is in flight; pair it with
 * `usePurchases().ready` where "not yet known" must read differently from "no".
 */
export function usePremium(): boolean {
  return usePurchases().isPremium;
}

/** The same check for any other entitlement id, should the catalogue grow. */
export function useEntitlement(entitlementId: string = ENTITLEMENT_ID): boolean {
  return usePurchases().entitlements.includes(entitlementId);
}

export { ENTITLEMENT_ID, TIER_NAME, DEFAULT_OFFERING_ID, DROP_OFFERING_ID, PACKAGE_IDS, PRODUCT_IDS, PAYWALL_SOURCE, planForPackage, planForProductId } from './catalogue';
export type { PlanKey, PaywallSource } from './catalogue';
export type { ActiveProduct, Membership, Plan, PurchaseOutcome, PurchasesApi } from './types';
export { PURCHASES_MODE } from '@/lib/config';
