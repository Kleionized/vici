/**
 * Store objects → the strings a screen draws. Kept apart from the adapters so
 * both of them, and the tests, reduce a package the same way.
 */

import { Platform } from 'react-native';
import type { PurchasesOffering, PurchasesPackage, PurchasesStoreProduct } from 'react-native-purchases';

import { PLAN_KEYS, planForPackage, type PlanKey } from './catalogue';
import type { Plan } from './types';

/**
 * Whether the customer may take a product's introductory offer. The adapter
 * passes its answer from the store (D455); with none given, an offer the
 * store lists is shown, which is only right where the store filters by
 * eligibility itself.
 */
export type IntroEligible = (productId: string) => boolean;

const ANY: IntroEligible = () => true;

/**
 * A length as copy counts it: "1 week", "3 days". `unitLabel` and
 * `periodLabel` give a bare noun for one unit ("week"), which reads right after
 * "/" or "a" but not as a length ("Week free", "$0.99 for month").
 */
export function counted(label: string): string {
  return !label || /^\d/.test(label) ? label : `1 ${label}`;
}

/** A product's intro offer as a screen reads it, or null when there is none or the customer cannot take it. */
function introOf(product: PurchasesStoreProduct, eligible: IntroEligible): Plan['intro'] {
  const intro = product.introPrice;
  if (!intro || !eligible(product.identifier)) return null;
  return {
    priceString: intro.priceString,
    periodLabel: counted(unitLabel(intro.periodUnit, intro.periodNumberOfUnits) ?? periodLabel(intro.period) ?? ''),
    isFree: intro.price === 0,
    days: introDays(intro.periodUnit, intro.periodNumberOfUnits),
  };
}

/** "/year" · "/month" · "/week" — and "" for a lifetime purchase. */
export function cycleLabel(key: PlanKey, subscriptionPeriod: string | null | undefined): string {
  if (key === 'lifetime') return '';
  const period = periodLabel(subscriptionPeriod);
  if (period) return `/${period}`;
  return key === 'yearly' ? '/year' : '/month';
}

/** An ISO-8601 duration ("P1Y", "P6M", "P3D") as the noun the store uses. */
export function periodLabel(period: string | null | undefined, count?: number): string | null {
  if (!period) return null;
  const m = /^P(\d+)([DWMY])$/.exec(period);
  if (!m) return null;
  const n = count ?? Number(m[1]);
  const unit = { D: 'day', W: 'week', M: 'month', Y: 'year' }[m[2]];
  if (!unit) return null;
  return n === 1 ? unit : `${n} ${unit}s`;
}

/** An intro offer's length in days, for copy that counts them out. */
export function introDays(periodUnit: string | null | undefined, units: number): number | null {
  const perUnit: Record<string, number> = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };
  const days = perUnit[String(periodUnit).toUpperCase()];
  return days ? days * units : null;
}

/** The same, from the `periodUnit` + `periodNumberOfUnits` an intro price gives. */
export function unitLabel(periodUnit: string | null | undefined, units: number): string | null {
  const unit = { DAY: 'day', WEEK: 'week', MONTH: 'month', YEAR: 'year' }[String(periodUnit).toUpperCase()];
  if (!unit) return null;
  return units === 1 ? unit : `${units} ${unit}s`;
}

/** Reduce one RevenueCat package to a `Plan`, or null if it is not one of ours. */
export function planFromPackage(pkg: PurchasesPackage, eligible: IntroEligible = ANY): Plan | null {
  const key = planForPackage(pkg);
  if (!key) return null;
  const product = pkg.product;
  return {
    key,
    pkg,
    priceString: product.priceString,
    pricePerMonthString: product.pricePerMonthString ?? null,
    cycle: cycleLabel(key, product.subscriptionPeriod),
    intro: introOf(product, eligible),
  };
}

/** Every plan in an offering, in catalogue order, duplicates dropped. */
export function plansFromOffering(offering: PurchasesOffering | null, eligible: IntroEligible = ANY): Plan[] {
  if (!offering) return [];
  const found = new Map<PlanKey, Plan>();
  for (const pkg of offering.availablePackages) {
    const plan = planFromPackage(pkg, eligible);
    if (plan && !found.has(plan.key)) found.set(plan.key, plan);
  }
  return PLAN_KEYS.map((key) => found.get(key)).filter((p): p is Plan => !!p);
}

