/**
 * Store objects → the strings a screen draws. Kept apart from the adapters so
 * both of them, and the tests, reduce a package the same way.
 */

import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

import { PLAN_KEYS, planForPackage, type PlanKey } from './catalogue';
import type { Plan } from './types';

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
export function planFromPackage(pkg: PurchasesPackage): Plan | null {
  const key = planForPackage(pkg);
  if (!key) return null;
  const product = pkg.product;
  const intro = product.introPrice;
  return {
    key,
    pkg,
    priceString: product.priceString,
    pricePerMonthString: product.pricePerMonthString ?? null,
    cycle: cycleLabel(key, product.subscriptionPeriod),
    intro: intro
      ? {
          priceString: intro.priceString,
          periodLabel: unitLabel(intro.periodUnit, intro.periodNumberOfUnits) ?? periodLabel(intro.period) ?? '',
          isFree: intro.price === 0,
          days: introDays(intro.periodUnit, intro.periodNumberOfUnits),
        }
      : null,
  };
}

/** Every plan in an offering, in catalogue order, duplicates dropped. */
export function plansFromOffering(offering: PurchasesOffering | null): Plan[] {
  if (!offering) return [];
  const found = new Map<PlanKey, Plan>();
  for (const pkg of offering.availablePackages) {
    const plan = planFromPackage(pkg);
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

export function describePackage(pkg: PurchasesPackage): PackageView {
  const product = pkg.product;
  const intro = product.introPrice;
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
    intro: intro
      ? {
          priceString: intro.priceString,
          periodLabel: unitLabel(intro.periodUnit, intro.periodNumberOfUnits) ?? periodLabel(intro.period) ?? '',
          isFree: intro.price === 0,
          days: introDays(intro.periodUnit, intro.periodNumberOfUnits),
        }
      : null,
    isLifetime,
  };
}

/**
 * Every package in the offering, in the order the dashboard put them in. That
 * order is a remote control over the paywall, so it is preserved rather than
 * sorted here.
 */
export function viewsFromOffering(offering: PurchasesOffering | null): PackageView[] {
  return (offering?.availablePackages ?? []).map(describePackage);
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
