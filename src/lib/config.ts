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
 * present; any partial config falls back to the fully-working mock layer.
 */

import { Platform } from 'react-native';

export const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL ?? '';
export const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

/** Dev affordance: force the offline mock layer even when keys are configured
 * (set EXPO_PUBLIC_FORCE_MOCK=1 in a local run config; never in production). */
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
