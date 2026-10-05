/**
 * What VICI sells, named once.
 *
 * Everything here must match the RevenueCat dashboard exactly — the entitlement
 * identifier, the offering identifiers, and the three product identifiers. The
 * SDK is keyed on these strings, so a typo shows up as "no offerings" rather
 * than as an error, which is why they live in one file instead of inline at
 * their call sites. See `docs/revenuecat.md` for the dashboard side.
 */

import { PURCHASES_MODE } from '@/lib/config';

/** The single entitlement that unlocks the paid app. */
export const ENTITLEMENT_ID = 'vici_unlimited';

/** The offering shown by default — RevenueCat's "current" offering. */
export const DEFAULT_OFFERING_ID = 'default';

/**
 * The yearly-drop enclosure (canvas 174 · 175) sells the same year at a lower
 * price, so it is a second offering rather than a second product. Falls back to
 * the current offering when the dashboard has no such offering configured.
 */
export const DROP_OFFERING_ID = 'drop';

/** The three plans, in the order the store catalogue lists them. */
export type PlanKey = 'lifetime' | 'yearly' | 'monthly';

export const PLAN_KEYS: PlanKey[] = ['lifetime', 'yearly', 'monthly'];

/** Store product identifiers, as configured in the RevenueCat product catalog. */
export const PRODUCT_IDS: Record<PlanKey, string> = {
  lifetime: 'lifetime',
  yearly: 'yearly',
  monthly: 'monthly',
};

/**
 * RevenueCat's reserved package identifiers. A package is the slot an offering
 * puts a product in; using the reserved ids means `offering.lifetime`,
 * `offering.annual` and `offering.monthly` resolve without a lookup.
 */
export const PACKAGE_IDS: Record<PlanKey, string> = {
  lifetime: '$rc_lifetime',
  yearly: '$rc_annual',
  monthly: '$rc_monthly',
};

/** PACKAGE_TYPE values, matched without importing the SDK enum. */
const PACKAGE_TYPE_FOR: Record<PlanKey, string> = {
  lifetime: 'LIFETIME',
  yearly: 'ANNUAL',
  monthly: 'MONTHLY',
};

/**
 * Which plan a package is, read from the package first and the product second.
 * An offering built with custom package identifiers still resolves as long as
 * the product identifiers are the three above.
 */
export function planForPackage(pkg: { identifier: string; packageType: string; product: { identifier: string } }): PlanKey | null {
  for (const key of PLAN_KEYS) {
    if (pkg.packageType === PACKAGE_TYPE_FOR[key]) return key;
    if (pkg.identifier === PACKAGE_IDS[key]) return key;
    // Play appends the base plan id to the product ("yearly:vici-yearly").
    if (pkg.product.identifier === PRODUCT_IDS[key] || pkg.product.identifier.split(':')[0] === PRODUCT_IDS[key]) return key;
  }
  return null;
}

/** Which plan a bare product identifier is — for reading back an entitlement. */
export function planForProductId(productIdentifier: string | null | undefined): PlanKey | null {
  if (!productIdentifier) return null;
  const base = productIdentifier.split(':')[0];
  return PLAN_KEYS.find((key) => base === PRODUCT_IDS[key]) ?? null;
}

/**
 * Which paywall `/paywall` presents.
 *
 *  - `offering`   — `components/paywall/OfferingPaywall`, `48 · Paywall` drawn
 *    from whatever the offering contains: every package, in the dashboard's
 *    order, with copy from the offering's metadata. The default, and — since it
 *    is what any build with a key presents — it draws the same board as the
 *    drawn paywall rather than a second one of its own (D152).
 *  - `revenuecat` — the paywall designed in the RevenueCat dashboard, rendered
 *    by `react-native-purchases-ui`. Templates, experiments and localisation
 *    are then RevenueCat's rather than ours.
 *  - `designed`   — `components/paywall/PaywallFlow`, the drawn VICI paywall.
 *    Two rows and no lifetime; pinned to the canvas it was measured from.
 *
 * The onboarding funnel always uses the drawn paywall: it is one step inside a
 * pixel-exact sequence, and a store paywall would break that sequence.
 *
 * This follows PURCHASES_MODE rather than the key: the first two both draw an
 * offering, and the offline catalogue has none to give them. A key that is
 * present but mocked — the design preview — therefore still gets the drawn one.
 */
export type PaywallSource = 'offering' | 'revenuecat' | 'designed';

const REQUESTED = process.env.EXPO_PUBLIC_REVENUECAT_PAYWALL;

export const PAYWALL_SOURCE: PaywallSource =
  PURCHASES_MODE !== 'revenuecat' || REQUESTED === 'designed'
    ? 'designed'
    : REQUESTED === 'revenuecat'
      ? 'revenuecat'
      : 'offering';
