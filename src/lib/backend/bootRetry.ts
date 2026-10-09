/**
 * The boot board's "Try again" (B10, D493). Boot (`src/app/index.tsx`) waits
 * for the session and the account's row; when that wait runs long it offers
 * Try again, which calls `retryBoot()`. The Convex bootstrap
 * (`realProviders.tsx`) listens and makes the account's row again at once
 * rather than at its next backoff step. The mock has nothing to retry: no one
 * listens, and the call does nothing.
 */

const listeners = new Set<() => void>();

export function onBootRetry(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function retryBoot(): void {
  for (const listener of listeners) listener();
}
