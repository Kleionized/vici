/**
 * Runtime configuration + capability flags.
 *
 * Expo inlines `EXPO_PUBLIC_*` env vars at build time. We use their PRESENCE to
 * decide whether the app talks to real cloud services or the local mock layer,
 * so the app is fully runnable offline with zero credentials (build spec §9.5).
 *
 * IMPORTANT: real mode requires BOTH keys. The Convex functions authenticate
 * every call against the Clerk identity, so a Convex backend with mock auth
 * would be broken. We therefore only switch to real Convex + Clerk when both are
 * present; any partial config falls back to the fully-working mock layer —
 * in development only. A release build that would fall back, or that carries
 * test keys, refuses to start instead (`RELEASE_CONFIG_PROBLEMS`, below).
 */

import { Platform } from 'react-native';

export const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL ?? '';
export const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

/** Dev affordance: force the offline mock layer even when keys are configured
 * (set EXPO_PUBLIC_FORCE_MOCK=1 in a local run config or the web design
 * preview; a native release build that carries it refuses to start, D450). */
export const FORCE_MOCK = process.env.EXPO_PUBLIC_FORCE_MOCK === '1';

/** True only when both a Convex URL and a Clerk key are configured. */
export const REAL_BACKEND = !FORCE_MOCK && Boolean(CONVEX_URL && CLERK_PUBLISHABLE_KEY);

export const BACKEND_MODE: 'convex' | 'mock' = REAL_BACKEND ? 'convex' : 'mock';
export const AUTH_MODE: 'clerk' | 'mock' = REAL_BACKEND ? 'clerk' : 'mock';

export const IS_MOCK_BACKEND = BACKEND_MODE === 'mock';
export const IS_MOCK_AUTH = AUTH_MODE === 'mock';

// ── RevenueCat ───────────────────────────────────────────────────────
/**
 * Public SDK keys. RevenueCat's client keys are *public* by design (they can
 * only read offerings and buy on behalf of the current app user), so shipping
 * them in the bundle is expected — but they still live in env so a build can
 * swap store keys for a Test Store key without a code change.
 *
 * `EXPO_PUBLIC_REVENUECAT_KEY` is the cross-platform fallback: Test Store keys
 * (`test_…`) and Web Billing keys (`rcb_…`) are accepted on every platform,
 * while App Store (`appl_…`) and Play (`goog_…`) keys are per-store and belong
 * in the two platform vars.
 */
const RC_IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const RC_ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';
const RC_WEB_KEY = process.env.EXPO_PUBLIC_REVENUECAT_WEB_KEY ?? '';
const RC_SHARED_KEY = process.env.EXPO_PUBLIC_REVENUECAT_KEY ?? '';

/** The key this platform should configure with, or '' when none is set. */
export const REVENUECAT_KEY: string = (() => {
  const platform = Platform.OS === 'ios' ? RC_IOS_KEY : Platform.OS === 'android' ? RC_ANDROID_KEY : RC_WEB_KEY;
  return platform || RC_SHARED_KEY;
})();

/** A Test Store key. Purchases are simulated; it must never ship to a store. */
export const REVENUECAT_IS_TEST_KEY = REVENUECAT_KEY.startsWith('test_');

/**
 * Force the local mock catalogue even when a key is configured.
 *
 * Implied by FORCE_MOCK, so the offline design preview keeps drawing the
 * canvas's own prices rather than whatever the store returns. Set
 * EXPO_PUBLIC_FORCE_MOCK_PURCHASES=0 to opt back in to RevenueCat while the
 * rest of the app stays on the offline layer — the way to exercise the store
 * without Convex and Clerk credentials.
 */
const FORCED_MOCK_PURCHASES = process.env.EXPO_PUBLIC_FORCE_MOCK_PURCHASES;
export const FORCE_MOCK_PURCHASES = FORCED_MOCK_PURCHASES === '1' ? true : FORCED_MOCK_PURCHASES === '0' ? false : FORCE_MOCK;

export const PURCHASES_MODE: 'revenuecat' | 'mock' = !FORCE_MOCK_PURCHASES && REVENUECAT_KEY ? 'revenuecat' : 'mock';

