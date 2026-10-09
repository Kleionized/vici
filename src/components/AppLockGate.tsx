/**
 * App lock — the gate `App lock` (95) promises, and the privacy cover.
 *
 *   - `Require Face ID` on: a cold start opens behind the lock, and so does
 *     coming back after a long time away (15 minutes, or `Ask after` if that
 *     is longer) — iOS can keep VICI in memory for days, so a cold start alone
 *     would rarely ask. Face ID (Touch ID, the phone's passcode, or Android's
 *     screen lock — whatever the phone holds) opens it.
 *   - `Lock when I leave the app` on as well: every return from the background
 *     locks again once the app has been away for the `Ask after` interval.
 *   - `Hide sensitive previews` on (the default): while the app is inactive or
 *     in the background a plain cover is drawn over it, so the app switcher's
 *     snapshot shows the laurel instead of a journal entry — except under a
 *     system prompt VICI itself opened (`withSystemPrompt`), which leaves the
 *     screen behind it in view.
 *
 * The three switches are account settings (`appLockFaceId`, `appLockOnLeave`,
 * `hideSensitivePreviews`, on both backends); this phone keeps a mirror of
 * them, plus the `Ask after` interval, so a cold start can lock before the
 * account has loaded — or with no signal at all (D423). Signing out clears it.
 *
 * `expo-local-authentication` is loaded lazily, and only once its native
 * module is known to be in the binary: a dev client built before it was added
 * (and the web build) simply cannot lock, and says so on the App lock page.
 */

import { requireOptionalNativeModule } from 'expo';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { AppState, BackHandler, Keyboard, Platform, StyleSheet, View, type AppStateStatus } from 'react-native';

import { LaurelMark, MonoText, PrimaryButton, Screen } from '@/components/mono';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { getJSON, removeKey, setJSON } from '@/lib/storage';

type LocalAuthModule = typeof import('expo-local-authentication');

// ── the module, lazily ───────────────────────────────────────────────

let la: LocalAuthModule | null | undefined;

function localAuth(): LocalAuthModule | null {
  if (la !== undefined) return la;
  la = null;
  if (Platform.OS === 'web') return la;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- loaded lazily on purpose (see the header)
    if (requireOptionalNativeModule('ExpoLocalAuthentication')) la = require('expo-local-authentication') as LocalAuthModule;
  } catch {
    la = null;
  }
  return la;
}

/** Whether this build can lock at all. */
export function lockAvailable(): boolean {
  return localAuth() !== null;
}

/**
 * What the phone unlocks with, in the words its owner knows it by. The frame
 * says "Face ID"; a Touch ID iPhone, an iPhone with neither, and Android (whose
 * prompt also takes the PIN or pattern) get their own (D424).
 */
export type LockName = 'Face ID' | 'Touch ID' | 'passcode' | 'screen lock';

async function readLockName(): Promise<LockName> {
  const L = localAuth();
  if (!L) return 'Face ID';
  if (Platform.OS === 'android') return 'screen lock';
  try {
    const types = await L.supportedAuthenticationTypesAsync();
    if (types.includes(L.AuthenticationType.FACIAL_RECOGNITION)) return 'Face ID';
    if (types.includes(L.AuthenticationType.FINGERPRINT)) return 'Touch ID';
    return 'passcode';
  } catch {
    return 'Face ID';
  }
}

let lockNameRead: Promise<LockName> | null = null;

export function useLockName(): LockName {
  const [name, setName] = useState<LockName>('Face ID');
  useEffect(() => {
    let live = true;
    if (!lockNameRead) lockNameRead = readLockName();
    void lockNameRead.then((n) => {
      if (live) setName(n);
    });
    return () => {
      live = false;
    };
  }, []);
  return name;
}

export type AuthOutcome = 'ok' | 'cancelled' | 'failed' | 'unavailable';

