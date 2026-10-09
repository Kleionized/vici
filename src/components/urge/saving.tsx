/**
 * Writes that never hold a screen hostage (B10, deploy WP5 D465).
 *
 * The logs (`/lapse`, `/urge-log`) and the slip flow used to `await` the
 * Convex mutation before moving on. A mutation sent with no connection stays
 * pending until the socket comes back, and one the server rejects throws, so
 * "Logging…" could sit there for good. Here the screen moves on at once, and
 * the write runs behind it:
 *
 * - `saving`, then `saved` — the usual case, unseen.
 * - `slow` — still unanswered after `WRITE_PATIENCE_MS`. Convex keeps the
 *   mutation queued and sends it when the phone is back online, so the screen
 *   says that rather than claiming it saved.
 * - `failed` — the write was refused. `UnsavedBoard` says so and offers
 *   "Try again" (the same write again) or "Not now"; ✕ always leaves.
 *
 * The mock store answers at once, so on the mock this is always `saved`.
 */

import { useCallback, useRef, useState } from 'react';

import { HeroBoard } from '@/components/mono';

export type WriteState = 'idle' | 'saving' | 'slow' | 'saved' | 'failed';

/** How long a write may go unanswered before the screen says it is waiting for a connection. */
export const WRITE_PATIENCE_MS = 8000;

/** The line a done board shows while its write waits for a connection. */
export const WAITING_LINE = 'Waiting for a connection. It saves when you’re back online, so leave VICI open until then.';

export function useBackgroundWrite(label: string) {
  const [state, setState] = useState<WriteState>('idle');
  const job = useRef<(() => Promise<unknown>) | null>(null);
  /** Each run's own id: a slow first try that answers after a retry must not overwrite it. */
  const runId = useRef(0);

  const run = useCallback(
    (write?: () => Promise<unknown>) => {
      if (write) job.current = write;
      const fn = job.current;
      if (!fn) return;
      const id = ++runId.current;
      setState('saving');
      const timer = setTimeout(() => {
        if (runId.current === id) setState((s) => (s === 'saving' ? 'slow' : s));
      }, WRITE_PATIENCE_MS);
      fn().then(
        () => {
          clearTimeout(timer);
          if (runId.current === id) setState('saved');
        },
        (error: unknown) => {
          clearTimeout(timer);
          if (__DEV__) console.warn(`${label} was not written`, error);
          if (runId.current === id) setState('failed');
        },
      );
    },
    [label],
  );

  /** "Not now" on the unsaved board: the user has been told; the flow carries on. */
  const dismiss = useCallback(() => setState('idle'), []);

  return { state, run, retry: () => run(), dismiss };
}

/**
 * The board a refused write shows: what happened and the two ways on. The
 * kit's hero board, with the log's own clipboard art.
 */
export function UnsavedBoard({ what, onRetry, onLater, onClose }: { what: string; onRetry: () => void; onLater: () => void; onClose: () => void }) {
  return (
    <HeroBoard
      key="unsaved"
      nav={{ onClose }}
      hero="clipboard"
      title="That didn’t save."
      body={`Your ${what} wasn’t written to your account. Check your connection, then try again.`}
      cta="Try again"
      onCta={onRetry}
      ghost="Not now"
      onGhost={onLater}
    />
  );
}
