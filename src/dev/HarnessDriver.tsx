import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Keyboard, LogBox } from 'react-native';

import { harnessAuth } from '@/lib/auth/mockAuth';
import { secureSet } from '@/lib/storage';

import { setHarnessClock } from './clock';

const SERVER = 'http://localhost:8099';
const SESSION_KEY = 'tideline.session.userId';

type Target = {
  n: number;
  /** a harness view (`/dev/harness?view=`) … */
  screen?: string;
  state?: string;
  extra?: Record<string, string>;
  /** … or an app route, opened as a user would reach it */
  route?: string;
  /** a stored account to sign in first (pixel-diff/seeds/<seed>.json); `-` signs out */
  seed?: string;
  /** the moment `Date` stands at, `YYYY-MM-DDTHH:MM[:SS]` local */
  clock?: string;
  /** globals the screens' mock hooks read, e.g. `__ONB_ANSWERS` (welcome.tsx) */
  globals?: Record<string, unknown>;
  /** put the keyboard away once the board is up: iOS draws it, the frames do not (D29) */
  blur?: boolean;
};

/**
 * A seed's account under an id of its own for this application, so the mock
 * store reads it afresh: every occurrence of the seed's user id, in keys and
 * in values, gets the suffix.
 */
function rekey(kv: Record<string, string>, n: number): { kv: [string, string][]; uid: string | null } {
  const uid = kv[SESSION_KEY] ?? null;
  if (!uid) return { kv: Object.entries(kv), uid: null };
  const next = `${uid}-h${n}`;
  const swap = (s: string) => s.split(uid).join(next);
  return { kv: Object.entries(kv).map(([k, v]) => [swap(k), swap(v)]), uid: next };
}

/**
 * Drives the dev harness from the Vici UI 2 run's capture scripts
 * (`scripts/vici-ui-2/harness-server.mjs`): it asks the local server what to
 * show — a harness view, or an app route with a stored account and a stopped
 * clock — and shows it. A simulator opens a deep link only after a system
 * prompt someone has to tap; this needs none.
 *
 * Mounted only in a development build started with `EXPO_PUBLIC_HARNESS=1`.
 */
export function HarnessDriver() {
  const router = useRouter();
  // a warning toast would sit over the frame being captured; warnings still reach Metro's log
  useEffect(() => LogBox.ignoreAllLogs(true), []);
  const pathname = usePathname();
  const at = useRef(pathname);
  useEffect(() => {
    at.current = pathname;
  }, [pathname]);
  const last = useRef<number | null>(null);
  const busy = useRef(false);
  useEffect(() => {
    const open = async (t: Target) => {
      setHarnessClock(t.clock ? new Date(t.clock).getTime() : null);
      const g = globalThis as Record<string, unknown>;
      delete g.__ONB_ANSWERS;
      Object.assign(g, t.globals ?? {});
      if (t.seed === '-') await harnessAuth.signOut?.();
      else if (t.seed) {
        const seed = (await (await fetch(`${SERVER}/seed/${encodeURIComponent(t.seed)}`)).json()) as { kv: Record<string, string> };
        const { kv, uid } = rekey(seed.kv, t.n);
        await AsyncStorage.multiSet(kv.filter(([k]) => k !== SESSION_KEY));
        if (uid) {
          await secureSet(SESSION_KEY, uid);
          await harnessAuth.signIn?.(uid);
        }
      }
      if (t.route) router.replace(t.route as never);
      else router.replace({ pathname: '/dev/harness', params: { view: t.screen, state: t.state, n: String(t.n), ...(t.extra ?? {}) } } as never);
      if (t.blur) setTimeout(() => Keyboard.dismiss(), 1200);
    };
    const id = setInterval(() => {
      if (busy.current) return;
      fetch(`${SERVER}/target`)
        .then((r) => r.json())
        .then(async (t: Target) => {
          if (!t || (!t.screen && !t.route)) return;
          // a new target, or the app has wandered off the harness view (a redirect on launch)
          if (t.n === last.current && (t.route || at.current === '/dev/harness')) return;
          last.current = t.n;
          busy.current = true;
          console.log(`[harness] ${t.route ?? `${t.screen} ${t.state}`}${t.seed ? ` · ${t.seed}` : ''}${t.clock ? ` · ${t.clock}` : ''}`);
          try {
            await open(t);
          } finally {
            busy.current = false;
          }
        })
        .catch(() => {});
    }, 300);
    return () => clearInterval(id);
  }, [router]);
  return null;
}