/**
 * Ask the phone's owner to prove it is them. `unavailable` means the phone
 * cannot check (no module, nothing enrolled, no passcode set) — the gate opens
 * on it rather than locking someone out of his own app for good (D423).
 */
export async function authenticate(promptMessage: string): Promise<AuthOutcome> {
  const L = localAuth();
  if (!L) return 'unavailable';
  // one prompt at a time — the automatic ask and a tap on Unlock can cross
  if (gate.authenticating) return 'cancelled';
  setGate({ authenticating: true });
  try {
    const r = await L.authenticateAsync({ promptMessage, cancelLabel: 'Cancel', disableDeviceFallback: false });
    if (r.success) return 'ok';
    if (r.error === 'not_enrolled' || r.error === 'not_available' || r.error === 'passcode_not_set') return 'unavailable';
    if (r.error === 'user_cancel' || r.error === 'system_cancel' || r.error === 'app_cancel') return 'cancelled';
    return 'failed';
  } catch {
    return 'failed';
  } finally {
    setGate({ authenticating: false });
  }
}

// ── this phone's mirror of the settings ──────────────────────────────

export type LockConfig = {
  faceId: boolean;
  onLeave: boolean;
  hidePreviews: boolean;
  /** `Ask after`, in seconds away from the app (0 = Immediately) */
  askAfterSec: number;
};

const LOCK_KEY = 'tideline.applock.v1';
const DEFAULT_LOCK: LockConfig = { faceId: false, onLeave: false, hidePreviews: true, askAfterSec: 0 };

/** The `Ask after` choices, as the row and its sheet name them. */
export const ASK_AFTER = [
  { sec: 0, label: 'Immediately', row: 'Immediately' },
  { sec: 60, label: 'After 1 minute', row: '1 minute' },
  { sec: 5 * 60, label: 'After 5 minutes', row: '5 minutes' },
  { sec: 15 * 60, label: 'After 15 minutes', row: '15 minutes' },
  { sec: 60 * 60, label: 'After 1 hour', row: '1 hour' },
] as const;

type GateState = {
  /** null until read from disk */
  config: LockConfig | null;
  /** the lock has engaged and has not been opened since */
  engaged: boolean;
  /** opened at least once in this process */
  unlockedOnce: boolean;
  /** an authentication this file started is on screen */
  authenticating: boolean;
  /** system prompts VICI opened that are on screen (`withSystemPrompt`) */
  systemPrompts: number;
};

let gate: GateState = { config: null, engaged: false, unlockedOnce: false, authenticating: false, systemPrompts: 0 };
const gateListeners = new Set<() => void>();

function setGate(patch: Partial<GateState>) {
  gate = { ...gate, ...patch };
  for (const l of gateListeners) l();
}

let configRead: Promise<LockConfig> | null = null;

function readLockConfig(): Promise<LockConfig> {
  if (!configRead) {
    configRead = getJSON<Partial<LockConfig>>(LOCK_KEY).then((stored) => {
      if (gate.config) return gate.config;
      const config = { ...DEFAULT_LOCK, ...(stored ?? {}) };
      // a cold start with the lock on opens behind it
      setGate({ config, engaged: gate.engaged || (config.faceId && lockAvailable()) });
      return config;
    });
  }
  return configRead;
}

/** Write part of the mirror (the App lock page does, the moment a switch moves). */
export async function saveLockConfig(patch: Partial<LockConfig>): Promise<void> {
  await readLockConfig();
  const config = { ...(gate.config ?? DEFAULT_LOCK), ...patch };
  setGate({ config, engaged: config.faceId ? gate.engaged : false });
  await setJSON(LOCK_KEY, config);
}

async function clearLockConfig(): Promise<void> {
  await readLockConfig();
  setGate({ config: DEFAULT_LOCK, engaged: false });
  await removeKey(LOCK_KEY);
}

/** The lock was just opened (or proven openable, when it is switched on). */
export function releaseLock() {
  setGate({ engaged: false, unlockedOnce: true });
}

