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
