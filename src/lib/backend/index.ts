/**
 * Backend facade. Screens import every data hook from `@/lib/backend` and stay
 * completely agnostic about whether the data is local-mock or Convex.
 *
 * Currently mock-only. When Convex is wired (a later milestone) this file
 * becomes an `impl = BACKEND_MODE === 'convex' ? convex : mock` selector that
 * re-binds each hook; the hook NAMES and SIGNATURES below are the stable
 * contract both implementations satisfy.
 */

export * from './mock';
export type { LessonDetail, CurrentLesson } from './mock';
export { MockStoreProvider as BackendProvider } from './mockStore';
export { BACKEND_MODE } from '@/lib/config';