function engageLock() {
  if (!lockAvailable() || !gate.config?.faceId) return;
  Keyboard.dismiss();
  setGate({ engaged: true });
}

// ── system prompts VICI opens ────────────────────────────────────────

/**
 * Run something that puts a system prompt over VICI — the notification
 * permission alert, the App Store purchase sheet, Sign in with Apple — so the
 * privacy cover leaves the screen behind it in view, and the trip is not
 * counted as leaving the app. iOS makes the app inactive under such a prompt;
 * Android, which has no inactive state, reports its dialog activities as the
 * background. A real trip to the background on iOS is still covered.
 */
export async function withSystemPrompt<T>(open: () => Promise<T>): Promise<T> {
  setGate({ systemPrompts: gate.systemPrompts + 1 });
  try {
    return await open();
  } finally {
    releasePromptWhenBack();
  }
}

/**
 * Hand the state back once VICI is in front again, a beat after the change
 * lands, so the cover never shows for the frame between the two updates (the
 * answer can arrive before the app is active again — Android delivers it first).
 */
function releasePromptWhenBack() {
  let done = false;
  let sub: { remove(): void } | undefined;
  const release = () => {
    if (done) return;
    done = true;
    clearTimeout(fallback);
    sub?.remove();
    setTimeout(() => setGate({ systemPrompts: Math.max(0, gate.systemPrompts - 1) }), 250);
  };
  const fallback = setTimeout(release, 2000);
  if (AppState.currentState === 'active') release();
  else
    sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') release();
    });
}

/** A state an open system prompt explains (see `withSystemPrompt`). */
const promptExplains = (s: AppStateStatus, prompts: number) =>
  prompts > 0 && (s === 'inactive' || (Platform.OS === 'android' && s === 'background'));

function subscribeGate(listener: () => void) {
  gateListeners.add(listener);
  void readLockConfig();
  return () => {
    gateListeners.delete(listener);
  };
}
const gateSnapshot = () => gate;

/** The mirror, for the App lock page (defaults until read). */
export function useLockConfig(): LockConfig {
  const g = useSyncExternalStore(subscribeGate, gateSnapshot, gateSnapshot);
  return g.config ?? DEFAULT_LOCK;
}

// ── the gate ─────────────────────────────────────────────────────────

const foreground = (s: AppStateStatus) => s !== 'background' && s !== 'inactive';

/** `Require Face ID` alone still locks after this long away: the app reopened, not glanced away from. */
const LONG_AWAY_SEC = 15 * 60;

/** How long away before a return locks again (D423). */
const relockAfterSec = (c: LockConfig) => (c.onLeave ? c.askAfterSec : Math.max(c.askAfterSec, LONG_AWAY_SEC));

/**
 * Mounted once at the root, after the navigator, so it draws over every
 * screen. Renders nothing while the app is open and unlocked.
 */