// ── the generic view ─────────────────────────────────────────────────
/**
 * A package reduced for display, without any knowledge of *which* products
 * VICI sells. RevenueCat's guidance for displaying products is to drive the
 * paywall off the offering rather than off hardcoded identifiers, so that
 * adding a six-month plan, changing a price, or running an experiment is a
 * dashboard change and not a release. `Plan` above is the opposite: the three
 * plans this app names, for the screens that reason about a specific one.
 */
export interface PackageView {
  pkg: PurchasesPackage;
  /** The package identifier — `$rc_annual`, or whatever the dashboard used. */
  id: string;
  /** "Yearly" · "Lifetime" · "Six months" — from the package type, not the id. */
  name: string;
  /** The store's own description of the product. May be empty. */
  description: string;
  priceString: string;
  /** "/year" · "/month" · "" for a one-time purchase. */
  cycle: string;
  pricePerMonthString: string | null;
  /** Comparable monthly cost, for ranking. Null for one-time purchases. */
  pricePerMonth: number | null;
  intro: Plan['intro'];
  isLifetime: boolean;
}

/** Package type → the word this app already uses for it. */
const TYPE_NAME: Record<string, string> = {
  LIFETIME: 'Lifetime',
  ANNUAL: 'Yearly',
  SIX_MONTH: 'Six months',
  THREE_MONTH: 'Three months',
  TWO_MONTH: 'Two months',
  MONTHLY: 'Monthly',
  WEEKLY: 'Weekly',
};

export function describePackage(pkg: PurchasesPackage, eligible: IntroEligible = ANY): PackageView {
  const product = pkg.product;
  const isLifetime = pkg.packageType === 'LIFETIME' || !product.subscriptionPeriod;
  const period = periodLabel(product.subscriptionPeriod);
  return {
    pkg,
    id: pkg.identifier,
    // A custom package the dashboard invented falls back to the store's title.
    name: TYPE_NAME[pkg.packageType] ?? product.title,
    description: product.description ?? '',
    priceString: product.priceString,
    cycle: isLifetime ? '' : period ? `/${period}` : '',
    pricePerMonthString: isLifetime ? null : (product.pricePerMonthString ?? null),
    pricePerMonth: isLifetime ? null : (product.pricePerMonth ?? null),
    intro: isLifetime ? null : introOf(product, eligible),
    isLifetime,
  };
}

/**
 * Every package in the offering, in the order the dashboard put them in. That
 * order is a remote control over the paywall, so it is preserved rather than
 * sorted here.
 */
export function viewsFromOffering(offering: PurchasesOffering | null, eligible: IntroEligible = ANY): PackageView[] {
  return (offering?.availablePackages ?? []).map((pkg) => describePackage(pkg, eligible));
}

/**
 * The package id with the lowest comparable monthly cost — what the drawn
 * paywall's "Best value" badge marks. Null when nothing is comparable.
 */
export function bestValueId(views: PackageView[]): string | null {
  const priced = views.filter((v) => typeof v.pricePerMonth === 'number');
  if (priced.length < 2) return null;
  return priced.reduce((a, b) => ((b.pricePerMonth as number) < (a.pricePerMonth as number) ? b : a)).id;
}

// ── the renewal terms ────────────────────────────────────────────────
/** Where a subscriber cancels on this platform, as the store calls it. */
export function cancelPlace(): string {
  return Platform.OS === 'android' ? 'Google Play' : 'Settings';
}

/**
 * The one line under the plans that App Store 3.1.2 asks for: what the plan
 * charges, that it renews, and where it stops (D452). Built from the store's
 * own price, cycle and the customer's own intro offer, so it never states a
 * figure the store sheet will not.
 *
 *   Renews automatically at $39.99/year until cancelled in Settings.
 *   3 days free, then $39.99/year. Renews automatically until cancelled in Settings.
 *   $0.99 for 1 month, then $39.99/year. Renews automatically until cancelled in Settings.
 *   One payment. Nothing renews.
 */
export function renewalTerms(p: { priceString: string; cycle: string; isLifetime?: boolean; intro?: Plan['intro'] | null }): string {
  if (p.isLifetime || !p.cycle) return 'One payment. Nothing renews.';
  const place = cancelPlace();
  const then = `${p.priceString}${p.cycle}`;
  if (p.intro) {
    // counted again here, as this is the legal line and takes any intro it is handed
    const length = counted(p.intro.periodLabel);
    const opener = p.intro.isFree
      ? length
        ? `${length} free`
        : 'Free to start'
      : length
        ? `${p.intro.priceString} for ${length}`
        : p.intro.priceString;
    return `${capitalise(opener)}, then ${then}. Renews automatically until cancelled in ${place}.`;
  }
  return `Renews automatically at ${then} until cancelled in ${place}.`;
}

function capitalise(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
