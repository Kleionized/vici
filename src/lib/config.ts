/**
 * Runtime configuration + capability flags.
 *
 * Expo inlines `EXPO_PUBLIC_*` env vars at build time. We use their PRESENCE to
 * decide whether the app talks to real cloud services or the local mock layer,
 * so the app is fully runnable offline with zero credentials (build spec §9.5)
 * and "upgrades" to real Convex + Clerk the moment the keys are filled in.
 */

export const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL ?? '';
export const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

/** 'convex' once a deployment URL is present, else the local mock data layer. */
export const BACKEND_MODE: 'convex' | 'mock' = CONVEX_URL ? 'convex' : 'mock';

/** 'clerk' once a publishable key is present, else local mock auth. */
export const AUTH_MODE: 'clerk' | 'mock' = CLERK_PUBLISHABLE_KEY ? 'clerk' : 'mock';

export const IS_MOCK_BACKEND = BACKEND_MODE === 'mock';
export const IS_MOCK_AUTH = AUTH_MODE === 'mock';