export function AppLockGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  const g = useSyncExternalStore(subscribeGate, gateSnapshot, gateSnapshot);
  const name = useLockName();
  const available = lockAvailable();
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState ?? 'active');
  const [failed, setFailed] = useState(false);
  const backgroundAt = useRef<number | null>(null);
  const autoTried = useRef(false);
  const serverSeen = useRef(false);

  // The account's switches are the truth: mirror them as they arrive. The
  // first time they arrive in this process with the lock on — a reinstall, a
  // second phone — the lock engages, unless it has already been opened.
  const s = user?.settings;
  const faceId = s ? s.appLockFaceId === true : undefined;
  const onLeave = s ? s.appLockOnLeave === true : undefined;
  const hidePreviews = s ? s.hideSensitivePreviews !== false : undefined;
  useEffect(() => {
    if (faceId === undefined || onLeave === undefined || hidePreviews === undefined) return;
    const first = !serverSeen.current;
    serverSeen.current = true;
    void saveLockConfig({ faceId, onLeave, hidePreviews }).then(() => {
      if (first && faceId && !gate.unlockedOnce) engageLock();
    });
  }, [faceId, onLeave, hidePreviews]);

  // Signed out, nothing is behind the lock, and the next account starts clean.
  useEffect(() => {
    if (isLoaded && !isSignedIn) void clearLockConfig();
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      setAppState(next);
      // Android's PIN fallback is its own activity, so asking sends VICI to the
      // background for a moment; that trip is not leaving the app, and nor is
      // a system prompt VICI opened.
      if (gate.authenticating || promptExplains(next, gate.systemPrompts)) return;
      if (next === 'background') {
        if (backgroundAt.current == null) backgroundAt.current = Date.now();
        return;
      }
      if (next !== 'active') return;
      const away = backgroundAt.current;
      backgroundAt.current = null;
      const c = gate.config;
      if (away != null && c?.faceId && Date.now() - away >= relockAfterSec(c) * 1000) engageLock();
    });
    return () => sub.remove();
  }, []);

  const locked = available && g.engaged && !!g.config?.faceId;

  const unlock = async () => {
    const outcome = await authenticate('Unlock VICI');
    if (outcome === 'ok' || outcome === 'unavailable') {
      setFailed(false);
      releaseLock();
    } else {
      setFailed(outcome === 'failed');
    }
  };

  // Ask once, as soon as the lock is up in the foreground; after a cancel the
  // button asks again (Face ID's own sheet makes the app inactive and active
  // again, so asking on every return would loop).
  useEffect(() => {
    if (!locked) {
      autoTried.current = false;
      return;
    }
    if (!foreground(appState) || autoTried.current) return;
    autoTried.current = true;
    void unlock();
  });

  // Android's back button must not walk the screens under the lock.
  useEffect(() => {
    if (!locked || Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [locked]);

  // The first read of the mirror takes a few milliseconds; on a phone that can
  // lock, nothing is shown until it has said whether to.
  if (available && g.config === null) return <Cover />;
  if (locked) return <LockScreen name={name} failed={failed} onUnlock={() => void unlock()} />;
  // the web build has no app switcher to hide from
  const hide = Platform.OS !== 'web' && (g.config ?? DEFAULT_LOCK).hidePreviews;
  if (hide && !foreground(appState) && !g.authenticating && !promptExplains(appState, g.systemPrompts)) return <Cover laurel />;
  return null;
}

const LAYER = { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 1000 } as const;

/**
 * Over every screen: a sibling of the navigator, so `accessibilityViewIsModal`
 * keeps VoiceOver off the screens underneath too.
 */
function Layer({ children }: { children: ReactNode }) {
  return (
    <View accessibilityViewIsModal style={LAYER}>
      <Screen>{children}</Screen>
    </View>
  );
}

/** The privacy cover: the frame's ground, and the laurel the splash draws. */
function Cover({ laurel }: { laurel?: boolean }) {
  return (
    <Layer>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{laurel ? <LaurelMark size={120} /> : null}</View>
    </Layer>
  );
}

/**
 * The lock: Login's own board — the 104 laurel at canvas 150, the heading and
 * its line at 284 — and the pill at the frame's bottom 48.
 */
function LockScreen({ name, failed, onUnlock }: { name: LockName; failed: boolean; onUnlock: () => void }) {
  const line = failed ? 'That didn’t match. Try again.' : `Unlock with ${name} to carry on.`;
  return (
    <Layer>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 150, alignItems: 'center' }}>
          <LaurelMark size={104} />
        </View>
        <View style={{ position: 'absolute', left: 24, right: 24, top: 284, gap: 12, alignItems: 'center' }}>
          <MonoText v="h1" center accessibilityRole="header" style={{ alignSelf: 'stretch' }}>
            VICI is locked.
          </MonoText>
          <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
            {line}
          </MonoText>
        </View>
        <PrimaryButton label="Unlock" onPress={onUnlock} />
      </View>
    </Layer>
  );
}