export const IS_MOCK_PURCHASES = PURCHASES_MODE === 'mock';

// ── release guard ────────────────────────────────────────────────────
/**
 * A Clerk development-instance key. Its sign-ins carry Clerk's development
 * banner and limits; it must never ship.
 */
export const CLERK_IS_TEST_KEY = CLERK_PUBLISHABLE_KEY.startsWith('pk_test_');

/** The hosted privacy policy (`src/lib/legal.ts` opens it). Read here by its full name, as Expo inlines it. */
const PRIVACY_URL_SET = (process.env.EXPO_PUBLIC_PRIVACY_URL ?? '').trim();

/** The RevenueCat key prefix the store this binary runs on expects. */
const STORE_KEY_PREFIXES: Record<string, string[]> = {
  ios: ['appl_'],
  android: ['goog_', 'amzn_'],
  web: ['rcb_'],
};

/**
 * What a release build is missing, one line each, naming the variable to set.
 *
 * Empty in development (`__DEV__`), and on web under `EXPO_PUBLIC_FORCE_MOCK=1`:
 * the design preview is a release-mode web export that runs on the mock by
 * choice. A native release build gets no such pass, because a store or
 * preview profile that picked the flag up (a copied env, the wrong profile)
 * would otherwise ship the mock. Anything else that is not `__DEV__` is
 * treated as a build headed to people, so it must talk to the real services
 * with live keys: no silent fallback to the offline mock (plaintext local
 * accounts, a drawn pay sheet that unlocks for free), no Clerk development
 * instance, no RevenueCat Test Store, and a privacy policy to link (App Store
 * 5.1.1). When this is not empty the app shows "This build is misconfigured"
 * instead of starting (`src/lib/purchases/misconfigured.tsx`, mounted by
 * `PurchasesProvider`).
 */
export const RELEASE_CONFIG_PROBLEMS: string[] = (() => {
  if (__DEV__ || (FORCE_MOCK && Platform.OS === 'web')) return [];
  const problems: string[] = [];
  if (FORCE_MOCK) problems.push('EXPO_PUBLIC_FORCE_MOCK=1 runs the offline mock (accounts kept on the phone, a drawn pay sheet). Remove it.');
  if (!CONVEX_URL) problems.push('EXPO_PUBLIC_CONVEX_URL is not set, so there is no cloud backend.');
  if (!CLERK_PUBLISHABLE_KEY) problems.push('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set, so there is no sign-in.');
  else if (CLERK_IS_TEST_KEY) problems.push('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is a development key (pk_test_). Use the production instance’s pk_live_ key.');
  if (FORCED_MOCK_PURCHASES === '1') problems.push('EXPO_PUBLIC_FORCE_MOCK_PURCHASES=1 replaces the store with a drawn pay sheet. Remove it.');
  else if (!REVENUECAT_KEY) problems.push(`No RevenueCat key for ${Platform.OS} (EXPO_PUBLIC_REVENUECAT_${Platform.OS === 'ios' ? 'IOS' : Platform.OS === 'android' ? 'ANDROID' : 'WEB'}_KEY).`);
  else if (REVENUECAT_IS_TEST_KEY) problems.push('The RevenueCat key is a Test Store key (test_). Purchases would be simulated.');
  else {
    const expected = STORE_KEY_PREFIXES[Platform.OS];
    if (expected && !expected.some((p) => REVENUECAT_KEY.startsWith(p))) {
      problems.push(`The RevenueCat key for ${Platform.OS} should start with ${expected.join(' or ')}.`);
    }
  }
  if (!PRIVACY_URL_SET) problems.push('EXPO_PUBLIC_PRIVACY_URL is not set, so there is no privacy policy to link.');
  else if (!/^https:\/\//i.test(PRIVACY_URL_SET)) problems.push('EXPO_PUBLIC_PRIVACY_URL must be an https:// address.');
  return problems;
})();

/** A release build that must not start (see `RELEASE_CONFIG_PROBLEMS`). */
export const RELEASE_MISCONFIGURED = RELEASE_CONFIG_PROBLEMS.length > 0;
